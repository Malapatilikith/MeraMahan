import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, PlusCircle, HelpCircle, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-amber-50 border-2 border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-600 shadow-sm">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            Error 404 • Page Not Found
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            We couldn't find that page
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            The link you followed may be broken, or the citizen report or page may have been moved or removed.
          </p>
        </div>

        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-[#138808] hover:shadow-sm transition-all text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <Home className="w-4 h-4 text-[#138808]" />
            <span>Community Feed</span>
          </Link>

          <Link
            to="/explore"
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-[#FF9933] hover:shadow-sm transition-all text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <Search className="w-4 h-4 text-[#FF9933]" />
            <span>Explore Reports</span>
          </Link>

          <Link
            to="/submit"
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-[#138808] hover:shadow-sm transition-all text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <PlusCircle className="w-4 h-4 text-[#138808]" />
            <span>Post a Report</span>
          </Link>

          <Link
            to="/help"
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Help & FAQ</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#138808] text-white text-sm font-semibold shadow hover:bg-[#0f6b06] transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
