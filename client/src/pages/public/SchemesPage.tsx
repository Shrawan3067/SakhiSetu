import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Scheme } from '../../types';
import { SchemeCardSkeleton } from '../../components/common/LoadingSkeleton';
import { CallbackModal } from '../../components/common/CallbackModal';
import {
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ArrowRight,
  PhoneCall,
  AlertCircle,
  X,
} from 'lucide-react';

const MP_DISTRICTS = [
  'All Districts',
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

const CATEGORIES = [
  'All Categories',
  'Social Security',
  'Livelihood & Finance',
  'Healthcare & Nutrition',
  'Education & Training',
];

const NEEDS = ['All Needs', 'Pension', 'Livelihood', 'Health', 'Education'];

export const SchemesPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 6, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [district, setDistrict] = useState(searchParams.get('district') || 'All Districts');
  const [need, setNeed] = useState(searchParams.get('need') || 'All Needs');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Callback Modal state
  const [callbackModal, setCallbackModal] = useState<{
    isOpen: boolean;
    schemeCode?: string;
    schemeName?: string;
  }>({ isOpen: false });

  const fetchSchemes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getSchemes({
        search: search.trim() || undefined,
        category: category !== 'All Categories' ? category : undefined,
        district: district !== 'All Districts' ? district : undefined,
        need: need !== 'All Needs' ? need : undefined,
        page,
        limit: 6,
      });
      setSchemes(res.schemes);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load schemes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [category, district, need, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSchemes();
  };

  const clearAllFilters = () => {
    setSearch('');
    setCategory('All Categories');
    setDistrict('All Districts');
    setNeed('All Needs');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#174C3C] bg-[#174C3C]/10 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{language === 'HI' ? 'सत्यापित शासकीय योजनाएं' : 'Verified State Welfare Directory'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#103A30]">
          {language === 'HI' ? 'महिला कल्याण योजनाएं' : 'Women Welfare Schemes'}
        </h1>
        <p className="text-sm text-[#727B74] max-w-3xl">
          {language === 'HI'
            ? 'मध्य प्रदेश सरकार एवं केंद्र सरकार द्वारा संचालित महिला सशक्तिकरण, पेंशन, आजीविका और स्वास्थ्य योजनाओं की सत्यापित जानकारी।'
            : 'Explore verified government welfare schemes across livelihood, social security, maternal health, and education across 9 Madhya Pradesh districts.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-card border border-[#E5E4DE] p-5 shadow-xs space-y-4">
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#727B74] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                language === 'HI'
                  ? 'योजना का नाम, कोड (उदा. SCH-014) या कीवर्ड खोजें...'
                  : 'Search by title, scheme code (e.g. SCH-014), or keyword...'
              }
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#174C3C] hover:bg-[#103A30] text-white text-xs font-semibold rounded-btn transition-colors"
          >
            {language === 'HI' ? 'खोजें' : 'Search'}
          </button>
        </form>

        {/* Dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#FAF9F5]">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-[#727B74] mb-1">
              {language === 'HI' ? 'श्रेणी (Category)' : 'Category'}
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn bg-[#FAF9F5] focus:outline-hidden focus:border-[#174C3C]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-semibold text-[#727B74] mb-1">
              {language === 'HI' ? 'ज़िला (District)' : 'District'}
            </label>
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn bg-[#FAF9F5] focus:outline-hidden focus:border-[#174C3C]"
            >
              {MP_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Need */}
          <div>
            <label className="block text-[11px] font-semibold text-[#727B74] mb-1">
              {language === 'HI' ? 'ज़रूरत (Need Area)' : 'Need Area'}
            </label>
            <select
              value={need}
              onChange={(e) => {
                setNeed(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn bg-[#FAF9F5] focus:outline-hidden focus:border-[#174C3C]"
            >
              {NEEDS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear filters badge if applied */}
        {(search || category !== 'All Categories' || district !== 'All Districts' || need !== 'All Needs') && (
          <div className="flex items-center gap-2 pt-2 text-xs text-[#727B74]">
            <span>Active filters:</span>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-[#C77B59] hover:underline font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-card bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchSchemes} className="ml-auto underline font-semibold text-xs">
            Retry
          </button>
        </div>
      )}

      {/* Scheme Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SchemeCardSkeleton />
          <SchemeCardSkeleton />
          <SchemeCardSkeleton />
        </div>
      ) : schemes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-card border border-[#E5E4DE] p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF9F5] text-[#727B74] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202923]">
            {language === 'HI' ? 'कोई योजना नहीं मिली' : 'No schemes match your criteria'}
          </h3>
          <p className="text-xs text-[#727B74] max-w-md mx-auto">
            {language === 'HI'
              ? 'कृपया अपने खोज शब्द या फ़िल्टर बदलकर पुनः प्रयास करें अथवा हेल्पलाइन से सहायता लें।'
              : 'Try clearing some filters or searching with a different keyword.'}
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-[#174C3C] text-white text-xs font-semibold rounded-btn"
          >
            {language === 'HI' ? 'फ़िल्टर हटाएं' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs hover:shadow-soft transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#174C3C] bg-[#174C3C]/10 px-2 py-0.5 rounded-sm">
                    {scheme.schemeCode}
                  </span>
                  <span className="text-[10px] font-medium text-[#727B74] bg-[#FAF9F5] px-2 py-0.5 rounded-sm border border-[#E5E4DE]">
                    {scheme.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#202923] mb-2 leading-snug group-hover:text-[#174C3C] transition-colors">
                  {language === 'HI' && scheme.nameHi ? scheme.nameHi : scheme.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#727B74] line-clamp-2 leading-relaxed mb-4">
                  {language === 'HI' && scheme.descriptionHi ? scheme.descriptionHi : scheme.description}
                </p>

                {/* Benefit Box */}
                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E5E4DE]/60 mb-4">
                  <span className="text-[9px] font-bold text-[#174C3C] uppercase tracking-wider block">
                    {language === 'HI' ? 'शासकीय लाभ' : 'Official Benefit'}
                  </span>
                  <span className="text-xs font-bold text-[#202923]">
                    {language === 'HI' && scheme.benefitHi ? scheme.benefitHi : scheme.benefit}
                  </span>
                </div>

                {/* Who can apply summary */}
                {scheme.eligibilityRules?.notes && (
                  <p className="text-[11px] text-[#727B74] italic mb-4 line-clamp-1">
                    "{scheme.eligibilityRules.notes}"
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-[#FAF9F5] space-y-3">
                <div className="flex items-center justify-between text-[10px] text-[#727B74]">
                  <span className="inline-flex items-center gap-1 text-[#174C3C] font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Official Portal</span>
                  </span>
                  <span>Verified: {new Date(scheme.lastCheckedAt).toLocaleDateString('en-IN')}</span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/schemes/${scheme.slug}`}
                    className="flex-1 text-center py-2 bg-[#174C3C] hover:bg-[#103A30] text-white text-xs font-semibold rounded-btn transition-colors"
                  >
                    {language === 'HI' ? 'पूर्ण विवरण देखें' : 'View Details'}
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
                    title="Request callback"
                    className="p-2 border border-[#E5E4DE] text-[#174C3C] hover:bg-[#FAF9F5] rounded-btn transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-[#E5E4DE]">
          <p className="text-xs text-[#727B74]">
            Showing page <span className="font-bold text-[#202923]">{pagination.page}</span> of{' '}
            <span className="font-bold text-[#202923]">{pagination.totalPages}</span> ({pagination.total} schemes total)
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-[#E5E4DE] text-xs font-semibold rounded-btn disabled:opacity-40 hover:bg-white"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={page === pagination.totalPages}
              className="px-3 py-1.5 border border-[#E5E4DE] text-xs font-semibold rounded-btn disabled:opacity-40 hover:bg-white"
            >
              Next
            </button>
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
