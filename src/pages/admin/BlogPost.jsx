import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import { posts } from '../lib/db';

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const { data, error } = await posts.getBySlug(slug);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full" />
    </div>
  );

  if (error || !post) return <Navigate to="/insights" replace />;

  const postBody = post.content || post.body || '';
  const readTime = Math.max(1, Math.round((postBody.replace(/<[^>]+>/g, '').split(/\s+/).length || 0) / 200));

  return (
    <main className="bg-white">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="border-b border-surface-200 pt-10 pb-12">
        <div className="container max-w-3xl">
          <Link to="/insights" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-brand-600 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Insights
          </Link>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="badge-blue">{tag}</span>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 leading-tight mb-5">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500">
            {post.author_name && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author_name}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {readTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container max-w-3xl">
          <div
            className="tiptap-content"
            dangerouslySetInnerHTML={{ __html: postBody }}
          />

          {/* Footer CTA */}
          <div className="mt-14 pt-10 border-t border-surface-200">
            <div className="card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-surface-900">Want FDE for your business?</p>
                <p className="text-sm text-surface-500">We embed engineers and own the results.</p>
              </div>
              <Link to="/contact" className="btn-primary flex-shrink-0">
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
