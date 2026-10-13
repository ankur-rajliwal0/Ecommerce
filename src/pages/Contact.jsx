import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-[#F8F6F1] min-h-[calc(100vh-80px)] py-12 md:py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#344B38]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#292923] mb-6 tracking-tight">Get in Touch</h1>
          <p className="text-lg text-[#829078] font-medium">Have a question about an order, need styling advice, or just want to say hi? We're always here to help.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-0 bg-white rounded-2xl shadow-xl overflow-hidden border border-[#DCC6A8]/60 max-w-5xl mx-auto">
          
          {/* Contact Info (Left) */}
          <div className="bg-[#344B38] text-[#F8F6F1] p-10 md:p-12 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#829078]/20 rounded-full translate-y-1/3 translate-x-1/3 blur-2xl"></div>
            
            <h2 className="text-2xl font-bold mb-10 relative z-10 text-[#F8F6F1]">Contact Information</h2>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-[#292923]/40 rounded-full flex items-center justify-center shrink-0 text-[#DCC6A8]">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-[#DCC6A8] mb-1 font-semibold uppercase tracking-wider">Call Us (Toll-Free)</p>
                  <p className="text-lg font-bold text-white">+1 (800) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-[#292923]/40 rounded-full flex items-center justify-center shrink-0 text-[#DCC6A8]">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-[#DCC6A8] mb-1 font-semibold uppercase tracking-wider">Email Support</p>
                  <p className="text-lg font-bold text-white">support@veltrix.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-[#292923]/40 rounded-full flex items-center justify-center shrink-0 text-[#DCC6A8]">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-[#DCC6A8] mb-1 font-semibold uppercase tracking-wider">Our Headquarters</p>
                  <p className="text-base font-bold leading-relaxed text-[#E9E9E0]">1234 Commerce Street, Suite 100<br/>New York, NY 10011</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-[#292923]/40 rounded-full flex items-center justify-center shrink-0 text-[#DCC6A8]">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-[#DCC6A8] mb-1 font-semibold uppercase tracking-wider">Business Hours</p>
                  <p className="text-base font-bold leading-relaxed text-[#E9E9E0]">Monday - Friday: 9AM - 6PM EST<br/>Saturday: 10AM - 4PM EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="p-10 md:p-12 lg:p-14">
            <h2 className="text-2xl font-bold text-[#292923] mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#292923]">First Name</label>
                  <input required type="text" className="w-full p-4 bg-[#F8F6F1] border border-[#DCC6A8]/60 rounded-xl outline-none focus:bg-white focus:border-[#344B38] focus:ring-4 focus:ring-[#344B38]/10 transition-all font-medium text-[#292923] placeholder:text-[#829078]" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#292923]">Last Name</label>
                  <input required type="text" className="w-full p-4 bg-[#F8F6F1] border border-[#DCC6A8]/60 rounded-xl outline-none focus:bg-white focus:border-[#344B38] focus:ring-4 focus:ring-[#344B38]/10 transition-all font-medium text-[#292923] placeholder:text-[#829078]" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#292923]">Email Address</label>
                <input required type="email" className="w-full p-4 bg-[#F8F6F1] border border-[#DCC6A8]/60 rounded-xl outline-none focus:bg-white focus:border-[#344B38] focus:ring-4 focus:ring-[#344B38]/10 transition-all font-medium text-[#292923] placeholder:text-[#829078]" placeholder="john@example.com" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#292923]">Your Message</label>
                <textarea required rows="5" className="w-full p-4 bg-[#F8F6F1] border border-[#DCC6A8]/60 rounded-xl outline-none focus:bg-white focus:border-[#344B38] focus:ring-4 focus:ring-[#344B38]/10 transition-all resize-none font-medium text-[#292923] placeholder:text-[#829078]" placeholder="How can we help you today?"></textarea>
              </div>

              <button type="submit" disabled={submitted} className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 text-lg shadow-lg ${submitted ? 'bg-[#344B38]' : 'bg-[#344B38] hover:bg-[#829078] shadow-[#344B38]/20 hover:-translate-y-0.5'}`}>
                {submitted ? (
                  <><CheckCircle2 size={24} /> Message Sent!</>
                ) : (
                  <><Send size={20} /> Send Message</>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
