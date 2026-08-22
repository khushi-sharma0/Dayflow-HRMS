import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Clock,
  Calendar,
  IndianRupee,
  LayoutDashboard,
  Bell,
  LogOut,
  User,
  Shield,
  KeyRound,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { CreateEmployeeModal } from '../components/CreateEmployeeModal';
import { ThemeToggle } from '../components/ThemeToggle';
import { Role } from '../types';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'employees' | 'attendance' | 'timeoff' | 'payroll' | 'profile';
  onNavigate: (tab: 'dashboard' | 'employees' | 'attendance' | 'timeoff' | 'payroll' | 'profile', employeeId?: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeTab,
  onNavigate,
}) => {
  const { currentUser, role, logout, allEmployees, refreshUserData } = useAuth();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const notifications = currentUser
    ? StorageService.getNotifications(currentUser.id, role || 'EMPLOYEE')
    : [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    if (currentUser && role) {
      StorageService.markAllNotificationsRead(currentUser.id, role);
      refreshUserData();
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'timeoff', label: 'Time Off', icon: Calendar },
    ...(role === 'HR_ADMIN'
      ? [{ id: 'payroll', label: 'Payroll (INR)', icon: IndianRupee }]
      : []),
  ] as const;


  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0d0f17]/90 backdrop-blur-md border-b border-gray-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
                <span className="text-base tracking-tight font-black">D</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-white tracking-tight">Dayflow</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    HRMS
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-medium">Enterprise Suite</div>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Utilities: Quick Demo Switcher, HR New Employee, Notifications, User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Create Employee Button (HR Only) */}
            {role === 'HR_ADMIN' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-medium transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Employee</span>
              </button>
            )}

            {/* Authenticated Role Status Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12141f] border border-gray-800 text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-[11px] text-gray-300">
                {role === 'HR_ADMIN' ? 'HR Officer' : 'Staff'}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold uppercase">
                Auth Verified
              </span>
            </div>

            {/* Day / Night Theme Toggle */}
            <ThemeToggle />

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-xl bg-gray-800/40 hover:bg-gray-800 border border-gray-700/60 text-gray-300 hover:text-white transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Flyout */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#141724] border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-3.5 border-b border-gray-800 flex items-center justify-between bg-[#181c2d]/60">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Notifications</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                          {notifications.length}
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-purple-400 hover:text-purple-300 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-800/60">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-gray-500">
                          No notifications at this time
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3.5 text-xs transition-colors hover:bg-gray-800/40 ${
                              !n.read ? 'bg-purple-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-gray-200">{n.title}</span>
                              <span className="text-[10px] text-gray-500">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-gray-400 mt-1 leading-relaxed text-[11px]">{n.message}</p>
                            {n.linkTo && (
                              <button
                                onClick={() => {
                                  setShowNotifications(false);
                                  if (n.linkTo?.includes('time-off')) onNavigate('timeoff');
                                  if (n.linkTo?.includes('attendance')) onNavigate('attendance');
                                  if (n.linkTo?.includes('employees')) onNavigate('employees');
                                }}
                                className="mt-1.5 text-[10px] text-purple-400 hover:underline flex items-center gap-1"
                              >
                                <span>View details</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Avatar Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-xl bg-gray-800/40 hover:bg-gray-800 border border-gray-700/60 transition-colors focus:outline-none"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden lg:block text-left pr-1">
                    <div className="text-xs font-semibold text-white leading-tight truncate max-w-[100px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-purple-400 font-mono leading-tight truncate">
                      {currentUser.loginId}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-[#141724] border border-gray-700/80 rounded-2xl shadow-2xl p-2 z-50"
                    >
                      <div className="p-3 border-b border-gray-800">
                        <div className="font-semibold text-sm text-white">{currentUser.name}</div>
                        <div className="text-xs text-gray-400 truncate">{currentUser.email}</div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {currentUser.loginId}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                            {role === 'HR_ADMIN' ? 'HR Officer' : 'Staff Member'}
                          </span>
                        </div>
                      </div>

                      <div className="py-1.5 space-y-0.5">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onNavigate('profile', currentUser.id);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition-colors"
                        >
                          <User className="w-4 h-4 text-purple-400" />
                          <span>My Profile & Details</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onNavigate('profile', currentUser.id);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition-colors"
                        >
                          <KeyRound className="w-4 h-4 text-purple-400" />
                          <span>Security & Password</span>
                        </button>
                      </div>

                      <div className="pt-1.5 border-t border-gray-800">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Sub-Bar */}
        <div className="flex md:hidden items-center justify-around pt-3 mt-3 border-t border-gray-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg transition-colors ${
                  isActive ? 'text-purple-400' : 'text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer info */}
      <footer className="border-t border-gray-900 bg-[#07080c] py-4 px-4 text-center text-xs text-gray-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Dayflow HRMS • Confidential Corporate Infrastructure
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <span>Formula-Compliant LOI ID Generation</span>
            <span>•</span>
            <button
              onClick={() => {
                StorageService.resetToDefault();
                window.location.reload();
              }}
              className="hover:text-purple-400 transition-colors"
            >
              Reset Demo Records
            </button>
          </div>
        </div>
      </footer>

      {/* Modal for Creating Employee (HR only) */}
      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEmployeeCreated={(newEmp) => {
          onNavigate('employees');
        }}
      />
    </div>
  );
};
