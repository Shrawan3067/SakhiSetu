import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Layers,
  HeartHandshake,
  BarChart3,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5]">
        <Loader2 className="w-8 h-8 animate-spin text-[#174C3C]" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const menuItems = [
    {
      href: '/admin',
      label: language === 'HI' ? 'डैशबोर्ड अवलोकन' : 'Dashboard Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/admin/schemes',
      label: language === 'HI' ? 'योजनाएं CMS' : 'Schemes CMS',
      icon: FileText,
    },
    {
      href: '/admin/ai-reviews',
      label: language === 'HI' ? 'AI सारांश समीक्षा' : 'AI Summary Review',
      icon: Sparkles,
      badge: 'Review Desk',
    },
    {
      href: '/admin/campaigns',
      label: language === 'HI' ? 'अभियान प्रबंधन' : 'Campaigns',
      icon: Layers,
    },
    {
      href: '/admin/donations',
      label: language === 'HI' ? 'दान रिकॉर्ड' : 'Donations & Receipts',
      icon: HeartHandshake,
    },
    {
      href: '/admin/reports',
      label: language === 'HI' ? 'रिपोर्ट्स एवं Form 10BD' : 'Reports & Form 10BD',
      icon: BarChart3,
    },
  ];

  const isActive = (item: (typeof menuItems)[0]) => {
    if (item.exact) return location.pathname === item.href;
    return location.pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen flex bg-[#FAF9F5] text-[#202923]">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#103A30] text-white shrink-0 border-r border-[#174C3C]">
        <div className="p-6 border-b border-[#174C3C] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C77B59] flex items-center justify-center font-bold text-white text-base font-hindi">
              स
            </div>
            <div>
              <span className="font-bold text-lg text-white">सखीसेतु</span>
              <span className="text-[10px] text-[#A8BDA8] block">Admin Portal</span>
            </div>
          </Link>
        </div>

        <div className="p-4 flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#174C3C] text-white shadow-xs'
                    : 'text-[#A8BDA8] hover:bg-[#174C3C]/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#C77B59]' : 'text-[#A8BDA8]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] bg-[#C77B59] text-white px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#174C3C] space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-[#A8BDA8] hover:text-white px-3 py-2 rounded-lg hover:bg-[#174C3C]/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'पब्लिक वेबसाइट देखें' : 'View Public Site'}</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2.5 text-xs text-red-300 hover:text-red-200 hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'लॉग आउट' : 'Log Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#E5E4DE] h-16 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-[#727B74] hover:bg-[#FAF9F5]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-xs text-[#727B74]">
              <span>Admin</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold text-[#202923]">Company A • SakhiSetu</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-right">
              <div>
                <p className="text-xs font-bold text-[#202923]">{user.fullName}</p>
                <p className="text-[10px] text-[#727B74]">System Administrator</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#174C3C] text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Modal */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#103A30] text-white p-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#174C3C]">
                <span className="font-bold text-lg text-white">सखीसेतु Admin</span>
                <button onClick={() => setSidebarOpen(false)} className="text-[#A8BDA8]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 py-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-[#A8BDA8] hover:bg-[#174C3C] hover:text-white"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
