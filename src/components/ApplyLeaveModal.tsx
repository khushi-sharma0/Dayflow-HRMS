import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  FileText,
  Clock,
  Send,
  AlertCircle,
  Paperclip,
} from 'lucide-react';
import { TimeOffType } from '../types';
import { StorageService } from '../services/storage';
import { useAuth } from '../context/AuthContext';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted?: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  onRequestSubmitted,
}) => {
  const { currentUser, refreshUserData } = useAuth();

  const [leaveType, setLeaveType] = useState<TimeOffType>('Paid Time Off');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [reason, setReason] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !currentUser) return null;

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 1;
    const d1 = new Date(start);
    const d2 = new Date(end);
    if (d2 < d1) return 0;

    let count = 0;
    const cur = new Date(d1);
    while (cur <= d2) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return Math.max(1, count);
  };

  const calculatedDays = calculateDays(startDate, endDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the leave request.');
      return;
    }

    setSubmitting(true);

    try {
      StorageService.submitTimeOffRequest({
        employeeId: currentUser.id,
        type: leaveType,
        startDate,
        endDate,
        days: calculatedDays,
        reason: reason.trim(),
        attachmentName,
      });

      refreshUserData();
      if (onRequestSubmitted) {
        onRequestSubmitted();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#12141c] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800/80 bg-[#171a26]/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Apply for Time Off</h2>
                <p className="text-xs text-gray-400">
                  Submit a leave request for HR Officer review and payable day tracking.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Leave Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Paid Time Off', 'Sick Time Off', 'Unpaid Leave'] as TimeOffType[]).map((type) => {
                  const isSelected = leaveType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setLeaveType(type)}
                      className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500/60 text-purple-200 ring-1 ring-purple-500/40'
                          : 'bg-[#0b0c10] border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                      }`}
                    >
                      <div className="font-semibold">{type}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {type === 'Paid Time Off'
                          ? `${currentUser.leaveBalance.paidTimeOff.total - currentUser.leaveBalance.paidTimeOff.used} days left`
                          : type === 'Sick Time Off'
                          ? `${currentUser.leaveBalance.sickTimeOff.total - currentUser.leaveBalance.sickTimeOff.used} days left`
                          : 'Impacts payable days'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" /> Start Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (new Date(e.target.value) > new Date(endDate)) {
                      setEndDate(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" /> End Date
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800/80 flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Working Days Duration (excluding weekends):
              </span>
              <span className="text-xs font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                {calculatedDays} {calculatedDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-purple-400" /> Reason / Notes
              </label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe the purpose of this leave..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5 text-purple-400" /> Supporting Document / Doctor's Note (Optional)
              </label>
              <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-dashed border-gray-700 hover:border-purple-500/50 cursor-pointer transition-colors text-xs text-gray-400">
                <input
                  type="file"
                  onChange={handleSimulatedFileUpload}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.doc"
                />
                <Paperclip className="w-4 h-4 text-purple-400" />
                <span className="truncate">
                  {attachmentName ? (
                    <span className="text-purple-300 font-medium">{attachmentName}</span>
                  ) : (
                    'Click to attach PDF, doctor note, or image'
                  )}
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
