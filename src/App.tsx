/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout';
import DashboardOverview from './components/DashboardOverview';
import TransactionsList from './components/TransactionsList';
import Insights from './components/Insights';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'insights'>('overview');

  return (
    <FinanceProvider>
      <Toaster position="bottom-right" toastOptions={{ className: 'dark:bg-gray-800 dark:text-white' }} />
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'transactions' && <TransactionsList />}
        {activeTab === 'insights' && <Insights />}
      </Layout>
    </FinanceProvider>
  );
}
