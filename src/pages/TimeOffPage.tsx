import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  FileText,
  Paperclip,
  Check,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { ApplyLeaveModal } from '../components/ApplyLeaveModal';
import { TimeOffRequest, TimeOffStatus, TimeOffType } from '../types';
import { formatIndianDate } from '../utils/formatters';

export const TimeOffPage: React.FC = () => {
  const { currentUser, role, refreshUserData } = useAuth();
  
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | TimeOffStatus>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | TimeOffType>('ALL');
  
  // Review rejection modal state
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');

  if (!currentUser) return null;

  const isHR = role === 'HR_ADMIN';
  const allRequests = StorageService.getTimeOffRequests();
  const employeeRequests = StorageService.getEmployeeTimeOffRequests(currentUser.id);

  const displayedRequests = (isHR ? allRequests : employeeRequests).filter((req) => {
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || req.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const handleApprove = (requestId: string) => {
    StorageService.reviewTimeOffRequest(requestId, 'Approved', `${currentUser.name} (HR)`);
    refreshUserData();
  };

  const handleReject = (requestId: string) => {
    StorageService.reviewTimeOffRequest(
      requestId,
      'Rejected',
      `${currentUser.name} (HR)`,
      rejectNotes || 'Operational requirements'
    );
    setRejectModalId(null);
    setRejectNotes('');
    refreshUserData();
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {isHR ? 'Workforce Time-Off Administration' : 'Time-Off & Leave Portal'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {isHR
              ? 'Review and decide on employee leave applications. Approved unpaid leave automatically adjusts payable days.'
              : 'Submit time-off requests, check quota balances, and track review status in real time.'}
          </p>
        </div>

        {/* Apply Leave Trigger Button */}
        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-purple-600/25 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Time Off</span>
        </button>
      </div>

      {/* Leave Quota Cards (Employee View) */}
      {!isHR && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-2">
            <span className="text-xs font-medium text-purple-400">Paid Time Off (PTO)</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">
                {currentUser.leaveBalance.paidTimeOff.total - currentUser.leaveBalance.paidTimeOff.used}
              </span>
              <span className="text-xs text-gray-500">/ {currentUser.leaveBalance.paidTimeOff.total} days remaining</span>
            </div>
            <p className="text-[11px] text-gray-400">Standard annual entitlement</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-2">
            <span className="text-xs font-medium text-teal-400">Sick Time Off</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">
                {currentUser.leaveBalance.sickTimeOff.total - currentUser.leaveBalance.sickTimeOff.used}
              </span>
              <span className="text-xs text-gray-500">/ {currentUser.leaveBalance.sickTimeOff.total} days remaining</span>
            </div>
            <p className="text-[11px] text-gray-400">Medical emergencies & doctor appointments</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-2">
            <span className="text-xs font-medium text-amber-400">Unpaid Leave</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">
                {currentUser.leaveBalance.unpaidLeave.used}
              </span>
              <span className="text-xs text-gray-500">days consumed</span>
            </div>
            <p className="text-[11px] text-amber-400/80">Reduces payable working days in payroll</p>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#12141f] border border-gray-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-white">Filter Applications:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-purple-500/60"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-purple-500/60"
          >
            <option value="ALL">All Leave Types</option>
            <option value="Paid Time Off">Paid Time Off</option>
            <option value="Sick Time Off">Sick Time Off</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
          </select>
        </div>
      </div>

      {/* Time-Off Requests Table */}
      <div className="rounded-2xl bg-[#12141f] border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 bg-[#171a26]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              {isHR ? 'Company-wide Leave Ledger' : 'My Leave Applications'}
            </h2>
          </div>
          <span className="text-xs text-gray-400">{displayedRequests.length} total entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1017] text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                {isHR && <th className="px-6 py-3.5">Employee</th>}
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Date Range</th>
                <th className="px-6 py-3.5">Days</th>
                <th className="px-6 py-3.5">Reason & Attachment</th>
                <th className="px-6 py-3.5">Status</th>
                {isHR && <th className="px-6 py-3.5 text-right">Decision</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-200">
              {displayedRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-800/30 transition-colors">
                  {isHR && (
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-white">{req.employeeName}</div>
                      <div className="text-[10px] font-mono text-purple-400">{req.employeeLoginId}</div>
                    </td>
                  )}
                  <td className="px-6 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        req.type === 'Paid Time Off'
                          ? 'bg-purple-500/10 text-purple-300'
                          : req.type === 'Sick Time Off'
                          ? 'bg-teal-500/10 text-teal-300'
                          : 'bg-amber-500/10 text-amber-300'
                      }`}
                    >
                      {req.type}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-gray-300">
                    {formatIndianDate(req.startDate, 'short')} → {formatIndianDate(req.endDate, 'short')}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-white font-bold">{req.days} d</td>
                  <td className="px-6 py-3.5 max-w-xs">
                    <div className="text-gray-300 truncate">{req.reason}</div>
                    {req.attachmentName && (
                      <div className="flex items-center gap-1 text-[10px] text-purple-400 mt-0.5">
                        <Paperclip className="w-3 h-3" />
                        <span className="truncate">{req.attachmentName}</span>
                      </div>
                    )}
                    {req.reviewNotes && (
                      <div className="text-[10px] text-gray-500 italic mt-0.5">
                        HR Note: "{req.reviewNotes}"
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    {req.status === 'Approved' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    ) : req.status === 'Rejected' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1 w-fit">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    )}
                  </td>

                  {/* Decision Actions for HR */}
                  {isHR && (
                    <td className="px-6 py-3.5 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setRejectModalId(req.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Reject Request"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                            title="Approve Request"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-mono">
                          {req.reviewedBy ? `Reviewed by ${req.reviewedBy}` : 'Processed'}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {displayedRequests.length === 0 && (
            <div className="p-8 text-center text-xs text-gray-500">
              No leave applications found matching selected filter options.
            </div>
          )}
        </div>
      </div>

      {/* Reject Note Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#12141f] border border-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Provide Rejection Reason</h3>
            <textarea
              rows={3}
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="e.g. Critical release sprint active during this period..."
              className="w-full p-3 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-purple-500/60 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-3.5 py-1.5 rounded-xl bg-gray-800 text-xs text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectModalId)}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs text-white font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onRequestSubmitted={() => refreshUserData()}
      />
    </div>
  );
};

