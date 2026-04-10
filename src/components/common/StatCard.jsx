import React from 'react';

export const StatCard = ({ label, value, color = 'text-sky-600' }) => (
  <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm sm:px-5 sm:py-4">
    <span className={`absolute right-0 top-0 h-16 w-16 -translate-y-6 translate-x-6 rounded-full bg-current opacity-5 ${color}`} />
    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">{label}</p>
    <div className="mt-1 flex items-end justify-between gap-3">
      <p className={`text-2xl font-bold leading-none sm:text-3xl ${color}`}>{value}</p>
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full bg-current ${color}`} />
    </div>
  </div>
);
