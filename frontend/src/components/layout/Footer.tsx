import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-12 border-t border-slate-200 bg-white px-6 flex items-center justify-between text-xs text-slate-500 font-medium">
      <div>© 2026 Magnus Enterprise. All rights reserved.</div>
      <div className="flex items-center gap-4 text-slate-400">
        <span>Enterprise Architecture</span>
        <span>FastAPI + React 19</span>
      </div>
    </footer>
  );
};
