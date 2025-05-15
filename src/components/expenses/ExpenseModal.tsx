import React, { useState, useEffect } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { X, DollarSign, Calendar, Tag, RefreshCw } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    isRecurring: boolean;
    recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, expenseToEdit }) => {
  const { categories, addExpense, updateExpense } = useExpense();
  
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringInterval, setRecurringInterval] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  
  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount);
      setCategory(expenseToEdit.category);
      setDescription(expenseToEdit.description);
      setDate(expenseToEdit.date.split('T')[0]);
      setIsRecurring(expenseToEdit.isRecurring);
      setRecurringInterval(expenseToEdit.recurringInterval || 'monthly');
    } else {
      // Default to the first category if adding new expense
      if (categories.length > 0 && !category) {
        setCategory(categories[0].id);
      }
      
      // Reset form
      setAmount(0);
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setIsRecurring(false);
      setRecurringInterval('monthly');
    }
  }, [expenseToEdit, categories, category]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseData = {
      amount,
      category,
      description,
      date: new Date(date).toISOString(),
      isRecurring,
      ...(isRecurring && { recurringInterval }),
    };
    
    if (expenseToEdit) {
      updateExpense(expenseToEdit.id, expenseData);
    } else {
      addExpense(expenseData);
    }
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                id="amount"
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="0.00"
                min={0}
                step={0.01}
                required
                className="w-full"
                error=""
              />
            </div>
            
            <div className="flex-1">
              <Select
                id="category"
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: `${cat.icon} ${cat.name}`,
                }))}
                required
                className="w-full"
                error=""
              />
            </div>
          </div>
          
          <Input
            id="description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this expense for?"
            required
            className="w-full"
            error=""
          />
          
          <Input
            id="date"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full"
            error=""
          />
          
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <label htmlFor="recurring" className="text-sm text-gray-700">
              This is a recurring expense
            </label>
          </div>
          
          {isRecurring && (
            <Select
              id="recurringInterval"
              label="Repeats"
              value={recurringInterval}
              onChange={(e) => setRecurringInterval(e.target.value as any)}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
              className="w-full"
              error=""
            />
          )}
          
          <div className="pt-4 flex justify-end space-x-3 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={expenseToEdit ? <RefreshCw size={16} /> : <DollarSign size={16} />}
            >
              {expenseToEdit ? 'Update Expense' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;