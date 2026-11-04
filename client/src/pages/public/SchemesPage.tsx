import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Scheme } from '../../types';
import { CallbackModal } from '../../components/common/CallbackModal';

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
  { id: 'All', label: 'All Schemes', count: 38 },
  { id: 'Social Security', label: 'Financial Assistance', count: 11 },
  { id: 'Livelihood & Finance', label: 'Livelihood & Self-Help', count: 9 },
  { id: 'Healthcare & Nutrition', label: 'Healthcare & Maternity', count: 7 },
  { id: 'Education & Training', label: 'Education & Skilling', count: 6 },
];

export const SchemesPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 6, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [district, setDistrict] = useState(searchParams.get('district') || 'All Districts');
  const [page, setPage] = useState(1);

  // Callback Modal state
  const [callbackModal, setCallbackModal] = useState<{
    isOpen: boolean;
    schemeCode?: string;
    schemeName?: string;
  }>({ isOpen: false });

  const fetchSchemes = async () => {
    setIsLoading(true);
    try {
      const res = await api.getSchemes({
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        district: district !== 'All Districts' ? district : undefined,
        page,
        limit: 6,
      });
      setSchemes(res.schemes);
      setPagination(res.pagination);
    } catch (err: any) {
      console.error('Failed to load schemes', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [category, district, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSchemes();
  };

  const clearAllFilters = () => {
    setSearch('');
    setCategory('All');
    setDistrict('All Districts');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8 animate-fadeIn">
      {/* Top Breadcrumb & Header */}
      <section className="space-y-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </Link>
          <span className="text-outline-variant font-label-sm">/</span>
          <span className="text-primary font-semibold">Government Schemes Directory</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Verified with MP e-District &amp; Jan Seva Kendra Portals</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
              Government Schemes &amp; Entitlements Directory
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Discover, filter, and apply for verified central and state-sponsored welfare initiatives designed to support women, families, and self-help groups across Madhya Pradesh.
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar & Category Filter Strip */}
      <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-[#E8EAE5] space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by scheme name, keywords (e.g. 'maternity', 'ration', 'loan'), or nodal department..."
            className="w-full pl-12 pr-28 py-3.5 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md placeholder:text-outline border border-[#E8EAE5] focus:outline-hidden focus:bg-surface-container-lowest transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-on-primary font-label-sm text-label-sm rounded-lg hover:bg-primary-container transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setCategory(cat.id);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl font-label-md text-label-md whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm font-semibold'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E8EAE5]">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2 bg-surface-container-low text-on-surface rounded-xl font-label-md text-label-md border border-[#E8EAE5] focus:outline-hidden cursor-pointer"
            >
              {MP_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearAllFilters}
              className="text-secondary font-label-md text-label-md hover:underline cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </section>

      {/* Discovery Prompt Card */}
      <div className="w-full bg-gradient-to-r from-primary-container via-tertiary-container to-primary-container p-6 rounded-2xl text-on-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary-fixed uppercase tracking-wider font-semibold">
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            Instant Heuristic Screener
          </div>
          <h3 className="font-headline-sm text-headline-sm font-semibold tracking-tight text-on-primary">
            Don't know which documents you have? Run the 2-minute Eligibility Screener
          </h3>
          <p className="font-body-md text-body-md text-on-primary-container max-w-2xl">
            Answer 6 simple anonymous questions regarding your age, district, marital status, and household income to unlock matching scheme checklists.
          </p>
        </div>
        <Link
          to="/eligibility"
          className="z-10 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:bg-secondary/90 transition-all shrink-0 shadow-sm"
        >
          <span>Start Screener</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>

      {/* Schemes Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Showing {schemes.length} of {pagination.total} Schemes
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-on-surface-variant">Loading government schemes...</div>
        ) : schemes.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-12 text-center space-y-3 border border-[#E8EAE5]">
            <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
            <h3 className="font-title-md text-primary font-bold">No schemes match your filter</h3>
            <p className="font-body-sm text-on-surface-variant">Try selecting another district or category.</p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-label-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <article
                key={scheme.id}
                className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#E8EAE5]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold">
                      {scheme.schemeCode}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary font-label-sm text-xs font-semibold">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Verified MP
                    </span>
                  </div>

                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-primary mb-1">
                      {scheme.name}
                    </h3>
                    {scheme.nameHi && (
                      <p className="font-label-md text-secondary font-medium font-hindi mb-2">
                        {scheme.nameHi}
                      </p>
                    )}
                    <div className="p-3.5 rounded-xl bg-surface-container-low my-3 border border-[#E8EAE5]">
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase font-medium">
                        Sanctioned Benefit
                      </p>
                      <p className="font-headline-sm text-headline-sm font-bold text-primary">
                        {scheme.benefit.split('(')[0] || 'Direct Allowance'}
                      </p>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                      {scheme.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-[#E8EAE5] flex items-center justify-between gap-2">
                  <Link
                    to={`/schemes/${scheme.slug}`}
                    className="inline-flex items-center justify-center flex-1 py-2.5 rounded-xl bg-surface-container-high text-primary font-label-md text-label-md font-semibold hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors"
                  >
                    View Guidelines →
                  </Link>
                  <button
                    onClick={() =>
                      setCallbackModal({
                        isOpen: true,
                        schemeCode: scheme.schemeCode,
                        schemeName: scheme.name,
                      })
                    }
                    title="Get Help from Sakhi Sahayika"
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-secondary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">support_agent</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl bg-surface-container text-primary font-label-sm font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 rounded-xl bg-surface-container text-primary font-label-sm font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Callback Modal */}
      <CallbackModal
        isOpen={callbackModal.isOpen}
        onClose={() => setCallbackModal({ isOpen: false })}
        schemeCode={callbackModal.schemeCode}
        schemeName={callbackModal.schemeName}
      />
    </div>
  );
};
