import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, Sparkles, AlertCircle, Eye, EyeOff, User, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('training@jalaacademy.com');
  const [password, setPassword] = useState('jobprogram');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign up and Password visibility state variables
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        await register(email, password, fullName);
        setSuccessMessage('Registration request submitted successfully! Your account status is now Pending Approval. Please contact an HR Manager or Administrator to approve your account.');
        setIsSignUp(false);
        setPassword('');
        setConfirmPassword('');
        setFullName('');
      } else {
        await login(email, password, rememberMe);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || (isSignUp ? 'Registration failed.' : 'Authentication failed. Please verify credentials.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoPreset = (type: 'magnus' | 'admin') => {
    if (type === 'magnus') {
      setEmail('training@jalaacademy.com');
      setPassword('jobprogram');
    } else {
      setEmail('admin@jala.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-4">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">JALA Academy</h1>
          <p className="text-sm font-semibold text-slate-600">Use the below details to login</p>
          <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block text-left text-xs font-semibold text-slate-700">
            <div>Email : <span className="text-slate-900 select-all font-bold">training@jalaacademy.com</span></div>
            <div>Password : <span className="text-slate-900 select-all font-bold">jobprogram</span></div>
          </div>
        </div>

        {/* Sign In / Sign Up Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError('');
              setPassword('');
              setConfirmPassword('');
            }}
            className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              !isSignUp ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError('');
              setFullName('');
              setPassword('');
              setConfirmPassword('');
            }}
            className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              isSignUp ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Full Name</label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <User className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-transparent border-none outline-none text-xs w-full text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Email Address</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <Mail className="w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@enterprise.com"
                className="bg-transparent border-none outline-none text-xs w-full text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-none outline-none text-xs w-full text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Confirm Password</label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <Lock className="w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none text-xs w-full text-slate-900 placeholder:text-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {!isSignUp && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember Me</span>
              </label>
              <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">Forgot Password?</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs disabled:opacity-50"
          >
            {isSubmitting
              ? isSignUp ? 'Creating Account...' : 'Authenticating...'
              : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Helper - Only show for Sign In */}
        {!isSignUp && (
          <div className="pt-4 border-t border-slate-200 space-y-2 text-center">
            <p className="text-[11px] text-slate-500 font-medium">Quick Demo Preset Credentials:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoPreset('magnus')}
                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Demo HR User
              </button>
              <button
                type="button"
                onClick={() => setDemoPreset('admin')}
                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Super Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
