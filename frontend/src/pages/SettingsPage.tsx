import React from 'react';
import { Settings } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <Settings className="w-6 h-6 text-slate-600" /> System Settings
      </h1>
      <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-500 font-medium shadow-xs">
        System configuration settings panel ready.
      </div>
    </div>
  );
};
