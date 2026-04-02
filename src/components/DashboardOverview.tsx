import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardOverview() {
  const { transactions } = useFinance();

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.type === 'income') {
          acc.totalIncome += tx.amount;
          acc.balance += tx.amount;
        } else {
          acc.totalExpense += tx.amount;
          acc.balance -= tx.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  }, [transactions]);

  const balanceTrendData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let currentBalance = 0;
    return sorted.map((tx) => {
      currentBalance += tx.type === 'income' ? tx.amount : -tx.amount;
      return {
        date: format(parseISO(tx.date), 'MMM dd'),
        balance: currentBalance,
      };
    });
  }, [transactions]);

  const spendingBreakdown = useMemo(() => {
    const expenses = transactions.filter((tx) => tx.type === 'expense');
    const categories = expenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>

      {/* Summary Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</p>
              <p className="text-3xl font-bold mt-2">${balance.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
              <DollarSign size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</p>
              <p className="text-3xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
              <p className="text-3xl font-bold mt-2 text-rose-600 dark:text-rose-400">${totalExpense.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-full text-rose-600 dark:text-rose-400">
              <ArrowDownRight size={24} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Balance Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={balanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6' }}
                  itemStyle={{ color: '#f3f4f6' }}
                />
                <Line type="monotone" dataKey="balance" stroke="#4f46e5" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Spending Breakdown</h3>
          <div className="h-[300px]">
            {spendingBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {spendingBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6' }}
                    itemStyle={{ color: '#f3f4f6' }}
                    formatter={(value: number) => `$${value}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No expense data available
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
