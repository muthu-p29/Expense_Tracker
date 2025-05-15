export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
  order: number;
}

export interface Budget {
  id: string;
  month: string;
  totalBudget: number;
  categoryAllocations: Record<string, number>;
  alertThresholds: {
    medium: number; // e.g., 50%
    high: number; // e.g., 75%
    critical: number; // e.g., 90%
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}