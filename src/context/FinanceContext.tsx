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

const initialTransactions: Transaction[] = [
  { id: '1', date: subDays(today, 30).toISOString(), amount: 5000, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: '2', date: subDays(today, 28).toISOString(), amount: 150, category: 'Groceries', type: 'expense', description: 'Supermarket' },
  { id: '3', date: subDays(today, 25).toISOString(), amount: 50, category: 'Transport', type: 'expense', description: 'Gas Station' },
  { id: '4', date: subDays(today, 20).toISOString(), amount: 120, category: 'Dining', type: 'expense', description: 'Dinner with friends' },
  { id: '5', date: subDays(today, 15).toISOString(), amount: 800, category: 'Rent', type: 'expense', description: 'Apartment Rent' },
  { id: '6', date: subDays(today, 10).toISOString(), amount: 200, category: 'Utilities', type: 'expense', description: 'Electricity Bill' },
  { id: '7', date: subDays(today, 5).toISOString(), amount: 300, category: 'Freelance', type: 'income', description: 'Web Design Project' },
  { id: '8', date: subDays(today, 2).toISOString(), amount: 60, category: 'Entertainment', type: 'expense', description: 'Movie Tickets' },
  { id: '9', date: today.toISOString(), amount: 5000, category: 'Salary', type: 'income', description: 'Monthly Salary' },
];

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
        setTransactions(JSON.parse(saved));
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
