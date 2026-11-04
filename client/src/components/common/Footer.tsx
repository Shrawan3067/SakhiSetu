import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="w-full bg-surface-container-low border-t border-[#E8EAE5] mt-space-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-space-xl pb-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-lg mb-space-xl">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                <span className="font-bold text-lg font-hindi">स</span>
              </div>
              <span className="font-title-md text-title-md text-primary tracking-tight font-bold">
                {language === 'HI' ? 'सखीसेतु' : 'SakhiSetu'}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              {language === 'HI'
                ? 'मध्य प्रदेश के 9 ज़िलों में महिलाओं की आजीविका, स्वास्थ्य सुरक्षा और सामाजिक स्वावलंबन के लिए समर्पित एक पंजीकृत धर्मार्थ ट्रस्ट।'
                : "Bridging grassroots women's collectives, rural self-help groups, and official state entitlement programs with verifiable transparency and compassionate community stewardship."}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/60">
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
              <span className="font-label-sm text-label-sm text-on-surface">
                Section 8 Non-Profit | Trust 80G Reg: CIT(E)/BPL/80G/2021-22/A-1089
              </span>
            </div>
          </div>

          {/* Portals & Tools */}
          <div className="space-y-3">
            <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
              {language === 'HI' ? 'पोर्टल और साधन' : 'Portals & Tools'}
            </h4>
            <ul className="space-y-2.5">
              <li className="leading-none">
                <Link
                  to="/schemes"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors inline-block"
                >
                  {language === 'HI' ? 'केंद्रीय एवं राज्य योजनाएं' : 'Central & State Schemes'}
                </Link>
              </li>
              <li className="leading-none">
                <Link
                  to="/eligibility"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors inline-block"
                >
                  {language === 'HI' ? 'पात्रता कैलकुलेटर' : 'Eligibility Screener'}
                </Link>
              </li>
              <li className="leading-none">
                <Link
                  to="/campaigns"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors inline-block"
                >
                  {language === 'HI' ? 'सामुदायिक अभियान' : 'Active Impact Campaigns'}
                </Link>
              </li>
              <li className="leading-none">
                <Link
                  to="/donate"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors inline-block"
                >
                  {language === 'HI' ? 'ऑनलाइन दान (80G रसीद)' : 'Online Donation (80G)'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Districts Covered */}
          <div className="space-y-3">
            <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
              {language === 'HI' ? 'कार्यक्षेत्र (9 ज़िले)' : '9 Operational Districts'}
            </h4>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li>• भोपाल (Bhopal) &amp; सीहोर (Sehore)</li>
              <li>• रायसेन (Raisen) &amp; राजगढ़ (Rajgarh)</li>
              <li>• विदिशा (Vidisha) &amp; होशंगाबाद (Hoshangabad)</li>
              <li>• हरदा (Harda), बैतूल (Betul) &amp; गुना (Guna)</li>
            </ul>
          </div>

          {/* Tax Exemption Box */}
          <div className="space-y-3">
            <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
              {language === 'HI' ? 'कर छूट एवं रसीद' : 'Tax & Contributions'}
            </h4>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-[#E8EAE5] space-y-2">
              <p className="font-label-sm text-label-sm font-semibold text-primary">
                {language === 'HI' ? 'धारा 80G छूट' : '80G Tax Exemption'}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {language === 'HI'
                  ? 'सभी दान भारतीय आयकर अधिनियम की धारा 80G के तहत 50% कर कटौती के लिए पात्र हैं। तुरंत डिजिटल रसीद जारी।'
                  : 'All voluntary domestic donations are eligible for a 50% deduction under Section 80G of the Indian Income Tax Act. Instant vector PDF receipts generated.'}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-6 border-t border-[#E8EAE5] space-y-4">
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-xs">
            {language === 'HI'
              ? 'आधिकारिक सूचना: सखीसेतु एक गैर-लाभकारी सुविधा मंच है। सभी योजना मानदंड राज्य व केंद्र सरकार के नियमों के अधीन हैं। अंतिम अनुमोदन सरकारी अधिकारियों द्वारा देय है।'
              : 'Official Statutory Disclaimer: SakhiSetu is an independent grassroots facilitation and social-impact non-profit initiative. SakhiSetu does not represent, execute on behalf of, or replace official statutory portals. Official entitlement sanctions rest solely with designated government authorities.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              © 2024-2025 SakhiSetu Charitable Trust. Built for dignified social equity.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/schemes" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">
                Schemes
              </Link>
              <Link to="/eligibility" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">
                Eligibility
              </Link>
              <Link to="/donate" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
