import React from 'react';
import { Heart, Package, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="w-full bg-[#c4c3b6] text-[#000000] min-h-[calc(100vh-80px)] font-helvetica">
      
      {/* Editorial Ink Room Hero */}
      <div className="bg-[#000000] text-[#ffffff] py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden border-b border-[#333333]">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#808080] block mb-3 font-helvetica">
            THE SALON MANIFESTO • FLORENTINE HERITAGE
          </span>
          <h1 className="font-davinci text-4xl sm:text-6xl md:text-7xl font-medium mb-6 tracking-tight text-[#ffffff]">
            The Art of Thoughtful Giving
          </h1>
          <p className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto text-[#808080] leading-relaxed font-helvetica">
            Conceived as an exhibition of classical floristry, artisanal confections, and bespoke gift objects that reframe modern gifting as high art.
          </p>
        </div>
      </div>

      {/* Main Content Exhibition Spread */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 sm:gap-16 items-center mb-24">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-2 font-helvetica">
              PROVENANCE
            </span>
            <h2 className="font-davinci text-3xl sm:text-5xl font-medium text-[#000000] mb-6 tracking-tight">
              Curated as a Private Salon
            </h2>
            <p className="text-xs sm:text-sm text-[#595855] mb-5 leading-relaxed font-helvetica">
              At Veltrix, we reject disposable convenience. Every floral arrangement is cut at dawn from legacy European and Himalayan farms, bound with raw silk ribbon, and accompanied by deckle-edge archival vellum note cards.
            </p>
            <p className="text-xs sm:text-sm text-[#595855] leading-relaxed font-helvetica">
              Our chocolatiers temper grand cru cocoa using 18th-century stone grinders, producing confections that serve as edible still-life studies. To receive a Veltrix delivery is to receive a museum-grade gesture of devotion.
            </p>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] bg-[#e7e5e4] rounded-[9px] overflow-hidden border border-[#dfdcd5] shadow-xl">
              <img 
                src="/images/renaissance_flowers.jpg" 
                alt="Florentine Floral Art" 
                onError={(e) => { e.target.src = '/favicon.png'; }}
                className="w-full h-full object-cover filter contrast-[1.05]" 
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#e7e5e4] p-5 rounded-[9px] border border-[#dfdcd5] hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-[#000000] flex items-center justify-center font-davinci text-lg text-[#000000]">
                  V
                </div>
                <div>
                  <p className="font-davinci text-2xl font-medium text-[#000000]">EST. 2026</p>
                  <p className="text-[10px] text-[#595855] uppercase tracking-wider font-helvetica">FLORENCE & BEYOND</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="text-center mb-16 border-t border-[#dfdcd5] pt-16">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-2 font-helvetica">
            TENETS OF CURATION
          </span>
          <h2 className="font-davinci text-3xl sm:text-5xl font-medium text-[#000000] mb-3">
            Our Triad of Standards
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-[#e7e5e4] p-6 rounded-[9px] border border-[#dfdcd5]">
            <span className="text-[10px] font-mono text-[#595855] block mb-4">TENET NO. 01</span>
            <h3 className="font-davinci text-2xl font-medium text-[#000000] mb-2">Pristine Botanical Life</h3>
            <p className="text-xs text-[#595855] leading-relaxed">
              Every petal and stem is inspected for moisture retention and structural vigor before entering temperature-secured transport.
            </p>
          </div>

          <div className="bg-[#e7e5e4] p-6 rounded-[9px] border border-[#dfdcd5]">
            <span className="text-[10px] font-mono text-[#595855] block mb-4">TENET NO. 02</span>
            <h3 className="font-davinci text-2xl font-medium text-[#000000] mb-2">Uncompromising Packaging</h3>
            <p className="text-xs text-[#595855] leading-relaxed">
              Rigid handmade hatboxes, vellum envelopes, and custom-embossed gold and wax seals guarantee an unboxing ceremony without equal.
            </p>
          </div>

          <div className="bg-[#e7e5e4] p-6 rounded-[9px] border border-[#dfdcd5]">
            <span className="text-[10px] font-mono text-[#595855] block mb-4">TENET NO. 03</span>
            <h3 className="font-davinci text-2xl font-medium text-[#000000] mb-2">White Glove Discretion</h3>
            <p className="text-xs text-[#595855] leading-relaxed">
              Our couriers handle each order with the discretion and elegance of private art curators delivering commissioned masterpieces.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/products" className="btn-pill-action py-3 px-8 text-xs uppercase tracking-widest">
            <span>Explore the Complete Archive</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
