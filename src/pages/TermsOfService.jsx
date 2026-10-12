import React from 'react';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-gray-900 font-bold" size={32} />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Terms of Service</h1>
          </div>
          <div className="inline-block bg-primary-teal/10 text-gray-900 font-bold font-bold px-4 py-2 rounded-full text-sm">
            Effective Date: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-14 text-gray-700 leading-relaxed font-medium">
          
          <p className="text-lg mb-10 text-gray-600">
            Welcome to Lovora. By accessing or using our website, you agree to be bound by the following terms and conditions. Please read them carefully before making any purchases or using our services.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-100">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing, browsing, or using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-100">2. User Accounts</h2>
              <p className="mb-4">
                To access certain features of the site, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Maintaining the confidentiality of your account password.</li>
                <li>All activities that occur under your account.</li>
                <li>Providing accurate and up-to-date information during registration.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-100">3. Intellectual Property</h2>
              <p className="mb-4">
                All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, and software, is the property of Lovora or its content suppliers and protected by international copyright laws.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-100">4. Prohibited Conduct</h2>
              <p className="mb-4">
                You agree not to use the site to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
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
