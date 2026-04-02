import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, TrendingDown, AlertCircle, Award, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../lib/utils';

export default function Insights() {
  const { transactions, isLoading } = useFinance();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter(tx => tx.type === 'expense');
    const income = transactions.filter(tx => tx.type === 'income');

    // Highest spending category
    const categories = expenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    let highestCategory = { name: 'None', amount: 0 };
    for (const [name, amount] of Object.entries(categories)) {
      if ((amount as number) > highestCategory.amount) {
        highestCategory = { name, amount: amount as number };
      }
    }

    // Monthly comparison based on the latest transaction date to avoid $0 when months change
    const latestTxDate = expenses.length > 0 
      ? new Date(Math.max(...expenses.map(tx => new Date(tx.date).getTime())))
      : new Date();
      
    const currentMonth = latestTxDate.getMonth();
    const currentYear = latestTxDate.getFullYear();
    
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentMonthExpense = 0;
    let prevMonthExpense = 0;

    expenses.forEach(tx => {
      const txDate = new Date(tx.date);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        currentMonthExpense += tx.amount;
      } else if (txDate.getMonth() === prevMonth && txDate.getFullYear() === prevYear) {
        prevMonthExpense += tx.amount;
      }
    });

    const expenseChange = prevMonthExpense === 0 
      ? 100 
      : ((currentMonthExpense - prevMonthExpense) / prevMonthExpense) * 100;

    // Largest single transaction
    const largestExpense = expenses.reduce((max, tx) => tx.amount > max.amount ? tx : max, { amount: 0, description: '' });

    // Smart Tip Logic
    let smartTip = { 
      title: "Savings Opportunity", 
      message: `You spent ${formatCurrency(0)} on Transport recently—great job using sustainable travel!`,
      type: "positive" 
    };

    if (categories['Transport'] > 0) {
      smartTip = { 
        title: "Budget Tip", 
        message: `You've spent ${((highestCategory.amount / (currentMonthExpense || 1)) * 100).toFixed(0)}% of your recent expenses on ${highestCategory.name}.`,
        type: "warning"
      };
    }

    return {
      highestCategory,
      currentMonthExpense,
      prevMonthExpense,
      expenseChange,
      largestExpense,
      smartTip
    };
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Financial Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start space-x-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <AlertCircle size={48} className="mb-4 text-gray-400" />
        <p className="text-lg">Not enough data to generate insights.</p>
        <p className="text-sm">Add some transactions to see your financial patterns.</p>
      </div>
    );
  }

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
      <h2 className="text-2xl font-bold">Financial Insights</h2>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Highest Category */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400 shrink-0">
            <Award size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Top Spending Category</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              You've spent the most on <span className="font-semibold text-gray-900 dark:text-gray-100">{insights.highestCategory.name}</span> overall.
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(insights.highestCategory.amount)}
            </p>
          </div>
        </motion.div>

        {/* Monthly Comparison */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start space-x-4">
          <div className={`p-3 rounded-full shrink-0 ${
            insights.expenseChange > 0 
              ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' 
              : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
          }`}>
            {insights.expenseChange > 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Recent Spending</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Your spending for this period is <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(insights.currentMonthExpense)}</span>.
            </p>
            <div className="flex items-center space-x-2">
              <span className={`font-bold ${insights.expenseChange > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {insights.expenseChange > 0 ? '+' : ''}{insights.expenseChange.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">vs previous period</span>
            </div>
          </div>
        </motion.div>

        {/* Largest Expense */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start space-x-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Largest Single Expense</h3>
            {insights.largestExpense.amount > 0 ? (
              <>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Your biggest single purchase was <span className="font-semibold text-gray-900 dark:text-gray-100">{insights.largestExpense.description}</span>.
                </p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(insights.largestExpense.amount)}
                </p>
              </>
            ) : (
              <p className="text-gray-500">No expenses recorded yet.</p>
            )}
          </div>
        </motion.div>

        {/* Smart Tip (4th Card) */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start space-x-4">
          <div className={`p-3 rounded-full shrink-0 ${
            insights.smartTip.type === 'positive' 
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
          }`}>
            <Lightbulb size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">{insights.smartTip.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {insights.smartTip.message}
            </p>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-2">
              AI-Powered Insight
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
