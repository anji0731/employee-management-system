import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Folder, 
  Menu as MenuIcon, 
  Search, 
  ListOrdered, 
  Image as ImageIcon, 
  Sliders, 
  HelpCircle, 
  Building2, 
  ExternalLink, 
  Palette, 
  Code,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { api } from '../../../services/api';

export const MoreShowcasePage: React.FC = () => {
  const { subfeature } = useParams<{ subfeature?: string }>();
  const navigate = useNavigate();
  const currentTab = subfeature || 'tabs';

  const { theme, toggleTheme } = useTheme();

  const [nestedTab, setNestedTab] = useState<'tabA' | 'tabB' | 'tabC'>('tabA');

  const [acQuery, setAcQuery] = useState('');
  const [acResults, setAcResults] = useState<any[]>([]);

  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(0);

  const [rangeVal, setRangeVal] = useState(75);
  const [salaryVal, setSalaryVal] = useState(85000);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAcSearch = async (val: string) => {
    setAcQuery(val);
    if (val.trim()) {
      try {
        const res = await api.get(`/more/autocomplete-search?query=${encodeURIComponent(val)}`);
        setAcResults(res.data);
      } catch (err) {
        setAcResults([]);
      }
    } else {
      setAcResults([]);
    }
  };

  const showcaseTabs = [
    { id: 'tabs', label: '1. Multiple Tabs', icon: <Folder size={16} /> },
    { id: 'menus', label: '2. Submenus', icon: <MenuIcon size={16} /> },
    { id: 'autocomplete', label: '3. Autocomplete', icon: <Search size={16} /> },
    { id: 'accordions', label: '4. Accordions', icon: <ListOrdered size={16} /> },
    { id: 'media', label: '5. Media Studio', icon: <ImageIcon size={16} /> },
    { id: 'sliders', label: '6. Range Sliders', icon: <Sliders size={16} /> },
    { id: 'tooltips', label: '7. Tooltips', icon: <HelpCircle size={16} /> },
    { id: 'modals', label: '8. Modals', icon: <Building2 size={16} /> },
    { id: 'links', label: '9. Link Mechanics', icon: <ExternalLink size={16} /> },
    { id: 'css-engine', label: '10. CSS Engine', icon: <Palette size={16} /> },
    { id: 'iframe', label: '11. iFrames', icon: <Code size={16} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={24} color="var(--color-primary)" /> "More" Interactive Component Showcase
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Explore all 11 rich web UI submodules inspired by the Magnus Application platform.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '8px', display: 'flex', gap: '6px', overflowX: 'auto' }}>
        {showcaseTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(`/more/${tab.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: currentTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: currentTab === tab.id ? '#ffffff' : 'var(--text-muted)',
              fontWeight: currentTab === tab.id ? 700 : 500,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        {currentTab === 'tabs' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>4.1 Multiple & Nested Tab Panes</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Demonstrates tabbed container layouts with active indicator transitions and sub-tab isolation.
            </p>

            <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px', marginBottom: '20px' }}>
              {['tabA', 'tabB', 'tabC'].map((t) => (
                <button
                  key={t}
                  onClick={() => setNestedTab(t as any)}
                  style={{
                    padding: '10px 16px',
                    border: 'none',
                    borderBottom: nestedTab === t ? '2px solid var(--color-primary)' : '2px solid transparent',
                    background: 'transparent',
                    color: nestedTab === t ? 'var(--color-primary)' : 'var(--text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Sub-Pane {t.replace('tab', ' ')}
                </button>
              ))}
            </div>

            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              {nestedTab === 'tabA' && <p><strong>Sub-Pane A:</strong> Displays organizational overview notes and tabbed metadata.</p>}
              {nestedTab === 'tabB' && <p><strong>Sub-Pane B:</strong> Displays department hierarchy logs and system rules.</p>}
              {nestedTab === 'tabC' && <p><strong>Sub-Pane C:</strong> Displays secondary parameters and dynamic state options.</p>}
            </div>
          </div>
        )}

        {currentTab === 'menus' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>4.2 Dynamic Multilevel Menus</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Hierarchical navigation tree served dynamically from backend permission configurations.
            </p>
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', maxWidth: '300px' }}>
              <div style={{ fontWeight: 700, paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>Root Menu</div>
              <div style={{ paddingLeft: '16px', paddingTop: '8px' }}>
                <div>📁 1. Employee Operations</div>
                <div style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div>📄 1.1 Directory List</div>
                  <div>📄 1.2 Onboarding Form</div>
                </div>
                <div style={{ marginTop: '8px' }}>📁 2. Extended Showcase</div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'autocomplete' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>4.3 Async Autocomplete Search</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Type to fetch dynamic autocomplete results from Countries, Cities, and Skill Tag catalogs.
            </p>

            <div style={{ maxWidth: '400px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Type 'Bangalore', 'India', or 'React'..."
                value={acQuery}
                onChange={(e) => handleAcSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />

              {acResults.length > 0 && (
                <div className="glass-card" style={{ position: 'absolute', top: '50px', left: 0, right: 0, zIndex: 30, padding: '8px' }}>
                  {acResults.map((res, i) => (
                    <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ fontWeight: 600 }}>{res.label}</div>
                      <span className="badge badge-info">{res.category}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'accordions' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>4.4 Accordions & Collapsible Cards</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Expandable panels with smooth CSS height animation.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
              {[
                { title: 'What is Magnus Enterprise Employee Management?', body: 'Magnus is a full-featured web showcase application designed for enterprise employee lifecycle management and automation testing.' },
                { title: 'How does Role-Based Access Control (RBAC) work?', body: 'Permissions are grouped into roles (Super Admin, HR Manager, Team Lead) and assigned to users to enforce secure endpoint access.' },
                { title: 'Can employee records be exported?', body: 'Yes! Employee data can be exported in both CSV and Microsoft Excel (.xlsx) formats instantly.' }
              ].map((acc, idx) => (
                <div key={idx} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div
                    onClick={() => setExpandedAccordion(expandedAccordion === idx ? null : idx)}
                    style={{ padding: '14px 18px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>{acc.title}</span>
                    <span>{expandedAccordion === idx ? '▲' : '▼'}</span>
                  </div>
                  {expandedAccordion === idx && (
                    <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {acc.body}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'sliders' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>4.6 Interactive Range Sliders</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Custom styled range sliders for numeric inputs and filter ranges.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                  <span>Skill Proficiency Index</span>
                  <span style={{ color: 'var(--color-primary)' }}>{rangeVal}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rangeVal}
                  onChange={(e) => setRangeVal(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                  <span>Target Salary Range</span>
                  <span style={{ color: '#10b981' }}>${salaryVal.toLocaleString()} / year</span>
                </label>
                <input
                  type="range"
                  min="30000"
                  max="200000"
                  step="5000"
                  value={salaryVal}
                  onChange={(e) => setSalaryVal(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#10b981' }}
                />
              </div>
            </div>
          </div>
        )}

        {currentTab === 'modals' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>4.8 Modal Dialog Windows</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Accessible modal dialog overlays with backdrop blur.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{ padding: '10px 18px', backgroundColor: 'var(--color-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
              >
                Open Confirm Dialog
              </button>
            </div>

            {isModalOpen && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100
              }}>
                <div className="glass-card" style={{ width: '400px', padding: '28px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>Action Confirmation</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    Are you sure you want to execute this enterprise operation?
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      style={{ padding: '8px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { alert('Action confirmed!'); setIsModalOpen(false); }}
                      style={{ padding: '8px 16px', background: 'var(--color-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === 'css-engine' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>4.10 Live CSS & Theme Engine Showcase</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Dynamically manipulate CSS custom properties in real time.
            </p>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, marginRight: '12px' }}>Theme Mode:</span>
                <button
                  onClick={toggleTheme}
                  style={{ padding: '8px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                >
                  Current: {theme.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'iframe' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>4.11 Sandboxed iFrame Integration</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Embedded external widget container with sandbox security parameters.
            </p>

            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', height: '400px' }}>
              <iframe
                src="https://jalatechnologies.com"
                title="Jala Technologies"
                style={{ width: '100%', height: '100%', border: 'none' }}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
