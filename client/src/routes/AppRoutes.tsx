import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { DonorLayout } from '../layouts/DonorLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { SchemesPage } from '../pages/public/SchemesPage';
import { SchemeDetailPage } from '../pages/public/SchemeDetailPage';
import { EligibilityPage } from '../pages/public/EligibilityPage';
import { CampaignsPage } from '../pages/public/CampaignsPage';

// Donation Flow Pages
import { DonatePage } from '../pages/donations/DonatePage';
import { DonationSuccessPage } from '../pages/donations/DonationSuccessPage';
import { DonationFailedPage } from '../pages/donations/DonationFailedPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Donor Portal
import { DonorDashboardPage } from '../pages/donor/DonorDashboardPage';

// Admin Portal
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminSchemesPage } from '../pages/admin/AdminSchemesPage';
import { AdminAIReviewsPage } from '../pages/admin/AdminAIReviewsPage';
import { AdminCampaignsPage } from '../pages/admin/AdminCampaignsPage';
import { AdminDonationsPage } from '../pages/admin/AdminDonationsPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';

const NotFoundPage: React.FC = () => (
  <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
    <h1 className="text-4xl font-extrabold text-[#174C3C]">404</h1>
    <h2 className="text-lg font-bold text-[#202923]">Page Not Found</h2>
    <p className="text-xs text-[#727B74]">
      The page you are looking for does not exist or has been moved.
    </p>
    <Link to="/" className="inline-block px-5 py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-btn shadow-soft">
      Return to Home
    </Link>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/schemes/:slug" element={<SchemeDetailPage />} />
        <Route path="/eligibility" element={<EligibilityPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />

        {/* Donation Flow */}
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/donate/:campaignSlug" element={<DonatePage />} />
        <Route path="/donate/success" element={<DonationSuccessPage />} />
        <Route path="/donate/failed" element={<DonationFailedPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 404 catch-all within public layout */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Donor Protected Routes */}
      <Route element={<DonorLayout />}>
        <Route path="/donor/dashboard" element={<DonorDashboardPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/schemes" element={<AdminSchemesPage />} />
        <Route path="/admin/ai-reviews" element={<AdminAIReviewsPage />} />
        <Route path="/admin/campaigns" element={<AdminCampaignsPage />} />
        <Route path="/admin/donations" element={<AdminDonationsPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
      </Route>
    </Routes>
  );
};

