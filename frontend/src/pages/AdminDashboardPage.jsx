import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adminApi, reportApi, metaApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import {
  Shield,
  BarChart3,
  FileCheck,
  Users,
  Flag,
  Search,
  Check,
  X,
  AlertTriangle,
  Eye,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const getInitialTab = () => {
    const path = location.pathname;
    if (path.includes('/reports')) return 'REPORTS';
    if (path.includes('/users')) return 'USERS';
    if (path.includes('/content-reports')) return 'ABUSE';
    if (path.includes('/analytics')) return 'ANALYTICS';
    return 'ANALYTICS';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);

  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Moderation Reports State
  const [reports, setReports] = useState([]);
  const [reportStatusFilter, setReportStatusFilter] = useState('PENDING');
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [loadingReports, setLoadingReports] = useState(false);

  // Users Management State
  const [usersList, setUsersList] = useState([]);
  const [userQuery, setUserQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Content Abuse Reports State
  const [abuseReports, setAbuseReports] = useState([]);
  const [loadingAbuse, setLoadingAbuse] = useState(false);

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Load Analytics
  const loadAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await adminApi.getAnalytics();
      setAnalytics(res.data.data);
    } catch {
      // ignore
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Load Reports
  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const params = {
        status: reportStatusFilter === 'ALL' ? undefined : reportStatusFilter,
        query: reportSearchQuery || undefined,
        size: 25,
      };
      const res = await adminApi.getReports(params);
      setReports(res.data.data.content || []);
    } catch {
      setReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  // Load Users
  const loadUsers = async () => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    try {
      const res = await adminApi.getUsers({ query: userQuery, size: 25 });
      setUsersList(res.data.data.content || []);
    } catch {
      setUsersList([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load Abuse Reports
  const loadAbuseReports = async () => {
    setLoadingAbuse(true);
    try {
      const res = await adminApi.getContentReports({ status: 'PENDING' });
      setAbuseReports(res.data.data.content || []);
    } catch {
      setAbuseReports([]);
    } finally {
      setLoadingAbuse(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ANALYTICS') loadAnalytics();
    if (activeTab === 'REPORTS') loadReports();
    if (activeTab === 'USERS') loadUsers();
    if (activeTab === 'ABUSE') loadAbuseReports();
  }, [activeTab, reportStatusFilter]);

  const handleUpdateStatus = async (reportId, status, reason = '') => {
    try {
      await reportApi.updateStatus(reportId, { status, reason });
      loadReports();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await adminApi.toggleUserStatus(userId);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      await adminApi.updateUserRole(userId, role);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleResolveAbuse = async (abuseId, takeAction) => {
    try {
      await adminApi.resolveContentReport(abuseId, {
        status: 'RESOLVED',
        takeAction,
      });
      loadAbuseReports();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process report');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-black text-slate-900">Moderation & Administration Hub</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Screen citizen reports, monitor platform engagement, and manage community trust
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase self-start sm:self-auto">
            {user?.role?.replace('ROLE_', '')}
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ANALYTICS'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Platform Analytics
          </button>

          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'REPORTS'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            Moderation Queue
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('USERS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'USERS'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              User Governance
            </button>
          )}

          <button
            onClick={() => setActiveTab('ABUSE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ABUSE'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Flag className="w-4 h-4" />
            Abuse Reports
          </button>
        </div>

        {/* TAB 1: ANALYTICS OVERVIEW */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-6">
            {loadingAnalytics || !analytics ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Total Citizens
                    </span>
                    <p className="text-3xl font-black text-slate-900 mt-1">{analytics.totalUsers}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Total Reports
                    </span>
                    <p className="text-3xl font-black text-slate-900 mt-1">{analytics.totalReports}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                      Pending Screening
                    </span>
                    <p className="text-3xl font-black text-amber-600 mt-1">{analytics.pendingReports}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      Resolved Issues
                    </span>
                    <p className="text-3xl font-black text-emerald-600 mt-1">{analytics.resolvedReports}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                      Action In Progress
                    </span>
                    <p className="text-3xl font-black text-blue-600 mt-1">{analytics.approvedReports}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                      Declined / Rejected
                    </span>
                    <p className="text-3xl font-black text-rose-600 mt-1">{analytics.rejectedReports}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Citizen Supports
                    </span>
                    <p className="text-3xl font-black text-slate-900 mt-1">{analytics.totalLikes}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Dialogue Comments
                    </span>
                    <p className="text-3xl font-black text-slate-900 mt-1">{analytics.totalComments}</p>
                  </div>
                </div>

                {/* State & Category Distribution Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* By Category */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Reports by Category</h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.reportsByCategory || {}).map(([cat, count]) => (
                        <div key={cat} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 truncate max-w-xs">{cat}</span>
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {count}
                          </span>
                        </div>
                      ))}
                      {Object.keys(analytics.reportsByCategory || {}).length === 0 && (
                        <p className="text-xs text-slate-400">No categories data yet</p>
                      )}
                    </div>
                  </div>

                  {/* By State */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Reports by State</h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.reportsByState || {}).map(([state, count]) => (
                        <div key={state} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 truncate max-w-xs">{state}</span>
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {count}
                          </span>
                        </div>
                      ))}
                      {Object.keys(analytics.reportsByState || {}).length === 0 && (
                        <p className="text-xs text-slate-400">No state data yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: MODERATION QUEUE */}
        {activeTab === 'REPORTS' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                {['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'RESOLVED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setReportStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      reportStatusFilter === st
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search in reports..."
                  value={reportSearchQuery}
                  onChange={(e) => setReportSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadReports()}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {loadingReports ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading reports...</div>
            ) : reports.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No reports found matching status {reportStatusFilter}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reports.map((r) => (
                  <div key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={r.status} />
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {r.category?.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {r.city?.name}, {r.state?.name}
                        </span>
                      </div>

                      <Link
                        to={`/reports/${r.id}`}
                        className="font-bold text-sm text-slate-900 hover:text-blue-600 block"
                      >
                        {r.title}
                      </Link>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {r.description}
                      </p>

                      <div className="text-[10px] text-slate-400">
                        Filed by: <span className="font-mono text-slate-600">{r.reporterEmail || 'Citizen'}</span> on {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Link
                        to={`/reports/${r.id}`}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Inspect
                      </Link>

                      {r.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'APPROVED', 'Approved by moderator')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}

                      {r.status !== 'RESOLVED' && r.status === 'APPROVED' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'RESOLVED', 'Issue resolved by civic authorities')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                        >
                          Mark Resolved
                        </button>
                      )}

                      {r.status !== 'REJECTED' && (
                        <button
                          onClick={() => {
                            setSelectedReportId(r.id);
                            setRejectModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER GOVERNANCE (ADMIN ONLY) */}
        {activeTab === 'USERS' && isAdmin && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Registered Citizens & Staff</h3>
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user by email..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {loadingUsers ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-2">User Email</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2">Location</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="py-3 px-2 font-medium text-slate-900">{u.email}</td>
                        <td className="py-3 px-2">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                            className="bg-slate-100 border border-slate-200 rounded px-2 py-1 text-[11px] font-semibold text-slate-800"
                          >
                            <option value="ROLE_USER">Citizen</option>
                            <option value="ROLE_MODERATOR">Moderator</option>
                            <option value="ROLE_ADMIN">Admin</option>
                          </select>
                        </td>
                        <td className="py-3 px-2 text-slate-600">
                          {u.cityName ? `${u.cityName}, ${u.stateName}` : '—'}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            Verified
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                          >
                            Toggle Active
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ABUSE REPORTS QUEUE */}
        {activeTab === 'ABUSE' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Reported Misinformation & Abuse</h3>

            {loadingAbuse ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading abuse reports...</div>
            ) : abuseReports.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No active abuse or misinformation reports. All clear!
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {abuseReports.map((ar) => (
                  <div key={ar.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                          {ar.reason}
                        </span>
                        <span className="text-xs text-slate-500">
                          Reported by {ar.reportedByUserEmail}
                        </span>
                      </div>

                      {ar.reportTitle && (
                        <p className="text-xs font-semibold text-slate-900 mt-1">
                          Target Report: {ar.reportTitle}
                        </p>
                      )}

                      {ar.commentText && (
                        <p className="text-xs text-slate-600 italic mt-1">
                          Target Comment: "{ar.commentText}"
                        </p>
                      )}

                      {ar.description && (
                        <p className="text-xs text-slate-500 mt-1">Details: {ar.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleResolveAbuse(ar.id, true)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Hide Content & Resolve
                      </button>
                      <button
                        onClick={() => handleResolveAbuse(ar.id, false)}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Dismiss Flag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reject Reason Modal */}
        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base mb-2">Reject Report Submission</h3>
              <p className="text-xs text-slate-500 mb-4">
                Please provide a constructive reason for rejecting this citizen submission.
              </p>
              <textarea
                rows={3}
                placeholder="e.g. Duplicate report, insufficient photograph evidence, or outside civic scope..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setRejectModalOpen(false);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedReportId, 'REJECTED', rejectReason);
                    setRejectModalOpen(false);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
