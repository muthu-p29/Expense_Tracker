import { Category, Expense, Budget } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const initialCategories: Category[] = [
  { id: uuidv4(), name: 'Cinema', icon: '🍿', color: '#F472B6', budget: 100, order: 0 },
  { id: uuidv4(), name: 'Food', icon: '🍔', color: '#F97316', budget: 300, order: 1 },
  { id: uuidv4(), name: 'Medical', icon: '💊', color: '#60A5FA', budget: 150, order: 2 },
  { id: uuidv4(), name: 'Transportation', icon: '🚕', color: '#FBBF24', budget: 200, order: 3 },
  { id: uuidv4(), name: 'Rent', icon: '🏠', color: '#34D399', budget: 1000, order: 4 },
  { id: uuidv4(), name: 'Utilities', icon: '💡', color: '#A78BFA', budget: 250, order: 5 },
  { id: uuidv4(), name: 'Groceries', icon: '🛒', color: '#6EE7B7', budget: 400, order: 6 },
  { id: uuidv4(), name: 'Maintenance', icon: '🔧', color: '#94A3B8', budget: 100, order: 7 },
  { id: uuidv4(), name: 'Internet', icon: '🌐', color: '#38BDF8', budget: 80, order: 8 },
  { id: uuidv4(), name: 'Subscriptions', icon: '📺', color: '#FB7185', budget: 50, order: 9 },
  { id: uuidv4(), name: 'Education', icon: '🎓', color: '#818CF8', budget: 200, order: 10 },
];

const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

export const initialBudget: Budget = {
  id: uuidv4(),
  month: currentMonth,
  totalBudget: initialCategories.reduce((sum, cat) => sum + cat.budget, 0),
  categoryAllocations: initialCategories.reduce((acc, category) => {
    acc[category.id] = category.budget;
    return acc;
  }, {} as Record<string, number>),
  alertThresholds: {
    medium: 50,
    high: 75,
    critical: 90,
  },
};

export const initialExpenses: Expense[] = [
  {
    id: uuidv4(),
    amount: 15.99,
    category: initialCategories[0].id, // Cinema
    description: 'Movie tickets',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: false,
  },
  {
    id: uuidv4(),
    amount: 42.75,
    category: initialCategories[1].id, // Food
    description: 'Dinner at restaurant',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: false,
  },
  {
    id: uuidv4(),
    amount: 25.50,
    category: initialCategories[2].id, // Medical
    description: 'Pharmacy',
    date: new Date().toISOString(),
    isRecurring: false,
  },
  {
    id: uuidv4(),
    amount: 1000,
    category: initialCategories[4].id, // Rent
    description: 'Monthly rent',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: true,
    recurringInterval: 'monthly',
  },
  {
    id: uuidv4(),
    amount: 75.20,
    category: initialCategories[6].id, // Groceries
    description: 'Weekly groceries',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: true,
    recurringInterval: 'weekly',
  },
];