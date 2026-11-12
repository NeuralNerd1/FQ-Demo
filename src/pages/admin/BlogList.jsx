import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { posts } from '../../lib/db';

export default function BlogList() {
  const qc = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data } = await posts.list({ includeUnpublished: true });
      return data || [];
    },
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, is_published }) => posts.update(id, { is_published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-posts'] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => posts.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-posts'] }),
  });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Blog</h1>
          <p className="text-sm text-surface-500 mt-0.5">{items.length} posts total</p>
        </div>
        <Link to="/admin/blog/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse h-16" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-surface-400 mb-4">No posts yet.</p>
          <Link to="/admin/blog/new" className="btn-primary">Write your first post</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(post => (
            <div key={post.id} className="card p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-surface-900 text-sm truncate">{post.title}</p>
                  {post.is_published ? (
                    <span className="badge-blue flex-shrink-0">Published</span>
                  ) : (
                    <span className="badge-gray flex-shrink-0">Draft</span>
                  )}
                </div>
                <p className="text-xs text-surface-400">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Not published'}
                </p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleMut.mutate({ id: post.id, is_published: !post.is_published })}
                  className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition-colors"
                  title={post.is_published ? 'Unpublish' : 'Publish'}
                >
                  {post.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <Link
                  to={`/admin/blog/${post.id}`}
                  className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-brand-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Delete this post?')) deleteMut.mutate(post.id);
                  }}
                  className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
