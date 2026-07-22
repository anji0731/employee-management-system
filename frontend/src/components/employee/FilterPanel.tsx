import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import type { Department } from '../../types/employee';

interface FilterPanelProps {
  departments: Department[];
  departmentId: string;
  setDepartmentId: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  includeDeleted: boolean;
  setIncludeDeleted: (val: boolean) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  departments,
  departmentId,
  setDepartmentId,
  status,
  setStatus,
  gender,
  setGender,
  includeDeleted,
  setIncludeDeleted,
  onReset,
}) => {
  const deptList = Array.isArray(departments) ? departments : (departments as any)?.items || [];

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl text-xs shadow-xs">
      <div className="flex items-center gap-1.5 font-semibold text-slate-700 mr-2">
        <Filter className="w-3.5 h-3.5 text-blue-600" /> Filters:
      </div>

      {/* Department Dropdown */}
      <select
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
        className="bg-white border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="">All Departments</option>
        {deptList.map((d: any) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      {/* Status Dropdown */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-white border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="On Leave">On Leave</option>
      </select>

      {/* Gender Dropdown */}
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="bg-white border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      {/* Show Soft Deleted Checkbox */}
      <label className="flex items-center gap-2 text-slate-700 cursor-pointer ml-auto font-medium">
        <input
          type="checkbox"
          checked={includeDeleted}
          onChange={(e) => setIncludeDeleted(e.target.checked)}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span>Show Deleted</span>
      </label>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="p-1.5 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors ml-2"
        title="Reset Filters"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
