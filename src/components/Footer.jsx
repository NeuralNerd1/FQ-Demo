import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, MapPin, ArrowRight, Clock, ExternalLink } from 'lucide-react';
import { socialLinks } from '../lib/db';
import { ORDERED_ENGINES } from '../data/engines';

const PLATFORM_ICONS = {
  linkedin:  'in',
  twitter:   'X',
  instagram: 'ig',
  youtube:   'yt',
  github:    'gh',
};

export default function Footer() {
  const { data: socials = [] } = useQuery({
    queryKey: ['social-links'],
    queryFn: async () => {
      const { data } = await socialLinks.list(true);
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const activeEngines    = ORDERED_ENGINES.filter((e) => !e.comingSoon);
  const comingSoonEngines = ORDERED_ENGINES.filter((e) => e.comingSoon);

  return (
    <footer className="bg-surface-900 text-surface-300">
      {/* Newsletter strip */}
      <div className="border-b border-surface-800">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Stay ahead of the FDE curve</h3>
              <p className="text-surface-400 text-sm">Practical insights on software delivery, AI, and compliance — no fluff.</p>
            </div>
            <form
              className="flex gap-2 w-full md:w-auto"
              onSubmit={(e) => {
                e.preventDefault();
                // handled via subscribe action on Insights page
              }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-56 px-3.5 py-2.5 text-sm bg-surface-800 border border-surface-700 text-white placeholder-surface-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <button type="submit" className="btn-primary flex-shrink-0">
                Subscribe <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src="/logo.png" alt="FormatiQs" className="h-10 w-auto brightness-0 invert opacity-90" />
            </Link>
            <p className="text-surface-400 text-sm leading-relaxed mb-5">
              India's first Forward Deployed Engineering company. We embed engineers inside your organisation — not as consultants, but as builders accountable for outcomes.
            </p>
            {/* Social links */}
            {socials.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {socials.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-lg bg-surface-800 hover:bg-brand-600 text-surface-400 hover:text-white flex items-center justify-center transition-all duration-150 text-xs font-bold"
                    title={link.label}
                  >
                    {PLATFORM_ICONS[link.platform] || link.platform.slice(0, 2).toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Engines column */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Engines</h4>
            <ul className="space-y-2.5">
              {activeEngines.map((engine) => (
                <li key={engine.id}>
                  <Link
                    to={engine.path}
                    className="text-sm text-surface-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: engine.hexColor }} />
                    {engine.name}
                  </Link>
                </li>
              ))}
              {comingSoonEngines.map((engine) => (
                <li key={engine.id}>
                  <span className="text-sm text-surface-600 inline-flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {engine.name}
                    <span className="text-xs bg-surface-800 text-surface-500 px-1.5 py-0.5 rounded">Soon</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/what-is-fde', label: 'What is FDE?' },
                { to: '/services',    label: 'Services' },
                { to: '/work',        label: 'Work' },
                { to: '/insights',    label: 'Insights' },
                { to: '/about',       label: 'About Us' },
                { to: '/contact',     label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-surface-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:hello@formatiqs.in" className="text-sm text-surface-400 hover:text-white transition-colors flex items-start gap-2.5">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  hello@formatiqs.in
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="text-sm text-surface-400 hover:text-white transition-colors flex items-start gap-2.5">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <span className="text-sm text-surface-400 flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  Mumbai, Maharashtra, India
                </span>
              </li>
            </ul>
            <div className="mt-5">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
              >
                Book a discovery call <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-surface-800">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-surface-500">
            © {new Date().getFullYear()} FormatiQs. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-surface-500 hover:text-surface-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="text-xs text-surface-500 hover:text-surface-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
