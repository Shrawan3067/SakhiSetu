import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import {
  CheckCircle2,
  Download,
  FileText,
  ShieldCheck,
  Calendar,
  CreditCard,
  Heart,
  ArrowRight,
  Loader2,
  Building2,
} from 'lucide-react';

export const DonationSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get('donationId');
  const { language } = useLanguage();

  const [donation, setDonation] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonation = async () => {
      if (!donationId) {
        setError('No donation ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const data = await api.getDonationById(donationId);
        setDonation(data);
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve donation confirmation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonation();
  }, [donationId]);

  const handleDownloadPdf = async () => {
    if (!donation?.receipt?.id) return;
    setIsDownloading(true);
    try {
      const blob = await api.downloadReceiptPdfBlob(donation.receipt.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SakhiSetu_80G_Receipt_${donation.receipt.receiptNumber.replace(/\//g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert('Failed to download PDF: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#174C3C]" />
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#202923]">Donation Confirmation Error</h2>
        <p className="text-xs text-[#727B74]">{error || 'Could not locate your donation order.'}</p>
        <Link to="/donate" className="inline-block px-4 py-2 bg-[#174C3C] text-white text-xs font-bold rounded-btn">
          Back to Donation Page
        </Link>
      </div>
    );
  }

  const receipt = donation.receipt;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fadeIn">
      {/* Success Hero Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-soft">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174C3C] bg-[#174C3C]/10 px-3 py-0.5 rounded-full">
          <span>{language === 'HI' ? 'दान सफलतापूर्वक संपन्न हुआ' : 'Donation Successfully Confirmed'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#103A30]">
          {language === 'HI' ? 'धन्यवाद! आपका योगदान दर्ज कर लिया गया है।' : 'Thank You for Your Generous Contribution!'}
        </h1>
        <p className="text-xs sm:text-sm text-[#727B74] max-w-md mx-auto">
          {language === 'HI'
            ? 'आपकी सहायता से ग्रामीण महिलाओं के जीवन में सकारात्मक बदलाव आएगा। आपकी 80G कर छूट रसीद जारी कर दी गई है।'
            : 'Your contribution will empower rural women across Madhya Pradesh. Your signed 80G demo tax receipt is ready.'}
        </p>
      </div>

      {/* 80G Demo Receipt Card */}
      <div className="bg-white rounded-card border-2 border-[#174C3C] shadow-elevated overflow-hidden">
        {/* Banner */}
        <div className="bg-[#FEF3C7] px-6 py-2.5 text-center border-b border-[#FDE68A]">
          <span className="text-[10px] font-bold text-[#92400E] tracking-wider uppercase">
            DEMONSTRATION 80G RECEIPT — NOT A VALID TAX CERTIFICATE — FOR CODE REVIEW ONLY
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Trust & Receipt Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E4DE] gap-4">
            <div>
              <span className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
                SakhiSetu Charitable Trust (Bhopal)
              </span>
              <h2 className="text-xl font-bold text-[#202923] mt-0.5">Donation & 80G Receipt</h2>
              <p className="text-[11px] text-[#727B74]">Trust 80G Reg: CIT(E)/BPL/80G/2021-22/A-1089</p>
            </div>

            {receipt && (
              <div className="sm:text-right bg-[#FAF9F5] p-3 rounded-lg border border-[#E5E4DE]">
                <span className="text-[10px] font-bold text-[#727B74] uppercase block">
                  Allocated Receipt No:
                </span>
                <span className="text-sm font-mono font-bold text-[#174C3C]">
                  {receipt.receiptNumber}
                </span>
                <span className="text-[10px] text-[#727B74] block mt-0.5">
                  FY {receipt.financialYear}
                </span>
              </div>
            )}
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE]">
              <span className="text-[#727B74] block">Donor Name:</span>
              <span className="font-bold text-[#202923] text-sm">{donation.donorName}</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE]">
              <span className="text-[#727B74] block">Donor PAN:</span>
              <span className="font-mono font-bold text-[#202923] text-sm">
                {donation.donorPANMasked || donation.donorPAN}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE]">
              <span className="text-[#727B74] block">Campaign Supported:</span>
              <span className="font-bold text-[#202923] text-sm">{donation.campaign?.title}</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE]">
              <span className="text-[#727B74] block">Amount Contributed:</span>
              <span className="font-extrabold text-[#174C3C] text-base">
                INR ₹{donation.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE]">
              <span className="text-[#727B74] block">Payment Reference / Txn ID:</span>
              <span className="font-mono text-[#202923] text-[11px]">
                {donation.paymentReference || 'MOCK_TXN_SIMULATED'}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE]">
              <span className="text-[#727B74] block">Payment Method:</span>
              <span className="font-semibold text-[#202923] text-xs">
                {donation.paymentMethod || 'Online Simulation'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#E5E4DE] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#727B74]">
              <span className="font-semibold text-[#174C3C] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Section 80G Statutory 50% Tax Relief Eligible</span>
              </span>
            </div>

            {receipt && (
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#174C3C] hover:bg-[#103A30] text-white px-6 py-3 rounded-btn text-xs font-bold shadow-soft transition-colors disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Official PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download 80G PDF Receipt</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-semibold">
        <Link to="/donor/dashboard" className="text-[#174C3C] hover:underline flex items-center gap-1">
          <span>{language === 'HI' ? 'दाता पोर्टल पर जाएं' : 'Go to Donor Dashboard'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <span className="text-[#E5E4DE] hidden sm:inline">•</span>
        <Link to="/schemes" className="text-[#727B74] hover:text-[#202923]">
          {language === 'HI' ? 'सरकारी योजनाएं खोजें' : 'Explore Welfare Schemes'}
        </Link>
      </div>
    </div>
  );
};
