import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTransactionStore } from '@/store/transaction-store';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { CATEGORIES } from '@/constants/categories';
import { CategoryIcon } from '@/components/transactions/CategoryIcon';

export default function ReportsScreen() {
    const {
        transactions,
        getTotalIncome,
        getTotalExpenses,
        getTransactionsByCategory,
    } = useTransactionStore();

    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();

    const getCategoryTotal = (categoryId: string) => {
        const categoryTransactions = getTransactionsByCategory(categoryId as any);
        return categoryTransactions.reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);
    };

    const getExpenseCategories = () => {
        return CATEGORIES.filter(category => {
            if (category.id === 'income') return false;
            const total = getCategoryTotal(category.id);
            return total > 0;
        }).sort((a, b) => {
            return getCategoryTotal(b.id) - getCategoryTotal(a.id);
        });
    };

    const getIncomeCategories = () => {
        return CATEGORIES.filter(category => {
            if (category.id !== 'income') return false;
            const total = getCategoryTotal(category.id);
            return total > 0;
        });
    };

    const calculatePercentage = (amount: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((amount / total) * 100);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Financial Summary</Text>

            <View style={styles.summaryContainer}>
                <Card style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Income</Text>
                    <Text style={[styles.summaryValue, styles.incomeValue]}>
                        ${totalIncome.toFixed(2)}
                    </Text>
                </Card>

                <Card style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Expenses</Text>
                    <Text style={[styles.summaryValue, styles.expenseValue]}>
                        ${totalExpenses.toFixed(2)}
                    </Text>
                </Card>
            </View>

            <Text style={styles.sectionTitle}>Expense Breakdown</Text>

            {getExpenseCategories().length > 0 ? (
                <Card variant="elevated" style={styles.breakdownCard}>
                    {getExpenseCategories().map((category) => {
                        const amount = getCategoryTotal(category.id);
                        const percentage = calculatePercentage(amount, totalExpenses);

                        return (
                            <View key={category.id} style={styles.categoryItem}>
                                <View style={styles.categoryInfo}>
                                    <CategoryIcon category={category.id as any} size={20} />
                                    <Text style={styles.categoryName}>{category.name}</Text>
                                </View>

                                <View style={styles.categoryStats}>
                                    <View style={styles.percentageContainer}>
                                        <View
                                            style={[
                                                styles.percentageBar,
                                                { width: `${percentage}%` },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
                                    <Text style={styles.categoryPercentage}>{percentage}%</Text>
                                </View>
                            </View>
                        );
                    })}
                </Card>
            ) : (
                <Text style={styles.emptyText}>No expense data available</Text>
            )}

            <Text style={styles.sectionTitle}>Income Sources</Text>

            {getIncomeCategories().length > 0 ? (
                <Card variant="elevated" style={styles.breakdownCard}>
                    {getIncomeCategories().map((category) => {
                        const amount = getCategoryTotal(category.id);
                        const percentage = calculatePercentage(amount, totalIncome);

                        return (
                            <View key={category.id} style={styles.categoryItem}>
                                <View style={styles.categoryInfo}>
                                    <CategoryIcon category={category.id as any} size={20} />
                                    <Text style={styles.categoryName}>{category.name}</Text>
                                </View>

                                <View style={styles.categoryStats}>
                                    <View style={styles.percentageContainer}>
                                        <View
                                            style={[
                                                styles.percentageBar,
                                                styles.incomeBar,
                                                { width: `${percentage}%` },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
                                    <Text style={styles.categoryPercentage}>{percentage}%</Text>
                                </View>
                            </View>
                        );
                    })}
                </Card>
            ) : (
                <Text style={styles.emptyText}>No income data available</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.secondary,
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 16,
    },
    summaryContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    summaryCard: {
        flex: 1,
        marginHorizontal: 4,
        padding: 16,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: '700',
    },
    incomeValue: {
        color: Colors.income,
    },
    expenseValue: {
        color: Colors.expense,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 12,
        marginTop: 8,
    },
    breakdownCard: {
        marginBottom: 24,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        marginBottom: 16,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '30%',
    },
    categoryName: {
        marginLeft: 8,
        fontSize: 14,
        color: Colors.text.primary,
    },
    categoryStats: {
        flex: 1,
        marginLeft: 12,
    },
    percentageContainer: {
        height: 8,
        backgroundColor: Colors.background.secondary,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    percentageBar: {
        height: '100%',
        backgroundColor: Colors.expense,
        borderRadius: 4,
    },
    incomeBar: {
        backgroundColor: Colors.income,
    },
    categoryAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    categoryPercentage: {
        fontSize: 12,
        color: Colors.text.secondary,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.text.secondary,
        marginVertical: 16,
    },
});