export type Role = 'HR_ADMIN' | 'EMPLOYEE';

export type AttendanceStatus = 'present' | 'absent' | 'absent_no_leave' | 'on_leave';

export interface SalaryConfig {
  basicPercentage: number; // e.g., 50 (%)
  hraPercentage: number; // e.g., 20 (%)
  standardAllowance: number; // e.g., 800 ($ or ₹)
  performanceBonusPercentage: number; // e.g., 10 (%)
  ltaPercentage: number; // e.g., 5 (%)
  professionalTax: number; // e.g., 200 ($)
  pfPercentage: number; // e.g., 12 (%) of basic
}

export interface LeaveQuotas {
  paidTimeOff: { total: number; used: number };
  sickTimeOff: { total: number; used: number };
  unpaidLeave: { used: number };
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface StatutoryDetails {
  pan: string; // Permanent Account Number e.g. "ABCDE1234F"
  uan: string; // Universal Account Number e.g. "101234567890"
  pfNumber?: string; // EPFO Member ID
  esicNumber?: string; // ESIC Registration
}

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  routingOrIfsc: string; // IFSC Code for Indian banks (e.g. HDFC0001234)
  accountHolder: string;
}

export interface Employee {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  name: string;
  loginId: string; // e.g. LOIARSH20250001
  email: string;
  phone: string;
  password: string;
  isTemporaryPassword: boolean;
  role: Role;
  avatarUrl: string;
  department: string;
  jobPosition: string;
  location: string;
  state?: string;
  city?: string;
  pinCode?: string;
  joiningDate: string; // YYYY-MM-DD
  joiningYear: number;
  serialNumber: number;
  status: AttendanceStatus;
  about: string;
  skills: string[];
  certifications: string[];
  dob: string;
  address: string;
  emergencyContact: EmergencyContact;
  bankDetails: BankDetails;
  statutoryDetails?: StatutoryDetails;
  wageType: 'Monthly' | 'Hourly' | 'Yearly';
  monthlyWage: number;
  workingHoursPerDay: number;
  salaryConfig: SalaryConfig;
  leaveBalance: LeaveQuotas;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeLoginId: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null; // e.g. "09:05 AM"
  checkOut: string | null; // e.g. "05:45 PM"
  workHours: number;
  extraHours: number;
  status: 'present' | 'absent' | 'on_leave';
  hasAppliedLeave?: boolean;
  notes?: string;
}

export type TimeOffType = 'Paid Time Off' | 'Sick Time Off' | 'Unpaid Leave';
export type TimeOffStatus = 'Pending' | 'Approved' | 'Rejected';

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeLoginId: string;
  department: string;
  type: TimeOffType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  days: number;
  reason: string;
  attachmentName?: string;
  attachmentUrl?: string;
  status: TimeOffStatus;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface SalaryBreakdown {
  standardWorkingDays: number;
  presentDays: number;
  absentDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  payableDays: number;
  
  baseMonthlyWage: number;
  proRatedWage: number; // based on payable days
  
  basicSalary: number;
  hra: number;
  standardAllowance: number;
  performanceBonus: number;
  lta: number;
  
  grossSalary: number;
  
  professionalTax: number;
  pfDeduction: number;
  totalDeductions: number;
  
  netSalary: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeLoginId: string;
  department: string;
  jobPosition: string;
  month: string; // e.g. "August 2026"
  monthKey: string; // "2026-08"
  breakdown: SalaryBreakdown;
  status: 'Draft' | 'Approved' | 'Paid';
  paymentDate?: string;
}

export interface AppNotification {
  id: string;
  userId: string; // or 'ALL_HR'
  title: string;
  message: string;
  type: 'leave' | 'attendance' | 'salary' | 'security' | 'info';
  timestamp: string;
  read: boolean;
  linkTo?: string;
}
