import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
    inputStyle?: TextStyle;
    errorStyle?: TextStyle;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    labelStyle,
    inputStyle,
    errorStyle,
    leftIcon,
    rightIcon,
    secureTextEntry,
    ...props
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const renderPasswordToggle = () => {
        if (secureTextEntry) {
            return (
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                    {isPasswordVisible ? (
                        <EyeOff size={20} color={Colors.text.secondary} />
                    ) : (
                        <Eye size={20} color={Colors.text.secondary} />
                    )}
                </TouchableOpacity>
            );
        }
        return rightIcon;
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

            <View style={[
                styles.inputContainer,
                error ? styles.inputError : null,
            ]}>
                {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

                <TextInput
                    style={[
                        styles.input,
                        leftIcon ? styles.inputWithLeftIcon : null,
                        (rightIcon || secureTextEntry) ? styles.inputWithRightIcon : null,
                        inputStyle,
                    ]}
                    placeholderTextColor={Colors.text.light}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    {...props}
                />

                {(rightIcon || secureTextEntry) && renderPasswordToggle()}
            </View>

            {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: Colors.text.secondary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        backgroundColor: Colors.background.main,
    },
    input: {
        flex: 1,
        height: 48,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.text.primary,
    },
    inputWithLeftIcon: {
        paddingLeft: 8,
    },
    inputWithRightIcon: {
        paddingRight: 8,
    },
    iconContainer: {
        paddingHorizontal: 12,
    },
    inputError: {
        borderColor: Colors.status.error,
    },
    errorText: {
        color: Colors.status.error,
        fontSize: 12,
        marginTop: 4,
    },
});