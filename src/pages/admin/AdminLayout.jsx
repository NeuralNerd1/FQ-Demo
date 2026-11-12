import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, MessageSquare, FileText, Briefcase, Users,
  Settings, LogOut, Menu, X, Eye, Link as LinkIcon,
} from 'lucide-react';
import { auth } from '../../lib/db';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { to: '/admin/blog', icon: FileText, label: 'Blog' },
  { to: '/admin/work', icon: Briefcase, label: 'Case Studies' },
  { to: '/admin/team', icon: Users, label: 'Team' },
  { to: '/admin/visibility', icon: Eye, label: 'Visibility' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-surface-100">
        <img src="/logo.png" alt="FormatiQs" className="h-8 w-auto" />
      </div>
      <nav className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="p-4 border-t border-surface-100">
        <button onClick={handleSignOut} className="admin-nav-link w-full text-red-600 hover:bg-red-50 hover:text-red-700">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-surface-200 fixed inset-y-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-56 bg-white border-r border-surface-200 flex flex-col z-50">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-56 flex flex-col">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-surface-200">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-surface-100">
            <Menu className="h-5 w-5 text-surface-600" />
          </button>
          <img src="/logo.png" alt="FormatiQs" className="h-7 w-auto" />
        </div>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
