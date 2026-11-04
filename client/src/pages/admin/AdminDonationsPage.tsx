import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Heart,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Calendar,
  CreditCard,
  Loader2,
} from 'lucide-react';

export const AdminDonationsPage: React.FC = () => {
  const { language } = useLanguage();

  const [donations, setDonations] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminDonations({
        search: search.trim() || undefined,
        status: status || undefined,
        page,
        limit: 10,
      });
      setDonations(res.donations);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load donations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [status, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDonations();
  };

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
      alert('Failed to download receipt: ' + err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#103A30]">
            {language === 'HI' ? 'दान एवं 80G रसीद प्रबंधन' : 'Donations & 80G Receipts Registry'}
          </h1>
          <p className="text-xs text-[#727B74] mt-0.5">
            Audit-grade record of all incoming contributions, atomic sequence numbers, and donor PAN data.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-card border border-[#E5E4DE] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#727B74] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by donor name, email, PAN, receipt..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#727B74] font-medium">Status:</span>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 text-xs border border-[#E5E4DE] rounded-btn bg-[#FAF9F5]"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success Only</option>
            <option value="FAILED">Failed / Declined</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-card border border-[#E5E4DE] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#727B74]">No donation records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E5E4DE] text-[11px] font-bold text-[#727B74] uppercase">
                  <th className="py-3.5 px-4">Receipt Number</th>
                  <th className="py-3.5 px-4">Donor Name & Contact</th>
                  <th className="py-3.5 px-4">Masked PAN</th>
                  <th className="py-3.5 px-4">Campaign</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Mode</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF9F5]">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#174C3C]">
                      {d.receipt?.receiptNumber || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#202923]">{d.donorName}</div>
                      <div className="text-[10px] text-[#727B74]">{d.donorEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#727B74]">{d.donorPANMasked}</td>
                    <td className="py-3.5 px-4 text-[#727B74] max-w-[160px] truncate">
                      {d.campaign?.title || 'General Fund'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#202923]">
                      ₹{Number(d.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-[#727B74]">{d.paymentMethod || 'Online'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                          onClick={() => handleDownloadPdf(d.receipt.id, d.receipt.receiptNumber)}
                          disabled={downloadingId === d.receipt.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-btn bg-[#174C3C]/10 text-[#174C3C] hover:bg-[#174C3C] hover:text-white transition-all font-semibold text-[11px] disabled:opacity-50"
                        >
                          {downloadingId === d.receipt.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          <span>80G PDF</span>
                        </button>
                      ) : (
                        <span className="text-[#A8BDA8] text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-[#E5E4DE] flex items-center justify-between text-xs">
            <span className="text-[#727B74]">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-[#E5E4DE] rounded-btn disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 border border-[#E5E4DE] rounded-btn disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
