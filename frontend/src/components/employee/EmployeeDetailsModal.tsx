import React from 'react';
import { X, Mail, Phone, Calendar, MapPin, Building, Briefcase, Award } from 'lucide-react';
import type { Employee } from '../../types/employee';
import { StatusBadge } from './StatusBadge';
import { ImageUploader } from './ImageUploader';

interface EmployeeDetailsModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onAvatarUpdated: (url: string) => void;
}

export const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  employee,
  isOpen,
  onClose,
  onAvatarUpdated,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-6 max-h-[90vh] overflow-y-auto relative text-slate-900">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        {/* Profile Banner */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <ImageUploader
            employeeId={employee.id}
            currentAvatarUrl={employee.avatar_url}
            onUploadSuccess={onAvatarUpdated}
          />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{employee.first_name} {employee.last_name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="font-mono text-xs text-blue-600 font-semibold">{employee.employee_code}</span>
              <StatusBadge status={employee.status} />
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 text-xs border-t border-slate-100 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-blue-600" /> Email
              </div>
              <div className="text-slate-900 font-semibold truncate">{employee.email}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Mobile
              </div>
              <div className="text-slate-900 font-semibold">{employee.mobile}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Building className="w-3.5 h-3.5 text-purple-600" /> Department
              </div>
              <div className="text-slate-900 font-semibold">{employee.department?.name || '-'}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-amber-600" /> Designation
              </div>
              <div className="text-slate-900 font-semibold">{employee.designation?.title || '-'}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-cyan-600" /> Date of Birth
              </div>
              <div className="text-slate-900 font-semibold">{employee.date_of_birth}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Joining Date
              </div>
              <div className="text-slate-900 font-semibold">{employee.joining_date}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-slate-500 flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-600" /> Office Location
            </div>
            <div className="text-slate-900 font-semibold">
              {employee.city?.name ? `${employee.city.name}, ${employee.country?.name}` : employee.country?.name || '-'}
            </div>
          </div>

          {/* Assigned Skills */}
          {employee.employee_skills && employee.employee_skills.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-slate-700 font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" /> Skills & Competencies
              </div>
              <div className="flex flex-wrap gap-2">
                {employee.employee_skills.map((es) => (
                  <span
                    key={es.id}
                    className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium shadow-2xs"
                  >
                    {es.skill?.name || 'Skill'} ({es.proficiency_percentage}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
