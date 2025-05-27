import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Transaction, TransactionType, CategoryType } from '@/types/transaction';
import { MOCK_TRANSACTIONS } from '@/mocks/transactions'; 

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByCategory: (category: CategoryType) => Transaction[];
  getTotalBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: MOCK_TRANSACTIONS,
      isLoading: false,
      
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: Date.now().toString(),
        };
        
        set(state => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      
      updateTransaction: (id, updatedTransaction) => {
        set(state => ({
          transactions: state.transactions.map(transaction => 
            transaction.id === id 
              ? { ...transaction, ...updatedTransaction } 
              : transaction
          ),
        }));
      },
      
      deleteTransaction: (id) => {
        set(state => ({
          transactions: state.transactions.filter(transaction => transaction.id !== id),
        }));
      },
      
      getTransactionsByType: (type) => {
        return get().transactions.filter(transaction => transaction.type === type);
      },
      
      getTransactionsByCategory: (category) => {
        return get().transactions.filter(transaction => transaction.category === category);
      },
      
      getTotalBalance: () => {
        return get().transactions.reduce((total, transaction) => {
          return transaction.type === 'income' 
            ? total + transaction.amount 
            : total - transaction.amount;
        }, 0);
      },
      
      getTotalIncome: () => {
        return get().transactions
          .filter(transaction => transaction.type === 'income')
          .reduce((total, transaction) => total + transaction.amount, 0);
      },
      
      getTotalExpenses: () => {
        return get().transactions
          .filter(transaction => transaction.type === 'expense')
          .reduce((total, transaction) => total + transaction.amount, 0);
      },
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);