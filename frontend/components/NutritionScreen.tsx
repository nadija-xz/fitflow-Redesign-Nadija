import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { dateKey, emptyNutrition, loadNutrition, Meal, MealType, mealTypes, NutritionLog, nutritionTotals, saveNutrition } from '../services/nutrition';

const thumbnails = {
  Breakfast: require('../assets/meals/breakfast.jpg'),
  Lunch: require('../assets/meals/lunch.jpg'),
  Snack: require('../assets/meals/snack.jpg'),
  Dinner: require('../assets/meals/lunch.jpg'),
};
const emptyForm = () => ({ name: '', calories: '', protein: '', carbs: '', fat: '' });

export default function NutritionScreen({ userId }: { userId: string }) {
  const [log, setLog] = useState<NutritionLog>(emptyNutrition);
  const [period, setPeriod] = useState<'today' | 'week'>('today');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [settings, setSettings] = useState(false);
  const [goal, setGoal] = useState('2200');
  const [type, setType] = useState<MealType>('Breakfast');
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [expanded, setExpanded] = useState<MealType | null>(null);
  const lock = useRef(false);
  useEffect(() => {
    let active = true;
    loadNutrition(userId).then(value => { if (active) { setLog(value); setGoal(String(value.goal)); } })
      .catch(() => { if (active) setError('Could not load your meals. Please reopen Nutrition to try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId]);

  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const todayKey = dateKey(today);
  const meals = log.meals.filter(meal => period === 'today' ? meal.date === todayKey : meal.date >= dateKey(start) && meal.date <= todayKey);
  const totals = nutritionTotals(meals);
  const target = log.goal * (period === 'today' ? 1 : ((today.getDay() + 6) % 7) + 1);
  const progress = Math.min(100, (totals.calories / target) * 100);
  async function commit(next: NutritionLog) {
    if (lock.current) return false;
    lock.current = true;
    setSaving(true);
    setError('');
    try { await saveNutrition(userId, next); setLog(next); return true; }
    catch { setError('Could not save your changes. Please try again.'); return false; }
    finally { lock.current = false; setSaving(false); }
  }
  function openEntry(mealType: MealType = 'Breakfast') {
    setType(mealType); setForm(emptyForm()); setPhoto(null); setEditing(true); setSettings(false); setError('');
  }
  async function addMeal() {
    const numbers = { calories: Number(form.calories), protein: Number(form.protein || 0), carbs: Number(form.carbs || 0), fat: Number(form.fat || 0) };
    if (!form.name.trim() || !form.calories.trim() || numbers.calories <= 0 || numbers.calories > 10000 || Object.values(numbers).some(value => !Number.isFinite(value) || value < 0 || value > 10000)) {
      setError('Enter a meal name and calories between 1 and 10,000. Macros must be valid, nonnegative numbers.'); return;
    }
    const meal: Meal = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, date: todayKey, type, name: form.name.trim(), ...numbers };
    if (await commit({ ...log, meals: [...log.meals, meal] })) { setEditing(false); setPhoto(null); setPeriod('today'); }
  }
  async function scan() {
    if (scanning) return;
    setScanning(true); setError('');
    try {
      if (Platform.OS !== 'web') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) { setError('Allow camera access to photograph your meal, or use manual entry.'); return; }
      }
      const result = Platform.OS === 'web'
        ? await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 })
        : await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 });
      if (!result.canceled) { openEntry(); setPhoto(result.assets[0].uri); }
    } catch { setError('Could not open the camera or photo picker. You can add your meal manually.'); }
    finally { setScanning(false); }
  }

  return (
    <>
      <View style={s.header}>
        <Text style={s.title}>Nutrition</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Set calorie goal" accessibilityState={{ expanded: settings }} disabled={loading || saving} onPress={() => { setSettings(value => !value); setEditing(false); }} style={s.iconButton}><Ionicons name="list" size={24} color="#101828" /></Pressable>
      </View>
      {loading ? <ActivityIndicator color="#079455" style={{ marginTop: 32 }} /> : <>
        <View accessibilityRole="tablist" style={s.tabs}>
          {(['today', 'week'] as const).map(value => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: period === value }} onPress={() => setPeriod(value)} style={[s.tab, period === value && s.activeTab]}><Text style={[s.tabText, period === value && s.white]}>{value === 'today' ? 'Today' : 'This week'}</Text></Pressable>)}
        </View>
        {settings && <View style={s.form}>
          <Text style={s.formTitle}>Daily calorie goal</Text>
          <Text style={s.secondary}>Choose your own target. The starting value is 2,200 kcal.</Text>
          <TextInput accessibilityLabel="Daily calorie goal in kcal" keyboardType="number-pad" value={goal} onChangeText={setGoal} editable={!saving} style={s.input} />
          <Pressable accessibilityRole="button" disabled={saving} onPress={async () => {
            const value = Number(goal);
            if (!Number.isInteger(value) || value < 1 || value > 20000) { setError('Enter a calorie goal between 1 and 20,000.'); return; }
            if (await commit({ ...log, goal: value })) setSettings(false);
          }} style={s.primary}><Text style={s.primaryText}>{saving ? 'Saving…' : 'Save goal'}</Text></Pressable>
        </View>}
        <Text style={s.calories}>{Math.round(totals.calories).toLocaleString()} / {target.toLocaleString()} kcal</Text>
        <View accessibilityRole="progressbar" accessibilityLabel="Calorie goal progress" accessibilityValue={{ min: 0, max: target, now: Math.min(target, totals.calories), text: `${Math.round(totals.calories)} of ${target} kcal` }} style={s.track}><View style={[s.fill, { width: `${progress}%` }]} /></View>
        <View style={s.macros}>{(['protein', 'carbs', 'fat'] as const).map(field => <Text key={field} style={s.macro}>{field.charAt(0).toUpperCase() + field.slice(1)} {Math.round(totals[field])}g</Text>)}</View>
        {period === 'week' && <Text style={s.secondary}>Monday through today · {meals.length} meals logged</Text>}
        <Pressable accessibilityRole="button" disabled={scanning || saving} onPress={scan} style={({ pressed }) => [s.scan, pressed && s.pressed]}>
          {scanning ? <ActivityIndicator color="#079455" /> : <Ionicons name="camera" size={36} color="#079455" />}
          <View><Text style={s.scanTitle}>Scan Your Meal</Text><Text style={s.secondary}>Review before saving</Text></View>
        </Pressable>
        <View style={s.meals}>
          {mealTypes.filter(mealType => mealType !== 'Dinner' || meals.some(meal => meal.type === 'Dinner')).map(mealType => {
            const entries = meals.filter(meal => meal.type === mealType);
            return <View key={mealType}>
              <Pressable accessibilityRole="button" accessibilityLabel={`${mealType}, ${Math.round(nutritionTotals(entries).calories)} kcal. ${entries.length ? 'View meals' : 'Add meal'}`} onPress={() => entries.length ? setExpanded(expanded === mealType ? null : mealType) : openEntry(mealType)} style={s.mealRow}>
                <Image source={thumbnails[mealType]} style={s.thumbnail} />
                <Text style={s.mealName}>{mealType}</Text>
                <Text style={s.mealCalories}>{Math.round(nutritionTotals(entries).calories).toLocaleString()} kcal</Text>
              </Pressable>
              {expanded === mealType && entries.map(meal => <View key={meal.id} style={s.detail}>
                <View style={{ flex: 1 }}><Text style={s.detailName}>{meal.name}</Text><Text style={s.secondary}>{meal.calories} kcal · P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g{period === 'week' ? ` · ${meal.date}` : ''}</Text></View>
                <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${meal.name}`} disabled={saving} onPress={() => void commit({ ...log, meals: log.meals.filter(item => item.id !== meal.id) })} style={s.iconButton}><Ionicons name="trash-outline" size={19} color="#B42318" /></Pressable>
              </View>)}
            </View>;
          })}
        </View>
        {!editing && <Pressable accessibilityRole="button" disabled={saving} onPress={() => openEntry()} style={({ pressed }) => [s.primary, pressed && s.pressed]}><Text style={s.primaryText}>Add Manual Entry</Text></Pressable>}
        {editing && <View style={s.form}>
          <View style={s.header}><Text style={s.formTitle}>{photo ? 'Review your meal' : 'Add a meal'}</Text><Pressable accessibilityRole="button" accessibilityLabel="Cancel meal entry" disabled={saving} onPress={() => setEditing(false)} style={s.iconButton}><Ionicons name="close" size={22} color="#667085" /></Pressable></View>
          {photo && <><Image source={{ uri: photo }} style={s.photo} /><Text style={s.secondary}>Enter nutrition values from your meal or food label. Photo recognition is not connected yet.</Text></>}
          <View style={s.categories}>{mealTypes.map(mealType => <Pressable key={mealType} accessibilityRole="button" accessibilityState={{ selected: type === mealType }} disabled={saving} onPress={() => setType(mealType)} style={[s.category, type === mealType && s.selectedCategory]}><Text style={[s.categoryText, type === mealType && s.green]}>{mealType}</Text></Pressable>)}</View>
          <Text style={s.label}>Meal name</Text><TextInput accessibilityLabel="Meal name" placeholder="e.g. Rice and vegetables" placeholderTextColor="#667085" maxLength={80} value={form.name} editable={!saving} onChangeText={name => setForm(previous => ({ ...previous, name }))} style={s.input} />
          <View style={s.fields}>{(['calories', 'protein', 'carbs', 'fat'] as const).map(field => <View key={field} style={s.field}><Text style={s.label}>{field === 'calories' ? 'Calories (kcal)' : `${field.charAt(0).toUpperCase() + field.slice(1)} (g)`}</Text><TextInput accessibilityLabel={field} keyboardType="decimal-pad" placeholder={field === 'calories' ? 'Required' : '0'} placeholderTextColor="#667085" maxLength={7} value={form[field]} editable={!saving} onChangeText={value => setForm(previous => ({ ...previous, [field]: value }))} style={s.input} /></View>)}</View>
          <Pressable accessibilityRole="button" disabled={saving} onPress={addMeal} style={[s.primary, saving && s.pressed]}>{saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={s.primaryText}>Save meal</Text>}</Pressable>
        </View>}
        {!!error && <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text>}
        <Text style={s.storage}>Meals are saved on this device.</Text>
      </>}
    </>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: '#101828' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: '#F2F4F7', borderRadius: 24, marginTop: 22 },
  tab: { flex: 1, minHeight: 44, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  activeTab: { backgroundColor: '#008F50' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#475467' },
  white: { color: '#FFFFFF' },
  calories: { fontSize: 22, fontWeight: '800', color: '#101828', marginTop: 24, marginBottom: 16 },
  track: { height: 14, backgroundColor: '#EAECF0', borderRadius: 7, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#30A46C', borderRadius: 7 },
  macros: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F2F4F7' },
  macro: { fontSize: 13, fontWeight: '500', color: '#667085' },
  scan: { flexDirection: 'row', gap: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2F4F7', borderRadius: 14, minHeight: 92, marginTop: 18, padding: 16 },
  scanTitle: { fontSize: 16, fontWeight: '800', color: '#101828', marginBottom: 4 },
  secondary: { fontSize: 12, lineHeight: 18, color: '#667085' },
  meals: { marginTop: 12 },
  mealRow: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 78, borderBottomWidth: 1, borderBottomColor: '#F2F4F7' },
  thumbnail: { width: 48, height: 48, borderRadius: 12 },
  mealName: { flex: 1, color: '#101828', fontWeight: '700', fontSize: 15 },
  mealCalories: { fontSize: 14, fontWeight: '600', color: '#344054' },
  primary: { backgroundColor: '#008F50', borderRadius: 14, minHeight: 52, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  form: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#EAECF0' },
  formTitle: { fontSize: 18, color: '#101828', fontWeight: '800' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 16 },
  category: { paddingHorizontal: 12, minHeight: 44, justifyContent: 'center', borderRadius: 12, backgroundColor: '#F2F4F7' },
  selectedCategory: { backgroundColor: '#E7F8ED' },
  categoryText: { fontSize: 12, fontWeight: '700', color: '#475467' },
  green: { color: '#067647' },
  label: { fontSize: 12, fontWeight: '600', color: '#344054', marginTop: 10, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 12, minHeight: 48, paddingHorizontal: 12, paddingVertical: 10, color: '#101828', fontSize: 14 },
  fields: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  field: { flexGrow: 1, flexBasis: '45%' },
  photo: { height: 170, width: '100%', borderRadius: 14, marginVertical: 12 },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingLeft: 12 },
  detailName: { fontSize: 14, fontWeight: '600', color: '#101828', marginBottom: 4 },
  pressed: { opacity: 0.65 },
  error: { marginTop: 12, color: '#B42318', fontSize: 13, lineHeight: 19 },
  storage: { fontSize: 11, color: '#667085', marginTop: 12 },
});
