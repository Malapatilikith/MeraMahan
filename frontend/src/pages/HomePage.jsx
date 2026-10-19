import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { reportApi, metaApi } from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import {
  Search,
  PlusCircle,
  TrendingUp,
  MapPin,
  Calendar,
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [states, setStates] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    // Load states for quick filter
    metaApi.getStates()
      .then((res) => setStates(res.data.data || []))
      .catch(() => {});

    // Load recent public reports
    reportApi.getPublicReports({ page: 0, size: 6 })
      .then((res) => {
        setRecentReports(res.data.data.content || []);
      })
      .catch(() => {})
      .finally(() => setLoadingReports(false));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('query', searchQuery.trim());
    if (selectedState) params.append('stateId', selectedState);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-white to-slate-50 border-b border-slate-200 py-16 sm:py-24">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-200/50 blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-emerald-200/50 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs mb-6">
            <span className="flex h-2 w-2 rounded-full bg-[#138808]" />
            <span className="text-xs font-semibold text-slate-700 tracking-wide">
              MeraMahan — Indian Citizen Reporting Platform
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Your Voice. Your Community.{' '}
            <span className="bg-gradient-to-r from-[#FF9933] via-amber-600 to-[#138808] bg-clip-text text-transparent">
              Your India.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Spot a public problem in your locality? Report potholes, garbage dumping, sewage
            overflow, broken lights, and public hazards to bring transparency and speedy action.
          </p>

          {/* Quick Search & Filter Card */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-3xl mx-auto bg-white p-2.5 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row gap-2"
          >
            <div className="flex-1 flex items-center gap-2 px-3 bg-slate-50 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search issues (e.g., Pothole on Ring Road, Water leakage)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="sm:w-52 flex items-center px-3 bg-slate-50 rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mr-1.5" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full py-2.5 bg-transparent text-sm text-slate-700 focus:outline-none"
              >
                <option value="">All States / UTs</option>
                {states.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              Explore
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#e67e1a] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              File an Issue Report
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Browse All Reports
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Step Process Guide */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">How MeraMahan Works</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Transparent, community-driven reporting in three straightforward steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#FF9933] flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Spot & Snap</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Notice an issue? Capture a photo, write a concise description, and select your state
                and city.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Moderation & Upvotes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Community moderators screen the report to ensure authenticity, while fellow
                citizens upvote to highlight urgency.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Transparency & Resolution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track progress updates in real-time until the municipal or community issue is
                resolved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Public Reports Feed */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recent Community Reports</h2>
            <p className="text-xs text-slate-500 mt-1">
              Live civic concerns filed by citizens across India
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View all feed
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingReports ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 h-64 animate-pulse"
              />
            ))}
          </div>
        ) : recentReports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base">No reports found yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Be the first vigilant citizen to submit a report in your locality!
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              File First Report
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReports.map((report) => (
              <Link
                key={report.id}
                to={`/reports/${report.id}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
              >
                {/* Image Banner */}
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  {report.images && report.images.length > 0 ? (
                    <img
                      src={report.images[0].imageUrl}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <AlertTriangle className="w-8 h-8 stroke-1" />
                      <span className="text-[11px] mt-1 font-medium">No Image Uploaded</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={report.status} />
                  </div>
                  {report.category && (
                    <span className="absolute top-3 right-3 text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-xs px-2.5 py-1 rounded-full">
                      {report.category.name}
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1 truncate max-w-[180px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {report.city?.name}, {report.state?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1 font-medium">
                        <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                        {report.likeCount}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        {report.commentCount}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
