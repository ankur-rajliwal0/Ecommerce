import React, { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      { q: "How long will it take to receive my order?", a: "Standard shipping typically takes 5-7 business days within the country. Express shipping options are available at checkout for 2-3 day delivery. International orders may take 7-14 business days depending on customs." },
      { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries! Shipping costs and delivery times are calculated at checkout based on your location. Please note that customs duties and taxes are the responsibility of the recipient." },
      { q: "Can I track my order?", a: "Absolutely. Once your order is dispatched, you will receive an email with a tracking number and a link to monitor your package's journey in real-time." }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      { q: "What is your return policy?", a: "We offer a hassle-free 30-day return policy. If you aren't completely satisfied with your purchase, you can return unworn, unwashed, or defective items within 30 days of delivery for a full refund." },
      { q: "Do I have to pay for return shipping?", a: "For defective or incorrect items, we cover the return shipping completely. For standard 'change of mind' returns, a small processing fee of ₹50 will be deducted from your refund." },
      { q: "How long do refunds take to process?", a: "Once we receive your return at our warehouse, please allow 3-5 business days for our team to inspect and process it. The refund will then take another 2-4 business days to reflect in your original payment method." }
    ]
  },
  {
    category: "Products & Stock",
    questions: [
      { q: "Are your products ethically sourced?", a: "Yes. We pride ourselves on partnering only with manufacturers who adhere to strict ethical labor standards and use sustainable materials whenever possible." },
      { q: "What should I do if an item is out of stock?", a: "Popular items sell out fast! If a product is out of stock, check back regularly or contact our support team. We often restock our best-sellers within a couple of weeks." }
    ]
  }
];

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`border rounded-2xl overflow-hidden mb-4 bg-white transition-all duration-300 ${isOpen ? 'border-[#344B38] shadow-md shadow-[#344B38]/5' : 'border-[#DCC6A8]/60 hover:border-[#829078]'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
      >
        <span className={`font-extrabold text-lg pr-4 ${isOpen ? 'text-[#344B38]' : 'text-[#292923]'}`}>{question}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#344B38]/10' : 'bg-[#E9E9E0]'}`}>
          <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#344B38]' : 'text-[#829078]'}`} />
        </div>
      </button>
      <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-[#292923]/70 leading-relaxed font-medium text-[15px]">{answer}</p>
      </div>
    </div>
  );
};

const Faq = () => {
  return (
    <div className="bg-[#F8F6F1] min-h-[calc(100vh-80px)] py-16 md:py-24 relative">
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-white shadow-sm border border-[#DCC6A8]/60 text-[#344B38] rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 hover:rotate-0 transition-transform">
            <MessageCircleQuestion size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#292923] mb-6 tracking-tight">How can we help?</h1>
          <p className="text-lg text-[#829078] max-w-xl mx-auto font-medium">Browse our most frequently asked questions below. Can't find what you're looking for? <a href="/contact" className="text-[#344B38] font-bold hover:underline">Contact our support team.</a></p>
        </div>

        <div className="space-y-12">
          {faqs.map((group, index) => (
            <div key={index}>
              <h2 className="text-2xl font-extrabold text-[#292923] mb-6 pl-4 border-l-4 border-[#344B38] rounded-xl">{group.category}</h2>
              <div className="pl-1">
                {group.questions.map((faq, idx) => (
                  <FaqItem key={idx} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Faq;
