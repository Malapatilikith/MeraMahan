import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { reportApi, contentReportApi, adminApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import {
  MapPin,
  Calendar,
  ThumbsUp,
  MessageSquare,
  Share2,
  Flag,
  Shield,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Send,
  Copy,
  Check,
} from 'lucide-react';

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isModerator } = useAuth();

  const [report, setReport] = useState(null);
  const [comments, setComments] = useState([]);
  const [moderationLogs, setModerationLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interaction States
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Moderation status update modal / states (for staff)
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Content abuse report modal
  const [abuseModalOpen, setAbuseModalOpen] = useState(false);
  const [abuseReason, setAbuseReason] = useState('SPAM');
  const [abuseDescription, setAbuseDescription] = useState('');
  const [submittingAbuse, setSubmittingAbuse] = useState(false);
  const [abuseSuccess, setAbuseSuccess] = useState(false);

  // Fetch Report Data
  const loadReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportRes, commentsRes] = await Promise.all([
        reportApi.getReport(id),
        reportApi.getComments(id),
      ]);
      const reportData = reportRes.data.data;
      setReport(reportData);
      setLiked(reportData.isLikedByCurrentUser || false);
      setLikeCount(reportData.likeCount || 0);
      setNewStatus(reportData.status);
      setComments(commentsRes.data.data || []);

      // If staff, also load moderation history
      if (isModerator) {
        adminApi.getReportLogs(id)
          .then((res) => setModerationLogs(res.data.data || []))
          .catch(() => {});
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Report not found or not accessible');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [id, isModerator]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/reports/${id}` } });
      return;
    }

    try {
      const res = await reportApi.toggleLike(id);
      const isNowLiked = res.data.data;
      setLiked(isNowLiked);
      setLikeCount((prev) => (isNowLiked ? prev + 1 : Math.max(0, prev - 1)));
    } catch {
      // ignore
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/reports/${id}` } });
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await reportApi.addComment(id, { text: commentText.trim() });
      setComments((prev) => [...prev, res.data.data]);
      setCommentText('');
      setReport((prev) => (prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShareCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!newStatus || updatingStatus) return;

    setUpdatingStatus(true);
    try {
      await reportApi.updateStatus(id, {
        status: newStatus,
        reason: statusReason,
      });
      setStatusReason('');
      await loadReportData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update report status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAbuseSubmit = async (e) => {
    e.preventDefault();
    if (!abuseReason || submittingAbuse) return;

    setSubmittingAbuse(true);
    try {
      await contentReportApi.reportContent({
        reportId: Number(id),
        reason: abuseReason,
        description: abuseDescription,
      });
      setAbuseSuccess(true);
      setTimeout(() => {
        setAbuseModalOpen(false);
        setAbuseSuccess(false);
        setAbuseDescription('');
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to report content');
    } finally {
      setSubmittingAbuse(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#FF9933] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-200 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Report Unavailable</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">{error}</p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Reports Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Reports Feed
        </Link>

        {/* Main Report Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Top Status & Meta Header */}
          <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <StatusBadge status={report.status} size="lg" />
              {report.category && (
                <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  {report.category.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Reported {new Date(report.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Title & Location */}
          <div className="p-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {report.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1 font-medium text-slate-700">
                <MapPin className="w-4 h-4 text-[#FF9933]" />
                <span>
                  {report.locationArea ? `${report.locationArea}, ` : ''}
                  {report.city?.name}, {report.state?.name}
                </span>
              </div>

              {report.incidentDate && (
                <span className="text-slate-400">
                  Incident Date: {report.incidentDate}
                </span>
              )}

              {report.reporterEmail && (
                <span className="text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full font-mono text-[11px]">
                  Reporter: {report.reporterEmail}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 text-sm text-slate-700 whitespace-pre-line leading-relaxed border-t border-slate-100 pt-6">
              {report.description}
            </div>

            {/* Images Grid / Gallery */}
            {report.images && report.images.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Evidence Photographs ({report.images.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.images.map((img) => (
                    <a
                      key={img.id}
                      href={img.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 block aspect-4/3 relative"
                    >
                      <img
                        src={img.imageUrl}
                        alt="Report evidence"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                      />
                      <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-medium backdrop-blur-xs">
                        Click to enlarge
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Like Button */}
                <button
                  onClick={handleToggleLike}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    liked
                      ? 'bg-blue-600 text-white shadow-blue-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  {likeCount} {likeCount === 1 ? 'Citizen Supported' : 'Citizens Supported'}
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShareCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Share Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Report Abuse / Spam */}
              <button
                onClick={() => setAbuseModalOpen(true)}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors font-medium"
              >
                <Flag className="w-3.5 h-3.5" />
                Report Inaccuracy or Abuse
              </button>
            </div>
          </div>
        </div>

        {/* Moderator Action Panel (if staff) */}
        {isModerator && (
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-4">
              <Shield className="w-4 h-4 text-indigo-600" />
              Moderator Action Panel
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Update Report Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="PENDING">PENDING (Under Screening)</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW (Investigation)</option>
                    <option value="APPROVED">APPROVED (Action In Progress / Public)</option>
                    <option value="RESOLVED">RESOLVED (Issue Fixed / Closed)</option>
                    <option value="REJECTED">REJECTED (Invalid / Declined)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Moderator Note / Public Reason
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Escalated to Municipal Ward 12..."
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingStatus}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {updatingStatus ? 'Updating Status...' : 'Apply Status Change'}
              </button>
            </form>

            {/* Moderation History Logs */}
            {moderationLogs.length > 0 && (
              <div className="mt-6 pt-4 border-t border-indigo-200/60">
                <h4 className="text-xs font-bold text-indigo-900 mb-2">Audit History</h4>
                <div className="space-y-2">
                  {moderationLogs.map((log) => (
                    <div key={log.id} className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-lg border border-indigo-100 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900">{log.action}</span>
                        {log.reason && <span className="ml-1 text-slate-500">— {log.reason}</span>}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        by {log.moderatorEmail} on {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900">
              Community Dialogue ({comments.length})
            </h2>
          </div>

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <div className="relative">
                <textarea
                  rows={3}
                  placeholder="Add constructive community updates or local confirmations..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={1000}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="absolute bottom-3 right-3 px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <p className="text-xs text-slate-600 mb-2">
                Join the community conversation to confirm or provide updates on this report.
              </p>
              <Link
                to="/login"
                state={{ from: `/reports/${id}` }}
                className="inline-flex px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Sign In to Comment
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4 divide-y divide-slate-100">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No comments yet. Be the first to share an update!
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="pt-4 first:pt-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{c.authorName}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Abuse Reporting Modal */}
        {abuseModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-rose-500" />
                  Report Content
                </h3>
                <button
                  onClick={() => setAbuseModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {abuseSuccess ? (
                <div className="py-6 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-900">
                    Content report received. Our moderation team will review this promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAbuseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Reason for Reporting
                    </label>
                    <select
                      value={abuseReason}
                      onChange={(e) => setAbuseReason(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                    >
                      <option value="SPAM">Spam / Duplicate Submission</option>
                      <option value="MISINFORMATION">False Information or Misleading</option>
                      <option value="HARASSMENT">Harassment or Defamation</option>
                      <option value="INAPPROPRIATE_MEDIA">Inappropriate or Vulgar Media</option>
                      <option value="OTHER">Other Reason</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Explain what is inaccurate or abusive..."
                      value={abuseDescription}
                      onChange={(e) => setAbuseDescription(e.target.value)}
                      maxLength={500}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAbuseModalOpen(false)}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingAbuse}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
                    >
                      {submittingAbuse ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
