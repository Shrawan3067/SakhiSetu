import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { User, Receipt, Heart, ShieldCheck, Loader2 } from 'lucide-react';

export const DonorLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5]">
        <Loader2 className="w-8 h-8 animate-spin text-[#174C3C]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#202923]">
      <Navbar />

      {/* Donor Subheader */}
      <div className="bg-white border-b border-[#E5E4DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#174C3C]/10 text-[#174C3C] flex items-center justify-center font-bold text-lg">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#202923]">{user.fullName}</h1>
                <p className="text-xs text-[#727B74]">
                  {user.email} • {language === 'HI' ? 'पंजीकृत दाता खाता' : 'Registered Donor Account'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/donate"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-btn bg-[#C77B59] hover:bg-[#B06544] text-white text-xs font-semibold shadow-soft transition-colors"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>{language === 'HI' ? 'नया दान करें' : 'Make New Donation'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
