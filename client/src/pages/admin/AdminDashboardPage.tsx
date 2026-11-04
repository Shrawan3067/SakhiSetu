import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Heart,
  Users,
  Layers,
  Sparkles,
  FileText,
  Download,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { language } = useLanguage();
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getAdminDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#174C3C]" />
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#103A30]">
            {language === 'HI' ? 'ट्रस्ट प्रशासनिक डैशबोर्ड' : 'Trust Executive Dashboard'}
          </h1>
          <p className="text-xs text-[#727B74] mt-0.5">
            Operational and donation analytics across 9 districts (FY {metrics.financialYear || '2026-27'}).
          </p>
        </div>

        <div className="flex gap-2">
          {metrics.pendingAiReviewsCount > 0 && (
            <Link
              to="/admin/ai-reviews"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-[#C77B59] text-white text-xs font-bold hover:bg-[#B06544] transition-colors shadow-soft"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{metrics.pendingAiReviewsCount} AI Reviews Pending</span>
            </Link>
          )}

          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-white border border-[#E5E4DE] text-xs font-semibold text-[#202923] hover:bg-[#FAF9F5] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#174C3C]" />
            <span>Form 10BD Export</span>
          </Link>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-card border border-[#E5E4DE] p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#727B74]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Amount Raised</span>
            <div className="w-8 h-8 rounded-lg bg-[#174C3C]/10 text-[#174C3C] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#174C3C]">
            ₹{(metrics.totalAmountCollected || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-[#727B74]">Verified domestic 80G donations</span>
        </div>

        <div className="bg-white rounded-card border border-[#E5E4DE] p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#727B74]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Donations</span>
            <div className="w-8 h-8 rounded-lg bg-[#C77B59]/10 text-[#C77B59] flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#202923]">
            {(metrics.totalDonationsCount || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-[#727B74]">Atomic receipt sequences allocated</span>
        </div>

        <div className="bg-white rounded-card border border-[#E5E4DE] p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#727B74]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Campaigns</span>
            <div className="w-8 h-8 rounded-lg bg-[#103A30]/10 text-[#103A30] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#202923]">
            {metrics.activeCampaignsCount || 0}
          </p>
          <span className="text-[10px] text-[#727B74]">Grassroots livelihood & health</span>
        </div>

        <div className="bg-white rounded-card border border-[#E5E4DE] p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#727B74]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Registered Donors</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#202923]">
            {metrics.registeredDonorsCount || 0}
          </p>
          <span className="text-[10px] text-[#727B74]">With authenticated accounts</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#103A30]">Monthly Contribution Trends (INR)</h3>
            <span className="text-[10px] text-[#727B74] font-medium">Last 6 Months</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.donationTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#727B74' }} />
                <YAxis tick={{ fontSize: 11, fill: '#727B74' }} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#103A30', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="amount" fill="#174C3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Progress (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#103A30]">Campaign Progress</h3>
            <Link to="/admin/campaigns" className="text-[11px] font-bold text-[#174C3C] hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-4 pt-1">
            {data?.campaignPerformance?.map((c: any, i: number) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#202923]">{c.title}</span>
                  <span className="font-bold text-[#174C3C]">{c.percent}%</span>
                </div>
                <div className="w-full bg-[#E5E4DE] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#174C3C] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${c.percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-[#727B74]">
                  <span>₹{c.collected.toLocaleString('en-IN')} raised</span>
                  <span>Goal: ₹{c.goal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="bg-white rounded-card border border-[#E5E4DE] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E5E4DE] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#103A30]">Recent Confirmed Donations</h3>
            <p className="text-[11px] text-[#727B74]">Live transaction audit records</p>
          </div>
          <Link
            to="/admin/donations"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#174C3C] hover:underline"
          >
            <span>View All Donations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E5E4DE] text-[11px] font-bold text-[#727B74] uppercase">
                <th className="py-3 px-4">Receipt Number</th>
                <th className="py-3 px-4">Donor Name</th>
                <th className="py-3 px-4">Masked PAN</th>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF9F5]">
              {data?.recentDonations?.map((d: any) => (
                <tr key={d.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-[#174C3C]">
                    {d.receiptNumber || '—'}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#202923]">{d.donorName}</td>
                  <td className="py-3 px-4 font-mono text-[#727B74]">{d.donorPANMasked}</td>
                  <td className="py-3 px-4 text-[#727B74] max-w-[200px] truncate">{d.campaignTitle}</td>
                  <td className="py-3 px-4 font-bold text-[#174C3C]">
                    ₹{Number(d.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-[#727B74]">
                    {new Date(d.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
