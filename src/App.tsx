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

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'insights'>('overview');

  return (
    <FinanceProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'transactions' && <TransactionsList />}
        {activeTab === 'insights' && <Insights />}
      </Layout>
    </FinanceProvider>
  );
}
