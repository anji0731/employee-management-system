import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Key, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export const PermissionsPage: React.FC = () => {
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => (await api.get('/permissions')).data,
  });

  // Group permissions by module
  const groupedPermissions: { [key: string]: any[] } = {};
  permissions.forEach((p: any) => {
    const mod = p.module || 'General';
    if (!groupedPermissions[mod]) {
      groupedPermissions[mod] = [];
    }
    groupedPermissions[mod].push(p);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Key className="w-6 h-6 text-amber-600" /> Permission Matrix Catalog
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Granular system access control permissions defined across core application modules.</p>
      </div>

      {isLoading ? (
        <div className="p-8 space-y-4">
          {[1, 2, 3].map((n) => <div key={n} className="h-16 bg-slate-100 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
            <div key={moduleName} className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <ShieldAlert className="w-4 h-4 text-blue-600" /> {moduleName} Module
              </h3>
              <div className="space-y-2 text-xs">
                {perms.map((p: any) => (
                  <div key={p.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-blue-600">{p.code}</div>
                      <div className="text-[11px] text-slate-600 font-medium mt-0.5">{p.description || 'No description provided.'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
