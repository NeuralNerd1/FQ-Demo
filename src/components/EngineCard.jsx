import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function EngineCard({ engine, variant = 'default', serviceCount }) {
  const Icon = engine.icon;
  const count = serviceCount ?? 0;

  if (engine.comingSoon) {
    return (
      <div className="relative group overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 opacity-50 shadow-sm">
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${engine.hexColor}10`, color: `${engine.hexColor}60` }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-surface-400 border border-surface-200 rounded-full">
              <Clock className="h-3 w-3" /> Coming Soon
            </span>
          </div>
          <h3 className="font-semibold text-surface-400 mb-1.5 text-base">{engine.name}</h3>
          <p className="text-sm text-surface-300 leading-relaxed">{engine.tagline}</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={engine.path}
      className="relative group overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 hover:border-surface-300 block"
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: engine.hexColor }}
      />

      <div className="relative">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${engine.hexColor}12`, color: engine.hexColor }}
          >
            <Icon className="h-5 w-5" />
          </div>
          {!engine.isContentEngine && count > 0 && (
            <span
              className="text-xs font-medium tabular-nums px-2 py-0.5 rounded-full border"
              style={{ color: engine.hexColor, borderColor: `${engine.hexColor}30`, backgroundColor: `${engine.hexColor}08` }}
            >
              {count} services
            </span>
          )}
          {engine.isContentEngine && (
            <span className="text-xs font-medium text-surface-400 border border-surface-200 px-2 py-0.5 rounded-full">
              Content
            </span>
          )}
        </div>

        <h3 className="font-semibold text-surface-900 mb-2 text-base tracking-tight group-hover:text-brand-700 transition-colors duration-150">
          {engine.name}
        </h3>
        <p className="text-sm text-surface-500 leading-relaxed mb-5 line-clamp-2">
          {engine.tagline}
        </p>

        <div
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150"
          style={{ color: engine.hexColor }}
        >
          {engine.isContentEngine ? 'Read Insights' : 'View Services'}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
