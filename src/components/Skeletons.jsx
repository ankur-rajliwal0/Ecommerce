import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="border border-border-gray rounded-xl overflow-hidden bg-white flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 md:h-64 bg-gray-200"></div>
      
      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="h-3 bg-gray-200 rounded-xl w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded-xl w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded-xl w-1/2"></div>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded-xl w-1/4"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {Array(count).fill(0).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        {/* Image Skeleton */}
        <div className="md:w-1/2">
          <div className="aspect-square bg-gray-200 rounded-2xl w-full"></div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="aspect-square bg-gray-200 rounded-xl"></div>
            <div className="aspect-square bg-gray-200 rounded-xl"></div>
            <div className="aspect-square bg-gray-200 rounded-xl"></div>
            <div className="aspect-square bg-gray-200 rounded-xl"></div>
          </div>
        </div>
        
        {/* Info Skeleton */}
        <div className="md:w-1/2 flex flex-col gap-6 pt-4">
          <div className="h-4 bg-gray-200 rounded-xl w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
          
          <div className="h-24 bg-gray-200 rounded-xl w-full mt-4"></div>
          
          <div className="flex gap-4 mt-6">
            <div className="h-14 bg-gray-200 rounded-xl w-32"></div>
            <div className="h-14 bg-gray-200 rounded-xl flex-1"></div>
          </div>
          
          <div className="h-32 bg-gray-200 rounded-xl w-full mt-8"></div>
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-border-gray overflow-hidden animate-pulse">
      <div className="h-14 bg-gray-100 border-b border-border-gray"></div>
      {Array(rows).fill(0).map((_, i) => (
        <div key={i} className="h-16 border-b border-border-gray flex items-center px-6 gap-4">
          <div className="h-4 bg-gray-200 rounded-xl w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded-xl w-2/6"></div>
          <div className="h-4 bg-gray-200 rounded-xl w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded-xl w-1/6"></div>
          <div className="h-8 bg-gray-200 rounded-xl w-24 ml-auto"></div>
        </div>
      ))}
    </div>
  );
};
