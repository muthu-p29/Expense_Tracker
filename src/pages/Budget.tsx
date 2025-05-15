import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import Input from '../components/common/Input';
import { DollarSign, AlertTriangle, Check, Settings } from 'lucide-react';

const DEFAULT_THRESHOLDS = {
  medium: 50,
  high: 75,
  critical: 90,
};

const Budget: React.FC = () => {
  const { budget, categories, updateCategoryBudget, calculateCategorySpent, calculateTotalSpent, updateBudget } = useExpense();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudget, setEditedBudget] = useState<Record<string, number>>({});
  const [alertThresholds, setAlertThresholds] = useState({
    medium: budget?.alertThresholds?.medium ?? DEFAULT_THRESHOLDS.medium,
    high: budget?.alertThresholds?.high ?? DEFAULT_THRESHOLDS.high,
    critical: budget?.alertThresholds?.critical ?? DEFAULT_THRESHOLDS.critical,
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const startEditing = () => {
    const initialBudgets: Record<string, number> = {};
    categories.forEach(category => {
      initialBudgets[category.id] = category.budget;
    });
    setEditedBudget(initialBudgets);
    setIsEditing(true);
  };
  
  const handleBudgetChange = (categoryId: string, value: number) => {
    setEditedBudget({
      ...editedBudget,
      [categoryId]: value,
    });
  };
  
  const handleAlertThresholdChange = (type: 'medium' | 'high' | 'critical', value: number) => {
    setAlertThresholds({
      ...alertThresholds,
      [type]: value,
    });
  };
  
  const saveBudget = () => {
    // Update each category budget
    Object.entries(editedBudget).forEach(([categoryId, amount]) => {
      updateCategoryBudget(categoryId, amount);
    });
    
    // Update alert thresholds
    updateBudget({
      alertThresholds,
    });
    
    setIsEditing(false);
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
  };
  
  const getAlertLevel = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    
    if (percentage >= alertThresholds.critical) return 'critical';
    if (percentage >= alertThresholds.high) return 'high';
    if (percentage >= alertThresholds.medium) return 'medium';
    return 'normal';
  };
  
  const getTotalBudget = () => {
    if (isEditing) {
      return Object.values(editedBudget).reduce((sum, value) => sum + value, 0);
    }
    return budget?.totalBudget ?? 0;
  };
  
  if (!budget) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-6">
            <p className="text-gray-600">Loading budget information...</p>
          </Card>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="flex justify-between items-center mb-6 mt-6">
        <h1 className="text-2xl font-bold text-gray-800">Monthly Budget</h1>
        {!isEditing ? (
          <Button 
            onClick={startEditing} 
            variant="outline"
            icon={<Settings size={16} />}
          >
            Edit Budget
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={cancelEditing} variant="outline">Cancel</Button>
            <Button 
              onClick={saveBudget} 
              variant="primary"
              icon={<Check size={16} />}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Budget Overview</h2>
              <p className="text-gray-500">
                Total Monthly Budget: {formatCurrency(getTotalBudget())}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-500">
                Spent: {formatCurrency(calculateTotalSpent())} ({Math.round((calculateTotalSpent() / getTotalBudget()) * 100)}%)
              </p>
              <p className="text-gray-500">
                Remaining: {formatCurrency(getTotalBudget() - calculateTotalSpent())}
              </p>
            </div>
          </div>
          
          <ProgressBar 
            value={calculateTotalSpent()} 
            max={getTotalBudget()} 
            size="lg" 
            color="emerald" 
          />
          
          {isEditing && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-md font-medium mb-3">Alert Thresholds</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Medium Alert</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={alertThresholds.medium}
                      onChange={(e) => handleAlertThresholdChange('medium', Number(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                    <span className="ml-2 w-12 text-amber-500 font-medium">{alertThresholds.medium}%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">High Alert</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={alertThresholds.high}
                      onChange={(e) => handleAlertThresholdChange('high', Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                    <span className="ml-2 w-12 text-amber-600 font-medium">{alertThresholds.high}%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Critical Alert</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={alertThresholds.critical}
                      onChange={(e) => handleAlertThresholdChange('critical', Number(e.target.value))}
                      className="w-full accent-red-500"
                    />
                    <span className="ml-2 w-12 text-red-500 font-medium">{alertThresholds.critical}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">Category Budgets</h2>
        
        {categories.map((category) => {
          const spent = calculateCategorySpent(category.id);
          const budgeted = isEditing ? (editedBudget[category.id] || 0) : category.budget;
          const percentage = budgeted > 0 ? Math.round((spent / budgeted) * 100) : 0;
          const alertLevel = getAlertLevel(spent, budgeted);
          
          return (
            <Card key={category.id} className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                <div className="flex items-center mb-2 md:mb-0">
                  <div
                    className="w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-lg">{category.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                    {alertLevel === 'critical' && (
                      <div className="flex items-center text-xs text-red-600">
                        <AlertTriangle size={12} className="mr-1" />
                        Over budget threshold
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        value={editedBudget[category.id] || 0}
                        onChange={(e) => handleBudgetChange(category.id, Number(e.target.value))}
                        className="pl-8 w-24 px-3 py-1 border border-gray-300 rounded-md text-right"
                        min="0"
                      />
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(spent)} / {formatCurrency(budgeted)}</div>
                      <div className="text-sm text-gray-500">{percentage}% used</div>
                    </div>
                  )}
                </div>
              </div>
              
              <ProgressBar 
                value={spent} 
                max={budgeted} 
                size="sm" 
                showLabel={false} 
              />
            </Card>
          );
        })}
      </div>
    </Container>
  );
};

export default Budget;