import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface StatsCardProps {
  label: string;
  amount: number;
  type?: 'income' | 'expense' | 'neutral';
  icon: React.ReactNode;
  className?: string;
}

export function StatsCard({ label, amount, type = 'neutral', icon, className }: StatsCardProps) {
  const isIncome = type === 'income';
  const isExpense = type === 'expense';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center",
        isIncome ? "bg-emerald-50 text-emerald-600" : 
        isExpense ? "bg-rose-50 text-rose-600" : 
        "bg-gray-50 text-gray-600"
      )}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className={cn(
          "text-2xl font-semibold tracking-tight",
          isIncome ? "text-emerald-600" : 
          isExpense ? "text-rose-600" : 
          "text-gray-900"
        )}>
          {isExpense && amount !== 0 ? '-' : ''}৳{Math.abs(amount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </motion.div>
  );
}
