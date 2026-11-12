import { useState } from 'react';
import { Clock, Bell, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { newsletter } from '../lib/db';

const schema = z.object({
  name:  z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
});

export default function ComingSoon({ engine }) {
  const [submitted, setSubmitted] = useState(false);
  const Icon = engine?.icon;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await newsletter.subscribe(data.email, data.name);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-20">
      <div className="container-narrow text-center">
        {/* Engine icon */}
        {engine && Icon && (
          <div
            className="inline-flex h-20 w-20 rounded-2xl items-center justify-center mb-6 mx-auto"
            style={{ backgroundColor: `${engine.hexColor}18`, color: engine.hexColor }}
          >
            <Icon className="h-10 w-10" />
          </div>
        )}

        {/* Coming soon badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-100 text-surface-600 rounded-full text-sm font-medium mb-6">
          <Clock className="h-4 w-4" />
          Coming Soon
        </div>

        <h1 className="section-title mb-4">
          {engine?.name || 'Something big is coming'}
        </h1>
        <p className="section-desc max-w-xl mx-auto mb-10">
          {engine?.description || "We're building something worth waiting for. Leave your details and we'll notify you the moment it launches."}
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
            <div className="card p-6 text-left">
              <div className="flex items-center gap-2 mb-5">
                <Bell className="h-4 w-4 text-brand-600" />
                <p className="text-sm font-semibold text-surface-900">Get notified at launch</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="label">Your name</label>
                  <input {...register('name')} className="input" placeholder="Priya Sharma" />
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label">Work email</label>
                  <input {...register('email')} type="email" className="input" placeholder="priya@company.com" />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full mt-4 justify-center"
                style={engine ? { backgroundColor: engine.hexColor, borderColor: engine.hexColor } : {}}
              >
                {isSubmitting ? 'Saving...' : 'Notify Me'}
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-md mx-auto card p-8 text-center">
            <div className="h-14 w-14 rounded-full bg-dpdpa-100 text-dpdpa-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-2 text-lg">You're on the list</h3>
            <p className="text-sm text-surface-500">
              We'll send you a note the moment {engine?.name || 'this'} launches.
            </p>
          </div>
        )}

        {/* What to expect */}
        {engine && (
          <div className="mt-14 max-w-lg mx-auto text-left">
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider text-center mb-5">What to expect</p>
            <div className="card p-5">
              <p className="text-sm text-surface-700 leading-relaxed">{engine.tagline}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
