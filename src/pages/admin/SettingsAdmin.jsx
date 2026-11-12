import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { settings, auth } from '../../lib/db';

const profileSchema = z.object({
  site_name: z.string().min(2),
  contact_email: z.string().email(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  meta_description: z.string().optional(),
});

const passwordSchema = z.object({
  new_password: z.string().min(8, 'At least 8 characters'),
  confirm_password: z.string(),
}).refine(d => d.new_password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export default function SettingsAdmin() {
  const qc = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  const { data: siteSettings = {}, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await settings.getAll();
      return data?.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}) || {};
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      site_name: siteSettings.site_name || 'FormatiQs',
      contact_email: siteSettings.contact_email || '',
      contact_phone: siteSettings.contact_phone || '',
      address: siteSettings.address || '',
      meta_description: siteSettings.meta_description || '',
    },
  });

  const { register: regPw, handleSubmit: handlePw, reset: resetPw, formState: { errors: pwErrors } } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const saveMut = useMutation({
    mutationFn: async (data) => {
      await Promise.all(Object.entries(data).map(([key, value]) => settings.set(key, value)));
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-settings'] }); setSaved(true); setTimeout(() => setSaved(false), 3000); },
  });

  const handlePasswordChange = async (data) => {
    setPwError('');
    const { error } = await auth.updatePassword(data.new_password);
    if (error) {
      setPwError(error.message || 'Failed to update password.');
    } else {
      setPwSaved(true);
      resetPw();
      setTimeout(() => setPwSaved(false), 3000);
    }
  };

  if (isLoading) return <div className="max-w-2xl"><div className="card p-6 animate-pulse h-40" /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-surface-900">Settings</h1>
        <p className="text-sm text-surface-500 mt-0.5">Site configuration and account settings</p>
      </div>

      {/* Site details */}
      <form onSubmit={handleSubmit(d => saveMut.mutate(d))} className="card p-6 space-y-4">
        <h2 className="font-semibold text-surface-900">Site Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label label-required">Site name</label>
            <input {...register('site_name')} className="input" />
            {errors.site_name && <p className="form-error">{errors.site_name.message}</p>}
          </div>
          <div className="form-group">
            <label className="label label-required">Contact email</label>
            <input {...register('contact_email')} type="email" className="input" />
            {errors.contact_email && <p className="form-error">{errors.contact_email.message}</p>}
          </div>
          <div className="form-group">
            <label className="label">Phone</label>
            <input {...register('contact_phone')} className="input" placeholder="+91 …" />
          </div>
          <div className="form-group">
            <label className="label">Address</label>
            <input {...register('address')} className="input" placeholder="City, Country" />
          </div>
        </div>
        <div className="form-group">
          <label className="label">Meta description</label>
          <textarea {...register('meta_description')} rows={2} className="textarea" placeholder="Brief site description for search engines" />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saveMut.isPending} className="btn-primary">
            <Save className="h-4 w-4" /> {saveMut.isPending ? 'Saving…' : 'Save changes'}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" /> Saved
            </span>
          )}
        </div>
      </form>

      {/* Password */}
      <form onSubmit={handlePw(handlePasswordChange)} className="card p-6 space-y-4">
        <h2 className="font-semibold text-surface-900">Change Password</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label label-required">New password</label>
            <input {...regPw('new_password')} type="password" className="input" />
            {pwErrors.new_password && <p className="form-error">{pwErrors.new_password.message}</p>}
          </div>
          <div className="form-group">
            <label className="label label-required">Confirm password</label>
            <input {...regPw('confirm_password')} type="password" className="input" />
            {pwErrors.confirm_password && <p className="form-error">{pwErrors.confirm_password.message}</p>}
          </div>
        </div>
        {pwError && <p className="form-error">{pwError}</p>}
        <div className="flex items-center gap-3">
          <button type="submit" className="btn-secondary">Update password</button>
          {pwSaved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" /> Password updated
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
