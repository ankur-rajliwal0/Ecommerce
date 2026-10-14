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
          background: '#000000',
          borderBottom: '1px solid #dfdcd5',
        }}
      />

      {/* Bottom Curtain Panel (Slides Down) */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1/2 z-10 transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          phase === 'exiting' ? 'translate-y-full' : 'translate-y-0'
        }`}
        style={{
          background: '#000000',
          borderTop: '1px solid #dfdcd5',
        }}
      />

      {/* Center Stage Presentation Content */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center transition-all duration-400 ease-out ${
          phase === 'exiting' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Circled Monogram Mark */}
        <div className="w-16 h-16 rounded-full border-[1.5px] border-[#ffffff] flex items-center justify-center font-davinci text-3xl font-medium text-[#ffffff] mb-5">
          V
        </div>

        <h1 className="font-davinci text-4xl sm:text-5xl font-medium tracking-tight text-[#ffffff] mb-2 uppercase">
          Veltrix
        </h1>

        {/* Delicate Vellum Hairline */}
        <div className="w-24 h-[1px] bg-[#dfdcd5] my-2" />

        {/* Editorial Subtitle */}
        <p className="text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase text-[#808080] font-helvetica">
          Curated Botanicals • Living Artifacts
        </p>

        <p className="text-[10px] text-[#595855] font-helvetica tracking-widest uppercase mt-4">
          Click anywhere to enter the exhibition
        </p>
      </div>

      {/* Top Right Subtle Skip Button */}
      <div className="absolute top-6 right-6 z-30 pointer-events-auto">
        <button
          onClick={handleDismiss}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[28.8px] bg-[#000000] text-[#ffffff] text-xs font-helvetica uppercase tracking-wider border border-[#dfdcd5] transition-all hover:bg-[#dfdcd5] hover:text-[#000000] cursor-pointer"
          aria-label="Skip Intro"
        >
          <span>Enter</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default WelcomeSplash;
