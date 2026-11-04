import React from 'react';

export const SchemeCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-card border border-[#E5E4DE] p-6 shadow-xs animate-pulse space-y-4">
    <div className="flex justify-between items-start">
      <div className="h-4 bg-[#E5E4DE] rounded-sm w-20"></div>
      <div className="h-5 bg-[#E5E4DE] rounded-full w-24"></div>
    </div>
    <div className="h-6 bg-[#E5E4DE] rounded-md w-3/4"></div>
    <div className="space-y-2">
      <div className="h-3 bg-[#E5E4DE] rounded-sm w-full"></div>
      <div className="h-3 bg-[#E5E4DE] rounded-sm w-5/6"></div>
    </div>
    <div className="p-3 bg-[#FAF9F5] rounded-lg space-y-1">
      <div className="h-3 bg-[#E5E4DE] rounded-sm w-1/3"></div>
      <div className="h-5 bg-[#E5E4DE] rounded-sm w-2/3"></div>
    </div>
    <div className="flex justify-between items-center pt-2">
      <div className="h-3 bg-[#E5E4DE] rounded-sm w-24"></div>
      <div className="h-8 bg-[#E5E4DE] rounded-btn w-28"></div>
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white rounded-card border border-[#E5E4DE] p-4 shadow-xs animate-pulse space-y-3">
    <div className="h-8 bg-[#E5E4DE] rounded-md w-full mb-4"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 py-2 border-b border-[#FAF9F5]">
        <div className="h-4 bg-[#E5E4DE] rounded-sm w-1/6"></div>
        <div className="h-4 bg-[#E5E4DE] rounded-sm w-1/4"></div>
        <div className="h-4 bg-[#E5E4DE] rounded-sm w-1/6"></div>
        <div className="h-4 bg-[#E5E4DE] rounded-sm w-1/6"></div>
        <div className="h-4 bg-[#E5E4DE] rounded-sm w-1/6"></div>
      </div>
    ))}
  </div>
);

