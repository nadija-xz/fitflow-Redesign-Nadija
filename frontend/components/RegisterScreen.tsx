import React, { useState } from 'react';

import {
    ActivityIndicator,
    Image,
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

import Svg, {
    Path,
} from 'react-native-svg';

import {
    AuthUser,
    registerUser,
    saveSession,
} from '../services/auth';


type Props = {
    onBack: () => void;
    onLogin: () => void;
    onSuccess: (user: AuthUser) => void;
    onGoogle: () => void;
};


/* =========================================================
   GOOGLE LOGO
========================================================= */

function GoogleLogo() {
    return (
        <Svg
            width={23}
            height={23}
            viewBox="0 0 24 24"
        >
            <Path
                fill="#4285F4"
                d="M21.35 12.27c0-.64-.06-1.25-.16-1.84H12v3.48h5.26a4.5 4.5 0 0 1-1.95 2.95v2.4h3.16c1.85-1.7 2.88-4.21 2.88-6.99Z"
            />

            <Path
                fill="#34A853"
                d="M12 21.8c2.64 0 4.86-.87 6.47-2.37l-3.16-2.4c-.88.59-2 .94-3.31.94-2.55 0-4.71-1.72-5.48-4.03H3.26v2.48A9.78 9.78 0 0 0 12 21.8Z"
            />

            <Path
                fill="#FBBC05"
                d="M6.52 13.94A5.87 5.87 0 0 1 6.2 12c0-.67.12-1.32.32-1.94V7.58H3.26A9.77 9.77 0 0 0 2.2 12c0 1.58.38 3.08 1.06 4.42l3.26-2.48Z"
            />

            <Path
                fill="#EA4335"
                d="M12 6.03c1.44 0 2.73.5 3.75 1.47l2.8-2.8C16.85 3.11 14.64 2.2 12 2.2a9.78 9.78 0 0 0-8.74 5.38l3.26 2.48C7.29 7.75 9.45 6.03 12 6.03Z"
            />
        </Svg>
    );
}


/* =========================================================
   REGISTER SCREEN
========================================================= */

export default function RegisterScreen({
    onBack,
    onLogin,
    onSuccess,
    onGoogle,
}: Props) {

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState('');

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState('');


    async function handleRegister() {

        try {

            setError('');

            if (!email.trim()) {

                setError(
                    'Please enter your email address.'
                );

                return;
            }


            if (password.length < 6) {

                setError(
                    'Password must contain at least 6 characters.'
                );

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                setError(
                    'Passwords do not match.'
                );

                return;
            }


            setLoading(true);


            const result =
                await registerUser(
                    email.trim(),
                    password
                );


            await saveSession(result);


            onSuccess(result.user);

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : 'Registration failed.'
            );

        } finally {

            setLoading(false);
        }
    }


    return (

        <SafeAreaView style={styles.safeArea}>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >

                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={
                        styles.content
                    }
                >

                    {/* =====================================
                        BACK BUTTON
                    ====================================== */}

                    <Pressable
                        onPress={onBack}
                        style={styles.backButton}
                        hitSlop={10}
                    >

                        <Ionicons
                            name="chevron-back"
                            size={27}
                            color="#101828"
                        />

                    </Pressable>


                    {/* =====================================
                        FITFLOW LOGO + NAME
                        KEPT FROM YOUR DESIGN
                    ====================================== */}

                    <View style={styles.brandRow}>

                        <Image
                            source={
                                require('../assets/icon.png')
                            }
                            style={styles.brandIcon}
                            resizeMode="contain"
                        />

                        <Text style={styles.brandName}>

                            <Text style={styles.brandDark}>
                                Fit
                            </Text>

                            <Text style={styles.brandGreen}>
                                Flow
                            </Text>

                        </Text>

                    </View>


                    {/* =====================================
                        TITLE
                    ====================================== */}

                    <Text style={styles.title}>
                        Create Account
                    </Text>

                    <Text style={styles.subtitle}>
                        Join FitFlow and start your
                        {'\n'}
                        fitness journey.
                    </Text>


                    {/* =====================================
                        EMAIL
                    ====================================== */}

                    <Text style={styles.label}>
                        Email
                    </Text>

                    <View style={styles.inputBox}>

                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            placeholderTextColor="#98A2B3"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={styles.input}
                        />

                    </View>


                    {/* =====================================
                        PASSWORD
                    ====================================== */}

                    <Text style={styles.label}>
                        Password
                    </Text>

                    <View style={styles.inputBox}>

                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            placeholderTextColor="#98A2B3"
                            secureTextEntry={!showPassword}
                            style={styles.input}
                        />


                        <Pressable
                            onPress={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                            hitSlop={10}
                        >

                            <Ionicons
                                name={
                                    showPassword
                                        ? 'eye-off-outline'
                                        : 'eye-outline'
                                }
                                size={21}
                                color="#667085"
                            />

                        </Pressable>

                    </View>


                    {/* =====================================
                        CONFIRM PASSWORD
                    ====================================== */}

                    <Text style={styles.label}>
                        Confirm Password
                    </Text>

                    <View style={styles.inputBox}>

                        <TextInput
                            value={confirmPassword}
                            onChangeText={
                                setConfirmPassword
                            }
                            placeholder="Re-enter your password"
                            placeholderTextColor="#98A2B3"
                            secureTextEntry={
                                !showConfirmPassword
                            }
                            style={styles.input}
                        />


                        <Pressable
                            onPress={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                            hitSlop={10}
                        >

                            <Ionicons
                                name={
                                    showConfirmPassword
                                        ? 'eye-off-outline'
                                        : 'eye-outline'
                                }
                                size={21}
                                color="#667085"
                            />

                        </Pressable>

                    </View>


                    {/* =====================================
                        ERROR MESSAGE
                    ====================================== */}

                    {error ? (

                        <View style={styles.errorBox}>

                            <Ionicons
                                name="alert-circle-outline"
                                size={19}
                                color="#D92D20"
                            />

                            <Text style={styles.errorText}>
                                {error}
                            </Text>

                        </View>

                    ) : null}


                    {/* =====================================
                        CREATE ACCOUNT BUTTON
                    ====================================== */}

                    <Pressable
                        disabled={loading}
                        onPress={handleRegister}
                        style={({ pressed }) => [

                            styles.primaryButton,

                            pressed &&
                            styles.buttonPressed,

                            loading &&
                            styles.buttonDisabled,

                        ]}
                    >

                        {loading ? (

                            <ActivityIndicator
                                color="#FFFFFF"
                                size="small"
                            />

                        ) : (

                            <Text
                                style={
                                    styles.primaryButtonText
                                }
                            >
                                Create Account
                            </Text>

                        )}

                    </Pressable>


                    {/* =====================================
                        DIVIDER
                    ====================================== */}

                    <View style={styles.divider}>

                        <View style={styles.line} />

                        <Text style={styles.dividerText}>
                            or continue with
                        </Text>

                        <View style={styles.line} />

                    </View>


                    {/* =====================================
                        GOOGLE BUTTON
                    ====================================== */}

                    <Pressable
                        onPress={onGoogle}
                        style={({ pressed }) => [

                            styles.googleButton,

                            pressed &&
                            styles.googleButtonPressed,

                        ]}
                    >

                        <GoogleLogo />

                        <Text style={styles.googleText}>
                            Continue with Google
                        </Text>

                    </Pressable>


                    {/* =====================================
                        LOGIN LINK
                    ====================================== */}

                    <View style={styles.footer}>

                        <Text style={styles.footerText}>
                            Already have an account?
                        </Text>


                        <Pressable
                            onPress={onLogin}
                            hitSlop={8}
                        >

                            <Text style={styles.footerLink}>
                                Sign In
                            </Text>

                        </Pressable>

                    </View>

                </ScrollView>

            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

    flex: {
        flex: 1,
    },


    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },


    content: {
        flexGrow: 1,

        paddingHorizontal: 24,

        paddingTop: 2,

        paddingBottom: 38,
    },


    /* =====================================
       BACK
    ====================================== */

    backButton: {
        width: 42,
        height: 42,

        justifyContent: 'center',
        alignItems: 'flex-start',

        marginLeft: -7,

        marginBottom: 5,
    },


    /* =====================================
       FITFLOW BRAND
    ====================================== */

    brandRow: {
        flexDirection: 'row',

        alignItems: 'center',

        marginBottom: 22,
    },


    brandIcon: {
        width: 42,
        height: 42,

        borderRadius: 12,

        marginRight: 10,
    },


    brandName: {
        fontSize: 26,

        fontWeight: '900',

        letterSpacing: -1.2,
    },


    brandDark: {
        color: '#064E3B',
    },


    brandGreen: {
        color: '#079455',
    },


    /* =====================================
       TITLE
    ====================================== */

    title: {
        fontSize: 31,

        lineHeight: 38,

        fontWeight: '900',

        color: '#101828',

        letterSpacing: -0.9,
    },


    subtitle: {
        marginTop: 5,

        marginBottom: 25,

        fontSize: 14,

        lineHeight: 21,

        color: '#667085',
    },


    /* =====================================
       LABELS
    ====================================== */

    label: {
        fontSize: 13,

        fontWeight: '700',

        color: '#344054',

        marginBottom: 7,
    },


    /* =====================================
       INPUTS
    ====================================== */

    inputBox: {
        width: '100%',

        minHeight: 55,

        borderWidth: 1,

        borderColor: '#D0D5DD',

        borderRadius: 12,

        paddingHorizontal: 14,

        backgroundColor: '#FFFFFF',

        flexDirection: 'row',

        alignItems: 'center',

        marginBottom: 16,
    },


    input: {
        flex: 1,

        minHeight: 53,

        fontSize: 14,

        color: '#101828',

        paddingVertical: 0,
    },


    /* =====================================
       ERROR
    ====================================== */

    errorBox: {
        flexDirection: 'row',

        alignItems: 'center',

        gap: 8,

        backgroundColor: '#FEF3F2',

        borderWidth: 1,

        borderColor: '#FECDCA',

        borderRadius: 12,

        paddingHorizontal: 13,

        paddingVertical: 11,

        marginBottom: 15,
    },


    errorText: {
        flex: 1,

        color: '#B42318',

        fontSize: 12,

        lineHeight: 18,
    },


    /* =====================================
       CREATE ACCOUNT
    ====================================== */

    primaryButton: {
        width: '100%',

        minHeight: 56,

        marginTop: 4,

        borderRadius: 12,

        backgroundColor: '#079455',

        justifyContent: 'center',

        alignItems: 'center',

        shadowColor: '#079455',

        shadowOffset: {
            width: 0,
            height: 6,
        },

        shadowOpacity: 0.18,

        shadowRadius: 10,

        elevation: 4,
    },


    primaryButtonText: {
        color: '#FFFFFF',

        fontSize: 15,

        fontWeight: '800',
    },


    buttonPressed: {
        opacity: 0.88,

        transform: [
            {
                scale: 0.995,
            },
        ],
    },


    buttonDisabled: {
        opacity: 0.65,
    },


    /* =====================================
       DIVIDER
    ====================================== */

    divider: {
        flexDirection: 'row',

        alignItems: 'center',

        marginVertical: 23,
    },


    line: {
        flex: 1,

        height: 1,

        backgroundColor: '#EAECF0',
    },


    dividerText: {
        marginHorizontal: 12,

        fontSize: 12,

        color: '#98A2B3',
    },


    /* =====================================
       GOOGLE BUTTON
    ====================================== */

    googleButton: {
        width: '100%',

        minHeight: 56,

        borderWidth: 1,

        borderColor: '#D0D5DD',

        borderRadius: 12,

        backgroundColor: '#FFFFFF',

        flexDirection: 'row',

        justifyContent: 'center',

        alignItems: 'center',

        gap: 11,
    },


    googleButtonPressed: {
        backgroundColor: '#F9FAFB',
    },


    googleText: {
        color: '#101828',

        fontSize: 14,

        fontWeight: '700',
    },


    /* =====================================
       FOOTER
    ====================================== */

    footer: {
        flexDirection: 'row',

        justifyContent: 'center',

        alignItems: 'center',

        gap: 6,

        marginTop: 27,
    },


    footerText: {
        color: '#667085',

        fontSize: 13,
    },


    footerLink: {
        color: '#079455',

        fontSize: 13,

        fontWeight: '800',
    },

});