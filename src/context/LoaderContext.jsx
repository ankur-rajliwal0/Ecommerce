import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/veltrix-logo.png';

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  // Subtle top progress bar on route change (does NOT block screen or flash delayed)
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading, showLoader, hideLoader }}>
      {/* Sleek top navigation progress bar */}
      <div 
        className={`fixed top-0 left-0 right-0 z-[10000] h-[3px] pointer-events-none transition-all duration-300 ease-out ${
          isNavigating ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className="h-full bg-[#344B38] shadow-[0_0_8px_rgba(52,75,56,0.6)] transition-all duration-300 ease-out"
          style={{ width: isNavigating ? '100%' : '0%' }}
        />
      </div>

      {children}
      
      <style>{`
        .loader-bg {
          background: linear-gradient(-45deg, #F8F6F1, #E9E9E0, #DCC6A8, #F8F6F1);
          background-size: 400% 400%;
          animation: gradientBg 6s ease infinite;
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
          50% { transform: translateY(-8px) scale(1.03); }
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
        
        .progress-bar-anim {
          animation: scaleXProgress 1.2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        @keyframes scaleXProgress {
          0% { transform: scaleX(0); transform-origin: left; }
          49.9% { transform: scaleX(1); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>

      {/* Full Screen Branded Loader (Only triggers when isLoading is explicitly true) */}
      {isLoading && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center loader-bg backdrop-blur-md transition-opacity duration-300"
          style={{ perspective: '1000px' }}
        >
          <div className="relative flex flex-col items-center justify-center mt-[-40px]">
            {/* 3D Rings in brand colors */}
            <div className="absolute inset-0 -m-16 border-[2px] border-[#829078]/40 rounded-full ring-spin-1 border-t-[#344B38]"></div>
            <div className="absolute inset-0 -m-12 border-[2px] border-[#DCC6A8]/60 rounded-full ring-spin-2 border-b-[#292923]"></div>
            
            {/* Logo container */}
            <div className="logo-container relative bg-white/80 backdrop-blur-xl rounded-full p-8 shadow-[0_10px_30px_rgba(52,75,56,0.15)] border border-[#DCC6A8]/40">
              <img src={logo} alt="Veltrix" className="h-12 md:h-16 w-auto object-contain drop-shadow-md" />
            </div>
          </div>
          
          {/* Loading text & Progress bar */}
          <div className="absolute bottom-32 flex flex-col items-center">
            <p className="text-[#292923] font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4">
              Loading Veltrix
            </p>
            
            <div className="w-40 md:w-48 h-[3px] bg-[#E9E9E0] rounded-full overflow-hidden">
               <div className="h-full bg-[#344B38] rounded-full w-full progress-bar-anim"></div>
            </div>
          </div>
        </div>
      )}
    </LoaderContext.Provider>
  );
};

