import React from 'react';
import { Truck, Globe, Clock, ShieldCheck } from 'lucide-react';

const Shipping = () => {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-white shadow-sm border border-gray-100 text-gray-900 font-bold rounded-xl flex items-center justify-center mx-auto mb-8 rotate-3 hover:rotate-0 transition-transform">
            <Truck size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Shipping Information</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">Fast, reliable, and transparent shipping so you know exactly when your package will arrive.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-primary-teal/10 text-gray-900 font-bold rounded-xl flex items-center justify-center">
                <Truck size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Domestic</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">Standard Shipping</p>
                  <p className="text-sm text-gray-500 font-medium">5-7 business days</p>
                </div>
                <p className="font-bold text-gray-900 font-bold">Free over ₹999</p>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">Express Shipping</p>
                  <p className="text-sm text-gray-500 font-medium">2-3 business days</p>
                </div>
                <p className="font-bold text-gray-900">₹150</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">Next Day Delivery</p>
                  <p className="text-sm text-gray-500 font-medium">Order before 2 PM</p>
                </div>
                <p className="font-bold text-gray-900">₹300</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-primary-teal/10 text-gray-900 font-bold rounded-xl flex items-center justify-center">
                <Globe size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">International</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">Standard Global</p>
                  <p className="text-sm text-gray-500 font-medium">7-14 business days</p>
                </div>
                <p className="font-bold text-gray-900 text-sm">Calculated at Checkout</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">Priority Global</p>
                  <p className="text-sm text-gray-500 font-medium">3-5 business days</p>
                </div>
                <p className="font-bold text-gray-900 text-sm">Calculated at Checkout</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                * International customers are responsible for all customs duties and import taxes.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 text-white rounded-xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-teal opacity-20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          
          <h2 className="text-2xl font-bold mb-8 relative z-10">Our Shipping Promise</h2>
          
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                <Clock className="text-gray-900 font-bold" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Same Day Dispatch</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Orders placed before 2 PM local time on business days are packed and handed to our carriers the exact same day.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="text-gray-900 font-bold" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Insured Delivery</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Every package we send out is fully insured. If it gets lost in transit, we'll replace your entire order at zero cost.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
