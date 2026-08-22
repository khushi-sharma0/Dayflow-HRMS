import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Users,
  ShieldCheck,
  TrendingUp,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileSpreadsheet,
  IndianRupee,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StorageService, getStandardWorkingDays } from '../services/storage';
import { PaySlipModal } from '../components/PaySlipModal';
import { Employee, SalaryBreakdown } from '../types';
import { formatINR } from '../utils/formatters';

export const SalaryPayrollPage: React.FC = () => {
  const { allEmployees, role, refreshUserData } = useAuth();
  
  const [selectedMonthOffset, setSelectedMonthOffset] = useState(0); // 0 = current month
  const [activeEmployeeForSlip, setActiveEmployeeForSlip] = useState<{
    employee: Employee;
    breakdown: SalaryBreakdown;
  } | null>(null);

  // Quick salary structure editor modal
  const [editingEmployeeConfig, setEditingEmployeeConfig] = useState<Employee | null>(null);
  const [configForm, setConfigForm] = useState({
    basicPercentage: 50,
    hraPercentage: 20,
    standardAllowance: 6000,
    performanceBonusPercentage: 10,
    ltaPercentage: 5,
    professionalTax: 200,
    pfPercentage: 12,
    monthlyWage: 75000,
  });

  if (role !== 'HR_ADMIN') {
    return (
      <div className="p-8 text-center bg-[#12141f] rounded-2xl border border-gray-800 space-y-3">
        <Building2 className="w-10 h-10 text-purple-400 mx-auto" />
        <h2 className="text-sm font-bold text-white">HR Officer Privilege Required</h2>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Salary structures, payroll ledgers, and payable day calculations are restricted to authorized HR Officers.
        </p>
      </div>
    );
  }

  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth() + selectedMonthOffset, 1);
  const year = targetDate.getFullYear();
  const monthIdx = targetDate.getMonth();
  const monthName = targetDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const standardWorkingDays = getStandardWorkingDays(year, monthIdx);

  // Compute breakdown for all employees
  const staff = allEmployees.filter((e) => e.role === 'EMPLOYEE');
  const staffPayrollList = staff.map((emp) => {
    const breakdown = StorageService.calculateSalaryBreakdown(emp, year, monthIdx);
    return {
      employee: emp,
      breakdown,
    };
  });

  // Overall totals
  const totalGrossPayroll = staffPayrollList.reduce((sum, item) => sum + item.breakdown.grossSalary, 0);
  const totalNetPayroll = staffPayrollList.reduce((sum, item) => sum + item.breakdown.netSalary, 0);
  const totalDeductions = staffPayrollList.reduce((sum, item) => sum + item.breakdown.totalDeductions, 0);
  const totalPayableDays = staffPayrollList.reduce((sum, item) => sum + item.breakdown.payableDays, 0);

  const handleOpenConfigEditor = (emp: Employee) => {
    setEditingEmployeeConfig(emp);
    setConfigForm({
      basicPercentage: emp.salaryConfig.basicPercentage,
      hraPercentage: emp.salaryConfig.hraPercentage,
      standardAllowance: emp.salaryConfig.standardAllowance,
      performanceBonusPercentage: emp.salaryConfig.performanceBonusPercentage,
      ltaPercentage: emp.salaryConfig.ltaPercentage,
      professionalTax: emp.salaryConfig.professionalTax,
      pfPercentage: emp.salaryConfig.pfPercentage,
      monthlyWage: emp.monthlyWage,
    });
  };

  const handleSaveConfig = () => {
    if (!editingEmployeeConfig) return;

    const updated: Employee = {
      ...editingEmployeeConfig,
      monthlyWage: Number(configForm.monthlyWage),
      salaryConfig: {
        basicPercentage: Number(configForm.basicPercentage),
        hraPercentage: Number(configForm.hraPercentage),
        standardAllowance: Number(configForm.standardAllowance),
        performanceBonusPercentage: Number(configForm.performanceBonusPercentage),
        ltaPercentage: Number(configForm.ltaPercentage),
        professionalTax: Number(configForm.professionalTax),
        pfPercentage: Number(configForm.pfPercentage),
      },
    };

    StorageService.saveEmployee(updated);
    refreshUserData();
    setEditingEmployeeConfig(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Payroll & Payable Days Ledger (INR)
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Indian payroll computed in real time from attendance logs, working days, and approved leave records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12141f] border border-gray-800 text-xs font-semibold text-white">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>{monthName}</span>
          </div>
        </div>
      </div>

      {/* Attendance to Payroll Relationship Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17152a] via-[#121422] to-[#0f111c] border border-purple-800/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Attendance → Working Days → Payable Days → Dynamic Salary Formula
            </span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
            Standard: {standardWorkingDays} Business Days
          </span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Each staff member's compensation is computed as <code className="text-purple-300 font-mono">Pro-rated Base = (Monthly Wage / {standardWorkingDays}) × Payable Days</code>. 
          Unexcused absences and unpaid leaves directly reduce payable days, dynamically recalibrating Basic, HRA, Allowances, PF, and Net Pay.
        </p>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-2">
          <span className="text-xs font-medium text-gray-400">Total Net Disbursement</span>
          <div className="text-2xl font-bold text-white tracking-tight font-mono">
            {formatINR(totalNetPayroll)}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">Payable to {staff.length} employees</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-2">
          <span className="text-xs font-medium text-gray-400">Gross Earnings</span>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">
            {formatINR(totalGrossPayroll)}
          </div>
          <p className="text-[11px] text-gray-500">Before statutory deductions</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-2">
          <span className="text-xs font-medium text-gray-400">Total Deductions (PT + PF)</span>
          <div className="text-2xl font-bold text-rose-400 tracking-tight font-mono">
            {formatINR(totalDeductions)}
          </div>
          <p className="text-[11px] text-rose-400/80">Statutory Tax & EPF withholdings</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-2">
          <span className="text-xs font-medium text-gray-400">Total Payable Days</span>
          <div className="text-2xl font-bold text-purple-300 tracking-tight font-mono">
            {totalPayableDays} <span className="text-xs text-gray-500 font-normal">days</span>
          </div>
          <p className="text-[11px] text-purple-400">Cumulated roll-call score</p>
        </div>
      </div>

      {/* Staff Payroll Master Table */}
      <div className="rounded-2xl bg-[#12141f] border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 bg-[#171a26]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Employee Compensation & Payable Days Matrix (INR)
            </h2>
          </div>
          <span className="text-xs text-gray-400">{staffPayrollList.length} staff members</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1017] text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Base Monthly CTC</th>
                <th className="px-6 py-3.5 text-center">Standard / Payable</th>
                <th className="px-6 py-3.5">Basic Salary</th>
                <th className="px-6 py-3.5">HRA & Allowances</th>
                <th className="px-6 py-3.5">Deductions (PT + PF)</th>
                <th className="px-6 py-3.5 font-bold text-emerald-400">Net Payable</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-200">
              {staffPayrollList.map(({ employee, breakdown }) => (
                <tr key={employee.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="font-semibold text-white">{employee.name}</div>
                    <div className="text-[10px] font-mono text-purple-400">{employee.loginId}</div>
                    <div className="text-[10px] text-gray-400">{employee.jobPosition} • {employee.location}</div>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-white">
                    {formatINR(employee.monthlyWage)}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {breakdown.payableDays} / {breakdown.standardWorkingDays} d
                    </span>
                    {breakdown.absentDays + breakdown.unpaidLeaveDays > 0 && (
                      <div className="text-[10px] text-rose-400 mt-1">
                        -{breakdown.absentDays + breakdown.unpaidLeaveDays} days penalty
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-gray-300">
                    {formatINR(breakdown.basicSalary)}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-gray-300">
                    {formatINR(breakdown.hra + breakdown.standardAllowance + breakdown.performanceBonus + breakdown.lta)}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-rose-400">
                    -{formatINR(breakdown.totalDeductions)}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-base font-black text-emerald-400">
                    {formatINR(breakdown.netSalary)}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenConfigEditor(employee)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                        title="Configure Salary Component %"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveEmployeeForSlip({ employee, breakdown })}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-medium transition-colors"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Pay Slip</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Structure Configuration Modal */}
      {editingEmployeeConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#12141f] border border-gray-800 rounded-2xl p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Edit Salary Formula: {editingEmployeeConfig.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Customize percentage allocations for basic, allowances, and statutory deductions in INR.
                </p>
              </div>
              <button
                onClick={() => setEditingEmployeeConfig(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-medium mb-1">Base Monthly Wage (₹ INR)</label>
                <input
                  type="number"
                  value={configForm.monthlyWage}
                  onChange={(e) => setConfigForm({ ...configForm, monthlyWage: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-[#0b0c10] border border-gray-800 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Basic Salary (%)</label>
                  <input
                    type="number"
                    value={configForm.basicPercentage}
                    onChange={(e) => setConfigForm({ ...configForm, basicPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0b0c10] border border-gray-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">HRA (% of Basic)</label>
                  <input
                    type="number"
                    value={configForm.hraPercentage}
                    onChange={(e) => setConfigForm({ ...configForm, hraPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0b0c10] border border-gray-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Performance Bonus (%)</label>
                  <input
                    type="number"
                    value={configForm.performanceBonusPercentage}
                    onChange={(e) => setConfigForm({ ...configForm, performanceBonusPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0b0c10] border border-gray-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">LTA (% of Basic)</label>
                  <input
                    type="number"
                    value={configForm.ltaPercentage}
                    onChange={(e) => setConfigForm({ ...configForm, ltaPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0b0c10] border border-gray-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Standard Allowance (₹ Fixed)</label>
                  <input
                    type="number"
                    value={configForm.standardAllowance}
                    onChange={(e) => setConfigForm({ ...configForm, standardAllowance: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0b0c10] border border-gray-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">Provident Fund EPF (% of Basic)</label>
                  <input
                    type="number"
                    value={configForm.pfPercentage}
                    onChange={(e) => setConfigForm({ ...configForm, pfPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0b0c10] border border-gray-800 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setEditingEmployeeConfig(null)}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white"
              >
                Save Formula Parameters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Slip Modal */}
      {activeEmployeeForSlip && (
        <PaySlipModal
          isOpen={true}
          onClose={() => setActiveEmployeeForSlip(null)}
          employee={activeEmployeeForSlip.employee}
          breakdown={activeEmployeeForSlip.breakdown}
          monthName={monthName}
        />
      )}
    </div>
  );
};

