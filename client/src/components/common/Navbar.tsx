import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Heart, Menu, X, User as UserIcon, ShieldCheck, LogOut, FileText, CheckCircle2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, isDonor, logout } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/schemes', label: t('nav.schemes') },
    { href: '/eligibility', label: t('nav.eligibility') },
    { href: '/campaigns', label: t('nav.campaigns') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E4DE] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#174C3C] to-[#103A30] flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
              <span className="font-bold text-lg tracking-wider font-hindi">स</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#174C3C]">
                  {language === 'HI' ? 'सखीसेतु' : 'SakhiSetu'}
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#C77B59]"></span>
              </div>
              <p className="text-[10px] text-[#727B74] font-medium hidden sm:block">
                {language === 'HI' ? 'महिला सशक्तिकरण ट्रस्ट • भोपाल' : 'Women Welfare Trust • Bhopal'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-[#174C3C] border-b-2 border-[#174C3C] pb-0.5'
                    : 'text-[#202923] hover:text-[#174C3C]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />

            <Link
              to="/donate"
              className="inline-flex items-center gap-2 bg-[#C77B59] hover:bg-[#B06544] text-white px-4 py-2 rounded-btn text-sm font-semibold shadow-soft hover:shadow-elevated transition-all duration-200"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{t('nav.donate')}</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2 border-l border-[#E5E4DE] pl-4">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#103A30] transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t('nav.adminDashboard')}</span>
                  </Link>
                ) : (
                  <Link
                    to="/donor/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-[#A8BDA8]/25 text-[#103A30] text-xs font-semibold hover:bg-[#A8BDA8]/40 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>{t('nav.dashboard')}</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  title="Log out"
                  className="p-1.5 text-[#727B74] hover:text-[#C77B59] hover:bg-[#FAF9F5] rounded-btn transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-[#E5E4DE] pl-4">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-[#174C3C] hover:text-[#103A30] px-3 py-1.5 rounded-btn hover:bg-[#FAF9F5] transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold border border-[#174C3C] text-[#174C3C] hover:bg-[#174C3C] hover:text-white px-3 py-1.5 rounded-btn transition-all duration-200"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#202923] hover:text-[#174C3C] rounded-lg focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E4DE] bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                  isActive(link.href) ? 'bg-[#174C3C]/10 text-[#174C3C]' : 'text-[#202923]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E5E4DE] space-y-2">
            <Link
              to="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#C77B59] text-white py-2.5 rounded-btn text-sm font-semibold"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{t('nav.donate')}</span>
            </Link>

            {user ? (
              <div className="space-y-1">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-[#174C3C] text-white py-2 rounded-btn text-sm font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('nav.adminDashboard')}</span>
                  </Link>
                ) : (
                  <Link
                    to="/donor/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-[#A8BDA8]/25 text-[#103A30] py-2 rounded-btn text-sm font-semibold"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{t('nav.dashboard')}</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs text-[#727B74] font-medium"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-semibold border border-[#174C3C] text-[#174C3C] rounded-btn"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-semibold bg-[#174C3C] text-white rounded-btn"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
