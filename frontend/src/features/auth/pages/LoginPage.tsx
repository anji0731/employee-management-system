import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('training@jalaacademy.com');
  const [password, setPassword] = useState('jobseekrit');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid login credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoCredentials = (type: 'magnus' | 'admin') => {
    if (type === 'magnus') {
      setEmail('training@jalaacademy.com');
      setPassword('jobseekrit');
    } else {
      setEmail('admin@jala.com');
      setPassword('admin123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-main)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    }}>
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)'
      }} />

      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '40px',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            margin: '0 auto 16px',
            boxShadow: '0 10px 20px -5px var(--color-primary-glow)'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Magnus Enterprise
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Sign in to access your Employee Management Portal
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px'
            }}>
              <Mail size={18} color="var(--text-muted)" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  width: '100%',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px'
            }}>
              <Lock size={18} color="var(--text-muted)" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  width: '100%',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              Remember Me
            </label>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', cursor: 'pointer' }}>
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 20px -4px var(--color-primary-glow)',
              transition: 'all var(--transition-normal)'
            }}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textAlign: 'center', marginBottom: '10px' }}>
            Quick Demo Credentials Preset:
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setDemoCredentials('magnus')}
              style={{
                flex: 1,
                padding: '8px 10px',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={12} color="var(--color-primary)" />
              Magnus User
            </button>

            <button
              onClick={() => setDemoCredentials('admin')}
              style={{
                flex: 1,
                padding: '8px 10px',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={12} color="#10b981" />
              Super Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
