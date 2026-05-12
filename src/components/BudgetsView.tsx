import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Transaction } from '../types';
import { getCategoryColor } from '../constants';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface BudgetsViewProps {
  transactions: Transaction[];
  categories: string[];
}

export function BudgetsView({ transactions, categories }: BudgetsViewProps) {
  const expenseCategories = categories.filter(c => c !== 'Salary');
  
  // Calculate spending per category
  const spendingByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Mock budgets
  const budgets: Record<string, number> = {
    Food: 15000,
    Transport: 5000,
    Rent: 30000,
    Entertainment: 8000,
    Shopping: 10000,
    Health: 4000,
    Others: 5000,
  };

  const chartData = expenseCategories.map(cat => ({
    name: cat,
    spent: spendingByCategory[cat] || 0,
    budget: budgets[cat] || 10000,
    color: getCategoryColor(cat)
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Overview Chart */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm h-[400px]">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Budget vs Spending</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={(value) => `৳${value}`}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => `৳${value.toLocaleString('en-BD')}`}
            />
            <Bar dataKey="spent" name="Spent" radius={[6, 6, 0, 0]} barSize={24}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
            <Bar dataKey="budget" name="Budget" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {expenseCategories.map((category) => {
          const spent = spendingByCategory[category] || 0;
          const budget = budgets[category] || 10000;
          const percentage = Math.min((spent / budget) * 100, 100);
          const color = getCategoryColor(category);

          return (
            <div key={category} className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <h4 className="font-bold text-gray-900 tracking-tight">{category}</h4>
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest",
                  spent > budget ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"
                )}>
                  {percentage.toFixed(0)}% Used
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-2xl font-bold tracking-tight text-gray-900">
                    ৳{spent.toLocaleString('en-BD')}
                  </p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Limit: ৳{budget.toLocaleString('en-BD')}
                  </p>
                </div>
                
                <div className="h-3 rounded-full bg-gray-50 overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full rounded-full transition-all duration-1000 relative"
                    style={{ 
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}40`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </motion.div>
                </div>
                
                {spent > budget && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-rose-500 font-bold uppercase tracking-widest flex items-center gap-1"
                  >
                    <span className="animate-pulse">⚠️</span> Budget exceeded by ৳{(spent - budget).toLocaleString('en-BD')}
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
