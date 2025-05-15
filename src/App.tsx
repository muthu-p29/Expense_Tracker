import React, { useState } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Categories from './pages/Categories';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import ExpenseModal from './components/expenses/ExpenseModal';

function App() {
  const [activePage, setActivePage] = useState<'dashboard' | 'expenses' | 'categories' | 'budget' | 'analytics'>('dashboard');
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  
  // Listen for hash changes to update active page
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (['dashboard', 'expenses', 'categories', 'budget', 'analytics'].includes(hash)) {
      setActivePage(hash as any);
    }
  });
  
  const openAddExpenseModal = () => {
    setIsAddExpenseModalOpen(true);
  };
  
  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gray-50">
        <Header openAddExpenseModal={openAddExpenseModal} />
        
        <main className="py-6">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'expenses' && <Expenses />}
          {activePage === 'categories' && <Categories />}
          {activePage === 'budget' && <Budget />}
          {activePage === 'analytics' && <Analytics />}
        </main>
        
        <ExpenseModal 
          isOpen={isAddExpenseModalOpen}
          onClose={() => setIsAddExpenseModalOpen(false)}
        />
      </div>
    </ExpenseProvider>
  );
}

export default App;