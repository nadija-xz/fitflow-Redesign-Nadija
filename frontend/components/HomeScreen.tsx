import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './mainScreenStyles';
import { goals } from './OnboardingScreen';
import { Workout, MainTab } from './mainScreenTypes';

type Props = {
  name: string;
  greeting: string;
  goal: (typeof goals)[number] | undefined;
  featured: Workout | undefined;
  onSelectWorkout: (workout: Workout) => void;
  onNavigate: (tab: MainTab) => void;
};

export default function HomeScreen({ name, greeting, goal, featured, onSelectWorkout, onNavigate }: Props) {
  return (
<>

            {/* Greeting */}

            <View
              style={
                styles.greetingRow
              }
            >

              <View>

                <Text
                  style={
                    styles.greeting
                  }
                >
                  {greeting}, {name} 👋
                </Text>

                <Text
                  style={
                    styles.muted
                  }
                >
                  Ready for today?
                </Text>

              </View>

            </View>


            {/* =====================================
                            DAILY FLOW CARD
                        ====================================== */}

            <View style={styles.hero}>

              <View
                style={
                  styles.heroCircleOne
                }
              />

              <View
                style={
                  styles.heroCircleTwo
                }
              />


              <View
                style={
                  styles.heroRow
                }
              >

                <View
                  style={
                    styles.grow
                  }
                >

                  <View
                    style={
                      styles.aiBadge
                    }
                  >

                    <Ionicons
                      name="sparkles"
                      size={13}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.heroLabel
                      }
                    >
                      AI DAILY FLOW
                    </Text>

                  </View>


                  <Text
                    style={
                      styles.heroTitle
                    }
                  >

                    {featured
                      ? `${featured.duration} min ${featured.title.replace(
                        ' Workout',
                        ''
                      )}`
                      : 'Make time for you'
                    }

                  </Text>


                  <Text
                    style={
                      styles.heroDescription
                    }
                  >

                    {goal
                      ? `Adapted to your ${goal.title.toLowerCase()} goal`
                      : 'A workout designed around you.'
                    }

                  </Text>

                </View>


                <View
                  style={
                    styles.heroIcon
                  }
                >

                  <Ionicons
                    name="barbell"
                    size={36}
                    color="#FFFFFF"
                  />

                </View>

              </View>


              <Pressable
                onPress={() =>
                  featured
                    ? onSelectWorkout(
                      featured
                    )
                    : onNavigate(
                      'Plan'
                    )
                }
                style={({ pressed }) => [
                  styles.start,
                  pressed &&
                  styles.pressed,
                ]}
              >

                <Ionicons
                  name="play"
                  size={17}
                  color="#067647"
                />

                <Text
                  style={
                    styles.startText
                  }
                >

                  {featured
                    ? 'START WORKOUT'
                    : 'EXPLORE WORKOUTS'
                  }

                </Text>

              </Pressable>

            </View>


            {/* slider dots */}

            <View style={styles.dots}>

              <View
                style={
                  styles.dotActive
                }
              />

              <View
                style={
                  styles.dot
                }
              />

              <View
                style={
                  styles.dot
                }
              />

            </View>


            {/* =====================================
                            STATS
                        ====================================== */}

            <View style={styles.stats}>

              {[
                {
                  label:
                    'Workouts',
                  value:
                    '0',
                  icon:
                    'barbell-outline' as const,
                },

                {
                  label:
                    'Streak',
                  value:
                    '0 days',
                  icon:
                    'flame-outline' as const,
                },

                {
                  label:
                    'Calories',
                  value:
                    '—',
                  icon:
                    'flash-outline' as const,
                },

              ].map(
                item => (

                  <View
                    key={
                      item.label
                    }
                    style={
                      styles.stat
                    }
                  >

                    <View
                      style={
                        styles.statIcon
                      }
                    >

                      <Ionicons
                        name={
                          item.icon
                        }
                        size={17}
                        color="#079455"
                      />

                    </View>


                    <Text
                      style={
                        styles.statLabel
                      }
                    >
                      {
                        item.label
                      }
                    </Text>

                    <Text
                      style={
                        styles.statValue
                      }
                    >
                      {
                        item.value
                      }
                    </Text>

                  </View>

                )
              )}

            </View>


            {/* =====================================
                            QUICK ACTIONS
                        ====================================== */}

            <View
              style={
                styles.sectionHeader
              }
            >

              <Text
                style={
                  styles.section
                }
              >
                Quick actions
              </Text>

              <Text
                style={
                  styles.sectionLink
                }
              >
                See all
              </Text>

            </View>


            {/* WORKOUT */}

            <Pressable
              onPress={() =>
                onNavigate('Plan')
              }
              style={({ pressed }) => [
                styles.action,
                pressed &&
                styles.pressed,
              ]}
            >

              <View
                style={
                  styles.actionIcon
                }
              >

                <Ionicons
                  name="barbell"
                  size={21}
                  color="#FFFFFF"
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
                  Log Workout
                </Text>

                <Text
                  style={
                    styles.small
                  }
                >
                  Track today's activity
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


            {/* MEAL */}

            <View style={styles.action}>

              <View
                style={
                  styles.actionIcon
                }
              >

                <Ionicons
                  name="restaurant"
                  size={20}
                  color="#FFFFFF"
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
                  Log Meal
                </Text>

                <Text
                  style={
                    styles.small
                  }
                >
                  Nutrition tracking coming soon
                </Text>

              </View>


              <Ionicons
                name="chevron-forward"
                size={18}
                color="#98A2B3"
              />

            </View>


            {/* CHALLENGE */}

            <View style={styles.action}>

              <View
                style={
                  styles.actionIcon
                }
              >

                <Ionicons
                  name="trophy"
                  size={20}
                  color="#FFFFFF"
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
                  Join Challenge
                </Text>

                <Text
                  style={
                    styles.small
                  }
                >
                  Community challenges coming soon
                </Text>

              </View>


              <Ionicons
                name="chevron-forward"
                size={18}
                color="#98A2B3"
              />

            </View>


            {/* =====================================
                            GOAL CARD
                        ====================================== */}

            <View style={styles.focus}>

              <View
                style={
                  styles.focusIcon
                }
              >

                <Ionicons
                  name="flag"
                  size={21}
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
                    styles.focusLabel
                  }
                >
                  YOUR FITNESS GOAL
                </Text>

                <Text
                  style={
                    styles.focusTitle
                  }
                >
                  {
                    goal?.title ??
                    'Build a healthy routine'
                  }
                </Text>

                <Text
                  style={
                    styles.small
                  }
                >
                  Keep going. Small steps create big progress.
                </Text>

              </View>

            </View>

          </>
  );
}
