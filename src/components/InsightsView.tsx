import React from 'react';
import { Transaction } from '../types';
import { motion } from 'motion/react';
import { TrendingUp, Award, Zap, ShieldCheck } from 'lucide-react';

interface InsightsViewProps {
  transactions: Transaction[];
}

export function InsightsView({ transactions }: InsightsViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm space-y-6">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
          <TrendingUp size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Savings Potential</h3>
          <p className="text-gray-500 leading-relaxed font-medium">
            Based on your spending patterns, you could save an additional <span className="text-emerald-600 font-bold">৳3,500</span> this month by reducing non-essential shopping.
          </p>
        </div>
      </div>

      <div className="bg-black text-white p-8 rounded-[40px] shadow-xl space-y-6 relative overflow-hidden">
        <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center">
          <Award size={24} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold tracking-tight mb-2">Financial Health</h3>
          <p className="text-gray-400 leading-relaxed font-medium">
            Your savings-to-income ratio is <span className="text-white font-bold">24%</span>. This is in the top 10% of users in your category!
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm space-y-6">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <Zap size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Spending Velocity</h3>
          <p className="text-gray-500 leading-relaxed font-medium">
            Your spending has decelerated by <span className="text-blue-600 font-bold">15%</span> compared to last month. Great job controlling impulse buys!
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm space-y-6">
        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Subscription Audit</h3>
          <p className="text-gray-500 leading-relaxed font-medium">
            We found <span className="text-purple-600 font-bold">2 duplicate</span> Netflix-style charges. You might want to review your payment methods.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
