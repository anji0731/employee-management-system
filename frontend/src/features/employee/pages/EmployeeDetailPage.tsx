import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { ArrowLeft, Mail, Phone, Building2, Award, Upload } from 'lucide-react';

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/employees/${id}`)
        .then((res) => setEmployee(res.data))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post(`/employees/${id}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEmployee({ ...employee, avatar_url: res.data.avatar_url });
    } catch (err) {
      alert('Failed to upload profile image.');
    }
  };

  if (isLoading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading Employee Profile...</div>;
  }

  if (!employee) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h3>Employee Record Not Found</h3>
        <button onClick={() => navigate('/employees')} style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <button
        onClick={() => navigate('/employees')}
        style={{
          alignSelf: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div className="glass-card" style={{ padding: '32px', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '2.5rem',
            fontWeight: 800,
            border: '4px solid var(--bg-surface)'
          }}>
            {employee.avatar_url ? (
              <img src={`http://localhost:8000${employee.avatar_url}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              employee.first_name.charAt(0)
            )}
          </div>
          <label style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }} title="Upload Avatar Picture">
            <Upload size={14} />
            <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
          </label>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {employee.first_name} {employee.last_name}
            </h2>
            <span className="badge badge-success">{employee.employee_code}</span>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>
            {employee.designation?.title} — {employee.department?.name}
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {employee.email}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {employee.mobile}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="var(--color-primary)" /> Employment Details
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Joining Date</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.joining_date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Gender / DOB</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.gender} ({employee.date_of_birth})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Location</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.city?.name}, {employee.country?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Address</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.address || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#10b981" /> Skill Matrix & Proficiency
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {employee.skills?.length > 0 ? (
              employee.skills.map((s: any, idx: number) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{s.skill_name}</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{s.proficiency_percentage}%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.proficiency_percentage}%`, backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills tag recorded for this employee.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
