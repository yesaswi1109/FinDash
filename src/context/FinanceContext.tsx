import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Role } from '../types';

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  role: Role;
  setRole: (role: Role) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const initialTransactions: Transaction[] = [
  { id: '1', date: '2026-03-01T10:00:00Z', amount: 5000, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: '2', date: '2026-03-02T12:30:00Z', amount: 150, category: 'Groceries', type: 'expense', description: 'Supermarket' },
  { id: '3', date: '2026-03-05T09:15:00Z', amount: 50, category: 'Transport', type: 'expense', description: 'Gas Station' },
  { id: '4', date: '2026-03-10T18:45:00Z', amount: 120, category: 'Dining', type: 'expense', description: 'Dinner with friends' },
  { id: '5', date: '2026-03-15T14:20:00Z', amount: 800, category: 'Rent', type: 'expense', description: 'Apartment Rent' },
  { id: '6', date: '2026-03-20T11:00:00Z', amount: 200, category: 'Utilities', type: 'expense', description: 'Electricity Bill' },
  { id: '7', date: '2026-03-25T16:30:00Z', amount: 300, category: 'Freelance', type: 'income', description: 'Web Design Project' },
  { id: '8', date: '2026-03-28T08:00:00Z', amount: 60, category: 'Entertainment', type: 'expense', description: 'Movie Tickets' },
  { id: '9', date: '2026-04-01T09:00:00Z', amount: 5000, category: 'Salary', type: 'income', description: 'Monthly Salary' },
];

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem('finance_role');
    return (saved as Role) || 'viewer';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('finance_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

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
