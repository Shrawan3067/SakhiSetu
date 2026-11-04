import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { AIReview } from '../../types';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Edit3,
  Save,
  RotateCcw,
  AlertCircle,
  FileText,
  Clock,
  Loader2,
  Check,
} from 'lucide-react';

export const AdminAIReviewsPage: React.FC = () => {
  const { language } = useLanguage();

  const [reviews, setReviews] = useState<AIReview[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('PENDING');
  const [isLoading, setIsLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  // In-line editing draft
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHindiText, setEditHindiText] = useState<string>('');

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await api.listAIReviews(filterStatus !== 'ALL' ? filterStatus : undefined);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load AI reviews', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filterStatus]);

  const handleStartEdit = (review: AIReview) => {
    setEditingId(review.id);
    setEditHindiText(review.generatedHindiSummary);
  };

  const handleSaveDraft = async (id: string) => {
    setActingId(id);
    try {
      await api.updateAIReviewDraft(id, { generatedHindiSummary: editHindiText });
      setEditingId(null);
      fetchReviews();
    } catch (err: any) {
      alert('Failed to save draft: ' + err.message);
    } finally {
      setActingId(null);
    }
  };

  const handleApprove = async (id: string) => {
    setActingId(id);
    try {
      await api.approveAIReview(id);
      fetchReviews();
    } catch (err: any) {
      alert('Failed to approve review: ' + err.message);
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject this AI generated draft?')) return;
    setActingId(id);
    try {
      await api.rejectAIReview(id);
      fetchReviews();
    } catch (err: any) {
      alert('Failed to reject review: ' + err.message);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C77B59] bg-[#C77B59]/10 px-2.5 py-0.5 rounded-sm mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OpenAI Human-in-the-Loop Review Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-[#103A30]">
            {language === 'HI' ? 'AI हिंदी सारांश समीक्षा' : 'AI Hindi Scheme Summary Reviews'}
          </h1>
          <p className="text-xs text-[#727B74] mt-0.5 max-w-2xl">
            Review, edit, and approve synthesized plain-Hindi summaries before publication. AI outputs are never published automatically.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#727B74] font-medium">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs border border-[#E5E4DE] rounded-btn bg-white font-semibold"
          >
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved & Published</option>
            <option value="REJECTED">Rejected</option>
            <option value="ALL">All Drafts</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-card border border-[#E5E4DE] p-12 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-[#A8BDA8] mx-auto" />
          <h3 className="text-sm font-bold text-[#202923]">No Review Drafts Found</h3>
          <p className="text-xs text-[#727B74] max-w-sm mx-auto">
            There are no {filterStatus.toLowerCase()} drafts currently in the review queue. To generate a draft, visit the Schemes CMS and click the AI icon.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((rev) => {
            const isEditing = editingId === rev.id;
            const isActing = actingId === rev.id;

            return (
              <div
                key={rev.id}
                className="bg-white rounded-card border border-[#E5E4DE] shadow-xs overflow-hidden"
              >
                {/* Draft Card Header */}
                <div className="bg-[#FAF9F5] p-4 sm:px-6 border-b border-[#E5E4DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-[#174C3C] bg-[#174C3C]/10 px-2.5 py-0.5 rounded-sm">
                      {rev.scheme?.schemeCode || 'SCHEME'}
                    </span>
                    <h3 className="text-sm font-bold text-[#202923]">
                      {rev.scheme?.name || 'Welfare Scheme Draft'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rev.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rev.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {rev.status}
                    </span>
                    <span className="text-[10px] text-[#727B74]">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Draft Comparison Body */}
                <div className="p-6 space-y-6">
                  {/* Generated Hindi Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#174C3C] uppercase tracking-wider flex items-center gap-1.5 font-hindi">
                        <Sparkles className="w-3.5 h-3.5 text-[#C77B59]" />
                        <span>AI जनरेटेड सरल हिंदी सारांश (Plain-Hindi Draft):</span>
                      </label>

                      {rev.status === 'PENDING' && !isEditing && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(rev)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#174C3C] hover:underline"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Text</span>
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          rows={4}
                          value={editHindiText}
                          onChange={(e) => setEditHindiText(e.target.value)}
                          className="w-full p-3 text-xs leading-relaxed border-2 border-[#174C3C] rounded-lg font-hindi focus:outline-hidden"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 border border-[#E5E4DE] text-xs font-semibold rounded-btn"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={isActing}
                            onClick={() => handleSaveDraft(rev.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#174C3C] text-white text-xs font-bold rounded-btn disabled:opacity-50"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE] text-xs leading-relaxed text-[#202923] font-hindi">
                        {rev.generatedHindiSummary}
                      </div>
                    )}
                  </div>

                  {/* Generated English Summary */}
                  {rev.generatedEnglishSummary && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-[#727B74] uppercase tracking-wider">
                        English Synthetic Translation:
                      </span>
                      <p className="text-xs text-[#727B74] leading-relaxed">
                        {rev.generatedEnglishSummary}
                      </p>
                    </div>
                  )}

                  {/* Missing Information Note */}
                  {Array.isArray(rev.missingInformation) && rev.missingInformation.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Missing Information Flags:</span>
                        <ul className="list-disc pl-4 mt-0.5">
                          {rev.missingInformation.map((m: string, i: number) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Actions for PENDING review */}
                  {rev.status === 'PENDING' && (
                    <div className="pt-4 border-t border-[#E5E4DE] flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs text-[#727B74] italic">
                        Human verification required: Approving will immediately synchronize with public scheme page.
                      </span>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          disabled={isActing}
                          onClick={() => handleReject(rev.id)}
                          className="flex-1 sm:flex-none px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold rounded-btn transition-colors disabled:opacity-50"
                        >
                          Reject Draft
                        </button>

                        <button
                          type="button"
                          disabled={isActing}
                          onClick={() => handleApprove(rev.id)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-[#174C3C] hover:bg-[#103A30] text-white text-xs font-bold rounded-btn transition-colors shadow-soft disabled:opacity-50"
                        >
                          {isActing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          <span>Approve & Publish to Scheme</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
