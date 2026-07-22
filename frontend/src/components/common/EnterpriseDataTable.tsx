import React, { useState, useEffect } from 'react';
import {
  MoreVertical,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Copy,
  UploadCloud,
  Trash2,
  RefreshCw,
  Eye,
  Check,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import {
  exportToCSV,
  exportToExcelXML,
  copyToClipboard,
  printDataWindow,
  parseCSVFile,
} from '../../utils/exportUtils';
import { SearchBar } from '../employee/SearchBar';
import { Pagination } from '../employee/Pagination';

export interface ColumnDef {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode;
}

interface EnterpriseDataTableProps {
  title: string;
  moduleName: string;
  items: any[];
  columns: ColumnDef[];
  isLoading: boolean;
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  search: string;
  onSearchChange: (val: string) => void;
  onBulkDelete?: (selectedIds: string[]) => void;
  onBulkRestore?: (selectedIds: string[]) => void;
  onImportCSV?: (rows: any[]) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onRestore?: (item: any) => void;
  onView?: (item: any) => void;
}

export const EnterpriseDataTable: React.FC<EnterpriseDataTableProps> = ({
  title,
  moduleName,
  items,
  columns,
  isLoading,
  totalItems,
  totalPages,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  search,
  onSearchChange,
  onBulkDelete,
  onBulkRestore,
  onImportCSV,
  onEdit,
  onDelete,
  onRestore,
  onView,
}) => {
  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  // Column Visibility Persistence
  const storageKey = `table_columns_${moduleName}`;
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : columns.map((c) => c.key);
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(visibleColumnKeys));
  }, [visibleColumnKeys, storageKey]);

  const toggleColumn = (key: string) => {
    if (visibleColumnKeys.includes(key)) {
      if (visibleColumnKeys.length > 1) {
        setVisibleColumnKeys(visibleColumnKeys.filter((k) => k !== key));
      }
    } else {
      setVisibleColumnKeys([...visibleColumnKeys, key]);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(items.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Export handlers
  const exportColumns = columns
    .filter((c) => visibleColumnKeys.includes(c.key))
    .map((c) => ({ key: c.key, label: c.label }));

  const handleExportCSV = () => {
    exportToCSV(items, `${moduleName}_export.csv`, exportColumns);
    showToast('Exported CSV file successfully');
    setIsMoreMenuOpen(false);
  };

  const handleExportExcel = () => {
    exportToExcelXML(items, `${moduleName}_export.xls`, exportColumns);
    showToast('Exported Excel spreadsheet');
    setIsMoreMenuOpen(false);
  };

  const handleCopyClipboard = async () => {
    const success = await copyToClipboard(items, exportColumns);
    if (success) {
      showToast('Copied data to clipboard!');
    } else {
      showToast('Failed to copy to clipboard', 'error');
    }
    setIsMoreMenuOpen(false);
  };

  const handlePrint = () => {
    printDataWindow(title, items, exportColumns);
    setIsMoreMenuOpen(false);
  };

  const handleFileImportSubmit = async () => {
    if (!importFile) return;
    try {
      const parsedRows = await parseCSVFile(importFile);
      if (onImportCSV) {
        onImportCSV(parsedRows);
      }
      showToast(`Parsed ${parsedRows.length} rows from CSV`);
      setIsImportModalOpen(false);
      setImportFile(null);
    } catch (err) {
      showToast('Failed to parse CSV file', 'error');
    }
  };

  const visibleColumns = columns.filter((c) => visibleColumnKeys.includes(c.key));

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl border shadow-lg flex items-center gap-2 text-xs font-semibold ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Control Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-xs">
        <SearchBar value={search} onChange={onSearchChange} />

        <div className="flex items-center gap-2 relative">
          {/* Bulk Action Controls */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs font-semibold text-blue-600">
                {selectedIds.length} selected
              </span>
              {onBulkDelete && (
                <button
                  onClick={() => {
                    onBulkDelete(selectedIds);
                    setSelectedIds([]);
                  }}
                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                </button>
              )}
              {onBulkRestore && (
                <button
                  onClick={() => {
                    onBulkRestore(selectedIds);
                    setSelectedIds([]);
                  }}
                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Restore Selected
                </button>
              )}
            </div>
          )}

          {/* Column Visibility Toggle Button */}
          <button
            onClick={() => setIsColumnPickerOpen(!isColumnPickerOpen)}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg transition-colors text-xs flex items-center gap-1.5 font-medium shadow-xs"
            title="Columns Visibility"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Columns</span>
          </button>

          {/* Column Picker Popover */}
          {isColumnPickerOpen && (
            <div className="absolute right-12 top-10 z-40 w-48 p-3 bg-white border border-slate-200 rounded-xl shadow-xl space-y-2 text-xs">
              <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <span>Toggle Columns</span>
                <button onClick={() => setIsColumnPickerOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {columns.map((col) => (
                  <label key={col.key} className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={visibleColumnKeys.includes(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{col.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* "More" Menu Button */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs text-xs font-semibold flex items-center gap-1.5"
            >
              <span>More Options</span>
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* "More" Menu Dropdown */}
            {isMoreMenuOpen && (
              <div className="absolute right-0 top-11 z-40 w-52 py-1.5 bg-white border border-slate-200 rounded-xl shadow-xl text-xs space-y-0.5">
                <button
                  onClick={handleExportCSV}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 font-medium"
                >
                  <Download className="w-4 h-4 text-emerald-600" /> Export CSV
                </button>
                <button
                  onClick={handleExportExcel}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 font-medium"
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" /> Export Excel
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 font-medium"
                >
                  <FileText className="w-4 h-4 text-purple-600" /> Export PDF / Print
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 font-medium"
                >
                  <Printer className="w-4 h-4 text-amber-600" /> Print Table
                </button>
                <button
                  onClick={handleCopyClipboard}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 font-medium"
                >
                  <Copy className="w-4 h-4 text-cyan-600" /> Copy to Clipboard
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    setIsImportModalOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 font-medium"
                >
                  <UploadCloud className="w-4 h-4 text-indigo-600" /> Import Data (CSV)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-medium">
            No records found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={items.length > 0 && selectedIds.length === items.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  {visibleColumns.map((col) => (
                    <th key={col.key} className="py-3 px-4">
                      {col.label}
                    </th>
                  ))}
                  {(onEdit || onDelete || onRestore || onView) && (
                    <th className="py-3 px-4 text-right">Actions</th>
                  )}
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
                    <td className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelectRow(item.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    {visibleColumns.map((col) => (
                      <td key={col.key} className="py-3 px-4">
                        {col.render ? col.render(item) : item[col.key] ?? '-'}
                      </td>
                    ))}
                    {(onEdit || onDelete || onRestore || onView) && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onView && (
                            <button
                              onClick={() => onView(item)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {!item.is_deleted ? (
                            <>
                              {onEdit && (
                                <button
                                  onClick={() => onEdit(item)}
                                  className="p-1.5 text-slate-500 hover:text-amber-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                                  title="Edit"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  onClick={() => onDelete(item)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          ) : (
                            onRestore && (
                              <button
                                onClick={() => onRestore(item)}
                                className="p-1.5 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                                title="Restore"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4 text-xs text-slate-900">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" /> Import Data ({moduleName})
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600">
              Upload a valid CSV file matching column headers to bulk import records.
            </p>

            <input
              type="file"
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700"
            />

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFileImportSubmit}
                disabled={!importFile}
                className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl disabled:opacity-50 hover:bg-blue-700"
              >
                Process CSV Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
