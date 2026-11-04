import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Campaign } from '../../types';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  QrCode,
  CreditCard,
  Building,
  ArrowRight,
  Info,
  Loader2,
  Lock,
} from 'lucide-react';

const SUGGESTED_AMOUNTS = [500, 1000, 2500, 5000];

export const DonatePage: React.FC = () => {
  const { campaignSlug } = useParams<{ campaignSlug?: string }>();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationType, setDonationType] = useState<'ONE_TIME' | 'MONTHLY'>('ONE_TIME');

  // Donor Details
  const [donorName, setDonorName] = useState(user?.fullName || '');
  const [donorEmail, setDonorEmail] = useState(user?.email || '');
  const [donorPhone, setDonorPhone] = useState(user?.phone || '');
  const [donorPAN, setDonorPAN] = useState('');
  const [donorAddress, setDonorAddress] = useState('');
  const [simulateForeignCard, setSimulateForeignCard] = useState(false);

  // Flow State
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [createdDonation, setCreatedDonation] = useState<any | null>(null);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING'>('UPI');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await api.getPublicCampaigns();
        setCampaigns(data);

        if (campaignSlug) {
          const match = data.find((c) => c.slug === campaignSlug);
          if (match) setSelectedCampaignId(match.id);
        } else if (data.length > 0) {
          setSelectedCampaignId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load campaigns for donation', err);
      } finally {
        setIsLoadingCampaigns(false);
      }
    };
    fetchCampaigns();
  }, [campaignSlug]);

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
    if (val) {
      setAmount(parseInt(val, 10));
    }
  };

  const handleCreateDonationOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!selectedCampaignId) {
      setFormError('Please select a campaign');
      return;
    }
    if (amount < 100) {
      setFormError('Minimum donation amount is ₹100');
      return;
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(donorPAN.trim().toUpperCase())) {
      setFormError('Please enter a valid 10-character Indian PAN (e.g. ABCDE1234F)');
      return;
    }
    if (!donorAddress.trim() || donorAddress.trim().length < 5) {
      setFormError('Full postal address is required for 80G tax receipt compliance');
      return;
    }

    if (simulateForeignCard) {
      setFormError(
        'Foreign contributions cannot be accepted through this platform because FCRA processing is outside the current phase. Only domestic Indian INR contributions are allowed.'
      );
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const idempotencyKey = `IDEMP-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const donation = await api.createDonation({
        campaignId: selectedCampaignId,
        amount,
        donationType,
        donorName,
        donorEmail,
        donorPhone,
        donorPAN: donorPAN.trim().toUpperCase(),
        donorAddress,
        idempotencyKey,
        isForeignCard: simulateForeignCard,
      });

      setCreatedDonation(donation);
      setShowSimulatorModal(true);
    } catch (err: any) {
      setFormError(err.message || 'Failed to initiate donation order.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleExecutePaymentSimulation = async (outcome: 'SUCCESS' | 'FAILED' | 'PENDING') => {
    if (!createdDonation) return;
    setIsProcessingPayment(true);
    setFormError(null);

    try {
      const res = await api.processMockPayment({
        donationId: createdDonation.id,
        method: paymentMethod,
        outcome,
        isForeignCard: simulateForeignCard,
      });

      if (outcome === 'SUCCESS') {
        navigate(`/donate/success?donationId=${createdDonation.id}`);
      } else if (outcome === 'FAILED') {
        navigate(`/donate/failed?donationId=${createdDonation.id}`);
      } else {
        alert('Payment marked as PENDING. No receipt will be issued until confirmation.');
        setShowSimulatorModal(false);
      }
    } catch (err: any) {
      setFormError(err.message || 'Payment simulation failed.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C77B59] bg-[#C77B59]/10 px-3 py-1 rounded-full">
          <Heart className="w-3.5 h-3.5 fill-[#C77B59]" />
          <span>{language === 'HI' ? 'सुरक्षित 80G दान पोर्टल' : 'Secure 80G Tax-Deductible Donation'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#103A30]">
          {language === 'HI' ? 'महिलाओं के सशक्तिकरण में योगदान दें' : 'Empower Grassroots Women Today'}
        </h1>
        <p className="text-xs sm:text-sm text-[#727B74] max-w-xl mx-auto">
          {language === 'HI'
            ? 'आपका प्रत्येक योगदान मध्य प्रदेश के 9 ज़िलों में महिलाओं की आजीविका व स्वास्थ्य में काम आता है। तत्काल आधिकारिक 80G कर छूट रसीद प्राप्त करें।'
            : 'Every rupee directly fuels rural women livelihood, health kits, and SHG enterprise funds. Receive an instant concurrency-safe 80G PDF receipt.'}
        </p>
      </div>

      {/* FCRA Notice Banner */}
      <div className="p-4 rounded-card bg-[#FAF9F5] border border-[#C77B59]/30 flex items-start gap-3 text-xs text-[#202923]">
        <Info className="w-5 h-5 text-[#C77B59] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#C77B59] block">
            {language === 'HI' ? 'विदेशी अंशदान (FCRA) सूचना:' : 'FCRA & Domestic Currency Notice:'}
          </span>
          <p className="text-[#727B74] leading-relaxed">
            {language === 'HI'
              ? 'विदेशी मुद्रा अथवा अंतरराष्ट्रीय कार्ड से दान स्वीकार नहीं किए जा सकते हैं क्योंकि FCRA प्रक्रिया वर्तमान चरण से बाहर है। केवल भारतीय बैंक/UPI अथवा घरेलू कार्ड से INR में दान मान्य है।'
              : 'Foreign contributions and international cards cannot be accepted through this platform because FCRA processing is outside the current phase. Only domestic Indian INR payments are accepted.'}
          </p>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-card bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Donation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (8 cols) */}
        <form onSubmit={handleCreateDonationOrder} className="lg:col-span-8 space-y-8">
          {/* Step 1: Campaign Selection */}
          <div className="bg-white rounded-card border border-[#E5E4DE] p-6 sm:p-8 space-y-5 shadow-xs">
            <h2 className="text-base font-bold text-[#103A30] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#174C3C] text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>{language === 'HI' ? 'अभियान चुनें' : 'Choose Campaign'}</span>
            </h2>

            {isLoadingCampaigns ? (
              <div className="py-4 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#174C3C] mx-auto" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2.5">
                  {campaigns.map((camp) => (
                    <label
                      key={camp.id}
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                        selectedCampaignId === camp.id
                          ? 'border-[#174C3C] bg-[#174C3C]/5 shadow-xs'
                          : 'border-[#E5E4DE] hover:bg-[#FAF9F5]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="campaign"
                        value={camp.id}
                        checked={selectedCampaignId === camp.id}
                        onChange={() => setSelectedCampaignId(camp.id)}
                        className="w-4 h-4 mt-0.5 text-[#174C3C] focus:ring-[#174C3C]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#202923]">{camp.title}</span>
                          <span className="text-[10px] text-[#727B74] font-semibold bg-[#FAF9F5] px-2 py-0.5 rounded-sm border border-[#E5E4DE]">
                            {camp.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#727B74] line-clamp-1 mt-0.5">{camp.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Amount & Frequency */}
          <div className="bg-white rounded-card border border-[#E5E4DE] p-6 sm:p-8 space-y-5 shadow-xs">
            <h2 className="text-base font-bold text-[#103A30] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#174C3C] text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>{language === 'HI' ? 'दान राशि एवं आवृत्ति' : 'Donation Amount & Frequency'}</span>
            </h2>

            {/* Frequency Selector */}
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => setDonationType('ONE_TIME')}
                className={`py-2.5 text-xs font-bold rounded-btn border transition-all ${
                  donationType === 'ONE_TIME'
                    ? 'border-[#174C3C] bg-[#174C3C] text-white'
                    : 'border-[#E5E4DE] bg-[#FAF9F5] text-[#202923]'
                }`}
              >
                {language === 'HI' ? 'एकमुश्त दान (One-Time)' : 'One-Time Donation'}
              </button>

              <button
                type="button"
                onClick={() => setDonationType('MONTHLY')}
                className={`py-2.5 text-xs font-bold rounded-btn border transition-all ${
                  donationType === 'MONTHLY'
                    ? 'border-[#174C3C] bg-[#174C3C] text-white'
                    : 'border-[#E5E4DE] bg-[#FAF9F5] text-[#202923]'
                }`}
              >
                {language === 'HI' ? 'मासिक दान (Monthly Simulated)' : 'Monthly (Simulated)'}
              </button>
            </div>

            {/* Suggested preset buttons */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#727B74]">
                {language === 'HI' ? 'सुझावित राशियां (INR)' : 'Suggested Amounts (INR)'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SUGGESTED_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleAmountSelect(val)}
                    className={`py-3 text-sm font-bold rounded-btn border transition-all ${
                      amount === val && !customAmount
                        ? 'border-[#174C3C] bg-[#174C3C]/10 text-[#174C3C] ring-2 ring-[#174C3C]'
                        : 'border-[#E5E4DE] bg-[#FAF9F5] text-[#202923] hover:border-[#174C3C]/40'
                    }`}
                  >
                    ₹{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Custom Amount input */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#727B74] mb-1">
                  {language === 'HI' ? 'अथवा अन्य राशि दर्ज करें (कम से कम ₹100)' : 'Or Enter Custom Amount (Min ₹100)'}
                </label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#727B74]">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="e.g. 15000"
                    className="w-full pl-8 pr-4 py-2.5 text-sm font-bold border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Donor Identification & PAN for 80G */}
          <div className="bg-white rounded-card border border-[#E5E4DE] p-6 sm:p-8 space-y-5 shadow-xs">
            <h2 className="text-base font-bold text-[#103A30] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#174C3C] text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>{language === 'HI' ? 'दाता विवरण एवं 80G PAN' : 'Donor Information & 80G Tax Details'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  {language === 'HI' ? 'पूरा नाम *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 text-sm border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  {language === 'HI' ? 'ईमेल पता *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="e.g. priya.sharma@example.com"
                  className="w-full px-3 py-2 text-sm border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  {language === 'HI' ? 'मोबाइल नंबर *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10 digit number"
                  className="w-full px-3 py-2 text-sm border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  {language === 'HI' ? 'स्थायी खाता संख्या (PAN) *' : 'Permanent Account Number (PAN) *'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={donorPAN}
                  onChange={(e) => setDonorPAN(e.target.value.toUpperCase())}
                  placeholder="e.g. ABCDE1234F"
                  className="w-full px-3 py-2 text-sm uppercase font-mono tracking-wider border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
                />
                <span className="text-[10px] text-[#727B74] mt-1 block">
                  Mandatory for Section 80G tax certificate and Form 10BD filing.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202923] mb-1">
                {language === 'HI' ? 'डाक पता (Postal Address) *' : 'Postal Address *'}
              </label>
              <textarea
                required
                rows={2}
                value={donorAddress}
                onChange={(e) => setDonorAddress(e.target.value)}
                placeholder="Full postal address with pincode (required for official 80G receipt)"
                className="w-full px-3 py-2 text-sm border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
              />
            </div>

            {/* Test Simulation Checkbox for Foreign Card Rejection */}
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-[#727B74] cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateForeignCard}
                  onChange={(e) => setSimulateForeignCard(e.target.checked)}
                  className="rounded-sm text-[#C77B59] focus:ring-[#C77B59]"
                />
                <span className="italic">
                  [Test Mode Simulator] Simulate foreign currency card transaction (tests FCRA rejection)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmittingOrder}
                className="w-full py-3.5 bg-[#C77B59] hover:bg-[#B06544] text-white text-sm font-bold rounded-btn shadow-soft transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmittingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initiating Secure Test Checkout...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Proceed to Test Payment Simulator (₹{amount.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Right Sidebar (4 cols): Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#103A30] uppercase tracking-wider">
              {language === 'HI' ? 'दान विवरण सारांश' : 'Donation Summary'}
            </h3>

            {selectedCampaign && (
              <div className="space-y-1.5 pb-4 border-b border-[#FAF9F5]">
                <span className="text-[10px] font-bold text-[#C77B59]">{selectedCampaign.category}</span>
                <p className="text-xs font-bold text-[#202923]">{selectedCampaign.title}</p>
                <div className="text-[11px] text-[#727B74] flex justify-between pt-1">
                  <span>Raised so far:</span>
                  <span className="font-semibold text-[#174C3C]">
                    ₹{selectedCampaign.collectedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#727B74]">
                <span>Donation Amount:</span>
                <span className="font-bold text-[#202923]">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#727B74]">
                <span>Frequency:</span>
                <span className="font-bold text-[#202923]">{donationType}</span>
              </div>
              <div className="flex justify-between text-[#727B74]">
                <span>Tax Exemption:</span>
                <span className="font-bold text-[#174C3C]">50% Under Sec 80G</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#FAF9F5] flex justify-between items-baseline">
              <span className="text-xs font-bold text-[#202923]">Total Payable:</span>
              <span className="text-xl font-extrabold text-[#174C3C]">₹{amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="p-4 rounded-card bg-[#FAF9F5] border border-[#E5E4DE] text-xs text-[#727B74] space-y-2">
            <div className="flex items-center gap-1.5 text-[#174C3C] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Demonstration Simulator</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              This is a demonstration payment environment built for Isocode Labs take-home assessment. No actual financial debits occur. Concurrency-safe demo 80G certificates are generated automatically.
            </p>
          </div>
        </div>
      </div>

      {/* MOCK PAYMENT SIMULATOR MODAL */}
      {showSimulatorModal && createdDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-card shadow-elevated border border-[#E5E4DE] w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#103A30] text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A8BDA8]">
                    TEST MODE PAYMENT GATEWAY
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Simulated Checkout: ₹{amount.toLocaleString('en-IN')}
                </h3>
              </div>
              <span className="text-[10px] bg-[#C77B59] px-2 py-0.5 rounded-sm font-bold">
                Simulation Only
              </span>
            </div>

            {/* Payment Method Tabs */}
            <div className="p-6 space-y-6">
              <div className="flex border-b border-[#E5E4DE]">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`flex-1 pb-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#174C3C] text-[#174C3C]'
                      : 'border-transparent text-[#727B74] hover:text-[#202923]'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`flex-1 pb-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-[#174C3C] text-[#174C3C]'
                      : 'border-transparent text-[#727B74] hover:text-[#202923]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card Simulation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NET_BANKING')}
                  className={`flex-1 pb-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                    paymentMethod === 'NET_BANKING'
                      ? 'border-[#174C3C] text-[#174C3C]'
                      : 'border-transparent text-[#727B74] hover:text-[#202923]'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* Method Simulation Screen */}
              {paymentMethod === 'UPI' && (
                <div className="text-center space-y-3 py-2">
                  <div className="w-36 h-36 bg-[#FAF9F5] border-2 border-dashed border-[#174C3C] rounded-xl mx-auto flex items-center justify-center p-2">
                    <QrCode className="w-28 h-28 text-[#174C3C]" />
                  </div>
                  <p className="text-xs font-semibold text-[#202923]">UPI ID: sakhisetu@upi (Simulated)</p>
                  <p className="text-[11px] text-[#727B74]">
                    Simulate scanning QR code with BHIM, PhonePe, Google Pay, or Paytm.
                  </p>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E5E4DE] space-y-2 text-xs">
                  <div className="flex justify-between text-[#727B74]">
                    <span>Card Number:</span>
                    <span className="font-mono font-bold text-[#202923]">4111 •••• •••• 1111 (Domestic Test)</span>
                  </div>
                  <div className="flex justify-between text-[#727B74]">
                    <span>Cardholder:</span>
                    <span className="font-bold text-[#202923]">{donorName}</span>
                  </div>
                  <div className="flex justify-between text-[#727B74]">
                    <span>Origin:</span>
                    <span className="font-bold text-[#174C3C]">Domestic Indian Card (FCRA Compliant)</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'NET_BANKING' && (
                <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E5E4DE] space-y-2 text-xs">
                  <span className="font-semibold text-[#727B74] block">Select Simulated Bank:</span>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-semibold text-xs text-[#202923]">
                    <span className="p-2 bg-white rounded-sm border border-[#E5E4DE] text-center">State Bank of India</span>
                    <span className="p-2 bg-white rounded-sm border border-[#E5E4DE] text-center">HDFC Bank</span>
                    <span className="p-2 bg-white rounded-sm border border-[#E5E4DE] text-center">ICICI Bank</span>
                    <span className="p-2 bg-white rounded-sm border border-[#E5E4DE] text-center">Punjab National Bank</span>
                  </div>
                </div>
              )}

              {/* Simulation Trigger Actions */}
              <div className="space-y-2.5 pt-2 border-t border-[#E5E4DE]">
                <span className="text-[10px] font-bold text-[#727B74] uppercase tracking-wider block text-center">
                  Select Simulation Outcome to Execute
                </span>

                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => handleExecutePaymentSimulation('SUCCESS')}
                  className="w-full py-3 bg-[#174C3C] hover:bg-[#103A30] text-white text-xs font-bold rounded-btn transition-colors flex items-center justify-center gap-2 shadow-soft disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>Simulate Successful Payment & Issue 80G Receipt</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={() => handleExecutePaymentSimulation('FAILED')}
                    className="py-2.5 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-btn transition-colors"
                  >
                    Simulate Payment Decline
                  </button>

                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={() => handleExecutePaymentSimulation('PENDING')}
                    className="py-2.5 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-btn transition-colors"
                  >
                    Simulate Bank Pending
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowSimulatorModal(false)}
                  className="text-xs text-[#727B74] hover:text-[#202923] underline"
                >
                  Cancel simulation & back to form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
