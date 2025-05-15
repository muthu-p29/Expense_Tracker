import React from 'react';
import { useExpense } from '../../context/ExpenseContext';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import { AlertTriangle } from 'lucide-react';

const BudgetOverview: React.FC = () => {
  const { categories, calculateCategorySpent } = useExpense();
  
  // Sort categories by percentage spent (descending)
  const sortedCategories = [...categories]
    .map(category => ({
      ...category,
      spent: calculateCategorySpent(category.id),
      percentage: (calculateCategorySpent(category.id) / category.budget) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5); // Top 5 categories
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Budget Overview</h2>
        <div className="text-xs text-gray-500">Top spending categories</div>
      </div>
      
      <div className="space-y-5">
        {sortedCategories.map((category) => (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2 text-lg">{category.icon}</span>
                <span className="font-medium text-gray-800">{category.name}</span>
              </div>
              <div className="text-sm font-medium">
                {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                
                {category.percentage >= 90 && (
                  <span className="ml-2 inline-flex items-center">
                    <AlertTriangle size={14} className="text-red-500" />
                  </span>
                )}
              </div>
            </div>
            
            <ProgressBar 
              value={category.spent} 
              max={category.budget} 
              size="sm" 
              showLabel={false}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <a href="#budget" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
          View all budgets
        </a>
      </div>
    </Card>
  );
};

export default BudgetOverview;