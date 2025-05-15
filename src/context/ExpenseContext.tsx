import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, Category, Budget } from '../types';
import { initialExpenses, initialCategories, initialBudget } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  budget: Budget;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (updatedCategories: Category[]) => void;
  updateBudget: (budget: Partial<Budget>) => void;
  updateCategoryBudget: (categoryId: string, amount: number) => void;
  calculateTotalSpent: () => number;
  calculateCategorySpent: (categoryId: string) => number;
  getWalletBalance: () => number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : initialExpenses;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : initialCategories;
  });

  const [budget, setBudget] = useState<Budget>(() => {
    const savedBudget = localStorage.getItem('budget');
    return savedBudget ? JSON.parse(savedBudget) : initialBudget;
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: uuidv4() };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, updatedFields: Partial<Expense>) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedFields } : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: uuidv4() };
    setCategories([...categories, newCategory]);
    
    // Also update budget allocations
    const newBudget = {
      ...budget,
      categoryAllocations: {
        ...budget.categoryAllocations,
        [newCategory.id]: category.budget,
      },
      totalBudget: budget.totalBudget + category.budget,
    };
    setBudget(newBudget);
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, ...updatedFields } : category
      )
    );
    
    // If budget was updated, update budget allocations too
    if (updatedFields.budget !== undefined) {
      const oldBudget = budget.categoryAllocations[id] || 0;
      const newBudget = updatedFields.budget;
      
      setBudget({
        ...budget,
        categoryAllocations: {
          ...budget.categoryAllocations,
          [id]: newBudget,
        },
        totalBudget: budget.totalBudget - oldBudget + newBudget,
      });
    }
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
    
    // Remove from budget allocations and update total budget
    const categoryBudget = budget.categoryAllocations[id] || 0;
    const { [id]: _, ...remainingAllocations } = budget.categoryAllocations;
    
    setBudget({
      ...budget,
      categoryAllocations: remainingAllocations,
      totalBudget: budget.totalBudget - categoryBudget,
    });
    
    // Remove expenses in this category
    setExpenses(expenses.filter((expense) => expense.category !== id));
  };

  const reorderCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
  };

  const updateBudget = (updatedFields: Partial<Budget>) => {
    setBudget({ ...budget, ...updatedFields });
  };

  const updateCategoryBudget = (categoryId: string, amount: number) => {
    const oldAmount = budget.categoryAllocations[categoryId] || 0;
    
    setBudget({
      ...budget,
      categoryAllocations: {
        ...budget.categoryAllocations,
        [categoryId]: amount,
      },
      totalBudget: budget.totalBudget - oldAmount + amount,
    });
    
    // Also update the category
    updateCategory(categoryId, { budget: amount });
  };

  const calculateTotalSpent = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return expenses
      .filter((expense) => expense.date.startsWith(currentMonth))
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const calculateCategorySpent = (categoryId: string) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return expenses
      .filter(
        (expense) => 
          expense.category === categoryId && 
          expense.date.startsWith(currentMonth)
      )
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getWalletBalance = () => {
    return budget.totalBudget - calculateTotalSpent();
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        budget,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        updateBudget,
        updateCategoryBudget,
        calculateTotalSpent,
        calculateCategorySpent,
        getWalletBalance,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};