import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Users, Building2, Globe, ShieldCheck, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading Executive Dashboard...</div>;
  }

  const iconMap: Record<string, any> = {
    Users: <Users size={24} color="#3b82f6" />,
    Building2: <Building2 size={24} color="#10b981" />,
    Globe: <Globe size={24} color="#f59e0b" />,
    ShieldCheck: <ShieldCheck size={24} color="#a855f7" />
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-card" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Welcome to Magnus Enterprise Dashboard
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Real-time analytics, organizational metrics, and employee domain overview.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/employees/create')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '10px 18px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px var(--color-primary-glow)'
            }}
          >
            <Plus size={16} /> Register Employee
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {data?.stats?.map((stat: any, idx: number) => (
          <div key={idx} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stat.title}</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: '8px 0 4px' }}>
                  {stat.count}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{stat.change}</span>
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color)'
              }}>
                {iconMap[stat.icon] || <Sparkles size={24} color="var(--color-primary)" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
            Department Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data?.department_distribution?.map((item: any, idx: number) => {
              const maxVal = Math.max(...data.department_distribution.map((d: any) => d.value), 1);
              const pct = (item.value / maxVal) * 100;
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{item.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{item.value} Members</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, var(--color-primary), #8b5cf6)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
            Top Skill Catalog Proficiency
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data?.skill_breakdown?.map((item: any, idx: number) => {
              const maxVal = Math.max(...data.skill_breakdown.map((s: any) => s.value), 1);
              const pct = (item.value / maxVal) * 100;
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{item.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{item.value} Profiles</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
