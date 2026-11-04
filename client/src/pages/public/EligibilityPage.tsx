import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { EligibilityResult } from '../../types';
import { CallbackModal } from '../../components/common/CallbackModal';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  PhoneCall,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  CreditCard,
  Heart,
  Loader2,
} from 'lucide-react';

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

const OCCUPATIONS = [
  { id: 'Homemaker', labelHi: 'गृहिणी (Homemaker)', labelEn: 'Homemaker' },
  { id: 'Agriculture', labelHi: 'कृषि / किसान (Agriculture / Farming)', labelEn: 'Agriculture / Farmer' },
  { id: 'Daily Wage Labourer', labelHi: 'दैनिक मजदूर (Daily Wage Labourer)', labelEn: 'Daily Wage Labourer' },
  { id: 'Small Artisan/Self-Employed', labelHi: 'लघु उद्यमी / हस्तशिल्प (Artisan / Self-Employed)', labelEn: 'Small Artisan / Self-Employed' },
  { id: 'Student', labelHi: 'छात्रा / अध्ययनरत (Student)', labelEn: 'Student' },
  { id: 'Salaried', labelHi: 'वेतनभोगी (Salaried Private/Govt)', labelEn: 'Salaried' },
  { id: 'Other', labelHi: 'अन्य (Other)', labelEn: 'Other' },
];

const MARITAL_STATUSES = [
  { id: 'unmarried', labelHi: 'अविवाहित (Unmarried)', labelEn: 'Unmarried' },
  { id: 'married', labelHi: 'विवाहित (Married)', labelEn: 'Married' },
  { id: 'widowed', labelHi: 'विधवा (Widowed)', labelEn: 'Widowed' },
  { id: 'divorced', labelHi: 'परित्यक्ता / तलाकशुदा (Separated / Divorced)', labelEn: 'Divorced / Separated' },
];

export const EligibilityPage: React.FC = () => {
  const { language } = useLanguage();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Answers State
  const [district, setDistrict] = useState('Bhopal');
  const [age, setAge] = useState<number>(30);
  const [occupation, setOccupation] = useState('Homemaker');
  const [maritalStatus, setMaritalStatus] = useState<'unmarried' | 'married' | 'widowed' | 'divorced'>('married');
  const [isSHGMember, setIsSHGMember] = useState<boolean>(false);
  const [hasBPLCard, setHasBPLCard] = useState<boolean>(true);
  const [isPregnantOrNewMother, setIsPregnantOrNewMother] = useState<boolean>(false);

  // Results State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#174C3C] bg-[#174C3C]/10 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'HI' ? 'सटीक एवं निष्पक्ष पात्रता मिलान' : 'Deterministic Rule Matching'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#103A30]">
          {language === 'HI' ? 'महिला कल्याण पात्रता कैलकुलेटर' : 'Welfare Scheme Eligibility Calculator'}
        </h1>
        <p className="text-xs sm:text-sm text-[#727B74] max-w-xl mx-auto">
          {language === 'HI'
            ? 'केवल 6 सरल प्रश्नों के उत्तर दें और जानें कि आप किन-किन सरकारी योजनाओं के तहत आर्थिक व सामाजिक लाभ पाने की पात्र हैं।'
            : 'Answer 6 simple confidential questions to determine preliminary matching against verified government criteria.'}
        </p>
      </div>

      {/* Evaluating loader */}
      {isEvaluating && (
        <div className="p-16 text-center space-y-4 bg-white rounded-card border border-[#E5E4DE] shadow-xs">
          <Loader2 className="w-10 h-10 animate-spin text-[#174C3C] mx-auto" />
          <h3 className="text-lg font-bold text-[#202923]">
            {language === 'HI' ? 'सरकारी नियमों से मिलान किया जा रहा है...' : 'Evaluating Rules Against State Criteria...'}
          </h3>
          <p className="text-xs text-[#727B74]">
            Evaluating district, age brackets, BPL entitlement, and SHG status deterministically.
          </p>
        </div>
      )}

      {/* QUESTIONNAIRE STEPS */}
      {!isEvaluating && !result && (
        <div className="bg-white rounded-card border border-[#E5E4DE] shadow-elevated p-6 sm:p-10 space-y-8">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-[#727B74]">
              <span className="text-[#174C3C]">
                {language === 'HI' ? `चरण ${step} / ${totalSteps}` : `Step ${step} of ${totalSteps}`}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-[#E5E4DE] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#174C3C] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: District */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#C77B59]" />
                <span>{language === 'HI' ? 'प्रश्न 1 / 6: निवास ज़िला' : 'Question 1 / 6: District'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#202923]">
                {language === 'HI' ? 'आप मध्य प्रदेश के किस ज़िले में निवास करती हैं?' : 'Which district of Madhya Pradesh do you reside in?'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {MP_DISTRICTS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDistrict(d)}
                    className={`p-3.5 text-left rounded-card border text-xs sm:text-sm font-semibold transition-all ${
                      district === d
                        ? 'border-[#174C3C] bg-[#174C3C]/10 text-[#174C3C] shadow-xs'
                        : 'border-[#E5E4DE] bg-[#FAF9F5] text-[#202923] hover:border-[#174C3C]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{d}</span>
                      {district === d && <CheckCircle2 className="w-4 h-4 text-[#174C3C]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Age */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-[#C77B59]" />
                <span>{language === 'HI' ? 'प्रश्न 2 / 6: आपकी आयु' : 'Question 2 / 6: Age'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#202923]">
                {language === 'HI' ? 'आपकी वर्तमान आयु (वर्षों में) कितनी है?' : 'What is your current age (in completed years)?'}
              </h2>
              <div className="max-w-xs space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={14}
                    max={99}
                    value={age}
                    onChange={(e) => setAge(Math.max(14, Math.min(99, parseInt(e.target.value, 10) || 18)))}
                    className="w-32 px-4 py-3 text-2xl font-bold border-2 border-[#174C3C] rounded-btn text-center text-[#174C3C] focus:outline-hidden"
                  />
                  <span className="text-sm font-semibold text-[#727B74]">
                    {language === 'HI' ? 'वर्ष' : 'Years Old'}
                  </span>
                </div>
                <p className="text-xs text-[#727B74]">
                  {language === 'HI'
                    ? 'आयु के आधार पर विधवा पेंशन (18-79 वर्ष) व लाड़ली बहना (21-60 वर्ष) का मिलान किया जाता है।'
                    : 'Age helps evaluate state widow pension (18-79 yrs) and Ladli Behna (21-60 yrs).'}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Occupation */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-[#C77B59]" />
                <span>{language === 'HI' ? 'प्रश्न 3 / 6: आपका व्यवसाय' : 'Question 3 / 6: Occupation'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#202923]">
                {language === 'HI' ? 'आपका मुख्य व्यवसाय / कार्य क्या है?' : 'What is your primary occupation or livelihood?'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {OCCUPATIONS.map((occ) => (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setOccupation(occ.id)}
                    className={`p-3.5 text-left rounded-card border text-xs sm:text-sm font-semibold transition-all ${
                      occupation === occ.id
                        ? 'border-[#174C3C] bg-[#174C3C]/10 text-[#174C3C] shadow-xs'
                        : 'border-[#E5E4DE] bg-[#FAF9F5] text-[#202923] hover:border-[#174C3C]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{language === 'HI' ? occ.labelHi : occ.labelEn}</span>
                      {occupation === occ.id && <CheckCircle2 className="w-4 h-4 text-[#174C3C]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Marital Status */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider">
                <Users className="w-4 h-4 text-[#C77B59]" />
                <span>{language === 'HI' ? 'प्रश्न 4 / 6: वैवाहिक स्थिति' : 'Question 4 / 6: Marital Status'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#202923]">
                {language === 'HI' ? 'आपकी वैवाहिक स्थिति क्या है?' : 'What is your marital status?'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {MARITAL_STATUSES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMaritalStatus(m.id as any)}
                    className={`p-3.5 text-left rounded-card border text-xs sm:text-sm font-semibold transition-all ${
                      maritalStatus === m.id
                        ? 'border-[#174C3C] bg-[#174C3C]/10 text-[#174C3C] shadow-xs'
                        : 'border-[#E5E4DE] bg-[#FAF9F5] text-[#202923] hover:border-[#174C3C]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{language === 'HI' ? m.labelHi : m.labelEn}</span>
                      {maritalStatus === m.id && <CheckCircle2 className="w-4 h-4 text-[#174C3C]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: SHG Membership */}
          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider">
                <Users className="w-4 h-4 text-[#C77B59]" />
                <span>{language === 'HI' ? 'प्रश्न 5 / 6: स्व-सहायता समूह (SHG)' : 'Question 5 / 6: Self-Help Group'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#202923]">
                {language === 'HI'
                  ? 'क्या आप किसी पंजीकृत महिला स्व-सहायता समूह (SHG) की सक्रिय सदस्य हैं?'
                  : 'Are you an active member of a registered women Self-Help Group (SHG)?'}
              </h2>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSHGMember(true)}
                  className={`p-5 text-center rounded-card border text-sm font-bold transition-all ${
                    isSHGMember
                      ? 'border-[#174C3C] bg-[#174C3C]/10 text-[#174C3C] shadow-xs'
                      : 'border-[#E5E4DE] bg-[#FAF9F5] text-[#202923]'
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-[#174C3C]" />
                  <span>{language === 'HI' ? 'हाँ, सदस्य हूँ' : 'Yes, Member'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSHGMember(false)}
                  className={`p-5 text-center rounded-card border text-sm font-bold transition-all ${
                    !isSHGMember
                      ? 'border-[#174C3C] bg-[#174C3C]/10 text-[#174C3C] shadow-xs'
                      : 'border-[#E5E4DE] bg-[#FAF9F5] text-[#202923]'
                  }`}
                >
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-[#727B74]" />
                  <span>{language === 'HI' ? 'नहीं, सदस्य नहीं हूँ' : 'No, Not a member'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 6: BPL Card & Maternity Status */}
          {step === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-[#C77B59]" />
                  <span>{language === 'HI' ? 'प्रश्न 6 / 6: बीपीएल राशन कार्ड' : 'Question 6 / 6: BPL Ration Card'}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#202923]">
                  {language === 'HI'
                    ? 'क्या आपके पास गरीबी रेखा से नीचे (BPL) या अंत्योदय राशन कार्ड है?'
                    : 'Do you hold a valid Below Poverty Line (BPL) or Antyodaya ration card?'}
                </h2>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => setHasBPLCard(true)}
                    className={`p-4 text-center rounded-card border text-sm font-bold transition-all ${
                      hasBPLCard
                        ? 'border-[#174C3C] bg-[#174C3C]/10 text-[#174C3C]'
                        : 'border-[#E5E4DE] bg-[#FAF9F5] text-[#202923]'
                    }`}
                  >
                    <span>{language === 'HI' ? 'हाँ, BPL कार्ड है' : 'Yes, I have BPL Card'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHasBPLCard(false)}
                    className={`p-4 text-center rounded-card border text-sm font-bold transition-all ${
                      !hasBPLCard
                        ? 'border-[#174C3C] bg-[#174C3C]/10 text-[#174C3C]'
                        : 'border-[#E5E4DE] bg-[#FAF9F5] text-[#202923]'
                    }`}
                  >
                    <span>{language === 'HI' ? 'नहीं है' : 'No BPL Card'}</span>
                  </button>
                </div>
              </div>

              {/* Maternity Option */}
              <div className="pt-4 border-t border-[#FAF9F5] space-y-2">
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE]">
                  <input
                    type="checkbox"
                    checked={isPregnantOrNewMother}
                    onChange={(e) => setIsPregnantOrNewMother(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-[#174C3C] rounded-sm focus:ring-[#174C3C]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#202923]">
                      {language === 'HI'
                        ? 'क्या आप वर्तमान में गर्भवती हैं या प्रथम संतान की धात्री माता हैं?'
                        : 'Are you currently pregnant or nursing your first child?'}
                    </span>
                    <p className="text-[#727B74] mt-0.5">
                      {language === 'HI'
                        ? 'प्रधानमंत्री मातृ वंदना योजना (₹5,000 नकद सहायता) के सटीक मिलान हेतु'
                        : 'Helps evaluate Pradhan Mantri Matru Vandana Yojana cash assistance'}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-[#FAF9F5]">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#727B74] hover:text-[#202923] disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'HI' ? 'पिछला' : 'Previous'}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-[#174C3C] hover:bg-[#103A30] text-white px-6 py-2.5 rounded-btn text-xs sm:text-sm font-semibold shadow-soft transition-colors"
            >
              <span>
                {step === totalSteps
                  ? language === 'HI'
                    ? 'पात्र योजनाएं खोजें'
                    : 'Calculate Eligible Schemes'
                  : language === 'HI'
                  ? 'आगे बढ़ें'
                  : 'Next Step'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* RESULTS VIEW */}
      {!isEvaluating && result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Banner */}
          <div className="bg-white rounded-card border border-[#E5E4DE] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174C3C] bg-[#174C3C]/10 px-2.5 py-0.5 rounded-sm mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Deterministic Rules Evaluated</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#103A30]">
                {language === 'HI'
                  ? `आपको ${result.totalMatched} योजनाओं के लिए पात्र पाया गया`
                  : `You Matched ${result.totalMatched} Welfare Schemes`}
              </h2>
              <p className="text-xs text-[#727B74] mt-1">
                Evaluated across {result.evaluatedCount} active state and central welfare schemes.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetCalculator}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#E5E4DE] text-xs font-semibold rounded-btn hover:bg-[#FAF9F5] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'HI' ? 'पुनः जांच करें' : 'Recalculate'}</span>
              </button>

              <button
                onClick={() => setCallbackModal({ isOpen: true })}
                className="inline-flex items-center gap-1.5 bg-[#C77B59] hover:bg-[#B06544] text-white px-4 py-2 rounded-btn text-xs font-bold shadow-soft transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{language === 'HI' ? 'सहायता कॉल' : 'Get Help'}</span>
              </button>
            </div>
          </div>

          {/* Matched Schemes List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#103A30] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#174C3C]" />
              <span>{language === 'HI' ? '100% पात्रता मिलान योजनाएं' : 'Fully Eligible Schemes (100% Match)'}</span>
            </h3>

            {result.eligibleSchemes.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-card border border-[#E5E4DE] space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <h4 className="font-bold text-sm text-[#202923]">
                  {language === 'HI' ? 'कोई पूर्ण मिलान नहीं मिला' : 'No complete rule matches found'}
                </h4>
                <p className="text-xs text-[#727B74] max-w-md mx-auto">
                  {language === 'HI'
                    ? 'आपकी वर्तमान आयु, BPL अथवा SHG स्थिति के आधार पर कोई पूर्ण मेल नहीं हुआ। नीचे दी गई संभावित योजनाएं देखें अथवा हमारे कार्यकर्ता से सहायता लें।'
                    : 'Based on your age and category, no 100% matches occurred. Explore potential schemes below or speak with our field facilitator.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.eligibleSchemes.map((scheme) => (
                  <div
                    key={scheme.schemeId}
                    className="bg-white rounded-card border-2 border-[#174C3C] p-6 shadow-soft space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-[#174C3C] bg-[#174C3C]/10 px-2 py-0.5 rounded-sm">
                          {scheme.schemeCode}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>100% Match</span>
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#202923] mb-2">
                        {language === 'HI' && scheme.nameHi ? scheme.nameHi : scheme.name}
                      </h4>

                      <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E5E4DE] mb-3">
                        <span className="text-[9px] font-bold text-[#174C3C] uppercase tracking-wider block">
                          {language === 'HI' ? 'शासकीय लाभ' : 'Entitled Benefit'}
                        </span>
                        <span className="text-xs font-bold text-[#202923]">
                          {language === 'HI' && scheme.benefitHi ? scheme.benefitHi : scheme.benefit}
                        </span>
                      </div>

                      {/* Matching reasons */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-[#727B74] uppercase tracking-wider">
                          {language === 'HI' ? 'पात्रता कारण:' : 'Why You Qualify:'}
                        </span>
                        <ul className="space-y-1 text-xs text-[#202923]">
                          {scheme.satisfiedRequirements.map((r, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#174C3C] shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#FAF9F5] flex gap-2">
                      <Link
                        to={`/schemes/${scheme.slug}`}
                        className="flex-1 text-center py-2 bg-[#174C3C] hover:bg-[#103A30] text-white text-xs font-semibold rounded-btn transition-colors"
                      >
                        {language === 'HI' ? 'आवेदन विवरण देखें' : 'View Application Details'}
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          setCallbackModal({
                            isOpen: true,
                            schemeCode: scheme.schemeCode,
                            schemeName: scheme.name,
                          })
                        }
                        className="p-2 border border-[#E5E4DE] text-[#174C3C] hover:bg-[#FAF9F5] rounded-btn"
                        title="Request assistance callback"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Potential Matches (Partially Matched) */}
          {result.potentialSchemes && result.potentialSchemes.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#E5E4DE]">
              <h3 className="text-base font-bold text-[#727B74]">
                {language === 'HI' ? 'संभावित योजनाएं (कुछ शर्तें बाकी हैं)' : 'Potential Schemes (Criteria Partially Met)'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.potentialSchemes.map((scheme) => (
                  <div key={scheme.schemeId} className="bg-[#FAF9F5] rounded-card border border-[#E5E4DE] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#727B74]">{scheme.schemeCode}</span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        {scheme.matchScore}% Matched
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#202923]">
                      {language === 'HI' && scheme.nameHi ? scheme.nameHi : scheme.name}
                    </h4>

                    {scheme.unmetRequirements && (
                      <div className="space-y-1 text-[11px] text-[#727B74]">
                        <span className="font-semibold text-amber-700">Missing criteria:</span>
                        <ul className="list-disc pl-4 space-y-0.5">
                          {scheme.unmetRequirements.map((u: string, idx: number) => (
                            <li key={idx}>{u}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link
                      to={`/schemes/${scheme.slug}`}
                      className="inline-block text-xs font-bold text-[#174C3C] hover:underline"
                    >
                      {language === 'HI' ? 'योजना के नियम देखें →' : 'Review Scheme Criteria →'}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Non-Approval Disclaimer */}
          <div className="p-4 rounded-card bg-[#FAF9F5] border-l-4 border-amber-600 text-xs text-[#727B74] leading-relaxed space-y-1">
            <span className="font-bold text-amber-900 block">
              {language === 'HI' ? 'महत्वपूर्ण वैधानिक सूचना (Non-Approval Disclaimer):' : 'Statutory Disclaimer:'}
            </span>
            <p>{result.disclaimer.hi}</p>
            <p className="italic text-[11px] pt-1">{result.disclaimer.en}</p>
          </div>
        </div>
      )}

      {/* Free Callback Modal */}
      <CallbackModal
        isOpen={callbackModal.isOpen}
        onClose={() => setCallbackModal({ isOpen: false })}
        schemeCode={callbackModal.schemeCode}
        schemeName={callbackModal.schemeName}
      />
    </div>
  );
};
