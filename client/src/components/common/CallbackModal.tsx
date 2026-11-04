import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { PhoneCall, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  schemeCode?: string;
  schemeName?: string;
}

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

export const CallbackModal: React.FC<CallbackModalProps> = ({
  isOpen,
  onClose,
  schemeCode,
  schemeName,
}) => {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Bhopal');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await api.requestHelplineCallback({
        name,
        phone,
        district,
        schemeCode,
        notes: notes || (schemeName ? `Inquiry regarding: ${schemeName}` : undefined),
      });

      setSuccessMessage(res.message);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit callback request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-card shadow-elevated border border-[#E5E4DE] w-full max-w-md overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[#727B74] hover:text-[#202923] hover:bg-[#FAF9F5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#174C3C]/10 text-[#174C3C] flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#202923]">
                {language === 'HI' ? 'सखीसेतु कॉल सहायता अनुरोध' : 'Request Helpline Callback'}
              </h3>
              <p className="text-xs text-[#727B74]">
                {language === 'HI'
                  ? 'हमारे ज़मीनी कार्यकर्ता 24 घंटे में आपसे संपर्क करेंगे'
                  : 'A SakhiSetu field facilitator will call you within 24 hours'}
              </p>
            </div>
          </div>

          {schemeName && (
            <div className="mb-4 p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE] text-xs">
              <span className="font-semibold text-[#174C3C]">
                {language === 'HI' ? 'संबंधित योजना:' : 'Scheme:'}{' '}
              </span>
              <span className="text-[#202923]">{schemeName}</span>
            </div>
          )}

          {successMessage ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#174C3C] mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-[#174C3C]">
                {language === 'HI' ? 'अनुरोध सफलतापूर्वक दर्ज हुआ!' : 'Request Registered!'}
              </h4>
              <p className="text-xs text-[#727B74] leading-relaxed">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  {language === 'HI' ? 'आपका पूरा नाम *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'HI' ? 'उदा. सुमित्रा बाई' : 'e.g. Sumitra Bai'}
                  className="w-full px-3 py-2 text-sm border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  {language === 'HI' ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10 digit mobile number"
                  className="w-full px-3 py-2 text-sm border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  {language === 'HI' ? 'ज़िला (District) *' : 'District *'}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C]"
                >
                  {MP_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  {language === 'HI' ? 'कोई विशेष प्रश्न या टिप्पणी' : 'Optional Question or Notes'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    language === 'HI'
                      ? 'अपनी समस्या या पात्रता संबंधी प्रश्न लिखें...'
                      : 'Briefly describe your query...'
                  }
                  className="w-full px-3 py-2 text-sm border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-btn bg-[#174C3C] hover:bg-[#103A30] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-soft disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === 'HI' ? 'पंजीकृत हो रहा है...' : 'Submitting...'}</span>
                    </>
                  ) : (
                    <span>{language === 'HI' ? 'कॉल अनुरोध भेजें' : 'Request Free Callback'}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
