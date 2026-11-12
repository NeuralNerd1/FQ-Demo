import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MessageSquare, FileText, Briefcase, Users, ArrowRight } from 'lucide-react';
import { dashboard } from '../../lib/db';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await dashboard.getStats();
      return data;
    },
  });

  const TILES = [
    { label: 'Open inquiries', value: stats?.openInquiries ?? '—', icon: MessageSquare, color: 'text-blue-600 bg-blue-50', to: '/admin/inquiries' },
    { label: 'Published posts', value: stats?.publishedPosts ?? '—', icon: FileText, color: 'text-purple-600 bg-purple-50', to: '/admin/blog' },
    { label: 'Case studies', value: stats?.caseStudies ?? '—', icon: Briefcase, color: 'text-amber-600 bg-amber-50', to: '/admin/work' },
    { label: 'Team members', value: stats?.teamMembers ?? '—', icon: Users, color: 'text-green-600 bg-green-50', to: '/admin/team' },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-surface-900">Dashboard</h1>
        <p className="text-sm text-surface-500 mt-0.5">Overview of your FormatiQs content</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {TILES.map(({ label, value, icon: Icon, color, to }) => (
          <Link key={label} to={to} className="card p-5 hover:shadow-card-md transition-shadow group">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-surface-900">{isLoading ? '…' : value}</p>
            <p className="text-xs text-surface-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'New inquiry', to: '/admin/inquiries', desc: 'Review unread submissions' },
          { label: 'Write a post', to: '/admin/blog/new', desc: 'Create new Insights content' },
          { label: 'Manage visibility', to: '/admin/visibility', desc: 'Control what\'s shown on site' },
        ].map(({ label, to, desc }) => (
          <Link key={to} to={to} className="card p-5 flex items-center justify-between hover:shadow-card-md transition-shadow group">
            <div>
              <p className="font-medium text-surface-900 text-sm">{label}</p>
              <p className="text-xs text-surface-500 mt-0.5">{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-surface-400 group-hover:text-brand-600 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
