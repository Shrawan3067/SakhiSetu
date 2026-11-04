import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Scheme } from '../../types';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import {
  FileText,
  Plus,
  Sparkles,
  Edit,
  Eye,
  Archive,
  CheckCircle2,
  Trash2,
  Search,
  ExternalLink,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react';

export const AdminSchemesPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingAiId, setGeneratingAiId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Search & Status filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('ALL');

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [modalForm, setModalForm] = useState({
    schemeCode: '',
    name: '',
    nameHi: '',
    category: 'Social Security',
    need: 'Pension',
    description: '',
    descriptionHi: '',
    benefit: '',
    benefitHi: '',
    officialSourceUrl: 'https://socialjustice.mp.gov.in',
    status: 'PUBLISHED',
  });
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSchemes = async () => {
    setIsLoading(true);
    try {
      const res = await api.getSchemes({ limit: 50 });
      setSchemes(res.schemes);
    } catch (err) {
      console.error('Failed to load schemes for admin', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingScheme(null);
    setModalForm({
      schemeCode: `SCH-0${Math.floor(70 + Math.random() * 29)}`,
      name: '',
      nameHi: '',
      category: 'Social Security',
      need: 'Livelihood',
      description: '',
      descriptionHi: '',
      benefit: '',
      benefitHi: '',
      officialSourceUrl: 'https://mp.gov.in',
      status: 'PUBLISHED',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (scheme: Scheme) => {
    setEditingScheme(scheme);
    setModalForm({
      schemeCode: scheme.schemeCode,
      name: scheme.name,
      nameHi: scheme.nameHi || '',
      category: scheme.category,
      need: scheme.need,
      description: scheme.description,
      descriptionHi: scheme.descriptionHi || '',
      benefit: scheme.benefit,
      benefitHi: scheme.benefitHi || '',
      officialSourceUrl: scheme.officialSourceUrl,
      status: scheme.status,
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setModalError(null);

    try {
      if (editingScheme) {
        await api.updateAdminScheme(editingScheme.id, modalForm);
        setSuccessToast(`Scheme '${modalForm.schemeCode}' updated successfully!`);
      } else {
        await api.createAdminScheme({
          ...modalForm,
          eligibilityRules: {
            minAge: 18,
            maxAge: 70,
            maritalStatus: ['all'],
            requiresBPL: false,
            requiresSHG: false,
          },
          requiredDocuments: [{ name: 'Aadhaar Card', required: true }],
          applicationSteps: [{ step: 1, title: 'Visit Local Kiosk', description: 'Apply online.' }],
          applicableDistricts: ['Bhopal', 'Sehore', 'Raisen', 'Rajgarh', 'Vidisha'],
        });
        setSuccessToast(`New Scheme '${modalForm.schemeCode}' created successfully!`);
      }

      setIsModalOpen(false);
      fetchSchemes();
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      setModalError(err.message || 'Failed to save scheme');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateAiSummary = async (scheme: Scheme) => {
    setGeneratingAiId(scheme.id);
    try {
      await api.generateAISchemeSummary(scheme.id);
      setSuccessToast(`AI Hindi summary generated for ${scheme.schemeCode}! Queued in Review Desk.`);
      setTimeout(() => {
        setSuccessToast(null);
        navigate('/admin/ai-reviews');
      }, 1500);
    } catch (err: any) {
      alert('AI Generation error: ' + err.message);
    } finally {
      setGeneratingAiId(null);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await api.publishAdminScheme(id);
      fetchSchemes();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this scheme?')) return;
    try {
      await api.archiveAdminScheme(id);
      fetchSchemes();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.schemeCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {successToast && (
        <div className="p-4 rounded-card bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#103A30]">
            {language === 'HI' ? 'योजना प्रबंधन (Scheme CMS)' : 'Welfare Schemes CMS'}
          </h1>
          <p className="text-xs text-[#727B74] mt-0.5">
            Manage official scheme rules, documents, and trigger plain-Hindi AI drafting.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#174C3C] hover:bg-[#103A30] text-white text-xs font-bold rounded-btn transition-colors shadow-soft"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'HI' ? 'नई योजना जोड़ें' : 'Add New Scheme'}</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-card border border-[#E5E4DE] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#727B74] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scheme name or code..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#727B74] font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs border border-[#E5E4DE] rounded-btn bg-[#FAF9F5]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Schemes CMS Table */}
      <div className="bg-white rounded-card border border-[#E5E4DE] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#727B74]">No schemes match your filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E5E4DE] text-[11px] font-bold text-[#727B74] uppercase">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Scheme Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Need</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Verified</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF9F5]">
                {filteredSchemes.map((s) => (
                  <tr key={s.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#174C3C]">{s.schemeCode}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#202923] max-w-[240px] truncate">{s.name}</div>
                      {s.nameHi && <div className="text-[10px] text-[#727B74] truncate font-hindi">{s.nameHi}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-[#727B74]">{s.category}</td>
                    <td className="py-3.5 px-4 text-[#727B74]">{s.need}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'ARCHIVED'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#727B74]">
                      {new Date(s.lastCheckedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* AI Generate Summary Button */}
                        <button
                          type="button"
                          onClick={() => handleGenerateAiSummary(s)}
                          disabled={generatingAiId === s.id}
                          title="Generate Plain Hindi Summary with OpenAI"
                          className="p-1.5 rounded-btn bg-[#C77B59]/10 text-[#C77B59] hover:bg-[#C77B59] hover:text-white transition-colors disabled:opacity-50"
                        >
                          {generatingAiId === s.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(s)}
                          title="Edit Scheme Details"
                          className="p-1.5 rounded-btn text-[#727B74] hover:text-[#174C3C] hover:bg-[#FAF9F5] transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* View Public Button */}
                        <Link
                          to={`/schemes/${s.slug}`}
                          target="_blank"
                          title="View Public Page"
                          className="p-1.5 rounded-btn text-[#727B74] hover:text-[#174C3C] hover:bg-[#FAF9F5] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        {/* Publish / Archive Toggle */}
                        {s.status === 'PUBLISHED' ? (
                          <button
                            type="button"
                            onClick={() => handleArchive(s.id)}
                            title="Archive Scheme"
                            className="p-1.5 rounded-btn text-[#727B74] hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePublish(s.id)}
                            title="Publish Scheme"
                            className="p-1.5 rounded-btn text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-card shadow-elevated border border-[#E5E4DE] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#E5E4DE] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#103A30]">
                {editingScheme ? `Edit Scheme: ${editingScheme.schemeCode}` : 'Create New Welfare Scheme'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#727B74]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScheme} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Scheme Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.schemeCode}
                    onChange={(e) => setModalForm({ ...modalForm, schemeCode: e.target.value })}
                    placeholder="e.g. SCH-014"
                    className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">Status</label>
                  <select
                    value={modalForm.status}
                    onChange={(e) => setModalForm({ ...modalForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn bg-[#FAF9F5]"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Scheme Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  placeholder="e.g. State Widow Pension Scheme"
                  className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  योजना का नाम (Hindi)
                </label>
                <input
                  type="text"
                  value={modalForm.nameHi}
                  onChange={(e) => setModalForm({ ...modalForm, nameHi: e.target.value })}
                  placeholder="उदा. राज्य विधवा पेंशन योजना"
                  className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn font-hindi"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={modalForm.category}
                    onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">Need Area *</label>
                  <input
                    type="text"
                    required
                    value={modalForm.need}
                    onChange={(e) => setModalForm({ ...modalForm, need: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Official Benefit (English) *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.benefit}
                  onChange={(e) => setModalForm({ ...modalForm, benefit: e.target.value })}
                  placeholder="e.g. ₹600 per month directly into bank account."
                  className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  शासकीय लाभ (Hindi)
                </label>
                <input
                  type="text"
                  value={modalForm.benefitHi}
                  onChange={(e) => setModalForm({ ...modalForm, benefitHi: e.target.value })}
                  placeholder="उदा. ₹600 प्रति माह सीधे बैंक खाते में।"
                  className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn font-hindi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Description (English) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={modalForm.description}
                  onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  विवरण / सारांश (Hindi)
                </label>
                <textarea
                  rows={2}
                  value={modalForm.descriptionHi}
                  onChange={(e) => setModalForm({ ...modalForm, descriptionHi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn font-hindi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Official Source Portal URL *
                </label>
                <input
                  type="url"
                  required
                  value={modalForm.officialSourceUrl}
                  onChange={(e) => setModalForm({ ...modalForm, officialSourceUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn font-mono"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E4DE] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E5E4DE] text-xs font-semibold rounded-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#174C3C] hover:bg-[#103A30] text-white text-xs font-bold rounded-btn transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingScheme ? 'Update Scheme' : 'Create Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
