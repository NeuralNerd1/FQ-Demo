import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock } from 'lucide-react';
import { auth } from '../../lib/db';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password required'),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email, password }) => {
    setAuthError('');
    const { error } = await auth.signIn(email, password);
    if (error) {
      setAuthError('Invalid credentials. Please try again.');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="FormatiQs" className="h-10 w-auto mx-auto mb-3" />
          <p className="text-sm text-surface-500">Admin panel</p>
        </div>

        <div className="card p-7">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
              <Lock className="h-4 w-4" />
            </div>
            <h1 className="font-semibold text-surface-900">Sign in</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-group">
              <label className="label">Email</label>
              <input {...register('email')} type="email" className="input" placeholder="admin@formatiqs.com" autoFocus />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <input {...register('password')} type="password" className="input" placeholder="••••••••" />
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {authError}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
