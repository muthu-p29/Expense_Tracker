import React, { useState } from 'react';
import Container from '../components/common/Container';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseModal from '../components/expenses/ExpenseModal';
import { Expense } from '../types';

const Expenses: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined);
  
  const handleOpenAddModal = () => {
    setExpenseToEdit(undefined);
    setIsModalOpen(true);
  };
  
  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };
  
  return (
    <Container>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-6">Expenses</h1>
      
      <ExpenseList 
        openAddExpenseModal={handleOpenAddModal} 
        onEditExpense={handleEditExpense} 
      />
      
      <ExpenseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expenseToEdit={expenseToEdit}
      />
    </Container>
  );
};

export default Expenses;