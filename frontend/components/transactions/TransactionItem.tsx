import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Transaction } from '@/types/transaction';
import { getCategoryById } from '@/constants/categories';
import { Colors } from '@/constants/Colors'; 
import { CategoryIcon } from './CategoryIcon';

interface TransactionItemProps {
    transaction: Transaction;
    onDelete?: (id: string) => void;
    onPress?: (transaction: Transaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
    transaction,
    onDelete,
    onPress,
}) => {
    const { id, title, amount, type, category, date } = transaction;
    const categoryData = getCategoryById(category);

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const amountColor = type === 'income' ? Colors.income : Colors.expense;
    const amountPrefix = type === 'income' ? '+' : '-';

    const handlePress = () => {
        if (onPress) {
            onPress(transaction);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(id);
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.leftSection}>
                <CategoryIcon category={category} size={24} />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.category}>{categoryData.name}</Text>
                </View>
            </View>

            <View style={styles.rightSection}>
                <View style={styles.amountContainer}>
                    <Text style={[styles.amount, { color: amountColor }]}>
                        {amountPrefix}${amount.toFixed(2)}
                    </Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>

                {onDelete && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    >
                        <Trash2 size={18} color={Colors.status.error} />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        marginBottom: 8,
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
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    titleContainer: {
        marginLeft: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.primary,
    },
    category: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginTop: 2,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: '600',
    },
    date: {
        fontSize: 12,
        color: Colors.text.light,
        marginTop: 2,
    },
    deleteButton: {
        marginLeft: 16,
    },
});