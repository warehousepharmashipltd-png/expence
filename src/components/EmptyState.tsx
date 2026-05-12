import { Wallet } from 'lucide-react';
import { motion } from 'motion/react';

export function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6 text-gray-200">
        <Wallet size={40} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions yet</h3>
      <p className="text-gray-400 max-w-[240px]">Start tracking your expenses by adding your first transaction.</p>
    </motion.div>
  );
}
