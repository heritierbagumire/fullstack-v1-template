import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Trash2, Edit2 } from 'lucide-react-native';
import { useTransactionStore } from '@/store/transaction-store';
import { getCategoryById } from '@/constants/categories';
import { CategoryIcon } from '@/components/transactions/CategoryIcon';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';

export default function TransactionDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { transactions, deleteTransaction } = useTransactionStore();

    const transaction = transactions.find(t => t.id === id);

    if (!transaction) {
        return (
            <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>Transaction not found</Text>
                <Button
                    title="Go Back"
                    onPress={() => router.back()}
                    style={styles.backButton}
                />
            </View>
        );
    }

    const { title, amount, type, category, date, notes } = transaction;
    const categoryData = getCategoryById(category);

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const amountColor = type === 'income' ? Colors.income : Colors.expense;
    const amountPrefix = type === 'income' ? '+' : '-';

    const handleDelete = () => {
        Alert.alert(
            'Delete Transaction',
            'Are you sure you want to delete this transaction?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteTransaction(id);
                        router.back();
                    },
                },
            ]
        );
    };

    const handleEdit = () => {
        // In a real app, this would navigate to an edit screen
        Alert.alert('Edit Transaction', 'This feature is not implemented yet.');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.categoryIconContainer}>
                    <CategoryIcon category={category} size={32} />
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={[styles.amount, { color: amountColor }]}>
                    {amountPrefix}${amount.toFixed(2)}
                </Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <Text style={styles.detailValue}>
                        {type === 'income' ? 'Income' : 'Expense'}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category</Text>
                    <Text style={styles.detailValue}>{categoryData.name}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{formattedDate}</Text>
                </View>

                {notes && (
                    <>
                        <View style={styles.divider} />

                        <View style={styles.notesContainer}>
                            <Text style={styles.detailLabel}>Notes</Text>
                            <Text style={styles.notesText}>{notes}</Text>
                        </View>
                    </>
                )}
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={handleEdit}
                >
                    <Edit2 size={20} color={Colors.primary.main} />
                    <Text style={[styles.actionText, styles.editText]}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={handleDelete}
                >
                    <Trash2 size={20} color={Colors.status.error} />
                    <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                </TouchableOpacity>
            </View>
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
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    categoryIconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.background.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: Colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 8,
    },
    amount: {
        fontSize: 32,
        fontWeight: '700',
    },
    detailsContainer: {
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: Colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    detailLabel: {
        fontSize: 16,
        color: Colors.text.secondary,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.primary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
    },
    notesContainer: {
        paddingVertical: 12,
    },
    notesText: {
        fontSize: 16,
        color: Colors.text.primary,
        marginTop: 8,
        lineHeight: 22,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 8,
    },
    editButton: {
        backgroundColor: Colors.background.card,
        borderWidth: 1,
        borderColor: Colors.primary.main,
    },
    deleteButton: {
        backgroundColor: Colors.background.card,
        borderWidth: 1,
        borderColor: Colors.status.error,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    editText: {
        color: Colors.primary.main,
    },
    deleteText: {
        color: Colors.status.error,
    },
    notFoundContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    notFoundText: {
        fontSize: 18,
        color: Colors.text.secondary,
        marginBottom: 16,
    },
    backButton: {
        width: 200,
    },
});