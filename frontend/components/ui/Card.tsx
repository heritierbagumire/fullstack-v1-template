import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors'; 

interface CardProps extends ViewProps {
    style?: ViewStyle;
    variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    variant = 'default',
    ...props
}) => {
    const getCardStyle = () => {
        switch (variant) {
            case 'default':
                return styles.defaultCard;
            case 'elevated':
                return styles.elevatedCard;
            case 'outlined':
                return styles.outlinedCard;
            default:
                return styles.defaultCard;
        }
    };

    return (
        <View style={[styles.card, getCardStyle(), style]} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        backgroundColor: Colors.background.card,
    },
    defaultCard: {
        backgroundColor: Colors.background.card,
    },
    elevatedCard: {
        backgroundColor: Colors.background.card,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    outlinedCard: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.border,
    },
});