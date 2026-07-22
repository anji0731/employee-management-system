import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Users,
  Building2,
  Globe,
  UserCheck,
  Map,
  Building,
  Activity,
  User,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/employee/StatusBadge';

interface DashboardSummary {
  stats: {
    total_employees: number;
    active_employees: number;
    total_users: number;
    departments_count: number;
    countries_count: number;
    states_count: number;
    cities_count: number;
  };
  recent_employees: Array<{
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    department_name?: string;
    status: string;
    joining_date?: string;
  }>;
  recent_users: Array<{
    id: string;
    email: string;
    full_name: string;
    role_name?: string;
    is_active: boolean;
  }>;
  recent_activities: Array<{
    id: string;
    action: string;
    user_email?: string;
    entity_name: string;
    timestamp?: string;
  }>;
}

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useQuery<DashboardSummary>({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const res = await api.get('/dashboard');
      return res.data;
    },
    refetchInterval: 10000, // Refresh metrics automatically
  });

  const stats = data?.stats;
  const recentEmployees = data?.recent_employees || [];
  const recentUsers = data?.recent_users || [];
  const recentActivities = data?.recent_activities || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-600" /> Executive Dashboard
        </h1>
        <p className="text-sm text-slate-500 font-medium">Real-Time Database Metrics & Live System Summary</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Employees</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {isLoading ? <span className="text-slate-300">...</span> : `${stats?.total_employees ?? 0}`}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Active: <strong className="text-slate-900">{stats?.active_employees ?? 0}</strong>
          </div>
        </div>

        {/* Total Users */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">System Users</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {isLoading ? <span className="text-slate-300">...</span> : `${stats?.total_users ?? 0}`}
          </div>
          <div className="text-xs text-slate-500 font-medium">Configured Login Accounts</div>
        </div>

        {/* Departments Count */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Departments</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {isLoading ? <span className="text-slate-300">...</span> : `${stats?.departments_count ?? 0}`}
          </div>
          <div className="text-xs text-slate-500 font-medium">Active Organizational Units</div>
        </div>

        {/* Locations (Countries, States, Cities) */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Global Locations</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {isLoading ? <span className="text-slate-300">...</span> : `${stats?.countries_count ?? 0} Countries`}
          </div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <span>States: <strong className="text-slate-800">{stats?.states_count ?? 0}</strong></span>
            <span>•</span>
            <span>Cities: <strong className="text-slate-800">{stats?.cities_count ?? 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Secondary Location Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Countries Master</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{stats?.countries_count ?? 0}</div>
          </div>
          <Link to="/countries" className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600">
            <Globe className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">States Master</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{stats?.states_count ?? 0}</div>
          </div>
          <Link to="/states" className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600">
            <Map className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cities Master</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{stats?.cities_count ?? 0}</div>
          </div>
          <Link to="/cities" className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600">
            <Building className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Dynamic Data Tables: Recent Employees & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Recent Employees (Last 5)</h2>
            </div>
            <Link to="/employees" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-8 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recentEmployees.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-medium">
                No employees recorded in database.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Code</th>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">Department</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-semibold text-blue-600">{emp.employee_code}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">
                        {emp.first_name} {emp.last_name}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{emp.department_name || '-'}</td>
                      <td className="py-2.5 px-4 text-right">
                        <StatusBadge status={emp.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Recent Users (Last 5)</h2>
            </div>
            <Link to="/users" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-8 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-medium">
                No user accounts recorded in database.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-4">User</th>
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="font-bold text-slate-900">{usr.full_name}</div>
                        <div className="text-[10px] text-slate-500">{usr.email}</div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-semibold text-[10px] inline-flex items-center gap-1">
                          <Shield className="w-3 h-3 text-blue-600" /> {usr.role_name || 'User'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span
                          className={`px-2 py-0.5 border rounded-full text-[10px] font-semibold ${
                            usr.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {usr.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Recent Security & System Activities</h2>
          </div>
          <span className="text-[11px] font-medium text-slate-500">Live Audit Logs</span>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-6 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentActivities.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 font-medium">
            No recent system activities recorded.
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{act.user_email || 'System'}</span>{' '}
                    <span className="text-slate-600">performed</span>{' '}
                    <strong className="text-blue-600 font-mono">{act.action}</strong>{' '}
                    <span className="text-slate-600">on {act.entity_name}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {act.timestamp ? new Date(act.timestamp).toLocaleString() : '-'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
