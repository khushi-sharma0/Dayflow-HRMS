import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { AppLayout } from './layouts/AppLayout';
import { HRDashboard } from './pages/HRDashboard';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { EmployeesPage } from './pages/EmployeesPage';
import { EmployeeProfilePage } from './pages/EmployeeProfilePage';
import { AttendancePage } from './pages/AttendancePage';
import { TimeOffPage } from './pages/TimeOffPage';
import { SalaryPayrollPage } from './pages/SalaryPayrollPage';

type NavigationTab = 'dashboard' | 'employees' | 'attendance' | 'timeoff' | 'payroll' | 'profile';

const MainApp: React.FC = () => {
  const { isAuthenticated, currentUser, role } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  if (!isAuthenticated || !currentUser) {
    return <AuthPage />;
  }

  const handleNavigate = (tab: NavigationTab, employeeId?: string) => {
    if (tab === 'profile') {
      setSelectedProfileId(employeeId || currentUser.id);
    }
    setActiveTab(tab);
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onNavigate={(tab) => handleNavigate(tab)}
      onOpenProfile={(employeeId) => handleNavigate('profile', employeeId)}
    >
      {activeTab === 'dashboard' && (
        <>
          {role === 'HR_ADMIN' ? (
            <HRDashboard onNavigate={handleNavigate} />
          ) : (
            <EmployeeDashboard onNavigate={handleNavigate} />
          )}
        </>
      )}

      {activeTab === 'employees' && (
        <EmployeesPage
          onNavigateToProfile={(empId) => handleNavigate('profile', empId)}
        />
      )}

      {activeTab === 'profile' && (
        <EmployeeProfilePage
          employeeId={selectedProfileId || currentUser.id}
          onBack={() => setActiveTab('employees')}
        />
      )}

      {activeTab === 'attendance' && <AttendancePage />}

      {activeTab === 'timeoff' && <TimeOffPage />}

      {activeTab === 'payroll' && <SalaryPayrollPage />}
    </AppLayout>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}