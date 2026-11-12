import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { caseStudies } from '../lib/db';
import { SERVICE_ENGINES, getEngineById } from '../data/engines';
import { cn } from '../lib/utils';

const INDUSTRIES = ['All', 'Financial Services', 'Legal Technology', 'Supply Chain & Logistics', 'Healthcare', 'EdTech'];

export default function Work() {
  const [engine,   setEngine]   = useState(null);
  const [industry, setIndustry] = useState(null);

  const { data: work = [], isLoading } = useQuery({
    queryKey: ['case-studies'],
    queryFn: async () => { const { data } = await caseStudies.list(); return data || []; },
    staleTime: 5 * 60 * 1000,
  });

  const filtered = work.filter((cs) => {
    const matchEngine   = engine === null || cs.engine_id === engine;
    const matchIndustry = !industry || cs.client_industry === industry;
    return matchEngine && matchIndustry;
  });

  return (
    <main>
      {/* ── Header ───────────────────────────────────────── */}
      <section className="bg-white pt-14 pb-10 border-b border-surface-200">
        <div className="container">
          <span className="section-eyebrow">Client Work</span>
          <h1 className="section-title mt-2 mb-3">FDEs in action</h1>
          <p className="section-desc max-w-2xl">
            Real engagements, real outcomes — across fintech, legal, logistics, and more.
          </p>
        </div>
      </section>

      {/* ── Filters ──────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white border-b border-surface-200 shadow-card">
        <div className="container py-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Engine filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setEngine(null)}
                className={cn('filter-chip', engine === null && 'filter-chip-active')}
              >
                All Engines
              </button>
              {SERVICE_ENGINES.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setEngine(engine === e.id ? null : e.id)}
                  className={cn('filter-chip', engine === e.id && 'filter-chip-active')}
                >
                  {e.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────── */}
      <section className="section bg-surface-50">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="h-44 bg-surface-200" />
                  <div className="p-6">
                    <div className="h-4 bg-surface-200 rounded w-20 mb-4" />
                    <div className="h-6 bg-surface-200 rounded w-full mb-2" />
                    <div className="h-4 bg-surface-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">📂</div>
              <h3 className="font-semibold text-surface-700 mb-2">No case studies yet</h3>
              <p className="text-surface-500 text-sm">Check back soon — we're documenting recent engagements.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filtered.map((cs) => {
                const eng = getEngineById(cs.engine_id);
                return (
                  <Link key={cs.id} to={`/work/${cs.slug}`} className="card-hover group block overflow-hidden">
                    {/* Cover image / colored stripe */}
                    {cs.cover_image_url ? (
                      <div className="h-44 overflow-hidden">
                        <img
                          src={cs.cover_image_url}
                          alt={cs.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div
                        className="h-2 w-full"
                        style={{ backgroundColor: eng?.hexColor || '#6366f1' }}
                      />
                    )}

                    <div className="p-6">
                      {/* Industry + engine tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="badge-blue">{cs.client_industry}</span>
                        {eng && (
                          <span className="badge" style={{ color: eng.hexColor, backgroundColor: `${eng.hexColor}12` }}>
                            {eng.shortName}
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-surface-900 mb-3 group-hover:text-brand-600 transition-colors leading-snug text-lg">
                        {cs.title}
                      </h3>
                      <p className="text-sm text-surface-500 line-clamp-2 leading-relaxed mb-5">
                        {cs.challenge}
                      </p>

                      {/* Outcome highlight */}
                      {cs.outcome && (
                        <div className="bg-dpdpa-50 border border-dpdpa-100 rounded-xl p-3 mb-4">
                          <p className="text-xs font-semibold text-dpdpa-700 mb-1">Outcome</p>
                          <p className="text-sm text-dpdpa-800 leading-relaxed line-clamp-2">{cs.outcome}</p>
                        </div>
                      )}

                      <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                        Read case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="section-sm bg-brand-600 text-center">
        <div className="container">
          <h2 className="text-2xl font-bold text-white mb-3">Want to be our next case study?</h2>
          <Link to="/contact" className="btn-gold">
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
