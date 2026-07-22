import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Check, X, Eye, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { api } from '../services/api';

export const PendingRegistrationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const { data: requests = [], isLoading } = useQuery<any[]>({
    queryKey: ['pending-registrations'],
    queryFn: async () => {
      const res = await api.get('/users/registrations/pending');
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/users/registrations/${id}/approve`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pending-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDetailOpen(false);
      showToast(`Approved registration for ${data.full_name}. Employee record has been created.`);
    },
    onError: (err: any) => {
      showToast(err.response?.data?.detail || 'Error approving registration', 'error');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/users/registrations/${id}/reject`, { reason: 'Registration request rejected by admin' });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pending-registrations'] });
      setIsDetailOpen(false);
      showToast(`Rejected registration request for ${data.full_name}.`);
    },
    onError: (err: any) => {
      showToast(err.response?.data?.detail || 'Error rejecting registration', 'error');
    },
  });

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
            <Users className="w-6 h-6 text-blue-600" /> Pending Registrations
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Review and approve self-registration requests from new employees.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading pending registration requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">All caught up!</h3>
          <p className="text-xs text-slate-500 font-medium">There are no pending employee registration requests to review at this time.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-600 text-[11px] font-semibold tracking-wider uppercase">
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Registration Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs text-slate-700 font-medium">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">{req.full_name}</td>
                    <td className="px-5 py-4 font-mono text-slate-600">{req.email}</td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(req.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-full font-semibold text-[10px] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Pending Approval
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setIsDetailOpen(true);
                        }}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-lg inline-flex items-center gap-1 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => approveMutation.mutate(req.id)}
                        disabled={approveMutation.isPending}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 text-emerald-700 rounded-lg inline-flex items-center gap-1 transition-colors disabled:opacity-50"
                        title="Approve Request"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate(req.id)}
                        disabled={rejectMutation.isPending}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-700 rounded-lg inline-flex items-center gap-1 transition-colors disabled:opacity-50"
                        title="Reject Request"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailOpen && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registration Details</h3>
                <p className="text-[11px] text-slate-500 font-medium">Review the request parameters before action.</p>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 border border-slate-200 rounded-xl font-medium">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Full Name</span>
                <span className="text-slate-900 font-bold">{selectedRequest.full_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Email Address</span>
                <span className="text-slate-900 font-mono font-bold">{selectedRequest.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Submission Date</span>
                <span className="text-slate-900">
                  {new Date(selectedRequest.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Requested Role</span>
                <span className="text-slate-900 font-bold">Standard Employee</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => rejectMutation.mutate(selectedRequest.id)}
                disabled={rejectMutation.isPending || approveMutation.isPending}
                className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-700 font-bold rounded-xl text-xs transition-colors disabled:opacity-50"
              >
                Reject Request
              </button>
              <button
                onClick={() => approveMutation.mutate(selectedRequest.id)}
                disabled={approveMutation.isPending || rejectMutation.isPending}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs disabled:opacity-50"
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
