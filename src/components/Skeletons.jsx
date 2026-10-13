import React from 'react';

// Product Card Skeleton matching Shop and Home product cards
export const ProductSkeleton = () => {
  return (
    <div className="border border-[#DCC6A8]/60 rounded-2xl overflow-hidden bg-white flex flex-col shadow-sm">
      {/* Image Placeholder */}
      <div className="aspect-square w-full skeleton-shimmer"></div>
      
      {/* Content Placeholder */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2.5">
        <div className="h-4 skeleton-shimmer rounded-md w-3/4"></div>
        <div className="h-3 skeleton-shimmer rounded-md w-1/3"></div>
        
        <div className="mt-auto pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="h-5 skeleton-shimmer rounded-md w-16"></div>
          <div className="h-8 skeleton-shimmer rounded-xl w-full sm:w-24"></div>
        </div>
      </div>
    </div>
  );
};

// Grid of Product Skeletons
export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {Array(count).fill(0).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};

// Category Card Skeleton matching Home category cards
export const CategoryCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[4/5] w-full rounded-2xl border border-[#DCC6A8]/60 overflow-hidden skeleton-shimmer shadow-xs"></div>
      <div className="flex flex-col gap-1.5 px-1">
        <div className="h-3 skeleton-shimmer rounded-md w-1/3 opacity-70"></div>
        <div className="h-5 skeleton-shimmer rounded-md w-3/4"></div>
        <div className="h-3.5 skeleton-shimmer rounded-md w-1/4 mt-1 opacity-80"></div>
      </div>
    </div>
  );
};

export const CategoryListSkeleton = ({ count = 5 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
      {Array(count).fill(0).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
};

// Product Details Page Skeleton
export const DetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="h-5 skeleton-shimmer rounded-md w-24 mb-6"></div>
      
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        {/* Gallery Image Skeleton */}
        <div className="md:w-1/2">
          <div className="aspect-square skeleton-shimmer rounded-2xl w-full border border-[#DCC6A8]/40 shadow-sm"></div>
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="aspect-square skeleton-shimmer rounded-xl border border-[#DCC6A8]/30"></div>
            <div className="aspect-square skeleton-shimmer rounded-xl border border-[#DCC6A8]/30"></div>
            <div className="aspect-square skeleton-shimmer rounded-xl border border-[#DCC6A8]/30"></div>
            <div className="aspect-square skeleton-shimmer rounded-xl border border-[#DCC6A8]/30"></div>
          </div>
        </div>
        
        {/* Info & Options Skeleton */}
        <div className="md:w-1/2 flex flex-col gap-5 pt-2">
          <div className="h-4 skeleton-shimmer rounded-md w-28"></div>
          <div className="h-8 skeleton-shimmer rounded-md w-4/5"></div>
          <div className="h-4 skeleton-shimmer rounded-md w-36"></div>
          
          <div className="h-8 skeleton-shimmer rounded-md w-32 my-1"></div>
          
          <div className="space-y-2 py-3 border-y border-[#E9E9E0]">
            <div className="h-3.5 skeleton-shimmer rounded-md w-full"></div>
            <div className="h-3.5 skeleton-shimmer rounded-md w-5/6"></div>
            <div className="h-3.5 skeleton-shimmer rounded-md w-2/3"></div>
          </div>
          
          <div className="flex gap-4 mt-4">
            <div className="h-12 skeleton-shimmer rounded-xl w-32"></div>
            <div className="h-12 skeleton-shimmer rounded-xl flex-1"></div>
          </div>
          
          <div className="h-28 skeleton-shimmer rounded-2xl w-full mt-6 border border-[#DCC6A8]/30"></div>
        </div>
      </div>
    </div>
  );
};

// Order Card Skeleton for Recent Orders / Profile
export const OrderCardSkeleton = ({ count = 3 }) => {
  return (
    <div className="flex flex-col gap-4">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="border border-[#DCC6A8]/50 rounded-2xl p-4 md:p-5 bg-white shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="space-y-1.5">
              <div className="h-3 skeleton-shimmer rounded-md w-28"></div>
              <div className="h-4 skeleton-shimmer rounded-md w-36"></div>
            </div>
            <div className="h-6 skeleton-shimmer rounded-full w-20"></div>
          </div>
          <div className="flex gap-3 pt-2">
            <div className="w-16 h-16 rounded-xl skeleton-shimmer border border-[#DCC6A8]/30"></div>
            <div className="w-16 h-16 rounded-xl skeleton-shimmer border border-[#DCC6A8]/30"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-[#DCC6A8] overflow-hidden">
      <div className="h-14 bg-[#E9E9E0]/50 border-b border-[#E9E9E0] flex items-center px-6 gap-4">
        <div className="h-4 skeleton-shimmer rounded-md w-1/4"></div>
        <div className="h-4 skeleton-shimmer rounded-md w-1/4"></div>
        <div className="h-4 skeleton-shimmer rounded-md w-1/4"></div>
        <div className="h-4 skeleton-shimmer rounded-md w-1/6 ml-auto"></div>
      </div>
      {Array(rows).fill(0).map((_, i) => (
        <div key={i} className="h-16 border-b border-[#E9E9E0]/60 flex items-center px-6 gap-4">
          <div className="h-4 skeleton-shimmer rounded-md w-1/5"></div>
          <div className="h-4 skeleton-shimmer rounded-md w-2/5"></div>
          <div className="h-4 skeleton-shimmer rounded-md w-1/6"></div>
          <div className="h-8 skeleton-shimmer rounded-xl w-24 ml-auto"></div>
        </div>
      ))}
    </div>
  );
};

