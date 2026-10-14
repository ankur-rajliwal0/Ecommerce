import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#c4c3b6] min-h-[calc(100vh-80px)] py-16 px-4 sm:px-6 font-helvetica text-[#000000]">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#595855] block mb-2 font-mono">
            LEGAL ARCHIVE • COVENANT
          </span>
          <h1 className="font-davinci text-4xl sm:text-5xl font-medium tracking-tight text-[#000000] mb-2">
            Data Ethics & Privacy Covenant
          </h1>
          <p className="text-xs text-[#595855]">Effective Date: October 2026</p>
        </div>

        <div className="bg-[#e7e5e4] rounded-[9px] border border-[#dfdcd5] p-8 sm:p-12 text-xs leading-relaxed text-[#595855] space-y-8">
          <p className="text-sm text-[#000000] font-medium leading-relaxed">
            At Veltrix, we treat collector data with the same reverence and discretion applied to rare artworks. We collect only what is strictly necessary to arrange white glove botanical dispatch.
          </p>

          <section>
            <h2 className="font-davinci text-xl sm:text-2xl font-medium text-[#000000] mb-2 pb-2 border-b border-[#dfdcd5]">
              1. Information Recorded in Folios
            </h2>
            <p className="mb-2">We record identity data provided directly during acquisitions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Recipient and collector names, contact details, and physical addresses.</li>
              <li>Encrypted transaction tokens processed via Razorpay.</li>
              <li>Handwritten message card inscriptions and delivery instructions.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-davinci text-xl sm:text-2xl font-medium text-[#000000] mb-2 pb-2 border-b border-[#dfdcd5]">
              2. Data Protection Standards
            </h2>
            <p>
              We implement strict cryptographic protection. We never sell, lease, or monetize collector details with commercial brokers. Data is accessible solely to authorized couriers and curators executing your specific order.
            </p>
          </section>

          <section>
            <h2 className="font-davinci text-xl sm:text-2xl font-medium text-[#000000] mb-2 pb-2 border-b border-[#dfdcd5]">
              3. Right of Erasure
            </h2>
            <p>
              Patrons may request the complete deletion of their account profile and historic dispatch address data at any time by contacting our Curatorial Desk at concierge@veltrix.com.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
