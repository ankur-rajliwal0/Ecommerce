import React, { useState, useEffect } from 'react';

const WelcomeSplash = () => {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState('active'); // 'active', 'exiting', 'hidden'

  const handleSkip = (e) => {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    // Instantly skip the intro
    setPhase('hidden');
    setShow(false);
  };

  useEffect(() => {
    // Original theatrical timing: display for ~900ms then smoothly part curtains
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 900);

    // Unmount after curtain transition completes
    const unmountTimer = setTimeout(() => {
      setPhase('hidden');
      setShow(false);
    }, 1600);

    // Press Enter or Escape or Space to skip immediately
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        handleSkip(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!show || phase === 'hidden') return null;

  return (
    <div
      id="welcome-splash-overlay"
      onClick={handleSkip}
      className="fixed inset-0 z-[999999] select-none overflow-hidden cursor-pointer"
      title="Click anywhere or press Enter to skip"
      style={{
        pointerEvents: phase === 'exiting' ? 'none' : 'auto',
      }}
    >
      {/* Top Curtain Panel (Slides Up) */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 z-10"
        style={{
          background: '#000000',
          borderBottom: '1px solid #dfdcd5',
          transform: phase === 'exiting' ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.7s cubic-bezier(0.77, 0, 0.175, 1)',
          willChange: 'transform',
        }}
      />

      {/* Bottom Curtain Panel (Slides Down) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 z-10"
        style={{
          background: '#000000',
          borderTop: '1px solid #dfdcd5',
          transform: phase === 'exiting' ? 'translateY(100%)' : 'translateY(0)',
          transition: 'transform 0.7s cubic-bezier(0.77, 0, 0.175, 1)',
          willChange: 'transform',
        }}
      />

      {/* Center Stage Presentation Content */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: phase === 'exiting' ? 0 : 1,
          transform: phase === 'exiting' ? 'scale(0.96)' : 'scale(1)',
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          pointerEvents: phase === 'exiting' ? 'none' : 'auto',
        }}
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

      </div>
    </div>
  );
};

export default WelcomeSplash;
