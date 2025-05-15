import React, { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { Search, Plus, Edit, Trash2, Filter, ArrowUpDown } from 'lucide-react';

interface ExpenseListProps {
  openAddExpenseModal: () => void;
  onEditExpense: (expense: any) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ openAddExpenseModal, onEditExpense }) => {
  const { expenses, categories, deleteExpense } = useExpense();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const filteredExpenses = expenses
    .filter(expense => {
      // Text search
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.amount - a.amount;
        case 'lowest':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : '📋';
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search expenses..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-emerald-500 focus:border-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
          
          <Button
            onClick={openAddExpenseModal}
            variant="primary"
            className="sm:flex-shrink-0"
            icon={<Plus size={16} />}
          >
            Add
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        {filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-gray-500 font-medium">Description</th>
                  <th className="px-6 py-3 text-gray-500 font-medium">Category</th>
                  <th className="px-6 py-3 text-gray-500 font-medium">Date</th>
                  <th className="px-6 py-3 text-gray-500 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      {expense.description}
                      {expense.isRecurring && (
                        <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 py-0.5 px-1.5 rounded-full">
                          Recurring
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-2">{getCategoryIcon(expense.category)}</span>
                        {getCategoryName(expense.category)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-red-600">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => onEditExpense(expense)}
                          className="text-gray-500 hover:text-indigo-600 p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => deleteExpense(expense.id)}
                          className="text-gray-500 hover:text-red-600 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500">
            <p className="mb-2">No expenses found matching your filters</p>
            <Button
              onClick={openAddExpenseModal}
              variant="primary"
              icon={<Plus size={16} />}
            >
              Add Your First Expense
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExpenseList;