import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-gray-900 font-bold" size={32} />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
          </div>
          <div className="inline-block bg-primary-teal/10 text-gray-900 font-bold font-bold px-4 py-2 rounded-full text-sm">
            Effective Date: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-14 text-gray-700 leading-relaxed font-medium">
          
          <p className="text-lg mb-10 text-gray-600">
            At Lovora, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your data.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-100">1. Information We Collect</h2>
              <p className="mb-4">We collect information that you provide directly to us, including when you:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Create an account or complete a profile.</li>
                <li>Make a purchase or place an order.</li>
                <li>Subscribe to our newsletters or marketing emails.</li>
                <li>Contact our customer support team.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-100">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, such as to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Process transactions and send related information, including confirmations and receipts.</li>
                <li>Send you technical notices, updates, security alerts, and support messages.</li>
                <li>Respond to your comments, questions, and requests.</li>
                <li>Communicate with you about products, services, offers, and events offered by Lovora.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-100">3. Data Security</h2>
              <p className="mb-4">
                We implement highly secure, industry-standard measures to protect your personal information from unauthorized access, loss, misuse, or alteration. All payment data is encrypted via Secure Socket Layer (SSL) technology and processed through secure payment gateways.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-100">4. Sharing Your Information</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
