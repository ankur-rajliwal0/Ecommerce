import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Returns = () => {
  return (
    <div className="bg-[#c4c3b6] min-h-[calc(100vh-80px)] py-16 px-4 sm:px-6 font-helvetica text-[#000000]">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-14">
          <div className="w-12 h-12 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center font-davinci text-xl font-medium text-[#000000] mx-auto mb-5">
            V
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#595855] block mb-2 font-mono">
            SATISFACTION COVENANT
          </span>
          <h1 className="font-davinci text-4xl sm:text-5xl font-medium text-[#000000] mb-3">
            Care & Replacement Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#595855] max-w-xl mx-auto leading-relaxed">
            We hold our botanical and artisanal pieces to Renaissance standards of perfection. If any arrangement arrives less than extraordinary, we make it right without delay.
          </p>
        </div>

        <div className="bg-[#e7e5e4] rounded-[9px] border border-[#dfdcd5] overflow-hidden p-8 sm:p-12 mb-8">
          <span className="text-[10px] uppercase tracking-wider text-[#595855] block mb-1">
            BOTANICAL GUARANTEE
          </span>
          <h2 className="font-davinci text-2xl sm:text-3xl font-medium text-[#000000] mb-4">
            7-Day Freshness Assurance
          </h2>
          <p className="text-xs sm:text-sm text-[#595855] leading-relaxed mb-8">
            Living botanicals should bring sustained grace to your salon. Should any flower wilt prematurely within seven days despite fresh water replenishment, photograph the arrangement and dispatch it to our curators for an immediate replacement delivery.
          </p>

          <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-[#dfdcd5]">
            <div>
              <span className="text-[10px] font-mono text-[#595855] block mb-2">STEP 01</span>
              <h3 className="font-davinci text-lg font-medium text-[#000000] mb-1">Photograph the Piece</h3>
              <p className="text-xs text-[#595855] leading-relaxed">Capture clear images of the arrangement and packaging.</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#595855] block mb-2">STEP 02</span>
              <h3 className="font-davinci text-lg font-medium text-[#000000] mb-1">Notify Concierge</h3>
              <p className="text-xs text-[#595855] leading-relaxed">Send your folio order number to concierge@veltrix.com.</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#595855] block mb-2">STEP 03</span>
              <h3 className="font-davinci text-lg font-medium text-[#000000] mb-1">Priority Re-dispatch</h3>
              <p className="text-xs text-[#595855] leading-relaxed">A freshly cut bespoke bouquet is couriered to your address.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/contact" className="btn-pill-action py-3 px-8 text-xs uppercase tracking-widest">
            <span>Contact Curatorial Concierge</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Returns;
