import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { team } from '../../lib/db';

const schema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  bio: z.string().optional(),
  linkedin_url: z.string().url('Must be a URL').optional().or(z.literal('')),
  avatar_url: z.string().url('Must be a URL').optional().or(z.literal('')),
  display_order: z.coerce.number().int().default(0),
});

function MemberForm({ initial, onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initial || { display_order: 0 },
  });
  return (
    <form onSubmit={handleSubmit(onSave)} className="card p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="label label-required">Name</label>
          <input {...register('name')} className="input" />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>
        <div className="form-group">
          <label className="label label-required">Role / title</label>
          <input {...register('role')} className="input" placeholder="Forward Deployed Engineer" />
          {errors.role && <p className="form-error">{errors.role.message}</p>}
        </div>
      </div>
      <div className="form-group">
        <label className="label">Bio</label>
        <textarea {...register('bio')} rows={3} className="textarea" />
      </div>
      <div className="form-group">
        <label className="label">Avatar / Photo URL</label>
        <input {...register('avatar_url')} className="input" placeholder="https://…/photo.jpg" />
        {errors.avatar_url && <p className="form-error">{errors.avatar_url.message}</p>}
        <p className="text-xs text-surface-400 mt-1">Optional. Replaces the initials circle on the About page.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="label">LinkedIn URL</label>
          <input {...register('linkedin_url')} className="input" placeholder="https://linkedin.com/in/…" />
          {errors.linkedin_url && <p className="form-error">{errors.linkedin_url.message}</p>}
        </div>
        <div className="form-group">
          <label className="label">Display order</label>
          <input {...register('display_order')} type="number" className="input" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  );
}

export default function TeamAdmin() {
  const qc = useQueryClient();
  const [form, setForm] = useState(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['admin-team'],
    queryFn: async () => {
      const { data } = await team.list();
      return data || [];
    },
  });

  const createMut = useMutation({
    mutationFn: (data) => team.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-team'] }); setForm(null); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, ...data }) => team.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-team'] }); setForm(null); },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => team.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-team'] }),
  });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-surface-900">Team</h1>
        {!form && (
          <button onClick={() => setForm('new')} className="btn-primary">
            <Plus className="h-4 w-4" /> Add member
          </button>
        )}
      </div>

      {form === 'new' && (
        <div className="mb-6">
          <MemberForm onSave={(data) => createMut.mutate(data)} onCancel={() => setForm(null)} />
        </div>
      )}

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-5 animate-pulse h-20" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {members.map(m => (
            <div key={m.id}>
              {form?.id === m.id ? (
                <MemberForm
                  initial={m}
                  onSave={(data) => updateMut.mutate({ id: m.id, ...data })}
                  onCancel={() => setForm(null)}
                />
              ) : (
                <div className="card p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {m.avatar_url ? (
                        <img src={m.avatar_url} alt={m.name} className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold flex-shrink-0">
                          {m.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-surface-900 text-sm">{m.name}</p>
                        <p className="text-xs text-brand-600">{m.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setForm({ id: m.id, ...m })} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-brand-600">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => { if (confirm('Remove?')) deleteMut.mutate(m.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {m.bio && <p className="text-xs text-surface-500 mt-2 leading-relaxed line-clamp-2">{m.bio}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
