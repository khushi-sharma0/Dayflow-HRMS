import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      id="theme-toggle-button"
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className={`group relative flex items-center gap-2 p-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 ${
        isDark
          ? 'bg-gray-800/60 hover:bg-gray-800 border-gray-700/70 text-amber-400 hover:text-amber-300 shadow-sm'
          : 'bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-purple-600 hover:text-purple-700 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="dark-moon"
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-center justify-center text-amber-400"
            >
              <Moon className="w-4 h-4 fill-amber-400/20 stroke-amber-400" />
            </motion.div>
          ) : (
            <motion.div
              key="light-sun"
              initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-center justify-center text-amber-500"
            >
              <Sun className="w-4 h-4 fill-amber-500/20 stroke-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showLabel && (
        <span className="text-xs font-semibold select-none pr-1">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
};
