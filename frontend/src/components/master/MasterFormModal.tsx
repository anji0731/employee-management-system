import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Layers } from 'lucide-react';

export interface FieldFieldDef {
  name: string;
  label: string;
  type?: 'text' | 'select' | 'textarea';
  options?: { label: string; value: string }[];
  required?: boolean;
}

interface MasterFormModalProps {
  isOpen: boolean;
  title: string;
  fields: FieldFieldDef[];
  initialData?: any;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export const MasterFormModal: React.FC<MasterFormModalProps> = ({
  isOpen,
  title,
  fields,
  initialData,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      const defaults: any = {};
      fields.forEach((f) => {
        defaults[f.name] = f.options ? f.options[0]?.value || '' : '';
      });
      reset(defaults);
    }
  }, [initialData, reset, fields, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-6 text-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">{initialData ? `Edit ${title}` : `Add New ${title}`}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="block font-semibold text-slate-700">
                {field.label} {field.required && '*'}
              </label>
              {field.type === 'select' ? (
                <select
                  {...register(field.name, { required: field.required })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  {...register(field.name, { required: field.required })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              ) : (
                <input
                  type="text"
                  {...register(field.name, { required: field.required })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              )}
            </div>
          ))}

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
              {isSubmitting ? 'Saving...' : initialData ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
