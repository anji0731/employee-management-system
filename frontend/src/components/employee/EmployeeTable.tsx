import React from 'react';
import { Eye, Edit, Trash2, RefreshCw, ArrowUpDown } from 'lucide-react';
import type { Employee } from '../../types/employee';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../../context/AuthContext';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  sortBy: string;
  sortOrder: string;
  onSort: (column: string) => void;
  onView: (emp: Employee) => void;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
  onRestore: (emp: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  onSort,
  onView,
  onEdit,
  onDelete,
  onRestore,
}) => {
  const { hasPermission } = useAuth();
  const getFullAvatarUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:8000${url}`;
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs font-medium">
        No employee records found matching current search or filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-800">
        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
          <tr>
            <th className="py-3 px-4">Employee</th>
            <th className="py-3 px-4 cursor-pointer hover:text-slate-900" onClick={() => onSort('employee_code')}>
              <div className="flex items-center gap-1">
                Code <ArrowUpDown className="w-3 h-3 text-slate-400" />
              </div>
            </th>
            <th className="py-3 px-4">Contact</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Designation</th>
            <th className="py-3 px-4">Location</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees.map((emp) => (
            <tr key={emp.id} className={`hover:bg-slate-50/80 transition-colors ${emp.is_deleted ? 'opacity-60 bg-rose-50/40' : ''}`}>
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600 text-xs">
                    {emp.avatar_url ? (
                      <img src={getFullAvatarUrl(emp.avatar_url)!} alt={emp.first_name} className="w-full h-full object-cover" />
                    ) : (
                      `${emp.first_name.charAt(0)}${emp.last_name.charAt(0)}`
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{emp.first_name} {emp.last_name}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{emp.gender}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 font-mono font-semibold text-blue-600">{emp.employee_code}</td>
              <td className="py-3 px-4">
                <div className="font-medium text-slate-800">{emp.email}</div>
                <div className="text-[10px] text-slate-500">{emp.mobile}</div>
              </td>
              <td className="py-3 px-4 font-medium text-slate-800">{emp.department?.name || '-'}</td>
              <td className="py-3 px-4 text-slate-600">{emp.designation?.title || '-'}</td>
              <td className="py-3 px-4 text-slate-600">
                {emp.city?.name ? `${emp.city.name}, ${emp.country?.name}` : emp.country?.name || '-'}
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={emp.status} />
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(emp)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {!emp.is_deleted ? (
                    <>
                      {hasPermission('emp:update:all') && (
                        <button
                          onClick={() => onEdit(emp)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Edit Employee"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {hasPermission('emp:delete') && (
                        <button
                          onClick={() => onDelete(emp)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Soft Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  ) : (
                    hasPermission('emp:delete') && (
                      <button
                        onClick={() => onRestore(emp)}
                        className="p-1.5 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                        title="Restore Record"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
