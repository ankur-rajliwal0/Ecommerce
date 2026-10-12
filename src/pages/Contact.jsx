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
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12 md:py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-teal/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Get in Touch</h1>
          <p className="text-lg text-gray-600 font-medium">Have a question about an order, need styling advice, or just want to say hi? We're always here to help.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-0 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 max-w-5xl mx-auto">
          
          {/* Contact Info (Left) */}
          <div className="bg-gray-900 text-white p-10 md:p-12 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-teal/20 rounded-full translate-y-1/3 translate-x-1/3 blur-2xl"></div>
            
            <h2 className="text-2xl font-bold mb-10 relative z-10 text-white">Contact Information</h2>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shrink-0 text-primary-teal">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-semibold uppercase tracking-wider">Call Us (Toll-Free)</p>
                  <p className="text-lg font-bold">+1 (800) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shrink-0 text-primary-teal">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-semibold uppercase tracking-wider">Email Support</p>
                  <p className="text-lg font-bold">support@lovora.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shrink-0 text-primary-teal">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-semibold uppercase tracking-wider">Our Headquarters</p>
                  <p className="text-base font-bold leading-relaxed text-gray-200">1234 Commerce Street, Suite 100<br/>New York, NY 10011</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shrink-0 text-primary-teal">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-semibold uppercase tracking-wider">Business Hours</p>
                  <p className="text-base font-bold leading-relaxed text-gray-200">Monday - Friday: 9AM - 6PM EST<br/>Saturday: 10AM - 4PM EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="p-10 md:p-12 lg:p-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">First Name</label>
                  <input required type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-primary-teal focus:ring-4 focus:ring-primary-teal/10 transition-all font-medium text-gray-900 placeholder:text-gray-400" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Last Name</label>
                  <input required type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-primary-teal focus:ring-4 focus:ring-primary-teal/10 transition-all font-medium text-gray-900 placeholder:text-gray-400" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input required type="email" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-primary-teal focus:ring-4 focus:ring-primary-teal/10 transition-all font-medium text-gray-900 placeholder:text-gray-400" placeholder="john@example.com" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Your Message</label>
                <textarea required rows="5" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-primary-teal focus:ring-4 focus:ring-primary-teal/10 transition-all resize-none font-medium text-gray-900 placeholder:text-gray-400" placeholder="How can we help you today?"></textarea>
              </div>

              <button type="submit" disabled={submitted} className={`w-full py-4 rounded-xl font-bold text-gray-900 transition-all flex items-center justify-center gap-2 text-lg ${submitted ? 'bg-green-500' : 'bg-primary-teal hover:bg-secondary-teal shadow-lg hover:shadow-primary-teal/30 hover:-translate-y-0.5'}`}>
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
