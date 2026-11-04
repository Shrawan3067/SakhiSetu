import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Scheme } from '../../types';
import { CallbackModal } from '../../components/common/CallbackModal';
import {
  CheckCircle2,
  Calendar,
  ExternalLink,
  PhoneCall,
  MapPin,
  FileCheck,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Building2,
  Loader2,
} from 'lucide-react';

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
        <Loader2 className="w-8 h-8 animate-spin text-[#174C3C]" />
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#202923]">Scheme Not Found</h2>
        <p className="text-sm text-[#727B74]">{error || 'The requested scheme could not be found.'}</p>
        <Link
          to="/schemes"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#174C3C] text-white text-xs font-semibold rounded-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Schemes Directory</span>
        </Link>
      </div>
    );
  }

  const rules = scheme.eligibilityRules || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/schemes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#727B74] hover:text-[#174C3C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'HI' ? 'सभी योजनाओं पर वापस जाएं' : 'Back to All Schemes'}</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-card border border-[#E5E4DE] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#174C3C] bg-[#174C3C]/10 px-2.5 py-1 rounded-sm">
              {scheme.schemeCode}
            </span>
            <span className="text-xs font-semibold text-[#727B74] bg-[#FAF9F5] px-2.5 py-1 rounded-sm border border-[#E5E4DE]">
              {scheme.category}
            </span>
            <span className="text-xs font-semibold text-[#C77B59] bg-[#C77B59]/10 px-2.5 py-1 rounded-sm">
              Need: {scheme.need}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#727B74]">
            <span className="inline-flex items-center gap-1 text-[#174C3C] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Verification Verified</span>
            </span>
            <span>•</span>
            <span>
              Last Checked: {new Date(scheme.lastCheckedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#103A30] leading-tight">
            {language === 'HI' && scheme.nameHi ? scheme.nameHi : scheme.name}
          </h1>
          {scheme.nameHi && language !== 'HI' && (
            <p className="text-xs text-[#727B74] mt-1 font-hindi">{scheme.nameHi}</p>
          )}
        </div>

        {/* Highlight Benefit Box */}
        <div className="p-5 rounded-card bg-[#174C3C]/5 border border-[#174C3C]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#174C3C] uppercase tracking-wider block">
              {language === 'HI' ? 'अधिकृत शासकीय लाभ' : 'Official Entitled Benefit'}
            </span>
            <p className="text-lg sm:text-xl font-extrabold text-[#103A30] mt-0.5">
              {language === 'HI' && scheme.benefitHi ? scheme.benefitHi : scheme.benefit}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsCallbackOpen(true)}
              className="inline-flex items-center gap-2 bg-[#C77B59] hover:bg-[#B06544] text-white px-4 py-2.5 rounded-btn text-xs font-bold shadow-soft transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'सहायता कॉल अनुरोध' : 'Request Callback'}</span>
            </button>

            <a
              href={scheme.officialSourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF9F5] border border-[#E5E4DE] text-[#202923] px-4 py-2.5 rounded-btn text-xs font-bold transition-colors"
            >
              <span>{language === 'HI' ? 'सरकारी पोर्टल' : 'Official Portal'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#727B74]" />
            </a>
          </div>
        </div>
      </div>

      {/* Content Grid (2 Columns: Left 8 cols, Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Scheme Purpose & Description */}
          <div className="bg-white rounded-card border border-[#E5E4DE] p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-[#103A30] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#174C3C]" />
              <span>{language === 'HI' ? 'योजना का उद्देश्य एवं विवरण' : 'Scheme Purpose & Details'}</span>
            </h2>
            <p className="text-sm text-[#202923] leading-relaxed">
              {language === 'HI' && scheme.descriptionHi ? scheme.descriptionHi : scheme.description}
            </p>
          </div>

          {/* 2. Who Can Apply (Eligibility Checklist) */}
          <div className="bg-white rounded-card border border-[#E5E4DE] p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-[#103A30] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#174C3C]" />
              <span>{language === 'HI' ? 'पात्रता की शर्तें (Who Can Apply)' : 'Eligibility Criteria'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {rules.minAge !== undefined && (
                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E5E4DE] text-xs">
                  <span className="font-semibold text-[#727B74] block">Age Requirement:</span>
                  <span className="font-bold text-[#202923]">{rules.minAge} to {rules.maxAge || 100} Years</span>
                </div>
              )}

              {rules.maritalStatus && (
                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E5E4DE] text-xs">
                  <span className="font-semibold text-[#727B74] block">Marital Status:</span>
                  <span className="font-bold text-[#202923] capitalize">{rules.maritalStatus.join(', ')}</span>
                </div>
              )}

              {rules.requiresBPL !== undefined && (
                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E5E4DE] text-xs">
                  <span className="font-semibold text-[#727B74] block">BPL Ration Card:</span>
                  <span className="font-bold text-[#202923]">{rules.requiresBPL ? 'Mandatory' : 'Not required'}</span>
                </div>
              )}

              {rules.requiresSHG !== undefined && (
                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E5E4DE] text-xs">
                  <span className="font-semibold text-[#727B74] block">SHG Membership:</span>
                  <span className="font-bold text-[#202923]">{rules.requiresSHG ? 'Registered SHG Member' : 'Open to all'}</span>
                </div>
              )}
            </div>

            {rules.notes && (
              <div className="p-4 rounded-lg bg-[#FAF9F5] border-l-4 border-[#174C3C] text-xs text-[#202923] leading-relaxed">
                <strong>{language === 'HI' ? 'विशेष टिप्पणी:' : 'Official Note:'}</strong> {rules.notes}
              </div>
            )}
          </div>

          {/* 3. Required Documents */}
          <div className="bg-white rounded-card border border-[#E5E4DE] p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-[#103A30] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#174C3C]" />
              <span>{language === 'HI' ? 'आवश्यक दस्तावेज़' : 'Required Documents'}</span>
            </h2>

            <ul className="space-y-2.5">
              {Array.isArray(scheme.requiredDocuments) &&
                scheme.requiredDocuments.map((doc, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE] text-xs text-[#202923]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#174C3C] shrink-0" />
                    <span className="font-medium">
                      {language === 'HI' && doc.nameHi ? doc.nameHi : doc.name}
                    </span>
                    {doc.required && (
                      <span className="ml-auto text-[10px] font-bold text-[#C77B59] uppercase tracking-wider">
                        अनिवार्य (Mandatory)
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          </div>

          {/* 4. Application Process Steps */}
          <div className="bg-white rounded-card border border-[#E5E4DE] p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-[#103A30] flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-[#174C3C]" />
              <span>{language === 'HI' ? 'आवेदन कैसे करें (कदम दर कदम)' : 'Step-by-Step Application Process'}</span>
            </h2>

            <div className="space-y-4 pt-2">
              {Array.isArray(scheme.applicationSteps) &&
                scheme.applicationSteps.map((step) => (
                  <div key={step.step} className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-full bg-[#174C3C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#202923]">{step.title}</h4>
                      <p className="text-xs text-[#727B74] mt-0.5 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Nearest Help Centre Card */}
          {scheme.nearestHelpCentre && (
            <div className="bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#C77B59]" />
                <span>{language === 'HI' ? 'निकटतम सहायता केंद्र' : 'Nearest Help Centre'}</span>
              </div>
              <h3 className="font-bold text-sm text-[#202923]">{scheme.nearestHelpCentre.name}</h3>
              <p className="text-xs text-[#727B74] leading-relaxed">{scheme.nearestHelpCentre.address}</p>
              {scheme.nearestHelpCentre.phone && (
                <div className="pt-2 border-t border-[#FAF9F5] text-xs flex items-center gap-2 text-[#174C3C] font-semibold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{scheme.nearestHelpCentre.phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Applicable Districts */}
          <div className="bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
              {language === 'HI' ? 'मान्य ज़िले (Districts)' : 'Applicable Districts'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(scheme.applicableDistricts) &&
                scheme.applicableDistricts.map((d) => (
                  <span
                    key={d}
                    className="text-[11px] bg-[#FAF9F5] border border-[#E5E4DE] text-[#202923] px-2.5 py-1 rounded-sm font-medium"
                  >
                    {d}
                  </span>
                ))}
            </div>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="bg-[#FAF9F5] rounded-card border border-[#E5E4DE] p-5 text-xs text-[#727B74] space-y-2 leading-relaxed">
            <div className="flex items-center gap-1.5 text-amber-700 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{language === 'HI' ? 'अस्वीकरण (Legal Disclaimer)' : 'Important Disclaimer'}</span>
            </div>
            <p>
              {language === 'HI'
                ? 'सखीसेतु एक स्वतंत्र नागरिक सेवा मंच है। यह मंच किसी सरकारी योजना की वैधानिक स्वीकृति प्रदान नहीं करता है। अंतिम पात्रता सत्यापन और वित्तीय संवितरण संबंधित शासकीय विभाग के क्षेत्राधिकार में है।'
                : 'SakhiSetu is an independent NGO civic service platform. The platform does not officially sanction or approve government welfare grants. Official eligibility verification and disbursement are subject to government scrutiny.'}
            </p>
          </div>

          {/* Related Schemes */}
          {relatedSchemes.length > 0 && (
            <div className="bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
                {language === 'HI' ? 'संबंधित अन्य योजनाएं' : 'Related Schemes'}
              </h4>
              <div className="space-y-2.5">
                {relatedSchemes.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/schemes/${rel.slug}`}
                    className="block p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE] hover:border-[#174C3C] transition-colors"
                  >
                    <span className="text-[10px] font-bold text-[#174C3C]">{rel.schemeCode}</span>
                    <p className="text-xs font-bold text-[#202923] mt-0.5 line-clamp-1">
                      {language === 'HI' && rel.nameHi ? rel.nameHi : rel.name}
                    </p>
                    <p className="text-[10px] text-[#727B74] mt-1 font-medium">{rel.benefit}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Free Callback Modal */}
      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
        schemeCode={scheme.schemeCode}
        schemeName={scheme.name}
      />
    </div>
  );
};
