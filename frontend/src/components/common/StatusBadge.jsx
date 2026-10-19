import React from 'react';
import { Clock, Eye, CheckCircle2, CheckCheck, XCircle } from 'lucide-react';

const statusConfig = {
  PENDING: {
    label: 'Under Screening',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: 'Under Investigation',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Eye,
  },
  APPROVED: {
    label: 'Action in Progress',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-green-100 text-green-800 border-green-300 font-semibold',
    icon: CheckCheck,
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
  },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-sm gap-1.5' : 'px-2.5 py-1 text-xs gap-1';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses} font-medium transition-colors shadow-xs`}
    >
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
}
