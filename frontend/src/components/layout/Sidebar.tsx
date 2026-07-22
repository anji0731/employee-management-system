import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Shield,
  Key,
  Globe,
  Map,
  Building2,
  Building,
  Briefcase,
  Award,
  User,
  Settings,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Employees', path: '/employees', icon: Users, permission: 'emp:read:all' },
  { label: 'Pending Registrations', path: '/registrations/pending', icon: UserCheck, permission: 'emp:create' },
  { label: 'Users', path: '/users', icon: UserCheck, permission: 'admin:users' },
  { label: 'Roles', path: '/roles', icon: Shield, permission: 'admin:roles' },
  { label: 'Permissions', path: '/permissions', icon: Key, permission: 'admin:roles' },
  { label: 'Countries', path: '/countries', icon: Globe, permission: 'master:read' },
  { label: 'States', path: '/states', icon: Map, permission: 'master:read' },
  { label: 'Cities', path: '/cities', icon: Building2, permission: 'master:read' },
  { label: 'Departments', path: '/departments', icon: Building, permission: 'master:read' },
  { label: 'Designations', path: '/designations', icon: Briefcase, permission: 'master:read' },
  { label: 'Skills', path: '/skills', icon: Award, permission: 'master:read' },
  { label: 'Profile', path: '/profile', icon: User },
  { label: 'Settings', path: '/settings', icon: Settings, permission: 'admin:settings' },
];

export const Sidebar: React.FC = () => {
  const { hasPermission } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-200">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-xs">
          M
        </div>
        <div>
          <div className="font-bold text-sm tracking-tight text-slate-900">Magnus Enterprise</div>
          <div className="text-[10px] text-slate-500 font-medium">Employee System v1.0</div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems
          .filter((item) => !item.permission || hasPermission(item.permission))
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-200 text-[11px] text-slate-400 text-center font-medium">
        Powered by JALA Technologies
      </div>
    </aside>
  );
};
