import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Scheme, Campaign } from '../../types';

export const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schemesRes, campaignsRes] = await Promise.all([
          api.getSchemes({ limit: 3 }),
          api.getPublicCampaigns(),
        ]);
        setSchemes(schemesRes.schemes);
        setCampaigns(campaignsRes.slice(0, 3));
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-surface py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Content (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high shadow-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-caps text-label-caps tracking-wider uppercase text-on-surface-variant font-semibold">
                  {language === 'HI' ? 'मध्य प्रदेश में महिला सशक्तिकरण' : 'Empowering Women Across Madhya Pradesh'}
                </span>
              </div>

              {/* Editorial Headline */}
              <h1 className="font-display-hero text-headline-lg lg:text-display-hero text-primary tracking-tight font-bold">
                {language === 'HI' ? (
                  <>
                    हर महिला को सम्मान से जीने और <span className="text-secondary italic font-serif">सशक्त</span> होने का अधिकार है।
                  </>
                ) : (
                  <>
                    Every Woman Deserves An Opportunity to <span className="text-secondary italic font-serif">Thrive.</span>
                  </>
                )}
              </h1>

              {/* Supporting Copy */}
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                {language === 'HI'
                  ? 'सत्यापित सरकारी कल्याण योजनाओं की खोज करें, रियायती ऋण सहायता प्राप्त करें और मध्य प्रदेश के ग्रामीण व शहरी क्षेत्रों में स्थायी बदलाव लाने वाली पहलों से जुड़ें।'
                  : 'Discover verified government welfare schemes, unlock subsidized credit channels, and champion grassroots community initiatives creating dignified change across rural and urban Madhya Pradesh.'}
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
                <Link
                  to="/eligibility"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container shadow-md transition-all group"
                >
                  <span>{language === 'HI' ? 'अपनी योजना खोजें' : 'Find Your Scheme'}</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  to="/donate"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md hover:bg-on-secondary-container shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                  <span>{language === 'HI' ? 'दान करें' : 'Make a Donation'}</span>
                </Link>
              </div>

              {/* Trust Metric Micro-Bar */}
              <div className="pt-6 w-full">
                <div className="p-4 rounded-xl bg-surface-container-low shadow-sm grid grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">9</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {language === 'HI' ? 'ज़िले कवर' : 'Districts Reached'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">12,000+</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {language === 'HI' ? 'सत्यापित दाता' : 'Verified Donors'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">1,400+</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {language === 'HI' ? 'सक्रिय सखी कार्यकर्ता' : 'Active Volunteers'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Visual (Right 5 Cols) */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-md lg:max-w-none">
                {/* Background organic glow */}
                <div className="absolute -inset-4 rounded-3xl bg-surface-container-highest/60 filter blur-2xl -z-10"></div>

                {/* Main Hero Image Frame */}
                <div className="rounded-3xl overflow-hidden shadow-xl bg-surface-container-lowest border border-[#E8EAE5]">
                  <img
                    className="w-full h-[460px] object-cover"
                    alt="Indian woman artisan in Madhya Pradesh smiling warmly, weaving traditional handloom textiles"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFKW4iWphcOGB-einEMgbhcBKIHjIF7tMw_9N_RQPbMa7lYm78bP0GXtO21N86bEvBL5DAfYEXtZX6VXtC1AE7ZnrYcCD-RKiuFJma7Of2he2VjcskcIAQMheU515kNNbBfUa-uabsPBZ1IR0Gb9YzdaW08uw3B8GFR4X84h4ysqc5SsssgB8G9Pq5htFW9TAzDM4XGtr_ZzhKVLI4RMIYxhasyZb5nsglNOX3bzMB"
                  />
                </div>

                {/* Floating Trust Badge 1 */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-surface-container-lowest p-3.5 rounded-2xl shadow-xl max-w-[220px] hidden sm:flex items-center gap-3 border border-[#E8EAE5]">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">verified</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm font-bold text-on-surface leading-tight">Explore 38+ Schemes</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Validated State Portals</p>
                  </div>
                </div>

                {/* Floating Impact Badge 2 */}
                <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-surface-container-lowest p-4 rounded-2xl shadow-xl max-w-[240px] flex items-center gap-3 border border-[#E8EAE5]">
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">diversity_1</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm font-bold text-on-surface leading-tight">Grassroots Stewardship</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Empowering Self-Help Groups</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: IMPACT METRICS SCORECARD */}
      <section className="w-full py-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-caps text-label-caps tracking-widest uppercase text-secondary font-semibold">
                Measurable Stewardship
              </span>
              <h2 className="font-headline-md text-headline-md text-primary font-bold mt-1">
                Ground Realities in Madhya Pradesh
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
              Quarterly audited figures verified by independent field surveyors across 114 Gram Panchayats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metric 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#E8EAE5]">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary text-[28px]">volunteer_activism</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                  Active
                </span>
              </div>
              <div className="border-l-4 border-secondary pl-3 my-2">
                <p className="font-display-hero-mobile text-display-hero-mobile font-bold text-primary">12,000+</p>
                <p className="font-title-md text-title-md text-on-surface font-semibold mt-1">Patrons &amp; Donors</p>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Dedicated citizens and philanthropic collectives backing rural household independence.
              </p>
            </div>

            {/* Metric 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#E8EAE5]">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary text-[28px]">receipt_long</span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm">
                  Audited
                </span>
              </div>
              <div className="border-l-4 border-primary pl-3 my-2">
                <p className="font-display-hero-mobile text-display-hero-mobile font-bold text-primary">18,000+</p>
                <p className="font-title-md text-title-md text-on-surface font-semibold mt-1">Direct Contributions</p>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                100% verifiable ledger tracked with instant Section 80G digital certificates.
              </p>
            </div>

            {/* Metric 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#E8EAE5]">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary text-[28px]">map</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                  MP Central
                </span>
              </div>
              <div className="border-l-4 border-secondary pl-3 my-2">
                <p className="font-display-hero-mobile text-display-hero-mobile font-bold text-primary">9</p>
                <p className="font-title-md text-title-md text-on-surface font-semibold mt-1">Districts Covered</p>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Operational reach from Bhopal, Sehore, Raisen, to remote clusters of Hoshangabad and Betul.
              </p>
            </div>

            {/* Metric 4 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#E8EAE5]">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary text-[28px]">group_work</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm">
                  Fieldforce
                </span>
              </div>
              <div className="border-l-4 border-primary pl-3 my-2">
                <p className="font-display-hero-mobile text-display-hero-mobile font-bold text-primary">1,400+</p>
                <p className="font-title-md text-title-md text-on-surface font-semibold mt-1">Grassroots Sakhis</p>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Trained village animators conducting door-to-door entitlement verification clinics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WOMEN'S SCHEMES SHOWCASE */}
      <section className="w-full py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <span className="font-label-caps text-label-caps tracking-widest uppercase text-secondary font-semibold">
                Government Schemes Directory
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-2">
                Opportunities Within Your Reach
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
                Navigating state entitlements should not require bureaucracy or intermediaries. Discover tailored welfare programs designed for your life stage.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/schemes"
                className="inline-flex items-center gap-2 font-label-md text-label-md text-primary font-bold hover:text-secondary transition-colors"
              >
                <span>View All 38 Welfare Programs</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Schemes Grid (3 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: State Widow Pension */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#E8EAE5]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-medium">
                    Financial Support
                  </span>
                  <span className="material-symbols-outlined text-outline text-[20px]">account_balance_wallet</span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-primary mb-2">
                  State Kalyani (Widow) Pension Benefit
                </h3>
                <div className="p-3 rounded-xl bg-surface-container-low my-3">
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-medium">Direct Monthly Entitlement</p>
                  <p className="font-headline-sm text-headline-sm font-bold text-primary">
                    ₹600 <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">/ month illustrative</span>
                  </p>
                </div>
                <div className="space-y-2 mt-4 text-on-surface">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Eligible for widowed women aged 18 to 79 residing permanently in Madhya Pradesh.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Direct transfer to Aadhaar-seeded bank account with zero intermediate charges.
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6">
                <div className="py-2 px-3 rounded-lg bg-surface-container-high/60 mb-4">
                  <p className="font-label-sm text-label-sm text-on-surface-variant italic">
                    Demonstration values · Subject to MP Social Security Department rules.
                  </p>
                </div>
                <Link
                  to="/schemes/state-kalyani-pension-scheme"
                  className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-surface-container-high text-primary font-label-md text-label-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors"
                >
                  Read Eligibility Guidelines →
                </Link>
              </div>
            </div>

            {/* Card 2: SHG Livelihood Loan */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#E8EAE5]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-medium">
                    Livelihood &amp; Enterprise
                  </span>
                  <span className="material-symbols-outlined text-outline text-[20px]">storefront</span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-primary mb-2">
                  Self-Help Group (SHG) Livelihood Loan
                </h3>
                <div className="p-3 rounded-xl bg-surface-container-low my-3">
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-medium">Credit Facility Allocation</p>
                  <p className="font-headline-sm text-headline-sm font-bold text-secondary">
                    Up to ₹3,00,000 <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">subsidized credit</span>
                  </p>
                </div>
                <div className="space-y-2 mt-4 text-on-surface">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Exclusively for registered rural SHG women with 6+ months continuous record-keeping.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Interest subvention under DAY-NRLM bringing effective interest down to 4% p.a.
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6">
                <div className="py-2 px-3 rounded-lg bg-surface-container-high/60 mb-4">
                  <p className="font-label-sm text-label-sm text-on-surface-variant italic">
                    NABARD &amp; State Rural Livelihood Mission (MPSRLM) aligned scheme.
                  </p>
                </div>
                <Link
                  to="/schemes/shg-livelihood-loan-scheme"
                  className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-surface-container-high text-primary font-label-md text-label-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors"
                >
                  Access Group Application Flow →
                </Link>
              </div>
            </div>

            {/* Card 3: Maternity Cash Benefit */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#E8EAE5]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-medium">
                    Healthcare &amp; Nutrition
                  </span>
                  <span className="material-symbols-outlined text-outline text-[20px]">child_care</span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-primary mb-2">
                  Pradhan Mantri Matru Vandana (PMMVY)
                </h3>
                <div className="p-3 rounded-xl bg-surface-container-low my-3">
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-medium">Direct Cash Incentive</p>
                  <p className="font-headline-sm text-headline-sm font-bold text-primary">
                    ₹5,000 <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">in 2 scheduled tranches</span>
                  </p>
                </div>
                <div className="space-y-2 mt-4 text-on-surface">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Supports pregnant women and lactating mothers for institutional clinical care.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Facilitated directly at local Anganwadi Centers with SakhiSetu desk assistance.
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6">
                <div className="py-2 px-3 rounded-lg bg-surface-container-high/60 mb-4">
                  <p className="font-label-sm text-label-sm text-on-surface-variant italic">
                    Ministry of Women and Child Development &amp; NHM norms.
                  </p>
                </div>
                <Link
                  to="/schemes/pm-matru-vandana-yojana"
                  className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-surface-container-high text-primary font-label-md text-label-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors"
                >
                  Check Required Documents →
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Centered Action */}
          <div className="mt-12 text-center">
            <Link
              to="/schemes"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container shadow-md transition-all"
            >
              <span>Explore All Central &amp; MP State Schemes</span>
              <span className="material-symbols-outlined text-[18px]">travel_explore</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE ELIGIBILITY FINDER PROMOTIONAL BANNER */}
      <section className="w-full py-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl bg-primary text-on-primary p-8 sm:p-12 lg:p-16 shadow-xl">
            {/* Background Decorative SVG Geometry */}
            <svg
              className="absolute top-0 right-0 w-96 h-96 text-primary-container/30 -mr-16 -mt-16 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 400 400"
            >
              <circle cx="200" cy="200" opacity="0.4" r="180"></circle>
              <circle cx="200" cy="200" opacity="0.6" r="120"></circle>
              <circle cx="200" cy="200" opacity="0.8" r="60"></circle>
            </svg>

            <div className="relative z-10 max-w-3xl flex flex-col items-start space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px]">psychology_alt</span>
                <span>2-Minute Confidential Screener</span>
              </div>

              <h2 className="font-headline-lg text-headline-lg font-bold text-on-primary">
                Not Sure Which Scheme Matches Your Situation?
              </h2>

              <p className="font-body-lg text-body-lg text-primary-fixed-dim leading-relaxed">
                Answer 6 simple anonymous questions regarding your age, district, marital status, and household income. Our algorithmic engine instantly maps you to all available welfare benefits with step-by-step documentation checklists.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/eligibility"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-secondary text-on-secondary font-title-md text-title-md hover:bg-on-secondary-container shadow-md transition-all group"
                >
                  <span>Check My Eligibility Now</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                    bolt
                  </span>
                </Link>
                <div className="flex items-center gap-2 text-on-primary-container font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>100% Free · No Personal Identity Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ACTIVE CAMPAIGNS FOR DONORS */}
      <section className="w-full py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="font-label-caps text-label-caps tracking-widest uppercase text-secondary font-semibold">
                Philanthropic Initiatives
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-1">
                High-Impact Active Campaigns
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-2">
                Every Rupee routed through SakhiSetu undergoes real-time expenditure verification. 80G tax receipts generated instantly.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/campaigns"
                className="inline-flex items-center gap-2 font-label-md text-label-md text-primary font-bold hover:text-secondary transition-colors"
              >
                <span>View All Philanthropy Drives</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Campaign Cards Grid (3 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Campaign 1: Health */}
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#E8EAE5]">
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-surface-container-high">
                  <img
                    className="w-full h-full object-cover"
                    alt="Mobile health clinic van providing prenatal maternal healthcare to rural women"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0yZrBNsf5tCCWRpEqyvrgn7PynsUcqw1WFExML40GciCuOiN06sO1rfju4R2iL7i1q_tCDL9ugpZq8w4mgTC9_MhNQBEC53p2guBzH5WgPF1xZ1xESy-19KpghEa-BLI_BkFvmEgoN2V_VmEL-36v0cx_ctdYRlIk81O_UOcVEZ1KQ4-Z-tO9312ChFihJTFw88k-9ZshDLic-DZtouos9GVoCsQwlUPe5lRLf9sH"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur text-primary font-label-sm text-label-sm font-semibold">
                    Healthcare
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-title-md text-title-md font-bold text-primary mb-2">
                    Women's Health &amp; Mobile Clinics
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-4">
                    Funding bi-weekly diagnostic vans equipped with hemoglobin testing, ultrasound, and prenatal supplements across 24 remote habitations.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between font-label-sm text-label-sm">
                      <span className="font-bold text-primary">₹8,40,000 raised</span>
                      <span className="text-on-surface-variant font-medium">Goal: ₹12,00,000 (70%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to="/donate?campaign=health-vans"
                  className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm"
                >
                  Donate to this Cause
                </Link>
              </div>
            </div>

            {/* Campaign 2: Artisan */}
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#E8EAE5]">
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-surface-container-high">
                  <img
                    className="w-full h-full object-cover"
                    alt="Rural women artisans in Chhindwara working together on hand-spinning cotton yarn"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAujDufzPHzuINJT1kSBH6Ld-ks3XFpe5_7aESEsQ2woEtmBNM6GD8Mw5701Uh2bFuaOR2Ltv2rpJjj70tvYKIMg1uXykFfnv6Pt-ve50-P67c8GkvhO77qZAHESQFvoJmG2y1tSJi6WXOiVuPeELTid2ViRamIr57FmbwCOZr6gMqePYzCSpIRFH2ixXjYWe8dI6VhtKuQjVsiKGcxqeiZjQ0UFgp9QfghczzYS5pp"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur text-secondary font-label-sm text-label-sm font-semibold">
                    Livelihood
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-title-md text-title-md font-bold text-primary mb-2">
                    Rural Artisan &amp; Loom Incubator
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-4">
                    Direct procurement of handlooms, zero-chemical natural vegetable dye kits, and fair-market digital catalog setup for 60 tribal artisans.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between font-label-sm text-label-sm">
                      <span className="font-bold text-secondary">₹5,10,000 raised</span>
                      <span className="text-on-surface-variant font-medium">Goal: ₹6,00,000 (85%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to="/donate?campaign=handloom-clusters"
                  className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md hover:bg-on-secondary-container transition-colors shadow-sm"
                >
                  Donate to this Cause
                </Link>
              </div>
            </div>

            {/* Campaign 3: Education */}
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#E8EAE5]">
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-surface-container-high">
                  <img
                    className="w-full h-full object-cover"
                    alt="Young rural teenage girls learning digital literacy on tablets"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnGMmSC1b7YlbL4MlJGkMysFCz8FOLz-IMsIEHfGU3XPMaCx8Z_V73HN1KaXXORkuRh7Jl1kQ3iydvAcTVE6PLAlcrlWj7oals0LYKjAQJgz1z-CVGxEw-Z7fqxUOJWVZoXTI3BC9aNyfyudSgU0Ep9p2LfUMBufdCvULP0MmgWxbNTv10SkqGWS6wkUFcmroqK_lpHpxJCOcKtA217Aq6VS1Whrk8BgvQPsTS-WYM"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur text-primary font-label-sm text-label-sm font-semibold">
                    Education
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-title-md text-title-md font-bold text-primary mb-2">
                    Kanya Shiksha &amp; Digital Literacy Pods
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-4">
                    Setting up solar-powered tablet learning kiosks and competitive scholarship stipends for 300 first-generation girl students.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between font-label-sm text-label-sm">
                      <span className="font-bold text-primary">₹9,20,000 raised</span>
                      <span className="text-on-surface-variant font-medium">Goal: ₹10,00,000 (92%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to="/donate?campaign=girls-education"
                  className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm"
                >
                  Donate to this Cause
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TRANSPARENCY & STATUTORY COMPLIANCE GUARANTEE */}
      <section className="w-full py-16 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-label-caps text-label-caps tracking-widest uppercase text-secondary font-semibold">
              Institutional Credibility
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-1">
              Built on Radical Transparency
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              We operate under uncompromising public audits, statutory non-profit standards, and zero intermediaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Trust Box 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col items-start space-y-3 border border-[#E8EAE5]">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[26px]">verified_user</span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-primary">Digital 80G Certificates</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Eligible for 50% deduction under Section 80G of the Indian Income Tax Act. Instant download with Form 10BE filing.
              </p>
            </div>

            {/* Trust Box 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col items-start space-y-3 border border-[#E8EAE5]">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[26px]">query_stats</span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-primary">Real-time Fund Ledger</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Every rupee disbursed to beneficiary accounts is published on our public open-audit dashboard updated monthly.
              </p>
            </div>

            {/* Trust Box 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col items-start space-y-3 border border-[#E8EAE5]">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[26px]">fact_check</span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-primary">Independent Audits</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Annual operational &amp; financial audits vetted by licensed chartered accountants compliant with Section 8 regulations.
              </p>
            </div>

            {/* Trust Box 4 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col items-start space-y-3 border border-[#E8EAE5]">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[26px]">front_hand</span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-primary">Zero Brokerage Guarantee</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                SakhiSetu volunteers charge zero facilitation fees. No commission taken from entitlement recipients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: ILLUSTRATIVE COMMUNITY TESTIMONIALS */}
      <section className="w-full py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <span className="font-label-caps text-label-caps tracking-widest uppercase text-secondary font-semibold">
              Voices From The Field
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-1">
              Dignity, Agency &amp; Sustainable Impact
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Real narratives of perseverance and change supported through grassroots guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Story 1 */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between border border-[#E8EAE5]">
              <div>
                <div className="flex items-center gap-1 text-secondary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-body-md text-on-surface italic leading-relaxed mb-6">
                  "After my husband passed away, government offices were overwhelming. A Sakhi volunteer in Sehore helped me file my widow pension and bank papers without spending a single paisa on middlemen."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t-0 bg-surface-container-low p-3 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
                  GB
                </div>
                <div>
                  <p className="font-label-md text-label-md font-bold text-on-surface">Geeta Bai</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Sehore District · Pension Recipient</p>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between border border-[#E8EAE5]">
              <div>
                <div className="flex items-center gap-1 text-secondary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-body-md text-on-surface italic leading-relaxed mb-6">
                  "Our 10-woman SHG received ₹2,50,000 subsidized micro-credit through the NRLM channel. Today, we supply cold-pressed mustard oil across Mandi centers. We are now financially sovereign."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t-0 bg-surface-container-low p-3 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold">
                  SV
                </div>
                <div>
                  <p className="font-label-md text-label-md font-bold text-on-surface">Sunita Verma</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Hoshangabad · SHG Collective Leader</p>
                </div>
              </div>
            </div>

            {/* Story 3 */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between border border-[#E8EAE5]">
              <div>
                <div className="flex items-center gap-1 text-secondary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-body-md text-on-surface italic leading-relaxed mb-6">
                  "As a regular philanthropic supporter, SakhiSetu's complete expenditure traceability and prompt 80G tax generation give me deep confidence that 100% of my contribution serves rural women."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t-0 bg-surface-container-low p-3 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold">
                  AR
                </div>
                <div>
                  <p className="font-label-md text-label-md font-bold text-on-surface">Dr. Arvind Rao</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Bhopal · Recurring Philanthropic Donor</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Note: Authentic illustrative field impact narratives documented under written voluntary consent.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: GOVERNMENT STATUTORY CLARIFICATION NOTE */}
      <section className="w-full py-8 bg-surface-container-high/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-[#E8EAE5]">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">policy</span>
            </div>
            <div className="space-y-1">
              <p className="font-label-md text-label-md font-bold text-primary">Public Information Transparency Notice</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                SakhiSetu is an independent non-profit grassroots facilitation initiative (CIN: U85300DL2021NPL389021). All welfare scheme criteria and figures are published for civic awareness and subject to change by respective Central and Madhya Pradesh State Government ministries. Official approvals rest solely with designated administrative officers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
