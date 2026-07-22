import React from 'react';
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface ColumnDef {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode;
}

interface MasterTableProps {
  items: any[];
  columns: ColumnDef[];
  isLoading: boolean;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onRestore: (item: any) => void;
}

export const MasterTable: React.FC<MasterTableProps> = ({
  items,
  columns,
  isLoading,
  onEdit,
  onDelete,
  onRestore,
}) => {
  const { hasPermission } = useAuth();
  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs font-medium">
        No records found matching current search query.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-800">
        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="py-3 px-4">
                {col.label}
              </th>
            ))}
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr
              key={item.id}
              className={`hover:bg-slate-50/80 transition-colors ${
                item.is_deleted ? 'opacity-60 bg-rose-50/40' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4">
                  {col.render ? col.render(item) : item[col.key] ?? '-'}
                </td>
              ))}
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {!item.is_deleted ? (
                    <>
                      {hasPermission('master:write') && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Edit Record"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {hasPermission('master:write') && (
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Soft Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  ) : (
                    hasPermission('master:write') && (
                      <button
                        onClick={() => onRestore(item)}
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
