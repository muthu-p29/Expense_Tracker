import React, { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { Plus, Edit, Trash2, DollarSign, Palette, Move } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: any;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, categoryToEdit }) => {
  const { addCategory, updateCategory } = useExpense();
  
  const [name, setName] = useState(categoryToEdit?.name || '');
  const [icon, setIcon] = useState(categoryToEdit?.icon || '📋');
  const [color, setColor] = useState(categoryToEdit?.color || '#10B981');
  const [budget, setBudget] = useState(categoryToEdit?.budget || 0);
  
  const commonIcons = ['🍔', '🛒', '🏠', '🚕', '💊', '💡', '🍿', '🔧', '🌐', '📺', '🎓', '💼', '✈️', '🎮', '🎁', '🏋️', '🎭', '📱', '👕', '🍷', '🐶', '💰'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      name,
      icon,
      color,
      budget: Number(budget),
      order: categoryToEdit?.order || 999,
    };
    
    if (categoryToEdit) {
      updateCategory(categoryToEdit.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {categoryToEdit ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Icon
            </label>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center text-xl mr-2">
                {icon}
              </div>
              <div className="flex-1 grid grid-cols-8 gap-1">
                {commonIcons.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    className={`w-8 h-8 flex items-center justify-center text-lg rounded hover:bg-gray-100 ${
                      icon === emoji ? 'bg-emerald-100 border border-emerald-300' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280', '#000000'].map((clr) => (
                <button
                  key={clr}
                  type="button"
                  onClick={() => setColor(clr)}
                  className={`w-8 h-8 rounded-full border ${
                    color === clr ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: clr }}
                ></button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Monthly Budget
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                min="0"
                step="1"
                required
              />
            </div>
          </div>
          
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
              icon={categoryToEdit ? <Edit size={16} /> : <Plus size={16} />}
            >
              {categoryToEdit ? 'Update Category' : 'Add Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoryManager: React.FC = () => {
  const { categories, deleteCategory, reorderCategories } = useExpense();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  
  const handleAddCategory = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };
  
  const handleEditCategory = (category: any) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };
  
  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure? This will also delete all expenses in this category.')) {
      deleteCategory(id);
    }
  };
  
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newCategories = [...categories];
      const temp = newCategories[index];
      newCategories[index] = newCategories[index - 1];
      newCategories[index - 1] = temp;
      
      // Update order property
      newCategories.forEach((cat, idx) => {
        cat.order = idx;
      });
      
      reorderCategories(newCategories);
    }
  };
  
  const handleMoveDown = (index: number) => {
    if (index < categories.length - 1) {
      const newCategories = [...categories];
      const temp = newCategories[index];
      newCategories[index] = newCategories[index + 1];
      newCategories[index + 1] = temp;
      
      // Update order property
      newCategories.forEach((cat, idx) => {
        cat.order = idx;
      });
      
      reorderCategories(newCategories);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Expense Categories</h2>
        <Button
          onClick={handleAddCategory}
          variant="primary"
          icon={<Plus size={16} />}
        >
          Add Category
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-gray-500 font-medium">Category</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Icon</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Color</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-right">Monthly Budget</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category, index) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{category.name}</td>
                  <td className="px-6 py-4 text-xl">{category.icon}</td>
                  <td className="px-6 py-4">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: category.color }}></div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    ${category.budget.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className={`p-1 ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <svg className="h-4 w-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleMoveDown(index)}
                        disabled={index === categories.length - 1}
                        className={`p-1 ${index === categories.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleEditCategory(category)}
                        className="text-gray-500 hover:text-indigo-600 p-1"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
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
      </Card>
      
      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
};

export default CategoryManager;