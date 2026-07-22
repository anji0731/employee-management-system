import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, UserPlus, Save } from 'lucide-react';
import type { Employee, Department, Country } from '../../types/employee';

const employeeSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(5, 'Mobile number required'),
  gender: z.string().min(1, 'Gender is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  joining_date: z.string().min(1, 'Joining date is required'),
  department_id: z.string().min(1, 'Department is required'),
  designation_id: z.string().min(1, 'Designation is required'),
  country_id: z.string().min(1, 'Country is required'),
  state_id: z.string().optional(),
  city_id: z.string().min(1, 'City is required'),
  address: z.string().optional(),
  status: z.string(),
  create_login_account: z.boolean(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  initialData?: Employee | null;
  departments: Department[];
  countries: Country[];
  isSubmitting: boolean;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  departments,
  countries,
  isSubmitting,
}) => {
  const deptList = Array.isArray(departments) ? departments : (departments as any)?.items || [];
  const countryList = Array.isArray(countries) ? countries : (countries as any)?.items || [];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      status: 'Active',
      gender: 'Male',
      create_login_account: false,
    },
  });

  const selectedDepartmentId = watch('department_id');
  const selectedCountryId = watch('country_id');
  const selectedStateId = watch('state_id');

  const availableDesignations =
    deptList.find((d: any) => d.id === selectedDepartmentId)?.designations || [];

  const selectedCountry = countryList.find((c: any) => c.id === selectedCountryId);
  const availableStates = selectedCountry?.states || [];

  const selectedState = availableStates.find((s: any) => s.id === selectedStateId);
  const availableCities = selectedState ? selectedState.cities : selectedCountry?.states?.flatMap((s: any) => s.cities) || [];

  useEffect(() => {
    if (initialData) {
      reset({
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        email: initialData.email,
        mobile: initialData.mobile,
        gender: initialData.gender,
        date_of_birth: initialData.date_of_birth,
        joining_date: initialData.joining_date,
        department_id: initialData.department_id,
        designation_id: initialData.designation_id,
        country_id: initialData.country_id,
        state_id: initialData.state_id || '',
        city_id: initialData.city_id,
        address: initialData.address || '',
        status: initialData.status,
        create_login_account: false,
      });
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        gender: 'Male',
        date_of_birth: '',
        joining_date: '',
        status: 'Active',
        department_id: deptList[0]?.id || '',
        designation_id: deptList[0]?.designations?.[0]?.id || '',
        country_id: countryList[0]?.id || '',
        state_id: '',
        city_id: countryList[0]?.states?.[0]?.cities?.[0]?.id || '',
        address: '',
        create_login_account: false,
      });
    }
  }, [initialData, reset, deptList, countryList, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-6 max-h-[90vh] overflow-y-auto text-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              {initialData ? `Edit Employee (${initialData.employee_code})` : 'Add New Employee'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                {...register('first_name')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.first_name && <p className="text-[10px] text-rose-600 mt-0.5">{errors.first_name.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                {...register('last_name')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.last_name && <p className="text-[10px] text-rose-600 mt-0.5">{errors.last_name.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.email && <p className="text-[10px] text-rose-600 mt-0.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
              <input
                {...register('mobile')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.mobile && <p className="text-[10px] text-rose-600 mt-0.5">{errors.mobile.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
              <select
                {...register('gender')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                {...register('date_of_birth')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.date_of_birth && <p className="text-[10px] text-rose-600 mt-0.5">{errors.date_of_birth.message}</p>}
            </div>
          </div>

          {/* Organizational Info */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department *</label>
              <select
                {...register('department_id')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select Department</option>
                {deptList.map((d: any) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.department_id && <p className="text-[10px] text-rose-600 mt-0.5">{errors.department_id.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designation *</label>
              <select
                {...register('designation_id')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select Designation</option>
                {availableDesignations.map((des: any) => (
                  <option key={des.id} value={des.id}>
                    {des.title}
                  </option>
                ))}
              </select>
              {errors.designation_id && <p className="text-[10px] text-rose-600 mt-0.5">{errors.designation_id.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Joining Date *</label>
              <input
                type="date"
                {...register('joining_date')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.joining_date && <p className="text-[10px] text-rose-600 mt-0.5">{errors.joining_date.message}</p>}
            </div>
          </div>

          {/* Location Info */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Country *</label>
              <select
                {...register('country_id')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select Country</option>
                {countryList.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">State</label>
              <select
                {...register('state_id')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select State</option>
                {availableStates.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City *</label>
              <select
                {...register('city_id')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select City</option>
                {availableCities.map((city: any) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.city_id && <p className="text-[10px] text-rose-600 mt-0.5">{errors.city_id.message}</p>}
            </div>
          </div>

          {!initialData && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  {...register('create_login_account')}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Create Login Account</span>
              </label>
              <p className="text-[10px] text-slate-500 font-medium ml-6">
                Automatically generate an Active User account with a temporary login password.
              </p>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : initialData ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
