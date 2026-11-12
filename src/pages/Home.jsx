import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, CheckCircle, ChevronDown,
  Zap, Shield, Clock, Users, Building2,
  Calendar, ExternalLink, User, Video,
} from 'lucide-react';
import { ORDERED_ENGINES } from '../data/engines';
import { SERVICES as ALL_SERVICES } from '../data/services';
import EngineCard from '../components/EngineCard';
import ServiceCard from '../components/ServiceCard';
import { posts, caseStudies, siteContent, events } from '../lib/db';
import { formatDateShort } from '../lib/utils';

const DEFAULT_STATS = [
  { key: 'stat_fde_engagements', value: '50+', label: 'FDE Engagements' },
  { key: 'stat_services_offered', value: '25',  label: 'Services Offered' },
  { key: 'stat_engines',          value: '6',   label: 'Engineering Engines' },
  { key: 'stat_client_retention', value: '95%', label: 'Client Retention' },
];

const DEFAULT_TRUST_LOGOS = 'Fintech Corp,LegalSaaS,HealthTech,EdTech Co,Logistics Inc';

const DEFAULT_SHOW = 6;
const MAX_HOME_EVENTS = 3;

export default function Home() {
  const [showAllServices, setShowAllServices] = useState(false);

  /* ── Data fetching ─────────────────────────────────────────── */
  const { data: recentPosts = [] } = useQuery({
    queryKey: ['posts', 'home'],
    queryFn: async () => { const { data } = await posts.list({ limit: 3 }); return data || []; },
    staleTime: 5 * 60 * 1000,
  });

  const { data: recentWork = [] } = useQuery({
    queryKey: ['case-studies', 'home'],
    queryFn: async () => { const { data } = await caseStudies.list({ limit: 3 }); return data || []; },
    staleTime: 5 * 60 * 1000,
  });

  const { data: contentItems = [] } = useQuery({
    queryKey: ['site-content', 'home'],
    queryFn: async () => { const { data } = await siteContent.getAll(); return data || []; },
    staleTime: 2 * 60 * 1000,
  });

  const { data: eventsList = [] } = useQuery({
    queryKey: ['events', 'home'],
    queryFn: async () => { const { data } = await events.list({ activeOnly: true, limit: MAX_HOME_EVENTS }); return data || []; },
    staleTime: 5 * 60 * 1000,
  });

  /* ── Helpers for site content ─────────────────────────────── */
  const getContent = (key, fallback) => {
    const item = contentItems.find(c => c.key === key);
    return item?.value ?? fallback;
  };
  const isVisible = (key, defaultVal = true) => {
    const val = getContent(key, String(defaultVal));
    return val === 'true' || val === true;
  };

  /* ── Stats (from DB, with fallback) ──────────────────────── */
  const stats = DEFAULT_STATS.map(({ key, value, label }) => ({
    value: getContent(key, value),
    label,
  }));

  /* ── Service counts per engine ────────────────────────────── */
  const serviceCountByEngine = useMemo(() => {
    const m = {};
    ALL_SERVICES.forEach(s => { m[s.engineId] = (m[s.engineId] || 0) + 1; });
    return m;
  }, []);

  /* ── Services list ────────────────────────────────────────── */
  const dpdpaService    = ALL_SERVICES.find(s => s.slug === 'dpdpa-compliance');
  const otherServices   = ALL_SERVICES.filter(s => s.slug !== 'dpdpa-compliance');
  const allDisplaySvcs  = dpdpaService ? [dpdpaService, ...otherServices] : ALL_SERVICES;
  const visibleServices = showAllServices ? allDisplaySvcs : allDisplaySvcs.slice(0, DEFAULT_SHOW);

  /* ── Trust logos (admin-editable, comma-separated) ───────── */
  const trustLogosRaw = getContent('trust_logos', DEFAULT_TRUST_LOGOS);
  const trustLogos = trustLogosRaw.split(',').map(s => s.trim()).filter(Boolean);

  /* ── Visibility flags ─────────────────────────────────────── */
  const showTrust   = isVisible('show_trust_section');
  const showWork    = isVisible('show_work_section');
  const showInsights = isVisible('show_insights_section');
  const showEvents  = isVisible('show_events_section');

  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="bg-white pt-16 pb-20 md:pt-24 md:pb-28 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(to right, #2563EB 1px, transparent 1px), linear-gradient(to bottom, #2563EB 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="container relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-100 text-brand-700 rounded-full text-sm font-semibold mb-8">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              India's First Forward Deployed Engineering Company
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-surface-900 mb-6 leading-[1.05]">
              Engineers <span className="text-brand-600">embedded.</span>
              <br />
              Results <span className="text-brand-gold">owned.</span>
            </h1>

            <p className="text-xl text-surface-500 leading-relaxed mb-10 max-w-2xl">
              FormatiQs places Forward Deployed Engineers inside your organisation — not as consultants
              who deliver documents, but as builders accountable for shipping and operating real systems.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary-lg">
                Get Your FDE <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/what-is-fde" className="btn-secondary-lg">
                See How It Works
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-5">
              {['No retainers — outcome-based', 'Embedded, not remote', 'FDE stays until it ships'].map((pt) => (
                <div key={pt} className="flex items-center gap-2 text-sm text-surface-600">
                  <CheckCircle className="h-4 w-4 text-brand-500 flex-shrink-0" />
                  {pt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust logos (visibility-gated, admin-editable) ─── */}
      {showTrust && trustLogos.length > 0 && (
        <section className="py-10 bg-surface-50 border-b border-surface-200">
          <div className="container">
            <p className="text-center text-xs font-semibold text-surface-400 uppercase tracking-widest mb-6">
              Trusted by forward-thinking companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
              {trustLogos.map((name) => (
                <span key={name} className="text-sm font-semibold text-surface-300 tracking-wide">{name}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6 Engines ──────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-eyebrow">The FormatiQs Ecosystem</span>
            <h2 className="section-title mb-4">Six engines. One embedded team.</h2>
            <p className="section-desc max-w-2xl mx-auto">
              Every engagement runs through our engine model — a structured set of capabilities
              that FDEs activate based on what your organisation needs right now.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ORDERED_ENGINES.map((engine) => (
              <EngineCard
                key={engine.id}
                engine={engine}
                serviceCount={serviceCountByEngine[engine.id] || 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────── */}
      <section className="section bg-surface-50">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="section-eyebrow">{stats[1].value} Services</span>
              <h2 className="section-title-sm">What we actually build</h2>
              <p className="section-desc-sm mt-2 max-w-xl">
                Services across Build & Deploy, AI & Automation, and Managed Services — each delivered by an FDE embedded in your team.
              </p>
            </div>
            <Link to="/services" className="btn-secondary flex-shrink-0">
              All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleServices.map((service) => (
              <ServiceCard key={service.slug} service={service} variant={service.eyecatcher ? 'featured' : 'default'} />
            ))}
          </div>

          {!showAllServices && allDisplaySvcs.length > DEFAULT_SHOW && (
            <div className="text-center mt-8">
              <button onClick={() => setShowAllServices(true)} className="btn-outline">
                View {allDisplaySvcs.length - DEFAULT_SHOW} more services
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Why FDE ────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="section-eyebrow">Why FDE</span>
              <h2 className="section-title mb-5">
                Consultants deliver reports.
                <span className="text-brand-600"> FDEs ship systems.</span>
              </h2>
              <p className="section-desc mb-8">
                The difference is accountability. Your FDE is in your standup, your Slack, your production
                alerts — not writing a deck for the next check-in.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Zap,       title: 'Faster than hiring',          desc: 'Skip the 4-month hiring process. FDEs onboard in a week and ship in two.' },
                  { icon: Shield,    title: 'Deeper than consulting',       desc: 'Context built from day one. No documentation catch-up, no scope creep excuses.' },
                  { icon: Users,     title: 'Accountable for outcomes',     desc: 'Deliverables are systems, not slides. We stay until it works.' },
                  { icon: Building2, title: 'Knowledge transfer built in',  desc: 'FDEs document, train, and hand off. You own what gets built.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900">{title}</p>
                      <p className="text-sm text-surface-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/what-is-fde" className="btn-primary">
                  Understand FDE <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Comparison card */}
            <div className="card p-6 overflow-hidden">
              <h3 className="font-semibold text-surface-900 mb-5 text-center">
                FDE vs. the alternatives
              </h3>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[360px]">
                  <thead>
                    <tr className="bg-surface-50 border-b border-surface-200 rounded-xl">
                      <th className="text-left px-3 py-2.5 text-surface-600 font-medium text-xs">Capability</th>
                      <th className="px-2 py-2.5 text-surface-400 font-medium text-center text-xs">Consultant</th>
                      <th className="px-2 py-2.5 text-surface-400 font-medium text-center text-xs">Staff Aug</th>
                      <th className="px-2 py-2.5 text-brand-700 font-semibold text-center text-xs bg-brand-50/50">FDE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {[
                      ['Ships production code', false, true,  true],
                      ['Embedded in team',      false, false, true],
                      ['Owns outcomes',         false, false, true],
                      ['Transfers knowledge',   true,  false, true],
                      ['Available in 1 week',   false, true,  true],
                    ].map(([cap, c1, c2, c3]) => (
                      <tr key={cap} className="hover:bg-surface-50/50">
                        <td className="px-3 py-2.5 text-surface-700 text-xs">{cap}</td>
                        <td className="px-2 py-2.5 text-center text-xs">{c1 ? <span className="text-emerald-600">✓</span> : <span className="text-surface-300">—</span>}</td>
                        <td className="px-2 py-2.5 text-center text-xs">{c2 ? <span className="text-emerald-600">✓</span> : <span className="text-surface-300">—</span>}</td>
                        <td className="px-2 py-2.5 text-center text-xs font-bold text-brand-600 bg-brand-50/30">{c3 ? '✓' : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Awareness Events ───────────────────────────────── */}
      {showEvents && eventsList.length > 0 && (
        <section className="section bg-surface-50">
          <div className="container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="section-eyebrow">Awareness Events</span>
                <h2 className="section-title-sm">Webinars & live sessions</h2>
                <p className="section-desc-sm mt-2 max-w-lg">
                  Join our FDE practitioners and industry experts for practical, field-tested knowledge.
                </p>
              </div>
              <Link to="/events" className="btn-secondary hidden sm:flex">
                All Events <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {eventsList.map((event) => (
                <div key={event.id} className="group bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  {event.thumbnail_url ? (
                    <div className="relative h-40 overflow-hidden">
                      <img src={event.thumbnail_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      {event.event_type && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/70 text-white text-xs font-semibold rounded-full">
                            <Video className="h-3 w-3" />{event.event_type}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-40 bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
                      <Video className="h-10 w-10 text-white/30" />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-2.5">
                      <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                        {event.platform || 'Online'}
                      </span>
                    </div>
                    <h3 className="font-bold text-surface-900 text-sm mb-1.5 group-hover:text-brand-600 transition-colors leading-snug">
                      {event.title}
                    </h3>
                    {event.host_name && (
                      <p className="text-xs text-surface-500 mb-3 flex items-center gap-1">
                        <User className="h-3 w-3 flex-shrink-0" />
                        {event.host_name}{event.host_org ? ` · ${event.host_org}` : ''}
                      </p>
                    )}
                    {event.platform_url && (
                      <a href={event.platform_url} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center gap-1.5 w-full justify-center px-3 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors">
                        Register Now
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6 sm:hidden">
              <Link to="/events" className="btn-secondary">All Events</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Case studies ───────────────────────────────────── */}
      {showWork && recentWork.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="section-eyebrow">Client Work</span>
                <h2 className="section-title-sm">FDEs in action</h2>
              </div>
              <Link to="/work" className="btn-secondary hidden sm:flex">
                All Case Studies <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentWork.map((cs) => (
                <Link key={cs.id} to={`/work/${cs.slug}`} className="group block rounded-2xl bg-white border border-surface-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  {cs.cover_image_url ? (
                    <div className="h-40 overflow-hidden">
                      <img src={cs.cover_image_url} alt={cs.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="h-2 bg-brand-600" />
                  )}
                  <div className="p-5">
                    <span className="badge-blue mb-3 inline-block">{cs.client_industry}</span>
                    <h3 className="font-semibold text-surface-900 mb-2 group-hover:text-brand-600 transition-colors leading-snug">
                      {cs.title}
                    </h3>
                    <p className="text-sm text-surface-500 line-clamp-2 leading-relaxed mb-4">
                      {cs.challenge?.substring(0, 110)}…
                    </p>
                    <div className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                      Read case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6 sm:hidden">
              <Link to="/work" className="btn-secondary">All Case Studies</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Insights ───────────────────────────────────────── */}
      {showInsights && recentPosts.length > 0 && (
        <section className={`section ${showWork && recentWork.length > 0 ? 'bg-surface-50' : 'bg-white'}`}>
          <div className="container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="section-eyebrow">Insights Hub</span>
                <h2 className="section-title-sm">From the field, not the whiteboard</h2>
              </div>
              <Link to="/insights" className="btn-secondary hidden sm:flex">
                All Articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentPosts.map((post) => (
                <Link key={post.id} to={`/insights/${post.slug}`} className="group block rounded-2xl bg-white border border-surface-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  {post.cover_image_url ? (
                    <div className="h-36 overflow-hidden">
                      <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="h-1.5 bg-gradient-to-r from-brand-600 to-violet-600" />
                  )}
                  <div className="p-5">
                    {post.engine_tag && (
                      <span className="badge-blue mb-3 inline-block">Engine {post.engine_tag}</span>
                    )}
                    <h3 className="font-semibold text-surface-900 mb-2 group-hover:text-brand-600 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-surface-500 line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-surface-400">
                      <span className="font-medium text-surface-600">{post.author_name}</span>
                      <span>{formatDateShort(post.published_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6 sm:hidden">
              <Link to="/insights" className="btn-secondary">All Articles</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="section bg-brand-600">
        <div className="container text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 text-white text-xs font-semibold rounded-full tracking-wider uppercase mb-6">
            Ready to embed?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Start your FDE engagement
          </h2>
          <p className="text-lg text-brand-100 max-w-xl mx-auto mb-10">
            Tell us what you're building. We'll match you with the right FDE and engine within 48 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-gold-lg">
              Get FDE Now <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/what-is-fde" className="btn-xl bg-white/10 text-white border border-white/20 hover:bg-white/20">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
