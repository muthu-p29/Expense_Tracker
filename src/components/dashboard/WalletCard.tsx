import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../common/Card';
import { useExpense } from '../../context/ExpenseContext';

const WalletCard: React.FC = () => {
  const { getWalletBalance, calculateTotalSpent, budget } = useExpense();
  
  const balance = getWalletBalance();
  const spent = calculateTotalSpent();
  const total = budget.totalBudget;
  const percentSpent = ((spent / total) * 100).toFixed(0);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <Card className="p-6 h-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">My Wallet</h2>
        <Wallet size={24} />
      </div>
      
      <div className="mb-6">
        <span className="text-sm opacity-80">Current Balance</span>
        <div className="text-3xl font-bold mt-1">{formatCurrency(balance)}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
          <div className="flex items-center">
            <ArrowUpRight className="mr-2 text-red-200" size={16} />
            <span className="text-sm">Spent</span>
          </div>
          <div className="text-lg font-semibold mt-1">{formatCurrency(spent)}</div>
          <div className="text-xs mt-1">{percentSpent}% of budget</div>
        </div>
        
        <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
          <div className="flex items-center">
            <ArrowDownRight className="mr-2 text-green-200" size={16} />
            <span className="text-sm">Budget</span>
          </div>
          <div className="text-lg font-semibold mt-1">{formatCurrency(total)}</div>
          <div className="text-xs mt-1">
            {balance >= 0 ? 'On track' : 'Over budget'}
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white border-opacity-20">
        <div className="text-sm mb-2">Budget Utilization</div>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-2.5">
          <div
            className="bg-white h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(Number(percentSpent), 100)}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default WalletCard;