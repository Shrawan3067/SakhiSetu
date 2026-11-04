import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

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
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Donation Confirmation Error</h2>
        <p className="font-body-sm text-on-surface-variant">{error || 'Could not locate your donation order.'}</p>
        <Link
          to="/donate"
          className="inline-block px-5 py-2.5 bg-primary text-on-primary font-label-md text-sm font-semibold rounded-xl"
        >
          Back to Donation Page
        </Link>
      </div>
    );
  }

  const receipt = donation.receipt;

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-12 py-12 space-y-8 animate-fadeIn">
      {/* Success Hero Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-primary-fixed text-primary flex items-center justify-center mx-auto shadow-sm">
          <span className="material-symbols-outlined text-[36px]">verified</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps uppercase font-bold">
          <span>Donation Successfully Confirmed</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
          Thank You For Your Gracious Support!
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
          Your voluntary contribution has been safely credited to our direct community fund with zero administrative broker deductions.
        </p>
      </div>

      {/* 80G Receipt Voucher Card */}
      {receipt && (
        <div className="bg-surface-container-lowest rounded-2xl border-2 border-primary/20 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8EAE5] pb-4">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-wider">
                Official Section 80G Certificate
              </span>
              <p className="font-mono text-base font-bold text-primary mt-1">{receipt.receiptNumber}</p>
            </div>
            <div className="sm:text-right">
              <span className="font-label-sm text-xs text-on-surface-variant">Issued Date</span>
              <p className="font-body-sm text-sm font-semibold text-on-surface">
                {new Date(receipt.issuedAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-[#E8EAE5] space-y-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Donor Legal Name</span>
              <p className="font-title-md text-sm font-bold text-primary">{receipt.donorName}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-[#E8EAE5] space-y-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Donor PAN</span>
              <p className="font-mono text-sm font-bold text-primary">{receipt.donorPAN || 'Not Supplied'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-[#E8EAE5] space-y-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Donation Amount</span>
              <p className="font-headline-sm text-headline-sm font-bold text-primary">
                ₹{Number(receipt.donationAmount).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-[#E8EAE5] space-y-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Section 80G Eligible Deduction
              </span>
              <p className="font-headline-sm text-headline-sm font-bold text-secondary">
                ₹{Math.round(Number(receipt.donationAmount) * 0.5).toLocaleString('en-IN')} (50%)
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-secondary hover:bg-[#B56C4A] text-on-secondary font-title-md text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              <span>{isDownloading ? 'Downloading Vector PDF...' : 'Download Official 80G PDF'}</span>
            </button>

            <Link
              to="/donor/dashboard"
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Donor Dashboard</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}

      {/* Trust reassurance */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-[#E8EAE5] flex items-center gap-3 text-on-surface-variant font-body-sm text-xs">
        <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
        <span>
          A digital copy of this 80G certificate has been logged in our electronic CBDT return registry for Form 10BD annual verification.
        </span>
      </div>
    </div>
  );
};
