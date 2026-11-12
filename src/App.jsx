import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

import Home from '@/pages/Home';
import WhatIsFde from '@/pages/WhatIsFde';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import EngineHub from '@/pages/EngineHub';
import Academy from '@/pages/Academy';
import Talent from '@/pages/Talent';
import Work from '@/pages/Work';
import WorkDetail from '@/pages/WorkDetail';
import Insights from '@/pages/Insights';
import BlogPost from '@/pages/BlogPost';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Events from '@/pages/Events';
import NotFound from '@/pages/NotFound';

import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/pages/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import InquiriesAdmin from '@/pages/admin/InquiriesAdmin';
import BlogList from '@/pages/admin/BlogList';
import BlogEditor from '@/pages/admin/BlogEditor';
import WorkAdmin from '@/pages/admin/WorkAdmin';
import TeamAdmin from '@/pages/admin/TeamAdmin';
import SettingsAdmin from '@/pages/admin/SettingsAdmin';
import VisibilityAdmin from '@/pages/admin/VisibilityAdmin';
import EventsAdmin from '@/pages/admin/EventsAdmin';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/what-is-fde" element={<PublicLayout><WhatIsFde /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/services/:slug" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
        <Route path="/engine/:slug" element={<PublicLayout><EngineHub /></PublicLayout>} />
        <Route path="/academy" element={<PublicLayout><Academy /></PublicLayout>} />
        <Route path="/talent" element={<PublicLayout><Talent /></PublicLayout>} />
        <Route path="/work" element={<PublicLayout><Work /></PublicLayout>} />
        <Route path="/work/:slug" element={<PublicLayout><WorkDetail /></PublicLayout>} />
        <Route path="/insights" element={<PublicLayout><Insights /></PublicLayout>} />
        <Route path="/insights/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="inquiries" element={<InquiriesAdmin />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/new" element={<BlogEditor />} />
          <Route path="blog/:id" element={<BlogEditor />} />
          <Route path="work" element={<WorkAdmin />} />
          <Route path="team" element={<TeamAdmin />} />
          <Route path="visibility" element={<VisibilityAdmin />} />
          <Route path="events" element={<EventsAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>

        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
