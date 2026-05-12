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
      whileHover={{ y: -5 }}
      className={cn(
        "p-6 rounded-[32px] flex items-center gap-5 transition-all shadow-lg",
        isIncome ? "gradient-card-emerald" : 
        isExpense ? "gradient-card-rose" : 
        "gradient-card-blue",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center glass-effect">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{label}</p>
        <p className="text-2xl font-bold tracking-tight">
          {isExpense && amount !== 0 ? '-' : ''}৳{Math.abs(amount).toLocaleString('en-BD')}
        </p>
      </div>
    </motion.div>
  );
}
