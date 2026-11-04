import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { Menu, X, LogOut } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const menuItems = [
    {
      href: '/admin',
      label: language === 'HI' ? 'डैशबोर्ड अवलोकन' : 'Overview',
      icon: 'grid_view',
      exact: true,
    },
    {
      href: '/admin/schemes',
      label: language === 'HI' ? 'योजनाएं CMS' : 'Schemes Directory',
      icon: 'account_balance',
    },
    {
      href: '/admin/ai-reviews',
      label: language === 'HI' ? 'AI सारांश समीक्षा' : 'AI Summary Review',
      icon: 'psychology_alt',
      badge: 'Review Desk',
    },
    {
      href: '/admin/campaigns',
      label: language === 'HI' ? 'अभियान' : 'Campaigns',
      icon: 'volunteer_activism',
    },
    {
      href: '/admin/donations',
      label: language === 'HI' ? 'दान और 80G' : 'Donations & 80G Filings',
      icon: 'receipt_long',
    },
    {
      href: '/admin/reports',
      label: language === 'HI' ? 'Form 10BD और ऑडिट' : 'Audit & Form 10BD',
      icon: 'assured_workload',
    },
  ];

  const isActive = (item: (typeof menuItems)[0]) => {
    if (item.exact) return location.pathname === item.href;
    return location.pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex-col justify-between border-r border-[#E8EAE5] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col">
          {/* Brand */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-[#E8EAE5]">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[22px]">diversity_1</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-primary tracking-tight font-bold">SakhiSetu</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Environment Status */}
          <div className="px-4 py-3">
            <div className="px-3 py-1.5 rounded-xl bg-surface-container-low flex items-center justify-between border border-[#E8EAE5]">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Environment</span>
              <span className="font-label-caps text-label-caps text-on-primary-fixed-variant bg-primary-fixed px-2 py-0.5 rounded font-semibold">
                Govt Sync Live
              </span>
            </div>
          </div>

          <div className="px-6 pt-3 pb-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold tracking-wider">
              Operations Management
            </span>
          </div>

          {/* Navigation */}
          <nav className="px-4 flex flex-col gap-1">
            {menuItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-label-md text-label-md transition-colors ${
                    active
                      ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-caps text-[10px] uppercase font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Portal Health & Logout */}
        <div className="p-4 border-t border-[#E8EAE5] space-y-3">
          <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-[#E8EAE5]">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                Portal Health
              </span>
              <span className="flex items-center gap-1 font-label-sm text-label-sm text-primary font-medium">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Online
              </span>
            </div>
            <span className="font-body-sm text-xs text-on-surface-variant">NIC &amp; MP Portal Synced</span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-on-surface-variant hover:text-error hover:bg-surface-container-low font-label-sm text-label-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Top Header Bar for Desktop */}
      <div className="lg:pl-72">
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-surface/90 backdrop-blur-xl border-b border-[#E8EAE5] z-40 px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 text-on-surface rounded-xl hover:bg-surface-container"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider bg-surface-container-high px-3 py-1 rounded-full font-semibold">
              Govt &amp; Field Operations Portal
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-on-surface-variant font-body-sm text-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">cloud_done</span>
              <span>NIC Data Sync Active</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <div className="h-7 w-[1px] bg-surface-container-high"></div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-title-md text-[14px] text-on-surface font-semibold leading-tight">
                  {user.fullName}
                </span>
                <span className="font-label-sm text-xs text-on-surface-variant">Lead Operations Director</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="w-full pt-20 p-6 lg:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)}></div>
          <div className="relative w-72 bg-surface-container-lowest h-full shadow-2xl flex flex-col justify-between p-4 z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8EAE5]">
                <span className="font-title-md text-primary font-bold">SakhiSetu Admin</span>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X className="w-6 h-6 text-on-surface" />
                </button>
              </div>
              <nav className="pt-4 flex flex-col gap-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-label-md text-label-md text-on-surface hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <button
              onClick={() => {
                logout();
                setMobileSidebarOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
