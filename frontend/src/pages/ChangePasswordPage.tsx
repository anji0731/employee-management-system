import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Key, Lock, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

export const ChangePasswordPage: React.FC = () => {
  const { refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setSuccess(true);
      // Wait a moment, refresh profile so first_login becomes false, then navigate
      setTimeout(async () => {
        await refreshProfile();
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to change password. Please verify current password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-4">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 mx-auto">
            <Key className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Change Password</h1>
          <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
            For security, you must update your temporary password before you can access the system.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Password updated successfully! Redirecting you to Dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Current Temporary Password</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="bg-transparent border-none outline-none text-xs w-full text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">New Password</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="bg-transparent border-none outline-none text-xs w-full text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Confirm New Password</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="bg-transparent border-none outline-none text-xs w-full text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={logout}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Sign Out
            </button>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
