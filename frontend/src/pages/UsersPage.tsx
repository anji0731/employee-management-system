import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus, Shield, CheckCircle, AlertTriangle, Key, UserCheck, UserX, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

import { SearchBar } from '../components/employee/SearchBar';
import { Pagination } from '../components/employee/Pagination';

export const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [roleIdFilter, setRoleIdFilter] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const { data: roles = [] } = useQuery({
    queryKey: ['roles-list'],
    queryFn: async () => (await api.get('/roles')).data,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, pageSize, search, roleIdFilter, includeDeleted],
    queryFn: async () => {
      const res = await api.get('/users', {
        params: { page, page_size: pageSize, search, role_id: roleIdFilter || undefined, include_deleted: includeDeleted },
      });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/users', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsFormOpen(false);
      resetForm();
      showToast('User created successfully!');
    },
    onError: (err: any) => showToast(err.response?.data?.detail || 'Failed to create user', 'error'),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/users/${id}/toggle-status`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('User status updated!');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ id, pass }: { id: string; pass: string }) =>
      (await api.post(`/users/${id}/reset-password`, { new_password: pass })).data,
    onSuccess: () => {
      setIsResetPasswordOpen(false);
      setNewPassword('');
      showToast('User password reset successfully!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/users/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('User soft deleted!');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/users/${id}/restore`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('User restored!');
    },
  });

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setRoleId(roles[0]?.id || '');
    setSelectedUser(null);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      full_name: fullName,
      email,
      password,
      role_id: roleId,
      is_active: true,
      is_superuser: false,
    });
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
            <Users className="w-6 h-6 text-blue-600" /> User Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage system user accounts, roles, and login access status.</p>
        </div>

        <button onClick={() => { resetForm(); setIsFormOpen(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors">
          <Plus className="w-4 h-4" /> Create User
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 border border-slate-200 rounded-xl shadow-xs">
        <SearchBar value={search} onChange={(val) => { setSearch(val); setPage(1); }} />

        <div className="flex items-center gap-3">
          <select value={roleIdFilter} onChange={(e) => setRoleIdFilter(e.target.value)} className="bg-white border border-slate-300 text-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-600">
            <option value="">All Roles</option>
            {roles.map((r: any) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
            <input type="checkbox" checked={includeDeleted} onChange={(e) => { setIncludeDeleted(e.target.checked); setPage(1); }} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span>Show Deleted</span>
          </label>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((n) => <div key={n} className="h-10 bg-slate-100 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.items?.map((user: any) => (
                  <tr key={user.id} className={`hover:bg-slate-50/80 transition-colors ${user.is_deleted ? 'opacity-60 bg-rose-50/40' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-xs">
                          {user.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.full_name}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-semibold text-[11px] inline-flex items-center gap-1">
                        <Shield className="w-3 h-3 text-blue-600" /> {user.role?.name || 'No Role'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 border rounded-full text-[11px] font-semibold ${user.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => toggleStatusMutation.mutate(user.id)} className="p-1.5 text-slate-500 hover:text-amber-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" title="Toggle Active Status">
                          {user.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>

                        <button onClick={() => { setSelectedUser(user); setIsResetPasswordOpen(true); }} className="p-1.5 text-slate-500 hover:text-cyan-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" title="Reset Password">
                          <Key className="w-3.5 h-3.5" />
                        </button>

                        {!user.is_deleted ? (
                          <button onClick={() => deleteMutation.mutate(user.id)} className="p-1.5 text-slate-500 hover:text-rose-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" title="Soft Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button onClick={() => restoreMutation.mutate(user.id)} className="p-1.5 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors" title="Restore User">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} totalPages={data?.total_pages || 1} totalItems={data?.total || 0} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
      </div>

      {/* Create User Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4 text-slate-900">
            <h2 className="text-sm font-bold text-slate-900">Create New System User</h2>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Role</label>
                <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600">
                  {roles.map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Reset Password Modal */}
      {isResetPasswordOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4 text-xs text-slate-900">
            <h3 className="text-sm font-bold text-slate-900">Reset Password for {selectedUser.email}</h3>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Password</label>
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600" />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsResetPasswordOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
              <button type="button" onClick={() => resetPasswordMutation.mutate({ id: selectedUser.id, pass: newPassword })} disabled={!newPassword || resetPasswordMutation.isPending} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">Reset Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
