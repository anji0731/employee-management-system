import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-4">
      <div className="text-center space-y-4 max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h1 className="text-3xl font-bold text-slate-900">404 - Page Not Found</h1>
        <p className="text-sm text-slate-500 font-medium">The page you are looking for does not exist or has been moved.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
