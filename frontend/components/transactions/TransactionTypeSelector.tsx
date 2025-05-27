import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TransactionType } from '@/types/transaction';
import { Colors } from '@/constants/Colors'; 

interface TransactionTypeSelectorProps {
    selectedType: TransactionType;
    onSelectType: (type: TransactionType) => void;
}

export const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({
    selectedType,
    onSelectType,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.typeButton,
                    selectedType === 'expense' && styles.selectedExpenseButton,
                ]}
                onPress={() => onSelectType('expense')}
                activeOpacity={0.8}
            >
                <Text
                    style={[
                        styles.typeText,
                        selectedType === 'expense' && styles.selectedTypeText,
                    ]}
                >
                    Expense
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.typeButton,
                    selectedType === 'income' && styles.selectedIncomeButton,
                ]}
                onPress={() => onSelectType('income')}
                activeOpacity={0.8}
            >
                <Text
                    style={[
                        styles.typeText,
                        selectedType === 'income' && styles.selectedTypeText,
                    ]}
                >
                    Income
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 24,
        backgroundColor: Colors.background.secondary,
        padding: 4,
        marginVertical: 16,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 20,
    },
    selectedExpenseButton: {
        backgroundColor: Colors.expense,
    },
    selectedIncomeButton: {
        backgroundColor: Colors.income,
    },
    typeText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.primary,
    },
    selectedTypeText: {
        color: Colors.background.card,
    },
});