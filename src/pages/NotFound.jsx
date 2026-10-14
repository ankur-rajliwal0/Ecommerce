import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ShoppingBag } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[#c4c3b6] flex items-center justify-center px-4 py-16 font-helvetica text-[#000000]">
      <div className="max-w-xl w-full text-center">
        
        {/* Main Card */}
        <div className="bg-[#e7e5e4] rounded-[9px] border border-[#dfdcd5] p-8 sm:p-14 shadow-xl">
          
          <div className="w-12 h-12 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center font-davinci text-xl font-medium text-[#000000] mx-auto mb-6">
            V
          </div>

          <span className="text-[10px] uppercase tracking-[0.25em] text-[#595855] block mb-2 font-mono">
            404 • UNCATALOGUED CORRIDOR
          </span>

          <h1 className="font-davinci text-6xl sm:text-8xl font-medium text-[#000000] tracking-[-0.03em] mb-3">
            404
          </h1>

          <h2 className="font-davinci text-2xl sm:text-3xl font-medium text-[#000000] mb-3">
            Lost in Our Atelier
          </h2>

          <p className="text-xs sm:text-sm text-[#595855] max-w-sm mx-auto leading-relaxed mb-8">
            The archive folio you sought has been decommissioned or relocated to a private reserve.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="btn-pill-action py-3 px-6 text-xs uppercase tracking-wider w-full sm:w-auto"
            >
              <Home size={14} />
              <span>Return to Gallery</span>
            </Link>

            <Link
              to="/products"
              className="px-6 py-3 rounded-[28.8px] border border-[#dfdcd5] text-xs uppercase tracking-wider text-[#000000] hover:bg-[#dfdcd5]/60 transition-colors w-full sm:w-auto inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} />
              <span>Explore Collection</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
