import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Campaign } from '../../types';

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
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-10 animate-fadeIn">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
            Philanthropic Initiatives
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
          High-Impact Active Welfare Campaigns
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
          Every Rupee routed through SakhiSetu undergoes real-time expenditure verification. 100% of contributions enter verified field projects across 9 districts with instant Section 80G tax certificates.
        </p>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaigns.map((camp) => {
            const percent = Math.min(100, Math.round((camp.collectedAmount / camp.goalAmount) * 100));
            return (
              <div
                key={camp.id}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-[#E8EAE5] flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-surface-container-high">
                    {camp.imageUrl ? (
                      <img src={camp.imageUrl} alt={camp.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-4xl">image</span>
                      </div>
                    )}
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur font-label-sm text-xs font-semibold text-primary">
                      {camp.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="font-title-md text-title-md font-bold text-primary leading-snug">
                      {camp.title}
                    </h3>

                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3">
                      {camp.description}
                    </p>

                    {/* Progress bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between font-label-sm text-xs">
                        <span className="font-bold text-primary">
                          ₹{camp.collectedAmount.toLocaleString('en-IN')} raised
                        </span>
                        <span className="text-on-surface-variant font-medium">
                          Goal: ₹{camp.goalAmount.toLocaleString('en-IN')} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-primary h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#E8EAE5] mt-4">
                  <Link
                    to={`/donate?campaign=${camp.slug || camp.id}`}
                    className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-semibold transition-all shadow-sm"
                  >
                    Donate to this Cause
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
