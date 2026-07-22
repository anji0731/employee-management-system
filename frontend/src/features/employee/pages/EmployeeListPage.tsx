import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { 
  Search, 
  Download, 
  Plus, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  List as ListIcon, 
  Mail, 
  Phone, 
  Building2, 
  MapPin 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmployeeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [size] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [gender, setGender] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    api.get('/master/departments').then((res) => setDepartments(res.data)).catch(() => {});
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      let url = `/employees?page=${page}&size=${size}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (departmentId) url += `&department_id=${departmentId}`;
      if (gender) url += `&gender=${gender}`;
      
      const res = await api.get(url);
      setEmployees(res.data.items);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, size, departmentId, gender]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchEmployees();
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to delete employee ${code}?`)) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        alert('Failed to delete employee record.');
      }
    }
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    window.open(`http://localhost:8000/api/v1/employees/export/data?format=${format}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Employee Directory
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage and view all registered employee records ({total} Total Employees)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? 'var(--color-primary)' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ListIcon size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Grid size={16} />
            </button>
          </div>

          <button
            onClick={() => handleExport('csv')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            onClick={() => handleExport('xlsx')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Download size={14} /> Export XLSX
          </button>

          <button
            onClick={() => navigate('/employees/create')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Plus size={16} /> Add Employee
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '16px 20px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by Name, Mobile, Email, or Code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{ width: '180px' }}>
            <select
              value={departmentId}
              onChange={(e) => { setDepartmentId(e.target.value); setPage(1); }}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div style={{ width: '140px' }}>
            <select
              value={gender}
              onChange={(e) => { setGender(e.target.value); setPage(1); }}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--bg-surface-hover)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Apply Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Fetching Directory Records...</div>
      ) : employees.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No employee records match the filter criteria.
        </div>
      ) : viewMode === 'table' ? (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 18px' }}>Code</th>
                <th style={{ padding: '14px 18px' }}>Employee</th>
                <th style={{ padding: '14px 18px' }}>Mobile</th>
                <th style={{ padding: '14px 18px' }}>Department</th>
                <th style={{ padding: '14px 18px' }}>Designation</th>
                <th style={{ padding: '14px 18px' }}>City</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background var(--transition-fast)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {emp.employee_code}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{emp.first_name} {emp.last_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-main)' }}>{emp.mobile}</td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-main)' }}>{emp.department?.name}</td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-main)' }}>{emp.designation?.title}</td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-main)' }}>{emp.city?.name}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="badge badge-success">{emp.status}</span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => navigate(`/employees/${emp.id}`)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id, emp.employee_code)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {employees.map((emp) => (
            <div key={emp.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.2rem'
                }}>
                  {emp.first_name.charAt(0)}
                </div>
                <span className="badge badge-success">{emp.employee_code}</span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {emp.first_name} {emp.last_name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{emp.designation?.title}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> {emp.email}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> {emp.mobile}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Building2 size={14} /> {emp.department?.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} /> {emp.city?.name}, {emp.country?.name}</div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing page {page} of {pages} ({total} entries)
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-sm)',
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              opacity: page <= 1 ? 0.5 : 1
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-sm)',
              cursor: page >= pages ? 'not-allowed' : 'pointer',
              opacity: page >= pages ? 0.5 : 1
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
