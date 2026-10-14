import React from 'react';

// Product Card Skeleton matching Shop and Home product cards (9px radius, hairline border)
export const ProductSkeleton = () => {
  return (
    <div className="border border-[#dfdcd5] rounded-[9px] overflow-hidden bg-[#e7e5e4] flex flex-col p-3 sm:p-4">
      {/* Image Placeholder */}
      <div className="aspect-square w-full skeleton-shimmer rounded-[9px] mb-3"></div>
      
      {/* Content Placeholder */}
      <div className="flex flex-col flex-1 gap-2">
        <div className="h-3 skeleton-shimmer rounded-[2px] w-1/4"></div>
        <div className="h-4 skeleton-shimmer rounded-[2px] w-3/4"></div>
        
        <div className="mt-auto pt-2.5 sm:pt-3 border-t border-[#dfdcd5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="h-4 skeleton-shimmer rounded-[2px] w-16"></div>
          <div className="h-7 skeleton-shimmer rounded-[28.8px] w-full sm:w-16"></div>
        </div>
      </div>
    </div>
  );
};

// Grid of Product Skeletons
export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array(count).fill(0).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};

// Category Card Skeleton matching Home category cards
export const CategoryCardSkeleton = () => {
  return (
    <div className="bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] p-5 flex flex-col gap-3">
      <div className="aspect-[4/3] w-full rounded-[9px] skeleton-shimmer"></div>
      <div className="flex flex-col gap-1.5">
        <div className="h-4 skeleton-shimmer rounded-[2px] w-3/4"></div>
        <div className="h-3 skeleton-shimmer rounded-[2px] w-1/2"></div>
      </div>
    </div>
  );
};

export const CategoryListSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
};

// Product Details Page Skeleton
export const DetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="h-4 skeleton-shimmer rounded-[2px] w-24 mb-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* Gallery Image Skeleton */}
        <div>
          <div className="aspect-square skeleton-shimmer rounded-[9px] w-full border border-[#dfdcd5]"></div>
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="aspect-square skeleton-shimmer rounded-[9px] border border-[#dfdcd5]"></div>
            <div className="aspect-square skeleton-shimmer rounded-[9px] border border-[#dfdcd5]"></div>
            <div className="aspect-square skeleton-shimmer rounded-[9px] border border-[#dfdcd5]"></div>
            <div className="aspect-square skeleton-shimmer rounded-[9px] border border-[#dfdcd5]"></div>
          </div>
        </div>
        
        {/* Info & Options Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-3 skeleton-shimmer rounded-[2px] w-28"></div>
          <div className="h-8 skeleton-shimmer rounded-[2px] w-4/5"></div>
          <div className="h-4 skeleton-shimmer rounded-[2px] w-36"></div>
          
          <div className="h-8 skeleton-shimmer rounded-[2px] w-32 my-2 border-y border-[#dfdcd5] py-2"></div>
          
          <div className="space-y-2 py-3">
            <div className="h-3 skeleton-shimmer rounded-[2px] w-full"></div>
            <div className="h-3 skeleton-shimmer rounded-[2px] w-5/6"></div>
            <div className="h-3 skeleton-shimmer rounded-[2px] w-2/3"></div>
          </div>
          
          <div className="flex gap-4 mt-4">
            <div className="h-10 skeleton-shimmer rounded-[28.8px] w-28"></div>
            <div className="h-10 skeleton-shimmer rounded-[28.8px] flex-1"></div>
          </div>
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
        <div key={i} className="border border-[#dfdcd5] rounded-[9px] p-5 bg-[#e7e5e4] flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="space-y-1.5">
              <div className="h-3 skeleton-shimmer rounded-[2px] w-24"></div>
              <div className="h-4 skeleton-shimmer rounded-[2px] w-32"></div>
            </div>
            <div className="h-5 skeleton-shimmer rounded-[28.8px] w-16"></div>
          </div>
          <div className="flex gap-3 pt-2">
            <div className="w-14 h-14 rounded-[9px] skeleton-shimmer border border-[#dfdcd5]"></div>
            <div className="w-14 h-14 rounded-[9px] skeleton-shimmer border border-[#dfdcd5]"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-[#e7e5e4] rounded-[9px] border border-[#dfdcd5] overflow-hidden">
      <div className="h-12 bg-[#dfdcd5]/40 border-b border-[#dfdcd5] flex items-center px-6 gap-4">
        <div className="h-3 skeleton-shimmer rounded-[2px] w-1/4"></div>
        <div className="h-3 skeleton-shimmer rounded-[2px] w-1/4"></div>
        <div className="h-3 skeleton-shimmer rounded-[2px] w-1/4"></div>
        <div className="h-3 skeleton-shimmer rounded-[2px] w-1/6 ml-auto"></div>
      </div>
      {Array(rows).fill(0).map((_, i) => (
        <div key={i} className="h-14 border-b border-[#dfdcd5]/60 flex items-center px-6 gap-4 last:border-0">
          <div className="h-3 skeleton-shimmer rounded-[2px] w-1/5"></div>
          <div className="h-3 skeleton-shimmer rounded-[2px] w-2/5"></div>
          <div className="h-3 skeleton-shimmer rounded-[2px] w-1/6"></div>
          <div className="h-6 skeleton-shimmer rounded-[28.8px] w-16 ml-auto"></div>
        </div>
      ))}
    </div>
  );
};
