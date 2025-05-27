import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors'; 

interface BalanceCardProps {
    balance: number;
    income: number;
    expenses: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
    balance,
    income,
    expenses,
}) => {
    return (
        <Card variant="elevated" style={styles.container}>
            <Text style={styles.title}>Total Balance</Text>
            <Text style={styles.balance}>${balance.toFixed(2)}</Text>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Income</Text>
                    <Text style={[styles.statValue, styles.incomeValue]}>
                        +${income.toFixed(2)}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Expenses</Text>
                    <Text style={[styles.statValue, styles.expenseValue]}>
                        -${expenses.toFixed(2)}
                    </Text>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 20,
    },
    title: {
        fontSize: 16,
        color: Colors.text.secondary,
        marginBottom: 8,
    },
    balance: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    incomeValue: {
        color: Colors.income,
    },
    expenseValue: {
        color: Colors.expense,
    },
    divider: {
        width: 1,
        backgroundColor: Colors.border,
        marginHorizontal: 16,
    },
});