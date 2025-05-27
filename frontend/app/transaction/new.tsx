import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useTransactionStore } from '@/store/transaction-store';
import { TransactionTypeSelector } from '@/components/transactions/TransactionTypeSelector';
import { CategorySelector } from '@/components/transactions/CategorySelector';
import { Button } from '@/components/ui/Button';
import { TransactionType, CategoryType } from '@/types/transaction';
import { Colors } from '@/constants/Colors'; 
import { Calendar, FileText } from 'lucide-react-native';

export default function NewTransactionScreen() {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<TransactionType>('expense');
    const [category, setCategory] = useState<CategoryType>('transportation');
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState('');

    const { addTransaction } = useTransactionStore();

    const handleAmountChange = (text: string) => {
        // Only allow numbers and decimal point
        const filteredText = text.replace(/[^0-9.]/g, '');
        setAmount(filteredText);
    };

    const handleSave = () => {
        if (!title || !amount) {
            // Show validation error
            return;
        }

        addTransaction({
            title,
            amount: parseFloat(amount),
            type,
            category,
            date,
            notes,
        });

        router.back();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <TransactionTypeSelector
                    selectedType={type}
                    onSelectType={setType}
                />

                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={handleAmountChange}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        placeholderTextColor={Colors.text.light}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.titleInput}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Transaction Title"
                        placeholderTextColor={Colors.text.light}
                    />
                </View>

                <CategorySelector
                    selectedCategory={category}
                    onSelectCategory={setCategory}
                />

                <View style={styles.dateContainer}>
                    <View style={styles.iconContainer}>
                        <Calendar size={20} color={Colors.text.secondary} />
                    </View>
                    <Text style={styles.dateText}>
                        {date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>
                    <TouchableOpacity style={styles.dateButton}>
                        <Text style={styles.dateButtonText}>Change</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.notesContainer}>
                    <View style={styles.notesHeader}>
                        <View style={styles.iconContainer}>
                            <FileText size={20} color={Colors.text.secondary} />
                        </View>
                        <Text style={styles.notesLabel}>Notes</Text>
                    </View>
                    <TextInput
                        style={styles.notesInput}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Add notes here..."
                        placeholderTextColor={Colors.text.light}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                <Button
                    title="Save"
                    onPress={handleSave}
                    style={styles.saveButton}
                />
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
        padding: 16,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: '600',
        color: Colors.text.primary,
        marginRight: 4,
    },
    amountInput: {
        fontSize: 48,
        fontWeight: '700',
        color: Colors.text.primary,
        textAlign: 'center',
        minWidth: 150,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        marginBottom: 16,
    },
    titleInput: {
        height: 48,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.text.primary,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        marginTop: 16,
        marginBottom: 16,
    },
    iconContainer: {
        marginRight: 12,
    },
    dateText: {
        flex: 1,
        fontSize: 16,
        color: Colors.text.primary,
    },
    dateButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Colors.background.secondary,
        borderRadius: 4,
    },
    dateButtonText: {
        fontSize: 14,
        color: Colors.primary.main,
        fontWeight: '500',
    },
    notesContainer: {
        marginBottom: 24,
    },
    notesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    notesLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.primary,
    },
    notesInput: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        fontSize: 16,
        color: Colors.text.primary,
    },
    saveButton: {
        marginTop: 8,
    },
});