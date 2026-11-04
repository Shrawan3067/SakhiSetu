import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Download,
  FileSpreadsheet,
  Building,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Layers,
  Loader2,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { language } = useLanguage();

  const [form10bdRecords, setForm10bdRecords] = useState<any[]>([]);
  const [financialYear, setFinancialYear] = useState('2026-27');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const data = await api.getForm10BDReport(financialYear);
        setForm10bdRecords(data);
      } catch (err) {
        console.error('Failed to load Form 10BD report', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [financialYear]);

  const handleExportCsv = () => {
    const url = api.getForm10BDCsvUrl(financialYear);
    window.open(url, '_blank');
  };

  const totalAmount = form10bdRecords.reduce((sum, r) => sum + Number(r.donationAmount), 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174C3C] bg-[#174C3C]/10 px-2.5 py-0.5 rounded-sm mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>Statutory NGO Return Filing Suite</span>
          </div>
          <h1 className="text-2xl font-bold text-[#103A30]">
            {language === 'HI' ? 'फॉर्म 10BD अनुपालन एवं रिपोर्ट' : 'Form 10BD Electronic Filing Report'}
          </h1>
          <p className="text-xs text-[#727B74] mt-0.5">
            Compiled statement of donations for electronic submission to the Income Tax Department under Rule 18AB.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            className="px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn bg-white font-semibold"
          >
            <option value="2026-27">FY 2026-27 (Current)</option>
            <option value="2025-26">FY 2025-26</option>
          </select>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#174C3C] hover:bg-[#103A30] text-white text-xs font-bold rounded-btn transition-colors shadow-soft"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Form 10BD (CSV)</span>
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#174C3C]/10 text-[#174C3C] flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#202923]">Form 10BD Annual Donor Statement</h3>
            <p className="text-xs text-[#727B74]">
              Trust 80G Reg: CIT(E)/BPL/80G/2021-22/A-1089 • Trust PAN: AAATC1234D
            </p>
          </div>
        </div>

        <div className="flex gap-6 sm:text-right">
          <div>
            <span className="text-[10px] text-[#727B74] font-semibold uppercase block">Total Filings</span>
            <span className="text-xl font-bold text-[#202923]">{form10bdRecords.length} Donors</span>
          </div>
          <div>
            <span className="text-[10px] text-[#727B74] font-semibold uppercase block">Aggregate Value</span>
            <span className="text-xl font-bold text-[#174C3C]">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Form 10BD Table */}
      <div className="bg-white rounded-card border border-[#E5E4DE] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#FAF9F5] border-b border-[#E5E4DE] flex items-center justify-between">
          <span className="text-xs font-bold text-[#103A30]">
            Electronic Form 10BD Data Grid (Indian Income Tax Format)
          </span>
          <span className="text-[10px] text-[#727B74]">Includes verified PAN & address records</span>
        </div>

        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : form10bdRecords.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#727B74]">
            No records for financial year {financialYear}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-white border-b border-[#E5E4DE] text-[10px] font-bold text-[#727B74] uppercase">
                  <th className="py-3 px-3">S.No</th>
                  <th className="py-3 px-3">Receipt / Ack No</th>
                  <th className="py-3 px-3">Donor Legal Name</th>
                  <th className="py-3 px-3">Donor PAN</th>
                  <th className="py-3 px-3">Postal Address</th>
                  <th className="py-3 px-3">Amount (INR)</th>
                  <th className="py-3 px-3">Mode</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF9F5]">
                {form10bdRecords.map((r) => (
                  <tr key={r.serialNo} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#727B74]">{r.serialNo}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#174C3C]">
                      {r.acknowledgementNo}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#202923]">{r.donorName}</td>
                    <td className="py-3 px-3 font-mono text-[#202923]">{r.donorPAN}</td>
                    <td className="py-3 px-3 text-[#727B74] max-w-[220px] truncate" title={r.donorAddress}>
                      {r.donorAddress}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#174C3C]">
                      ₹{r.donationAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-[#727B74]">{r.modeOfDonation}</td>
                    <td className="py-3 px-3 text-[#727B74]">
                      {new Date(r.dateOfDonation).toLocaleDateString('en-IN', {
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
        )}
      </div>
    </div>
  );
};
