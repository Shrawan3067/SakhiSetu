import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Campaign } from '../../types';
import { Heart, Users, Target, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const { language } = useLanguage();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await api.getPublicCampaigns();
        setCampaigns(data);
      } catch (err) {
        console.error('Failed to load campaigns', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C77B59] bg-[#C77B59]/10 px-3 py-1 rounded-full">
          <Heart className="w-3.5 h-3.5 fill-[#C77B59]" />
          <span>{language === 'HI' ? 'सत्यापित सामाजिक अभियान' : 'Verified Welfare Campaigns'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#103A30]">
          {language === 'HI' ? 'सक्रिय सामाजिक प्रभाव अभियान' : 'Active Welfare & Empowerment Campaigns'}
        </h1>
        <p className="text-sm text-[#727B74] max-w-3xl leading-relaxed">
          {language === 'HI'
            ? 'ग्रामीण एवं आदिवासी क्षेत्रों की महिलाओं के स्वरोजगार, मातृत्व स्वास्थ्य व डिजिटल साक्षरता के लिए संचालित अभियान। आपका प्रत्येक दान धारा 80G के तहत 50% कर छूट हेतु मान्य है।'
            : 'Contribute directly to high-impact grassroots initiatives across rural Madhya Pradesh. All contributions receive instant concurrency-safe 80G tax deduction receipts.'}
        </p>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#174C3C]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-card border border-[#E5E4DE] overflow-hidden shadow-xs hover:shadow-soft transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {camp.imageUrl && (
                  <div className="h-52 w-full overflow-hidden bg-gray-100">
                    <img
                      src={camp.imageUrl}
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#C77B59] bg-[#C77B59]/10 px-2.5 py-0.5 rounded-sm">
                      {camp.category}
                    </span>
                    <span className="text-[11px] font-medium text-[#727B74] flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#174C3C]" />
                      <span>{camp.donorCount || 0} Donors</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#202923] leading-snug line-clamp-2">
                    {camp.title}
                  </h3>

                  <p className="text-xs text-[#727B74] leading-relaxed line-clamp-3">
                    {camp.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#174C3C]">
                        ₹{camp.collectedAmount.toLocaleString('en-IN')} Raised
                      </span>
                      <span className="text-[#727B74]">
                        {camp.progressPercentage}% of ₹{camp.goalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full bg-[#E5E4DE] rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#174C3C] h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${camp.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/donate/${camp.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#174C3C] hover:bg-[#103A30] text-white py-3 rounded-btn text-xs font-bold shadow-soft transition-colors"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{language === 'HI' ? 'इस अभियान में दान करें' : 'Donate to this Campaign'}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
