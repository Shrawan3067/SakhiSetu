import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Campaign } from '../../types';

export const DonatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const campaignParam = searchParams.get('campaign');
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [amount, setAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationType, setDonationType] = useState<'ONE_TIME' | 'MONTHLY'>('ONE_TIME');

  // Donor Details
  const [donorName, setDonorName] = useState(user?.fullName || 'Ananya Sharma');
  const [donorEmail, setDonorEmail] = useState(user?.email || 'ananya.sharma@example.com');
  const [donorPhone, setDonorPhone] = useState(user?.phone || '9820144521');
  const [donorPAN, setDonorPAN] = useState('ABCPS1234F');
  const [donorAddress, setDonorAddress] = useState('Plot 42, Malviya Nagar, Bhopal, MP - 462003');
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

        if (campaignParam) {
          const match = data.find((c) => c.slug === campaignParam || c.id === campaignParam);
          if (match) {
            setSelectedCampaignId(match.id);
          } else if (data.length > 0) {
            setSelectedCampaignId(data[0].id);
          }
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
  }, [campaignParam]);

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

    if (!selectedCampaignId) {
      setFormError('Please select an impact campaign');
      return;
    }
    if (amount < 100) {
      setFormError('Minimum donation amount is ₹100');
      return;
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(donorPAN.trim().toUpperCase())) {
      setFormError('Please enter a valid 10-character Indian PAN (e.g. ABCPS1234F)');
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
      await api.processMockPayment({
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

  // Section 80G calculations
  const taxDeduction = Math.round(amount * 0.5);
  const estimatedTaxSaved = Math.round(taxDeduction * 0.312); // ~30% slab + 4% cess

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Top Editorial Header & Trust Anchor */}
      <section className="w-full bg-surface-container-low/70 py-12 px-6 lg:px-12 border-b border-[#E8EAE5]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Transparent Philanthropy • 100% Direct Allocation
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
              Section 8 Non-Profit Reg. #CIT(E)/BPL/80G/2021-22/A-1089
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-display-hero text-headline-lg lg:text-display-hero text-primary tracking-tight leading-tight font-bold">
                Be the Reason Someone Gets a New Beginning.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
                Every rupee contributed directly powers women's collectives, maternal healthcare vans, and girls' digital classrooms across Madhya Pradesh. All contributions qualify for a 50% deduction under Section 80G of the Indian Income Tax Act with instant Form 10BE filing.
              </p>
            </div>

            <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-4 border border-[#E8EAE5]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8EAE5]">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                  Statutory Compliance
                </span>
                <span className="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[16px]">shield</span> IT Act 1961
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">80G Approval URN</span>
                  <span className="font-semibold text-on-surface">AACTS1982RE20214</span>
                </div>
                <div className="flex items-center justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">NITI Aayog Darpan ID</span>
                  <span className="font-semibold text-on-surface">MP/2021/02981</span>
                </div>
                <div className="flex items-center justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Admin Overhead Fee</span>
                  <span className="font-semibold text-primary">0% (100% to Field Ops)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-lowest shadow-sm border border-[#E8EAE5]">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">percent</span>
              </div>
              <div>
                <p className="font-title-md text-[14px] text-on-surface font-semibold leading-tight">50% Deduction</p>
                <p className="font-body-sm text-label-sm text-on-surface-variant">Section 80G guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-lowest shadow-sm border border-[#E8EAE5]">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">account_balance</span>
              </div>
              <div>
                <p className="font-title-md text-[14px] text-on-surface font-semibold leading-tight">Zero Platform Cut</p>
                <p className="font-body-sm text-label-sm text-on-surface-variant">Every rupee enters field ops</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-lowest shadow-sm border border-[#E8EAE5]">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
              </div>
              <div>
                <p className="font-title-md text-[14px] text-on-surface font-semibold leading-tight">PCI-DSS Gateway</p>
                <p className="font-body-sm text-label-sm text-on-surface-variant">256-Bit bank grade security</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-lowest shadow-sm border border-[#E8EAE5]">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">description</span>
              </div>
              <div>
                <p className="font-title-md text-[14px] text-on-surface font-semibold leading-tight">Instant 80G Receipt</p>
                <p className="font-body-sm text-label-sm text-on-surface-variant">Vector PDF with serial code</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Stepper */}
      <section className="w-full bg-surface py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-[#E8EAE5]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-primary/5">
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-title-md text-[14px]">
                  1
                </div>
                <div>
                  <p className="font-title-md text-[14px] text-primary font-semibold leading-none">Select Impact &amp; Tier</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">₹{amount.toLocaleString('en-IN')} Contribution</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-xl bg-primary-container text-on-primary-container">
                <div className="w-9 h-9 rounded-full bg-on-primary-container text-primary-container flex items-center justify-center font-title-md text-[14px]">
                  2
                </div>
                <div>
                  <p className="font-title-md text-[14px] text-on-primary font-semibold leading-none">Donor &amp; 80G Tax Details</p>
                  <p className="font-label-sm text-label-sm text-on-primary-container mt-1">PAN verification required</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-xl opacity-75">
                <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-title-md text-[14px]">
                  3
                </div>
                <div>
                  <p className="font-title-md text-[14px] text-on-surface font-semibold leading-none">Simulated Checkout</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Digital receipt &amp; ledger proof</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Checkout Experience */}
      <main className="w-full px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Checkout Inputs (~65%) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {formError && (
              <div className="p-4 rounded-xl bg-error-container text-on-error-container flex items-start gap-3 border border-error/20">
                <span className="material-symbols-outlined text-[20px] text-error shrink-0 mt-0.5">error</span>
                <p className="font-body-sm text-body-sm leading-relaxed">{formError}</p>
              </div>
            )}

            {/* Step 1: Select Impact Initiative */}
            <section className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm space-y-6 border border-[#E8EAE5]">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="font-label-caps text-label-caps text-secondary font-semibold uppercase tracking-wider">
                    Step 01
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Choose Your Dedicated Beneficiary Circle
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                  100% Direct Allocation
                </span>
              </div>

              {isLoadingCampaigns ? (
                <div className="p-8 text-center text-on-surface-variant">Loading impact drives...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {campaigns.map((camp) => {
                    const isSelected = selectedCampaignId === camp.id;
                    const percent = Math.min(
                      100,
                      Math.round(((camp.collectedAmount || 0) / (camp.goalAmount || 1)) * 100)
                    );
                    return (
                      <div
                        key={camp.id}
                        onClick={() => setSelectedCampaignId(camp.id)}
                        className={`relative flex flex-col justify-between p-5 rounded-2xl cursor-pointer transition-all space-y-4 border ${
                          isSelected
                            ? 'bg-surface-container-low border-primary shadow-md'
                            : 'bg-surface-container border-transparent hover:border-[#E8EAE5]'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isSelected
                                  ? 'bg-primary text-on-primary'
                                  : 'bg-surface-container-highest text-on-surface'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {camp.category === 'HEALTH'
                                  ? 'medical_services'
                                  : camp.category === 'EDUCATION'
                                  ? 'school'
                                  : 'handyman'}
                              </span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-caps text-[10px] uppercase">
                              Active
                            </span>
                          </div>
                          <h3 className="font-title-md text-[16px] text-primary font-bold leading-snug">
                            {camp.title}
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                            {camp.description}
                          </p>
                        </div>
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                            <span>Raised: ₹{(camp.collectedAmount || 0).toLocaleString('en-IN')}</span>
                            <span className="font-semibold text-primary">{percent}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm border border-[#E8EAE5]">
                <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                <span>
                  Prefer flexible allocation? Select any drive and funds will be deployed directly where critical need arises across 9 MP districts.
                </span>
              </div>
            </section>

            {/* Step 2: Choose Donation Tier & Amount */}
            <section className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm space-y-6 border border-[#E8EAE5]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-label-caps text-label-caps text-secondary font-semibold uppercase tracking-wider">
                    Step 02
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Choose Donation Tier &amp; Frequency
                  </h2>
                </div>

                {/* Frequency Switcher */}
                <div className="inline-flex p-1 rounded-xl bg-surface-container-high border border-outline-variant/40">
                  <button
                    type="button"
                    onClick={() => setDonationType('ONE_TIME')}
                    className={`px-4 py-1.5 rounded-lg font-label-sm text-label-sm transition-all ${
                      donationType === 'ONE_TIME'
                        ? 'bg-primary text-on-primary font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    One-Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationType('MONTHLY')}
                    className={`px-4 py-1.5 rounded-lg font-label-sm text-label-sm transition-all ${
                      donationType === 'MONTHLY'
                        ? 'bg-primary text-on-primary font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Monthly Guardian
                  </button>
                </div>
              </div>

              {/* Suggested Amount Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { val: 500, desc: 'Diagnostics & vitamins for 2 expectant mothers' },
                  { val: 1000, desc: '1 month STEM & tablet education for a rural girl' },
                  { val: 2500, desc: 'Supplies raw yarn & loom tools for 1 woman weaver', popular: true },
                  { val: 5000, desc: 'Equips rural Anganwadi with digital screening kits' },
                ].map((tier) => {
                  const isSelected = amount === tier.val && !customAmount;
                  return (
                    <button
                      key={tier.val}
                      type="button"
                      onClick={() => handleAmountSelect(tier.val)}
                      className={`text-left p-4 rounded-xl transition-all flex flex-col justify-between h-28 relative ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-md border-2 border-primary'
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-transparent'
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-caps text-[10px] tracking-wide uppercase">
                          Most Popular
                        </span>
                      )}
                      <span className={`font-headline-sm text-headline-sm ${isSelected ? 'text-on-primary' : 'text-on-surface'}`}>
                        ₹{tier.val.toLocaleString('en-IN')}
                      </span>
                      <span className={`font-body-sm text-body-sm ${isSelected ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                        {tier.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
                <div className="sm:col-span-5">
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1.5">
                    Or Enter Custom Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-title-md text-on-surface-variant">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="e.g. 10000"
                      className="w-full bg-surface-container-low text-on-surface pl-8 pr-4 py-2.5 rounded-xl font-body-md text-body-md border border-[#E8EAE5] focus:bg-surface-container-lowest focus:outline-hidden"
                    />
                  </div>
                </div>
                <div className="sm:col-span-7 flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm pt-4 sm:pt-6">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  <span>All amounts above ₹100 immediately generate an official Section 80G tax receipt.</span>
                </div>
              </div>
            </section>

            {/* Step 3: Donor Information & Tax Exemption */}
            <section className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm space-y-6 border border-[#E8EAE5]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-label-caps text-secondary font-semibold uppercase tracking-wider">
                    Step 03
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-caps text-[10px]">
                    Mandatory for 80G Deduction
                  </span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Donor &amp; Tax Identification Details
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Required by the Ministry of Finance to submit electronic donor returns via Form 10BD/10BE.
                </p>
              </div>

              <form onSubmit={handleCreateDonationOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Full Legal Name (as per PAN Card) *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-xl font-body-md text-body-md border border-[#E8EAE5] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Email Address (for 80G PDF Certificate) *
                  </label>
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-xl font-body-md text-body-md border border-[#E8EAE5] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Mobile Number (WhatsApp Receipt) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-xl font-body-md text-body-md border border-[#E8EAE5] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-label-md text-label-md text-on-surface font-medium">
                      PAN Card Number *
                    </label>
                    <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> Verified PAN
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={donorPAN}
                    onChange={(e) => setDonorPAN(e.target.value.toUpperCase())}
                    placeholder="ABCPS1234F"
                    className="w-full uppercase font-mono tracking-wider bg-surface-container-low text-on-surface px-4 py-2.5 rounded-xl font-body-md text-body-md border border-[#E8EAE5] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Full Residential Address (Statutory CBDT Requirement) *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorAddress}
                    onChange={(e) => setDonorAddress(e.target.value)}
                    placeholder="House/Plot No., Street, City, State, PIN"
                    className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-xl font-body-md text-body-md border border-[#E8EAE5] focus:outline-hidden"
                  />
                </div>

                {/* FCRA Simulation Checkbox (Explicitly Tested Requirement) */}
                <div className="sm:col-span-2 p-3.5 rounded-xl bg-surface-container-low border border-[#E8EAE5]">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulateForeignCard}
                      onChange={(e) => setSimulateForeignCard(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-secondary rounded focus:ring-secondary"
                    />
                    <div>
                      <p className="font-label-md text-label-md font-semibold text-secondary">
                        Simulate Foreign Card / Non-Resident Contribution (Test Mode)
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                        SakhiSetu does not process foreign online donations currently because FCRA is outside this phase. Enabling this simulates the active rejection safeguard required by law.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Primary Submit Action */}
                <div className="sm:col-span-2 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="w-full py-4 px-6 rounded-xl bg-primary text-on-primary font-title-md text-title-md font-semibold hover:bg-primary-container shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <span>
                      {isSubmittingOrder
                        ? 'Initiating Contribution Order...'
                        : `Proceed to Payment Simulation (₹${amount.toLocaleString('en-IN')})`}
                    </span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                  <div className="flex flex-wrap items-center justify-center gap-4 text-on-surface-variant font-label-sm text-label-sm pt-3">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                      Verified Section 8 Non-Profit
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">bolt</span>
                      Instant 80G PDF Dispatch
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
                      50% Tax Deductible
                    </span>
                  </div>
                </div>
              </form>
            </section>
          </div>

          {/* Right Column: Sticky Summary & 80G Tax Benefits (~35%) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            {/* Live Contribution Summary */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-5 border border-[#E8EAE5]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8EAE5]">
                <span className="font-title-md text-title-md text-primary font-bold">Contribution Summary</span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">
                  100% Impact
                </span>
              </div>
              <div className="space-y-3 font-body-sm text-body-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Selected Cause:</span>
                  <span className="font-medium text-on-surface text-right max-w-[200px] truncate">
                    {selectedCampaign?.title || 'General Women Welfare Fund'}
                  </span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Frequency:</span>
                  <span className="font-medium text-on-surface">
                    {donationType === 'MONTHLY' ? 'Monthly Guardian' : 'One-Time Contribution'}
                  </span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Base Contribution:</span>
                  <span className="font-medium text-on-surface">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Platform &amp; Gateway Fee:</span>
                  <span className="font-semibold text-primary">₹0 (Zero Deduction)</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#E8EAE5] text-on-surface">
                  <span className="font-title-md text-title-md font-bold text-primary">Total Payable:</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-primary">
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 80G Tax Savings Calculator Card */}
            <div className="bg-primary text-on-primary p-6 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-fixed text-[22px]">savings</span>
                  <h3 className="font-title-md text-[16px] text-on-primary font-semibold">
                    80G Tax Benefit Breakdown
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-[10px] uppercase font-bold">
                  50% Deductible
                </span>
              </div>
              <div className="space-y-2.5 font-body-sm text-body-sm text-on-primary/90">
                <div className="flex justify-between">
                  <span>50% Eligible Deduction (Sec 80G):</span>
                  <span className="font-bold text-on-primary">₹{taxDeduction.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax Saved (30% slab):</span>
                  <span className="font-bold text-secondary-fixed">₹{estimatedTaxSaved.toLocaleString('en-IN')}</span>
                </div>
                <p className="font-label-sm text-[11px] text-on-primary/70 pt-2 leading-tight">
                  Calculation illustrative under Old Tax Regime. Instant signed PDF receipt generated for Form 10BD/10BE filing.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* PAYMENT SIMULATOR MODAL */}
      {showSimulatorModal && createdDonation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-xl w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border border-[#E8EAE5] animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#E8EAE5] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>
                <h3 className="font-title-md text-title-md text-primary font-bold">
                  Simulated Payment Gateway (Test Mode)
                </h3>
              </div>
              <button
                onClick={() => setShowSimulatorModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low flex justify-between items-center">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Donation Order ID</p>
                <p className="font-mono text-xs font-bold text-primary">{createdDonation.id}</p>
              </div>
              <div className="text-right">
                <p className="font-label-sm text-label-sm text-on-surface-variant">Amount Payable</p>
                <p className="font-headline-sm text-headline-sm font-bold text-primary">
                  ₹{createdDonation.amount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex items-center gap-2 p-1 bg-surface-container rounded-xl">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex-1 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'UPI' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">qr_code</span> UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`flex-1 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'CARD' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">credit_card</span> Debit/Credit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('NET_BANKING')}
                className={`flex-1 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'NET_BANKING' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">account_balance</span> Net Banking
              </button>
            </div>

            {/* Method Details */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col items-center space-y-3">
                <svg className="w-28 h-28 text-primary" fill="currentColor" viewBox="0 0 100 100">
                  <rect x="0" y="0" width="30" height="30" rx="4" />
                  <rect x="5" y="5" width="20" height="20" fill="#FAF9F5" />
                  <rect x="9" y="9" width="12" height="12" />
                  <rect x="70" y="0" width="30" height="30" rx="4" />
                  <rect x="75" y="5" width="20" height="20" fill="#FAF9F5" />
                  <rect x="79" y="9" width="12" height="12" />
                  <rect x="0" y="70" width="30" height="30" rx="4" />
                  <rect x="5" y="75" width="20" height="20" fill="#FAF9F5" />
                  <rect x="9" y="79" width="12" height="12" />
                  <rect x="40" y="10" width="10" height="10" />
                  <rect x="55" y="10" width="8" height="20" />
                  <rect x="40" y="35" width="20" height="8" />
                  <rect x="40" y="55" width="15" height="15" />
                  <rect x="65" y="45" width="25" height="10" />
                </svg>
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                  Simulated VPA: sakhisetu@yesbank
                </span>
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
                <p className="font-label-sm text-label-sm font-semibold text-primary">Mock Indian RuPay / Visa Card</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant font-mono">
                  •••• •••• •••• 4012 | EXP: 12/28
                </p>
              </div>
            )}

            {paymentMethod === 'NET_BANKING' && (
              <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
                <p className="font-label-sm text-label-sm font-semibold text-primary">Mock Domestic Bank</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  State Bank of India / HDFC Bank / ICICI Bank
                </p>
              </div>
            )}

            {/* Simulation Outcomes Trigger Buttons */}
            <div className="space-y-3 pt-2">
              <p className="font-label-sm text-label-sm text-on-surface-variant text-center font-medium">
                Select test scenario to simulate payment provider webhook:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => handleExecutePaymentSimulation('SUCCESS')}
                  className="py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Simulate Success (Issue 80G)</span>
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => handleExecutePaymentSimulation('FAILED')}
                  className="py-3 px-4 rounded-xl bg-error hover:opacity-90 text-on-error font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  <span>Simulate Failure</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
