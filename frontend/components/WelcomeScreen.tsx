import React from 'react';

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import Svg, {
    Path,
} from 'react-native-svg';


type WelcomeScreenProps = {
    onStart: () => void;
    onSignIn?: () => void;
};


/* =========================================================
   BACKGROUND WAVES
========================================================= */

function BackgroundWaves() {
    return (
        <View
            style={styles.wavesContainer}
            pointerEvents="none"
        >
            <Svg
                width="100%"
                height="100%"
                viewBox="0 0 400 300"
                preserveAspectRatio="none"
            >
                {/* Light background wave */}
                <Path
                    d="
                        M0 70
                        C70 45 125 125 205 118
                        C285 110 325 40 400 52
                        L400 300
                        L0 300
                        Z
                    "
                    fill="#ECFDF3"
                />

                {/* Middle wave */}
                <Path
                    d="
                        M0 140
                        C75 108 130 188 215 171
                        C300 154 330 93 400 103
                        L400 300
                        L0 300
                        Z
                    "
                    fill="#D1FADF"
                />

                {/* Bottom green wave */}
                <Path
                    d="
                        M0 195
                        C80 162 132 238 220 212
                        C300 190 335 147 400 158
                        L400 300
                        L0 300
                        Z
                    "
                    fill="#A6F4C5"
                />
            </Svg>
        </View>
    );
}


/* =========================================================
   WELCOME SCREEN
========================================================= */

export default function WelcomeScreen({
    onStart,
    onSignIn,
}: WelcomeScreenProps) {

    const handleSignIn = () => {
        if (onSignIn) {
            onSignIn();
        } else {
            onStart();
        }
    };


    return (
        <SafeAreaView style={styles.safeArea}>

            {/* Background Waves */}
            <BackgroundWaves />


            <View style={styles.container}>

                {/* =================================================
                    LOGO + TITLE
                ================================================= */}

                <View style={styles.heroSection}>

                    <Image
                        source={require('../assets/icon.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />


                    <Text style={styles.logoText}>

                        <Text style={styles.logoDark}>
                            Fit
                        </Text>

                        <Text style={styles.logoGreen}>
                            Flow
                        </Text>

                    </Text>


                    <Text style={styles.tagline}>
                        Stronger You
                        {'\n'}
                        Healthier Tomorrow
                    </Text>

                </View>


                {/* =================================================
                    BOTTOM ACTIONS
                ================================================= */}

                <View style={styles.bottomSection}>

                    {/* GET STARTED BUTTON */}

                    <Pressable
                        onPress={onStart}
                        accessibilityRole="button"
                        accessibilityLabel="Get Started"
                        style={({ pressed }) => [
                            styles.startButton,
                            pressed && styles.startButtonPressed,
                        ]}
                    >

                        <Text style={styles.startButtonText}>
                            Get Started
                        </Text>

                    </Pressable>


                    {/* SIGN IN */}

                    <View style={styles.signInRow}>

                        <Text style={styles.accountText}>
                            Already have an account?
                        </Text>


                        <Pressable
                            onPress={handleSignIn}
                            hitSlop={10}
                            accessibilityRole="button"
                            accessibilityLabel="Sign In"
                        >

                            <Text style={styles.signInText}>
                                Sign In
                            </Text>

                        </Pressable>

                    </View>

                </View>

            </View>

        </SafeAreaView>
    );
}


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

    /* =========================
       MAIN SCREEN
    ========================== */

    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
    },


    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 18,
        zIndex: 2,
    },


    /* =========================
       HERO
    ========================== */

    heroSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 110,
    },


    /* =========================
       LOGO IMAGE
    ========================== */

    logoImage: {
        width: 115,
        height: 115,
        marginBottom: 8,
    },


    /* =========================
       FITFLOW TEXT
    ========================== */

    logoText: {
        fontSize: 54,
        lineHeight: 62,
        fontWeight: '900',
        letterSpacing: -2.3,
        textAlign: 'center',
    },


    logoDark: {
        color: '#064E3B',
    },


    logoGreen: {
        color: '#079455',
    },


    /* =========================
       TAGLINE
    ========================== */

    tagline: {
        marginTop: 18,
        textAlign: 'center',
        fontSize: 19,
        lineHeight: 27,
        fontWeight: '500',
        color: '#667085',
    },


    /* =========================
       WAVES
    ========================== */

    wavesContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '43%',
        zIndex: 0,
    },


    /* =========================
       BOTTOM AREA
    ========================== */

    bottomSection: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 18,
    },


    /* =========================
       GET STARTED BUTTON
    ========================== */

    startButton: {
        width: '100%',
        minHeight: 60,

        backgroundColor: '#079455',

        borderRadius: 16,

        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: '#079455',

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowOpacity: 0.22,

        shadowRadius: 12,

        elevation: 6,
    },


    startButtonPressed: {
        opacity: 0.88,

        transform: [
            {
                scale: 0.99,
            },
        ],
    },


    startButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '800',
    },


    /* =========================
       SIGN IN AREA
    ========================== */

    signInRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 27,

        gap: 7,
    },


    accountText: {
        fontSize: 14,
        color: '#667085',
        fontWeight: '500',
    },


    signInText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#079455',
    },

});