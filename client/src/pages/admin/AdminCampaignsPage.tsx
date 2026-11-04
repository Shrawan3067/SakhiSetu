import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Campaign } from '../../types';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Layers,
  Plus,
  Edit,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Users,
} from 'lucide-react';

export const AdminCampaignsPage: React.FC = () => {
  const { language } = useLanguage();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Livelihood',
    description: '',
    imageUrl: '',
    goalAmount: 500000,
    status: 'ACTIVE',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error('Failed to load campaigns', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setForm({
      title: '',
      category: 'Livelihood',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80',
      goalAmount: 500000,
      status: 'ACTIVE',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Campaign) => {
    setEditingCampaign(c);
    setForm({
      title: c.title,
      category: c.category,
      description: c.description,
      imageUrl: c.imageUrl || '',
      goalAmount: c.goalAmount,
      status: c.status,
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setModalError(null);

    try {
      if (editingCampaign) {
        await api.updateAdminCampaign(editingCampaign.id, {
          ...form,
          goalAmount: Number(form.goalAmount),
        });
      } else {
        await api.createAdminCampaign({
          ...form,
          goalAmount: Number(form.goalAmount),
        });
      }

      setIsModalOpen(false);
      fetchCampaigns();
    } catch (err: any) {
      setModalError(err.message || 'Failed to save campaign');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#103A30]">
            {language === 'HI' ? 'अभियान प्रबंधन' : 'Campaign Management'}
          </h1>
          <p className="text-xs text-[#727B74] mt-0.5">
            Create and track welfare fundraising goals, donor numbers, and milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#174C3C] hover:bg-[#103A30] text-white text-xs font-bold rounded-btn transition-colors shadow-soft"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'HI' ? 'नया अभियान जोड़ें' : 'Create Campaign'}</span>
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-card border border-[#E5E4DE] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={4} />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#727B74]">No campaigns created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E5E4DE] text-[11px] font-bold text-[#727B74] uppercase">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Target (Goal)</th>
                  <th className="py-3 px-4">Raised</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Donors</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF9F5]">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#202923] max-w-[220px] truncate">
                      {c.title}
                    </td>
                    <td className="py-3.5 px-4 text-[#727B74]">{c.category}</td>
                    <td className="py-3.5 px-4 font-medium text-[#727B74]">
                      ₹{c.goalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#174C3C]">
                      ₹{c.collectedAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#E5E4DE] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#174C3C] h-1.5 rounded-full"
                            style={{ width: `${c.progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-[11px] text-[#202923]">
                          {c.progressPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#727B74]">{c.donorCount || 0}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-btn text-[#727B74] hover:text-[#174C3C] hover:bg-[#FAF9F5] transition-colors"
                        title="Edit campaign"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
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
          <div className="bg-white rounded-card shadow-elevated border border-[#E5E4DE] w-full max-w-lg">
            <div className="p-5 border-b border-[#E5E4DE] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#103A30]">
                {editingCampaign ? 'Edit Welfare Campaign' : 'Create New Welfare Campaign'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#727B74]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Rural Women Livelihood Micro-Capital"
                  className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Goal Amount (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={form.goalAmount}
                    onChange={(e) => setForm({ ...form, goalAmount: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5E4DE] rounded-btn bg-[#FAF9F5]"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="PAUSED">PAUSED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#E5E4DE] flex justify-end gap-2">
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
                  className="px-5 py-2 bg-[#174C3C] text-white text-xs font-bold rounded-btn disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
