import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Role } from '../types';

interface FinanceContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  role: Role;
  setRole: (role: Role) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const today = new Date();
const subDays = (date: Date, days: number) => new Date(date.getTime() - days * 24 * 60 * 60 * 1000);

const generateDailyTransactions = (): Transaction[] => {
  const txs: Transaction[] = [];
  let idCounter = 1;
  
  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i).toISOString();

    // 1. Daily expense (Coffee/Lunch)
    txs.push({
      id: `auto-${idCounter++}`,
      date,
      amount: Math.floor(Math.random() * 25) + 10, // $10 - $35
      category: 'Dining',
      type: 'expense',
      description: 'Daily Coffee & Lunch'
    });

    // 2. Weekly Groceries (Every 7 days)
    if (i % 7 === 0) {
      txs.push({
        id: `auto-${idCounter++}`,
        date,
        amount: Math.floor(Math.random() * 150) + 80, // $80 - $230
        category: 'Groceries',
        type: 'expense',
        description: 'Supermarket Run'
      });
    }

    // 3. Monthly Rent (15 days ago)
    if (i === 15) {
      txs.push({
        id: `auto-${idCounter++}`,
        date,
        amount: 1200,
        category: 'Rent',
        type: 'expense',
        description: 'Apartment Rent'
      });
      
      txs.push({
        id: `auto-${idCounter++}`,
        date,
        amount: 150,
        category: 'Utilities',
        type: 'expense',
        description: 'Electric & Water Bill'
      });
    }

    // 4. Bi-weekly Salary (30 days ago and Today)
    if (i === 30 || i === 0) {
      txs.push({
        id: `auto-${idCounter++}`,
        date,
        amount: 3500,
        category: 'Salary',
        type: 'income',
        description: 'Bi-weekly Salary'
      });
    }
    
    // 5. Random entertainment/shopping every few days
    if (i % 4 === 0) {
      txs.push({
        id: `auto-${idCounter++}`,
        date,
        amount: Math.floor(Math.random() * 100) + 20,
        category: i % 8 === 0 ? 'Shopping' : 'Entertainment',
        type: 'expense',
        description: i % 8 === 0 ? 'Amazon Purchase' : 'Movie / Subscription'
      });
    }
  }
  
  // Return sorted from newest to oldest
  return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const initialTransactions: Transaction[] = generateDailyTransactions();

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem('finance_role');
    return (saved as Role) || 'viewer';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('finance_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Mock API integration
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const saved = localStorage.getItem('finance_transactions');
      if (saved) {
        let parsedTransactions: Transaction[] = JSON.parse(saved);
        
        // Force upgrade to the new daily dataset if they have the old sparse data (less than 20 items)
        if (parsedTransactions.length < 20) {
          parsedTransactions = initialTransactions;
          localStorage.setItem('finance_transactions', JSON.stringify(parsedTransactions));
        } else if (parsedTransactions.length > 0) {
          // PORTFOLIO TRICK: Auto-shift dates forward so the dashboard always looks fresh
          const maxDate = new Date(Math.max(...parsedTransactions.map(tx => new Date(tx.date).getTime())));
          const today = new Date();
          
          // Reset hours to compare just the calendar days
          maxDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          
          const diffTime = today.getTime() - maxDate.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
          
          // If the latest transaction is older than today, shift all data forward
          if (diffDays > 0) {
            parsedTransactions = parsedTransactions.map(tx => {
              const txDate = new Date(tx.date);
              txDate.setDate(txDate.getDate() + diffDays);
              return { ...tx, date: txDate.toISOString() };
            });
            // Save the shifted dates back to storage
            localStorage.setItem('finance_transactions', JSON.stringify(parsedTransactions));
          }
        }
        
        setTransactions(parsedTransactions);
      } else {
        setTransactions(initialTransactions);
      }
      setIsLoading(false);
    };
    
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finance_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { ...tx, id: Math.random().toString(36).substring(2, 9) };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const editTransaction = (id: string, updatedTx: Omit<Transaction, 'id'>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...updatedTx, id } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        isLoading,
        addTransaction,
        editTransaction,
        deleteTransaction,
        role,
        setRole,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
