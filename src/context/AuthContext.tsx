import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Employee, Role } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  currentUser: Employee | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (loginIdOrEmail: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  updateCurrentUserProfile: (updatedFields: Partial<Employee>) => void;
  changePassword: (newPassword: string) => void;
  refreshUserData: () => void;
  allEmployees: Employee[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

  const refreshUserData = useCallback(() => {
    StorageService.init();
    const user = StorageService.getCurrentUser();
    const employees = StorageService.getEmployees();
    setCurrentUser(user);
    setAllEmployees(employees);
  }, []);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  const login = (loginIdOrEmail: string, password: string): { success: boolean; message?: string } => {
    const employees = StorageService.getEmployees();
    const cleanQuery = loginIdOrEmail.trim().toLowerCase();
    
    const matchedEmployee = employees.find(
      (e) => e.loginId.toLowerCase() === cleanQuery || e.email.toLowerCase() === cleanQuery
    );

    if (!matchedEmployee) {
      return { success: false, message: 'Invalid Login ID or Email. Please contact your HR officer.' };
    }

    if (matchedEmployee.password !== password) {
      return { success: false, message: 'Incorrect password. Please verify your credentials.' };
    }

    StorageService.setCurrentUser(matchedEmployee.id);
    setCurrentUser(matchedEmployee);
    setAllEmployees(employees);
    return { success: true };
  };

  const logout = () => {
    StorageService.logout();
    setCurrentUser(null);
  };

  const updateCurrentUserProfile = (updatedFields: Partial<Employee>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    StorageService.saveEmployee(updated);
    setCurrentUser(updated);
    setAllEmployees(StorageService.getEmployees());
  };

  const changePassword = (newPassword: string) => {
    if (!currentUser) return;
    const updated: Employee = {
      ...currentUser,
      password: newPassword,
      isTemporaryPassword: false,
    };
    StorageService.saveEmployee(updated);
    setCurrentUser(updated);
    setAllEmployees(StorageService.getEmployees());
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        login,
        logout,
        updateCurrentUserProfile,
        changePassword,
        refreshUserData,
        allEmployees,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
