import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './mainScreenStyles';
import { AuthUser } from '../services/auth';
import { goals } from './OnboardingScreen';

export default function ProgressScreen({ user }: { user: AuthUser }) {
  const goal = goals.find(item => item.value === user.fitnessGoal);
  return (
<>

            <Text
              style={
                styles.pageTitle
              }
            >
              Your progress
            </Text>

            <Text
              style={
                styles.muted
              }
            >
              Your starting profile and fitness journey.
            </Text>


            <View
              style={
                styles.profileDetails
              }
            >

              {[
                [
                  'Age',
                  `${user.age ?? '—'} years`,
                ],

                [
                  'Height',
                  `${user.height ?? '—'} cm`,
                ],

                [
                  'Weight',
                  `${user.weight ?? '—'} kg`,
                ],

                [
                  'Goal',
                  goal?.title ??
                  'Not selected',
                ],

              ].map(
                ([
                  label,
                  value,
                ]) => (

                  <View
                    key={
                      label
                    }
                    style={
                      styles.detailRow
                    }
                  >

                    <Text
                      style={
                        styles.muted
                      }
                    >
                      {
                        label
                      }
                    </Text>

                    <Text
                      style={
                        styles.rowTitle
                      }
                    >
                      {
                        value
                      }
                    </Text>

                  </View>

                ))}
            </View>
          </>
  );
}
