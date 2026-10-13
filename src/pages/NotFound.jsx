import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ShoppingBag, Compass, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[#F8F6F1] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div 
        className="absolute top-1/4 -left-20 w-80 h-80 rounded-full pointer-events-none blur-3xl opacity-30"
        style={{ background: '#829078' }}
      />
      <div 
        className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full pointer-events-none blur-3xl opacity-25"
        style={{ background: '#DCC6A8' }}
      />

      <div className="max-w-2xl w-full text-center relative z-10">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-[#DCC6A8]/70 shadow-[0_20px_50px_rgba(41,41,35,0.06)] p-8 sm:p-14 relative overflow-hidden">
          
          {/* Subtle Top Accent Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#829078] via-[#344B38] to-[#DCC6A8]" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9E9E0] border border-[#DCC6A8] text-[#344B38] text-xs font-bold uppercase tracking-[0.25em] mb-6">
            <Compass size={14} className="text-[#344B38]" />
            <span>404 Error</span>
          </div>

          {/* Large Stylized 404 Headline */}
          <h1 className="text-6xl sm:text-8xl font-black text-[#344B38] tracking-tight font-heading mb-4">
            404
          </h1>

          {/* Editorial Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292923] tracking-tight mb-3">
            Lost in Our Atelier?
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#292923]/75 font-medium max-w-md mx-auto leading-relaxed mb-8">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let's get you back on track.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-8">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#344B38] hover:bg-[#263829] text-white px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-[#344B38]/20 hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Home size={17} />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#E9E9E0] hover:bg-[#DCC6A8]/50 text-[#292923] px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide border border-[#DCC6A8] transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag size={17} className="text-[#344B38]" />
              <span>Explore Collection</span>
            </Link>

            <button
              onClick={() => navigate(-1)}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#829078] hover:text-[#292923] px-5 py-3.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>
          </div>

          {/* Helpful Navigation Chips */}
          <div className="pt-6 border-t border-[#DCC6A8]/40">
            <p className="text-xs font-bold uppercase tracking-wider text-[#829078] mb-3">
              Popular Destinations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/products?category=flowers"
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F8F6F1] hover:bg-[#E9E9E0] text-[#292923] border border-[#DCC6A8]/60 transition-colors"
              >
                Fresh Flowers
              </Link>
              <Link
                to="/products?category=gift-boxes"
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F8F6F1] hover:bg-[#E9E9E0] text-[#292923] border border-[#DCC6A8]/60 transition-colors"
              >
                Gift Hampers
              </Link>
              <Link
                to="/contact"
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F8F6F1] hover:bg-[#E9E9E0] text-[#292923] border border-[#DCC6A8]/60 transition-colors"
              >
                Need Help?
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default NotFound;
