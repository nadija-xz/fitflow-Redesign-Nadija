import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './mainScreenStyles';
import { Workout } from './mainScreenTypes';

type Props = { workouts: Workout[]; loading: boolean; error: string; onRetry: () => void; onSelectWorkout: (workout: Workout) => void };

export default function WorkoutList({ workouts, loading, error, onRetry, onSelectWorkout }: Props) {
  return (<>

      {loading ? (

        <ActivityIndicator
          color="#079455"
          size="large"
          style={{
            marginVertical: 35,
          }}
        />

      ) : error ? (

        <View style={styles.empty}>

          <Ionicons
            name="cloud-offline-outline"
            size={34}
            color="#98A2B3"
          />

          <Text style={styles.emptyTitle}>
            Unable to load workouts
          </Text>

          <Text style={styles.mutedCenter}>
            {error}
          </Text>

          <Pressable
            onPress={() =>
              onRetry()
            }
            style={styles.retry}
          >

            <Text style={styles.greenText}>
              Try again
            </Text>

          </Pressable>

        </View>

      ) : workouts.length ? (

        workouts.map(
          workout => (

            <Pressable
              key={workout.id}
              onPress={() =>
                onSelectWorkout(
                  workout
                )
              }
              style={({ pressed }) => [
                styles.workout,
                pressed &&
                styles.pressed,
              ]}
            >

              <View
                style={
                  styles.workoutIcon
                }
              >

                <Ionicons
                  name="barbell"
                  size={22}
                  color="#079455"
                />

              </View>


              <View
                style={
                  styles.grow
                }
              >

                <Text
                  style={
                    styles.rowTitle
                  }
                >
                  {
                    workout.title
                  }
                </Text>

                <Text
                  style={
                    styles.small
                  }
                >
                  {
                    workout.duration
                  } min · {
                    workout.difficulty
                  }
                </Text>

              </View>


              <View
                style={
                  styles.chevronCircle
                }
              >

                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color="#667085"
                />

              </View>

            </Pressable>

          )
        )

      ) : (

        <Text style={styles.muted}>
          Your workouts will appear here when available.
        </Text>

      )}

    </>

  );
}
