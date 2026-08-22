export type Role = 'HR_ADMIN' | 'EMPLOYEE';

export type AttendanceStatus = 'present' | 'absent' | 'absent_no_leave' | 'on_leave';

export interface SalaryConfig {
  basicPercentage: number;
  hraPercentage: number;
  standardAllowance: number;
  performanceBonusPercentage: number;
  ltaPercentage: number;
  professionalTax: number;
  pfPercentage: number;
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
  pan: string;
  uan: string;
  pfNumber?: string;
  esicNumber?: string;
}

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  routingOrIfsc: string;
  accountHolder: string;
}

export interface Employee {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  name: string;
  loginId: string;
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
  joiningDate: string;
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
  date: string;
  checkIn: string | null;
  checkOut: string | null;
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
  startDate: string;
  endDate: string;
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
  proRatedWage: number;
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
  month: string;
  monthKey: string;
  breakdown: SalaryBreakdown;
  status: 'Draft' | 'Approved' | 'Paid';
  paymentDate?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'leave' | 'attendance' | 'salary' | 'security' | 'info';
  timestamp: string;
  read: boolean;
  linkTo?: string;
}
