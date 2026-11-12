import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ChevronDown } from 'lucide-react';
import { SERVICES } from '../data/services';
import { SERVICE_ENGINES, getEngineById } from '../data/engines';
import ServiceCard from '../components/ServiceCard';
import { cn } from '../lib/utils';

const DEFAULT_SHOW = 9;

export default function Services() {
  const [search, setSearch]       = useState('');
  const [engine, setEngine]       = useState(null);
  const [showAll, setShowAll]     = useState(false);

  const filtered = SERVICES.filter((s) => {
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline.toLowerCase().includes(search.toLowerCase()) ||
      (s.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchEngine = engine === null || s.engineId === engine;
    return matchSearch && matchEngine;
  });

  const visible = showAll ? filtered : filtered.slice(0, DEFAULT_SHOW);
  const hasMore = !showAll && filtered.length > DEFAULT_SHOW;

  return (
    <main>
      {/* ── Header ───────────────────────────────────────── */}
      <section className="bg-white pt-14 pb-10 border-b border-surface-200">
        <div className="container">
          <span className="section-eyebrow">25 Services</span>
          <h1 className="section-title mt-2 mb-3">Every service we offer</h1>
          <p className="section-desc max-w-2xl">
            From DPDPA compliance to AI pipelines and managed infrastructure — each service is delivered
            by an FDE embedded in your team.
          </p>
        </div>
      </section>

      {/* ── Sticky filter bar ────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white border-b border-surface-200 shadow-card">
        <div className="container py-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowAll(false); }}
                placeholder="Search services…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-surface-200 bg-surface-50 rounded-lg text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Engine filter chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => { setEngine(null); setShowAll(false); }}
                className={cn('filter-chip', engine === null && 'filter-chip-active')}
              >
                All
              </button>
              {SERVICE_ENGINES.map((e) => (
                <button
                  key={e.id}
                  onClick={() => { setEngine(engine === e.id ? null : e.id); setShowAll(false); }}
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
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-surface-300 text-5xl mb-4">🔍</div>
              <h3 className="font-semibold text-surface-700 mb-2">No services match</h3>
              <p className="text-surface-500 text-sm">Try a different keyword or clear the filter.</p>
              <button onClick={() => { setSearch(''); setEngine(null); }} className="btn-outline mt-4">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visible.map((service) => (
                  <ServiceCard
                    key={service.slug}
                    service={service}
                    variant={service.eyecatcher ? 'featured' : 'default'}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-8">
                  <button onClick={() => setShowAll(true)} className="btn-outline">
                    View {filtered.length - DEFAULT_SHOW} more services
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}

              {!hasMore && filtered.length > DEFAULT_SHOW && (
                <div className="text-center mt-6">
                  <p className="text-sm text-surface-400">Showing all {filtered.length} services</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Engine breakdown ─────────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title-sm">Services by engine</h2>
            <p className="section-desc-sm mt-2">Each engine is a focused capability area with dedicated FDEs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICE_ENGINES.map((eng) => {
              const engServices = SERVICES.filter((s) => s.engineId === eng.id);
              const Icon = eng.icon;
              return (
                <div key={eng.id} className="card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="h-10 w-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${eng.hexColor}18`, color: eng.hexColor }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-surface-900">{eng.name}</h3>
                      <p className="text-xs text-surface-500">{engServices.length} services</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 mb-5">
                    {engServices.slice(0, 5).map((s) => (
                      <li key={s.slug}>
                        <Link
                          to={`/services/${s.slug}`}
                          className="text-sm text-surface-600 hover:text-brand-600 transition-colors"
                        >
                          → {s.shortName || s.name}
                        </Link>
                      </li>
                    ))}
                    {engServices.length > 5 && (
                      <li className="text-xs text-surface-400">+{engServices.length - 5} more</li>
                    )}
                  </ul>
                  <Link
                    to={eng.path}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    style={{ color: eng.hexColor }}
                  >
                    View engine <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
