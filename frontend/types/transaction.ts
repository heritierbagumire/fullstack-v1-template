export type TransactionType = 'income' | 'expense';

export type CategoryType = 
  | 'fuel'
  | 'maintenance'
  | 'tolls'
  | 'parking'
  | 'insurance'
  | 'vehicle_purchase'
  | 'salary'
  | 'food'
  | 'shopping'
  | 'transportation'
  | 'entertainment'
  | 'bills'
  | 'income'
  | 'other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: CategoryType;
  date: Date;
  notes?: string;
}

export interface Category {
  id: CategoryType;
  name: string;
  icon: string;
}