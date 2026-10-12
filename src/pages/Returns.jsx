import React from 'react';
import { RefreshCcw, Truck, CreditCard, HelpCircle } from 'lucide-react';

const Returns = () => {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-white shadow-sm border border-gray-100 text-gray-900 font-bold rounded-xl flex items-center justify-center mx-auto mb-8 rotate-3 hover:rotate-0 transition-transform">
            <RefreshCcw size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Return Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">We want you to love your purchase. If you're not completely satisfied, we've made our return process as simple and painless as possible.</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12 border-b border-gray-100">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">30-Day Happiness Guarantee</h2>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
              You have 30 days from the date of delivery to return any unworn, unwashed, or defective merchandise for a full refund. We believe in our products, but we believe in your happiness more.
            </p>
          </div>

          <div className="p-8 md:p-12 bg-gray-50">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">How to make a return</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 text-white font-bold rounded-full flex items-center justify-center shadow-lg">1</div>
                <div className="w-12 h-12 bg-primary-teal/10 text-gray-900 font-bold rounded-xl flex items-center justify-center mb-4">
                  <HelpCircle size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Request Return</h3>
                <p className="text-gray-600 text-sm font-medium">Log into your account, go to "My Orders" and click on "Return Item".</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 text-white font-bold rounded-full flex items-center justify-center shadow-lg">2</div>
                <div className="w-12 h-12 bg-primary-teal/10 text-gray-900 font-bold rounded-xl flex items-center justify-center mb-4">
                  <Truck size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Pack & Ship</h3>
                <p className="text-gray-600 text-sm font-medium">Print the provided prepaid shipping label and drop the package at any carrier location.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 text-white font-bold rounded-full flex items-center justify-center shadow-lg">3</div>
                <div className="w-12 h-12 bg-primary-teal/10 text-gray-900 font-bold rounded-xl flex items-center justify-center mb-4">
                  <CreditCard size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Get Refunded</h3>
                <p className="text-gray-600 text-sm font-medium">Once received, we process your refund within 3-5 business days to your original payment method.</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Important Exceptions</h3>
            <ul className="list-disc pl-5 space-y-3 text-gray-600 font-medium">
              <li>Final sale items cannot be returned or exchanged.</li>
              <li>Gift cards are non-refundable.</li>
              <li>Items must be returned in their original packaging with all tags attached.</li>
              <li>Original shipping fees (if any) are non-refundable.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
