import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportApi } from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import {
  User,
  PlusCircle,
  FileText,
  MapPin,
  Calendar,
  ThumbsUp,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function MyReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    reportApi.getMyReports({ page: 0, size: 50 })
      .then((res) => {
        setReports(res.data.data.content || []);
      })
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredReports = reports.filter((r) => {
    if (activeTab === 'ALL') return true;
    return r.status === activeTab;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'PENDING').length,
    inProgress: reports.filter((r) => r.status === 'APPROVED' || r.status === 'UNDER_REVIEW').length,
    resolved: reports.filter((r) => r.status === 'RESOLVED').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center font-bold text-xl uppercase shadow-sm">
              {user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 truncate max-w-xs sm:max-w-md">
                  {user?.email}
                </h1>
                {user?.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded uppercase text-[10px]">
                  {user?.role?.replace('ROLE_', '')}
                </span>
                {(user?.cityName || user?.stateName) && (
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {user?.cityName ? `${user.cityName}, ` : ''}
                    {user?.stateName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#e67e1a] text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity"
          >
            <PlusCircle className="w-4 h-4" />
            File New Report
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Filed
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Screening
            </span>
            <p className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              In Progress
            </span>
            <p className="text-2xl font-black text-blue-600 mt-1">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Resolved
            </span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{stats.resolved}</p>
          </div>
        </div>

        {/* Reports Section with Filter Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Submissions</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track status changes and moderator actions on your reports
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {['ALL', 'PENDING', 'APPROVED', 'RESOLVED', 'REJECTED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Reports List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl bg-slate-100 animate-pulse border border-slate-200"
                />
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No reports in this category</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                You haven't filed any reports with this status yet.
              </p>
              <Link
                to="/submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Submit a Report
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <Link
                  key={report.id}
                  to={`/reports/${report.id}`}
                  className="block p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all bg-white group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <StatusBadge status={report.status} />
                        {report.category && (
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {report.category.name}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        {report.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {report.description}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 text-xs text-slate-400">
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3.5 h-3.5" /> {report.likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" /> {report.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
