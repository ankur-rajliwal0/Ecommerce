import React from 'react';

const TermsOfService = () => {
  return (
    <div className="bg-[#c4c3b6] min-h-[calc(100vh-80px)] py-16 px-4 sm:px-6 font-helvetica text-[#000000]">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#595855] block mb-2 font-mono">
            LEGAL ARCHIVE • COVENANT
          </span>
          <h1 className="font-davinci text-4xl sm:text-5xl font-medium tracking-tight text-[#000000] mb-2">
            Client Terms & Salon Covenant
          </h1>
          <p className="text-xs text-[#595855]">Effective Date: October 2026</p>
        </div>

        <div className="bg-[#e7e5e4] rounded-[9px] border border-[#dfdcd5] p-8 sm:p-12 text-xs leading-relaxed text-[#595855] space-y-8">
          <p className="text-sm text-[#000000] font-medium leading-relaxed">
            Welcome to Veltrix Gallery. By acquiring floral pieces or artisanal gifts through our atelier, you agree to the covenants set forth below.
          </p>

          <section>
            <h2 className="font-davinci text-xl sm:text-2xl font-medium text-[#000000] mb-2 pb-2 border-b border-[#dfdcd5]">
              1. Commission Nature of Botanical Pieces
            </h2>
            <p>
              Due to natural horticultural seasonal variance, individual stems, shades, and blossom sizes may vary slightly from displayed catalog imagery. Each arrangement represents a unique, commissioned floral composition.
            </p>
          </section>

          <section>
            <h2 className="font-davinci text-xl sm:text-2xl font-medium text-[#000000] mb-2 pb-2 border-b border-[#dfdcd5]">
              2. Delivery Acceptance
            </h2>
            <p>
              Given the perishable nature of fresh botanicals, recipients or designated agents must be available to accept the hand-delivery. Couriers will not leave fresh flowers unattended under direct sunlight or extreme temperature exposure.
            </p>
          </section>

          <section>
            <h2 className="font-davinci text-xl sm:text-2xl font-medium text-[#000000] mb-2 pb-2 border-b border-[#dfdcd5]">
              3. Intellectual Property
            </h2>
            <p>
              All imagery, typographic layouts, branding marks, and floral curation compositions are protected under copyright by Veltrix Gallery Inc.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default TermsOfService;
