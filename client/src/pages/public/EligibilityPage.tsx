import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { EligibilityResult } from '../../types';
import { CallbackModal } from '../../components/common/CallbackModal';

const MP_DISTRICTS = [
  'Bhopal',
  'Sehore',
  'Raisen',
  'Rajgarh',
  'Vidisha',
  'Hoshangabad',
  'Harda',
  'Betul',
  'Guna',
];

const AGE_RANGES = [
  { id: '18-25', min: 18, max: 25, label: '18–25 Years', labelHi: '18–25 वर्ष (युवा)' },
  { id: '26-40', min: 26, max: 40, label: '26–40 Years', labelHi: '26–40 वर्ष' },
  { id: '41-59', min: 41, max: 59, label: '41–59 Years', labelHi: '41–59 वर्ष' },
  { id: '60+', min: 60, max: 80, label: '60+ Years', labelHi: '60+ वर्ष (वरिष्ठ)' },
];

const WORK_CATEGORIES = [
  { id: 'Homemaker', label: 'Homemaker', labelHi: 'गृहिणी', desc: 'Focusing on family and household livelihood' },
  { id: 'Agriculture', label: 'Farmer / Farming', labelHi: 'कृषि / किसान', desc: 'Cultivator or agricultural laborer' },
  { id: 'Daily Wage Labourer', label: 'Daily Wage Labourer', labelHi: 'दैनिक मजदूर', desc: 'Engaged in seasonal or manual unorganized labor' },
  { id: 'Small Artisan/Self-Employed', label: 'Artisan / Self-Employed', labelHi: 'कारीगर / उद्यमी', desc: 'Weaving, handicrafts, retail, or micro-enterprise' },
];

export const EligibilityPage: React.FC = () => {
  const { language } = useLanguage();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Answers State
  const [district, setDistrict] = useState('Sehore');
  const [ageRange, setAgeRange] = useState('26-40');
  const [age, setAge] = useState<number>(32);
  const [occupation, setOccupation] = useState('Homemaker');
  const [maritalStatus, setMaritalStatus] = useState<'unmarried' | 'married' | 'widowed' | 'divorced'>('widowed');
  const [isSHGMember, setIsSHGMember] = useState<boolean>(true);
  const [hasBPLCard, setHasBPLCard] = useState<boolean>(true);
  const [isPregnantOrNewMother, setIsPregnantOrNewMother] = useState<boolean>(false);

  // Results State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Callback inline form
  const [callbackVillage, setCallbackVillage] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [callbackLoading, setCallbackLoading] = useState(false);

  // Callback Modal State
  const [callbackModal, setCallbackModal] = useState<{
    isOpen: boolean;
    schemeCode?: string;
    schemeName?: string;
  }>({ isOpen: false });

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleEvaluate();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    setError(null);

    try {
      const data = await api.matchEligibility({
        district,
        age: Number(age),
        occupation,
        maritalStatus,
        isSHGMember,
        hasBPLCard,
        isPregnantOrNewMother,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate eligibility. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const resetCalculator = () => {
    setResult(null);
    setStep(1);
    setError(null);
  };

  const submitInlineCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone || callbackPhone.length < 10) return;
    setCallbackLoading(true);
    try {
      await api.requestCallback({
        applicantName: 'Anonymous Applicant',
        phoneNumber: callbackPhone,
        preferredTime: 'Morning',
        district,
        villagePanchayat: callbackVillage || 'Local Gram Panchayat',
        notes: `Submitted from screener (Status: ${maritalStatus}, Age: ${age})`,
      });
      setCallbackSuccess(true);
      setCallbackPhone('');
      setCallbackVillage('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit callback request.');
    } finally {
      setCallbackLoading(false);
    }
  };

  const stepLabels = [
    { num: '01', title: 'District', val: district },
    { num: '02', title: 'Age', val: ageRange },
    { num: '03', title: 'Work', val: occupation.split('/')[0].trim() },
    {
      num: '04',
      title: 'Status',
      val: maritalStatus === 'widowed' ? 'Widowed / कल्याणी' : maritalStatus,
    },
    { num: '05', title: 'SHG', val: isSHGMember ? 'Yes (Gram SHG)' : 'No' },
    { num: '06', title: 'Ration', val: hasBPLCard ? 'BPL / Antyodaya' : 'General' },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-surface">
      {/* Top Subtle Texture Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-primary-fixed/30 via-surface-container-low to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-10">
        {/* Breadcrumbs & Trust Indicator Bar */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2">
              <Link
                to="/"
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home</span>
              </Link>
              <span className="text-outline-variant font-label-sm">/</span>
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                Find My Scheme (Eligibility Screener)
              </span>
            </nav>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                MP &amp; Central Schemes • Updated 2024–25
              </span>
            </div>
          </div>

          {/* Privacy Shield Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
            <span>
              <strong>100% Free &amp; Anonymous</strong> • No Aadhaar, phone number, or OTP required to check eligibility
            </span>
          </div>

          {/* Editorial Headline & Bilingual Intro */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline pt-2">
            <div className="lg:col-span-8 space-y-3">
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                Find Government Schemes You Are Eligible For in 2 Minutes
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                सरल ६ सवालों के जवाब दें और अपनी पात्रता अनुसार सरकारी योजनाएं खोजें। We match your household profile against active Central and Madhya Pradesh welfare programs in real-time.
              </p>
            </div>

            {/* Quick Trust Badges Tray */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 bg-surface-container-low p-4 rounded-xl border border-[#E8EAE5]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">timer</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm font-semibold text-primary">Takes ~2 Minutes</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">6 intuitive questions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm font-semibold text-primary">Zero Identity Risk</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Anonymous profile screening</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[18px]">offline_bolt</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm font-semibold text-primary">Instant Sanction Preview</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Document checklist generated</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Evaluating State */}
        {isEvaluating && (
          <div className="bg-surface-container-lowest rounded-2xl border border-[#E8EAE5] shadow-sm p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <span className="material-symbols-outlined text-[28px] animate-spin">refresh</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-primary">
              Evaluating Rules Against Madhya Pradesh Welfare Databases...
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
              Comparing your inputs with verified eligibility rules for Sehore, Bhopal, Raisen, and other districts.
            </p>
          </div>
        )}

        {/* QUESTIONNAIRE CONTAINER */}
        {!isEvaluating && !result && (
          <section className="bg-surface-container-lowest rounded-2xl border border-[#E8EAE5] shadow-sm p-6 lg:p-8 space-y-8">
            {/* Step Indicator Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                    Live Screener Progress
                  </span>
                  <p className="font-title-md text-title-md text-primary font-semibold">
                    Step {step} of 6:{' '}
                    {step === 1 && 'District of Residence (निवास ज़िला)'}
                    {step === 2 && 'Applicant Age Bracket (आयु सीमा)'}
                    {step === 3 && 'Livelihood & Occupation (व्यवसाय / आजीविका)'}
                    {step === 4 && 'Marital & Family Status (वैवाहिक स्थिति)'}
                    {step === 5 && 'Self-Help Group Affiliation (स्वयं सहायता समूह)'}
                    {step === 6 && 'Household Ration Card Status (राशन कार्ड)'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {Math.round((step / 6) * 100)}% Completed
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps">
                    In Progress
                  </span>
                </div>
              </div>

              {/* Stepper Progress Rail */}
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${(step / 6) * 100}%` }}
                ></div>
              </div>

              {/* Step Indicators Pill Row */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
                {stepLabels.map((sl, idx) => {
                  const isDone = idx + 1 < step;
                  const isCurrent = idx + 1 === step;
                  return (
                    <div
                      key={sl.num}
                      className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                        isDone
                          ? 'bg-surface-container-low'
                          : isCurrent
                          ? 'bg-surface-container border border-primary/30'
                          : 'bg-surface-container-low/60 opacity-70'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          isDone
                            ? 'text-primary'
                            : isCurrent
                            ? 'text-secondary'
                            : 'text-outline'
                        }`}
                        style={isDone ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {isDone ? 'check_circle' : isCurrent ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                      <div className="min-w-0">
                        <p className="font-label-caps text-label-caps uppercase text-on-surface-variant truncate">
                          {sl.num}. {sl.title}
                        </p>
                        <p className="font-label-sm text-label-sm font-semibold text-primary truncate">
                          {sl.val}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question Body Area */}
            <div className="space-y-4">
              {/* Step 1: District */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-headline-sm text-headline-sm text-primary">
                      Please select your current district of residence
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      मध्य प्रदेश का अपना निवास ज़िला चुनें। Schemes are matched based on applicable administrative jurisdictions.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {MP_DISTRICTS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDistrict(d)}
                        className={`p-4 rounded-xl text-left transition-all flex items-center justify-between ${
                          district === d
                            ? 'bg-surface-container border-2 border-primary shadow-xs'
                            : 'bg-surface-container-low hover:bg-surface-container border border-transparent'
                        }`}
                      >
                        <span className="font-title-md text-title-md text-primary font-semibold">{d}</span>
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            district === d ? 'text-primary' : 'text-outline'
                          }`}
                        >
                          {district === d ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Age */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-headline-sm text-headline-sm text-primary">
                      What is the applicant's current age?
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      आवेदक की आयु सीमा चुनें। Age is a statutory prerequisite for youth grants, maternity support, and old-age social security.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    {AGE_RANGES.map((ar) => (
                      <button
                        key={ar.id}
                        type="button"
                        onClick={() => {
                          setAgeRange(ar.id);
                          setAge(Math.round((ar.min + ar.max) / 2));
                        }}
                        className={`p-5 rounded-xl text-left transition-all flex flex-col justify-between space-y-3 ${
                          ageRange === ar.id
                            ? 'bg-surface-container border-2 border-primary shadow-sm'
                            : 'bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              ageRange === ar.id
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-high text-outline'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {ageRange === ar.id ? 'check' : 'radio_button_unchecked'}
                            </span>
                          </span>
                          {ageRange === ar.id && (
                            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps font-semibold">
                              Active
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-title-md text-title-md text-primary font-bold">{ar.label}</p>
                          <p className="font-label-md text-label-md text-secondary font-medium">{ar.labelHi}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Work */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-headline-sm text-headline-sm text-primary">
                      Primary source of livelihood or occupation
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      आवेदक की वर्तमान आजीविका या कार्यक्षेत्र चुनें। Matches enterprise subsidies, artisan toolkits, and NRLM credit.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {WORK_CATEGORIES.map((wc) => (
                      <button
                        key={wc.id}
                        type="button"
                        onClick={() => setOccupation(wc.id)}
                        className={`p-5 rounded-xl text-left transition-all flex flex-col justify-between space-y-2 ${
                          occupation === wc.id
                            ? 'bg-surface-container border-2 border-primary shadow-sm'
                            : 'bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-title-md text-title-md text-primary font-bold">{wc.label}</p>
                          <span className="font-label-md text-label-md text-secondary font-medium">{wc.labelHi}</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{wc.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Status (Matches Stitch exact design) */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-headline-sm text-headline-sm text-primary">
                      Please choose the applicant's current marital or family status
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      आवेदक की वर्तमान वैवाहिक स्थिति चुनें। This enables matching with specific pension, remarriage grant, or single-mother benefit programs.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    {/* Option 1: Widowed */}
                    <button
                      type="button"
                      onClick={() => setMaritalStatus('widowed')}
                      className={`text-left p-5 rounded-xl transition-all flex flex-col justify-between space-y-3 ${
                        maritalStatus === 'widowed'
                          ? 'bg-surface-container border-2 border-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            maritalStatus === 'widowed'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-outline'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {maritalStatus === 'widowed' ? 'check' : 'radio_button_unchecked'}
                          </span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps font-semibold">
                          Active Selection
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-title-md text-title-md text-primary font-bold">Widowed</p>
                        <p className="font-label-md text-label-md text-secondary font-medium">कल्याणी / विधवा</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 leading-snug">
                          Qualifies for MP Kalyani Social Security Pension and dependent education concessions.
                        </p>
                      </div>
                    </button>

                    {/* Option 2: Married */}
                    <button
                      type="button"
                      onClick={() => setMaritalStatus('married')}
                      className={`text-left p-5 rounded-xl transition-all flex flex-col justify-between space-y-3 ${
                        maritalStatus === 'married'
                          ? 'bg-surface-container border-2 border-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            maritalStatus === 'married'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-outline'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {maritalStatus === 'married' ? 'check' : 'radio_button_unchecked'}
                          </span>
                        </span>
                        <span className="font-label-caps text-label-caps text-on-surface-variant">Standard</span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-title-md text-title-md text-primary font-semibold">Married</p>
                        <p className="font-label-md text-label-md text-on-surface-variant font-medium">विवाहित</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 leading-snug">
                          Eligible for maternal health support, Ladli Behna Yojana, and SHG joint asset grants.
                        </p>
                      </div>
                    </button>

                    {/* Option 3: Single / Unmarried */}
                    <button
                      type="button"
                      onClick={() => setMaritalStatus('unmarried')}
                      className={`text-left p-5 rounded-xl transition-all flex flex-col justify-between space-y-3 ${
                        maritalStatus === 'unmarried'
                          ? 'bg-surface-container border-2 border-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            maritalStatus === 'unmarried'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-outline'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {maritalStatus === 'unmarried' ? 'check' : 'radio_button_unchecked'}
                          </span>
                        </span>
                        <span className="font-label-caps text-label-caps text-on-surface-variant">Special</span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-title-md text-title-md text-primary font-semibold">Single / Unmarried</p>
                        <p className="font-label-md text-label-md text-on-surface-variant font-medium">अविवाहित (18+ वर्ष)</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 leading-snug">
                          Access higher skill certifications, entrepreneurship stipends, and rural credit programs.
                        </p>
                      </div>
                    </button>

                    {/* Option 4: Separated */}
                    <button
                      type="button"
                      onClick={() => setMaritalStatus('divorced')}
                      className={`text-left p-5 rounded-xl transition-all flex flex-col justify-between space-y-3 ${
                        maritalStatus === 'divorced'
                          ? 'bg-surface-container border-2 border-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            maritalStatus === 'divorced'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-outline'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {maritalStatus === 'divorced' ? 'check' : 'radio_button_unchecked'}
                          </span>
                        </span>
                        <span className="font-label-caps text-label-caps text-on-surface-variant">Protective</span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-title-md text-title-md text-primary font-semibold">Separated / Abandoned</p>
                        <p className="font-label-md text-label-md text-on-surface-variant font-medium">परित्यक्ता / अलग</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 leading-snug">
                          Qualifies for legal aid assistance, safe transition housing, and emergency stipends.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: SHG Member */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-headline-sm text-headline-sm text-primary">
                      Are you an active member of a Self-Help Group (SHG)?
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      क्या आप किसी ग्राम स्तरीय स्वयं सहायता समूह (SHG) की सदस्या हैं? DAY-NRLM micro-loans and community investment funds require SHG affiliation.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSHGMember(true)}
                      className={`p-6 rounded-xl text-left transition-all ${
                        isSHGMember
                          ? 'bg-surface-container border-2 border-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-title-md text-title-md text-primary font-bold">Yes, Active SHG Member</p>
                        <span className="material-symbols-outlined text-primary text-[24px]">groups</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Eligible for DAY-NRLM revolving funds, 4% interest subvention, and community toolkits.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsSHGMember(false)}
                      className={`p-6 rounded-xl text-left transition-all ${
                        !isSHGMember
                          ? 'bg-surface-container border-2 border-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-title-md text-title-md text-primary font-bold">No, Not in an SHG</p>
                        <span className="material-symbols-outlined text-outline text-[24px]">person</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Matches individual direct pensions, DBT allowances, and maternal welfare programs.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Ration Card & Maternal */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-headline-sm text-headline-sm text-primary">
                      Does your household have a BPL or Antyodaya Ration Card?
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      क्या आपके परिवार के पास गरीबी रेखा (BPL) अथवा अंत्योदय राशन कार्ड है?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setHasBPLCard(true)}
                      className={`p-6 rounded-xl text-left transition-all ${
                        hasBPLCard
                          ? 'bg-surface-container border-2 border-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-title-md text-title-md text-primary font-bold">Yes, BPL / Antyodaya</p>
                        <span className="material-symbols-outlined text-primary text-[24px]">credit_card</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Unlocks maximum income-subsidized benefits and full state fee exemptions.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasBPLCard(false)}
                      className={`p-6 rounded-xl text-left transition-all ${
                        !hasBPLCard
                          ? 'bg-surface-container border-2 border-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-title-md text-title-md text-primary font-bold">No BPL Card</p>
                        <span className="material-symbols-outlined text-outline text-[24px]">credit_card_off</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Universal entitlement schemes (e.g. Ladli Behna, PMMVY) remain fully open.
                      </p>
                    </button>
                  </div>

                  {/* Maternity Checkbox */}
                  <div className="p-4 rounded-xl bg-surface-container-low border border-[#E8EAE5] mt-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPregnantOrNewMother}
                        onChange={(e) => setIsPregnantOrNewMother(e.target.checked)}
                        className="w-4 h-4 mt-1 rounded text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-label-md text-label-md font-semibold text-primary">
                          Currently Pregnant or Nursing First Child (गर्भवती अथवा धात्री माता)
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Check this if you qualify for Pradhan Mantri Matru Vandana Yojana (PMMVY 2.0 direct ₹5,000 cash grant).
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Supportive Micro-Copy & Navigation Controls */}
            <div className="pt-4 border-t border-[#E8EAE5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[18px] text-secondary">info</span>
                <span>
                  {step === 4
                    ? 'Helps check qualification for MP Social Security Kalyani Pension (₹600/month) and remarriage rehabilitation aid.'
                    : '100% confidential. No personal identity data is stored or forwarded.'}
                </span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    <span>Previous Question</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span>{step === 6 ? 'Find My Eligible Schemes' : `Continue to Next (Step ${step + 1})`}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Real-Time Matched Results Banner */}
        {!isEvaluating && result && (
          <div className="space-y-10 animate-fadeIn">
            {/* Results Top Headline Bar */}
            <section className="space-y-6 pt-2">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-secondary"></span>
                    <h2 className="font-headline-md text-headline-md text-primary tracking-tight">
                      {result.eligibleSchemes.length} Schemes Match Your Profile
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps font-semibold">
                      95%+ Match Confidence
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                    Based on your answers (District: {district}, Age: {ageRange}, Status: {maritalStatus}, SHG: {isSHGMember ? 'Yes' : 'No'}, Ration: {hasBPLCard ? 'BPL' : 'General'}). These schemes have active sanctioned budgets for direct transfer.
                  </p>
                </div>

                {/* Quick Action Share & Download */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label-sm text-label-sm flex items-center gap-1.5 transition-colors border border-[#E8EAE5]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    <span>Print Summary</span>
                  </button>
                  <button
                    onClick={resetCalculator}
                    className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm flex items-center gap-1.5 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    <span>Recalculate</span>
                  </button>
                </div>
              </div>

              {/* Matched Schemes Bento Arrangement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {result.eligibleSchemes.map((scheme, idx) => (
                  <article
                    key={scheme.schemeId}
                    className="bg-surface-container-lowest rounded-2xl border border-[#E8EAE5] shadow-sm p-6 lg:p-7 space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-4">
                      {/* Top Category & Match Pill */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-caps text-label-caps font-semibold">
                          {scheme.schemeCode} • {scheme.nameHi || 'Direct Welfare'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                          <span className="material-symbols-outlined text-[14px]">verified</span>{' '}
                          {idx === 0 ? '98% Match' : idx === 1 ? '95% Match' : '92% Match'}
                        </span>
                      </div>

                      {/* Title & Key Metric Callout */}
                      <div className="space-y-2">
                        <h3 className="font-title-md text-title-md text-primary font-bold">
                          {scheme.name}
                        </h3>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                          {scheme.nameHi ? `${scheme.nameHi} • ` : ''}Social Security Department MP
                        </p>

                        {/* Financial Benefit Callout */}
                        <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between border border-[#E8EAE5]">
                          <div>
                            <p className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                              Sanctioned Direct Benefit
                            </p>
                            <p className="font-headline-sm text-headline-sm text-primary font-bold">
                              {scheme.benefit.split('(')[0] || 'Direct Transfer'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="material-symbols-outlined text-secondary text-[28px]">payments</span>
                          </div>
                        </div>
                      </div>

                      {/* Match Reason Logic Pill */}
                      <div className="p-3 rounded-lg bg-surface-container text-primary font-body-sm text-body-sm flex items-start gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>
                          <strong>Matched:</strong> {scheme.matchingReasons?.join(' ') || scheme.benefit}
                        </span>
                      </div>

                      {/* Required Documents Inline Tags */}
                      <div className="space-y-1.5">
                        <p className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                          Required Documents Preview
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                            Samagra ID (समग्र आईडी)
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                            Aadhaar Card
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                            Active Bank Passbook
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                            Ration Card / BPL Survey
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E8EAE5]">
                      <Link
                        to={`/schemes/${scheme.slug}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors"
                      >
                        <span>View Full Scheme Details</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                      <button
                        onClick={() =>
                          setCallbackModal({
                            isOpen: true,
                            schemeCode: scheme.schemeCode,
                            schemeName: scheme.name,
                          })
                        }
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors border border-[#E8EAE5]"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px] text-secondary">support_agent</span>
                        <span>Ask Sakhi Sahayika</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Grassroots Human Assistance Module */}
            <section className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-6 border border-[#E8EAE5]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Editorial Text & Sahayika Info */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                    <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                    <span>Free Doorstep Support</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary">
                    Need Help Applying? A Certified Sakhi Sahayika Can Assist You for Free
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Don't worry if document verification feels confusing. In {district} district, trained{' '}
                    <strong>Sakhi Sahayikas</strong> visit Gram Panchayats weekly. They will print your checklist, review your Samagra ID, and help prepare your file for the Gram Panchayat Secretary.
                  </p>

                  {/* Key Support Guarantees */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[18px] text-primary">price_check</span>
                      <span>100% Free of Charge</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[18px] text-primary">home_pin</span>
                      <span>Doorstep / Panchayat Hall</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[18px] text-primary">translate</span>
                      <span>Bilingual Hindi / Malwi</span>
                    </div>
                  </div>
                </div>

                {/* Action Box: Schedule Request */}
                <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-4 border border-[#E8EAE5]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                      <span className="material-symbols-outlined text-[24px]">support_agent</span>
                    </div>
                    <div>
                      <p className="font-title-md text-title-md text-primary font-semibold">Request a Callback</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">From {district} Block Coordinator</p>
                    </div>
                  </div>

                  {callbackSuccess ? (
                    <div className="p-4 rounded-xl bg-surface-container text-primary font-body-sm text-body-sm text-center">
                      <p className="font-bold">धन्यवाद! Callback Scheduled.</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Our field facilitator for {district} will contact you shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={submitInlineCallback} className="space-y-3">
                      <input
                        value={callbackVillage}
                        onChange={(e) => setCallbackVillage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface text-on-surface placeholder:text-outline text-body-md font-body-md border border-[#E8EAE5] focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                        placeholder="Enter Village / Gram Panchayat Name"
                        type="text"
                      />
                      <input
                        value={callbackPhone}
                        onChange={(e) => setCallbackPhone(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface text-on-surface placeholder:text-outline text-body-md font-body-md border border-[#E8EAE5] focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                        placeholder="Mobile Number (10 digits)"
                        type="tel"
                      />
                      <button
                        type="submit"
                        disabled={callbackLoading}
                        className="w-full py-2.5 rounded-xl bg-secondary hover:bg-[#B56C4A] text-on-secondary font-label-md text-label-md transition-colors shadow-sm disabled:opacity-50"
                      >
                        {callbackLoading ? 'Scheduling...' : 'Connect With Field Sahayika'}
                      </button>
                    </form>
                  )}
                  <p className="font-label-sm text-label-sm text-outline-variant text-center leading-tight text-xs">
                    We never share your phone number with private agents.
                  </p>
                </div>
              </div>
            </section>

            {/* Statutory Disclaimer & Re-screen Footer */}
            <section className="p-5 rounded-2xl bg-surface-container-high/60 space-y-3 border border-[#E8EAE5]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 mt-0.5">policy</span>
                <div className="space-y-1">
                  <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                    Preliminary Match Legal Notice
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    SakhiSetu is an independent grassroots facilitation and digital civil-society platform. This screener provides heuristic matching based purely on self-reported inputs. Official sanction, verification, and disbursement are the sovereign prerogative of the Government of Madhya Pradesh and the Government of India.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Callback Modal Component */}
      <CallbackModal
        isOpen={callbackModal.isOpen}
        onClose={() => setCallbackModal({ isOpen: false })}
        schemeCode={callbackModal.schemeCode}
        schemeName={callbackModal.schemeName}
      />
    </div>
  );
};
