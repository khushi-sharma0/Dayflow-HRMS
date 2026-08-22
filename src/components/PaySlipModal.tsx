import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Employee, SalaryBreakdown } from '../types';
import { formatINR, formatIndianDate } from '../utils/formatters';

interface PaySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  breakdown: SalaryBreakdown;
  monthName?: string;
}

export const PaySlipModal: React.FC<PaySlipModalProps> = ({
  isOpen,
  onClose,
  employee,
  breakdown,
  monthName = 'Current Pay Period',
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-[#12141c] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#171a26]/70">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Official Pay Statement (INR)
              </span>
              <span className="text-xs text-gray-400">• {monthName}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-8 space-y-6 bg-[#0f1118] text-gray-200" id="printable-payslip">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-black text-white text-xl tracking-wider shadow-lg shadow-purple-600/30">
                  D
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">{employee.companyName}</h1>
                  <p className="text-xs text-gray-400">Enterprise HR & Payroll Division • India</p>
                </div>
              </div>
              <div className="text-right sm:text-right">
                <div className="text-xs text-gray-400">Pay Slip Reference</div>
                <div className="font-mono text-sm font-semibold text-purple-300">
                  PAY-{employee.loginId}-{new Date().getFullYear()}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">Statutory Standard • India Compliant</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#141724] border border-gray-800/80 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5">Employee Name</span>
                <span className="font-semibold text-white">{employee.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Login ID</span>
                <span className="font-mono font-semibold text-purple-300">{employee.loginId}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Designation</span>
                <span className="font-medium text-gray-200">{employee.jobPosition}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Department</span>
                <span className="font-medium text-gray-200">{employee.department}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Location</span>
                <span className="text-gray-200">{employee.location}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Date of Joining</span>
                <span className="text-gray-300">{formatIndianDate(employee.joiningDate, 'short')}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Monthly Base Wage</span>
                <span className="font-semibold text-emerald-400">{formatINR(employee.monthlyWage)}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Payment Method</span>
                <span className="text-gray-300">NEFT / RTGS (Bank)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#10131e] border border-gray-800 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5">PAN Number</span>
                <span className="font-mono font-semibold text-amber-300">
                  {employee.statutoryDetails?.pan || 'ABCDE1234F'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">UAN Number</span>
                <span className="font-mono text-purple-300">
                  {employee.statutoryDetails?.uan || '100912345678'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Bank & IFSC</span>
                <span className="font-mono text-gray-200">
                  {employee.bankDetails?.bankName} ({employee.bankDetails?.routingOrIfsc})
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Account Number</span>
                <span className="font-mono text-gray-300">{employee.bankDetails?.accountNumber || '••••••••4812'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Attendance Influence & Payable Days
                </span>
                <span className="text-gray-400">Payable Ratio: {Math.round((breakdown.payableDays / breakdown.standardWorkingDays) * 100)}%</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded-lg bg-[#0b0c10]/60 border border-gray-800">
                  <div className="text-gray-400 text-[10px]">Standard Working Days</div>
                  <div className="text-sm font-bold text-white mt-0.5">{breakdown.standardWorkingDays}</div>
                </div>
                <div className="p-2 rounded-lg bg-[#0b0c10]/60 border border-gray-800">
                  <div className="text-gray-400 text-[10px]">Present Days</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">{breakdown.presentDays}</div>
                </div>
                <div className="p-2 rounded-lg bg-[#0b0c10]/60 border border-gray-800">
                  <div className="text-gray-400 text-[10px]">Paid Leave Days</div>
                  <div className="text-sm font-bold text-blue-400 mt-0.5">{breakdown.paidLeaveDays}</div>
                </div>
                <div className="p-2 rounded-lg bg-[#0b0c10]/60 border border-gray-800">
                  <div className="text-gray-400 text-[10px]">Unpaid / Absent Days</div>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">
                    {breakdown.absentDays + breakdown.unpaidLeaveDays}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-purple-900/30 border border-purple-500/30 col-span-2 sm:col-span-1">
                  <div className="text-purple-300 text-[10px] font-semibold">Net Payable Days</div>
                  <div className="text-sm font-black text-purple-200 mt-0.5">{breakdown.payableDays}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-800 overflow-hidden bg-[#121522]">
                <div className="px-4 py-2.5 bg-[#181c2d] border-b border-gray-800 flex items-center justify-between text-xs font-semibold text-white">
                  <span>Earnings & Allowances</span>
                  <span className="text-gray-400">Amount (INR)</span>
                </div>
                <div className="p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Basic Salary ({employee.salaryConfig.basicPercentage}%)</span>
                    <span className="font-mono font-medium">{formatINR(breakdown.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>House Rent Allowance ({employee.salaryConfig.hraPercentage}%)</span>
                    <span className="font-mono font-medium">{formatINR(breakdown.hra)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Standard Allowance</span>
                    <span className="font-mono font-medium">{formatINR(breakdown.standardAllowance)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Performance Bonus ({employee.salaryConfig.performanceBonusPercentage}%)</span>
                    <span className="font-mono font-medium">{formatINR(breakdown.performanceBonus)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Leave Travel Allowance ({employee.salaryConfig.ltaPercentage}%)</span>
                    <span className="font-mono font-medium">{formatINR(breakdown.lta)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-800 flex justify-between font-semibold text-emerald-400">
                    <span>Gross Earnings</span>
                    <span className="font-mono">{formatINR(breakdown.grossSalary)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-800 overflow-hidden bg-[#121522]">
                <div className="px-4 py-2.5 bg-[#181c2d] border-b border-gray-800 flex items-center justify-between text-xs font-semibold text-white">
                  <span>Statutory Deductions & Taxes</span>
                  <span className="text-gray-400">Amount (INR)</span>
                </div>
                <div className="p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Professional Tax (PT)</span>
                    <span className="font-mono font-medium">{formatINR(breakdown.professionalTax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Provident Fund (EPF {employee.salaryConfig.pfPercentage}% of Basic)</span>
                    <span className="font-mono font-medium">{formatINR(breakdown.pfDeduction)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Unpaid Absence Adjustment</span>
                    <span className="font-mono font-medium">
                      {breakdown.absentDays + breakdown.unpaidLeaveDays > 0 ? 'Applied in Pro-rata' : '₹0'}
                    </span>
                  </div>
                  <div className="h-10"></div>
                  <div className="pt-2 border-t border-gray-800 flex justify-between font-semibold text-rose-400">
                    <span>Total Deductions</span>
                    <span className="font-mono">{formatINR(breakdown.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/30 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-purple-300 font-medium">Net Take-Home Pay (Direct Bank Credit)</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {formatINR(breakdown.netSalary)}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/60 px-3.5 py-2 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Computed against {breakdown.payableDays} Payable Days</span>
              </div>
            </div>

            <div className="text-center text-[11px] text-gray-500 pt-2 border-t border-gray-800/80">
              This is a system-generated pay slip from Dayflow Human Resource Management System (India). No physical signature is required.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};