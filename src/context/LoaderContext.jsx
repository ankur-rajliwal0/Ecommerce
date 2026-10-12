import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/lovora-logo.png';

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Trigger loader on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Give it enough time (1s) to show off the beautiful animation

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      
      <style>{`
        .loader-bg {
          background: linear-gradient(-45deg, #fbf6ef, #ead7c3, #dce0d9, #ffffff);
          background-size: 400% 400%;
          animation: gradientBg 3s ease infinite;
        }
        @keyframes gradientBg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .logo-container {
          animation: floatFloat 3s ease-in-out infinite;
        }
        @keyframes floatFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.05); }
        }
        
        .ring-spin-1 {
          animation: spin3D 4s linear infinite;
        }
        .ring-spin-2 {
          animation: spin3DReverse 3s linear infinite;
        }
        
        @keyframes spin3D {
          0% { transform: rotateX(65deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(65deg) rotateY(360deg) rotateZ(360deg); }
        }
        
        @keyframes spin3DReverse {
          0% { transform: rotateX(75deg) rotateY(360deg) rotateZ(0deg); }
          100% { transform: rotateX(75deg) rotateY(0deg) rotateZ(-360deg); }
        }
        
        .slide-up-fade {
          opacity: 0;
          transform: translateY(20px);
          animation: slideUpFade 0.6s ease forwards;
          animation-delay: 0.1s;
        }
        @keyframes slideUpFade {
          to { opacity: 1; transform: translateY(0); }
        }

        .progress-bar-anim {
          animation: scaleXProgress 1s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        @keyframes scaleXProgress {
          0% { transform: scaleX(0); transform-origin: left; }
          49.9% { transform: scaleX(1); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        
        .overlay-enter {
          opacity: 1;
          visibility: visible;
          clip-path: circle(150% at 50% 50%);
          transition: all 0.7s cubic-bezier(0.86, 0, 0.07, 1);
        }
        .overlay-exit {
          opacity: 0;
          visibility: hidden;
          clip-path: circle(0% at 50% 50%);
          transition: all 0.7s cubic-bezier(0.86, 0, 0.07, 1);
        }
      `}</style>

      {/* Full Screen Attractive Loader */}
      <div 
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center loader-bg ${
          isLoading ? 'overlay-enter' : 'overlay-exit'
        }`}
        style={{ perspective: '1000px' }}
      >
        <div className="relative flex flex-col items-center justify-center transform-style-3d mt-[-40px]">
          
          {/* Advanced 3D Rings */}
          <div className="absolute inset-0 -m-20 border-[2px] border-[#dce0d9] rounded-full ring-spin-1 opacity-80 border-t-[#003F3B]"></div>
          <div className="absolute inset-0 -m-14 border-[2px] border-[#ead7c3] rounded-full ring-spin-2 opacity-80 border-b-gray-900"></div>
          
          {/* Logo floating in center */}
          <div className="logo-container relative bg-white/70 backdrop-blur-xl rounded-full p-8 shadow-[0_0_50px_rgba(234,215,195,0.7)] border border-white/50">
            <img src={logo} alt="Lovora" className="h-16 md:h-20 w-auto object-contain drop-shadow-2xl" />
          </div>
        </div>
        
        {/* Loading text & Progress bar */}
        <div className="absolute bottom-32 flex flex-col items-center slide-up-fade">
          <p className="text-gray-900 font-extrabold tracking-[0.4em] uppercase text-xs md:text-sm mb-4">
            Loading Lovora
          </p>
          
          {/* Advanced Progress bar effect */}
          <div className="w-40 md:w-48 h-[3px] bg-gray-900/10 rounded-full overflow-hidden">
             <div className="h-full bg-gray-900 rounded-full w-full progress-bar-anim"></div>
          </div>
        </div>
      </div>
    </LoaderContext.Provider>
  );
};
