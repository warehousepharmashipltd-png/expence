import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Utensils, Car, Home, Wallet, Film, ShoppingBag, HeartPulse, MoreHorizontal } from 'lucide-react';
import { Transaction, Category } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Food: <Utensils size={18} />,
  Transport: <Car size={18} />,
  Rent: <Home size={18} />,
  Salary: <Wallet size={18} />,
  Entertainment: <Film size={18} />,
  Shopping: <ShoppingBag size={18} />,
  Health: <HeartPulse size={18} />,
  Others: <MoreHorizontal size={18} />,
};

export function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  const icon = CATEGORY_ICONS[transaction.category] || <MoreHorizontal size={18} />;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="group flex items-center gap-4 p-4 hover:bg-gray-50/80 rounded-2xl transition-all border border-transparent hover:border-gray-100"
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
        isIncome ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"
      )}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate tracking-tight">{transaction.description}</h4>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{transaction.category} • {format(new Date(transaction.date), 'MMM d, yyyy')}</p>
      </div>

      <div className="text-right">
        <p className={cn(
          "text-sm font-bold tracking-tight",
          isIncome ? "text-emerald-500" : "text-gray-900"
        )}>
          {isIncome ? '+' : '-'}৳{transaction.amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <button
        onClick={() => onDelete(transaction.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-rose-500 transition-all rounded-xl hover:bg-rose-50"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}
