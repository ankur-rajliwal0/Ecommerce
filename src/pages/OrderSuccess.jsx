import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="w-full bg-[#c4c3b6] min-h-[70vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 font-helvetica text-[#000000]">
      <div className="bg-[#e7e5e4] border border-[#dfdcd5] p-8 sm:p-12 rounded-[9px] max-w-lg w-full shadow-lg">
        {/* Monogram emblem */}
        <div className="w-16 h-16 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center font-davinci text-2xl font-medium text-[#000000] mx-auto mb-6">
          V
        </div>
        
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#595855] block mb-2 font-mono">
          COMMISSION RECORDED
        </span>
        <h1 className="font-davinci text-3xl sm:text-4xl font-medium text-[#000000] mb-3">
          Acquisition Confirmed
        </h1>
        <p className="text-xs sm:text-sm text-[#595855] mb-8 leading-relaxed">
          Your commission has entered our atelier. Stems are being prepared under Florentine preservation standards and your vellum dispatch folio will follow shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            to="/my-orders" 
            className="btn-pill-action py-3 px-6 text-xs uppercase tracking-wider"
          >
            <span>Track Acquisition</span>
            <ArrowRight size={12} />
          </Link>
          <Link 
            to="/" 
            className="px-6 py-3 rounded-[28.8px] border border-[#dfdcd5] text-xs uppercase tracking-wider text-[#000000] hover:bg-[#dfdcd5]/60 transition-colors"
          >
            Return to Gallery
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
