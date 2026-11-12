import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Zap } from 'lucide-react';
import { team } from '../lib/db';

const VALUES = [
  { icon: Target, title: 'Results owned', desc: 'We don\'t hand over slide decks. We stay embedded until outcomes are real and measurable.' },
  { icon: Zap, title: 'Speed without chaos', desc: 'Ship in weeks, not quarters. Structured sprints, clear ownership, no committee overhead.' },
  { icon: Users, title: 'Engineers in the room', desc: 'Our FDEs sit inside your team — Slack, standups, and all — bridging strategy and execution.' },
];

export default function About() {
  const { data: members = [], isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data } = await team.list();
      return data || [];
    },
  });

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-white pt-14 pb-16 border-b border-surface-200">
        <div className="container max-w-3xl text-center">
          <span className="section-eyebrow">About FormatiQs</span>
          <h1 className="section-title mt-2 mb-5">
            Built to close the gap between strategy and execution
          </h1>
          <p className="section-desc mx-auto">
            FormatiQs is a Forward Deployed Engineering firm. We don't consult from the outside — we embed inside your company and own the results alongside you.
          </p>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────── */}
      <section className="section bg-surface-50">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="section-eyebrow">Our mission</span>
              <h2 className="section-title-sm mt-2 mb-4">Business Optimization Mechanics</h2>
              <p className="text-surface-600 leading-relaxed mb-4">
                Most businesses know what they want to achieve. The gap is in the mechanics — the systems, automations, and engineering choices that determine whether a vision becomes a product or stays a deck.
              </p>
              <p className="text-surface-600 leading-relaxed">
                FormatiQs exists to close that gap. We bring engineers who understand business context and business leaders who can direct engineers. The result is velocity — real, measurable, owned.
              </p>
            </div>
            <div className="grid gap-4">
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card p-5 flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900 text-sm">{title}</p>
                    <p className="text-sm text-surface-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────── */}
      {(isLoading || members.length > 0) && (
        <section className="section bg-white">
          <div className="container">
            <div className="text-center mb-10">
              <span className="section-eyebrow">The team</span>
              <h2 className="section-title-sm mt-2">Engineers and operators, not advisors</h2>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="h-16 w-16 rounded-full bg-surface-200 mb-4" />
                    <div className="h-4 bg-surface-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-surface-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map(m => (
                  <div key={m.id} className="card p-6">
                    {m.avatar_url ? (
                      <img
                        src={m.avatar_url}
                        alt={m.name}
                        className="h-16 w-16 rounded-full object-cover mb-4 ring-2 ring-surface-100"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-bold mb-4">
                        {m.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <p className="font-semibold text-surface-900">{m.name}</p>
                    <p className="text-sm text-brand-600">{m.role}</p>
                    {m.bio && <p className="text-sm text-surface-500 mt-2 leading-relaxed">{m.bio}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="section bg-brand-600">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to close your execution gap?</h2>
          <p className="text-brand-100 mb-8">One discovery call. We scope an FDE engagement and you decide from there.</p>
          <Link to="/contact" className="btn-gold-lg">
            Start a conversation <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
