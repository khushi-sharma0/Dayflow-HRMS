import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  LogIn,
  LogOut,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { ApplyLeaveModal } from '../components/ApplyLeaveModal';
import { formatIndianDate } from '../utils/formatters';

interface EmployeeDashboardProps {
  onNavigate: (tab: 'dashboard' | 'employees' | 'attendance' | 'timeoff' | 'payroll' | 'profile', employeeId?: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigate }) => {
  const { currentUser, refreshUserData } = useAuth();
  
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const todayRecord = StorageService.getTodayAttendanceRecord(currentUser.id);
  const attendanceHistory = StorageService.getEmployeeAttendance(currentUser.id);
  const timeOffRequests = StorageService.getEmployeeTimeOffRequests(currentUser.id);
  const isCheckedIn = currentUser.status === 'present' && !!todayRecord?.checkIn && !todayRecord?.checkOut;

  const currentMonthYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth();
  const salaryBreakdown = StorageService.calculateSalaryBreakdown(currentUser, currentMonthYear, currentMonthIdx);

  const handleCheckIn = () => {
    try {
      StorageService.checkIn(currentUser.id);
      refreshUserData();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCheckOut = () => {
    try {
      StorageService.checkOut(currentUser.id);
      refreshUserData();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#141624] via-[#121420] to-[#0f111a] border border-gray-800">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/20"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                {currentUser.loginId}
              </span>
              <span className="text-xs text-gray-500">• {currentUser.department}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs text-gray-400">{currentUser.jobPosition} • {currentUser.companyName} ({currentUser.location})</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#0b0c12]/80 border border-gray-800 px-4 py-3 rounded-xl self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Indian Standard Time (IST)</div>
            <div className="text-lg font-mono font-bold text-purple-300">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
            <div className="text-[11px] text-gray-400">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-[#12141f] border border-gray-800 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Attendance Desk
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Status:</span>
                {currentUser.status === 'present' ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Present / In Office</span>
                  </span>
                ) : currentUser.status === 'on_leave' ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>On Approved Leave</span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>Not Checked In</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#0b0c10] border border-gray-800/80">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Today's Check In (IST)</span>
                <div className="font-mono text-base font-bold text-emerald-400">
                  {todayRecord?.checkIn || '--:--'}
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-500 block mb-1">Today's Check Out (IST)</span>
                <div className="font-mono text-base font-bold text-purple-400">
                  {todayRecord?.checkOut || (isCheckedIn ? 'Active Now' : '--:--')}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {!isCheckedIn ? (
                <button
                  onClick={handleCheckIn}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Check In (Mark Present)</span>
                </button>
              ) : (
                <button
                  onClick={handleCheckOut}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Check Out</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-gray-500 text-center">
              Checking in updates your attendance status in real time and contributes to your payable working days.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Payable Days & Month Status
                </h3>
              </div>
              <button
                onClick={() => onNavigate('attendance')}
                className="text-xs text-purple-400 hover:underline"
              >
                View full log
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800">
                <div className="text-[10px] text-gray-500">Standard Days</div>
                <div className="text-lg font-bold text-white mt-0.5">
                  {salaryBreakdown.standardWorkingDays}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800">
                <div className="text-[10px] text-gray-500">Present Logged</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">
                  {salaryBreakdown.presentDays}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40">
                <div className="text-[10px] text-purple-300 font-semibold">Payable Days</div>
                <div className="text-lg font-black text-purple-300 mt-0.5">
                  {salaryBreakdown.payableDays}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-[#12141f] border border-gray-800 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Time-Off Balances
                </h2>
              </div>
              <button
                onClick={() => setIsApplyLeaveOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md shadow-purple-600/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apply for Leave</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#0b0c10] border border-gray-800 space-y-2">
                <span className="text-[11px] text-gray-400 font-medium">Paid Time Off (PTO)</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-purple-300">
                    {currentUser.leaveBalance.paidTimeOff.total - currentUser.leaveBalance.paidTimeOff.used}
                  </span>
                  <span className="text-xs text-gray-500">/ {currentUser.leaveBalance.paidTimeOff.total} left</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{
                      width: `${((currentUser.leaveBalance.paidTimeOff.total - currentUser.leaveBalance.paidTimeOff.used) / currentUser.leaveBalance.paidTimeOff.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0b0c10] border border-gray-800 space-y-2">
                <span className="text-[11px] text-gray-400 font-medium">Sick Time Off</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-teal-300">
                    {currentUser.leaveBalance.sickTimeOff.total - currentUser.leaveBalance.sickTimeOff.used}
                  </span>
                  <span className="text-xs text-gray-500">/ {currentUser.leaveBalance.sickTimeOff.total} left</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{
                      width: `${((currentUser.leaveBalance.sickTimeOff.total - currentUser.leaveBalance.sickTimeOff.used) / currentUser.leaveBalance.sickTimeOff.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0b0c10] border border-gray-800 space-y-2">
                <span className="text-[11px] text-gray-400 font-medium">Unpaid Leave</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-amber-300">
                    {currentUser.leaveBalance.unpaidLeave.used}
                  </span>
                  <span className="text-xs text-gray-500">days taken</span>
                </div>
                <span className="text-[10px] text-amber-400/80 block">Affects payable days</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                My Time-Off Requests
              </h3>
              <button
                onClick={() => onNavigate('timeoff')}
                className="text-xs text-purple-400 hover:underline"
              >
                View all
              </button>
            </div>

            {timeOffRequests.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500 bg-[#0c0e14] rounded-xl border border-gray-800/60">
                No leave requests filed yet.
              </div>
            ) : (
              <div className="space-y-2">
                {timeOffRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{req.type}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {formatIndianDate(req.startDate, 'short')} to {formatIndianDate(req.endDate, 'short')} ({req.days} days)
                      </div>
                    </div>
                    <div>
                      {req.status === 'Approved' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Approved
                        </span>
                      )}
                      {req.status === 'Pending' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Pending HR Review
                        </span>
                      )}
                      {req.status === 'Rejected' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ApplyLeaveModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        onRequestSubmitted={() => refreshUserData()}
      />
    </div>
  );
};