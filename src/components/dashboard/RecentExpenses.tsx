import React from 'react';
import { useExpense } from '../../context/ExpenseContext';
import Card from '../common/Card';
import { Clock } from 'lucide-react';

const RecentExpenses: React.FC = () => {
  const { expenses, categories } = useExpense();
  
  // Get most recent 5 expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : '📋';
  };
  
  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Recent Expenses</h2>
        <Clock size={20} className="text-gray-500" />
      </div>
      
      {recentExpenses.length > 0 ? (
        <div className="space-y-4">
          {recentExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-lg">
                  {getCategoryIcon(expense.category)}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{expense.description}</div>
                  <div className="text-sm text-gray-500">
                    {getCategoryName(expense.category)} • {formatDate(expense.date)}
                    {expense.isRecurring && (
                      <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 py-0.5 px-1.5 rounded-full">
                        Recurring
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="font-semibold text-red-600">
                -{formatCurrency(expense.amount)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p>No recent expenses to show.</p>
          <p className="text-sm mt-2">Start tracking your spending!</p>
        </div>
      )}
    </Card>
  );
};

export default RecentExpenses;