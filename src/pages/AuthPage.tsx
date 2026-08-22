import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export const AuthPage: React.FC = () => {
  const { login, allEmployees } = useAuth();

  const [loginIdOrEmail, setLoginIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(loginIdOrEmail, password);
      if (!result.success) {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
      setIsLoading(false);
    }, 250);
  };

  const handleFillDemo = (loginId: string, pass: string) => {
    setLoginIdOrEmail(loginId);
    setPassword(pass);
    setError('');
  };

  const hrAdmin = allEmployees.find((e) => e.role === 'HR_ADMIN');
  const sampleEmployees = allEmployees.filter((e) => e.role === 'EMPLOYEE').slice(0, 4);

  return (
    <div className="min-h-screen bg-[#07080c] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Plus_Jakarta_Sans',sans-serif] relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle showLabel />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="flex items-center gap-3">
  {/* Dynamic Light / Dark Logo */}
  <img
    src={isDark ? '/Logo-dark.png' : '/Logo-light.png'}
    alt="Dayflow Logo"
    className="w-12 h-12 object-contain"
  />
  <div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">Dayflow</h1>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  HRMS
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Enterprise Human Resource Management</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 tracking-tight leading-snug">
              Secure Corporate Access for Staff & HR Leadership
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Dayflow coordinates real-time attendance, LOI-standardized employee credentials, leave management workflows, and attendance-linked payable day payroll.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#12141f] border border-purple-900/30 text-xs space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Strict Account Issuance Policy</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Normal employees do not have a public registration option. All employee profiles and login credentials (<code className="text-purple-300">LOI...</code>) are generated and provisioned by the HR Officer.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
              <span>PRE-CONFIGURED TEST ACCOUNTS</span>
              <span className="text-[10px] text-purple-400">Click to autofill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hrAdmin && (
                <button
                  type="button"
                  onClick={() => handleFillDemo(hrAdmin.loginId, hrAdmin.password)}
                  className="p-3 rounded-xl bg-purple-950/20 hover:bg-purple-900/30 border border-purple-800/40 text-left transition-all group flex items-center gap-3"
                >
                  <img
                    src={hrAdmin.avatarUrl}
                    alt={hrAdmin.name}
                    className="w-9 h-9 rounded-lg object-cover ring-1 ring-purple-500/40"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white group-hover:text-purple-300 truncate">
                      {hrAdmin.name}
                    </div>
                    <div className="text-[10px] text-purple-400 font-mono">HR Officer (Admin)</div>
                  </div>
                </button>
              )}

              {sampleEmployees.map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => handleFillDemo(emp.loginId, emp.password)}
                  className="p-3 rounded-xl bg-[#12141f] hover:bg-[#181b2a] border border-gray-800 text-left transition-all group flex items-center gap-3"
                >
                  <img
                    src={emp.avatarUrl}
                    alt={emp.name}
                    className="w-9 h-9 rounded-lg object-cover ring-1 ring-gray-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-gray-200 group-hover:text-white truncate">
                      {emp.name}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">{emp.jobPosition}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#11131c] border border-gray-800/90 shadow-2xl space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Sign In to Dayflow</h2>
              <p className="text-xs text-gray-400 mt-1">
                Enter your HR-issued Login ID or corporate email to proceed.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Login ID / Corporate Email</span>
                </label>
                <input
                  type="text"
                  required
                  value={loginIdOrEmail}
                  onChange={(e) => setLoginIdOrEmail(e.target.value)}
                  placeholder="e.g. LOIAASH20250001 or admin@dayflow.hr"
                  className="w-full px-4 py-3 rounded-xl bg-[#090a0f] border border-gray-800 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Password</span>
                  </label>
                  <span className="text-[11px] text-gray-500">Issued by HR</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-[#090a0f] border border-gray-800 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/25 disabled:opacity-50"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500">
                Need account access or forgot credentials? Contact your HR Officer (<span className="text-purple-400">admin@dayflow.hr</span>).
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};