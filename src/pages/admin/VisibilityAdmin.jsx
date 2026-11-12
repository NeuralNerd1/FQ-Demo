import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Eye, EyeOff, GripVertical, Plus, Trash2, ExternalLink, CalendarDays, ArrowRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { engineConfigs, serviceConfigs, socialLinks, siteContent } from '../../lib/db';
import { ORDERED_ENGINES } from '../../data/engines';

// ── Toggle switch component ──────────────────────────────────────────────────
function ToggleSwitch({ checked, onChange, label, sublabel, disabled = false }) {
  return (
    <label className={`flex items-center justify-between gap-4 py-3 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
      <div>
        <p className="text-sm font-medium text-surface-800">{label}</p>
        {sublabel && <p className="text-xs text-surface-400 mt-0.5">{sublabel}</p>}
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-brand-600' : 'bg-surface-200'
        }`}
        aria-checked={checked}
        disabled={disabled}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

// ── Trust bar section ────────────────────────────────────────────────────────
function TrustBarSection() {
  const qc = useQueryClient();

  const { data: contentItems = [] } = useQuery({
    queryKey: ['admin-site-content'],
    queryFn: async () => { const { data } = await siteContent.getAll(); return data || []; },
  });

  const updateMut = useMutation({
    mutationFn: ({ key, value }) => siteContent.set(key, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-site-content'] }),
  });

  const getVal = (key, fallback) => contentItems.find(c => c.key === key)?.value ?? fallback;
  const isVisible = getVal('show_trust_section', 'true') === 'true';
  const logos = getVal('trust_logos', 'Fintech Corp,LegalSaaS,HealthTech,EdTech Co,Logistics Inc');

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-lg bg-surface-100 text-surface-600 flex items-center justify-center">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-surface-900">Trusted By Bar</h2>
          <p className="text-sm text-surface-500">The "Trusted by forward-thinking companies" strip on the homepage.</p>
        </div>
      </div>

      <ToggleSwitch
        checked={isVisible}
        onChange={(val) => updateMut.mutate({ key: 'show_trust_section', value: String(val) })}
        label="Show trust bar on homepage"
        sublabel="Hides the entire strip when off"
      />

      <div className="form-group mt-4">
        <label className="label">Company names <span className="text-surface-400 font-normal">(comma-separated)</span></label>
        <input
          key={logos}
          defaultValue={logos}
          className="input"
          placeholder="Acme Corp, Globex, Initech"
          onBlur={(e) => {
            if (e.target.value !== logos) {
              updateMut.mutate({ key: 'trust_logos', value: e.target.value });
            }
          }}
        />
        <p className="text-xs text-surface-400 mt-1">Each name separated by a comma. Changes save on blur.</p>
      </div>
    </div>
  );
}

// ── Engines section ──────────────────────────────────────────────────────────
function EnginesSection() {
  const qc = useQueryClient();

  const { data: configs = [] } = useQuery({
    queryKey: ['admin-engine-configs'],
    queryFn: async () => {
      const { data } = await engineConfigs.getAll();
      return data || [];
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ engineId, data }) => engineConfigs.upsert(engineId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-engine-configs'] }),
  });

  const getConfig = (engineId) => configs.find(c => c.engine_id === engineId) || {};

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-surface-900 mb-1">Engine Visibility</h2>
      <p className="text-sm text-surface-500 mb-5">Control which engines appear on the site and which are marked "Coming Soon".</p>
      <div className="divide-y divide-surface-100">
        {ORDERED_ENGINES.map(engine => {
          const config = getConfig(engine.id);
          const isVisible = config.is_visible !== false;
          const isComingSoon = config.is_coming_soon ?? engine.comingSoon;

          return (
            <div key={engine.id} className="py-2">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: engine.hexColor }} />
                <span className="font-medium text-surface-800 text-sm">{engine.name}</span>
                <span className="text-xs text-surface-400 font-mono">{engine.id}</span>
                {isComingSoon && <span className="badge-coming-soon">Coming Soon</span>}
              </div>
              <div className="pl-6 space-y-0">
                <ToggleSwitch
                  checked={isVisible}
                  onChange={(val) => updateMut.mutate({ engineId: engine.id, data: { is_visible: val } })}
                  label="Visible on site"
                  sublabel="Hide to remove from all grids and dropdowns"
                />
                <ToggleSwitch
                  checked={isComingSoon}
                  onChange={(val) => updateMut.mutate({ engineId: engine.id, data: { is_coming_soon: val } })}
                  label="Mark as Coming Soon"
                  sublabel="Grays out the card and disables navigation to this engine"
                  disabled={!isVisible}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Services section ─────────────────────────────────────────────────────────
function ServicesSection() {
  const qc = useQueryClient();

  const { data: configs = [] } = useQuery({
    queryKey: ['admin-service-configs'],
    queryFn: async () => {
      const { data } = await serviceConfigs.getAll();
      return data || [];
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ slug, data }) => serviceConfigs.upsert(slug, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-service-configs'] }),
  });

  if (!configs.length) return (
    <div className="card p-6">
      <h2 className="font-semibold text-surface-900 mb-1">Service Visibility</h2>
      <p className="text-sm text-surface-400 mt-4">No services found in the database yet. Add services and they'll appear here.</p>
    </div>
  );

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-surface-900 mb-1">Service Visibility</h2>
      <p className="text-sm text-surface-500 mb-5">Toggle individual services and feature flags. Changes apply site-wide instantly.</p>
      <div className="divide-y divide-surface-100">
        {configs.map(svc => (
          <div key={svc.service_slug} className="py-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-surface-800 capitalize">{svc.service_slug?.replace(/-/g, ' ')}</p>
              </div>
              <div className="flex items-center gap-6">
                <ToggleSwitch
                  checked={svc.is_featured ?? false}
                  onChange={(val) => updateMut.mutate({ slug: svc.service_slug, data: { is_featured: val } })}
                  label="Featured"
                />
                <ToggleSwitch
                  checked={svc.is_visible !== false}
                  onChange={(val) => updateMut.mutate({ slug: svc.service_slug, data: { is_visible: val } })}
                  label="Visible"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Social links section ─────────────────────────────────────────────────────
function SocialLinksSection() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [newLink, setNewLink] = useState({ platform: '', label: '', url: '', icon: '' });

  const { data: links = [] } = useQuery({
    queryKey: ['admin-social-links'],
    queryFn: async () => {
      const { data } = await socialLinks.list(false);
      return data || [];
    },
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, is_visible }) => socialLinks.toggleVisible(id, is_visible),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-social-links'] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => socialLinks.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-social-links'] }),
  });

  const createMut = useMutation({
    mutationFn: (data) => socialLinks.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-social-links'] }); setAdding(false); setNewLink({ platform: '', label: '', url: '', icon: '' }); },
  });

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-surface-900">Social Links</h2>
          <p className="text-sm text-surface-500 mt-0.5">Appear in the footer. Toggle visibility without deleting.</p>
        </div>
        <button onClick={() => setAdding(!adding)} className="btn-sm btn-secondary">
          <Plus className="h-3.5 w-3.5" /> Add link
        </button>
      </div>

      {adding && (
        <div className="bg-surface-50 rounded-xl p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">Platform</label>
              <input value={newLink.platform} onChange={e => setNewLink(l => ({ ...l, platform: e.target.value }))} className="input input-sm" placeholder="linkedin" />
            </div>
            <div>
              <label className="label text-xs">Label</label>
              <input value={newLink.label} onChange={e => setNewLink(l => ({ ...l, label: e.target.value }))} className="input input-sm" placeholder="LinkedIn" />
            </div>
          </div>
          <div>
            <label className="label text-xs">URL</label>
            <input value={newLink.url} onChange={e => setNewLink(l => ({ ...l, url: e.target.value }))} className="input input-sm" placeholder="https://" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setAdding(false)} className="btn-sm btn-ghost">Cancel</button>
            <button onClick={() => createMut.mutate({ ...newLink, is_visible: true })} className="btn-sm btn-primary">Save</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {links.map(link => (
          <div key={link.id} className="flex items-center gap-3 py-2 border-b border-surface-100 last:border-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-800">{link.label || link.platform}</p>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline flex items-center gap-1 truncate">
                {link.url} <ExternalLink className="h-3 w-3 flex-shrink-0" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <ToggleSwitch
                checked={link.is_visible}
                onChange={(val) => toggleMut.mutate({ id: link.id, is_visible: val })}
                label=""
              />
              <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(link.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-surface-300 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Site content section ─────────────────────────────────────────────────────
function SiteContentSection() {
  const qc = useQueryClient();

  const { data: contentItems = [] } = useQuery({
    queryKey: ['admin-site-content'],
    queryFn: async () => {
      const { data } = await siteContent.getAll();
      return data || [];
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ key, value }) => siteContent.set(key, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-site-content'] }),
  });

  const booleanItems = contentItems.filter(c => c.type === 'boolean');
  const textItems = contentItems.filter(c => c.type !== 'boolean');

  if (!contentItems.length) return null;

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-surface-900 mb-1">Site Content Toggles</h2>
      <p className="text-sm text-surface-500 mb-5">Control which sections appear on the site and update key copy.</p>

      {booleanItems.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Section visibility</p>
          <div className="divide-y divide-surface-100">
            {booleanItems.map(item => (
              <ToggleSwitch
                key={item.key}
                checked={item.value === 'true'}
                onChange={(val) => updateMut.mutate({ key: item.key, value: String(val) })}
                label={item.label || item.key}
              />
            ))}
          </div>
        </div>
      )}

      {textItems.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Text content</p>
          <div className="space-y-3">
            {textItems.map(item => (
              <div key={item.key} className="form-group">
                <label className="label">{item.label || item.key}</label>
                <input
                  defaultValue={item.value}
                  className="input"
                  onBlur={(e) => {
                    if (e.target.value !== item.value) {
                      updateMut.mutate({ key: item.key, value: e.target.value });
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function VisibilityAdmin() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-surface-900">Visibility Controls</h1>
        <p className="text-sm text-surface-500 mt-0.5">All changes take effect immediately on the live site.</p>
      </div>

      <div className="space-y-6">
        <TrustBarSection />
        <EnginesSection />
        <ServicesSection />
        <SocialLinksSection />
        <SiteContentSection />
        {/* ── Events admin quick link ── */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-surface-900">Events / Webinars</h2>
              <p className="text-sm text-surface-500">Manage awareness events shown on the homepage and /events page.</p>
            </div>
          </div>
          <Link to="/admin/events" className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-brand-600 hover:text-brand-800">
            Manage events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
