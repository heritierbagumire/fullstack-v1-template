import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacityProps,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors'; 

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    style,
    textStyle,
    ...props
}) => {
    const getButtonStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primaryButton;
            case 'secondary':
                return styles.secondaryButton;
            case 'outline':
                return styles.outlineButton;
            case 'text':
                return styles.textButton;
            default:
                return styles.primaryButton;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primaryText;
            case 'secondary':
                return styles.secondaryText;
            case 'outline':
                return styles.outlineText;
            case 'text':
                return styles.textButtonText;
            default:
                return styles.primaryText;
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return styles.smallButton;
            case 'medium':
                return styles.mediumButton;
            case 'large':
                return styles.largeButton;
            default:
                return styles.mediumButton;
        }
    };

    const getTextSizeStyle = () => {
        switch (size) {
            case 'small':
                return styles.smallText;
            case 'medium':
                return styles.mediumText;
            case 'large':
                return styles.largeText;
            default:
                return styles.mediumText;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getButtonStyle(),
                getSizeStyle(),
                isLoading && styles.disabledButton,
                style,
            ]}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' ? '#fff' : Colors.primary.main}
                />
            ) : (
                <Text style={[
                    styles.text,
                    getTextStyle(),
                    getTextSizeStyle(),
                    textStyle,
                ]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: Colors.primary.main,
    },
    secondaryButton: {
        backgroundColor: Colors.secondary.main,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary.main,
    },
    textButton: {
        backgroundColor: 'transparent',
    },
    disabledButton: {
        opacity: 0.7,
    },
    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    mediumButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    largeButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    text: {
        fontWeight: '600',
    },
    primaryText: {
        color: '#fff',
    },
    secondaryText: {
        color: '#fff',
    },
    outlineText: {
        color: Colors.primary.main,
    },
    textButtonText: {
        color: Colors.primary.main,
    },
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },
});