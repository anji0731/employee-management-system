import React from 'react';

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStyles = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'inactive':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'on leave':
      case 'onleave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 border rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${getStyles()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};
