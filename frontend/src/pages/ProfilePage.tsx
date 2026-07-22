import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Lock, CheckCircle, AlertTriangle, Key } from 'lucide-react';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      showToast('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to change password.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-slate-900">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border shadow-lg flex items-center gap-2 text-xs font-semibold ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" /> User Profile & Security Settings
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Manage your enterprise account parameters and security password credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details Card */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xl shadow-xs">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{user?.full_name}</h2>
              <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
              <div className="mt-1">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-semibold text-[11px] inline-flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-600" /> {user?.role?.name || 'Super Admin'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Account Status</span>
              <span className="text-emerald-700 font-semibold">{user?.is_active ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Superuser Access</span>
              <span className="text-slate-900 font-semibold">{user?.is_superuser ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Permissions Granted</span>
              <span className="text-slate-900 font-semibold">{user?.is_superuser ? 'All System Rights' : `${user?.permissions?.length || 0} Rights`}</span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 mt-2"
            >
              <Lock className="w-4 h-4" />
              {isSubmitting ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
