import React, { ReactNode } from 'react';
import { useFinance } from '../context/FinanceContext';
import { LayoutDashboard, List, PieChart, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
  activeTab: 'overview' | 'transactions' | 'insights';
  setActiveTab: (tab: 'overview' | 'transactions' | 'insights') => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { role, setRole, isDarkMode, toggleDarkMode } = useFinance();

  const handleRoleChange = (newRole: 'viewer' | 'admin') => {
    setRole(newRole);
    if (newRole === 'viewer') {
      toast('Role switched to Viewer. Editing disabled.', { icon: '👁️' });
    } else {
      toast.success('Role switched to Admin. Editing enabled.');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'insights', label: 'Insights', icon: PieChart },
  ] as const;

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col fixed h-full z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">FinDash</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</span>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value as 'viewer' | 'admin')}
              className="text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header (Visible only on Mobile) */}
      <header className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">FinDash</h1>
        <div className="flex items-center space-x-3">
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value as 'viewer' | 'admin')}
            className="text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-200 cursor-pointer"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-8 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Visible only on Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around p-2 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors w-full ${
                activeTab === item.id
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <Icon size={24} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
