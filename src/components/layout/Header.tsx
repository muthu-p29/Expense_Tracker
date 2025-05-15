import React, { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { Menu, X, BarChart2, PieChart, Home, Plus, DollarSign } from 'lucide-react';
import Container from '../common/Container';
import Button from '../common/Button';

interface HeaderProps {
  openAddExpenseModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openAddExpenseModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getWalletBalance } = useExpense();
  const balance = getWalletBalance();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <Container>
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-emerald-600">Expense</span>
            <span className="text-2xl font-light text-gray-700">Tracker</span>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#dashboard" className="flex items-center text-gray-700 hover:text-emerald-600">
              <Home size={18} className="mr-1" />
              <span>Dashboard</span>
            </a>
            <a href="#expenses" className="flex items-center text-gray-700 hover:text-emerald-600">
              <DollarSign size={18} className="mr-1" />
              <span>Expenses</span>
            </a>
            <a href="#analytics" className="flex items-center text-gray-700 hover:text-emerald-600">
              <BarChart2 size={18} className="mr-1" />
              <span>Analytics</span>
            </a>
            <a href="#budget" className="flex items-center text-gray-700 hover:text-emerald-600">
              <PieChart size={18} className="mr-1" />
              <span>Budget</span>
            </a>
            <div className="ml-4 px-4 py-2 rounded-md bg-gray-50 border border-gray-200">
              <span className="text-sm text-gray-500">Balance</span>
              <div className={`font-semibold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </div>
            </div>
            <Button
              onClick={openAddExpenseModal}
              variant="primary"
              icon={<Plus size={16} />}
            >
              Add Expense
            </Button>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-200">
            <nav className="flex flex-col space-y-3 py-3">
              <a href="#dashboard" className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <Home size={18} className="mr-2" />
                <span>Dashboard</span>
              </a>
              <a href="#expenses" className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <DollarSign size={18} className="mr-2" />
                <span>Expenses</span>
              </a>
              <a href="#analytics" className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <BarChart2 size={18} className="mr-2" />
                <span>Analytics</span>
              </a>
              <a href="#budget" className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <PieChart size={18} className="mr-2" />
                <span>Budget</span>
              </a>
              <div className="flex justify-between items-center px-3 py-2">
                <span className="text-gray-500">Current Balance:</span>
                <span className={`font-semibold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(balance)}
                </span>
              </div>
              <Button
                onClick={openAddExpenseModal}
                variant="primary"
                icon={<Plus size={16} />}
                fullWidth
              >
                Add Expense
              </Button>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;