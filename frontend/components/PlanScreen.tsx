import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './mainScreenStyles';
import WorkoutList from './WorkoutList';
import { Workout } from './mainScreenTypes';

type Props = { userId: string; workouts: Workout[]; loading: boolean; error: string; onRetry: () => void; onSelectWorkout: (workout: Workout) => void };
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
type Entry = { day: string; workout: Workout | null };

export default function PlanScreen(props: Props) {
  const [plan, setPlan] = useState<Entry[]>(days.map(day => ({ day, workout: null })));
  const [dayIndex, setDayIndex] = useState(0);
  const [restoring, setRestoring] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState('');
  const key = `fitflow_plan_${encodeURIComponent(props.userId).replace(/%/g, '_')}`;
  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const raw = Platform.OS === 'web' ? localStorage.getItem(key) : await SecureStore.getItemAsync(key);
        if (raw) {
          const data = JSON.parse(raw);
          if (!Array.isArray(data) || data.length !== 7 || !data.every((entry, index) => entry.day === days[index] && (entry.workout === null || (typeof entry.workout?.id === 'number' && typeof entry.workout.title === 'string' && typeof entry.workout.difficulty === 'string' && Number.isInteger(entry.workout.duration) && entry.workout.duration >= 5 && entry.workout.duration <= 120)))) throw new Error('Invalid plan');
          if (active) setPlan(data);
        }
      } catch { if (active) setMessage('Could not load your saved plan. Create and save a new one.'); }
      finally { if (active) setRestoring(false); }
    }
    restore();
    return () => { active = false; };
  }, [key]);
  const selected = plan[dayIndex];
  const workoutDays = plan.filter(entry => entry.workout).length;
  function update(workout: Workout | null) {
    if (saving) return;
    setPlan(previous => previous.map((entry, index) => index === dayIndex ? { ...entry, workout } : entry));
    setDirty(true);
    setMessage('');
  }
  async function save() {
    if (saving || !dirty) return;
    setSaving(true);
    try {
      const value = JSON.stringify(plan);
      if (Platform.OS === 'web') localStorage.setItem(key, value);
      else await SecureStore.setItemAsync(key, value);
      setDirty(false);
      setMessage('Your weekly plan is saved on this device.');
    } catch { setMessage('Could not save your plan. Please try again.'); }
    finally { setSaving(false); }
  }
  return (
    <>
      <Text style={styles.pageTitle}>Your workout plan</Text>
      <Text style={styles.muted}>Choose your workout days and make this week yours.</Text>
      {restoring ? <ActivityIndicator color="#079455" style={{ marginTop: 24 }} /> : <>
        <View style={local.summary}>
          <Text style={styles.rowTitle}>{workoutDays} workout days · {7 - workoutDays} rest days</Text>
          <Text style={styles.small}>{plan.reduce((total, entry) => total + (entry.workout?.duration ?? 0), 0)} minutes planned this week</Text>
        </View>
        <View accessibilityRole="tablist" style={local.days}>
          {plan.map((entry, index) => <Pressable key={entry.day} accessibilityRole="tab" accessibilityLabel={`${entry.day}, ${entry.workout?.title ?? 'Rest day'}`} accessibilityState={{ selected: index === dayIndex, disabled: saving }} disabled={saving} onPress={() => setDayIndex(index)} style={[local.day, index === dayIndex && local.active]}>
            <Text style={[local.dayLabel, index === dayIndex && local.white]}>{entry.day.slice(0, 3)}</Text>
            <Ionicons name={entry.workout ? 'barbell-outline' : 'leaf-outline'} size={18} color={index === dayIndex ? '#FFFFFF' : '#067647'} />
          </Pressable>)}
        </View>
        <Text style={[styles.section, { marginTop: 24 }]}>{selected.day}</Text>
        <View style={local.assignment}>
          <Text style={styles.rowTitle}>{selected.workout?.title ?? 'Rest day'}</Text>
          <Text style={styles.small}>{selected.workout?.difficulty ?? 'Time to recover. Choose a workout below to train today.'}</Text>
          {selected.workout && <>
            <View style={local.duration}>
              <Text style={styles.muted}>Duration</Text>
              <View style={local.controls}>
                {([-5, 5] as const).map(change => <React.Fragment key={change}>
                  {change === 5 && <Text style={styles.rowTitle}>{selected.workout!.duration} min</Text>}
                  <Pressable accessibilityRole="button" accessibilityLabel={change < 0 ? 'Reduce duration by five minutes' : 'Increase duration by five minutes'} disabled={saving || selected.workout!.duration + change < 5 || selected.workout!.duration + change > 120} onPress={() => update({ ...selected.workout!, duration: selected.workout!.duration + change })} style={[local.adjust, (saving || selected.workout!.duration + change < 5 || selected.workout!.duration + change > 120) && local.disabled]}>
                    <Ionicons name={change < 0 ? 'remove' : 'add'} size={20} color="#067647" />
                  </Pressable>
                </React.Fragment>)}
              </View>
            </View>
            <View style={local.controls}>
              <Pressable accessibilityRole="button" disabled={saving} onPress={() => props.onSelectWorkout(selected.workout!)} style={local.textButton}><Text style={styles.greenText}>View workout</Text></Pressable>
              <Pressable accessibilityRole="button" disabled={saving} onPress={() => update(null)} style={local.textButton}><Text style={styles.greenText}>Set as rest day</Text></Pressable>
            </View>
          </>}
        </View>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: saving || !dirty }} disabled={saving || !dirty} onPress={save} style={[local.save, (saving || !dirty) && local.disabled]}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Ionicons name="checkmark-outline" size={20} color="#FFFFFF" />}
          <Text style={local.saveLabel}>{saving ? 'Saving…' : 'Save weekly plan'}</Text>
        </Pressable>
        <Text accessibilityLiveRegion="polite" style={styles.small}>{message || (dirty ? 'You have unsaved changes.' : 'Plans are saved on this device.')}</Text>
        <Text style={[styles.section, { marginTop: 28, marginBottom: 4 }]}>Choose a workout</Text>
        <Text style={[styles.muted, { marginBottom: 16 }]}>Tap a workout to add it to {selected.day}.</Text>
        <View pointerEvents={saving ? 'none' : 'auto'}>
          <WorkoutList {...props} onSelectWorkout={workout => update({ ...workout, duration: Math.max(5, Math.min(120, Math.round(workout.duration))) })} />
        </View>
      </>}
    </>
  );
}
const local = StyleSheet.create({
  summary: { marginTop: 24, marginBottom: 18 },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  day: { flexGrow: 1, minWidth: 38, minHeight: 64, borderRadius: 12, backgroundColor: '#E7F8ED', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 6 },
  active: { backgroundColor: '#079455' },
  dayLabel: { fontSize: 12, fontWeight: '700', color: '#067647' },
  white: { color: '#FFFFFF' },
  assignment: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EAECF0' },
  duration: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, gap: 12 },
  controls: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  adjust: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#E7F8ED', alignItems: 'center', justifyContent: 'center' },
  textButton: { minHeight: 44, justifyContent: 'center', marginTop: 8 },
  save: { marginTop: 20, minHeight: 50, borderRadius: 14, backgroundColor: '#079455', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  saveLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  disabled: { opacity: 0.5 },
});

