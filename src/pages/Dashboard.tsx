import React from 'react';
import Container from '../components/common/Container';
import WalletCard from '../components/dashboard/WalletCard';
import RecentExpenses from '../components/dashboard/RecentExpenses';
import BudgetOverview from '../components/dashboard/BudgetOverview';

const Dashboard: React.FC = () => {
  return (
    <Container>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <WalletCard />
        </div>
        <div className="md:col-span-2">
          <RecentExpenses />
        </div>
      </div>
      
      <div className="mb-8">
        <BudgetOverview />
      </div>
    </Container>
  );
};

export default Dashboard;