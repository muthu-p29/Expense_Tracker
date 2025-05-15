import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import { BarChart2, PieChart, Calendar, Download } from 'lucide-react';
import Button from '../components/common/Button';

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockCategories = [
  { id: 'food', name: 'Food', color: '#f87171' },
  { id: 'transport', name: 'Transportation', color: '#60a5fa' },
  { id: 'rent', name: 'Rent', color: '#34d399' },
  { id: 'utilities', name: 'Utilities', color: '#fbbf24' }
];

const mockExpenses = [
  { id: '1', amount: 120, category: 'food', date: new Date().toISOString() },
  { id: '2', amount: 300, category: 'rent', date: new Date().toISOString() },
  { id: '3', amount: 40, category: 'transport', date: new Date().toISOString() },
  { id: '4', amount: 90, category: 'utilities', date: new Date().toISOString() }
];

const Analytics: React.FC = () => {
  const { expenses: contextExpenses, categories: contextCategories } = useExpense();
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'year'>('30days');

  const expenses = contextExpenses?.length ? contextExpenses : mockExpenses;
  const categories = contextCategories?.length ? contextCategories : mockCategories;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const getFilteredExpenses = () => {
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeRange) {
      case '7days': cutoffDate.setDate(now.getDate() - 7); break;
      case '30days': cutoffDate.setDate(now.getDate() - 30); break;
      case '90days': cutoffDate.setDate(now.getDate() - 90); break;
      case 'year': cutoffDate.setFullYear(now.getFullYear() - 1); break;
    }

    return expenses.filter(expense => new Date(expense.date) >= cutoffDate);
  };

  const getCategorySpending = () => {
    const filtered = getFilteredExpenses();
    const totals: Record<string, number> = {};
    categories.forEach(c => { totals[c.id] = 0; });

    filtered.forEach(e => {
      const id = String(e.category);
      if (totals[id] !== undefined) totals[id] += e.amount;
    });

    return totals;
  };

  const getDailySpending = () => {
    const filtered = getFilteredExpenses();
    const range = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : timeRange === '90days' ? 90 : 365;
    const spending: Record<string, number> = {};

    for (let i = 0; i < range; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      spending[key] = 0;
    }

    filtered.forEach(e => {
      const d = e.date.split('T')[0];
      if (spending[d] !== undefined) spending[d] += e.amount;
    });

    return spending;
  };

  const renderBarChart = () => {
    const daily = getDailySpending();
    const days = Object.keys(daily).sort();
    const values = days.map(d => daily[d]);
    const max = Math.max(...values, 1);
    const maxHeight = 200;

    if (!values.some(v => v > 0)) return <p className="text-gray-500">No spending data to display.</p>;

    return (
      <div className="h-[260px] flex items-end justify-between space-x-2 border-t pt-4">
        {days.slice(-14).map(day => {
          const height = (daily[day] / max) * maxHeight;
          const label = new Date(day).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

          return (
            <div key={day} className="flex flex-col items-center">
              <div
                className="w-6 bg-emerald-500 rounded-t"
                style={{ height: `${Math.max(height, 4)}px` }}
              ></div>
              <div className="text-xs mt-1 text-gray-500 rotate-45 origin-top-left">{label}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPieChart = () => {
    const spending = getCategorySpending();
    const total = Object.values(spending).reduce((a, b) => a + b, 0);

    const data = categories.map(cat => ({
      name: cat.name,
      value: spending[cat.id] || 0,
      color: cat.color,
    })).filter(item => item.value > 0);

    if (!data.length) return <p className="text-gray-500">No spending data to display.</p>;

    return (
      <div>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <RePieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
            </RePieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {data.map(cat => (
            <div key={cat.name} className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: cat.color }}></div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const exportData = () => {
    alert('Export to CSV feature is coming soon!');
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-6 mt-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <Button onClick={exportData} variant="outline" icon={<Download size={16} />}>Export Data</Button>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Spending Analysis</h2>
            <p className="text-gray-500">
              Total: {formatCurrency(getFilteredExpenses().reduce((sum, e) => sum + e.amount, 0))}
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <BarChart2 size={20} className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Spending Trends</h2>
          </div>
          {renderBarChart()}
        </Card>
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <PieChart size={20} className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Spending by Category</h2>
          </div>
          {renderPieChart()}
        </Card>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex items-center mb-4">
          <Calendar size={20} className="text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Monthly Summary</h2>
        </div>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-gray-500 font-medium">Month</th>
              <th className="px-6 py-3 text-gray-500 font-medium text-right">Total Expenses</th>
              <th className="px-6 py-3 text-gray-500 font-medium text-right">Budget</th>
              <th className="px-6 py-3 text-gray-500 font-medium text-right">Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {['Current Month', 'Last Month', '2 Months Ago'].map((label, i) => {
              const spent = 2000 - i * 300;
              const budget = 2500;
              const diff = budget - spent;
              return (
                <tr key={label}>
                  <td className="px-6 py-4 font-medium">{label}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(spent)}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(budget)}</td>
                  <td className={`px-6 py-4 text-right font-medium ${diff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {diff >= 0 ? '+' : ''}{formatCurrency(diff)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </Container>
  );
};

export default Analytics;
