import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Briefcase, Award, Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';

export const EmployeeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'employment' | 'skills'>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    gender: 'Male',
    date_of_birth: '1995-01-01',
    joining_date: '2024-01-01',
    department_id: '',
    designation_id: '',
    country_id: '',
    city_id: '',
    address: '',
    skills: [
      { skill_name: 'React', proficiency_percentage: 85 },
      { skill_name: 'FastAPI', proficiency_percentage: 80 }
    ]
  });

  useEffect(() => {
    api.get('/master/departments').then((res) => setDepartments(res.data)).catch(() => {});
    api.get('/master/countries').then((res) => setCountries(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (formData.department_id) {
      api.get(`/master/designations?department_id=${formData.department_id}`)
        .then((res) => setDesignations(res.data))
        .catch(() => {});
    } else {
      setDesignations([]);
    }
  }, [formData.department_id]);

  useEffect(() => {
    if (formData.country_id) {
      api.get(`/master/cities?country_id=${formData.country_id}`)
        .then((res) => setCities(res.data))
        .catch(() => {});
    } else {
      setCities([]);
    }
  }, [formData.country_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (index: number, field: string, value: any) => {
    const updated = [...formData.skills];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, skills: updated });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { skill_name: 'Python', proficiency_percentage: 70 }]
    });
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, idx) => idx !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/employees', formData);
      navigate('/employees');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to register employee record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => navigate('/employees')}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Register New Employee
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Fill out the multi-tab employee registration form below.
          </p>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <div className="glass-card" style={{ padding: '6px', display: 'flex', gap: '6px' }}>
        {[
          { id: 'personal', label: '1. Personal Details', icon: <User size={16} /> },
          { id: 'contact', label: '2. Contact & Address', icon: <Phone size={16} /> },
          { id: 'employment', label: '3. Employment & Org', icon: <Briefcase size={16} /> },
          { id: 'skills', label: '4. Skills & Proficiency', icon: <Award size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px' }}>
        {activeTab === 'personal' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>First Name *</label>
              <input
                type="text"
                required
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="e.g. Alexander"
                style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Last Name *</label>
              <input
                type="text"
                required
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="e.g. Wright"
                style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Date of Birth *</label>
              <input
                type="date"
                required
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email Address *</label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex.wright@enterprise.com"
                style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Mobile Phone *</label>
              <input
                type="text"
                required
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+1 555-0192"
                style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Country *</label>
              <select
                required
                name="country_id"
                value={formData.country_id}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>City *</label>
              <select
                required
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                disabled={!formData.country_id}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
              >
                <option value="">Select City</option>
                {cities.map((ci) => (
                  <option key={ci.id} value={ci.id}>{ci.name}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Full Street Address</label>
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="100 Innovation Way, Suite 400..."
                style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'employment' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Department *</label>
              <select
                required
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Designation Title *</label>
              <select
                required
                name="designation_id"
                value={formData.designation_id}
                onChange={handleChange}
                disabled={!formData.department_id}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
              >
                <option value="">Select Designation</option>
                {designations.map((des) => (
                  <option key={des.id} value={des.id}>{des.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Joining Date *</label>
              <input
                type="date"
                required
                name="joining_date"
                value={formData.joining_date}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>Skill Matrix & Proficiency Sliders</h4>
              <button
                type="button"
                onClick={addSkill}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} /> Add Skill Tag
              </button>
            </div>

            {formData.skills.map((s, idx) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 40px',
                gap: '16px',
                alignItems: 'center',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px'
              }}>
                <input
                  type="text"
                  placeholder="Skill Name (e.g. React, Python)"
                  value={s.skill_name}
                  onChange={(e) => handleSkillChange(idx, 'skill_name', e.target.value)}
                  style={{ padding: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', outline: 'none' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={s.proficiency_percentage}
                    onChange={(e) => handleSkillChange(idx, 'proficiency_percentage', parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--color-primary)' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '45px', color: 'var(--color-primary)' }}>
                    {s.proficiency_percentage}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => navigate('/employees')}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px var(--color-primary-glow)'
            }}
          >
            <Save size={18} /> {isSubmitting ? 'Registering...' : 'Save Employee Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
