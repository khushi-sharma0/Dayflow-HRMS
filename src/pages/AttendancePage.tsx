import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { AttendanceRecord } from '../types';
import { formatIndianDate } from '../utils/formatters';

export const AttendancePage: React.FC = () => {
  const { currentUser, role, allEmployees, refreshUserData } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  if (!currentUser) return null;

  const isHR = role === 'HR_ADMIN';
  const allRecords = StorageService.getAttendanceRecords();

  // Employee specific records
  const employeeRecords = StorageService.getEmployeeAttendance(currentUser.id);
  const todayRecord = StorageService.getTodayAttendanceRecord(currentUser.id);
  const isCheckedIn = currentUser.status === 'present' && !!todayRecord?.checkIn && !todayRecord?.checkOut;

  // HR specific filtered records for selected date
  const filteredHRRecords = allRecords.filter((rec) => {
    const matchesDate = rec.date === selectedDate;
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.employeeLoginId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || rec.department === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;

    return matchesDate && matchesSearch && matchesDept && matchesStatus;
  });

  const departments = ['ALL', ...Array.from(new Set(allEmployees.map((e) => e.department)))];

  const handleCheckIn = () => {
    StorageService.checkIn(currentUser.id);
    refreshUserData();
  };

  const handleCheckOut = () => {
    StorageService.checkOut(currentUser.id);
    refreshUserData();
  };

  // Date stepper
  const handleDateChange = (direction: 'prev' | 'next') => {
    const current = new Date(selectedDate);
    if (direction === 'prev') {
      current.setDate(current.getDate() - 1);
    } else {
      current.setDate(current.getDate() + 1);
    }
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {isHR ? 'Workforce Attendance Master' : 'My Attendance & Work Hours'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {isHR
              ? 'Monitor real-time clock-in/out logs (IST), compute work hours, and track payable day impact across India offices.'
              : 'Log daily check-ins (IST), monitor hours worked, and track attendance history.'}
          </p>
        </div>

        {/* Employee Punch in / Punch out Header Button */}
        {!isHR && (
          <div className="flex items-center gap-3">
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Clock In Now (IST)</span>
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-600/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Clock Out (IST)</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* VIEW FOR EMPLOYEE */}
      {!isHR ? (
        <div className="space-y-6">
          {/* Punch Status Card */}
          <div className="p-6 rounded-2xl bg-[#12141f] border border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0b0c10] border border-gray-800 space-y-1">
              <span className="text-xs text-gray-500 font-medium">Today's Check In (IST)</span>
              <div className="font-mono text-xl font-bold text-emerald-400">
                {todayRecord?.checkIn || 'Not Checked In'}
              </div>
              <span className="text-[10px] text-gray-500">Standard shift: 09:30 AM IST</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0c10] border border-gray-800 space-y-1">
              <span className="text-xs text-gray-500 font-medium">Today's Check Out (IST)</span>
              <div className="font-mono text-xl font-bold text-purple-400">
                {todayRecord?.checkOut || (isCheckedIn ? 'Session Active' : '--:--')}
              </div>
              <span className="text-[10px] text-gray-500">Calculates overtime</span>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-1">
              <span className="text-xs text-purple-300 font-semibold">Today's Total Hours</span>
              <div className="font-mono text-xl font-black text-white">
                {todayRecord?.workHours ? `${todayRecord.workHours} hrs` : isCheckedIn ? 'Counting...' : '0 hrs'}
              </div>
              <span className="text-[10px] text-purple-400/80">
                Extra Hours: {todayRecord?.extraHours || 0} hrs
              </span>
            </div>
          </div>

          {/* Attendance History Table */}
          <div className="rounded-2xl bg-[#12141f] border border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 bg-[#171a26]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Attendance Log History
                </h2>
              </div>
              <span className="text-xs text-gray-400">{employeeRecords.length} records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0e1017] text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-3.5">Date (DD/MM/YYYY)</th>
                    <th className="px-6 py-3.5">Check In (IST)</th>
                    <th className="px-6 py-3.5">Check Out (IST)</th>
                    <th className="px-6 py-3.5">Work Hours</th>
                    <th className="px-6 py-3.5">Extra Hours</th>
                    <th className="px-6 py-3.5">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-200">
                  {employeeRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-gray-300">{formatIndianDate(rec.date)}</td>
                      <td className="px-6 py-3.5 font-mono text-emerald-400">{rec.checkIn || '-'}</td>
                      <td className="px-6 py-3.5 font-mono text-purple-400">{rec.checkOut || '-'}</td>
                      <td className="px-6 py-3.5 font-mono">{rec.workHours} hrs</td>
                      <td className="px-6 py-3.5 font-mono text-amber-300">
                        {rec.extraHours > 0 ? `+${rec.extraHours} hrs` : '-'}
                      </td>
                      <td className="px-6 py-3.5">
                        {rec.status === 'present' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Present
                          </span>
                        ) : rec.status === 'on_leave' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            On Leave
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Absent
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW FOR HR / ADMIN */
        <div className="space-y-6">
          {/* HR Controls: Date Navigator, Filters & Search */}
          <div className="p-4 rounded-2xl bg-[#12141f] border border-gray-800 flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Date Navigator */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={() => handleDateChange('prev')}
                className="p-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs text-white font-mono">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-white focus:outline-none"
                />
                <span className="text-gray-400 text-[11px]">({formatIndianDate(selectedDate, 'short')})</span>
              </div>
              <button
                onClick={() => handleDateChange('next')}
                className="p-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto flex-1 justify-end">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search staff or ID..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-purple-500/60"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'ALL' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-purple-500/60"
              >
                <option value="ALL">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          {/* Daily Attendance Master Table */}
          <div className="rounded-2xl bg-[#12141f] border border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 bg-[#171a26]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Daily Workforce Roll Call ({formatIndianDate(selectedDate, 'long')})
                </h2>
              </div>
              <span className="text-xs text-gray-400">{filteredHRRecords.length} records listed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0e1017] text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-3.5">Employee</th>
                    <th className="px-6 py-3.5">Department</th>
                    <th className="px-6 py-3.5">Check In (IST)</th>
                    <th className="px-6 py-3.5">Check Out (IST)</th>
                    <th className="px-6 py-3.5">Work Hours</th>
                    <th className="px-6 py-3.5">Extra Hours</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Payable Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-200">
                  {filteredHRRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-white">{rec.employeeName}</div>
                        <div className="text-[10px] font-mono text-purple-400">{rec.employeeLoginId}</div>
                      </td>
                      <td className="px-6 py-3.5 text-gray-300">{rec.department}</td>
                      <td className="px-6 py-3.5 font-mono text-emerald-400">{rec.checkIn || '-'}</td>
                      <td className="px-6 py-3.5 font-mono text-purple-400">{rec.checkOut || '-'}</td>
                      <td className="px-6 py-3.5 font-mono">{rec.workHours} hrs</td>
                      <td className="px-6 py-3.5 font-mono text-amber-300">
                        {rec.extraHours > 0 ? `+${rec.extraHours} hrs` : '-'}
                      </td>
                      <td className="px-6 py-3.5">
                        {rec.status === 'present' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Present
                          </span>
                        ) : rec.status === 'on_leave' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            On Leave
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Absent
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        {rec.status === 'present' ? (
                          <span className="text-[11px] text-emerald-400 font-mono">+1.0 Payable Day</span>
                        ) : rec.status === 'on_leave' ? (
                          <span className="text-[11px] text-blue-400 font-mono">Excused (PTO)</span>
                        ) : (
                          <span className="text-[11px] text-rose-400 font-mono">-1.0 Day Deduction</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredHRRecords.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-500">
                  No attendance records found for the selected date and filters.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

