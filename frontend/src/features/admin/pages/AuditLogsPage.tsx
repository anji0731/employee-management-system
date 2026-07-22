import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAuditLogs = () => {
    setIsLoading(true);
    api.get('/admin/audit-logs')
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={22} color="var(--color-primary)" /> Compliance & System Audit Trail
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Field-level security log of all user activities, record updates, and access events.
          </p>
        </div>
        <button
          onClick={fetchAuditLogs}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} /> Refresh Logs
        </button>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        {isLoading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Security Audit Logs...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No audit log events recorded yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 18px' }}>Timestamp</th>
                <th style={{ padding: '14px 18px' }}>User</th>
                <th style={{ padding: '14px 18px' }}>Action</th>
                <th style={{ padding: '14px 18px' }}>Entity</th>
                <th style={{ padding: '14px 18px' }}>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {log.user_email || 'System'}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="badge badge-purple">{log.action}</span>
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-main)' }}>
                    {log.entity_name} #{log.entity_id || ''}
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                    {log.ip_address || '127.0.0.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
