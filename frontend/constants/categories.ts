import { Category } from '@/types/transaction';

export const CATEGORIES: Category[] = [
  {
    id: 'fuel',
    name: 'Fuel',
    icon: 'fuel',
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    icon: 'tool',
  },
  {
    id: 'tolls',
    name: 'Tolls',
    icon: 'road',
  },
  {
    id: 'parking',
    name: 'Parking',
    icon: 'parking',
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: 'shield',
  },
  {
    id: 'vehicle_purchase',
    name: 'Vehicle Purchase',
    icon: 'truck',
  },
  {
    id: 'food',
    name: 'Food & Drinks',
    icon: 'coffee',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'shopping-bag',
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: 'car',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'film',
  },
  {
    id: 'bills',
    name: 'Bills',
    icon: 'file-text',
  },
  {
    id: 'income',
    name: 'Income',
    icon: 'dollar-sign',
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'more-horizontal',
  },
];

export const getCategoryById = (id: string): Category => {
  return CATEGORIES.find(category => category.id === id) || CATEGORIES[CATEGORIES.length - 1];
};