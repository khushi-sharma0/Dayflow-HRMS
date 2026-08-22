import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CreateEmployeeModal } from '../components/CreateEmployeeModal';
import { Employee, AttendanceStatus } from '../types';

interface EmployeesPageProps {
  onNavigateToProfile: (employeeId: string) => void;
}

export const EmployeesPage: React.FC<EmployeesPageProps> = ({ onNavigateToProfile }) => {
  const { allEmployees, role, refreshUserData } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const departments = ['ALL', ...Array.from(new Set(allEmployees.map((e) => e.department)))];

  const filteredEmployees = allEmployees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobPosition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Employee Directory</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Overview of personnel profiles, department assignments, and live office attendance statuses.
          </p>
        </div>

        {role === 'HR_ADMIN' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-purple-600/25 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Employee</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#12141f] border border-gray-800 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee name, Login ID (LOI...), position, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition-all font-sans"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-purple-500/60"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'ALL' ? 'All Departments' : dept}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-purple-500/60"
          >
            <option value="ALL">All Statuses</option>
            <option value="present">Present (Green)</option>
            <option value="absent">Absent (Red)</option>
            <option value="absent_no_leave">Absent No Leave (Yellow)</option>
            <option value="on_leave">On Leave (Blue)</option>
          </select>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => {
          // Status Indicators per requirement:
          // Green = present/in office
          // Red = absent
          // Yellow = absent and has not applied for time off
          // Blue = on approved leave
          let statusBadge = {
            bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
            dot: 'bg-rose-500',
            label: 'Absent',
          };

          if (emp.status === 'present') {
            statusBadge = {
              bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
              dot: 'bg-emerald-500',
              label: 'Present / In Office',
            };
          } else if (emp.status === 'absent_no_leave') {
            statusBadge = {
              bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
              dot: 'bg-amber-500',
              label: 'Absent (No Leave)',
            };
          } else if (emp.status === 'on_leave') {
            statusBadge = {
              bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
              dot: 'bg-blue-500',
              label: 'On Approved Leave',
            };
          }

          return (
            <motion.div
              key={emp.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              onClick={() => onNavigateToProfile(emp.id)}
              className="p-5 rounded-2xl bg-[#12141f] border border-gray-800/80 hover:border-purple-500/50 cursor-pointer transition-all shadow-md hover:shadow-xl hover:shadow-purple-500/5 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Card Top: Avatar, Name, Login ID, Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={emp.avatarUrl}
                        alt={emp.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-700/80 group-hover:ring-purple-500/60 transition-all"
                        referrerPolicy="no-referrer"
                      />
                      {/* Live status dot on avatar */}
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#12141f] ${statusBadge.dot}`}
                      ></span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                          {emp.name}
                        </h3>
                        {emp.role === 'HR_ADMIN' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                            HR
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400">{emp.jobPosition}</div>
                      <div className="font-mono text-[10px] text-purple-400/90 font-medium mt-0.5">
                        {emp.loginId}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${statusBadge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
                    <span>{statusBadge.label}</span>
                  </span>
                </div>

                {/* Details Grid */}
                <div className="p-3 rounded-xl bg-[#0b0c10] border border-gray-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Department:
                    </span>
                    <span className="text-gray-200 font-medium">{emp.department}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" /> Location:
                    </span>
                    <span className="text-gray-200 font-medium">{emp.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-400" /> Email:
                    </span>
                    <span className="text-gray-300 truncate max-w-[150px]">{emp.email}</span>
                  </div>
                </div>
              </div>

              {/* Bottom footer button */}
              <div className="pt-3 mt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-purple-400 group-hover:text-purple-300">
                <span className="font-medium">View Full Profile</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#12141f] border border-gray-800 text-gray-500 text-sm">
          No employees match your search and filter criteria.
        </div>
      )}

      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEmployeeCreated={() => refreshUserData()}
      />
    </div>
  );
};
