import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Clock } from 'lucide-react';
import { ORDERED_ENGINES } from '../data/engines';
import { cn } from '../lib/utils';

const NavLinkItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn('text-sm font-medium transition-colors duration-150',
        isActive
          ? 'text-brand-600'
          : 'text-surface-600 hover:text-surface-900')
    }
  >
    {children}
  </NavLink>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [enginesOpen, setEnginesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setEnginesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setEnginesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeEngines  = ORDERED_ENGINES.filter((e) => !e.comingSoon);
  const comingSoonEngines = ORDERED_ENGINES.filter((e) => e.comingSoon);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-200',
        scrolled ? 'shadow-card border-b border-surface-200' : 'border-b border-surface-100'
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/logo.png" alt="FormatiQs" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLinkItem to="/what-is-fde">What is FDE?</NavLinkItem>
            <NavLinkItem to="/services">Services</NavLinkItem>

            {/* Engines dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setEnginesOpen((o) => !o)}
                className={cn(
                  'flex items-center gap-1 text-sm font-medium transition-colors duration-150',
                  enginesOpen ? 'text-brand-600' : 'text-surface-600 hover:text-surface-900'
                )}
              >
                Engines
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', enginesOpen && 'rotate-180')} />
              </button>

              {enginesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-white rounded-2xl shadow-card-lg border border-surface-200 p-4 animate-fade-in">
                  {/* Active engines */}
                  <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Active Engines</p>
                  <div className="space-y-1 mb-4">
                    {activeEngines.map((engine) => {
                      const Icon = engine.icon;
                      return (
                        <Link
                          key={engine.id}
                          to={engine.path}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 group transition-colors"
                        >
                          <span
                            className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${engine.hexColor}18`, color: engine.hexColor }}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 transition-colors">
                              {engine.name}
                            </p>
                            <p className="text-xs text-surface-500 truncate">{engine.tagline}</p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-surface-300 group-hover:text-brand-500 flex-shrink-0 transition-colors" />
                        </Link>
                      );
                    })}
                  </div>

                  {/* Coming soon */}
                  <div className="border-t border-surface-100 pt-3">
                    <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Coming Soon</p>
                    <div className="space-y-1">
                      {comingSoonEngines.map((engine) => {
                        const Icon = engine.icon;
                        return (
                          <div
                            key={engine.id}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl opacity-60"
                          >
                            <span
                              className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${engine.hexColor}12`, color: engine.hexColor }}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-surface-600">{engine.name}</p>
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-surface-100 text-surface-500 rounded-full">
                                  <Clock className="h-2.5 w-2.5" /> Soon
                                </span>
                              </div>
                              <p className="text-xs text-surface-400 truncate">{engine.tagline}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <NavLinkItem to="/work">Work</NavLinkItem>
            <NavLinkItem to="/insights">Insights</NavLinkItem>
            <NavLinkItem to="/about">About</NavLinkItem>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/contact" className="btn-primary">
              Get FDE
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100 transition-colors"
            onClick={() => setIsOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-surface-200 bg-white animate-slide-up">
          <div className="container py-4 space-y-1">
            <MobileNavItem to="/what-is-fde">What is FDE?</MobileNavItem>
            <MobileNavItem to="/services">Services</MobileNavItem>

            {/* Mobile engines section */}
            <div className="pt-2 pb-1">
              <p className="px-3 text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Engines</p>
              {activeEngines.map((e) => (
                <MobileNavItem key={e.id} to={e.path} accent={e.hexColor}>{e.name}</MobileNavItem>
              ))}
              {comingSoonEngines.map((e) => (
                <div key={e.id} className="flex items-center gap-2 px-3 py-2.5 opacity-50">
                  <span className="text-sm font-medium text-surface-600">{e.name}</span>
                  <span className="text-xs bg-surface-100 text-surface-500 px-1.5 py-0.5 rounded-full">Soon</span>
                </div>
              ))}
            </div>

            <MobileNavItem to="/work">Work</MobileNavItem>
            <MobileNavItem to="/insights">Insights</MobileNavItem>
            <MobileNavItem to="/about">About</MobileNavItem>

            <div className="pt-3 pb-1">
              <Link to="/contact" className="btn-primary w-full justify-center">
                Get FDE
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileNavItem({ to, children, accent }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn('flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
          isActive
            ? 'bg-brand-50 text-brand-700'
            : 'text-surface-700 hover:bg-surface-50 hover:text-surface-900')
      }
    >
      {accent && (
        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
      )}
      {children}
    </NavLink>
  );
}
