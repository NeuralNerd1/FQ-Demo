import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getEngineBySlug } from '../data/engines';
import { getServicesByEngine } from '../data/services';
import ServiceCard from '../components/ServiceCard';

export default function EngineHub() {
  const { slug } = useParams();
  const engine   = getEngineBySlug(slug);

  if (!engine || engine.comingSoon) return <Navigate to="/services" replace />;

  const services = getServicesByEngine(engine.id);
  const Icon     = engine.icon;

  return (
    <main>
      {/* ── Header ───────────────────────────────────────── */}
      <section className="bg-white pt-12 pb-14 border-b border-surface-200">
        <div className="container">
          <div className="flex items-start gap-6">
            <div
              className="h-18 w-18 h-16 w-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${engine.hexColor}18`, color: engine.hexColor }}
            >
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <span
                className="text-xs font-bold tracking-widest uppercase mb-3 inline-block"
                style={{ color: engine.hexColor }}
              >
                {services.length} Services
              </span>
              <h1 className="section-title mb-3">{engine.name}</h1>
              <p className="section-desc max-w-2xl">{engine.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────── */}
      <section className="section bg-surface-50">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <ServiceCard
                key={s.slug}
                service={s}
                variant={s.eyecatcher ? 'featured' : 'default'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="section-sm bg-white border-t border-surface-200">
        <div className="container text-center">
          <h2 className="section-title-sm mb-3">Ready to explore {engine.name}?</h2>
          <p className="section-desc-sm max-w-lg mx-auto mb-7">
            Talk to an FDE who specialises in this area. We'll scope the right engagement in one call.
          </p>
          <Link to="/contact" className="btn-primary">
            Start the conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
