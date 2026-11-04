import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Scheme, Campaign } from '../../types';
import { SchemeCardSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Sparkles,
  Search,
  CheckCircle2,
  ArrowRight,
  Heart,
  ShieldCheck,
  Users,
  Building2,
  TrendingUp,
  MapPin,
  ExternalLink,
  Coins,
  Award,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schemesRes, campaignsRes] = await Promise.all([
          api.getSchemes({ limit: 4 }),
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

  const needs = [
    { id: 'Pension', labelHi: 'पेंशन सहायता', labelEn: 'Pension Support', icon: Coins, count: 'SCH-014' },
    { id: 'Livelihood', labelHi: 'आजीविका व ऋण', labelEn: 'Livelihood & Loans', icon: TrendingUp, count: 'SCH-022, 067' },
    { id: 'Health', labelHi: 'मातृत्व व स्वास्थ्य', labelEn: 'Maternal Healthcare', icon: Heart, count: 'SCH-031' },
    { id: 'Education', labelHi: 'शिक्षा व छात्रवृत्ति', labelEn: 'Education & Grants', icon: Award, count: 'SCH-058' },
  ];

  const districts = [
    'Bhopal', 'Sehore', 'Raisen', 'Rajgarh', 'Vidisha', 'Hoshangabad', 'Harda', 'Betul', 'Guna'
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#FAF9F5] border-b border-[#E5E4DE] pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#174C3C]/10 border border-[#174C3C]/20 text-[#174C3C] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'HI' ? 'Company A • मध्य प्रदेश महिला कल्याण पहल' : 'Company A • MP Women Welfare Initiative'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#103A30] leading-[1.15]">
                {t('hero.tagline')}
              </h1>

              <p className="text-base sm:text-lg text-[#727B74] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/eligibility"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#174C3C] hover:bg-[#103A30] text-white px-7 py-3.5 rounded-btn text-base font-semibold shadow-soft hover:shadow-elevated transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('hero.ctaScheme')}</span>
                </Link>

                <Link
                  to="/donate"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C77B59] hover:bg-[#B06544] text-white px-7 py-3.5 rounded-btn text-base font-semibold shadow-soft hover:shadow-elevated transition-all"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{t('hero.ctaDonate')}</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#727B74]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#174C3C]" />
                  <span>{language === 'HI' ? '100% नि:शुल्क व सरकारी स्रोतों से सत्यापित' : '100% Free & State Verified'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#174C3C]" />
                  <span>{language === 'HI' ? '80G कर छूट प्रमाण पत्र उपलब्ध' : 'Instant 80G Tax Certificates'}</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-card p-6 border border-[#E5E4DE] shadow-elevated">
                <div className="flex items-center justify-between pb-4 border-b border-[#FAF9F5]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#174C3C] text-white flex items-center justify-center font-bold text-xs">
                      स
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#202923]">पात्रता त्वरित जांच</p>
                      <p className="text-[10px] text-[#727B74]">Eligibility Quick Check</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#A8BDA8]/30 text-[#103A30] font-semibold px-2 py-0.5 rounded-full">
                    6 Simple Questions
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E5E4DE]/60 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#174C3C] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-semibold text-[#202923]">इंदिरा गांधी राष्ट्रीय विधवा पेंशन</p>
                      <p className="text-[#727B74]">₹600/माह • 18-79 वर्ष • बीपीएल राशन कार्ड</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E5E4DE]/60 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#174C3C] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-semibold text-[#202923]">SHG दीनदयाल अंत्योदय आजीविका ऋण</p>
                      <p className="text-[#727B74]">₹3 लाख तक आसान ऋण • 7% ब्याज अनुदान</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E5E4DE]/60 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#174C3C] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-semibold text-[#202923]">प्रधानमंत्री मातृ वंदना योजना (PMMVY)</p>
                      <p className="text-[#727B74]">₹5,000 नकद सहायता • प्रथम प्रसव एवं पोषण</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/eligibility"
                  className="w-full flex items-center justify-center gap-2 bg-[#174C3C] hover:bg-[#103A30] text-white py-2.5 rounded-btn text-xs font-semibold transition-colors"
                >
                  <span>{language === 'HI' ? 'अपनी पात्रता जांचें' : 'Check Your Eligibility'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BROWSE BY NEED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#103A30]">
            {t('home.byNeedTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#727B74] mt-2">
            {language === 'HI' ? 'अपनी आवश्यकता चुनें और संबंधित सरकारी लाभ जानें' : 'Select your need area to explore corresponding state welfare benefits'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {needs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/schemes?need=${item.id}`)}
                className="p-6 bg-white rounded-card border border-[#E5E4DE] hover:border-[#174C3C] hover:shadow-soft text-left transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#174C3C]/10 text-[#174C3C] group-hover:bg-[#174C3C] group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#202923] group-hover:text-[#174C3C] transition-colors">
                  {language === 'HI' ? item.labelHi : item.labelEn}
                </h3>
                <p className="text-[11px] text-[#727B74] mt-1 font-medium">{item.count}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED SCHEMES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174C3C] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'अद्यतन सरकारी योजनाएं' : 'Updated Government Schemes'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#103A30]">
              {t('home.schemesTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#727B74] mt-1">
              {t('home.schemesSubtitle')}
            </p>
          </div>

          <Link
            to="/schemes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174C3C] hover:text-[#103A30] transition-colors"
          >
            <span>{t('home.viewAllSchemes')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SchemeCardSkeleton />
            <SchemeCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-[#174C3C] bg-[#174C3C]/10 px-2 py-0.5 rounded-sm">
                      {scheme.schemeCode}
                    </span>
                    <span className="text-[10px] font-medium text-[#727B74] bg-[#FAF9F5] px-2 py-0.5 rounded-sm border border-[#E5E4DE]">
                      {scheme.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#202923] mb-2 leading-snug">
                    {language === 'HI' && scheme.nameHi ? scheme.nameHi : scheme.name}
                  </h3>

                  <p className="text-xs text-[#727B74] line-clamp-2 leading-relaxed mb-4">
                    {language === 'HI' && scheme.descriptionHi ? scheme.descriptionHi : scheme.description}
                  </p>

                  <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E5E4DE]/60 mb-4">
                    <span className="text-[10px] font-bold text-[#174C3C] uppercase tracking-wider block">
                      {t('scheme.benefit')}
                    </span>
                    <span className="text-xs font-bold text-[#202923]">
                      {language === 'HI' && scheme.benefitHi ? scheme.benefitHi : scheme.benefit}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#FAF9F5] flex items-center justify-between">
                  <span className="text-[10px] text-[#727B74]">
                    {language === 'HI' ? 'सत्यापित:' : 'Verified:'}{' '}
                    {new Date(scheme.lastCheckedAt).toLocaleDateString('en-IN')}
                  </span>

                  <Link
                    to={`/schemes/${scheme.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#174C3C] hover:text-[#103A30]"
                  >
                    <span>{language === 'HI' ? 'पूर्ण विवरण देखें' : 'View Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. ELIGIBILITY PROMOTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#174C3C] to-[#103A30] rounded-card p-8 sm:p-12 text-white shadow-elevated relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A8BDA8]">
              {language === 'HI' ? 'सरल व गोपनीय पात्रता कैलकुलेटर' : 'Confidential Eligibility Calculator'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              {t('home.eligibilityPromoTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#A8BDA8] leading-relaxed">
              {t('home.eligibilityPromoText')}
            </p>
            <div className="pt-2">
              <Link
                to="/eligibility"
                className="inline-flex items-center gap-2 bg-[#C77B59] hover:bg-[#B06544] text-white px-6 py-3 rounded-btn text-xs sm:text-sm font-bold shadow-soft transition-colors"
              >
                <span>{t('home.eligibilityPromoButton')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BROWSE BY DISTRICT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#103A30]">
            {t('home.byDistrictTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#727B74] mt-1">
            {language === 'HI' ? 'मध्य प्रदेश के इन 9 ज़िलों में सखीसेतु कार्यकर्ता सक्रिय हैं' : 'SakhiSetu operates actively across 9 central Madhya Pradesh districts'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => navigate(`/schemes?district=${d}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E5E4DE] text-xs font-semibold text-[#202923] hover:border-[#174C3C] hover:text-[#174C3C] hover:shadow-xs transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C77B59]" />
              <span>{d}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. ACTIVE DONATION CAMPAIGNS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C77B59] mb-1">
              <Heart className="w-3.5 h-3.5 fill-[#C77B59]" />
              <span>{language === 'HI' ? 'समाज में सीधा बदलाव' : 'Direct Social Impact'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#103A30]">
              {t('home.campaignsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#727B74] mt-1">
              {language === 'HI' ? 'आपका योगदान सीधे ज़रूरतमंद महिलाओं तक पहुंचता है (50% 80G कर छूट सहित)' : 'Support verified grassroots campaigns with immediate 80G tax receipt'}
            </p>
          </div>

          <Link
            to="/campaigns"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174C3C] hover:text-[#103A30] transition-colors"
          >
            <span>{t('home.viewAllCampaigns')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-card border border-[#E5E4DE] overflow-hidden shadow-xs hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {camp.imageUrl && (
                  <div className="h-44 w-full overflow-hidden bg-gray-100">
                    <img
                      src={camp.imageUrl}
                      alt={camp.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <span className="text-[10px] font-bold text-[#C77B59] bg-[#C77B59]/10 px-2 py-0.5 rounded-sm">
                    {camp.category}
                  </span>
                  <h3 className="text-base font-bold text-[#202923] mt-2 mb-2 line-clamp-1">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-[#727B74] line-clamp-2 leading-relaxed mb-4">
                    {camp.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#174C3C]">
                        ₹{camp.collectedAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[#727B74]">
                        {camp.progressPercentage}% of ₹{camp.goalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full bg-[#E5E4DE] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#174C3C] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${camp.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to={`/donate/${camp.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#174C3C] hover:bg-[#103A30] text-white py-2.5 rounded-btn text-xs font-semibold transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>{language === 'HI' ? 'इस अभियान में दान करें' : 'Donate to Campaign'}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TRUST IMPACT STATISTICS */}
      <section className="bg-white border-y border-[#E5E4DE] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
              {language === 'HI' ? 'विश्वास एवं पारदर्शिता' : 'Trust & Proven Scale'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#103A30] mt-1">
              {t('home.impactTitle')}
            </h2>
            <p className="text-xs text-[#727B74] mt-1">
              {language === 'HI' ? 'Company A (भोपाल) द्वारा समर्थित सशक्तिकरण नेटवर्क' : 'Supported by Company A (Bhopal) Operating Network'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-card bg-[#FAF9F5] border border-[#E5E4DE]">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#174C3C]">9</p>
              <p className="text-xs font-semibold text-[#202923] mt-1">
                {language === 'HI' ? 'ज़िलों में सक्रिय कार्यक्षेत्र' : 'Operational Districts'}
              </p>
              <p className="text-[10px] text-[#727B74] mt-0.5">Madhya Pradesh</p>
            </div>

            <div className="p-6 rounded-card bg-[#FAF9F5] border border-[#E5E4DE]">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#174C3C]">1,400+</p>
              <p className="text-xs font-semibold text-[#202923] mt-1">
                {language === 'HI' ? 'ज़मीनी स्वयंसेवक' : 'Grassroots Volunteers'}
              </p>
              <p className="text-[10px] text-[#727B74] mt-0.5">Village-level presence</p>
            </div>

            <div className="p-6 rounded-card bg-[#FAF9F5] border border-[#E5E4DE]">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#174C3C]">12,000+</p>
              <p className="text-xs font-semibold text-[#202923] mt-1">
                {language === 'HI' ? 'समर्पित दाता' : 'Generous Donors'}
              </p>
              <p className="text-[10px] text-[#727B74] mt-0.5">18,000+ Annual contributions</p>
            </div>

            <div className="p-6 rounded-card bg-[#FAF9F5] border border-[#E5E4DE]">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#C77B59]">₹26 Cr</p>
              <p className="text-xs font-semibold text-[#202923] mt-1">
                {language === 'HI' ? 'वार्षिक सामाजिक योगदान' : 'Annual Welfare Impact'}
              </p>
              <p className="text-[10px] text-[#727B74] mt-0.5">Statutory 80G Compliant</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TRANSPARENCY & 80G COMPLIANCE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-card border border-[#E5E4DE] p-8 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#174C3C]/10 text-[#174C3C] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#202923]">
                {language === 'HI' ? 'धारा 80G आयकर छूट' : 'Sec 80G Tax Deductions'}
              </h3>
              <p className="text-xs text-[#727B74] leading-relaxed">
                {language === 'HI'
                  ? 'सखीसेतु को किए गए सभी दान आयकर अधिनियम की धारा 80G(5)(vi) के तहत 50% छूट हेतु मान्य हैं।'
                  : 'All donations are eligible for a 50% deduction under Section 80G of the Indian Income Tax Act, 1961.'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#C77B59]/10 text-[#C77B59] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#202923]">
                {language === 'HI' ? 'तत्काल डिजिटल 80G रसीद' : 'Instant 80G PDF Receipts'}
              </h3>
              <p className="text-xs text-[#727B74] leading-relaxed">
                {language === 'HI'
                  ? 'सफल भुगतान के तुरंत बाद आपको एक यूनिक नंबर वाली आधिकारिक पीडीएफ रसीद प्राप्त होती है।'
                  : 'Download signed demonstration 80G certificates immediately upon successful payment confirmation.'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#103A30]/10 text-[#103A30] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#202923]">
                {language === 'HI' ? 'Form 10BD वार्षिक फाइलिंग' : 'Form 10BD Compliance'}
              </h3>
              <p className="text-xs text-[#727B74] leading-relaxed">
                {language === 'HI'
                  ? 'ट्रस्ट द्वारा सभी दानदाताओं का विवरण आयकर विभाग के फॉर्म 10BD में विधिवत दर्ज किया जाता है।'
                  : 'All verified donations with PAN are compiled for annual Form 10BD electronic return submission.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
