import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldAlert, PhoneCall, Globe2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Mera<span className="text-[#FF9933]">Mahan</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Your Voice. Your Community. Your India.</strong>
              <br />
              Empowering responsible citizens across India to report local civil and environmental
              issues for direct accountability.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active civic monitoring platform
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  Explore Reports Feed
                </Link>
              </li>
              <li>
                <Link to="/submit" className="hover:text-white transition-colors">
                  File an Issue Report
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="hover:text-white transition-colors">
                  Track My Reports
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register as Citizen
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines in India */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#FF9933]" />
              National Helplines
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Emergency (Pan-India):</span>
                <span className="font-mono text-white font-medium">112</span>
              </div>
              <div className="flex justify-between">
                <span>Police:</span>
                <span className="font-mono text-white font-medium">100</span>
              </div>
              <div className="flex justify-between">
                <span>Fire / Ambulance:</span>
                <span className="font-mono text-white font-medium">101 / 102</span>
              </div>
              <div className="flex justify-between">
                <span>Women Helpline:</span>
                <span className="font-mono text-white font-medium">1091</span>
              </div>
              <div className="flex justify-between">
                <span>Cybercrime Reporting:</span>
                <span className="font-mono text-white font-medium">1930</span>
              </div>
            </div>
          </div>

          {/* Disclaimer & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              Community Guidelines
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              MeraMahan is a community-driven initiative for transparent grievance surfacing. All
              submitted reports undergo peer and moderator screening. Defamation, spam, or
              misinformation will lead to account deactivation.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MeraMahan. Designed for Indian Citizens.</p>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <span>Built with devotion for a better Bharat</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#138808]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
