import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Heart, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-[#103A30] text-[#E5E4DE] pt-14 pb-10 border-t border-[#174C3C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#174C3C]/60">
          {/* Col 1: Trust Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#C77B59] flex items-center justify-center text-white font-bold text-lg font-hindi">
                स
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                {language === 'HI' ? 'सखीसेतु' : 'SakhiSetu'}
              </span>
            </div>
            <p className="text-xs text-[#A8BDA8] leading-relaxed">
              {language === 'HI'
                ? 'मध्य प्रदेश के 9 ज़िलों में महिलाओं की आजीविका, स्वास्थ्य सुरक्षा और सामाजिक स्वावलंबन के लिए समर्पित एक पंजीकृत धर्मार्थ ट्रस्ट (Company A)।'
                : 'A registered charitable trust (Company A) dedicated to grassroots women livelihood development, maternal healthcare, and social welfare across 9 districts in Madhya Pradesh.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#A8BDA8]">
              <ShieldCheck className="w-4 h-4 text-[#C77B59]" />
              <span>Trust 80G Reg: CIT(E)/BPL/80G/2021-22/A-1089</span>
            </div>
          </div>

          {/* Col 2: Public Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {language === 'HI' ? 'त्वरित नेविगेशन' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8BDA8]">
              <li>
                <Link to="/schemes" className="hover:text-white transition-colors">
                  {language === 'HI' ? 'महिला कल्याण योजनाएं' : 'Women Welfare Schemes'}
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-white transition-colors">
                  {language === 'HI' ? 'पात्रता कैलकुलेटर (Eligibility Finder)' : 'Eligibility Calculator'}
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-white transition-colors">
                  {language === 'HI' ? 'सक्रिय सामाजिक अभियान' : 'Active Welfare Campaigns'}
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-white transition-colors">
                  {language === 'HI' ? 'ऑनलाइन दान करें (80G रसीद)' : 'Make a Donation (80G Receipt)'}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  {language === 'HI' ? 'प्रशासक / दाता लॉगिन' : 'Admin & Donor Login'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Operational Coverage (9 Districts) */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {language === 'HI' ? 'कार्यक्षेत्र (9 ज़िले)' : 'Operational Districts'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#A8BDA8]">
              <span>• भोपाल (Bhopal)</span>
              <span>• सीहोर (Sehore)</span>
              <span>• रायसेन (Raisen)</span>
              <span>• राजगढ़ (Rajgarh)</span>
              <span>• विदिशा (Vidisha)</span>
              <span>• होशंगाबाद (Hoshangabad)</span>
              <span>• हरदा (Harda)</span>
              <span>• बैतूल (Betul)</span>
              <span>• गुना (Guna)</span>
            </div>
          </div>

          {/* Col 4: Trust Contact & Helpdesk */}
          <div className="space-y-3 text-xs text-[#A8BDA8]">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {language === 'HI' ? 'संपर्क एवं सहायता' : 'Head Office & Helpdesk'}
            </h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C77B59] shrink-0 mt-0.5" />
              <span>Plot 14, Arera Hills, Bhopal, Madhya Pradesh - 462011</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C77B59] shrink-0" />
              <span>हेल्पलाइन: 1800-890-7254 / 0755-2551234</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#C77B59] shrink-0" />
              <span>sahayata@sakhisetu.org</span>
            </div>
          </div>
        </div>

        {/* Legal & FCRA Compliance Notice */}
        <div className="pt-6 space-y-3 text-[11px] text-[#A8BDA8]/80 leading-relaxed">
          <p>
            <strong className="text-white">80G & Form 10BD Statutory Compliance:</strong> Donations to SakhiSetu are eligible for 50% deduction under Section 80G(5)(vi) of the Income Tax Act, 1961. Unique donation receipts and certificates are allocated through concurrency-safe atomic sequence numbering. Annual Form 10BD electronic statements are filed electronically with the Income Tax Department.
          </p>
          <p>
            <strong className="text-white">FCRA Notice:</strong> Foreign currency contributions and international credit cards are strictly outside the scope of this platform and cannot be processed. Only domestic Indian INR contributions are accepted.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#174C3C] text-[#A8BDA8]">
            <span>© {new Date().getFullYear()} SakhiSetu Charitable Trust (Company A, Bhopal). All rights reserved.</span>
            <span className="text-[10px] mt-2 sm:mt-0 text-[#C77B59]">Demonstration & Code Review Version • Built for Isocode Labs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
