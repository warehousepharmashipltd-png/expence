import React from 'react';
import { LayoutGrid, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction, TransactionSummary } from '../types';
import { StatsCard } from './StatsCard';
import { TransactionItem } from './TransactionItem';
import { SummaryChart } from './SummaryChart';
import { EmptyState } from './EmptyState';
import { AnimatePresence, motion } from 'motion/react';

interface DashboardViewProps {
  summary: TransactionSummary;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function DashboardView({ summary, transactions, onDeleteTransaction }: DashboardViewProps) {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          label="Total Balance" 
          amount={summary.totalBalance} 
          icon={<LayoutGrid size={20} />} 
        />
        <StatsCard 
          label="Monthly Income" 
          amount={summary.totalIncome} 
          type="income" 
          icon={<ArrowUpRight size={20} />} 
        />
        <StatsCard 
          label="Monthly Spending" 
          amount={summary.totalExpense} 
          type="expense" 
          icon={<ArrowDownLeft size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-7 flex flex-col">
          <div className="bg-white rounded-[32px] p-8 border border-gray-50 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-900 tracking-tight">Recent Activity</h3>
            </div>
            
            <div className="space-y-2">
              <AnimatePresence initial={false} mode="popLayout">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <div key={tx.id}>
                      <TransactionItem 
                        transaction={tx} 
                        onDelete={onDeleteTransaction} 
                      />
                    </div>
                  ))
                ) : (
                  <EmptyState key="empty" />
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <SummaryChart transactions={transactions} />
          
          <div className="bg-black text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Insights</p>
              <h3 className="text-lg font-semibold mb-3 tracking-tight">Smart Savings</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                You've spent <span className="text-white">12% more</span> on groceries this week. Consider bulk buying.
              </p>
            </div>
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
