import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Your message has been received by the Curatorial Desk.');
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full bg-[#c4c3b6] min-h-[calc(100vh-80px)] py-12 md:py-20 px-4 sm:px-6 font-helvetica text-[#000000]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#595855] block mb-2 font-helvetica">
            CONCIERGE & INQUIRIES
          </span>
          <h1 className="font-davinci text-4xl sm:text-5xl font-medium text-[#000000] mb-4 tracking-tight">
            Contact the Curatorial Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#595855] leading-relaxed">
            For bespoke commission requests, corporate gifting folios, or urgent event floristry, our curators respond within four hours.
          </p>
        </div>

        {/* Card Container (Bone #e7e5e4, 9px radius, hairline border) */}
        <div className="grid lg:grid-cols-[1fr_1.4fr] bg-[#e7e5e4] rounded-[9px] overflow-hidden border border-[#dfdcd5] shadow-xl max-w-5xl mx-auto">
          
          {/* Left: Ink Room Contact Information */}
          <div className="bg-[#000000] text-[#ffffff] p-8 md:p-12 relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full border border-[#ffffff] flex items-center justify-center font-davinci text-base mb-8">
                V
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#808080] block mb-2">
                DIRECT CHANNELS
              </span>
              <h2 className="font-davinci text-3xl font-medium mb-8 text-[#ffffff]">
                The Salon Atelier
              </h2>
              
              <div className="space-y-6 text-xs">
                <div>
                  <p className="text-[10px] text-[#808080] uppercase tracking-wider mb-0.5">Telephone Concierge</p>
                  <p className="text-sm font-medium text-[#ffffff]">+1 (800) 123-4567</p>
                </div>

                <div>
                  <p className="text-[10px] text-[#808080] uppercase tracking-wider mb-0.5">Electronic Dispatch</p>
                  <p className="text-sm font-medium text-[#ffffff]">concierge@veltrix.com</p>
                </div>

                <div>
                  <p className="text-[10px] text-[#808080] uppercase tracking-wider mb-0.5">Atelier & Vault</p>
                  <p className="text-xs text-[#dfdcd5] leading-relaxed">
                    Via de' Tornabuoni 14, 50123 Firenze, Italy<br />
                    Maison Branch: 1234 Commerce St, Suite 100, New York
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#808080] uppercase tracking-wider mb-0.5">Salon Hours</p>
                  <p className="text-xs text-[#dfdcd5] leading-relaxed">
                    Monday — Saturday: 09:00 — 19:00 CET
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#333333] text-[10px] text-[#808080] uppercase tracking-widest font-mono">
              FLORENCE • PARIS • NEW YORK
            </div>
          </div>

          {/* Right: Form */}
          <div className="p-8 md:p-12 bg-[#e7e5e4]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-1">
              DISPATCH NOTE
            </span>
            <h2 className="font-davinci text-3xl font-medium text-[#000000] mb-6">
              Send an Inquiry
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#595855]">First Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] text-xs text-[#000000] placeholder:text-[#808080]" 
                    placeholder="Eleanor" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#595855]">Last Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] text-xs text-[#000000] placeholder:text-[#808080]" 
                    placeholder="Vance" 
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#595855]">Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] text-xs text-[#000000] placeholder:text-[#808080]" 
                  placeholder="eleanor@domain.com" 
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#595855]">Your Inquiry</label>
                <textarea 
                  required 
                  rows="4" 
                  value={formData.message}
                  onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] resize-none text-xs text-[#000000] placeholder:text-[#808080]" 
                  placeholder="How may our curators assist your presentation?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-pill-action py-3 px-8 text-xs uppercase tracking-widest mt-2"
              >
                <span>Dispatch Inquiry</span>
                <Send size={12} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
