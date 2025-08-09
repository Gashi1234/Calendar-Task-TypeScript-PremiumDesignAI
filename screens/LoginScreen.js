import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { auth } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';

import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const iconScale = useRef(new Animated.Value(1)).current;
    const [loading, setLoading] = useState(false);


    const animatedIconStyle = {
        transform: [{ scale: iconScale }],
    };

    useEffect(() => {
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(iconScale, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(iconScale, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulseAnimation.start();
        return () => pulseAnimation.stop();
    }, []);

    // ✅ Step 1: Try biometric login on mount if user was logged in before
    useEffect(() => {
        const checkBiometricAuth = async () => {
            const wasLoggedIn = await AsyncStorage.getItem('wasLoggedIn');
            if (wasLoggedIn === 'true') {
                handleBiometricLogin();
            }
        };
        checkBiometricAuth();
    }, []);

    const handleInputFocus = (inputName) => {
        setFocusedInput(inputName);
    };

    const handleInputBlur = () => {
        setFocusedInput(null);
    };

    // Biometric Login Function
    const handleBiometricLogin = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (!compatible || !enrolled) {
            Alert.alert(
                'Biometric Auth Unavailable',
                'Biometric authentication is not set up on this device.'
            );
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate with Face ID / Fingerprint',
            fallbackLabel: 'Use Passcode',
            disableDeviceFallback: false,
        });

        if (result.success) {
            const currentUser = auth.currentUser;
            if (currentUser) {
                navigation.replace('LoggedIn');
            } else {
                Alert.alert('Session Expired', 'Please log in again.');
                await AsyncStorage.removeItem('wasLoggedIn'); // Clear invalid session
            }
        } else {
            Alert.alert('Authentication Failed', 'Biometric authentication failed.');
        }
    };

    // Email + Password on Sign Up - Basic Validation
    // const handleSignUp = async () => {
    //     if (!email.includes('@') || !email.includes('.')) {
    //         Alert.alert("Invalid Email", "Please enter a valid email address.\n\n An example of a valid email address: test@test.com");
    //         return;
    //     }

    //     if (password.length < 6) {
    //         Alert.alert("Weak Password", "Password must be at least 6 characters long.");
    //         return;
    //     }

    //     try {
    //         await createUserWithEmailAndPassword(auth, email, password);
    //         await AsyncStorage.setItem('wasLoggedIn', 'true'); // To Remember the user
    //         navigation.replace('LoggedIn');
    //     } catch (error) {
    //         Alert.alert("Sign Up Error! Please enter a valid email address.\n\n An example of a valid email address: test@test.com", error.message);
    //     }
    // };

    // Email + Password Validation on Sign Up - Regex Validation
    const handleSignUp = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            Alert.alert(
                "Invalid Email",
                "\nPlease enter a valid email address.\n\nAn example of a valid email address: test@test.com"
            );
            return;
        }

        if (password.length < 6) {
            Alert.alert("Weak Password", "Password must be at least 6 characters long.");
            return;
        }

        setLoading(true); // 👈 START loading

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await AsyncStorage.setItem('wasLoggedIn', 'true'); // Remember user
            navigation.replace('LoggedIn');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert(
                    "Email Already Registered",
                    "\nThis email address is already in use.\n\n Please try logging in or use a different email."
                );
            } else {
                Alert.alert("Sign Up Error", error.message);
            }
        } finally {
            setLoading(false); // 👈 STOP loading
        }
    };


    // Email + Password Login Validation Basic Validation

    // const handleLogin = async () => {
    //     if (!email.includes('@') || !email.includes('.')) {
    //         Alert.alert("Invalid Email!", "\nPlease enter a valid email address.\n\n An example of a valid email address: test@test.com");
    //         return;
    //     }

    //     if (password.length < 6) {
    //         Alert.alert("Weak Password!", "\nPassword must be at least 6 characters long.");
    //         return;
    //     }

    //     try {
    //         await signInWithEmailAndPassword(auth, email, password);
    //         await AsyncStorage.setItem('wasLoggedIn', 'true'); // Remember user
    //         navigation.replace('LoggedIn');
    //     } catch (error) {
    //         if (
    //             error.code === 'auth/user-not-found' ||
    //             error.code === 'auth/wrong-password' ||
    //             error.code === 'auth/invalid-credential'
    //         ) {
    //             Alert.alert(
    //                 'Login Failed',
    //                 '\nWrong email or password, or you are not registered at all.\n\nIf not registered, please sign up!'
    //             );
    //         } else {
    //             Alert.alert('Login Error', error.message);
    //         }
    //     }
    // };

    // Email + Password Login Validation Regex Validation
    const handleLogin = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            Alert.alert(
                "Invalid Email",
                "\nPlease enter a valid email address.\n\nAn example of a valid email address: test@test.com"
            );
            return;
        }

        if (password.length < 6) {
            Alert.alert("Weak Password!", "\nPassword must be at least 6 characters long.");
            return;
        }

        setLoading(true); // 👈 START LOADING

        try {
            await signInWithEmailAndPassword(auth, email, password);
            await AsyncStorage.setItem('wasLoggedIn', 'true');
            navigation.replace('LoggedIn');
        } catch (error) {
            if (
                error.code === 'auth/user-not-found' ||
                error.code === 'auth/wrong-password' ||
                error.code === 'auth/invalid-credential'
            ) {
                Alert.alert(
                    'Login Failed',
                    '\nWrong email or password, or you are not registered at all.\n\nIf not registered, please sign up!'
                );
            } else {
                Alert.alert('Login Error', error.message);
            }
        } finally {
            setLoading(false); // 👈 STOP LOADING
        }
    };


    return (
        <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 5 : 0}
        >
            {/* Vibrant Gradient Background */}
            <LinearGradient
                colors={[colors.yellow, colors.orange, colors.red]}
                style={styles.gradientBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Main Login Card */}
                    <View style={styles.loginCard}>
                        {/* App Icon with Orange-Red Gradient */}
                        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
                            <LinearGradient
                                colors={[colors.orange, colors.red]}
                                style={styles.iconGradient}
                            >
                                <FontAwesome5
                                    name="calendar-alt"
                                    size={60}
                                    color={colors.white}
                                />
                            </LinearGradient>
                        </Animated.View>

                        {/* Welcome Text with Red Accent */}
                        <Text style={styles.welcomeTitle}>Welcome to Calendar!</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>

                        {/* Input Fields with Orange Focus */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <FontAwesome5
                                    name="envelope"
                                    size={18}
                                    color={colors.orange}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    placeholder="Email Address"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.input}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    placeholderTextColor={colors.gray}
                                    onFocus={() => handleInputFocus('email')}
                                    onBlur={() => handleInputBlur('email')}
                                />
                            </View>

                            <View style={styles.inputWrapper}>
                                <FontAwesome5
                                    name="lock"
                                    size={18}
                                    color={colors.orange}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.input}
                                    secureTextEntry={!showPassword}
                                    placeholderTextColor={colors.gray}
                                    onFocus={() => handleInputFocus('password')}
                                    onBlur={() => handleInputBlur('password')}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <FontAwesome5
                                        name={showPassword ? "eye-slash" : "eye"}
                                        size={16}
                                        color={colors.orange}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>



                        {/* Action Buttons with Red-Orange Gradient */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={handleLogin}
                                activeOpacity={0.8}
                                disabled={loading}
                            >

                                <LinearGradient
                                    colors={[colors.red, colors.orange]}
                                    style={styles.gradientButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.buttonText}>Sign In</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.signUpButton}
                                onPress={handleSignUp}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.signUpButtonText}>
                                    Create Account
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </LinearGradient>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={colors.orange} />
                </View>
            )}

        </KeyboardAvoidingView>
    );
}

const colors = {
    yellow: '#ffd500',
    red: '#d71a28',
    orange: '#f36c21',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6',
};

const styles = StyleSheet.create({
    keyboardContainer: { flex: 1 },
    gradientBackground: { flex: 1 },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    loginCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 25,
        padding: 30,
        alignItems: 'center',
        shadowColor: colors.orange,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
        elevation: 20,
        borderWidth: 2,
        borderColor: 'rgba(243, 108, 33, 0.2)',
    },
    iconContainer: { marginBottom: 30 },
    iconGradient: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.red,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 15,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.red,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray,
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: { width: '100%', marginBottom: 20 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 15,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderWidth: 2,
        borderColor: 'rgba(243, 108, 33, 0.3)',
    },
    inputIcon: { marginRight: 12 },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: colors.red,
    },
    eyeIcon: { padding: 5 },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 25,
    },
    forgotPasswordText: {
        color: colors.orange,
        fontSize: 14,
        fontWeight: '600',
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 25,
    },
    loginButton: {
        width: '100%',
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: colors.red,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    gradientButton: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpButton: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: colors.yellow,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 213, 0, 0.1)',
    },
    signUpButtonText: {
        color: colors.orange,
        fontSize: 16,
        fontWeight: '600',
    },
    socialContainer: {
        alignItems: 'center',
        width: '100%',
    },
    orText: {
        color: colors.gray,
        fontSize: 14,
        marginBottom: 15,
    },
    socialButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 213, 0, 0.3)',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999, // ensure it’s on top
    },
});
