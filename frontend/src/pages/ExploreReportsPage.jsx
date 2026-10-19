import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { reportApi, metaApi } from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  ThumbsUp,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';

export default function ExploreReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [stateId, setStateId] = useState(searchParams.get('stateId') || '');
  const [cityId, setCityId] = useState(searchParams.get('cityId') || '');
  const [page, setPage] = useState(0);

  // Meta Dropdown Data
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Reports Data
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load Meta Options
  useEffect(() => {
    metaApi.getCategories().then((res) => setCategories(res.data.data || [])).catch(() => {});
    metaApi.getStates().then((res) => setStates(res.data.data || [])).catch(() => {});
  }, []);

  // Cascading Cities
  useEffect(() => {
    if (stateId) {
      metaApi.getCities(stateId)
        .then((res) => setCities(res.data.data || []))
        .catch(() => setCities([]));
    } else {
      setCities([]);
      setCityId('');
    }
  }, [stateId]);

  // Fetch Reports
  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 9,
      };
      if (query.trim()) params.query = query.trim();
      if (categoryId) params.categoryId = categoryId;
      if (stateId) params.stateId = stateId;
      if (cityId) params.cityId = cityId;

      const res = await reportApi.getPublicReports(params);
      const data = res.data.data;
      setReports(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, categoryId, stateId, cityId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchReports();
  };

  const handleResetFilters = () => {
    setQuery('');
    setCategoryId('');
    setStateId('');
    setCityId('');
    setPage(0);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Community Reports Feed
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Publicly verified civic and environmental grievances across Indian regions ({totalElements} reports)
            </p>
          </div>

          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#e67e1a] text-white font-semibold text-xs shadow-sm hover:opacity-95 transition-opacity self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            File New Report
          </Link>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by keywords or title..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setPage(0);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <select
                value={stateId}
                onChange={(e) => {
                  setStateId(e.target.value);
                  setCityId('');
                  setPage(0);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="">All States</option>
                {states.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <select
                value={cityId}
                disabled={!stateId}
                onChange={(e) => {
                  setCityId(e.target.value);
                  setPage(0);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50"
              >
                <option value="">{stateId ? 'All Cities' : 'Select State First'}</option>
                {cities.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>
          </form>

          {/* Quick Active Filters & Reset */}
          {(query || categoryId || stateId || cityId) && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Filters Applied</span>
              <button
                onClick={handleResetFilters}
                className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset all
              </button>
            </div>
          )}
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 h-72 animate-pulse"
              />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-lg">No reports match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              Try adjusting your search criteria or clear the filters to view all civic reports.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Link
                key={report.id}
                to={`/reports/${report.id}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
              >
                {/* Image Banner */}
                <div className="h-48 bg-slate-100 relative overflow-hidden">
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
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-600 px-3 py-1 bg-white border border-slate-200 rounded-xl">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
