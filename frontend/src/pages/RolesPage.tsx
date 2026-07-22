import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Plus, CheckCircle, AlertTriangle, Key, Edit, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export const RolesPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  // Form State
  const [roleName, setRoleName] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await api.get('/roles')).data,
  });

  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => (await api.get('/permissions')).data,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/roles', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsFormOpen(false);
      showToast('Role created successfully!');
    },
    onError: (err: any) => showToast(err.response?.data?.detail || 'Failed to create role', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => (await api.put(`/roles/${id}`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsFormOpen(false);
      setSelectedRole(null);
      showToast('Role updated successfully!');
    },
    onError: (err: any) => showToast(err.response?.data?.detail || 'Failed to update role', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/roles/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showToast('Role deleted successfully!');
    },
    onError: (err: any) => showToast(err.response?.data?.detail || 'Error deleting role', 'error'),
  });

  const handleOpenCreate = () => {
    setRoleName('');
    setRoleCode('');
    setDescription('');
    setSelectedPermissionIds([]);
    setSelectedRole(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (role: any) => {
    setSelectedRole(role);
    setRoleName(role.name);
    setRoleCode(role.code);
    setDescription(role.description || '');
    setSelectedPermissionIds(role.permissions.map((p: any) => p.id));
    setIsFormOpen(true);
  };

  const togglePermission = (id: string) => {
    if (selectedPermissionIds.includes(id)) {
      setSelectedPermissionIds(selectedPermissionIds.filter((pid) => pid !== id));
    } else {
      setSelectedPermissionIds([...selectedPermissionIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: roleName,
      code: roleCode,
      description,
      permission_ids: selectedPermissionIds,
    };

    if (selectedRole) {
      updateMutation.mutate({ id: selectedRole.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border shadow-lg flex items-center gap-2 text-xs font-semibold ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" /> Security Roles & RBAC
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Configure security role profiles and map granular permission rights.</p>
        </div>

        <button onClick={handleOpenCreate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors">
          <Plus className="w-4 h-4" /> Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role: any) => (
          <div key={role.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  {role.name}
                  {role.is_system && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                      System Role
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{role.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <button onClick={() => handleOpenEdit(role)} className="p-1.5 text-slate-500 hover:text-amber-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50" title="Edit Role">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                {!role.is_system && (
                  <button onClick={() => deleteMutation.mutate(role.id)} className="p-1.5 text-slate-500 hover:text-rose-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50" title="Delete Role">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center gap-1">
                <Key className="w-3 h-3 text-amber-600" /> Granted Permissions ({role.permissions?.length || 0}):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions?.map((p: any) => (
                  <span key={p.id} className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 rounded text-[10px] font-mono font-medium">
                    {p.code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto text-slate-900">
            <h2 className="text-sm font-bold text-slate-900">{selectedRole ? 'Edit Security Role' : 'Create Security Role'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Name *</label>
                  <input type="text" required value={roleName} onChange={(e) => setRoleName(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Code *</label>
                  <input type="text" required value={roleCode} onChange={(e) => setRoleCode(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600" />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">Select Granted Permission Codes</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  {permissions.map((perm: any) => (
                    <label key={perm.id} className="flex items-center gap-2 text-[11px] text-slate-700 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPermissionIds.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{perm.code}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">{selectedRole ? 'Update Role' : 'Create Role'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
