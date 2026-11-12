import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Building2 } from 'lucide-react';
import { caseStudies } from '../lib/db';
import { getEngineById } from '../data/engines';

export default function WorkDetail() {
  const { slug } = useParams();

  const { data: cs, isLoading, error } = useQuery({
    queryKey: ['case-study', slug],
    queryFn: async () => {
      const { data, error } = await caseStudies.get(slug);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full" />
    </div>
  );

  if (error || !cs) return <Navigate to="/work" replace />;

  const engine = getEngineById(cs.engine_id);

  return (
    <main>
      {/* ── Header ───────────────────────────────────────── */}
      <section className="bg-white pt-12 pb-14 border-b border-surface-200">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-6">
            <Link to="/work" className="hover:text-brand-600">Work</Link>
            <span>/</span>
            <span className="text-surface-900 truncate">{cs.title}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="badge-blue">{cs.client_industry}</span>
            {engine && (
              <span className="badge" style={{ color: engine.hexColor, backgroundColor: `${engine.hexColor}12` }}>
                {engine.name}
              </span>
            )}
          </div>

          <h1 className="section-title mb-5">{cs.title}</h1>
        </div>
      </section>

      {/* ── Sections ─────────────────────────────────────── */}
      <section className="section bg-surface-50">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            {/* Challenge */}
            <div className="card p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="font-semibold text-surface-900 text-xl">The Challenge</h2>
              </div>
              <p className="text-surface-700 leading-relaxed">{cs.challenge}</p>
            </div>

            {/* Solution */}
            <div className="card p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="font-semibold text-surface-900 text-xl">The FDE Approach</h2>
              </div>
              <p className="text-surface-700 leading-relaxed">{cs.solution}</p>
            </div>

            {/* Outcome */}
            {cs.outcome && (
              <div className="bg-dpdpa-50 border border-dpdpa-200 rounded-2xl p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-dpdpa-200 text-dpdpa-700 flex items-center justify-center font-bold text-sm">3</div>
                  <h2 className="font-semibold text-dpdpa-900 text-xl">The Outcome</h2>
                </div>
                <p className="text-dpdpa-800 leading-relaxed">{cs.outcome}</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-10 card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-surface-900">Want a similar outcome?</p>
              <p className="text-sm text-surface-500">We'll scope the right FDE engagement in one call.</p>
            </div>
            <Link to="/contact" className="btn-primary flex-shrink-0">
              Start the conversation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
