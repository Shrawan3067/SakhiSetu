import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Scheme } from '../../types';
import { CallbackModal } from '../../components/common/CallbackModal';

export const SchemeDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [relatedSchemes, setRelatedSchemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getSchemeBySlug(slug);
        setScheme(data.scheme);
        setRelatedSchemes(data.relatedSchemes);
      } catch (err: any) {
        setError(err.message || 'Scheme not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center space-y-4">
        <span className="material-symbols-outlined text-4xl text-error">warning</span>
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Scheme Not Found</h2>
        <p className="font-body-sm text-on-surface-variant">{error || 'The requested scheme could not be found.'}</p>
        <Link
          to="/schemes"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold"
        >
          <span>← Back to Schemes Directory</span>
        </Link>
      </div>
    );
  }

  const rules = scheme.eligibilityRules || {};
  const documents = Array.isArray(scheme.requiredDocuments) ? scheme.requiredDocuments : [];
  const steps = Array.isArray(scheme.applicationSteps) ? scheme.applicationSteps : [];

  return (
    <div className="flex flex-col w-full bg-surface animate-fadeIn">
      {/* Editorial Scheme Header */}
      <section className="w-full bg-surface-container-low/70 py-10 px-6 lg:px-12 border-b border-[#E8EAE5]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </Link>
            <span className="text-outline-variant font-label-sm">/</span>
            <Link to="/schemes" className="hover:text-primary transition-colors">
              Schemes Directory
            </Link>
            <span className="text-outline-variant font-label-sm">/</span>
            <span className="text-primary font-semibold">{scheme.schemeCode}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps uppercase font-bold">
                  {scheme.schemeCode}
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium">
                  {scheme.category}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[16px]">bolt</span> DBT Enabled
                </span>
              </div>

              <div className="space-y-1">
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                  {scheme.name}
                </h1>
                {scheme.nameHi && (
                  <p className="font-headline-sm text-headline-sm text-secondary font-medium font-hindi">
                    {scheme.nameHi}
                  </p>
                )}
              </div>

              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                {scheme.description}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/eligibility"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Check My Eligibility</span>
                </Link>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container-highest transition-colors border border-[#E8EAE5]"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  <span>Print Checklist</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCallbackOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:bg-[#B56C4A] shadow-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  <span>Ask Field Sahayika</span>
                </button>
              </div>
            </div>

            {/* Quick Summary Snapshot Card */}
            <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-4 border border-[#E8EAE5]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8EAE5]">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                  Benefit Disbursal
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-medium">
                  Verified Entitlement
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-headline-sm text-headline-sm text-primary font-bold">{scheme.benefit}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Deposited directly into Aadhaar-seeded NPCI bank accounts without intermediate deduction.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low flex items-center gap-3 border border-[#E8EAE5]">
                <span className="material-symbols-outlined text-primary text-[24px]">account_balance</span>
                <div className="min-w-0 flex-1">
                  <p className="font-label-sm text-label-sm font-semibold text-on-surface">Zero Intermediary Fee</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Official processing fee: ₹0.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column Content Grid */}
      <section className="w-full py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Plain-Hindi Summary Box (Human-in-the-loop AI summary if approved) */}
            {scheme.aiReviews && scheme.aiReviews.length > 0 && scheme.aiReviews[0].status === 'APPROVED' && (
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">psychology_alt</span>
                  <h3 className="font-title-md text-title-md text-primary font-bold">
                    योजना का सरल हिंदी सारांश (सत्यापित)
                  </h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed font-hindi">
                  {scheme.aiReviews[0].generatedHindiSummary}
                </p>
              </div>
            )}

            {/* Eligibility Criteria Module */}
            <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm border border-[#E8EAE5] space-y-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">checklist</span>
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Eligibility Criteria &amp; Rules
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rules.minAge !== undefined && (
                  <div className="p-4 rounded-xl bg-surface-container-low border border-[#E8EAE5] space-y-1">
                    <p className="font-label-caps text-on-surface-variant uppercase">Age Requirements</p>
                    <p className="font-title-md text-primary font-bold">
                      {rules.minAge} – {rules.maxAge || 79} Years
                    </p>
                  </div>
                )}

                {rules.maritalStatus && (
                  <div className="p-4 rounded-xl bg-surface-container-low border border-[#E8EAE5] space-y-1">
                    <p className="font-label-caps text-on-surface-variant uppercase">Marital Status</p>
                    <p className="font-title-md text-primary font-bold capitalize">
                      {Array.isArray(rules.maritalStatus)
                        ? rules.maritalStatus.join(', ')
                        : rules.maritalStatus}
                    </p>
                  </div>
                )}

                {rules.requiresBPL !== undefined && (
                  <div className="p-4 rounded-xl bg-surface-container-low border border-[#E8EAE5] space-y-1">
                    <p className="font-label-caps text-on-surface-variant uppercase">BPL Card Requirement</p>
                    <p className="font-title-md text-primary font-bold">
                      {rules.requiresBPL ? 'Mandatory BPL / Antyodaya' : 'Not Required (Universal)'}
                    </p>
                  </div>
                )}

                {rules.requiresSHG !== undefined && (
                  <div className="p-4 rounded-xl bg-surface-container-low border border-[#E8EAE5] space-y-1">
                    <p className="font-label-caps text-on-surface-variant uppercase">SHG Affiliation</p>
                    <p className="font-title-md text-primary font-bold">
                      {rules.requiresSHG ? 'Active SHG Member' : 'Individual Application Open'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-Step Application Roadmap */}
            {steps.length > 0 && (
              <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm border border-[#E8EAE5] space-y-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">route</span>
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                    How to Apply: Step-by-Step
                  </h2>
                </div>

                <div className="space-y-4">
                  {steps.map((st: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low border border-[#E8EAE5]">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="font-title-md text-primary font-semibold">
                          {typeof st === 'string' ? st : st.step || st.title}
                        </p>
                        {typeof st !== 'string' && st.description && (
                          <p className="font-body-sm text-on-surface-variant">{st.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Documents Checklist */}
            {documents.length > 0 && (
              <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm border border-[#E8EAE5] space-y-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[24px]">description</span>
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Required Documents Checklist
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documents.map((doc: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low border border-[#E8EAE5]">
                      <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
                      <span className="font-label-md text-on-surface font-medium">
                        {typeof doc === 'string' ? doc : doc.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Doorstep Support Helpdesk Card */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-[#E8EAE5] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                  <span className="material-symbols-outlined text-[26px]">support_agent</span>
                </div>
                <div>
                  <h3 className="font-title-md text-primary font-bold">Local Sakhi Sahayika</h3>
                  <p className="font-label-sm text-on-surface-variant">Bhopal &amp; 9 Districts Desk</p>
                </div>
              </div>

              <p className="font-body-sm text-on-surface-variant">
                Need help checking documents or filling forms? Our certified field coordinator visits your Gram Panchayat weekly at zero charge.
              </p>

              <button
                onClick={() => setIsCallbackOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:bg-[#B56C4A] shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                <span>Request Free Guidance</span>
              </button>
            </div>

            {/* Official Source Link */}
            {scheme.officialSourceUrl && (
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-[#E8EAE5] space-y-3">
                <span className="font-label-caps text-on-surface-variant uppercase font-semibold">
                  Official Statutory Source
                </span>
                <p className="font-body-sm text-on-surface-variant">
                  Access official government gazette, portal rules, and Jan Seva Kendra links.
                </p>
                <a
                  href={scheme.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-secondary font-label-md font-semibold transition-colors"
                >
                  <span>Open Government Portal</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Callback Modal */}
      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
        schemeCode={scheme.schemeCode}
        schemeName={scheme.name}
      />
    </div>
  );
};
