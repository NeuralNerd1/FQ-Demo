import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Mail, Building2 } from 'lucide-react';
import { inquiries } from '../../lib/db';

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

export default function InquiriesAdmin() {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      const { data } = await inquiries.list();
      return data || [];
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, status }) => inquiries.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-inquiries'] }),
  });

  const filtered = filterStatus === 'all' ? items : items.filter(i => i.status === filterStatus);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Inquiries</h1>
          <p className="text-sm text-surface-500 mt-0.5">{items.length} total submissions</p>
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="select w-auto"
        >
          <option value="all">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center text-surface-400">No inquiries found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className="card overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                className="w-full p-5 flex items-center justify-between gap-4 hover:bg-surface-50 transition-colors text-left"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {item.name?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-surface-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-surface-500 truncate">{item.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`status-${item.status || 'new'}`}>{item.status || 'new'}</span>
                  <span className="text-xs text-surface-400">
                    {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  {expanded === item.id ? <ChevronUp className="h-4 w-4 text-surface-400" /> : <ChevronDown className="h-4 w-4 text-surface-400" />}
                </div>
              </button>

              {expanded === item.id && (
                <div className="border-t border-surface-100 p-5 bg-surface-50 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-surface-400 mb-1 flex items-center gap-1"><Mail className="h-3 w-3" /> Email</p>
                      <a href={`mailto:${item.email}`} className="text-brand-600 hover:underline">{item.email}</a>
                    </div>
                    {item.company && (
                      <div>
                        <p className="text-xs text-surface-400 mb-1 flex items-center gap-1"><Building2 className="h-3 w-3" /> Company</p>
                        <p className="text-surface-700">{item.company}</p>
                      </div>
                    )}
                    {item.service_track && (
                      <div>
                        <p className="text-xs text-surface-400 mb-1">Track</p>
                        <p className="text-surface-700 capitalize">{item.service_track}</p>
                      </div>
                    )}
                  </div>
                  {item.message && (
                    <div>
                      <p className="text-xs text-surface-400 mb-1">Message</p>
                      <p className="text-sm text-surface-700 leading-relaxed whitespace-pre-wrap">{item.message}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-2">
                    <label className="text-xs text-surface-500">Status:</label>
                    <select
                      value={item.status || 'new'}
                      onChange={e => updateMut.mutate({ id: item.id, status: e.target.value })}
                      className="select select-sm w-auto text-xs"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <a href={`mailto:${item.email}`} className="btn-sm btn-primary ml-auto">Reply</a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
