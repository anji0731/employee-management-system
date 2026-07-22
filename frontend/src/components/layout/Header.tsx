import React from 'react';
import { Shield, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full uppercase tracking-wider">
          Enterprise Admin
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900">{user?.full_name || 'System Admin'}</div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
              <Shield className="w-3 h-3 text-blue-600" /> {user?.role?.name || 'Super Admin'}
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
