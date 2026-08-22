import {
  Employee,
  AttendanceRecord,
  TimeOffRequest,
  SalaryBreakdown,
  AppNotification,
  Role,
} from '../types';

const STORAGE_KEYS = {
  EMPLOYEES: 'dayflow_employees_v2',
  ATTENDANCE: 'dayflow_attendance_v2',
  TIMEOFF: 'dayflow_timeoff_v2',
  NOTIFICATIONS: 'dayflow_notifications_v2',
  CURRENT_USER_ID: 'dayflow_active_user_v2',
  INITIALIZED: 'dayflow_db_initialized_v2',
};

// Calculate standard working days for a month (excluding weekends)
export function getStandardWorkingDays(year: number, monthZeroIndexed: number): number {
  const daysInMonth = new Date(year, monthZeroIndexed + 1, 0).getDate();
  let workingDays = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthZeroIndexed, day);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }
  return workingDays || 22;
}

// Generate the specific Login ID format:
// LOI + first 2 letters of first name + first 2 letters of last name + joining year + 4-digit serial
export function generateEmployeeLoginId(
  firstName: string,
  lastName: string,
  joiningYear: number,
  serialNumber: number
): string {
  const f2 = (firstName.trim().slice(0, 2) || 'XX').toUpperCase().padEnd(2, 'X');
  const l2 = (lastName.trim().slice(0, 2) || 'XX').toUpperCase().padEnd(2, 'X');
  const serialStr = String(serialNumber).padStart(4, '0');
  return `LOI${f2}${l2}${joiningYear}${serialStr}`;
}

// Generate a secure temporary password
export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Dayflow#${randomPart}!`;
}

// Initial realistic seed employees — 100% India-First
const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-hr-admin',
    companyName: 'Dayflow Technologies India Pvt. Ltd.',
    firstName: 'Devika',
    lastName: 'Rao',
    name: 'Devika Rao',
    loginId: 'LOIADMIN20240001',
    email: 'admin@dayflow.in',
    phone: '+91 98450 12345',
    password: 'admin123',
    isTemporaryPassword: false,
    role: 'HR_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Human Resources',
    jobPosition: 'Head of People & HR Operations',
    location: 'Bengaluru, Karnataka',
    state: 'Karnataka',
    city: 'Bengaluru',
    pinCode: '560045',
    joiningDate: '2024-01-15',
    joiningYear: 2024,
    serialNumber: 1,
    status: 'present',
    about: 'Experienced HR strategist and operations lead specializing in talent development, statutory compliance (PF, ESIC, PT), and positive workplace culture.',
    skills: ['Talent Acquisition', 'Payroll & Compliance', 'Indian Labour Law', 'Conflict Resolution', 'People Analytics'],
    certifications: ['SHRM-SCP Senior Certified Professional', 'Executive PG in Human Resource Management (XLRI Jamshedpur)'],
    dob: '1989-06-14',
    address: 'Flat 402, Prestige Palms, Manyata Tech Park Road, Nagavara, Bengaluru, Karnataka 560045',
    emergencyContact: {
      name: 'Karan Rao',
      relation: 'Spouse',
      phone: '+91 98450 54321',
    },
    bankDetails: {
      accountNumber: '••••••••4812',
      bankName: 'HDFC Bank',
      routingOrIfsc: 'HDFC0000184',
      accountHolder: 'Devika Rao',
    },
    statutoryDetails: {
      pan: 'ABCDE1234F',
      uan: '100912345678',
      pfNumber: 'KN/BNG/0045123/000/0001',
      esicNumber: '53000987654321001',
    },
    wageType: 'Monthly',
    monthlyWage: 145000,
    workingHoursPerDay: 8,
    salaryConfig: {
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowance: 12000,
      performanceBonusPercentage: 10,
      ltaPercentage: 5,
      professionalTax: 200,
      pfPercentage: 12,
    },
    leaveBalance: {
      paidTimeOff: { total: 18, used: 2 },
      sickTimeOff: { total: 10, used: 1 },
      unpaidLeave: { used: 0 },
    },
  },
  {
    id: 'emp-aarav-sharma',
    companyName: 'Dayflow Technologies India Pvt. Ltd.',
    firstName: 'Aarav',
    lastName: 'Sharma',
    name: 'Aarav Sharma',
    loginId: 'LOIAASH20250001',
    email: 'aarav.sharma@dayflow.in',
    phone: '+91 97110 23456',
    password: 'password123',
    isTemporaryPassword: false,
    role: 'EMPLOYEE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    jobPosition: 'Lead Full-Stack Architect',
    location: 'Bengaluru, Karnataka',
    state: 'Karnataka',
    city: 'Bengaluru',
    pinCode: '560103',
    joiningDate: '2025-02-01',
    joiningYear: 2025,
    serialNumber: 1,
    status: 'present',
    about: 'Full-stack software architect focusing on scalable distributed systems, React performance, Node microservices, and high-concurrency cloud architectures.',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Cloud Architecture', 'Docker'],
    certifications: ['AWS Certified Solutions Architect – Professional', 'Google Cloud Certified Professional Cloud Architect'],
    dob: '1994-03-22',
    address: 'B-704, Rohan Viti, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
    emergencyContact: {
      name: 'Meera Sharma',
      relation: 'Mother',
      phone: '+91 97110 65432',
    },
    bankDetails: {
      accountNumber: '••••••••7721',
      bankName: 'ICICI Bank',
      routingOrIfsc: 'ICIC0000007',
      accountHolder: 'Aarav Sharma',
    },
    statutoryDetails: {
      pan: 'AFRPS5678K',
      uan: '100987654321',
      pfNumber: 'KN/BNG/0045123/000/0002',
      esicNumber: '53000987654321002',
    },
    wageType: 'Monthly',
    monthlyWage: 125000,
    workingHoursPerDay: 8,
    salaryConfig: {
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowance: 10000,
      performanceBonusPercentage: 10,
      ltaPercentage: 5,
      professionalTax: 200,
      pfPercentage: 12,
    },
    leaveBalance: {
      paidTimeOff: { total: 15, used: 3 },
      sickTimeOff: { total: 10, used: 1 },
      unpaidLeave: { used: 0 },
    },
  },
  {
    id: 'emp-ananya-patel',
    companyName: 'Dayflow Technologies India Pvt. Ltd.',
    firstName: 'Ananya',
    lastName: 'Patel',
    name: 'Ananya Patel',
    loginId: 'LOIANPA20250002',
    email: 'ananya.patel@dayflow.in',
    phone: '+91 98200 34567',
    password: 'password123',
    isTemporaryPassword: false,
    role: 'EMPLOYEE',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Product Design',
    jobPosition: 'Principal Product Designer',
    location: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    city: 'Mumbai',
    pinCode: '400051',
    joiningDate: '2025-03-10',
    joiningYear: 2025,
    serialNumber: 2,
    status: 'present',
    about: 'Design systems advocate and product designer with over 8 years of creating accessible, high-craft digital workflows for leading Indian consumer apps.',
    skills: ['UI/UX Design', 'Design Systems', 'Figma', 'User Research', 'Prototyping', 'Accessibility (WCAG)'],
    certifications: ['Nielsen Norman Group UX Master Certified', 'Interaction Design Foundation UX Specialization'],
    dob: '1996-08-19',
    address: '1402, Kalpataru Solitaire, Bandra Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051',
    emergencyContact: {
      name: 'Rajesh Patel',
      relation: 'Father',
      phone: '+91 98200 76543',
    },
    bankDetails: {
      accountNumber: '••••••••9034',
      bankName: 'Axis Bank',
      routingOrIfsc: 'UTIB0000005',
      accountHolder: 'Ananya Patel',
    },
    statutoryDetails: {
      pan: 'AMNPP9012L',
      uan: '101234567890',
      pfNumber: 'MH/MUM/0032145/000/0003',
      esicNumber: '31000876543210003',
    },
    wageType: 'Monthly',
    monthlyWage: 115000,
    workingHoursPerDay: 8,
    salaryConfig: {
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowance: 9000,
      performanceBonusPercentage: 10,
      ltaPercentage: 5,
      professionalTax: 200,
      pfPercentage: 12,
    },
    leaveBalance: {
      paidTimeOff: { total: 15, used: 1 },
      sickTimeOff: { total: 10, used: 0 },
      unpaidLeave: { used: 0 },
    },
  },
  {
    id: 'emp-rohan-mehta',
    companyName: 'Dayflow Technologies India Pvt. Ltd.',
    firstName: 'Rohan',
    lastName: 'Mehta',
    name: 'Rohan Mehta',
    loginId: 'LOIROME20250003',
    email: 'rohan.mehta@dayflow.in',
    phone: '+91 96190 45678',
    password: 'password123',
    isTemporaryPassword: false,
    role: 'EMPLOYEE',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Infrastructure',
    jobPosition: 'Senior DevOps & Site Reliability Engineer',
    location: 'Pune, Maharashtra',
    state: 'Maharashtra',
    city: 'Pune',
    pinCode: '411014',
    joiningDate: '2025-04-01',
    joiningYear: 2025,
    serialNumber: 3,
    status: 'absent',
    about: 'SRE veteran passionate about infrastructure as code, zero-downtime deployments, Kubernetes clusters, and telemetry pipelines across multi-cloud regions.',
    skills: ['Kubernetes', 'Terraform', 'CI/CD Pipelines', 'AWS / GCP', 'Observability', 'Linux Security'],
    certifications: ['Certified Kubernetes Administrator (CKA)', 'HashiCorp Certified Terraform Associate'],
    dob: '1992-11-05',
    address: 'Tower 4, Flat 1102, Marvel Cerise, Kharadi, Pune, Maharashtra 411014',
    emergencyContact: {
      name: 'Pooja Mehta',
      relation: 'Sister',
      phone: '+91 96190 87654',
    },
    bankDetails: {
      accountNumber: '••••••••1159',
      bankName: 'State Bank of India (SBI)',
      routingOrIfsc: 'SBIN0004567',
      accountHolder: 'Rohan Mehta',
    },
    statutoryDetails: {
      pan: 'APQPM3456N',
      uan: '101567890123',
      pfNumber: 'MH/PUN/0087654/000/0004',
      esicNumber: '31000876543210004',
    },
    wageType: 'Monthly',
    monthlyWage: 95000,
    workingHoursPerDay: 8,
    salaryConfig: {
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowance: 8000,
      performanceBonusPercentage: 10,
      ltaPercentage: 5,
      professionalTax: 200,
      pfPercentage: 12,
    },
    leaveBalance: {
      paidTimeOff: { total: 15, used: 2 },
      sickTimeOff: { total: 10, used: 2 },
      unpaidLeave: { used: 0 },
    },
  },
  {
    id: 'emp-siya-shah',
    companyName: 'Dayflow Technologies India Pvt. Ltd.',
    firstName: 'Siya',
    lastName: 'Shah',
    name: 'Siya Shah',
    loginId: 'LOISISH20250004',
    email: 'siya.shah@dayflow.in',
    phone: '+91 99100 56789',
    password: 'password123',
    isTemporaryPassword: false,
    role: 'EMPLOYEE',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    department: 'Human Resources',
    jobPosition: 'Talent Acquisition & Culture Specialist',
    location: 'Gurugram, Haryana',
    state: 'Haryana',
    city: 'Gurugram',
    pinCode: '122002',
    joiningDate: '2025-05-15',
    joiningYear: 2025,
    serialNumber: 4,
    status: 'absent_no_leave',
    about: 'People-first recruiter with a focus on sourcing exceptional engineering and design talent across Indian tech hubs, onboarding experiences, and culture building.',
    skills: ['Campus & Lateral Hiring', 'Candidate Experience', 'Employer Branding', 'Interview Coaching'],
    certifications: ['AIRS Certified Diversity Recruiter', 'LinkedIn Certified Professional Recruiter'],
    dob: '1995-12-30',
    address: 'Apt 502, DLF Phase 2, Cyber City Enclave, Gurugram, Haryana 122002',
    emergencyContact: {
      name: 'Nitin Shah',
      relation: 'Brother',
      phone: '+91 99100 98765',
    },
    bankDetails: {
      accountNumber: '••••••••6420',
      bankName: 'Kotak Mahindra Bank',
      routingOrIfsc: 'KKBK0000180',
      accountHolder: 'Siya Shah',
    },
    statutoryDetails: {
      pan: 'AYZPS7890Q',
      uan: '101901234567',
      pfNumber: 'HR/GGN/0091234/000/0005',
      esicNumber: '13000987654321005',
    },
    wageType: 'Monthly',
    monthlyWage: 85000,
    workingHoursPerDay: 8,
    salaryConfig: {
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowance: 7000,
      performanceBonusPercentage: 10,
      ltaPercentage: 5,
      professionalTax: 200,
      pfPercentage: 12,
    },
    leaveBalance: {
      paidTimeOff: { total: 15, used: 0 },
      sickTimeOff: { total: 10, used: 1 },
      unpaidLeave: { used: 0 },
    },
  },
  {
    id: 'emp-vikram-verma',
    companyName: 'Dayflow Technologies India Pvt. Ltd.',
    firstName: 'Vikram',
    lastName: 'Verma',
    name: 'Vikram Verma',
    loginId: 'LOIVIVE20250005',
    email: 'vikram.verma@dayflow.in',
    phone: '+91 98490 67890',
    password: 'password123',
    isTemporaryPassword: false,
    role: 'EMPLOYEE',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Marketing',
    jobPosition: 'Growth & Demand Generation Lead',
    location: 'Hyderabad, Telangana',
    state: 'Telangana',
    city: 'Hyderabad',
    pinCode: '500081',
    joiningDate: '2025-06-01',
    joiningYear: 2025,
    serialNumber: 5,
    status: 'on_leave',
    about: 'B2B SaaS growth strategist specializing in enterprise pipeline generation, digital performance marketing, and developer community advocacy in India.',
    skills: ['Growth Marketing', 'SEO / SEM', 'HubSpot', 'Content Strategy', 'Product Marketing'],
    certifications: ['Google Analytics Individual Qualification', 'Reforge Growth Series'],
    dob: '1991-04-12',
    address: 'Villa 28, Cyber Meadows, HITEC City, Madhapur, Hyderabad, Telangana 500081',
    emergencyContact: {
      name: 'Sunita Verma',
      relation: 'Spouse',
      phone: '+91 98490 09876',
    },
    bankDetails: {
      accountNumber: '••••••••3829',
      bankName: 'HDFC Bank',
      routingOrIfsc: 'HDFC0000045',
      accountHolder: 'Vikram Verma',
    },
    statutoryDetails: {
      pan: 'AVWPV2345R',
      uan: '102345678901',
      pfNumber: 'TS/HYD/0054321/000/0006',
      esicNumber: '52000987654321006',
    },
    wageType: 'Monthly',
    monthlyWage: 90000,
    workingHoursPerDay: 8,
    salaryConfig: {
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowance: 7500,
      performanceBonusPercentage: 10,
      ltaPercentage: 5,
      professionalTax: 200,
      pfPercentage: 12,
    },
    leaveBalance: {
      paidTimeOff: { total: 15, used: 4 },
      sickTimeOff: { total: 10, used: 0 },
      unpaidLeave: { used: 0 },
    },
  },
];

// Helper to generate sample past attendance records for realistic data
function generateSeedAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Create records for the last 10 days
  for (let i = 9; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends
    
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 0;
    
    INITIAL_EMPLOYEES.forEach((emp) => {
      // HR Admin always present
      if (emp.role === 'HR_ADMIN') {
        records.push({
          id: `att-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          employeeName: emp.name,
          employeeLoginId: emp.loginId,
          department: emp.department,
          date: dateStr,
          checkIn: '08:45 AM',
          checkOut: isToday ? null : '05:30 PM',
          workHours: isToday ? 4.5 : 8.75,
          extraHours: isToday ? 0 : 0.75,
          status: 'present',
        });
        return;
      }
      
      // Seed status pattern for variety
      if (emp.id === 'emp-aarav-sharma') {
        records.push({
          id: `att-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          employeeName: emp.name,
          employeeLoginId: emp.loginId,
          department: emp.department,
          date: dateStr,
          checkIn: '09:02 AM',
          checkOut: isToday ? null : '06:15 PM',
          workHours: isToday ? 5.2 : 9.2,
          extraHours: isToday ? 0 : 1.2,
          status: 'present',
        });
      } else if (emp.id === 'emp-ananya-patel') {
        records.push({
          id: `att-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          employeeName: emp.name,
          employeeLoginId: emp.loginId,
          department: emp.department,
          date: dateStr,
          checkIn: '09:15 AM',
          checkOut: isToday ? null : '05:45 PM',
          workHours: isToday ? 4.8 : 8.5,
          extraHours: isToday ? 0 : 0.5,
          status: 'present',
        });
      } else if (emp.id === 'emp-rohan-mehta') {
        if (isToday) {
          records.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            employeeName: emp.name,
            employeeLoginId: emp.loginId,
            department: emp.department,
            date: dateStr,
            checkIn: null,
            checkOut: null,
            workHours: 0,
            extraHours: 0,
            status: 'absent',
            hasAppliedLeave: false,
          });
        } else {
          records.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            employeeName: emp.name,
            employeeLoginId: emp.loginId,
            department: emp.department,
            date: dateStr,
            checkIn: '08:50 AM',
            checkOut: '05:30 PM',
            workHours: 8.6,
            extraHours: 0.6,
            status: 'present',
          });
        }
      } else if (emp.id === 'emp-siya-shah') {
        if (isToday) {
          records.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            employeeName: emp.name,
            employeeLoginId: emp.loginId,
            department: emp.department,
            date: dateStr,
            checkIn: null,
            checkOut: null,
            workHours: 0,
            extraHours: 0,
            status: 'absent',
            hasAppliedLeave: false,
          });
        } else {
          records.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            employeeName: emp.name,
            employeeLoginId: emp.loginId,
            department: emp.department,
            date: dateStr,
            checkIn: '09:30 AM',
            checkOut: '06:00 PM',
            workHours: 8.5,
            extraHours: 0.5,
            status: 'present',
          });
        }
      } else if (emp.id === 'emp-vikram-verma') {
        if (isToday || i === 1) {
          records.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            employeeName: emp.name,
            employeeLoginId: emp.loginId,
            department: emp.department,
            date: dateStr,
            checkIn: null,
            checkOut: null,
            workHours: 0,
            extraHours: 0,
            status: 'on_leave',
            hasAppliedLeave: true,
            notes: 'Approved Paid Time Off',
          });
        } else {
          records.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            employeeName: emp.name,
            employeeLoginId: emp.loginId,
            department: emp.department,
            date: dateStr,
            checkIn: '09:10 AM',
            checkOut: '05:40 PM',
            workHours: 8.5,
            extraHours: 0.5,
            status: 'present',
          });
        }
      }
    });
  }
  return records;
}

const INITIAL_TIMEOFF_REQUESTS: TimeOffRequest[] = [
  {
    id: 'req-001',
    employeeId: 'emp-vikram-verma',
    employeeName: 'Vikram Verma',
    employeeLoginId: 'LOIVIVE20250005',
    department: 'Marketing',
    type: 'Paid Time Off',
    startDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    days: 3,
    reason: 'Attending annual family festival and travel to hometown.',
    status: 'Approved',
    appliedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    reviewedBy: 'Devika Rao (HR)',
    reviewNotes: 'Approved. Enjoy your festival break!',
  },
  {
    id: 'req-002',
    employeeId: 'emp-aarav-sharma',
    employeeName: 'Aarav Sharma',
    employeeLoginId: 'LOIAASH20250001',
    department: 'Engineering',
    type: 'Sick Time Off',
    startDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    days: 2,
    reason: 'Scheduled dental root canal procedure and recovery.',
    status: 'Pending',
    appliedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    attachmentName: 'dental_consultation_apollo.pdf',
  },
  {
    id: 'req-003',
    employeeId: 'emp-ananya-patel',
    employeeName: 'Ananya Patel',
    employeeLoginId: 'LOIANPA20250002',
    department: 'Product Design',
    type: 'Paid Time Off',
    startDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    days: 5,
    reason: 'Annual personal wellness and meditation retreat in Rishikesh.',
    status: 'Pending',
    appliedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'ALL_HR',
    title: 'New Time-Off Request',
    message: 'Aarav Sharma submitted a Sick Time Off request for 2 days.',
    type: 'leave',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    read: false,
    linkTo: '/time-off',
  },
  {
    id: 'notif-2',
    userId: 'emp-vikram-verma',
    title: 'Time-Off Approved',
    message: 'Your Paid Time Off request for 3 days has been approved by HR.',
    type: 'leave',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
    read: true,
    linkTo: '/time-off',
  },
  {
    id: 'notif-3',
    userId: 'ALL_HR',
    title: 'Attendance Alert',
    message: 'Siya Shah is marked absent today with no active time-off request.',
    type: 'attendance',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    read: false,
    linkTo: '/attendance',
  },
];

export class StorageService {
  // Initialize storage if empty
  static init(): void {
    if (typeof window === 'undefined') return;
    
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(generateSeedAttendance()));
      localStorage.setItem(STORAGE_KEYS.TIMEOFF, JSON.stringify(INITIAL_TIMEOFF_REQUESTS));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, INITIAL_EMPLOYEES[0].id); // HR Admin default
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  // Reset to initial seed data
  static resetToDefault(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    this.init();
  }

  // --- Employees Management ---
  static getEmployees(): Employee[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return data ? JSON.parse(data) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  }

  static getEmployeeById(id: string): Employee | null {
    const employees = this.getEmployees();
    return employees.find((e) => e.id === id) || null;
  }

  static getEmployeeByLoginId(loginId: string): Employee | null {
    const employees = this.getEmployees();
    const cleanId = loginId.trim().toUpperCase();
    return employees.find((e) => e.loginId.toUpperCase() === cleanId || e.email.toLowerCase() === loginId.trim().toLowerCase()) || null;
  }

  static saveEmployee(updatedEmployee: Employee): void {
    const employees = this.getEmployees();
    const index = employees.findIndex((e) => e.id === updatedEmployee.id);
    if (index >= 0) {
      employees[index] = updatedEmployee;
    } else {
      employees.push(updatedEmployee);
    }
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }

  static createEmployee(payload: {
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    jobPosition: string;
    location: string;
    state?: string;
    city?: string;
    pinCode?: string;
    country?: string;
    joiningDate: string;
    monthlyWage: number;
    wageType?: 'Monthly' | 'Hourly' | 'Yearly';
    avatarUrl?: string;
    about?: string;
    statutoryDetails?: {
      pan: string;
      uan: string;
      pfNumber?: string;
      esicNumber?: string;
    };
  }): { employee: Employee; temporaryPassword: string; loginId: string } {
    const employees = this.getEmployees();
    const joiningDateObj = new Date(payload.joiningDate || new Date().toISOString().split('T')[0]);
    const joiningYear = joiningDateObj.getFullYear();
    
    // Calculate serial number for that joining year
    const sameYearEmployees = employees.filter((e) => e.joiningYear === joiningYear);
    const nextSerial = sameYearEmployees.length + 1;

    const loginId = generateEmployeeLoginId(payload.firstName, payload.lastName, joiningYear, nextSerial);
    const temporaryPassword = generateTemporaryPassword();
    const newId = `emp-${Date.now()}`;

    const newEmployee: Employee = {
      id: newId,
      companyName: payload.companyName || 'Dayflow Technologies India Pvt. Ltd.',
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      name: `${payload.firstName.trim()} ${payload.lastName.trim()}`,
      loginId,
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim().startsWith('+91') ? payload.phone.trim() : `+91 ${payload.phone.trim()}`,
      password: temporaryPassword,
      isTemporaryPassword: true,
      role: 'EMPLOYEE',
      avatarUrl:
        payload.avatarUrl ||
        `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 100000000)}?w=150&auto=format&fit=crop&q=80`,
      department: payload.department || 'Engineering',
      jobPosition: payload.jobPosition || 'Associate Specialist',
      location: payload.location || 'Bengaluru, Karnataka',
      state: payload.state || 'Karnataka',
      city: payload.city || 'Bengaluru',
      pinCode: payload.pinCode || '560001',
      joiningDate: payload.joiningDate || new Date().toISOString().split('T')[0],
      joiningYear,
      serialNumber: nextSerial,
      status: 'absent',
      about: payload.about || `Newly joined ${payload.jobPosition} at ${payload.companyName || 'Dayflow Technologies India Pvt. Ltd.'}.`,
      skills: ['Team Collaboration', 'Communication', 'Problem Solving'],
      certifications: [],
      dob: '1998-01-01',
      address: payload.location ? `${payload.location}, PIN - ${payload.pinCode || '560001'}` : 'Tech Park Road, Bengaluru, Karnataka 560001',
      emergencyContact: {
        name: 'Contact Person',
        relation: 'Family',
        phone: payload.phone || '+91 98000 00000',
      },
      bankDetails: {
        accountNumber: `••••••••${Math.floor(1000 + Math.random() * 9000)}`,
        bankName: 'HDFC Bank',
        routingOrIfsc: 'HDFC0000123',
        accountHolder: `${payload.firstName.trim()} ${payload.lastName.trim()}`,
      },
      statutoryDetails: payload.statutoryDetails || {
        pan: `ABCDE${Math.floor(1000 + Math.random() * 9000)}F`,
        uan: `1009${Math.floor(10000000 + Math.random() * 90000000)}`,
        pfNumber: `KN/BNG/0045123/000/${String(nextSerial).padStart(4, '0')}`,
      },
      wageType: payload.wageType || 'Monthly',
      monthlyWage: payload.monthlyWage || 75000,
      workingHoursPerDay: 8,
      salaryConfig: {
        basicPercentage: 50,
        hraPercentage: 20,
        standardAllowance: 6000,
        performanceBonusPercentage: 10,
        ltaPercentage: 5,
        professionalTax: 200,
        pfPercentage: 12,
      },
      leaveBalance: {
        paidTimeOff: { total: 15, used: 0 },
        sickTimeOff: { total: 10, used: 0 },
        unpaidLeave: { used: 0 },
      },
    };

    employees.push(newEmployee);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));

    // Also add notification for HR
    this.addNotification({
      userId: 'ALL_HR',
      title: 'Employee Onboarded',
      message: `Account created for ${newEmployee.name} (${newEmployee.loginId}). Credentials generated.`,
      type: 'info',
      linkTo: `/employees/${newEmployee.id}`,
    });

    return { employee: newEmployee, temporaryPassword, loginId };
  }

  // --- Active Authentication ---
  static getCurrentUser(): Employee | null {
    this.init();
    const activeId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!activeId) return null;
    return this.getEmployeeById(activeId);
  }

  static setCurrentUser(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  }

  // --- Attendance System ---
  static getAttendanceRecords(): AttendanceRecord[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getEmployeeAttendance(employeeId: string): AttendanceRecord[] {
    const all = this.getAttendanceRecords();
    return all
      .filter((r) => r.employeeId === employeeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static getTodayAttendanceRecord(employeeId: string): AttendanceRecord | null {
    const today = new Date().toISOString().split('T')[0];
    const records = this.getAttendanceRecords();
    return records.find((r) => r.employeeId === employeeId && r.date === today) || null;
  }

  static checkIn(employeeId: string): AttendanceRecord {
    const employee = this.getEmployeeById(employeeId);
    if (!employee) throw new Error('Employee not found');

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const checkInTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const all = this.getAttendanceRecords();
    const existingIndex = all.findIndex((r) => r.employeeId === employeeId && r.date === today);

    let record: AttendanceRecord;

    if (existingIndex >= 0) {
      record = {
        ...all[existingIndex],
        checkIn: checkInTime,
        status: 'present',
      };
      all[existingIndex] = record;
    } else {
      record = {
        id: `att-${employeeId}-${today}`,
        employeeId,
        employeeName: employee.name,
        employeeLoginId: employee.loginId,
        department: employee.department,
        date: today,
        checkIn: checkInTime,
        checkOut: null,
        workHours: 0,
        extraHours: 0,
        status: 'present',
      };
      all.unshift(record);
    }

    // Update employee status to 'present' (Green)
    employee.status = 'present';
    this.saveEmployee(employee);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));

    return record;
  }

  static checkOut(employeeId: string): AttendanceRecord {
    const employee = this.getEmployeeById(employeeId);
    if (!employee) throw new Error('Employee not found');

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const checkOutTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const all = this.getAttendanceRecords();
    const existingIndex = all.findIndex((r) => r.employeeId === employeeId && r.date === today);

    if (existingIndex < 0) {
      throw new Error('Check in first before checking out');
    }

    const currentRecord = all[existingIndex];
    
    // Calculate total hours
    let hoursWorked = 8.0;
    if (currentRecord.checkIn) {
      const [timePart, meridiem] = currentRecord.checkIn.split(' ');
      const [h, m] = timePart.split(':').map(Number);
      let inHour = h;
      if (meridiem === 'PM' && inHour < 12) inHour += 12;
      if (meridiem === 'AM' && inHour === 12) inHour = 0;

      const checkInDate = new Date();
      checkInDate.setHours(inHour, m, 0, 0);

      const diffMs = Math.max(0, now.getTime() - checkInDate.getTime());
      const rawHours = diffMs / (1000 * 60 * 60);
      hoursWorked = Math.max(0.5, Math.round(rawHours * 10) / 10);
    }

    const extraHours = Math.max(0, Math.round((hoursWorked - 8) * 10) / 10);

    const updatedRecord: AttendanceRecord = {
      ...currentRecord,
      checkOut: checkOutTime,
      workHours: hoursWorked,
      extraHours,
      status: 'present',
    };

    all[existingIndex] = updatedRecord;
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));

    return updatedRecord;
  }

  // --- Time-Off Workflow ---
  static getTimeOffRequests(): TimeOffRequest[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TIMEOFF);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getEmployeeTimeOffRequests(employeeId: string): TimeOffRequest[] {
    const all = this.getTimeOffRequests();
    return all
      .filter((r) => r.employeeId === employeeId)
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  }

  static submitTimeOffRequest(payload: {
    employeeId: string;
    type: 'Paid Time Off' | 'Sick Time Off' | 'Unpaid Leave';
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    attachmentName?: string;
  }): TimeOffRequest {
    const employee = this.getEmployeeById(payload.employeeId);
    if (!employee) throw new Error('Employee not found');

    const newRequest: TimeOffRequest = {
      id: `req-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeLoginId: employee.loginId,
      department: employee.department,
      type: payload.type,
      startDate: payload.startDate,
      endDate: payload.endDate,
      days: payload.days,
      reason: payload.reason,
      attachmentName: payload.attachmentName,
      status: 'Pending',
      appliedAt: new Date().toISOString(),
    };

    const requests = this.getTimeOffRequests();
    requests.unshift(newRequest);
    localStorage.setItem(STORAGE_KEYS.TIMEOFF, JSON.stringify(requests));

    // Notify HR
    this.addNotification({
      userId: 'ALL_HR',
      title: 'Time-Off Request Submitted',
      message: `${employee.name} applied for ${payload.days} day(s) of ${payload.type}.`,
      type: 'leave',
      linkTo: '/time-off',
    });

    return newRequest;
  }

  static reviewTimeOffRequest(
    requestId: string,
    status: 'Approved' | 'Rejected',
    reviewerName: string,
    notes?: string
  ): TimeOffRequest {
    const requests = this.getTimeOffRequests();
    const index = requests.findIndex((r) => r.id === requestId);
    if (index < 0) throw new Error('Request not found');

    const req = requests[index];
    req.status = status;
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = reviewerName;
    req.reviewNotes = notes;

    requests[index] = req;
    localStorage.setItem(STORAGE_KEYS.TIMEOFF, JSON.stringify(requests));

    // Update employee leave balance and status if approved
    const employee = this.getEmployeeById(req.employeeId);
    if (employee && status === 'Approved') {
      if (req.type === 'Paid Time Off') {
        employee.leaveBalance.paidTimeOff.used += req.days;
      } else if (req.type === 'Sick Time Off') {
        employee.leaveBalance.sickTimeOff.used += req.days;
      } else if (req.type === 'Unpaid Leave') {
        employee.leaveBalance.unpaidLeave.used += req.days;
      }

      const today = new Date().toISOString().split('T')[0];
      if (req.startDate <= today && req.endDate >= today) {
        employee.status = 'on_leave';
      }

      this.saveEmployee(employee);
    }

    // Notify employee
    this.addNotification({
      userId: req.employeeId,
      title: `Time-Off Request ${status}`,
      message: `Your request for ${req.days} day(s) of ${req.type} has been ${status.toLowerCase()} by ${reviewerName}.`,
      type: 'leave',
      linkTo: '/time-off',
    });

    return req;
  }

  // --- Dynamic Salary & Payable Days Calculation Engine (INR) ---
  static calculateSalaryBreakdown(
    employee: Employee,
    year: number,
    monthZeroIndexed: number
  ): SalaryBreakdown {
    const standardWorkingDays = getStandardWorkingDays(year, monthZeroIndexed);
    const attendanceRecords = this.getEmployeeAttendance(employee.id);
    const timeOffRequests = this.getEmployeeTimeOffRequests(employee.id);

    // Calculate month strings
    const monthStart = new Date(year, monthZeroIndexed, 1).toISOString().split('T')[0];
    const monthEnd = new Date(year, monthZeroIndexed + 1, 0).toISOString().split('T')[0];

    // Filter attendance in this month
    const monthAttendance = attendanceRecords.filter(
      (r) => r.date >= monthStart && r.date <= monthEnd
    );

    let presentDays = monthAttendance.filter((r) => r.status === 'present').length;
    
    // Approved leave days in this month
    let paidLeaveDays = 0;
    let unpaidLeaveDays = 0;

    timeOffRequests
      .filter((r) => r.status === 'Approved' && r.startDate <= monthEnd && r.endDate >= monthStart)
      .forEach((r) => {
        if (r.type === 'Paid Time Off' || r.type === 'Sick Time Off') {
          paidLeaveDays += r.days;
        } else if (r.type === 'Unpaid Leave') {
          unpaidLeaveDays += r.days;
        }
      });

    let absentDays = monthAttendance.filter(
      (r) => r.status === 'absent' && !r.hasAppliedLeave
    ).length;

    // Payable Days formula: Standard - Absent (unexcused) - Unpaid Leave
    const payableDays = Math.max(
      0,
      standardWorkingDays - absentDays - unpaidLeaveDays
    );

    // Dynamic Components proportional to payable days
    const payableRatio = payableDays / standardWorkingDays;
    const baseMonthlyWage = employee.monthlyWage;
    const proRatedWage = Math.round(baseMonthlyWage * payableRatio);

    const cfg = employee.salaryConfig;
    const basicSalary = Math.round(proRatedWage * (cfg.basicPercentage / 100));
    const hra = Math.round(basicSalary * (cfg.hraPercentage / 100));
    const standardAllowance = Math.round(cfg.standardAllowance * payableRatio);
    const performanceBonus = Math.round(basicSalary * (cfg.performanceBonusPercentage / 100));
    const lta = Math.round(basicSalary * (cfg.ltaPercentage / 100));

    const grossSalary = basicSalary + hra + standardAllowance + performanceBonus + lta;

    const professionalTax = cfg.professionalTax;
    const pfDeduction = Math.round(basicSalary * (cfg.pfPercentage / 100));
    const totalDeductions = professionalTax + pfDeduction;

    const netSalary = Math.max(0, grossSalary - totalDeductions);

    return {
      standardWorkingDays,
      presentDays,
      absentDays,
      paidLeaveDays,
      unpaidLeaveDays,
      payableDays,
      baseMonthlyWage,
      proRatedWage,
      basicSalary,
      hra,
      standardAllowance,
      performanceBonus,
      lta,
      grossSalary,
      professionalTax,
      pfDeduction,
      totalDeductions,
      netSalary,
    };
  }

  // --- Notifications ---
  static getNotifications(userId: string, role: Role): AppNotification[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: AppNotification[] = data ? JSON.parse(data) : [];
      return all
        .filter((n) => n.userId === userId || (role === 'HR_ADMIN' && n.userId === 'ALL_HR'))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return [];
    }
  }

  static addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): void {
    const all = this.getAllNotifications();
    const newNotif: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    all.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
  }

  static markAllNotificationsRead(userId: string, role: Role): void {
    const all = this.getAllNotifications();
    all.forEach((n) => {
      if (n.userId === userId || (role === 'HR_ADMIN' && n.userId === 'ALL_HR')) {
        n.read = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
  }

  private static getAllNotifications(): AppNotification[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}

