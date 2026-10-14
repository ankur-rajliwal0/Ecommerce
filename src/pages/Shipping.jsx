import React from 'react';
import { Truck, Globe, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Shipping = () => {
  return (
    <div className="bg-[#c4c3b6] min-h-[calc(100vh-80px)] py-16 px-4 sm:px-6 font-helvetica text-[#000000]">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-14">
          <div className="w-12 h-12 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center font-davinci text-xl font-medium text-[#000000] mx-auto mb-5">
            V
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#595855] block mb-2 font-mono">
            LOGISTICS & DISPATCH COVENANT
          </span>
          <h1 className="font-davinci text-4xl sm:text-5xl font-medium text-[#000000] mb-3">
            White Glove Delivery
          </h1>
          <p className="text-xs sm:text-sm text-[#595855] max-w-xl mx-auto leading-relaxed">
            Every arrangement is transported in temperature-regulated vaults with museum-grade preservation packaging to safeguard pristine dewy freshness.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          
          <div className="bg-[#e7e5e4] p-6 sm:p-8 rounded-[9px] border border-[#dfdcd5]">
            <span className="text-[10px] uppercase tracking-wider text-[#595855] block mb-1">DISPATCH TIER 01</span>
            <h2 className="font-davinci text-2xl font-medium text-[#000000] mb-6 pb-2 border-b border-[#dfdcd5]">
              Domestic Courier
            </h2>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-[#dfdcd5]/60">
                <div>
                  <p className="font-medium text-[#000000]">Complimentary White Glove</p>
                  <p className="text-[11px] text-[#595855]">Delivered within 2–4 business days</p>
                </div>
                <p className="font-medium text-[#000000]">Complimentary</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#dfdcd5]/60">
                <div>
                  <p className="font-medium text-[#000000]">Morning Dew Express</p>
                  <p className="text-[11px] text-[#595855]">Next-day delivery before 11:00 AM</p>
                </div>
                <p className="font-medium text-[#000000]">₹250</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#000000]">Florentine Courier Handover</p>
                  <p className="text-[11px] text-[#595855]">Same-day bespoke courier delivery</p>
                </div>
                <p className="font-medium text-[#000000]">₹450</p>
              </div>
            </div>
          </div>

          <div className="bg-[#e7e5e4] p-6 sm:p-8 rounded-[9px] border border-[#dfdcd5]">
            <span className="text-[10px] uppercase tracking-wider text-[#595855] block mb-1">DISPATCH TIER 02</span>
            <h2 className="font-davinci text-2xl font-medium text-[#000000] mb-6 pb-2 border-b border-[#dfdcd5]">
              International Salon
            </h2>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-[#dfdcd5]/60">
                <div>
                  <p className="font-medium text-[#000000]">Global Confectionery Transit</p>
                  <p className="text-[11px] text-[#595855]">Air dispatch for artisan hampers</p>
                </div>
                <p className="font-medium text-[#000000]">₹1,200</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#000000]">Customs & Duty Clearance</p>
                  <p className="text-[11px] text-[#595855]">White glove handling through clearance</p>
                </div>
                <p className="font-medium text-[#000000]">Included</p>
              </div>
            </div>
          </div>

        </div>

        <div className="text-center">
          <Link to="/products" className="btn-pill-action py-3 px-8 text-xs uppercase tracking-widest">
            <span>Explore Curated Archive</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Shipping;
