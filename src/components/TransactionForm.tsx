import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, TransactionType } from '../types';
import { cn } from '../lib/utils';

interface TransactionFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
}

export function TransactionForm({ isOpen, onOpenChange, onAdd, categories, onAddCategory }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<string>('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      amount: parseFloat(amount),
      type,
      category,
      description,
      date,
    });

    setAmount('');
    setDescription('');
    onOpenChange(false);
  };

  const handleCreateCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  return (
    <>
      <button
        onClick={() => onOpenChange(true)}
        aria-label="Add"
        className="fixed bottom-24 md:bottom-8 right-6 md:right-8 w-16 h-16 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 hover:scale-110 active:scale-90 transition-all z-50 group"
      >
        <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Add Transaction</h2>
                <button onClick={() => onOpenChange(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex p-1.5 bg-gray-100 rounded-2xl">
                  {(['expense', 'income'] as TransactionType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={cn(
                        "flex-1 py-2.5 px-4 rounded-[12px] text-xs font-bold uppercase tracking-wider transition-all",
                        type === t ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-light text-gray-300">৳</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-5xl font-light bg-transparent border-none focus:ring-0 p-0 pl-8 placeholder:text-gray-100 text-gray-900"
                    autoFocus
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Starbucks, Rent, Salary"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-gray-100 focus:bg-white transition-all outline-none text-gray-900 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2.5 ml-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Category
                        </label>
                        <button 
                          type="button"
                          onClick={() => setIsAddingCategory(!isAddingCategory)}
                          className="text-[10px] font-bold text-black border-b border-black uppercase tracking-widest"
                        >
                          {isAddingCategory ? 'Select' : 'New'}
                        </button>
                      </div>
                      
                      {isAddingCategory ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-gray-100 focus:bg-white transition-all outline-none text-gray-900 font-medium text-sm"
                          />
                          <button 
                            type="button"
                            onClick={handleCreateCategory}
                            className="px-4 bg-black text-white rounded-2xl"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      ) : (
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-gray-100 focus:bg-white transition-all outline-none text-gray-900 font-medium appearance-none"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-gray-100 focus:bg-white transition-all outline-none text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4.5 bg-black text-white rounded-2xl font-bold tracking-tight shadow-xl shadow-black/10 hover:bg-gray-800 active:scale-[0.98] transition-all"
                >
                  Confirm Transaction
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
