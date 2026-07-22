import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/guard/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { UsersPage } from './pages/UsersPage';
import { RolesPage } from './pages/RolesPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { CountriesPage } from './pages/CountriesPage';
import { StatesPage } from './pages/StatesPage';
import { CitiesPage } from './pages/CitiesPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { DesignationsPage } from './pages/DesignationsPage';
import { SkillsPage } from './pages/SkillsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { PendingRegistrationsPage } from './pages/PendingRegistrationsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes Guard */}
            <Route element={<ProtectedRoute />}>
              {/* Fullscreen Password Change Route (No Sidebar Layout) */}
              <Route path="/change-password" element={<ChangePasswordPage />} />

              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* Employee Modules */}
                <Route element={<ProtectedRoute requiredPermission="emp:read:all" />}>
                  <Route path="/employees" element={<EmployeesPage />} />
                </Route>

                {/* Pending registrations */}
                <Route element={<ProtectedRoute requiredPermission="emp:create" />}>
                  <Route path="/registrations/pending" element={<PendingRegistrationsPage />} />
                </Route>

                {/* Administrative User Management */}
                <Route element={<ProtectedRoute requiredPermission="admin:users" />}>
                  <Route path="/users" element={<UsersPage />} />
                </Route>

                {/* Administrative Roles & Permissions */}
                <Route element={<ProtectedRoute requiredPermission="admin:roles" />}>
                  <Route path="/roles" element={<RolesPage />} />
                  <Route path="/permissions" element={<PermissionsPage />} />
                </Route>

                {/* Master Database Directories */}
                <Route element={<ProtectedRoute requiredPermission="master:read" />}>
                  <Route path="/countries" element={<CountriesPage />} />
                  <Route path="/states" element={<StatesPage />} />
                  <Route path="/cities" element={<CitiesPage />} />
                  <Route path="/departments" element={<DepartmentsPage />} />
                  <Route path="/designations" element={<DesignationsPage />} />
                  <Route path="/skills" element={<SkillsPage />} />
                </Route>

                {/* Security Profile */}
                <Route path="/profile" element={<ProfilePage />} />

                {/* System Settings */}
                <Route element={<ProtectedRoute requiredPermission="admin:settings" />}>
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>
            </Route>

            {/* 404 Catch All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
