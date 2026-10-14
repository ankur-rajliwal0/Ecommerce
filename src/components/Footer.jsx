import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('You are subscribed to the Veltrix Folio & Private Viewings.');
    setEmail('');
  };

  return (
    <footer className="bg-[#ebebeb] text-[#000000] border-t border-[#dfdcd5] mt-auto font-helvetica">
      {/* Top Folio Inscription Banner */}
      <div className="border-b border-[#dfdcd5] py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#595855] block mb-1">
              Private Folio & Exhibition Dispatch
            </span>
            <h3 className="font-davinci text-2xl sm:text-3xl text-[#000000] font-medium tracking-tight">
              Receive notifications of limited botanical harvests & rare releases.
            </h3>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="bg-[#ffffff] text-[#000000] placeholder-[#808080] text-xs px-4 py-2.5 rounded-[9px] border border-[#dfdcd5] focus:outline-none focus:border-[#000000] w-full sm:w-72 font-helvetica"
            />
            <button
              type="submit"
              className="btn-pill-action py-2.5 px-4 text-xs font-normal"
            >
              <span>Join</span>
              <ArrowRight size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Monogram & Mission */}
          <div className="col-span-2 md:col-span-2 pr-4">
            <Link to="/" className="flex items-center gap-3 mb-4 group inline-flex">
              <div className="w-8 h-8 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center font-davinci text-lg font-medium text-[#000000]">
                V
              </div>
              <span className="font-davinci text-2xl tracking-[-0.03em] font-medium text-[#000000] uppercase">
                Veltrix
              </span>
            </Link>
            <p className="text-xs text-[#595855] leading-relaxed max-w-sm mb-6">
              A curated salon of fresh botanicals, artisanal confections, and bespoke gift artifacts. Crafted with Florentine elegance and delivered with museum-grade preservation.
            </p>
            <div className="text-[11px] text-[#595855] uppercase tracking-widest font-mono">
              CURATED IN FLORENCE & BEYOND • EST. 2026
            </div>
          </div>

          {/* Collection Column */}
          <div className="col-span-1">
            <h4 className="font-davinci text-lg font-medium text-[#000000] mb-4">Collection</h4>
            <ul className="flex flex-col gap-2 text-xs text-[#595855]">
              <li><Link to="/products" className="hover:text-[#000000] transition-colors">Complete Archive</Link></li>
              <li><Link to="/products?search=bouquet" className="hover:text-[#000000] transition-colors">Botanical Bouquets</Link></li>
              <li><Link to="/products?search=gift" className="hover:text-[#000000] transition-colors">Curated Hampers</Link></li>
              <li><Link to="/products?search=chocolate" className="hover:text-[#000000] transition-colors">Artisan Truffles</Link></li>
              <li><Link to="/products" className="hover:text-[#000000] transition-colors">Limited Releases</Link></li>
            </ul>
          </div>

          {/* Maison & Services Column */}
          <div className="col-span-1">
            <h4 className="font-davinci text-lg font-medium text-[#000000] mb-4">Concierge</h4>
            <ul className="flex flex-col gap-2 text-xs text-[#595855]">
              <li><Link to="/my-orders" className="hover:text-[#000000] transition-colors">Order Tracking</Link></li>
              <li><Link to="/shipping" className="hover:text-[#000000] transition-colors">Courier & Delivery</Link></li>
              <li><Link to="/returns" className="hover:text-[#000000] transition-colors">Care & Replacements</Link></li>
              <li><Link to="/faq" className="hover:text-[#000000] transition-colors">Client FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-[#000000] transition-colors">Direct Assistance</Link></li>
            </ul>
          </div>

          {/* Editorial / About Column */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-davinci text-lg font-medium text-[#000000] mb-4">Maison</h4>
            <ul className="flex flex-col gap-2 text-xs text-[#595855]">
              <li><Link to="/about" className="hover:text-[#000000] transition-colors">The Manifesto</Link></li>
              <li><Link to="/about" className="hover:text-[#000000] transition-colors">Artisan Provenance</Link></li>
              <li><Link to="/privacy" className="hover:text-[#000000] transition-colors">Data Ethics</Link></li>
              <li><Link to="/terms" className="hover:text-[#000000] transition-colors">Client Covenant</Link></li>
            </ul>
          </div>
        </div>

        {/* Hairline separator and copyright */}
        <div className="mt-12 pt-6 border-t border-[#dfdcd5] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#595855]">
          <p>© {new Date().getFullYear()} Veltrix Gallery Inc. All botanical rights preserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-[#000000] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[#000000] transition-colors">Terms of Service</Link>
            <Link to="/shipping" className="hover:text-[#000000] transition-colors">White Glove Delivery</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
