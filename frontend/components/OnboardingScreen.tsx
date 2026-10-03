import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  BackHandler,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  completeOnboarding,
  FitnessGoal,
} from '../services/auth';


/* =========================================================
   GOALS
========================================================= */

export const goals: {
  value: FitnessGoal;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  image: ImageSourcePropType;
}[] = [
    {
      value: 'lose_weight',
      title: 'Lose Weight',
      description: 'Burn fat and get leaner',
      icon: 'flame',
      image: require('../assets/lossweight.png'),
    },

    {
      value: 'build_strength',
      title: 'Build Strength',
      description: 'Get stronger and fitter',
      icon: 'barbell',
      image: require('../assets/buildstrength.png'),
    },

    {
      value: 'improve_endurance',
      title: 'Improve Endurance',
      description: 'Boost stamina and energy',
      icon: 'walk',
      image: require('../assets/improveendurance.png'),
    },
  ];


/* =========================================================
   STEPS
========================================================= */

const steps = [
  {
    title: "What's your age?",
    description:
      'This helps us create a plan that fits you.',
    image: require('../assets/age.png'),
    unit: 'years',
    min: 13,
    max: 120,
  },

  {
    title: "What's your height?",
    description:
      'This helps us calculate your BMI\nand personalize your plan.',
    image: require('../assets/height.png'),
    unit: 'cm',
    min: 80,
    max: 250,
  },

  {
    title: "What's your weight?",
    description:
      'Helps us track your progress\naccurately.',
    image: require('../assets/weight.png'),
    unit: 'kg',
    min: 20,
    max: 350,
  },
];


/* =========================================================
   MAIN SCREEN
========================================================= */

export default function OnboardingScreen({
  user,
  onComplete,
}: {
  user: AuthUser;
  onComplete: (user: AuthUser) => void;
  onSignOut: () => void;
}) {

  const [
    step,
    setStep,
  ] = useState(0);


  const [
    values,
    setValues,
  ] = useState([
    String(user.age ?? 24),
    String(user.height ?? 170),
    String(user.weight ?? 65),
  ]);


  const [
    goal,
    setGoal,
  ] = useState<FitnessGoal | undefined>(
    user.fitnessGoal
  );


  const [
    error,
    setError,
  ] = useState('');


  const [
    saving,
    setSaving,
  ] = useState(false);


  const submitting =
    useRef(false);


  const current =
    steps[step];


  /* =====================================================
     ANDROID HARDWARE BACK BUTTON
  ===================================================== */

  useEffect(() => {

    const subscription =
      BackHandler.addEventListener(
        'hardwareBackPress',
        () => {

          if (
            !saving &&
            step > 0
          ) {
            setStep(
              previous =>
                previous - 1
            );

            setError('');
          }

          return true;
        },
      );


    return () =>
      subscription.remove();

  }, [step, saving]);


  /* =====================================================
     CHANGE VALUE
  ===================================================== */

  function change(
    value: string,
  ) {

    setValues(previous =>
      previous.map(
        (old, index) =>
          index === step
            ? value
            : old
      )
    );

    setError('');
  }


  /* =====================================================
     INCREASE / DECREASE
  ===================================================== */

  function decreaseValue() {

    if (!current) {
      return;
    }

    const existing =
      Number(values[step]) ||
      current.min;

    const updated =
      Math.max(
        current.min,
        existing - 1
      );

    change(
      String(updated)
    );
  }


  function increaseValue() {

    if (!current) {
      return;
    }

    const existing =
      Number(values[step]) ||
      current.min;

    const updated =
      Math.min(
        current.max,
        existing + 1
      );

    change(
      String(updated)
    );
  }


  /* =====================================================
     NEXT
  ===================================================== */

  async function next() {

    if (
      submitting.current
    ) {
      return;
    }


    /* AGE / HEIGHT / WEIGHT */

    if (step < 3) {

      const value =
        Number(values[step]);


      if (
        !values[step].trim() ||
        !Number.isFinite(value) ||
        value < current.min ||
        value > current.max ||
        (
          step === 0 &&
          !Number.isInteger(value)
        )
      ) {

        setError(
          `Enter ${step === 0
            ? 'a whole number'
            : 'a number'
          } between ${current.min
          } and ${current.max
          } ${current.unit
          }.`
        );

        return;
      }


      setError('');

      setStep(
        previous =>
          previous + 1
      );

      return;
    }


    /* GOAL */

    if (!goal) {

      setError(
        'Choose your primary fitness goal to continue.'
      );

      return;
    }


    submitting.current = true;

    setSaving(true);

    setError('');


    try {

      const updated =
        await completeOnboarding({
          age:
            Number(
              values[0]
            ),

          height:
            Number(
              values[1]
            ),

          weight:
            Number(
              values[2]
            ),

          fitnessGoal:
            goal,
        });


      onComplete(
        updated
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : 'Could not save your profile. Please try again.'
      );

    } finally {

      submitting.current =
        false;

      setSaving(false);
    }
  }


  return (

    <SafeAreaView style={styles.safe}>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        {/* =====================================
                    TOP PROGRESS
                ====================================== */}

        <View style={styles.top}>

          <View style={styles.track}>

            <View
              style={[
                styles.fill,

                {
                  width:
                    `${(
                      step + 1
                    ) * 25}%`,
                },
              ]}
            />

          </View>


          <Text style={styles.stepText}>
            Step {step + 1} of 4
          </Text>

        </View>


        {/* =====================================
                    CONTENT
                ====================================== */}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.content
          }
        >

          <Text style={styles.title}>
            {
              current?.title ??
              "What's your goal?"
            }
          </Text>


          <Text style={styles.description}>
            {
              current?.description ??
              'Choose your primary fitness goal.'
            }
          </Text>


          {/* =================================
                        AGE / HEIGHT / WEIGHT
                    ================================== */}

          {step < 3 ? (

            <>

              <View style={styles.counter}>

                {/* MINUS */}

                <Pressable
                  onPress={
                    decreaseValue
                  }
                  disabled={
                    Number(
                      values[
                      step
                      ]
                    ) <=
                    current.min
                  }
                  style={({ pressed }) => [
                    styles.roundButton,

                    pressed &&
                    styles.pressed,
                  ]}
                >

                  <Ionicons
                    name="remove"
                    size={25}
                    color="#172B38"
                  />

                </Pressable>


                {/* NUMBER */}

                <View style={styles.numberBlock}>

                  <TextInput
                    key={step}
                    value={
                      values[
                      step
                      ]
                    }
                    onChangeText={
                      change
                    }
                    keyboardType={
                      step === 0
                        ? 'number-pad'
                        : 'decimal-pad'
                    }
                    selectTextOnFocus
                    maxLength={5}
                    style={
                      styles.number
                    }
                  />


                  <Text style={styles.unit}>
                    {
                      current.unit
                    }
                  </Text>

                </View>


                {/* PLUS */}

                <Pressable
                  onPress={
                    increaseValue
                  }
                  disabled={
                    Number(
                      values[
                      step
                      ]
                    ) >=
                    current.max
                  }
                  style={({ pressed }) => [
                    styles.roundButton,

                    pressed &&
                    styles.pressed,
                  ]}
                >

                  <Ionicons
                    name="add"
                    size={25}
                    color="#172B38"
                  />

                </Pressable>

              </View>


              {/* =================================
                                ILLUSTRATIONS
                            ================================== */}

              <View style={styles.art}>

                <Image
                  source={current.image}
                  style={styles.illustration}
                  resizeMode="contain"
                  accessible={false}
                />

              </View>

            </>

          ) : (

            /* =================================
               GOALS
            ================================== */

            <View style={styles.goals}>

              {goals.map(
                option => {

                  const selected =
                    goal ===
                    option.value;


                  return (

                    <Pressable
                      key={
                        option.value
                      }
                      disabled={
                        saving
                      }
                      onPress={() => {

                        setGoal(
                          option.value
                        );

                        setError(
                          ''
                        );
                      }}
                      style={({
                        pressed,
                      }) => [
                          styles.goalCard,

                          selected &&
                          styles.goalSelected,

                          pressed &&
                          styles.pressed,
                        ]}
                    >

                      <View
                        style={
                          styles.goalIcon
                        }
                      >

                        <Image
                          source={option.image}
                          style={styles.goalImage}
                          resizeMode="contain"
                          accessible={false}
                        />

                      </View>


                      <View
                        style={
                          styles.goalText
                        }
                      >

                        <Text
                          style={
                            styles.goalTitle
                          }
                        >
                          {
                            option.title
                          }
                        </Text>


                        <Text
                          style={
                            styles.goalDescription
                          }
                        >
                          {
                            option.description
                          }
                        </Text>

                      </View>


                      {selected && (

                        <Ionicons
                          name="checkmark-circle"
                          size={23}
                          color="#079455"
                        />

                      )}

                    </Pressable>

                  );
                }
              )}

            </View>

          )}

        </ScrollView>


        {/* =====================================
                    BOTTOM BUTTON
                ====================================== */}

        <View style={styles.footer}>

          {!!error && (

            <Text style={styles.error}>
              {error}
            </Text>

          )}


          <Pressable
            disabled={saving}
            onPress={next}
            style={({ pressed }) => [

              styles.button,

              pressed &&
              styles.pressed,

              saving && {
                opacity: 0.65,
              },

            ]}
          >

            {saving ? (

              <ActivityIndicator
                color="#FFFFFF"
              />

            ) : (

              <Text style={styles.buttonText}>

                {
                  step === 3
                    ? 'Continue'
                    : 'Next'
                }

              </Text>

            )}

          </Pressable>

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({

    safe: {
      flex: 1,

      backgroundColor:
        '#FFFFFF',
    },


    flex: {
      flex: 1,
    },


    /* =================================
       TOP
    ================================== */

    top: {
      paddingHorizontal: 10,

      paddingTop: 8,
    },


    track: {
      height: 4,

      backgroundColor:
        '#EAECF0',

      borderRadius: 20,

      overflow: 'hidden',
    },


    fill: {
      height: 4,

      backgroundColor:
        '#079455',

      borderRadius: 20,
    },


    stepText: {
      textAlign: 'center',

      marginTop: 10,

      fontSize: 12,

      fontWeight: '500',

      color: '#667085',
    },


    /* =================================
       CONTENT
    ================================== */

    content: {
      flexGrow: 1,

      paddingHorizontal: 18,

      paddingTop: 22,

      paddingBottom: 20,

      alignItems: 'center',
    },


    title: {
      fontSize: 25,

      lineHeight: 32,

      fontWeight: '900',

      color: '#101828',

      textAlign: 'center',

      letterSpacing: -0.8,
    },


    description: {
      marginTop: 5,

      maxWidth: 300,

      textAlign: 'center',

      color: '#667085',

      fontSize: 14,

      lineHeight: 20,
    },


    /* =================================
       COUNTER
    ================================== */

    counter: {
      width: '100%',

      maxWidth: 310,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      marginTop: 35,
    },


    roundButton: {
      width: 48,

      height: 48,

      borderWidth: 1,

      borderColor: '#D0D5DD',

      borderRadius: 24,

      backgroundColor:
        '#FFFFFF',

      justifyContent: 'center',

      alignItems: 'center',
    },


    numberBlock: {
      width: 110,

      alignItems: 'center',
    },


    number: {
      width: '100%',

      padding: 0,

      textAlign: 'center',

      color: '#101828',

      fontSize: 36,

      lineHeight: 43,

      fontWeight: '900',
    },


    unit: {
      color: '#667085',

      fontSize: 14,

      fontWeight: '600',

      marginTop: 2,
    },


    /* =================================
       ART
    ================================== */

    illustration: {
      width: '100%',
      maxWidth: 300,
      height: 280,
    },

    art: {
      flex: 1,

      width: '100%',

      minHeight: 245,

      marginTop: 10,

      justifyContent: 'center',

      alignItems: 'center',
    },


    /* =================================
       GOALS
    ================================== */

    goals: {
      width: '100%',

      marginTop: 28,

      gap: 12,
    },


    goalCard: {
      width: '100%',

      minHeight: 78,

      paddingHorizontal: 15,

      paddingVertical: 12,

      flexDirection: 'row',

      alignItems: 'center',

      borderWidth: 1,

      borderColor: '#E4E7EC',

      borderRadius: 12,

      backgroundColor:
        '#FFFFFF',
    },


    goalSelected: {
      borderWidth: 1.5,

      borderColor: '#079455',

      backgroundColor:
        '#F6FEF9',
    },


    goalIcon: {
      width: 42,

      justifyContent:
        'center',

      alignItems: 'center',

      marginRight: 10,
    },


    goalImage: {
      width: 42,
      height: 42,
    },

    goalText: {
      flex: 1,
    },


    goalTitle: {
      color: '#101828',

      fontSize: 15,

      fontWeight: '800',
    },


    goalDescription: {
      marginTop: 3,

      color: '#667085',

      fontSize: 12,

      lineHeight: 17,
    },


    /* =================================
       FOOTER
    ================================== */

    footer: {
      paddingHorizontal: 8,

      paddingTop: 8,

      paddingBottom: 8,

      backgroundColor:
        '#FFFFFF',
    },


    button: {
      width: '100%',

      minHeight: 55,

      borderRadius: 12,

      backgroundColor:
        '#079455',

      justifyContent:
        'center',

      alignItems: 'center',

      shadowColor:
        '#079455',

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.17,

      shadowRadius: 9,

      elevation: 3,
    },


    buttonText: {
      color: '#FFFFFF',

      fontSize: 15,

      fontWeight: '800',
    },


    error: {
      color: '#B42318',

      fontSize: 13,

      lineHeight: 18,

      textAlign: 'center',

      marginBottom: 8,
    },


    pressed: {
      opacity: 0.72,
    },

  });
