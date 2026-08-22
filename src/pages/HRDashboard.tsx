import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  UserPlus,
  CheckCircle2,
  ChevronRight,
  Building2,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { CreateEmployeeModal } from '../components/CreateEmployeeModal';
import { formatINR, formatIndianDate } from '../utils/formatters';

interface HRDashboardProps {
  onNavigate: (tab: 'dashboard' | 'employees' | 'attendance' | 'timeoff' | 'payroll' | 'profile', employeeId?: string) => void;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({ onNavigate }) => {
  const { allEmployees, currentUser, refreshUserData } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const employees = allEmployees.filter((e) => e.role === 'EMPLOYEE');
  const totalEmployees = employees.length;

  const presentEmployees = employees.filter((e) => e.status === 'present');
  const absentEmployees = employees.filter((e) => e.status === 'absent' || e.status === 'absent_no_leave');

  const timeOffRequests = StorageService.getTimeOffRequests();
  const pendingRequests = timeOffRequests.filter((r) => r.status === 'Pending');

  const currentMonthYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth();
  const totalEstimatedPayroll = employees.reduce((sum, emp) => {
    const breakdown = StorageService.calculateSalaryBreakdown(emp, currentMonthYear, currentMonthIdx);
    return sum + breakdown.netSalary;
  }, 0);

  const handleApproveLeave = (requestId: string) => {
    if (currentUser) {
      StorageService.reviewTimeOffRequest(requestId, 'Approved', `${currentUser.name} (HR)`);
      refreshUserData();
    }
  };

  const handleRejectLeave = (requestId: string) => {
    if (currentUser) {
      StorageService.reviewTimeOffRequest(requestId, 'Rejected', `${currentUser.name} (HR)`);
      refreshUserData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#141624] via-[#121420] to-[#0f111a] border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              India HR Administration Portal
            </span>
            <span className="text-xs text-gray-500">• {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })} (IST)</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1.5">
            Welcome back, {currentUser?.name}
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Overview of India workforce presence, onboarding pipelines, statutory leave approvals, and INR payroll ledgers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-purple-600/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard New Employee</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Total Workforce</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">{totalEmployees}</div>
            <p className="text-[11px] text-gray-500 mt-1">Active staff members across India</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Present Today</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">{presentEmployees.length}</div>
            <p className="text-[11px] text-emerald-400/80 mt-1">
              {totalEmployees > 0 ? Math.round((presentEmployees.length / totalEmployees) * 100) : 0}% attendance rate
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Absent / No Leave</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-400 tracking-tight">{absentEmployees.length}</div>
            <p className="text-[11px] text-rose-400/80 mt-1">Reduces payable days</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Pending Leaves</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400 tracking-tight">{pendingRequests.length}</div>
            <p className="text-[11px] text-amber-400/80 mt-1">Requires HR review</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">Today's Workforce Status (India)</h2>
              <span className="text-[11px] text-gray-400">({employees.length} employees)</span>
            </div>
            <button
              onClick={() => onNavigate('employees')}
              className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {employees.map((emp) => {
              let statusBadge = {
                color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                dot: 'bg-rose-500',
                label: 'Absent',
              };

              if (emp.status === 'present') {
                statusBadge = {
                  color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  dot: 'bg-emerald-500',
                  label: 'Present',
                };
              } else if (emp.status === 'absent_no_leave') {
                statusBadge = {
                  color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  dot: 'bg-amber-500',
                  label: 'Absent (No Leave)',
                };
              } else if (emp.status === 'on_leave') {
                statusBadge = {
                  color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                  dot: 'bg-blue-500',
                  label: 'On Approved Leave',
                };
              }

              return (
                <button
                  key={emp.id}
                  onClick={() => onNavigate('profile', emp.id)}
                  className="p-4 rounded-xl bg-[#12141f] hover:bg-[#181b2a] border border-gray-800/80 hover:border-purple-500/40 text-left transition-all group flex items-start justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={emp.avatarUrl}
                      alt={emp.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-700 group-hover:ring-purple-500/50 transition-all flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-white group-hover:text-purple-300 truncate">
                        {emp.name}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">{emp.jobPosition} • {emp.location}</div>
                      <div className="font-mono text-[10px] text-gray-500 truncate mt-0.5">{emp.loginId}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1.5 flex-shrink-0 ${statusBadge.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
                    <span>{statusBadge.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Pending Time-Off Requests
                </h3>
              </div>
              <button
                onClick={() => onNavigate('timeoff')}
                className="text-xs text-purple-400 hover:underline"
              >
                View all
              </button>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500 bg-[#0c0e14] rounded-xl border border-gray-800/60">
                <CheckCircle2 className="w-6 h-6 text-emerald-500/40 mx-auto mb-2" />
                No pending leave applications requiring approval.
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl bg-[#0b0c10] border border-gray-800/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white">{req.employeeName}</div>
                        <div className="text-[10px] text-gray-400">{req.department} • {req.type}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {req.days} {req.days === 1 ? 'day' : 'days'}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 italic">"{req.reason}"</p>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-gray-500 font-mono">
                        {formatIndianDate(req.startDate, 'short')} to {formatIndianDate(req.endDate, 'short')}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectLeave(req.id)}
                          className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-medium transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveLeave(req.id)}
                          className="px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#151326] to-[#0f111c] border border-purple-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Payable Days & Payroll (INR)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('payroll')}
                className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-medium"
              >
                <span>Full Ledger</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-400">Estimated Net Payroll (Current Month)</span>
              <div className="text-2xl font-black text-white font-mono">
                {formatINR(totalEstimatedPayroll)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090a0f]/60 border border-gray-800 text-[11px] space-y-1 text-gray-300">
              <div className="flex justify-between">
                <span>Standard Working Days:</span>
                <span className="font-semibold text-white">22 Days</span>
              </div>
              <div className="flex justify-between">
                <span>Unexcused / Unpaid Deductions:</span>
                <span className="font-semibold text-rose-400">Dynamic Synced</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEmployeeCreated={() => refreshUserData()}
      />
    </div>
  );
};