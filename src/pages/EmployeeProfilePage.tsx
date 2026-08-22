import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Briefcase,
  Lock,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Edit3,
  Save,
  X,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  ShieldCheck,
  Award,
  Sparkles,
  Printer,
  ChevronLeft,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { PaySlipModal } from '../components/PaySlipModal';
import { Employee, SalaryBreakdown } from '../types';
import { formatINR, formatIndianDate } from '../utils/formatters';

interface EmployeeProfilePageProps {
  employeeId: string;
  onBack: () => void;
}

export const EmployeeProfilePage: React.FC<EmployeeProfilePageProps> = ({
  employeeId,
  onBack,
}) => {
  const { currentUser, role, refreshUserData, changePassword } = useAuth();
  
  const employee = StorageService.getEmployeeById(employeeId);
  const [activeTab, setActiveTab] = useState<'resume' | 'private' | 'salary' | 'security'>('resume');
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPaySlipOpen, setIsPaySlipOpen] = useState(false);

  // Form fields for editing
  const [formData, setFormData] = useState<Partial<Employee>>({});

  // Security password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  if (!employee) {
    return (
      <div className="p-8 text-center bg-[#12141f] rounded-2xl border border-gray-800">
        <p className="text-gray-400">Employee record not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === employee.id;
  const isHRAdmin = role === 'HR_ADMIN';

  const startEditing = () => {
    setFormData({
      about: employee.about,
      phone: employee.phone,
      address: employee.address,
      skills: [...employee.skills],
      dob: employee.dob,
      jobPosition: employee.jobPosition,
      department: employee.department,
      location: employee.location,
      monthlyWage: employee.monthlyWage,
      emergencyContact: { ...employee.emergencyContact },
    });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    const updated: Employee = {
      ...employee,
      ...formData,
      skills: formData.skills || employee.skills,
      emergencyContact: formData.emergencyContact || employee.emergencyContact,
    };

    StorageService.saveEmployee(updated);
    refreshUserData();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (isOwnProfile) {
      changePassword(newPassword);
    } else if (isHRAdmin) {
      const updated: Employee = {
        ...employee,
        password: newPassword,
        isTemporaryPassword: false,
      };
      StorageService.saveEmployee(updated);
      refreshUserData();
    }

    setPasswordMsg({ type: 'success', text: 'Password successfully updated!' });
    setNewPassword('');
    setConfirmPassword('');
  };

  // Salary Calculations for current month
  const currentMonthYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth();
  const salaryBreakdown: SalaryBreakdown = StorageService.calculateSalaryBreakdown(
    employee,
    currentMonthYear,
    currentMonthIdx
  );

  return (
    <div className="space-y-6">
      {/* Back Button & Top Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-300 font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        {/* Edit Profile Action */}
        {(isHRAdmin || isOwnProfile) && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-all shadow-md shadow-purple-600/30"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={startEditing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700/60 text-xs font-medium text-purple-300 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile Information</span>
              </button>
            )}
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="p-6 rounded-2xl bg-[#12141f] border border-gray-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={employee.avatarUrl}
                alt={employee.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/40 shadow-lg"
                referrerPolicy="no-referrer"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#12141f] ${
                  employee.status === 'present'
                    ? 'bg-emerald-400'
                    : employee.status === 'on_leave'
                    ? 'bg-blue-400'
                    : employee.status === 'absent_no_leave'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              ></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">{employee.name}</h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {employee.loginId}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">{employee.jobPosition}</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                <span>{employee.department}</span>
                <span>•</span>
                <span>{employee.location}</span>
                <span>•</span>
                <span>Joined {formatIndianDate(employee.joiningDate, 'short')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                employee.status === 'present'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : employee.status === 'on_leave'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : employee.status === 'absent_no_leave'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {employee.status === 'present'
                ? '● Present / In Office'
                : employee.status === 'on_leave'
                ? '● On Approved Leave'
                : employee.status === 'absent_no_leave'
                ? '● Absent (No Leave)'
                : '● Absent'}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-800/80 pt-2 overflow-x-auto">
          {[
            { id: 'resume', label: 'Resume & Overview', icon: Briefcase },
            { id: 'private', label: 'Private & Statutory', icon: User },
            {
              id: 'salary',
              label: 'Salary & Compensation',
              icon: Building2,
              hrOnly: true,
            },
            { id: 'security', label: 'Security & Access', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isRestricted = tab.hrOnly && !isHRAdmin;
            const isCurrent = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isCurrent ? 'text-purple-400' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
                {tab.hrOnly && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 font-mono">
                    HR Only
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Resume & Overview */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* About & Bio */}
          <div className="md:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Professional Summary / About
              </h3>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={formData.about || ''}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-purple-500/60 resize-none"
                />
              ) : (
                <p className="text-xs text-gray-300 leading-relaxed">{employee.about}</p>
              )}
            </div>

            {/* Skills */}
            <div className="p-6 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Skills & Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-300 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="p-6 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Certifications & Credentials
              </h3>
              <div className="space-y-2.5">
                {employee.certifications.length > 0 ? (
                  employee.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800 flex items-center gap-3 text-xs text-gray-200"
                    >
                      <Award className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No verified certifications logged.</p>
                )}
              </div>
            </div>
          </div>

          {/* Work Meta Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4 text-xs">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Organizational Meta
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 block mb-0.5">Company</span>
                  <span className="font-semibold text-white">{employee.companyName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Department</span>
                  {isEditing && isHRAdmin ? (
                    <input
                      type="text"
                      value={formData.department || ''}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#0b0c10] border border-gray-800 text-xs text-white"
                    />
                  ) : (
                    <span className="font-medium text-gray-200">{employee.department}</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Job Position</span>
                  {isEditing && isHRAdmin ? (
                    <input
                      type="text"
                      value={formData.jobPosition || ''}
                      onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#0b0c10] border border-gray-800 text-xs text-white"
                    />
                  ) : (
                    <span className="font-medium text-gray-200">{employee.jobPosition}</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Joining Date</span>
                  <span className="text-gray-200">{formatIndianDate(employee.joiningDate, 'short')}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Work Location</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#0b0c10] border border-gray-800 text-xs text-white"
                    />
                  ) : (
                    <span className="text-gray-200">{employee.location}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Private & Statutory Information */}
      {activeTab === 'private' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Contact & Address */}
          <div className="p-6 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4 text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Personal & Address Details
            </h3>

            <div className="space-y-3.5">
              <div>
                <span className="text-gray-500 block mb-1">Official Email Address</span>
                <span className="font-mono text-gray-200">{employee.email}</span>
              </div>

              <div>
                <span className="text-gray-500 block mb-1">Phone Number (+91)</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#0b0c10] border border-gray-800 text-xs text-white"
                  />
                ) : (
                  <span className="text-gray-200">{employee.phone}</span>
                )}
              </div>

              <div>
                <span className="text-gray-500 block mb-1">Date of Birth</span>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dob || ''}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#0b0c10] border border-gray-800 text-xs text-white"
                  />
                ) : (
                  <span className="text-gray-200">{employee.dob ? formatIndianDate(employee.dob, 'short') : 'Not specified'}</span>
                )}
              </div>

              <div>
                <span className="text-gray-500 block mb-1">Residential Address (India)</span>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#0b0c10] border border-gray-800 text-xs text-white resize-none"
                  />
                ) : (
                  <span className="text-gray-200 leading-relaxed">
                    {employee.address} {employee.pinCode ? `— PIN: ${employee.pinCode}` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Statutory (India) & Banking Info */}
          <div className="space-y-6">
            {/* Statutory Compliance Info (PAN, UAN, PF) */}
            <div className="p-6 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Statutory & Tax Identity (India)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono">
                  Confidential HR
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center p-2 rounded-lg bg-[#0b0c10] border border-gray-800/80">
                  <span className="text-gray-400">Permanent Account Number (PAN):</span>
                  <span className="font-mono font-bold text-amber-300">
                    {employee.statutoryDetails?.pan || 'ABCDE1234F'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-[#0b0c10] border border-gray-800/80">
                  <span className="text-gray-400">Universal Account Number (UAN):</span>
                  <span className="font-mono text-purple-300">
                    {employee.statutoryDetails?.uan || '100912345678'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-[#0b0c10] border border-gray-800/80">
                  <span className="text-gray-400">PF Member ID:</span>
                  <span className="font-mono text-gray-300">
                    {employee.statutoryDetails?.pfNumber || 'KN/BNG/0048123/000/0001'}
                  </span>
                </div>
                {employee.statutoryDetails?.esicNumber && (
                  <div className="flex justify-between items-center p-2 rounded-lg bg-[#0b0c10] border border-gray-800/80">
                    <span className="text-gray-400">ESIC Registration:</span>
                    <span className="font-mono text-gray-300">
                      {employee.statutoryDetails.esicNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Information */}
            <div className="p-6 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4 text-xs">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Disbursement Bank Details (India)
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank Name:</span>
                  <span className="text-gray-200 font-medium">{employee.bankDetails?.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Number:</span>
                  <span className="font-mono text-purple-300">{employee.bankDetails?.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">IFSC Code:</span>
                  <span className="font-mono text-gray-300">{employee.bankDetails?.routingOrIfsc}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-6 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4 text-xs">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Emergency Contact
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 block mb-1">Contact Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact?.name || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyContact: {
                            ...employee.emergencyContact,
                            ...formData.emergencyContact,
                            name: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 rounded-lg bg-[#0b0c10] border border-gray-800 text-xs text-white"
                    />
                  ) : (
                    <span className="font-semibold text-white">{employee.emergencyContact.name}</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Relationship</span>
                  <span className="text-gray-300">{employee.emergencyContact.relation}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Emergency Phone</span>
                  <span className="text-gray-300">{employee.emergencyContact.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Salary Info (Strictly HR/Admin ONLY) */}
      {activeTab === 'salary' && (
        <div>
          {!isHRAdmin ? (
            /* Protected Access Alert */
            <div className="p-8 rounded-2xl bg-rose-950/20 border border-rose-800/40 text-center space-y-3">
              <Shield className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-sm font-bold text-rose-200">Access Restricted</h3>
              <p className="text-xs text-rose-300/80 max-w-md mx-auto">
                Under company security and privacy policies, employee salary structures, component allocations, and wage management are strictly restricted to authorized HR/Admin Officers.
              </p>
            </div>
          ) : (
            /* HR Salary Management View */
            <div className="space-y-6">
              {/* Wage Header */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171529] to-[#12141f] border border-purple-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                      Compensation & Wage Structure (INR)
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                      Indian Statutory CTC
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white mt-1">
                    {formatINR(employee.monthlyWage)} <span className="text-xs text-gray-400 font-normal">/ month ({formatINR(employee.monthlyWage * 12)} / year CTC)</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsPaySlipOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Generate Full Pay Slip</span>
                </button>
              </div>

              {/* Attendance Influence on Payable Days */}
              <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Current Month Attendance to Payable Days Link</span>
                  <span className="text-purple-300 font-mono">
                    {salaryBreakdown.payableDays} / {salaryBreakdown.standardWorkingDays} Payable Days
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800">
                    <span className="text-gray-500 text-[10px]">Standard Working Days</span>
                    <div className="text-base font-bold text-white mt-0.5">{salaryBreakdown.standardWorkingDays}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800">
                    <span className="text-gray-500 text-[10px]">Present Logged</span>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">{salaryBreakdown.presentDays}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800">
                    <span className="text-gray-500 text-[10px]">Unpaid / Absent Penalty</span>
                    <div className="text-base font-bold text-rose-400 mt-0.5">
                      -{salaryBreakdown.absentDays + salaryBreakdown.unpaidLeaveDays} Days
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40">
                    <span className="text-purple-300 text-[10px] font-semibold">Net Payable Days</span>
                    <div className="text-base font-black text-purple-300 mt-0.5">{salaryBreakdown.payableDays}</div>
                  </div>
                </div>
              </div>

              {/* Dynamic Components Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings */}
                <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                    <span>Dynamic Earnings Breakdown</span>
                    <span className="text-emerald-400 font-mono">{formatINR(salaryBreakdown.grossSalary)}</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800/80 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-white">Basic Salary</div>
                        <div className="text-[10px] text-gray-500">
                          {employee.salaryConfig.basicPercentage}% of Pro-rated Base
                        </div>
                      </div>
                      <span className="font-mono font-bold text-white">
                        {formatINR(salaryBreakdown.basicSalary)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800/80 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-white">House Rent Allowance (HRA)</div>
                        <div className="text-[10px] text-gray-500">
                          {employee.salaryConfig.hraPercentage}% of Basic
                        </div>
                      </div>
                      <span className="font-mono font-bold text-white">
                        {formatINR(salaryBreakdown.hra)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800/80 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-white">Standard Allowance</div>
                        <div className="text-[10px] text-gray-500">Fixed Monthly Component</div>
                      </div>
                      <span className="font-mono font-bold text-white">
                        {formatINR(salaryBreakdown.standardAllowance)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800/80 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-white">Performance Bonus</div>
                        <div className="text-[10px] text-gray-500">
                          {employee.salaryConfig.performanceBonusPercentage}% of Basic
                        </div>
                      </div>
                      <span className="font-mono font-bold text-white">
                        {formatINR(salaryBreakdown.performanceBonus)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800/80 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-white">Leave Travel Allowance (LTA)</div>
                        <div className="text-[10px] text-gray-500">
                          {employee.salaryConfig.ltaPercentage}% of Basic
                        </div>
                      </div>
                      <span className="font-mono font-bold text-white">
                        {formatINR(salaryBreakdown.lta)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions & Net Take Home */}
                <div className="p-5 rounded-2xl bg-[#12141f] border border-gray-800 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                    <span>Statutory Deductions & Taxes</span>
                    <span className="text-rose-400 font-mono">{formatINR(salaryBreakdown.totalDeductions)}</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800/80 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-white">Professional Tax (PT)</div>
                        <div className="text-[10px] text-gray-500">Statutory Monthly Standard</div>
                      </div>
                      <span className="font-mono font-bold text-rose-400">
                        {formatINR(salaryBreakdown.professionalTax)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800/80 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-white">Provident Fund (EPF)</div>
                        <div className="text-[10px] text-gray-500">
                          {employee.salaryConfig.pfPercentage}% of Basic
                        </div>
                      </div>
                      <span className="font-mono font-bold text-rose-400">
                        {formatINR(salaryBreakdown.pfDeduction)}
                      </span>
                    </div>

                    {/* Net Pay Card */}
                    <div className="p-5 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/30 border border-purple-500/40 space-y-2 mt-6">
                      <span className="text-xs text-purple-300 font-medium">Computed Net Salary (Direct Bank Transfer)</span>
                      <div className="text-3xl font-black text-white font-mono">
                        {formatINR(salaryBreakdown.netSalary)}
                      </div>
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Calculated based on {salaryBreakdown.payableDays} payable days for this cycle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <div className="max-w-xl space-y-6">
          <div className="p-6 rounded-2xl bg-[#12141f] border border-gray-800 space-y-5">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Change Account Password
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Update account credentials. Passwords must be at least 6 characters.
              </p>
            </div>

            {passwordMsg.text && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/40 border border-rose-800 text-rose-300'
                }`}
              >
                {passwordMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md shadow-purple-600/30"
              >
                <KeyRound className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      <PaySlipModal
        isOpen={isPaySlipOpen}
        onClose={() => setIsPaySlipOpen(false)}
        employee={employee}
        breakdown={salaryBreakdown}
      />
    </div>
  );
};

