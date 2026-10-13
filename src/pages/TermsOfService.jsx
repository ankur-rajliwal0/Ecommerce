import React from 'react';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="bg-[#F8F6F1] min-h-[calc(100vh-80px)] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-[#344B38]" size={32} />
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#292923] tracking-tight">Terms of Service</h1>
          </div>
          <div className="inline-block bg-[#E9E9E0] text-[#344B38] font-bold px-4 py-2 rounded-full text-sm border border-[#DCC6A8]">
            Effective Date: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#DCC6A8] p-8 md:p-14 text-[#292923]/80 leading-relaxed font-medium">
          
          <p className="text-lg mb-10 text-[#292923]">
            Welcome to Veltrix. By accessing or using our website, you agree to be bound by the following terms and conditions. Please read them carefully before making any purchases or using our services.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-extrabold text-[#292923] mb-4 pb-2 border-b border-[#E9E9E0]">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing, browsing, or using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-[#292923] mb-4 pb-2 border-b border-[#E9E9E0]">2. User Accounts</h2>
              <p className="mb-4">
                To access certain features of the site, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#829078]">
                <li>Maintaining the confidentiality of your account password.</li>
                <li>All activities that occur under your account.</li>
                <li>Providing accurate and up-to-date information during registration.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-[#292923] mb-4 pb-2 border-b border-[#E9E9E0]">3. Intellectual Property</h2>
              <p className="mb-4">
                All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, and software, is the property of Veltrix or its content suppliers and protected by international copyright laws.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-extrabold text-[#292923] mb-4 pb-2 border-b border-[#E9E9E0]">4. Prohibited Conduct</h2>
              <p className="mb-4">
                You agree not to use the site to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#829078]">
                <li>Upload or transmit viruses or any other type of malicious code.</li>
                <li>Attempt to gain unauthorized access to our systems or networks.</li>
                <li>Engage in any activity that interferes with or disrupts the website.</li>
                <li>Reproduce, duplicate, copy, sell, or resell any part of the service without written permission.</li>
              </ul>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
