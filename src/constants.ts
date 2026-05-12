import { Category } from './types';

export const DEFAULT_CATEGORIES: string[] = [
  'Food',
  'Transport',
  'Rent',
  'Salary',
  'Entertainment',
  'Shopping',
  'Health',
  'Others',
];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F87171',
  Transport: '#60A5FA',
  Rent: '#FBBF24',
  Salary: '#34D399',
  Entertainment: '#A78BFA',
  Shopping: '#F472B6',
  Health: '#FB923C',
  Others: '#94A3B8',
};

export const getCategoryColor = (category: string) => {
  return CATEGORY_COLORS[category] || '#94A3B8'; // Fallback to Others color
};
