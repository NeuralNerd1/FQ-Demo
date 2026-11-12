import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, X, Save } from 'lucide-react';
import { events } from '../../lib/db';
import { formatDateShort } from '../../lib/utils';

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  description: '',
  event_date: '',
  event_type: 'Career Webinar',
  platform: 'gcode.in',
  platform_url: '',
  thumbnail_url: '',
  host_name: '',
  host_title: '',
  host_org: '',
  price_inr: '',
  is_active: true,
};

function EventForm({ initial = EMPTY_FORM, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-surface-50 rounded-2xl border border-surface-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-surface-900">{initial.id ? 'Edit Event' : 'New Event'}</h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-500">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="label">Event Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} className="input" placeholder="Why Learn FDE in 2027?" />
        </div>
        <div className="md:col-span-2">
          <label className="label">Subtitle / Tagline</label>
          <input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} className="input" placeholder="A career-focused webinar for engineers looking to specialise in FDE" />
        </div>
        <div className="md:col-span-2">
          <label className="label">Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} className="input min-h-[80px] resize-y" placeholder="Full description of the event…" />
        </div>

        <div>
          <label className="label">Event Type</label>
          <select value={form.event_type} onChange={e => set('event_type', e.target.value)} className="input">
            {['Career Webinar', 'Technical Workshop', 'Live Q&A', 'Panel Discussion', 'Masterclass'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Event Date</label>
          <input type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} className="input" />
        </div>

        <div>
          <label className="label">Platform</label>
          <input value={form.platform} onChange={e => set('platform', e.target.value)} className="input" placeholder="gcode.in" />
        </div>
        <div>
          <label className="label">Registration URL</label>
          <input value={form.platform_url} onChange={e => set('platform_url', e.target.value)} className="input" placeholder="https://events.gcode.in/…" />
        </div>

        <div>
          <label className="label">Host Name</label>
          <input value={form.host_name} onChange={e => set('host_name', e.target.value)} className="input" placeholder="Arup Mohanty" />
        </div>
        <div>
          <label className="label">Host Title</label>
          <input value={form.host_title} onChange={e => set('host_title', e.target.value)} className="input" placeholder="Director" />
        </div>
        <div>
          <label className="label">Host Organisation</label>
          <input value={form.host_org} onChange={e => set('host_org', e.target.value)} className="input" placeholder="Oracle" />
        </div>
        <div>
          <label className="label">Price (INR, 0 = Free)</label>
          <input type="number" min="0" value={form.price_inr} onChange={e => set('price_inr', e.target.value)} className="input" placeholder="149" />
        </div>

        <div className="md:col-span-2">
          <label className="label">Thumbnail URL</label>
          <input value={form.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)} className="input" placeholder="https://…/thumbnail.jpg" />
          {form.thumbnail_url && (
            <img src={form.thumbnail_url} alt="Preview" className="mt-2 h-28 w-auto rounded-lg object-cover border border-surface-200" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-surface-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="rounded" />
          <span className="text-sm text-surface-700">Active (visible on site)</span>
        </label>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="btn-secondary btn-sm">Cancel</button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.title || saving}
            className="btn-primary btn-sm"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Saving…' : 'Save event'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventsAdmin() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: eventsList = [], isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data } = await events.list({ activeOnly: false, limit: 100 });
      return data || [];
    },
  });

  const createMut = useMutation({
    mutationFn: (data) => events.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-events'] }); setShowForm(false); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => events.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-events'] }); setEditing(null); },
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, is_active }) => events.toggleActive(id, is_active),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-events'] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => events.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-events'] }),
  });

  const handleSaveNew = (formData) => {
    const payload = {
      ...formData,
      price_inr: formData.price_inr ? Number(formData.price_inr) : 0,
    };
    createMut.mutate(payload);
  };

  const handleSaveEdit = (formData) => {
    const payload = {
      ...formData,
      price_inr: formData.price_inr ? Number(formData.price_inr) : 0,
    };
    updateMut.mutate({ id: editing.id, data: payload });
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Awareness Events</h1>
          <p className="text-sm text-surface-500 mt-0.5">Manage webinars and events shown on the site.</p>
        </div>
        {!showForm && !editing && (
          <button onClick={() => setShowForm(true)} className="btn-primary btn-sm">
            <Plus className="h-4 w-4" /> Add event
          </button>
        )}
      </div>

      {showForm && !editing && (
        <EventForm
          onSave={handleSaveNew}
          onCancel={() => setShowForm(false)}
          saving={createMut.isPending}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse h-20" />
          ))}
        </div>
      ) : eventsList.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-surface-500 text-sm">No events yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {eventsList.map((event) => (
            editing?.id === event.id ? (
              <EventForm
                key={event.id}
                initial={{ ...EMPTY_FORM, ...event, price_inr: event.price_inr ?? '' }}
                onSave={handleSaveEdit}
                onCancel={() => setEditing(null)}
                saving={updateMut.isPending}
              />
            ) : (
              <div key={event.id} className="card p-5 flex items-start gap-4">
                {event.thumbnail_url && (
                  <img src={event.thumbnail_url} alt="" className="h-16 w-24 rounded-lg object-cover flex-shrink-0 border border-surface-200" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      event.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-100 text-surface-400'
                    }`}>
                      {event.is_active ? 'Active' : 'Hidden'}
                    </span>
                    {event.event_type && (
                      <span className="text-xs text-surface-400 bg-surface-50 px-2 py-0.5 rounded-full border border-surface-200">
                        {event.event_type}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-surface-900 mt-1 leading-snug">{event.title}</p>
                  <p className="text-xs text-surface-400 mt-0.5">
                    {event.host_name && `${event.host_name}${event.host_org ? ` · ${event.host_org}` : ''}`}
                    {event.event_date && ` · ${formatDateShort(event.event_date)}`}
                    {event.price_inr > 0 ? ` · ₹${event.price_inr}` : ' · Free'}
                  </p>
                  {event.platform_url && (
                    <a href={event.platform_url} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-1 text-xs text-brand-600 mt-1 hover:underline">
                      {event.platform || 'Registration link'} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleMut.mutate({ id: event.id, is_active: !event.is_active })}
                    className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700"
                    title={event.is_active ? 'Hide' : 'Show'}
                  >
                    {event.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setEditing(event)}
                    className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete "${event.title}"?`)) deleteMut.mutate(event.id); }}
                    className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
