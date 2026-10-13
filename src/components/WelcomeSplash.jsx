import React, { useState, useEffect } from 'react';
import logo from '../assets/veltrix-logo.png';
import { ArrowRight } from 'lucide-react';

const WelcomeSplash = () => {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState('active'); // 'active', 'exiting', 'hidden'

  useEffect(() => {
    // Elegant theatrical timing: display for ~900ms then smoothly part curtains
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 900);

    // Unmount after curtain transition completes
    const unmountTimer = setTimeout(() => {
      setPhase('hidden');
      setShow(false);
    }, 1600);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  const handleDismiss = (e) => {
    if (e) e.stopPropagation();
    if (phase === 'exiting' || phase === 'hidden') return;
    setPhase('exiting');
    setTimeout(() => {
      setPhase('hidden');
      setShow(false);
    }, 500);
  };

  if (!show || phase === 'hidden') return null;

  return (
    <div
      id="welcome-splash-overlay"
      onClick={handleDismiss}
      className="fixed inset-0 z-[999999] select-none overflow-hidden cursor-pointer"
      title="Click anywhere to enter store"
    >
      {/* Top Curtain Panel (Slides Up) */}
      <div
        className={`absolute top-0 left-0 right-0 h-1/2 z-10 transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          phase === 'exiting' ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, #121c14 0%, #1c2b1e 80%, #243628 100%)',
          borderBottom: '1px solid rgba(220, 198, 168, 0.25)',
        }}
      />

      {/* Bottom Curtain Panel (Slides Down) */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1/2 z-10 transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          phase === 'exiting' ? 'translate-y-full' : 'translate-y-0'
        }`}
        style={{
          background: 'linear-gradient(0deg, #121c14 0%, #1c2b1e 80%, #243628 100%)',
          borderTop: '1px solid rgba(220, 198, 168, 0.25)',
        }}
      />

      {/* Center Stage Presentation Content */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center transition-all duration-400 ease-out ${
          phase === 'exiting' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Soft Golden Ambient Halo */}
        <div
          className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full pointer-events-none blur-3xl opacity-30 animate-pulse"
          style={{ background: 'radial-gradient(circle, #DCC6A8 0%, rgba(52,75,56,0) 70%)' }}
        />

        {/* High-Resolution Veltrix Logo Emblem */}
        <div className="relative mb-5 transform transition-transform duration-700 hover:scale-105">
          <img
            src={logo}
            alt="Veltrix"
            className="h-16 sm:h-22 md:h-24 w-auto object-contain filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Delicate Gold Expanding Hairline */}
        <div className="w-28 sm:w-36 h-[1.5px] bg-gradient-to-r from-transparent via-[#DCC6A8] to-transparent my-3 shadow-[0_0_8px_rgba(220,198,168,0.6)]" />

        {/* Editorial Subtitle */}
        <p className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.35em] uppercase text-[#DCC6A8]/90 font-heading">
          Handcrafted Florals • Bespoke Hampers
        </p>

        <p className="text-[10px] text-[#829078]/80 font-medium tracking-widest uppercase mt-4">
          Click anywhere to enter
        </p>
      </div>

      {/* Top Right Subtle Skip Button */}
      <div className="absolute top-6 right-6 z-30 pointer-events-auto">
        <button
          onClick={handleDismiss}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F8F6F1] hover:text-[#DCC6A8] text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/15 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          aria-label="Skip Intro"
        >
          <span>Skip</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default WelcomeSplash;
