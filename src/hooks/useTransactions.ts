import { useMemo, useState } from 'react';
import { Transaction } from '../types';

export function useTransactions(transactions: Transaction[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredAndSortedTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchesSearch =
          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || tx.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [transactions, searchTerm, filterType, sortOrder]);

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    sortOrder,
    setSortOrder,
    filteredAndSortedTransactions,
  };
}
