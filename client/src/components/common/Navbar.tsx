import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Menu, X, User as UserIcon, ShieldCheck, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: language === 'HI' ? 'होम' : 'Home' },
    { href: '/schemes', label: language === 'HI' ? 'योजनाएं खोजें' : 'Explore Schemes' },
    { href: '/eligibility', label: language === 'HI' ? 'पात्रता जांचें' : 'Find My Scheme' },
    { href: '/campaigns', label: language === 'HI' ? 'अभियान' : 'Our Impact' },
    { href: '/donate', label: language === 'HI' ? 'सहयोग करें' : 'Donate' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8EAE5]">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xs">
              <span className="font-bold text-lg font-hindi">स</span>
            </div>
            <span className="font-title-md text-title-md text-primary tracking-tight font-bold">
              {language === 'HI' ? 'सखीसेतु' : 'SakhiSetu'}
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`transition-colors font-label-md text-label-md px-3 py-1.5 rounded-xl ${
                    active
                      ? 'bg-primary-container text-on-primary-container font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Lang Switcher + Auth + Donate CTA */}
        <div className="flex items-center gap-3 lg:gap-4">
          <LanguageSwitcher />

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md hover:opacity-90 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              ) : (
                <Link
                  to="/donor/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container-highest transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                title="Log out"
                className="p-2 text-on-surface-variant hover:text-error hover:bg-surface-container-low rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center font-label-md text-label-md text-on-surface px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors"
            >
              {language === 'HI' ? 'लॉग इन' : 'Log in'}
            </Link>
          )}

          <Link
            to="/donate"
            className="inline-flex items-center justify-center font-label-md text-label-md bg-secondary text-on-secondary px-4 py-2 rounded-xl hover:bg-[#B56C4A] shadow-[0_1px_3px_rgba(32,41,35,0.04)] transition-colors"
          >
            {language === 'HI' ? 'दान करें' : 'Donate Now'}
          </Link>

          {/* User Icon Circle */}
          {user && (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-on-surface hover:text-primary rounded-xl focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#E8EAE5] bg-[#FAF9F5] px-6 py-4 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl font-label-md text-label-md ${
                  isActive(link.href)
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8EAE5] flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between">
                <Link
                  to={isAdmin ? '/admin' : '/donor/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-label-md text-label-md text-primary font-semibold"
                >
                  {isAdmin ? 'Admin Console' : 'Donor Dashboard'}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="font-label-sm text-label-sm text-error"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 font-label-md text-label-md border border-outline-variant rounded-xl"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 font-label-md text-label-md bg-primary text-on-primary rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
