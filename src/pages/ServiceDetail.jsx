import { useParams, Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { CheckCircle, Clock, ArrowRight, Users, Briefcase, AlertTriangle } from 'lucide-react';
import { getServiceBySlug, getServicesByEngine, SERVICES } from '../data/services';
import { getEngineById } from '../data/engines';
import { inquiries } from '../lib/db';
import ServiceCard from '../components/ServiceCard';
import { COMPANY_SIZES, BUDGET_RANGES, TIMELINE_OPTIONS } from '../lib/utils';

const schema = z.object({
  name:         z.string().min(2, 'Name required'),
  email:        z.string().email('Valid email required'),
  company:      z.string().min(2, 'Company required'),
  company_size: z.string().min(1, 'Select company size'),
  budget:       z.string().min(1, 'Select budget range'),
  timeline:     z.string().min(1, 'Select timeline'),
  message:      z.string().min(20, 'Tell us more about your need'),
});

export default function ServiceDetail() {
  const { slug }   = useParams();
  const service    = getServiceBySlug(slug);
  const [sent, setSent] = useState(false);

  if (!service) return <Navigate to="/services" replace />;

  const engine = getEngineById(service.engineId);
  const related = getServicesByEngine(service.engineId)
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await inquiries.create({ ...data, service_slug: slug, engine_id: service.engineId });
    setSent(true);
  };

  return (
    <main>
      {/* ── Header ───────────────────────────────────────── */}
      <section className="bg-white pt-12 pb-10 border-b border-surface-200">
        <div className="container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-6">
            <Link to="/services" className="hover:text-brand-600 transition-colors">Services</Link>
            <span>/</span>
            {engine && (
              <>
                <Link to={engine.path} className="hover:text-brand-600 transition-colors">{engine.name}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-surface-900">{service.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              {/* Engine badge */}
              {engine && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md mb-3"
                  style={{ color: engine.hexColor, backgroundColor: `${engine.hexColor}12` }}
                >
                  {engine.name}
                </span>
              )}
              <h1 className="section-title mb-3">{service.name}</h1>
              <p className="section-desc">{service.tagline}</p>

              {/* Meta row */}
              <div className="flex flex-wrap gap-4 mt-5">
                <div className="flex items-center gap-1.5 text-sm text-surface-500">
                  <Clock className="h-4 w-4" /> {service.timeline}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-surface-500">
                  <Briefcase className="h-4 w-4" /> {service.engagement}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-surface-500">
                  <Users className="h-4 w-4" /> {service.audience?.join(', ')}
                </div>
              </div>

              {/* Penalty notice */}
              {service.penalty && (
                <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <span className="text-sm text-amber-800 font-medium">
                    Protect your business from penalties up to {service.penalty}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Content + Form ───────────────────────────────── */}
      <section className="section bg-surface-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left: detail */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div className="card p-6">
                <h2 className="font-semibold text-surface-900 mb-3 text-xl">Overview</h2>
                <p className="text-surface-600 leading-relaxed">{service.overview}</p>
              </div>

              {/* Deliverables */}
              {service.deliverables?.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-semibold text-surface-900 mb-4 text-xl">What you get</h2>
                  <ul className="space-y-3">
                    {service.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-brand-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-surface-700">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {service.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: inquiry form */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                {sent ? (
                  <div className="text-center py-6">
                    <div className="h-14 w-14 rounded-full bg-dpdpa-100 text-dpdpa-600 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-surface-900 mb-2">Inquiry received</h3>
                    <p className="text-sm text-surface-500">We'll be in touch within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-surface-900 mb-1">Enquire about this service</h3>
                    <p className="text-xs text-surface-500 mb-5">Get a response within 24 hours.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                      <div>
                        <label className="label label-required">Your name</label>
                        <input {...register('name')} className="input" placeholder="Priya Sharma" />
                        {errors.name && <p className="form-error">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="label label-required">Work email</label>
                        <input {...register('email')} type="email" className="input" placeholder="priya@company.in" />
                        {errors.email && <p className="form-error">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="label label-required">Company</label>
                        <input {...register('company')} className="input" placeholder="Acme Fintech" />
                        {errors.company && <p className="form-error">{errors.company.message}</p>}
                      </div>
                      <div>
                        <label className="label">Company size</label>
                        <select {...register('company_size')} className="select">
                          <option value="">Select…</option>
                          {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.company_size && <p className="form-error">{errors.company_size.message}</p>}
                      </div>
                      <div>
                        <label className="label">Budget range</label>
                        <select {...register('budget')} className="select">
                          <option value="">Select…</option>
                          {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {errors.budget && <p className="form-error">{errors.budget.message}</p>}
                      </div>
                      <div>
                        <label className="label">Timeline</label>
                        <select {...register('timeline')} className="select">
                          <option value="">Select…</option>
                          {TIMELINE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {errors.timeline && <p className="form-error">{errors.timeline.message}</p>}
                      </div>
                      <div>
                        <label className="label label-required">What do you need?</label>
                        <textarea {...register('message')} rows={3} className="textarea" placeholder="Tell us what you're trying to build or solve…" />
                        {errors.message && <p className="form-error">{errors.message.message}</p>}
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full justify-center"
                        style={engine ? { backgroundColor: engine.hexColor } : {}}
                      >
                        {isSubmitting ? 'Sending…' : 'Send Inquiry'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related services ─────────────────────────────── */}
      {related.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <h2 className="section-title-sm mb-8">Related services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((s) => <ServiceCard key={s.slug} service={s} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
