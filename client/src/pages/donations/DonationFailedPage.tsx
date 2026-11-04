import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { XCircle, RotateCcw, ArrowLeft, ShieldAlert } from 'lucide-react';

export const DonationFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get('donationId');
  const { language } = useLanguage();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
        <XCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[#202923]">
          {language === 'HI' ? 'भुगतान अस्वीकृत / विफल' : 'Simulated Payment Declined'}
        </h1>
        <p className="text-xs text-[#727B74] leading-relaxed">
          {language === 'HI'
            ? 'सिम्युलेटेड भुगतान असफल रहा। कोई भी राशि नहीं काटी गई है और कोई 80G रसीद जारी नहीं की गई है।'
            : 'The simulated transaction was declined or cancelled. No funds were transferred and no 80G receipt was allocated.'}
        </p>
      </div>

      <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE] text-xs text-[#727B74] text-left space-y-1">
        <span className="font-bold text-[#202923] block">Safety & Integrity Check:</span>
        <p>• Zero financial charges occurred.</p>
        <p>• Sequential receipt number allocation was safeguarded from incrementing.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/donate"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-btn hover:bg-[#103A30] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'HI' ? 'पुनः प्रयास करें' : 'Try Again'}</span>
        </Link>

        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border border-[#E5E4DE] text-xs font-semibold text-[#727B74] hover:text-[#202923] rounded-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
};
