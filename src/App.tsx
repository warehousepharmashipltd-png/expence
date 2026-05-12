/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Wallet, Search } from 'lucide-react';
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
    const saved = localStorage.getItem('spendwise_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('spendwise_categories');
    return saved ? JSON.parse(saved) : [
      'Food', 'Transport', 'Rent', 'Salary', 'Entertainment', 'Shopping', 'Health', 'Others'
    ];
  });

  useEffect(() => {
    localStorage.setItem('spendwise_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('spendwise_categories', JSON.stringify(categories));
  }, [categories]);

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
        return <InsightsView transactions={transactions} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col p-8 hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Wallet size={16} className="text-white" />
          </div>
          <span className="font-semibold text-xl tracking-tight">Equinox</span>
        </div>
        
        <nav className="space-y-6 flex-1">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'budgets', label: 'Budgets' },
            { id: 'insights', label: 'Insights' }
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-4 cursor-pointer transition-colors text-sm",
                activeTab === item.id ? "text-black font-semibold" : "text-gray-400 hover:text-gray-600 font-medium"
              )}
            >
              <span className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                activeTab === item.id ? "bg-black" : "bg-transparent"
              )}></span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="mt-auto p-5 bg-gray-50 rounded-2xl">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Premium Plan</p>
          <p className="text-sm font-semibold mb-3 leading-tight">Unlock advanced analytics</p>
          <button className="w-full bg-black text-white text-xs py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm">Upgrade</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto no-scrollbar">
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
              className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-semibold shadow-lg shadow-black/10 hover:bg-gray-800 transition-all active:scale-95"
            >
              + Add Transaction
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
    </div>
  );
}
