import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { caseStudies } from '../../lib/db';

const schema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  client_industry: z.string().optional(),
  engine_id: z.string().optional(),
  challenge: z.string().min(10),
  solution: z.string().min(10),
  outcome: z.string().optional(),
  cover_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

function CaseForm({ initial, onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initial || {},
  });
  return (
    <form onSubmit={handleSubmit(onSave)} className="card p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="label label-required">Title</label>
          <input {...register('title')} className="input" />
          {errors.title && <p className="form-error">{errors.title.message}</p>}
        </div>
        <div className="form-group">
          <label className="label label-required">Slug</label>
          <input {...register('slug')} className="input font-mono text-sm" />
          {errors.slug && <p className="form-error">{errors.slug.message}</p>}
        </div>
        <div className="form-group">
          <label className="label">Industry</label>
          <input {...register('client_industry')} className="input" placeholder="Fintech, Legal SaaS…" />
        </div>
        <div className="form-group">
          <label className="label">Engine</label>
          <select {...register('engine_id')} className="select">
            <option value="">None</option>
            <option value="E4">Build & Deploy (E4)</option>
            <option value="E5">AI & Automation (E5)</option>
            <option value="E6">Managed Services (E6)</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="label label-required">Challenge</label>
        <textarea {...register('challenge')} rows={3} className="textarea" />
        {errors.challenge && <p className="form-error">{errors.challenge.message}</p>}
      </div>
      <div className="form-group">
        <label className="label label-required">Solution / FDE approach</label>
        <textarea {...register('solution')} rows={3} className="textarea" />
        {errors.solution && <p className="form-error">{errors.solution.message}</p>}
      </div>
      <div className="form-group">
        <label className="label">Outcome</label>
        <textarea {...register('outcome')} rows={2} className="textarea" />
      </div>
      <div className="form-group">
        <label className="label">Cover Image URL</label>
        <input {...register('cover_image_url')} className="input" placeholder="https://…/image.jpg" />
        <p className="text-xs text-surface-400 mt-1">Optional. Shows as the card header image on the Work page.</p>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  );
}

export default function WorkAdmin() {
  const qc = useQueryClient();
  const [form, setForm] = useState(null); // null | 'new' | {id,...}

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-case-studies'],
    queryFn: async () => {
      const { data } = await caseStudies.list();
      return data || [];
    },
  });

  const sanitize = (data) => ({
    ...data,
    engine_id: data.engine_id || null,
    cover_image_url: data.cover_image_url || null,
  });

  const createMut = useMutation({
    mutationFn: (data) => caseStudies.create(sanitize(data)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-case-studies'] }); setForm(null); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, ...data }) => caseStudies.update(id, sanitize(data)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-case-studies'] }); setForm(null); },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => caseStudies.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-case-studies'] }),
  });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-surface-900">Case Studies</h1>
        {!form && (
          <button onClick={() => setForm('new')} className="btn-primary">
            <Plus className="h-4 w-4" /> Add case study
          </button>
        )}
      </div>

      {form === 'new' && (
        <div className="mb-6">
          <CaseForm
            onSave={(data) => createMut.mutate(data)}
            onCancel={() => setForm(null)}
          />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="card p-5 animate-pulse h-16" />)}</div>
      ) : (
        <div className="space-y-3">
          {items.map(cs => (
            <div key={cs.id}>
              {form?.id === cs.id ? (
                <CaseForm
                  initial={cs}
                  onSave={(data) => updateMut.mutate({ id: cs.id, ...data })}
                  onCancel={() => setForm(null)}
                />
              ) : (
                <div className="card p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 text-sm truncate">{cs.title}</p>
                    <p className="text-xs text-surface-400">{cs.client_industry || 'No industry'}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => setForm({ id: cs.id, ...cs })} className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-brand-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(cs.id); }} className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
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
