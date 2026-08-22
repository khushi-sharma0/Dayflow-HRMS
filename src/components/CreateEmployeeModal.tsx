import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  UserPlus,
  Building2,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  FileText,
} from 'lucide-react';
import { StorageService, generateEmployeeLoginId } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { Employee } from '../types';
import { formatINR } from '../utils/formatters';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeCreated?: (employee: Employee) => void;
}

const DEPARTMENTS = [
  'Engineering',
  'Product Design',
  'Human Resources',
  'Marketing',
  'Infrastructure',
  'Finance & Accounts',
  'Operations',
];

const INDIAN_CITIES = [
  { city: 'Bengaluru', state: 'Karnataka', office: 'Bengaluru Tech Park' },
  { city: 'Mumbai', state: 'Maharashtra', office: 'Bandra Kurla Complex (BKC)' },
  { city: 'Gurugram', state: 'Haryana', office: 'Cyber City, Gurugram' },
  { city: 'Hyderabad', state: 'Telangana', office: 'HITEC City' },
  { city: 'Pune', state: 'Maharashtra', office: 'Hinjawadi Phase 1' },
  { city: 'Chennai', state: 'Tamil Nadu', office: 'OMR IT Corridor' },
  { city: 'Noida', state: 'Uttar Pradesh', office: 'Sector 62 IT Hub' },
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

export const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({
  isOpen,
  onClose,
  onEmployeeCreated,
}) => {
  const { refreshUserData } = useAuth();

  const [companyName, setCompanyName] = useState('Dayflow Technologies Pvt. Ltd.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [jobPosition, setJobPosition] = useState('');
  const [selectedLocationIdx, setSelectedLocationIdx] = useState(0);
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [monthlyWage, setMonthlyWage] = useState(125000);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [about, setAbout] = useState('');
  const [pan, setPan] = useState('');
  const [uan, setUan] = useState('');
  const [pinCode, setPinCode] = useState('560103');

  // Result state
  const [createdResult, setCreatedResult] = useState<{
    employee: Employee;
    temporaryPassword: string;
    loginId: string;
  } | null>(null);

  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  if (!isOpen) return null;

  // Real-time Preview Login ID
  const joiningYear = new Date(joiningDate || new Date()).getFullYear();
  const previewLoginId = generateEmployeeLoginId(firstName || 'XX', lastName || 'XX', joiningYear, 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    const locObj = INDIAN_CITIES[selectedLocationIdx] || INDIAN_CITIES[0];
    const locationString = `${locObj.city}, ${locObj.state}`;

    const result = StorageService.createEmployee({
      companyName,
      firstName,
      lastName,
      email,
      phone: phone || '+91 98765 43210',
      department,
      jobPosition: jobPosition || `${department} Specialist`,
      location: locationString,
      city: locObj.city,
      state: locObj.state,
      pinCode: pinCode || '560103',
      country: 'India',
      joiningDate,
      monthlyWage: Number(monthlyWage) || 125000,
      avatarUrl: selectedAvatar,
      about,
      statutoryDetails: (pan || uan) ? {
        pan: pan ? pan.toUpperCase() : `ABCDE${Math.floor(1000 + Math.random() * 9000)}F`,
        uan: uan || `1009${Math.floor(10000000 + Math.random() * 90000000)}`,
      } : undefined,
    });

    setCreatedResult(result);
    refreshUserData();
    if (onEmployeeCreated) {
      onEmployeeCreated(result.employee);
    }
  };

  const handleCopy = (text: string, type: 'id' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setCreatedResult(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setJobPosition('');
    setPan('');
    setUan('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[#12141c] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800/80 bg-[#171a26]/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  {createdResult ? 'Employee Account Created' : 'Create New Employee Account (India)'}
                </h2>
                <p className="text-xs text-gray-400">
                  {createdResult
                    ? 'Credentials successfully generated and ready for distribution.'
                    : 'System will automatically generate standard Login ID and Temporary Password.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {createdResult ? (
              /* Success / Credentials Generated View */
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-200">Onboarding Record Saved</h3>
                    <p className="text-xs text-emerald-300/80 mt-1 leading-relaxed">
                      {createdResult.employee.name} has been added to the HR database under {createdResult.employee.department} ({createdResult.employee.location}). 
                      Monthly CTC / Wage is configured at {formatINR(createdResult.employee.monthlyWage)}.
                    </p>
                  </div>
                </div>

                {/* Generated Credentials Card */}
                <div className="p-5 rounded-xl bg-[#0b0c10] border border-gray-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Generated Credentials
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Standard Format
                    </span>
                  </div>

                  {/* Login ID Display */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-medium">Employee Login ID</label>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#141721] border border-gray-700/60 font-mono text-purple-300 text-sm font-semibold tracking-wider">
                      <span>{createdResult.loginId}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(createdResult.loginId, 'id')}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors"
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Rule: LOI + First 2 letters ({createdResult.employee.firstName.slice(0, 2).toUpperCase()}) + Last 2 letters ({createdResult.employee.lastName.slice(0, 2).toUpperCase()}) + Year ({createdResult.employee.joiningYear}) + Serial ({String(createdResult.employee.serialNumber).padStart(4, '0')})
                    </p>
                  </div>

                  {/* Temporary Password Display */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-medium">Temporary Password</label>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#141721] border border-gray-700/60 font-mono text-amber-300 text-sm font-semibold tracking-wider">
                      <span>{createdResult.temporaryPassword}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(createdResult.temporaryPassword, 'pass')}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                      >
                        {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPass ? 'Copied' : 'Copy Password'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Employee can change this password after their first login in profile settings.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-colors shadow-lg shadow-purple-600/25"
                  >
                    Done & Return to Directory
                  </button>
                </div>
              </div>
            ) : (
              /* Create Employee Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Company & Office Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-purple-400" />
                      Company Entity (India)
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50"
                      placeholder="Dayflow Technologies Pvt. Ltd."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      Work Location & Office
                    </label>
                    <select
                      value={selectedLocationIdx}
                      onChange={(e) => setSelectedLocationIdx(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60"
                    >
                      {INDIAN_CITIES.map((loc, idx) => (
                        <option key={idx} value={idx}>
                          {loc.city}, {loc.state} — {loc.office}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      First Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50"
                      placeholder="e.g. Rohit"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Last Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50"
                      placeholder="e.g. Kapoor"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50"
                      placeholder="rohit.kapoor@dayflow.in"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-purple-400" />
                      Phone (+91 India)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Department & Job Position */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Job Position</label>
                    <input
                      type="text"
                      value={jobPosition}
                      onChange={(e) => setJobPosition(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60"
                      placeholder="e.g. Senior Backend Engineer"
                    />
                  </div>
                </div>

                {/* Joining Date & Monthly Wage (INR) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      Joining Date
                    </label>
                    <input
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <span className="font-semibold text-purple-400 text-sm">₹</span>
                      Monthly Base Wage (INR)
                    </label>
                    <input
                      type="number"
                      min={10000}
                      step={5000}
                      value={monthlyWage}
                      onChange={(e) => setMonthlyWage(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60"
                      placeholder="125000"
                    />
                  </div>
                </div>

                {/* Statutory Compliance Info (PAN & UAN) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-[#0f1118] border border-gray-800">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      PAN Number (India)
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 uppercase font-mono focus:outline-none focus:border-purple-500/60"
                      placeholder="e.g. ABCDE1234F"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      UAN Number (EPFO)
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={uan}
                      onChange={(e) => setUan(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-sm text-gray-200 font-mono focus:outline-none focus:border-purple-500/60"
                      placeholder="e.g. 100912345678"
                    />
                  </div>
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Profile Avatar / Photo</label>
                  <div className="flex items-center gap-3">
                    {PRESET_AVATARS.map((avatar, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`relative rounded-full p-0.5 transition-all ${
                          selectedAvatar === avatar
                            ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-[#12141c]'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={avatar}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live ID Format Preview Indicator */}
                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/30 flex items-center justify-between text-xs">
                  <span className="text-purple-300/80">Auto-calculated ID Format:</span>
                  <span className="font-mono font-semibold text-purple-300 tracking-wider">
                    {firstName && lastName ? previewLoginId : 'LOI[FN][LN][YEAR][SERIAL]'}
                  </span>
                </div>

                {/* Form Actions */}
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-purple-600/20"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create & Generate Credentials</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

