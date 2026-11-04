import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Donation } from '../../types';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Download,
  FileText,
  Heart,
  ShieldCheck,
  Calendar,
  CreditCard,
  Building,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export const DonorDashboardPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getMyDonations();
        setDonations(data);
      } catch (err) {
        console.error('Failed to load donor history', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDownloadPdf = async (receiptId: string, receiptNumber: string) => {
    setDownloadingId(receiptId);
    try {
      const blob = await api.downloadReceiptPdfBlob(receiptId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SakhiSetu_80G_${receiptNumber.replace(/\//g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert('Failed to download receipt PDF: ' + err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const totalDonated = donations
    .filter((d) => d.status === 'SUCCESS')
    .reduce((sum, d) => sum + Number(d.amount), 0);

  const successfulDonationsCount = donations.filter((d) => d.status === 'SUCCESS').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-[#727B74] uppercase tracking-wider block">
            {language === 'HI' ? 'कुल दान योगदान' : 'Total Contributed'}
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#174C3C]">
            ₹{totalDonated.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-[#727B74]">All time across campaigns</span>
        </div>

        <div className="bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-[#727B74] uppercase tracking-wider block">
            {language === 'HI' ? 'सफल दान रसीदें' : 'Verified 80G Receipts'}
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#C77B59]">
            {successfulDonationsCount}
          </p>
          <span className="text-[10px] text-[#727B74]">Direct tax-deductible certificates</span>
        </div>

        <div className="bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-[#727B74] uppercase tracking-wider block">
            {language === 'HI' ? 'आयकर छूट स्थिति' : '80G Tax Exemption Status'}
          </span>
          <p className="text-lg font-bold text-emerald-800 flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Eligible for 50%</span>
          </p>
          <span className="text-[10px] text-[#727B74]">Form 10BD electronic registry</span>
        </div>
      </div>

      {/* Donation History Table */}
      <div className="bg-white rounded-card border border-[#E5E4DE] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E5E4DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#103A30]">
              {language === 'HI' ? 'आपका दान इतिहास एवं 80G रसीदें' : 'Donation History & 80G Certificates'}
            </h2>
            <p className="text-xs text-[#727B74] mt-0.5">
              Download your authenticated PDF tax certificates anytime.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={4} />
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Heart className="w-10 h-10 text-[#A8BDA8] mx-auto" />
            <h3 className="text-sm font-bold text-[#202923]">No Donations Recorded Yet</h3>
            <p className="text-xs text-[#727B74] max-w-sm mx-auto">
              You haven't made any contributions yet. Support rural women through our active campaigns.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E5E4DE] text-[11px] font-bold text-[#727B74] uppercase">
                  <th className="py-3.5 px-4">Receipt No.</th>
                  <th className="py-3.5 px-4">Campaign</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF9F5]">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#174C3C]">
                      {d.receipt?.receiptNumber || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#202923] max-w-[200px] truncate">
                      {d.campaign?.title || 'General Fund'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#202923]">
                      ₹{Number(d.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-[#727B74]">
                      {d.donationType === 'MONTHLY' ? 'Monthly' : 'One-Time'}
                    </td>
                    <td className="py-3.5 px-4 text-[#727B74]">
                      {new Date(d.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : d.status === 'FAILED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {d.receipt ? (
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(d.receipt!.id, d.receipt!.receiptNumber)}
                          disabled={downloadingId === d.receipt.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-btn bg-[#174C3C]/10 text-[#174C3C] hover:bg-[#174C3C] hover:text-white transition-all font-semibold text-[11px] disabled:opacity-50"
                        >
                          {downloadingId === d.receipt.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          <span>80G PDF</span>
                        </button>
                      ) : (
                        <span className="text-[#A8BDA8] text-[11px]">No receipt</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
