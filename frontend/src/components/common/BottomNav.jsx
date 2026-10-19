import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handlePostClick = () => {
    if (isAuthenticated) {
      navigate('/submit');
    } else {
      navigate('/login', { state: { from: '/submit' } });
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/my-reports');
    } else {
      navigate('/login', { state: { from: '/my-reports' } });
    }
  };

  const isPostActive = location.pathname === '/submit';
  const isProfileActive = location.pathname === '/my-reports' || location.pathname === '/profile';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg md:hidden">
      <div className="flex h-16 w-full">
        {/* Left: POST (50% width) */}
        <button
          onClick={handlePostClick}
          className={`w-1/2 flex flex-col items-center justify-center gap-1 transition-colors border-r border-slate-100 ${
            isPostActive ? 'text-[#FF9933] font-bold bg-amber-50/50' : 'text-slate-600 hover:text-slate-900 active:bg-slate-50'
          }`}
          aria-label="Create Report"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF9933] to-[#e67e1a] text-white flex items-center justify-center shadow-sm">
            <Camera className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold tracking-wider uppercase">POST</span>
        </button>

        {/* Right: PROFILE (50% width) */}
        <button
          onClick={handleProfileClick}
          className={`w-1/2 flex flex-col items-center justify-center gap-1 transition-colors ${
            isProfileActive ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-600 hover:text-slate-900 active:bg-slate-50'
          }`}
          aria-label="Profile and My Reports"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <User className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold tracking-wider uppercase">PROFILE</span>
        </button>
      </div>
    </div>
  );
}
