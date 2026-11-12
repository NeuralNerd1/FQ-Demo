import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Building2, Cpu, Wrench, Lightbulb, ChevronRight } from 'lucide-react';
import { inquiries } from '../lib/db';

const TRACKS = [
  { id: 'build', icon: Wrench, label: 'Build & Deploy', desc: 'Ship a product or platform fast with embedded engineers.' },
  { id: 'ai', icon: Cpu, label: 'AI & Automation', desc: 'Integrate LLMs, automation layers, or AI-native workflows.' },
  { id: 'managed', icon: Building2, label: 'Managed Services', desc: 'Ongoing engineering support — no hiring, full ownership.' },
  { id: 'other', icon: Lightbulb, label: "Not sure yet", desc: "Tell us your situation and we'll recommend a path." },
];

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  company: z.string().optional(),
  message: z.string().min(10, 'Please share a few details about your situation'),
});

export default function Contact() {
  const [track, setTrack] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const { error } = await inquiries.create({
      ...data,
      service_track: track,
      source: 'contact_page',
    });
    if (!error) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 mb-3">Message sent!</h2>
          <p className="text-surface-500">We review every inquiry personally. Expect a reply within one business day.</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      {/* ── Header ───────────────────────────────────────── */}
      <section className="bg-white pt-12 pb-14 border-b border-surface-200">
        <div className="container max-w-2xl text-center">
          <span className="section-eyebrow">Get in touch</span>
          <h1 className="section-title mt-2 mb-4">Let's talk about your execution gap</h1>
          <p className="section-desc mx-auto">No sales scripts — just an honest conversation about what you're trying to build and whether we're a fit.</p>
        </div>
      </section>

      {/* ── Form ─────────────────────────────────────────── */}
      <section className="section bg-surface-50">
        <div className="container max-w-xl">
          {/* Track selector */}
          <div className="mb-8">
            <p className="label mb-3">What brings you here? <span className="text-surface-400 font-normal">(optional)</span></p>
            <div className="grid sm:grid-cols-2 gap-3">
              {TRACKS.map(({ id, icon: Icon, label, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTrack(t => t === id ? null : id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    track === id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-surface-200 bg-white hover:border-surface-300'
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-2 ${track === id ? 'text-brand-600' : 'text-surface-400'}`} />
                  <p className={`text-sm font-semibold ${track === id ? 'text-brand-700' : 'text-surface-800'}`}>{label}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit(onSubmit)} className="card p-7 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label label-required">Your name</label>
                <input {...register('name')} className="input" placeholder="Priya Sharma" />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>
              <div className="form-group">
                <label className="label label-required">Work email</label>
                <input {...register('email')} type="email" className="input" placeholder="priya@company.com" />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="label">Company</label>
              <input {...register('company')} className="input" placeholder="Your company name" />
            </div>

            <div className="form-group">
              <label className="label label-required">What are you trying to build or solve?</label>
              <textarea
                {...register('message')}
                rows={5}
                className="textarea"
                placeholder="Tell us about the problem, the timeline, and any constraints you're working with."
              />
              {errors.message && <p className="form-error">{errors.message.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Sending…' : 'Send message'}
              {!isSubmitting && <ChevronRight className="h-4 w-4" />}
            </button>

            <p className="text-xs text-surface-400 text-center">We respond within one business day. No spam, ever.</p>
          </form>
        </div>
      </section>
    </main>
  );
}
