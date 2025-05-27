import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail, Lock, User } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { Colors } from '@/constants/Colors'; 

const logo = require('@/assets/images/icon.png');
export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const { signup, isLoading } = useAuthStore();

    const validateForm = () => {
        const newErrors: { name?: string; email?: string; password?: string } = {};

        if (!name) {
            newErrors.name = 'Name is required';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        try {
            await signup(email, password, name);
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Signup error:', error);
            setErrors({ email: 'Failed to create account' });
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <StatusBar style="dark" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Image
                        source={logo}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>Create Account</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Name"
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                        leftIcon={<User size={20} color={Colors.text.secondary} />}
                        error={errors.name}
                    />

                    <Input
                        label="Email"
                        placeholder="Enter email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon={<Mail size={20} color={Colors.text.secondary} />}
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        placeholder="Enter password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        leftIcon={<Lock size={20} color={Colors.text.secondary} />}
                        error={errors.password}
                    />

                    <Button
                        title="Sign Up"
                        onPress={handleSignup}
                        isLoading={isLoading}
                        style={styles.signupButton}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/" asChild>
                            <TouchableOpacity>
                                <Text style={styles.loginLink}>Sign in</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    form: {
        width: '100%',
    },
    signupButton: {
        marginTop: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: Colors.text.secondary,
    },
    loginLink: {
        color: Colors.primary.main,
        fontWeight: '600',
    },
});