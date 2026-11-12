import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        <p className="text-7xl font-extrabold text-brand-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-surface-900 mb-3">Page not found</h1>
        <p className="text-surface-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </div>
  );
}
