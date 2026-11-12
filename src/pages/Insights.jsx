import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, Clock } from 'lucide-react';
import { posts, newsletter } from '../lib/db';
import { SERVICE_ENGINES } from '../data/engines';
import { formatDateShort, readingTime, cn } from '../lib/utils';

export default function Insights() {
  const [search, setSearch]   = useState('');
  const [engine, setEngine]   = useState(null);
  const [email, setEmail]     = useState('');
  const [subDone, setSubDone] = useState(false);

  const { data: allPosts = [], isLoading } = useQuery({
    queryKey: ['posts', 'all'],
    queryFn: async () => { const { data } = await posts.list({ limit: 100 }); return data || []; },
    staleTime: 5 * 60 * 1000,
  });

  // Client-side filter
  const filtered = allPosts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
                        (p.excerpt || '').toLowerCase().includes(search.toLowerCase());
    const matchEngine = engine === null || p.engine_tag === engine;
    return matchSearch && matchEngine;
  });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    await newsletter.subscribe(email);
    setSubDone(true);
  };

  return (
    <main>
      {/* ── Page header ──────────────────────────────────── */}
      <section className="bg-white pt-14 pb-10 border-b border-surface-200">
        <div className="container">
          <span className="section-eyebrow">Insights Hub</span>
          <h1 className="section-title mt-2 mb-3">
            FDE perspectives on AI, compliance, and software delivery
          </h1>
          <p className="section-desc max-w-2xl">
            Practical articles written from the field — by engineers who build in production environments every day.
          </p>
        </div>
      </section>

      {/* ── Sticky search + filter bar ───────────────────── */}
      <div className="sticky top-16 z-30 bg-white border-b border-surface-200 shadow-card">
        <div className="container py-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-surface-200 bg-surface-50 rounded-lg text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setEngine(null)}
                className={cn('filter-chip', engine === null && 'filter-chip-active')}
              >
                All
              </button>
              {SERVICE_ENGINES.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setEngine(engine === e.id ? null : e.id)}
                  className={cn(
                    'filter-chip',
                    engine === e.id && 'filter-chip-active'
                  )}
                >
                  {e.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Article grid ─────────────────────────────────── */}
      <section className="section bg-surface-50">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="h-40 bg-surface-200" />
                  <div className="p-6">
                    <div className="h-4 bg-surface-200 rounded w-20 mb-4" />
                    <div className="h-5 bg-surface-200 rounded w-full mb-2" />
                    <div className="h-5 bg-surface-200 rounded w-3/4 mb-4" />
                    <div className="h-3 bg-surface-100 rounded w-full mb-2" />
                    <div className="h-3 bg-surface-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-surface-300 text-5xl mb-4">📭</div>
              <h3 className="font-semibold text-surface-700 mb-2">No articles found</h3>
              <p className="text-surface-500 text-sm">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Featured first post */}
              {filtered[0] && (
                <Link
                  to={`/insights/${filtered[0].slug}`}
                  className="card-hover group block overflow-hidden sm:col-span-2 lg:col-span-1"
                >
                  <ArticleCard post={filtered[0]} featured />
                </Link>
              )}
              {/* Rest */}
              {filtered.slice(1).map((post) => (
                <Link
                  key={post.id}
                  to={`/insights/${post.slug}`}
                  className="card-hover group block overflow-hidden"
                >
                  <ArticleCard post={post} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────── */}
      <section className="section bg-brand-600">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Get insights in your inbox</h2>
          <p className="text-brand-100 mb-8">
            One digest per month — practical, field-tested perspectives from FormatiQs FDEs.
          </p>
          {subDone ? (
            <div className="bg-white/10 text-white rounded-2xl px-6 py-5 font-medium">
              ✓ You're subscribed. Expect the next digest soon.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              />
              <button type="submit" className="btn-gold flex-shrink-0 py-3 px-5">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function ArticleCard({ post, featured }) {
  const [imgError, setImgError] = useState(false);
  const showImage = post.cover_image_url && !imgError;

  return (
    <>
      {/* Cover image or gradient stripe */}
      {showImage ? (
        <div className={cn('overflow-hidden', featured ? 'h-52' : 'h-40')}>
          <img
            src={post.cover_image_url}
            alt={post.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className={cn(
          'w-full bg-gradient-to-r from-brand-500 to-brand-700',
          featured ? 'h-3' : 'h-2'
        )} />
      )}

      <div className="p-6">
        {post.engine_tag && (
          <span className="badge-blue mb-3 inline-block">Engine {post.engine_tag}</span>
        )}
        <h2 className={cn(
          'font-semibold text-surface-900 mb-2 group-hover:text-brand-600 transition-colors leading-snug',
          featured ? 'text-xl' : 'text-base'
        )}>
          {post.title}
        </h2>
        <p className="text-sm text-surface-500 leading-relaxed mb-5 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-surface-400 pt-3 border-t border-surface-100">
          <span className="font-medium text-surface-600">{post.author_name}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime(post.content || '')} min
            </span>
            <span>{formatDateShort(post.published_at)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
