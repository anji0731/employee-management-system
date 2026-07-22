import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import type { Employee, Department, Country, PaginatedEmployeeResponse } from '../types/employee';
import { useAuth } from '../context/AuthContext';

import { SearchBar } from '../components/employee/SearchBar';
import { FilterPanel } from '../components/employee/FilterPanel';
import { EmployeeTable } from '../components/employee/EmployeeTable';
import { Pagination } from '../components/employee/Pagination';
import { EmployeeFormModal } from '../components/employee/EmployeeFormModal';
import { EmployeeDetailsModal } from '../components/employee/EmployeeDetailsModal';

export const EmployeesPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  // State Params
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // UI Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [detailsEmployee, setDetailsEmployee] = useState<Employee | null>(null);
  const [deleteConfirmEmployee, setDeleteConfirmEmployee] = useState<Employee | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [createdAccountCreds, setCreatedAccountCreds] = useState<{ email: string; password: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Queries
  const { data: employeeData, isLoading } = useQuery<PaginatedEmployeeResponse>({
    queryKey: ['employees', page, pageSize, search, departmentId, statusFilter, genderFilter, includeDeleted, sortBy, sortOrder],
    queryFn: async () => {
      const res = await api.get('/employees', {
        params: {
          page,
          page_size: pageSize,
          search,
          department_id: departmentId || undefined,
          status: statusFilter || undefined,
          gender: genderFilter || undefined,
          include_deleted: includeDeleted,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });
      return res.data;
    },
  });

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await api.get('/departments');
      return res.data?.items || res.data || [];
    },
  });

  const { data: countries = [] } = useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await api.get('/countries');
      return res.data?.items || res.data || [];
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data: any) => (await api.post('/employees', data)).data,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsFormOpen(false);
      if (res.temporary_password) {
        setCreatedAccountCreds({
          email: res.email,
          password: res.temporary_password,
        });
      } else {
        showToast('Employee record created successfully!');
      }
    },
    onError: (err: any) => {
      showToast(err.response?.data?.detail || 'Failed to create employee', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => (await api.put(`/employees/${id}`, data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsFormOpen(false);
      setSelectedEmployee(null);
      showToast('Employee record updated successfully!');
    },
    onError: (err: any) => {
      showToast(err.response?.data?.detail || 'Failed to update employee', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/employees/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setDeleteConfirmEmployee(null);
      showToast('Employee record soft deleted successfully!');
    },
    onError: (err: any) => {
      showToast(err.response?.data?.detail || 'Failed to soft delete employee', 'error');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/employees/${id}/restore`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      showToast('Employee record restored successfully!');
    },
    onError: (err: any) => {
      showToast(err.response?.data?.detail || 'Failed to restore employee', 'error');
    },
  });

  const handleFormSubmit = async (data: any) => {
    if (selectedEmployee) {
      await updateMutation.mutateAsync({ id: selectedEmployee.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleResetFilters = () => {
    setDepartmentId('');
    setStatusFilter('');
    setGenderFilter('');
    setIncludeDeleted(false);
    setSearch('');
    setPage(1);
  };

  const deptArray = Array.isArray(departments) ? departments : (departments as any)?.items || [];
  const countryArray = Array.isArray(countries) ? countries : (countries as any)?.items || [];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border shadow-lg flex items-center gap-2 text-xs font-semibold ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Employee Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage corporate personnel records, locations, and designations.</p>
        </div>

        {hasPermission('emp:create') && (
          <button
            onClick={() => {
              setSelectedEmployee(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        )}
      </div>

      {/* Search & Filter Section */}
      <div className="space-y-3">
        <SearchBar value={search} onChange={(val) => { setSearch(val); setPage(1); }} />
        <FilterPanel
          departments={deptArray}
          departmentId={departmentId}
          setDepartmentId={(val) => { setDepartmentId(val); setPage(1); }}
          status={statusFilter}
          setStatus={(val) => { setStatusFilter(val); setPage(1); }}
          gender={genderFilter}
          setGender={(val) => { setGenderFilter(val); setPage(1); }}
          includeDeleted={includeDeleted}
          setIncludeDeleted={(val) => { setIncludeDeleted(val); setPage(1); }}
          onReset={handleResetFilters}
        />
      </div>

      {/* Employee Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <EmployeeTable
          employees={employeeData?.items || []}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onView={(emp) => setDetailsEmployee(emp)}
          onEdit={(emp) => {
            setSelectedEmployee(emp);
            setIsFormOpen(true);
          }}
          onDelete={(emp) => setDeleteConfirmEmployee(emp)}
          onRestore={(emp) => restoreMutation.mutate(emp.id)}
        />

        <Pagination
          page={page}
          totalPages={employeeData?.total_pages || 1}
          totalItems={employeeData?.total || 0}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>

      {/* Add / Edit Form Modal */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedEmployee}
        departments={deptArray}
        countries={countryArray}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        isOpen={!!detailsEmployee}
        onClose={() => setDetailsEmployee(null)}
        employee={detailsEmployee}
        onAvatarUpdated={(newUrl) => {
          if (detailsEmployee) {
            setDetailsEmployee({ ...detailsEmployee, avatar_url: newUrl });
            queryClient.invalidateQueries({ queryKey: ['employees'] });
          }
        }}
      />

      {/* Soft Delete Confirmation Modal */}
      {deleteConfirmEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4 text-center text-slate-900">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Soft Delete Employee</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to soft delete record <strong className="text-slate-900">{deleteConfirmEmployee.first_name} {deleteConfirmEmployee.last_name} ({deleteConfirmEmployee.employee_code})</strong>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmEmployee(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirmEmployee.id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Confirm Soft Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Created Account Credentials Modal */}
      {createdAccountCreds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4 text-slate-900">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Login Account Generated</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                The employee profile has been created along with the following user credentials:
              </p>
            </div>
            <div className="space-y-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Email</span>
                <span className="text-slate-900 font-mono select-all">{createdAccountCreds.email}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Temporary Password</span>
                <span className="text-slate-900 font-mono select-all">{createdAccountCreds.password}</span>
              </div>
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-800 font-semibold text-center">
              ⚠️ Copy these credentials now. The temporary password will not be shown again!
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setCreatedAccountCreds(null)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
