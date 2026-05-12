/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Wallet, Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, TransactionSummary } from './types';
import { TransactionForm } from './components/TransactionForm';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { BudgetsView } from './components/BudgetsView';
import { InsightsView } from './components/InsightsView';
import { cn } from './lib/utils';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('saiful_tracker_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem('saiful_tracker_premium') === 'true';
  });
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('saiful_tracker_categories');
    return saved ? JSON.parse(saved) : [
      'Food', 'Transport', 'Rent', 'Salary', 'Entertainment', 'Shopping', 'Health', 'Others'
    ];
  });

  useEffect(() => {
    localStorage.setItem('saiful_tracker_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('saiful_tracker_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('saiful_tracker_premium', JSON.stringify(isPremium));
  }, [isPremium]);

  const summary = useMemo<TransactionSummary>(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    return {
      totalIncome: income,
      totalExpense: expense,
      totalBalance: income - expense,
    };
  }, [transactions]);

  const filteredTransactions = transactions
    .filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            summary={summary} 
            transactions={transactions} 
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'transactions':
        return (
          <TransactionsView 
            transactions={filteredTransactions} 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'budgets':
        return <BudgetsView transactions={transactions} categories={categories} />;
      case 'insights':
        return <InsightsView transactions={transactions} isPremium={isPremium} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-68 bg-white border-r border-gray-100 flex flex-col p-8 hidden md:flex shrink-0">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/30 rotate-3 group-hover:rotate-0 transition-transform">
            S
          </div>
          <span className="font-black text-2xl tracking-tighter leading-none italic">Saiful's<br /><span className="text-indigo-600 text-xs uppercase font-bold tracking-widest not-italic">Tracker Pro</span></span>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { id: 'dashboard', label: 'Dashboard', color: 'bg-blue-500' },
            { id: 'transactions', label: 'Transactions', color: 'bg-emerald-500' },
            { id: 'budgets', label: 'Budgets', color: 'bg-rose-500' },
            { id: 'insights', label: 'Insights', color: 'bg-purple-500' }
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "group flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden",
                activeTab === item.id 
                  ? "bg-gray-900 text-white shadow-lg shadow-black/10" 
                  : "text-gray-400 hover:text-black hover:bg-gray-50"
              )}
            >
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activeTab === item.id ? item.color : "bg-gray-200 group-hover:bg-gray-400"
              )} />
              <span className="text-sm font-bold tracking-tight uppercase leading-none">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeGlow"
                  className={cn("absolute inset-0 opacity-10", item.color)} 
                />
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto p-5 bg-gray-50 rounded-2xl relative overflow-hidden group">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">
            {isPremium ? 'Premium Plan Active' : 'Basic Plan'}
          </p>
          <p className="text-sm font-semibold mb-3 leading-tight">
            {isPremium ? 'Enjoy full access to advanced insights' : 'Unlock advanced analytics'}
          </p>
          {!isPremium ? (
            <button 
              onClick={() => {
                setIsPremium(true);
                alert("Welcome to Saiful's Tracker Premium! 🚀 All advanced analytics are now unlocked.");
              }}
              className="w-full bg-black text-white text-xs py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm relative z-10"
            >
              Upgrade Now
            </button>
          ) : (
            <button 
              onClick={() => setIsPremium(false)}
              className="w-full bg-gray-200 text-gray-600 text-xs py-2.5 rounded-xl font-semibold hover:bg-gray-300 transition-colors shadow-sm relative z-10"
            >
              Manage Plan
            </button>
          )}
          {isPremium && <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
            S
          </div>
          <span className="font-black text-xl tracking-tighter italic">Saiful's Tracker</span>
        </div>
        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
          <Wallet size={20} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto no-scrollbar pb-24 md:pb-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10 shrink-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight capitalize">{activeTab}</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">
              {activeTab === 'dashboard' ? 'Welcome back! Your balance is healthy.' : 
               activeTab === 'transactions' ? 'Keep track of every single expense.' :
               activeTab === 'budgets' ? 'Manage your spending limits wisely.' :
               'Smart insights powered by your data.'}
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-gray-100 shadow-sm outline-none"
              />
            </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
            >
              <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus size={16} />
              </div>
              Add Transaction
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      <TransactionForm 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onAdd={handleAddTransaction} 
        categories={categories}
        onAddCategory={handleAddCategory}
      />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around p-4 z-40">
        {[
          { id: 'dashboard', label: 'Home', color: 'bg-blue-500' },
          { id: 'transactions', label: 'History', color: 'bg-emerald-500' },
          { id: 'budgets', label: 'Budget', color: 'bg-rose-500' },
          { id: 'insights', label: 'Insights', color: 'bg-purple-500' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all relative py-1 px-3 rounded-xl",
              activeTab === item.id ? "text-black" : "text-gray-400"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeTabMobile"
                className={cn("absolute inset-0 opacity-10 rounded-xl", item.color)} 
              />
            )}
            <span className={cn(
              "w-1.5 h-1.5 rounded-full mb-1 transition-all",
              activeTab === item.id ? item.color : "bg-transparent"
            )}></span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
