import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    category: "Commissions & Delivery",
    questions: [
      { q: "How are living botanicals preserved during transit?", a: "Stems are hydrated in organic moss pods, cushioned inside rigid Florentine hatboxes, and transported via climate-regulated couriers to ensure pristine dew upon arrival." },
      { q: "Do you offer white-glove same-day delivery?", a: "Yes. In metropolitan regions, same-day white glove delivery is available for orders confirmed before 12:00 PM local atelier time." },
      { q: "How can I monitor my dispatch?", a: "Each commission generates a private dispatch folio link sent to your email, providing minute-by-minute courier telemetry." }
    ]
  },
  {
    category: "Care & Replacement Covenant",
    questions: [
      { q: "What is your botanical freshness guarantee?", a: "If any blossom fails to remain vibrant for at least 7 days with proper water replenishment, our curators will immediately dispatch a complimentary replacement arrangement." },
      { q: "Can arrangements be customized?", a: "Yes. Our concierge atelier accommodates custom botanical selections, specific palette alignments, and bespoke wax-sealed notes." }
    ]
  },
  {
    category: "Gourmet & Artisan Hampers",
    questions: [
      { q: "Are your confections prepared by master chocolatiers?", a: "All truffles and confections are hand-tempered by artisanal European chocolatiers using single-origin grand cru cacao without preservatives." }
    ]
  }
];

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`border rounded-[9px] overflow-hidden mb-3 bg-[#e7e5e4] transition-colors duration-200 ${isOpen ? 'border-[#000000]' : 'border-[#dfdcd5]'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none"
      >
        <span className="font-davinci text-lg sm:text-xl font-medium pr-4 text-[#000000]">{question}</span>
        <div className="w-6 h-6 rounded-full border border-[#dfdcd5] flex items-center justify-center shrink-0">
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#000000]' : 'text-[#595855]'}`} />
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-4 font-helvetica">
          <p className="text-xs text-[#595855] leading-relaxed border-t border-[#dfdcd5]/60 pt-3">{answer}</p>
        </div>
      )}
    </div>
  );
};

const Faq = () => {
  return (
    <div className="bg-[#c4c3b6] min-h-[calc(100vh-80px)] py-16 px-4 sm:px-6 font-helvetica text-[#000000]">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-14">
          <div className="w-12 h-12 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center font-davinci text-xl font-medium text-[#000000] mx-auto mb-5">
            V
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#595855] block mb-2 font-mono">
            COLLECTOR INQUIRIES
          </span>
          <h1 className="font-davinci text-4xl sm:text-5xl font-medium text-[#000000] mb-3">
            Atelier Inquiries & FAQs
          </h1>
          <p className="text-xs sm:text-sm text-[#595855] max-w-md mx-auto leading-relaxed">
            Everything you need to understand regarding our botanical preservation, delivery covenants, and bespoke packaging.
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((section, idx) => (
            <div key={idx}>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] font-helvetica block mb-3 pl-1">
                {section.category}
              </span>
              <div className="space-y-2">
                {section.questions.map((faq, i) => (
                  <FaqItem key={i} question={faq.q} answer={faq.a} />
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
