import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Clock, Star } from 'lucide-react';
import { getEngineById } from '../data/engines';
import * as LucideIcons from 'lucide-react';

function DynamicIcon({ name, className }) {
  const Icon = LucideIcons[name] || LucideIcons.Wrench;
  return <Icon className={className} />;
}

export default function ServiceCard({ service, variant = 'default' }) {
  const engine = getEngineById(service.engineId);
  const isFeatured = variant === 'featured' || service.eyecatcher;

  if (isFeatured) {
    return (
      <Link
        to={`/services/${service.slug}`}
        className="group relative block overflow-hidden rounded-2xl bg-white border border-surface-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 hover:border-surface-300"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

        {/* Featured badge */}
        {service.eyecatcher && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full mb-5 tracking-wide uppercase">
            <Star className="h-3 w-3" />
            {service.eyecatcher === true ? 'Featured' : service.eyecatcher}
          </div>
        )}

        {/* Engine label */}
        {engine && (
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3">{engine.name}</p>
        )}

        <h3 className="font-bold text-surface-900 mb-2 text-lg leading-snug group-hover:text-emerald-700 transition-colors">
          {service.name}
        </h3>
        <p className="text-sm text-surface-500 leading-relaxed mb-5 line-clamp-2">{service.tagline}</p>

        {service.penalty && (
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 font-medium leading-snug">
              Protect your business from penalties up to {service.penalty}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-surface-100">
          {service.timeline && (
            <div className="flex items-center gap-1.5 text-xs text-surface-400">
              <Clock className="h-3.5 w-3.5" />
              {service.timeline}
            </div>
          )}
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 ml-auto">
            Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-150" />
          </span>
        </div>
      </Link>
    );
  }

  const color = engine?.hexColor || '#6366F1';

  return (
    <Link
      to={`/services/${service.slug}`}
      className="group block rounded-2xl bg-white border border-surface-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-surface-300 transition-all duration-200"
    >
      {/* Engine label */}
      {engine && (
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color }}
        >
          {engine.shortName}
        </p>
      )}

      <h3 className="font-semibold text-surface-900 mb-1.5 group-hover:text-brand-600 transition-colors leading-snug text-sm">
        {service.shortName || service.name}
      </h3>
      <p className="text-sm text-surface-500 leading-relaxed mb-4 line-clamp-2">{service.tagline}</p>

      <div
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide transition-all"
        style={{ color }}
      >
        Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 duration-150" />
      </div>
    </Link>
  );
}
