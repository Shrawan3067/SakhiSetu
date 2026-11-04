import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-[#E8EAE5] w-full max-w-md overflow-hidden relative p-6 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">support_agent</span>
          </div>
          <div>
            <h3 className="font-title-md text-title-md text-primary font-bold">
              {language === 'HI' ? 'सखीसेतु सहायता अनुरोध' : 'Request Sahayika Guidance'}
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              {language === 'HI'
                ? 'हमारे ज़मीनी कार्यकर्ता निःशुल्क सहायता हेतु आपसे संपर्क करेंगे'
                : 'A certified Sakhi field facilitator will assist you for free'}
            </p>
          </div>
        </div>

        {schemeName && (
          <div className="p-3 rounded-xl bg-surface-container-low border border-[#E8EAE5] text-xs">
            <span className="font-semibold text-primary">
              {language === 'HI' ? 'संबंधित योजना:' : 'Scheme:'}{' '}
            </span>
            <span className="text-on-surface font-medium">{schemeName}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-primary-fixed text-on-primary-fixed text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-error-container text-on-error-container text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="font-label-sm text-xs font-semibold text-on-surface">Applicant Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-sm border border-[#E8EAE5] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-xs font-semibold text-on-surface">Phone Number (10 digits) *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98XXXXXXXX"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-sm border border-[#E8EAE5] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-xs font-semibold text-on-surface">District in MP</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-sm border border-[#E8EAE5] focus:outline-hidden cursor-pointer"
              >
                {MP_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-xs font-semibold text-on-surface">Notes or Questions</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Need assistance gathering documents"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-sm border border-[#E8EAE5] focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-secondary hover:bg-[#B56C4A] text-on-secondary font-label-md text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Request Guidance'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
