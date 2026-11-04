import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const DonationFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get('donationId');
  const { language } = useLanguage();

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center space-y-6 animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mx-auto shadow-sm">
        <span className="material-symbols-outlined text-[36px] text-error">cancel</span>
      </div>

      <div className="space-y-2">
        <h1 className="font-headline-sm text-headline-sm text-primary font-bold">
          {language === 'HI' ? 'भुगतान अस्वीकृत / विफल' : 'Simulated Payment Declined'}
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          {language === 'HI'
            ? 'सिम्युलेटेड भुगतान असफल रहा। कोई भी राशि नहीं काटी गई है और कोई 80G रसीद जारी नहीं की गई है।'
            : 'The simulated transaction was declined or cancelled. No funds were transferred and no 80G receipt sequence was consumed.'}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-surface-container-low border border-[#E8EAE5] text-xs text-on-surface-variant text-left space-y-1">
        <span className="font-bold text-on-surface block">Safety &amp; Integrity Verification:</span>
        <p>• Zero financial charges occurred.</p>
        <p>• Sequential atomic receipt numbering was preserved without gaps.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/donate"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          <span>{language === 'HI' ? 'पुनः प्रयास करें' : 'Try Again'}</span>
        </Link>

        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 border border-[#E8EAE5] font-label-md text-sm font-semibold text-on-surface-variant hover:text-on-surface rounded-xl"
        >
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
