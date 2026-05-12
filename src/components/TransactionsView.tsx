import React from 'react';
import { Transaction } from '../types';
import { TransactionItem } from './TransactionItem';
import { EmptyState } from './EmptyState';
import { AnimatePresence, motion } from 'motion/react';
import { Search, Filter } from 'lucide-react';

interface TransactionsViewProps {
  transactions: Transaction[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDeleteTransaction: (id: string) => void;
}

export function TransactionsView({ transactions, searchTerm, onSearchChange, onDeleteTransaction }: TransactionsViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search all transactions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-50 pl-11 pr-4 py-3 rounded-2xl text-sm border-none focus:ring-2 focus:ring-gray-200 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl text-sm font-semibold hover:bg-gray-100 transition-colors">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="bg-white rounded-[32px] p-8 border border-gray-50 shadow-sm">
        <h3 className="font-bold text-lg text-gray-900 tracking-tight mb-8">All Transactions</h3>
        <div className="space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
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
    </motion.div>
  );
}
