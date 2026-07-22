import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

import { SearchBar } from '../components/employee/SearchBar';
import { Pagination } from '../components/employee/Pagination';
import { MasterTable } from '../components/master/MasterTable';
import type { ColumnDef } from '../components/master/MasterTable';
import { MasterFormModal } from '../components/master/MasterFormModal';
import type { FieldFieldDef } from '../components/master/MasterFormModal';
import type { Department } from '../types/employee';

export const DesignationsPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ['depts-list'],
    queryFn: async () => (await api.get('/departments')).data?.items || (await api.get('/departments')).data || [],
  });

  const { data, isLoading } = useQuery({
    queryKey: ['designations', page, pageSize, search, includeDeleted],
    queryFn: async () => {
      const res = await api.get('/designations', {
        params: { page, page_size: pageSize, search, include_deleted: includeDeleted },
      });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/designations', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
      setIsFormOpen(false);
      showToast('Designation created successfully!');
    },
    onError: (err: any) => showToast(err.response?.data?.detail || 'Error creating designation', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => (await api.put(`/designations/${id}`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
      setIsFormOpen(false);
      setSelectedItem(null);
      showToast('Designation updated successfully!');
    },
    onError: (err: any) => showToast(err.response?.data?.detail || 'Error updating designation', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/designations/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
      showToast('Designation soft deleted!');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/designations/${id}/restore`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
      showToast('Designation restored!');
    },
  });

  const columns: ColumnDef[] = [
    { key: 'title', label: 'Designation Title' },
    { key: 'code', label: 'Code', render: (item) => <span className="font-mono text-xs text-blue-600 font-semibold">{item.code || '-'}</span> },
  ];

  const formFields: FieldFieldDef[] = [
    { name: 'title', label: 'Job Title', required: true },
    { name: 'code', label: 'Code (e.g. SR_ARCH, DEV_LEAD)' },
    {
      name: 'department_id',
      label: 'Department',
      type: 'select',
      required: true,
      options: departments.map((d) => ({ label: d.name, value: d.id })),
    },
  ];

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
            <Briefcase className="w-6 h-6 text-blue-600" /> Designations Master
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage job roles and corporate position titles.</p>
        </div>

        {hasPermission('master:write') && (
          <button onClick={() => { setSelectedItem(null); setIsFormOpen(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors">
            <Plus className="w-4 h-4" /> Add Designation
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 bg-white p-3 border border-slate-200 rounded-xl shadow-xs">
        <SearchBar value={search} onChange={(val) => { setSearch(val); setPage(1); }} />
        <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
          <input type="checkbox" checked={includeDeleted} onChange={(e) => { setIncludeDeleted(e.target.checked); setPage(1); }} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          <span>Show Deleted</span>
        </label>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <MasterTable items={data?.items || []} columns={columns} isLoading={isLoading} onEdit={(item) => { setSelectedItem(item); setIsFormOpen(true); }} onDelete={(item) => deleteMutation.mutate(item.id)} onRestore={(item) => restoreMutation.mutate(item.id)} />
        <Pagination page={page} totalPages={data?.total_pages || 1} totalItems={data?.total || 0} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
      </div>

      <MasterFormModal isOpen={isFormOpen} title="Designation" fields={formFields} initialData={selectedItem} onClose={() => setIsFormOpen(false)} onSubmit={async (payload) => { if (selectedItem) { await updateMutation.mutateAsync({ id: selectedItem.id, payload }); } else { await createMutation.mutateAsync(payload); } }} isSubmitting={createMutation.isPending || updateMutation.isPending} />
    </div>
  );
};
