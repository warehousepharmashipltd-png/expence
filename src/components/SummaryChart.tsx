import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction } from '../types';
import { getCategoryColor } from '../constants';
import { motion } from 'motion/react';

interface SummaryChartProps {
  transactions: Transaction[];
}

export function SummaryChart({ transactions }: SummaryChartProps) {
  const expensesOnly = transactions.filter(t => t.type === 'expense');
  
  const categoryData = expensesOnly.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  if (categoryData.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm h-[320px] flex flex-col"
    >
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Spending Breakdown</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => `৳${value.toLocaleString('en-BD')}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
