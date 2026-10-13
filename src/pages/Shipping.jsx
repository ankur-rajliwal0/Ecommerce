import React from 'react';
import { Truck, Globe, Clock, ShieldCheck } from 'lucide-react';

const Shipping = () => {
  return (
    <div className="bg-[#F8F6F1] min-h-[calc(100vh-80px)] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-[#E9E9E0] shadow-sm border border-[#DCC6A8] text-[#344B38] font-bold rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 hover:rotate-0 transition-transform">
            <Truck size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#292923] mb-6 tracking-tight">Shipping Information</h1>
          <p className="text-lg text-[#829078] max-w-2xl mx-auto font-medium">Fast, reliable, and transparent shipping so you know exactly when your package will arrive.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#DCC6A8] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#E9E9E0] text-[#344B38] font-bold rounded-xl flex items-center justify-center">
                <Truck size={28} />
              </div>
              <h2 className="text-2xl font-bold text-[#292923]">Domestic</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-[#E9E9E0]">
                <div>
                  <p className="font-bold text-[#292923]">Standard Shipping</p>
                  <p className="text-sm text-[#829078] font-medium">5-7 business days</p>
                </div>
                <p className="font-bold text-[#344B38]">Free over ₹999</p>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-[#E9E9E0]">
                <div>
                  <p className="font-bold text-[#292923]">Express Shipping</p>
                  <p className="text-sm text-[#829078] font-medium">2-3 business days</p>
                </div>
                <p className="font-bold text-[#292923]">₹150</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#292923]">Next Day Delivery</p>
                  <p className="text-sm text-[#829078] font-medium">Order before 2 PM</p>
                </div>
                <p className="font-bold text-[#292923]">₹300</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#DCC6A8] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#E9E9E0] text-[#344B38] font-bold rounded-xl flex items-center justify-center">
                <Globe size={28} />
              </div>
              <h2 className="text-2xl font-bold text-[#292923]">International</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-[#E9E9E0]">
                <div>
                  <p className="font-bold text-[#292923]">Standard Global</p>
                  <p className="text-sm text-[#829078] font-medium">7-14 business days</p>
                </div>
                <p className="font-bold text-[#292923] text-sm">Calculated at Checkout</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#292923]">Priority Global</p>
                  <p className="text-sm text-[#829078] font-medium">3-5 business days</p>
                </div>
                <p className="font-bold text-[#292923] text-sm">Calculated at Checkout</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-[#E9E9E0] rounded-xl">
              <p className="text-xs text-[#292923]/80 font-medium leading-relaxed">
                * International customers are responsible for all customs duties and import taxes.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#292923] text-[#F8F6F1] rounded-2xl p-8 md:p-12 relative overflow-hidden border border-[#DCC6A8]/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#829078] opacity-20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          
          <h2 className="text-2xl font-bold mb-8 relative z-10 text-[#F8F6F1]">Our Shipping Promise</h2>
          
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-[#344B38] rounded-full flex items-center justify-center shrink-0 text-[#F8F6F1]">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-[#F8F6F1]">Same Day Dispatch</h3>
                <p className="text-[#E9E9E0]/80 text-sm leading-relaxed">Orders placed before 2 PM local time on business days are packed and handed to our carriers the exact same day.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-[#344B38] rounded-full flex items-center justify-center shrink-0 text-[#F8F6F1]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-[#F8F6F1]">Insured Delivery</h3>
                <p className="text-[#E9E9E0]/80 text-sm leading-relaxed">Every package we send out is fully insured. If it gets lost in transit, we'll replace your entire order at zero cost.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
