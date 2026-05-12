import React from 'react';
import { Transaction } from '../types';
import { motion } from 'motion/react';
import { TrendingUp, Award, Zap, ShieldCheck, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

interface InsightsViewProps {
  transactions: Transaction[];
  isPremium: boolean;
}

export function InsightsView({ transactions, isPremium }: InsightsViewProps) {
  // Calculate daily spending for the current week
  const start = startOfWeek(new Date());
  const end = endOfWeek(new Date());
  const days = eachDayOfInterval({ start, end });

  const weeklyData = days.map(day => {
    const total = transactions
      .filter(t => t.type === 'expense' && isSameDay(new Date(t.date), day))
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      day: format(day, 'EEE'),
      amount: total
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Advanced Chart Section */}
      <div className="relative">
        <div className={isPremium ? "" : "blur-md pointer-events-none grayscale opacity-50"}>
          <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm h-[400px]">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Weekly Spending Flow</h3>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => `৳${value.toLocaleString('en-BD')}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#000000" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {!isPremium && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
            <div className="w-16 h-16 bg-black text-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Unlock Advanced Analytics</h3>
            <p className="text-gray-500 max-w-sm mb-8 font-medium">
              Get deep insights into your spending habits with interactive charts, trend forecasting, and behavioral analysis.
            </p>
            <button 
              onClick={() => {
                const upgradeBtn = document.querySelector('button[onClick*="setIsPremium(true)"]') as HTMLElement;
                upgradeBtn?.click();
              }}
              className="px-8 py-4 bg-black text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-all"
            >
              Go Premium
            </button>
          </div>
        )}
      </div>

      {/* Grid Cards - These are always visible but show "locked" content if not premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm space-y-6">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Savings Potential</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              {isPremium ? (
                <>Based on your spending patterns, you could save an additional <span className="text-emerald-600 font-bold">৳3,500</span> this month by reducing non-essential shopping.</>
              ) : (
                "Upgrade to see your personalized savings potential based on current habits."
              )}
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
              {isPremium ? (
                <>Your savings-to-income ratio is <span className="text-white font-bold">24%</span>. This is in the top 10% of users in your category!</>
              ) : (
                "Discover your financial health score compared to peers in your area."
              )}
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </motion.div>
  );
}
