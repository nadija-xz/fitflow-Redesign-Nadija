import HomeScreen from './HomeScreen';
import PlanScreen from './PlanScreen';
import ProgressScreen from './ProgressScreen';
import CommunityScreen from './CommunityScreen';
import NutritionScreen from './NutritionScreen';
import { styles } from './mainScreenStyles';
import { MainTab, Workout } from './mainScreenTypes';
import React, {
  useEffect,
  useState,
} from 'react';

import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  AuthUser,
} from '../services/auth';

import {
  apiRequest,
} from '../services/api';

import {
  goals,
} from './OnboardingScreen';


type Tab = MainTab;


type NavItem = {
  label:
  | 'Home'
  | 'Plan'
  | 'Progress'
  | 'Community'
  | 'Nutrition';

  icon:
  keyof typeof Ionicons.glyphMap;

  activeIcon:
  keyof typeof Ionicons.glyphMap;

  available: boolean;
};


const navItems: NavItem[] = [
  {
    label: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
    available: true,
  },

  {
    label: 'Plan',
    icon: 'calendar-outline',
    activeIcon: 'calendar',
    available: true,
  },

  {
    label: 'Progress',
    icon: 'stats-chart-outline',
    activeIcon: 'stats-chart',
    available: true,
  },

  {
    label: 'Community',
    icon: 'people-outline',
    activeIcon: 'people',
    available: true,
  },

  {
    label: 'Nutrition',
    icon: 'restaurant-outline',
    activeIcon: 'restaurant',
    available: true,
  },
];


export default function MainScreen({
  user,
  onSignOut,
}: {
  user: AuthUser;
  onSignOut: () => void;
}) {

  const [
    tab,
    setTab,
  ] = useState<Tab>('Home');


  const [
    workouts,
    setWorkouts,
  ] = useState<Workout[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState('');


  const [
    retry,
    setRetry,
  ] = useState(0);


  const [
    profile,
    setProfile,
  ] = useState(false);


  const [
    selected,
    setSelected,
  ] = useState<Workout | null>(null);


  const goal =
    goals.find(
      item =>
        item.value ===
        user.fitnessGoal
    );


  const rawName =
    user.name?.split(' ')[0] ||
    user.email.split('@')[0];

  const name =
    rawName.toLowerCase() === 'chandulajeewantha2003'
      ? 'nadijathinal'
      : rawName.charAt(0).toUpperCase() + rawName.slice(1);


  const hour =
    new Date().getHours();


  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
        ? 'Good afternoon'
        : 'Good evening';


  /* =========================================================
     LOAD WORKOUTS
  ========================================================= */

  useEffect(() => {

    let active = true;

    setLoading(true);

    setError('');


    apiRequest('/workouts')

      .then(async response => {

        if (!response.ok) {

          throw new Error(
            'Could not load workouts. Please try again.'
          );
        }


        const data =
          await response.json();


        if (!Array.isArray(data)) {

          throw new Error(
            'Could not load workouts. Please try again.'
          );
        }


        if (active) {

          setWorkouts(data);
        }

      })

      .catch(err => {

        if (active) {

          setError(
            err instanceof Error
              ? err.message
              : 'Could not load workouts.'
          );
        }

      })

      .finally(() => {

        if (active) {

          setLoading(false);
        }

      });


    return () => {

      active = false;

    };

  }, [retry]);


  /* =========================================================
     FEATURED WORKOUT
  ========================================================= */

  const featured =

    workouts.find(item =>

      user.fitnessGoal ===
        'build_strength'

        ? item.title.includes(
          'Strength'
        )

        : user.fitnessGoal ===
          'improve_endurance'

          ? item.title.includes(
            'Cardio'
          )

          : item.title.includes(
            'Full Body'
          )

    ) ?? workouts[0];


  /* =========================================================
     WORKOUT LIST
  ========================================================= */


  return (

    <SafeAreaView style={styles.safe}>


      {/* =================================================
                HEADER
            ================================================= */}

      <View style={styles.header}>

        <View style={styles.brandContainer}>

          <Image
            source={
              require(
                '../assets/icon.png'
              )
            }
            style={styles.brandIcon}
            resizeMode="contain"
          />


          <Text style={styles.brand}>

            <Text
              style={
                styles.brandDark
              }
            >
              Fit
            </Text>

            <Text
              style={
                styles.brandGreen
              }
            >
              Flow
            </Text>

          </Text>

        </View>


        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View your profile"
          onPress={() =>
            setProfile(true)
          }
          style={({ pressed }) => [
            styles.avatar,
            pressed &&
            styles.pressed,
          ]}
        >

          <Text
            style={
              styles.avatarText
            }
          >
            {
              name
                .slice(0, 1)
                .toUpperCase()
            }
          </Text>

        </Pressable>

      </View>


      {/* =================================================
                PAGE CONTENT
            ================================================= */}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >

        {tab === 'Home' && <HomeScreen name={name} greeting={greeting} goal={goal} featured={featured} onSelectWorkout={setSelected} onNavigate={setTab} />}
        <View style={{ display: tab === 'Plan' ? 'flex' : 'none' }}><PlanScreen key={user.id} userId={user.id} workouts={workouts} loading={loading} error={error} onRetry={() => setRetry(previous => previous + 1)} onSelectWorkout={setSelected} /></View>
        {tab === 'Progress' && <ProgressScreen user={user} />}
        {tab === 'Community' && <CommunityScreen user={user} />}
        {tab === 'Nutrition' && <NutritionScreen key={user.id} userId={user.id} />}

      </ScrollView>
      </KeyboardAvoidingView>


      {/* =================================================
                NEW ATTRACTIVE BOTTOM NAVIGATION
            ================================================= */}

      <View
        style={
          styles.navWrapper
        }
      >

        <View style={styles.nav}>

          {navItems.map(
            item => {

              const active =
                tab ===
                item.label;


              return (

                <Pressable
                  key={
                    item.label
                  }
                  disabled={
                    !item.available
                  }
                  onPress={() => {

                    if (
                      item.available
                    ) {

                      setTab(
                        item.label as Tab
                      );
                    }

                  }}
                  style={({
                    pressed,
                  }) => [
                      styles.navItem,

                      active &&
                      styles.navItemActive,

                      pressed &&
                      item.available &&
                      styles.navPressed,
                    ]}
                >

                  <View
                    style={[
                      styles.navIconContainer,

                      active &&
                      styles.navIconActive,
                    ]}
                  >

                    <Ionicons
                      name={
                        active
                          ? item.activeIcon
                          : item.icon
                      }
                      size={
                        active
                          ? 22
                          : 21
                      }
                      color={
                        active
                          ? '#FFFFFF'
                          : '#98A2B3'
                      }
                    />

                  </View>


                  <Text
                    numberOfLines={1}
                    style={[
                      styles.navLabel,

                      active &&
                      styles.navLabelActive,

                      !item.available &&
                      styles.navDisabled,
                    ]}
                  >
                    {
                      item.label
                    }
                  </Text>


                  {!item.available && (

                    <View
                      style={
                        styles.soonBadge
                      }
                    >
                      <Text
                        style={
                          styles.soonText
                        }
                      >
                        SOON
                      </Text>
                    </View>

                  )}

                </Pressable>

              );

            }
          )}

        </View>

      </View>


      {/* =================================================
                PROFILE / WORKOUT MODAL
            ================================================= */}

      <Modal
        visible={
          profile ||
          !!selected
        }
        transparent
        animationType="slide"
        onRequestClose={() => {

          setProfile(false);

          setSelected(null);

        }}
      >

        <View style={styles.overlay}>

          <View style={styles.sheet}>

            <View
              style={
                styles.sheetHandle
              }
            />


            <Pressable
              onPress={() => {

                setProfile(false);

                setSelected(null);

              }}
              style={
                styles.close
              }
            >

              <Ionicons
                name="close"
                size={24}
                color="#344054"
              />

            </Pressable>


            {profile ? (

              <>

                <View
                  style={
                    styles.profileAvatar
                  }
                >

                  <Text
                    style={
                      styles.profileAvatarText
                    }
                  >
                    {
                      name
                        .slice(
                          0,
                          1
                        )
                        .toUpperCase()
                    }
                  </Text>

                </View>


                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  {name}
                </Text>

                <Text
                  style={
                    styles.modalEmail
                  }
                >
                  {
                    user.email
                  }
                </Text>


                <View
                  style={
                    styles.profileSummary
                  }
                >

                  <Text
                    style={
                      styles.focusLabel
                    }
                  >
                    YOUR GOAL
                  </Text>

                  <Text
                    style={
                      styles.rowTitle
                    }
                  >
                    {
                      goal?.title ??
                      'Fitness journey'
                    }
                  </Text>

                  <Text
                    style={
                      styles.small
                    }
                  >
                    {user.age} years · {user.height} cm · {user.weight} kg
                  </Text>

                </View>


                <Pressable
                  onPress={
                    onSignOut
                  }
                  style={
                    styles.logout
                  }
                >

                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color="#D92D20"
                  />

                  <Text
                    style={
                      styles.logoutText
                    }
                  >
                    Sign out
                  </Text>

                </Pressable>

              </>

            ) : (

              <>

                <View
                  style={
                    styles.modalWorkoutIcon
                  }
                >

                  <Ionicons
                    name="barbell"
                    size={30}
                    color="#079455"
                  />

                </View>


                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  {
                    selected?.title
                  }
                </Text>

                <Text
                  style={
                    styles.modalEmail
                  }
                >
                  {selected?.duration} minutes · {selected?.difficulty}
                </Text>


                <Text
                  style={
                    styles.modalDescription
                  }
                >
                  Guided exercises and workout tracking will be available in a future update.
                </Text>

              </>

            )}

          </View>

        </View>

      </Modal>

    </SafeAreaView>
  );
}
