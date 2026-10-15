import React, { useEffect, useState, useRef } from 'react';
import { MasonryProductGridSkeleton } from '../components/Skeletons';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getProductPriceInfo } from '../lib/productUtils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Classical oil paintings & classical still life imagery for gallery atmosphere
const PAINTINGS = {
  heroLandscape: "/images/renaissance_landscape.jpg",
  stillLife1: "/images/renaissance_flowers.jpg",
  sculpture: "/images/renaissance_statue.jpg",
  landscapeStudy: "/images/renaissance_landscape.jpg",
  botanicalPanel: "/images/renaissance_flowers.jpg",
};

const categoryVignettes = {
  flower: {
    name: 'Fresh Botanicals',
    subtitle: 'Florentine Cut Stems',
    img: '/images/categories/flower.jpg',
  },
  chocolates: {
    name: 'Artisan Confections',
    subtitle: 'Belgian Cocoa Folios',
    img: '/images/categories/chocolates.jpg',
  },
  combos: {
    name: 'Curated Hampers',
    subtitle: 'Maison Gift Suites',
    img: '/images/categories/combos.jpg',
  },
  decoration: {
    name: 'Living Artifacts',
    subtitle: 'Centerpieces & Objects',
    img: '/images/categories/decoration.jpg',
  },
  crafts: {
    name: 'Handcrafted Keepsakes',
    subtitle: 'Bespoke Folio Crafts',
    img: '/images/categories/crafts.jpg',
  },
};

const Home = () => {
  const [products, setProducts] = useState(() => {
    try {
      const cached = sessionStorage.getItem('veltrix_products_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem('veltrix_products_cache');
    } catch {
      return true;
    }
  });
  const [activeFilter, setActiveFilter] = useState('all');
  const [portraitMap, setPortraitMap] = useState({});
  const mainContainerRef = useRef(null);

  const checkAspectRatio = (id, naturalWidth, naturalHeight) => {
    if (naturalWidth && naturalHeight) {
      const ratio = naturalHeight / naturalWidth;
      // Only items that are genuinely tall/vertical (height > 1.25 * width) adapt to portrait height
      // All other products maintain their standard square size without being forced tiny or huge
      if (ratio >= 1.25) {
        setPortraitMap(prev => {
          if (prev[id]) return prev;
          return { ...prev, [id]: true };
        });
      }
    }
  };

  const handleImageLoad = (id, e) => {
    const img = e.target;
    if (img) checkAspectRatio(id, img.naturalWidth, img.naturalHeight);
  };

  const registerImage = (id, el) => {
    if (el && el.complete && el.naturalWidth && el.naturalHeight) {
      checkAspectRatio(id, el.naturalWidth, el.naturalHeight);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const prodRes = await supabase
        .from('products')
        .select('*, category:categories(name)')
        .order('created_at', { ascending: false });

      if (prodRes.data && prodRes.data.length > 0) {
        setProducts(prodRes.data);
        try {
          sessionStorage.setItem('veltrix_products_cache', JSON.stringify(prodRes.data));
        } catch {
          // ignore
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Dynamic layout refresh when catalog filter changes or initial load completes
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => clearTimeout(timer);
  }, [loading, activeFilter, portraitMap]);

  // Persistent GSAP Scroll & Parallax Animations (Mounts immediately without blink)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Wordmark Parallax Scrub (Hardware-accelerated scaleX spread instead of costly letterSpacing reflow)
      gsap.to('.hero-wordmark', {
        yPercent: 35,
        scaleX: 1.035,
        transformOrigin: 'center center',
        force3D: true,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      // Hero Content subtle lazy drift & fade
      gsap.to('.hero-content', {
        y: -40,
        opacity: 0.15,
        force3D: true,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: '65% top',
          scrub: 1,
        },
      });

      // Hero rotating seal stamp scrub
      gsap.to('.hero-seal-badge', {
        rotation: 180,
        force3D: true,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Velocity Marquee continuous scroll with scroll velocity acceleration (Streamlined without recursive tween flooding)
      const marqueeTrack = document.querySelector('.velocity-marquee-track');
      if (marqueeTrack) {
        const marqueeTween = gsap.to('.velocity-marquee-track', {
          xPercent: -50,
          repeat: -1,
          duration: 25,
          ease: 'none',
          force3D: true,
        });

        let lastVelocity = 1;
        ScrollTrigger.create({
          trigger: '.velocity-marquee-container',
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = Math.abs(self.getVelocity() / 320);
            const target = Math.min(1 + v, 3.2);
            if (Math.abs(target - lastVelocity) > 0.08) {
              lastVelocity = target;
              gsap.to(marqueeTween, {
                timeScale: target,
                duration: 0.25,
                overwrite: 'auto',
                ease: 'power1.out',
              });
            }
          },
          onScrubComplete: () => {
            lastVelocity = 1;
            gsap.to(marqueeTween, { timeScale: 1, duration: 0.6, overwrite: 'auto', ease: 'power2.out' });
          },
          onLeave: () => {
            lastVelocity = 1;
            gsap.to(marqueeTween, { timeScale: 1, duration: 0.5, overwrite: 'auto' });
          },
          onLeaveBack: () => {
            lastVelocity = 1;
            gsap.to(marqueeTween, { timeScale: 1, duration: 0.5, overwrite: 'auto' });
          },
        });
      }

      // 2. Curator's Vault Oil Painting Canvas Parallax (High-Impact Locomotive Deep Scrub)
      gsap.fromTo(
        '.vault-bg-image',
        { yPercent: -32, scale: 1.22, force3D: true },
        {
          yPercent: 32,
          scale: 1.05,
          force3D: true,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: '.vault-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );

      // Vault Header Lazy Fade-in
      gsap.fromTo(
        '.vault-header',
        { y: 30, opacity: 0, force3D: true },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          force3D: true,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: '.vault-section',
            start: 'top 92%',
            once: true,
          },
        }
      );

      // Vault Cards Stagger (Immediately visible as vault-section enters view)
      gsap.fromTo(
        '.vault-card',
        { y: 35, opacity: 0, force3D: true },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          force3D: true,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: '.vault-section',
            start: 'top 90%',
            once: true,
          },
        }
      );

      // 3. Folios / Categories Section
      gsap.fromTo(
        '.folios-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.folios-section',
            start: 'top 92%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.folio-card',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.folios-section',
            start: 'top 90%',
            once: true,
          },
        }
      );

      // 4. Dark Feature Room Philosophy Section
      gsap.fromTo(
        '.darkroom-title',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.darkroom-section',
            start: 'top 90%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.darkroom-col',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.darkroom-section',
            start: 'top 88%',
            once: true,
          },
        }
      );

      // Vignette circular frame parallax counter-drift
      gsap.utils.toArray('.darkroom-circle-img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -10, force3D: true },
          {
            yPercent: 10,
            force3D: true,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.3,
            },
          }
        );
      });

      // 5. Weekly Gallery Offerings / Catalog Section
      gsap.fromTo(
        '.catalog-header',
        { y: 30, opacity: 0, force3D: true },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          force3D: true,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.catalog-section',
            start: 'top 92%',
            once: true,
          },
        }
      );

      // Catalog Product Cards Lazy Cascade
      gsap.fromTo(
        '.catalog-card',
        { y: 35, opacity: 0, force3D: true },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.05,
          force3D: true,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.catalog-section',
            start: 'top 90%',
            once: true,
          },
        }
      );

      // 6. Editorial Covenant Section
      gsap.fromTo(
        '.editorial-content',
        { y: 35, opacity: 0, force3D: true },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          force3D: true,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.editorial-section',
            start: 'top 90%',
            once: true,
          },
        }
      );

      // Editorial watermark subtle counter drift
      gsap.fromTo(
        '.editorial-watermark',
        { yPercent: -20, force3D: true },
        {
          yPercent: 20,
          force3D: true,
          ease: 'none',
          scrollTrigger: {
            trigger: '.editorial-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );
    }, mainContainerRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    const handleWindowLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleWindowLoad);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('load', handleWindowLoad);
      ctx.revert();
    };
  }, []);

  const featuredAcquisitions = products.length >= 3
    ? products.slice(0, 3)
    : [
        products[0] || {
          id: 'feat-1',
          name: 'Florentine Heritage Bouquet',
          price: 1850,
          image_url: '/images/categories/flower.jpg',
          description: 'Fresh crimson roses, white larkspur, and seeded eucalyptus bound in hand-pressed vellum.',
        },
        products[1] || {
          id: 'feat-2',
          name: 'Grand Reserve Artisan Hamper',
          price: 4200,
          image_url: '/images/categories/combos.jpg',
          description: 'Single-origin cocoa bars, Sicilian pistachios, and botanical infusion preserves in a linen box.',
        },
        products[2] || {
          id: 'feat-3',
          name: 'Handcrafted Living Artifact',
          price: 3600,
          image_url: '/images/categories/decoration.jpg',
          description: 'Preserved botanical specimens cast in optical-grade museum resin with stone plinth.',
        },
      ];

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter(p => p.category?.name?.toLowerCase().includes(activeFilter.toLowerCase()) || p.category_id === activeFilter);

  return (
    <div ref={mainContainerRef} className="w-full bg-[#c4c3b6] text-[#000000] overflow-x-hidden">
      
      {/* ========================================================
          1. HERO WORDMARK SECTION (Putty canvas, monumental typography)
          ======================================================== */}
      <section className="hero-section relative w-full bg-[#c4c3b6] pt-16 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 flex flex-col items-center justify-between min-h-[82vh] overflow-hidden border-b border-[#000000]/15">
        
        {/* Desktop Floating Coordinates Stamp */}
        <div
          className="hidden lg:flex absolute top-20 left-8 xl:left-14 z-20 flex-col items-start gap-1 select-none pointer-events-none"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-helvetica text-[#595855] font-semibold">
            LAT: 43°46'N — LON: 11°15'E
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] font-helvetica text-[#000000]/60">
            HISTORIC ATELIER • FIRENZE
          </span>
        </div>

        {/* Desktop Floating Rotating Atelier Seal */}
        <div
          className="hero-seal-badge hidden lg:flex absolute top-16 right-8 xl:right-14 z-20 w-28 h-28 rounded-full border border-[#000000]/25 bg-[#e7e5e4]/80 backdrop-blur-xs flex-col items-center justify-center p-2 shadow-xs select-none pointer-events-none"
        >
          <svg className="w-full h-full animate-[spin_24s_linear_infinite]" viewBox="0 0 100 100">
            <path
              id="circlePath"
              d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
              fill="none"
            />
            <text className="text-[9px] uppercase tracking-[0.26em] font-helvetica font-medium fill-[#000000]">
              <textPath href="#circlePath">
                ✦ VELTRIX ATELIER • BOTANICAL VAULT •
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 m-auto w-10 h-10 rounded-full border border-[#000000]/20 flex items-center justify-center text-[10px] font-davinci font-bold text-[#000000]">
            VX
          </div>
        </div>

        {/* Top Centered Editorial Cluster */}
        <div className="hero-content flex flex-col items-center text-center max-w-2xl mx-auto z-10 pt-4">
          
          {/* Sub-headline in Davinci 52px weight 500, letter-spacing -0.47px */}
          <h1 className="font-davinci text-3xl sm:text-5xl md:text-[52px] leading-[1.05] font-medium tracking-[-0.03em] text-[#000000] mb-4 sm:mb-6">
            CURATED BOTANICALS <span className="italic font-normal">on</span> LIVING ART
          </h1>

          {/* Stat Pair below: Helvetica Now 16px weight 500, 28px separation */}
          <div className="flex items-center justify-center gap-7 sm:gap-9 text-xs sm:text-[15px] font-helvetica font-medium tracking-wider text-[#000000] uppercase mb-8">
            <span>EDITION: VOL. 01 — 2026</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#000000]" />
            <span>ARCHIVE: 480+ RARITIES</span>
          </div>

          {/* Pill Action Button: Filled black pill with white text (28.8px radius) */}
          <Link
            to="/products"
            className="btn-pill-action py-3 px-6 sm:px-8 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-200 shadow-sm"
          >
            <span>Explore the Archive</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile Interactive Visual Showcase (Visible only on mobile, hidden on desktop) */}
        <div className="md:hidden w-full max-w-md mx-auto my-5 z-10 flex flex-col gap-3.5 px-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* Quick-Discovery Category Circles */}
          <div className="w-full">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-helvetica text-[#595855] font-semibold">
                Curated Disciplines
              </span>
              <Link to="/products" className="text-[10px] font-helvetica uppercase tracking-wider text-[#000000] hover:text-[#344B38] transition-colors font-semibold">
                Explore All →
              </Link>
            </div>

            <div className="grid grid-cols-5 gap-2 w-full py-1">
              {[
                { name: 'Botanicals', img: '/images/categories/flower.jpg', query: 'bouquet' },
                { name: 'Hampers', img: '/images/categories/combos.jpg', query: 'gift' },
                { name: 'Confections', img: '/images/categories/chocolates.jpg', query: 'chocolate' },
                { name: 'Artifacts', img: '/images/categories/decoration.jpg', query: 'artifact' },
                { name: 'Crafts', img: '/images/categories/crafts.jpg', query: 'craft' },
              ].map((cat, idx) => (
                <Link
                  key={idx}
                  to={`/products?search=${cat.query}`}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full p-[2px] border border-[#000000]/25 group-hover:border-[#344B38] bg-[#ffffff] shadow-xs transition-all duration-300 group-hover:scale-105">
                    <img 
                      src={cat.img} 
                      alt={cat.name} 
                      className="w-full h-full object-cover rounded-full filter contrast-[1.05]"
                      onError={(e) => { e.target.src = '/favicon.png'; }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-davinci font-semibold text-[#000000] tracking-tight text-center truncate max-w-full">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Atelier Spotlight Card */}
          <Link
            to="/products"
            className="group block bg-[#e7e5e4] hover:bg-[#dfdcd5] transition-all duration-300 rounded-2xl border border-[#dfdcd5] p-3 shadow-xs hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-[#dfdcd5] bg-[#c4c3b6] shrink-0 relative">
                <img 
                  src="/images/categories/flower.jpg" 
                  alt="Atelier Highlight" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-1 left-1 bg-[#344B38] text-white text-[8px] font-helvetica font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  NEW
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-helvetica text-[#829078] font-semibold">
                    Atelier Spotlight
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#829078]" />
                  <span className="text-[9px] font-helvetica text-[#595855]">Autumn Edition</span>
                </div>
                <h3 className="font-davinci text-sm sm:text-base font-semibold text-[#000000] truncate">
                  Florentine Botanical Foliage
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-[#829078] font-helvetica">Free Express Delivery</span>
                  <span className="text-[11px] font-helvetica font-semibold text-[#344B38] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* Monumental Hero Wordmark: Davinci 500, extreme display size, intentionally cropped at viewport edges */}
        <div className="w-full relative mt-12 sm:mt-16 flex items-center justify-center select-none overflow-hidden pointer-events-none">
          <span 
            className="hero-wordmark font-davinci font-medium text-[#000000] text-[20vw] sm:text-[22vw] md:text-[23vw] leading-[0.8] tracking-[-0.04em] whitespace-nowrap opacity-95 transform translate-y-[8%] block will-change-transform transform-gpu"
            style={{ letterSpacing: '-0.04em' }}
          >
            VELTRIX
          </span>
        </div>
      </section>

      {/* ========================================================
          LOCOMOTIVE RUNNING RIBBON (Velocity Marquee Tape)
          ======================================================== */}
      <div className="velocity-marquee-container w-full bg-[#dfdcd5] border-y border-[#000000]/15 py-3.5 overflow-hidden select-none">
        <div className="velocity-marquee-track flex whitespace-nowrap will-change-transform transform-gpu text-[10px] sm:text-xs font-helvetica uppercase tracking-[0.28em] text-[#000000] font-medium">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-6 sm:gap-8 mx-4">
              <span>Florentine Botanicals</span>
              <span className="text-[#808080]">✦</span>
              <span>Rare Archival Folios</span>
              <span className="text-[#808080]">✦</span>
              <span>White Glove Preservation</span>
              <span className="text-[#808080]">✦</span>
              <span>Handcrafted Atelier Suites</span>
              <span className="text-[#808080]">✦</span>
              <span>Antique Wax Seal</span>
              <span className="text-[#808080]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ========================================================
          2. FLOATING SHOWCASE OVER CLASSICAL OIL PAINTING PANEL (3-Item Curated Acquisition Trio)
          ======================================================== */}
      <section 
        className="vault-section relative w-full py-16 sm:py-24 overflow-hidden border-b border-[#000000]/15 bg-[#c4c3b6] flex flex-col items-center justify-center min-h-[660px]"
      >
        {/* Full-bleed Renaissance Landscape Painting (Edge-to-Edge Canvas with Parallax) */}
        <img
          src={PAINTINGS.heroLandscape}
          alt="Renaissance Classical Landscape"
          decoding="async"
          loading="eager"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          style={{ transform: 'translate3d(0, -32%, 0) scale(1.22)' }}
          className="vault-bg-image absolute -top-[35%] left-0 w-full h-[170%] object-cover object-center will-change-transform transform-gpu filter brightness-[0.85] contrast-[1.05]"
        />

        {/* Ambient Dark Scrim for High Contrast & Readability */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Section Header Floating Over Painting */}
        <div className="vault-header relative z-10 text-center max-w-2xl mx-auto px-4 mb-10 sm:mb-14">
          <span className="text-[10px] sm:text-[11px] font-helvetica uppercase tracking-[0.25em] text-[#dfdcd5] block mb-2 font-medium">
            CURATOR'S VAULT — LIMITED EDITIONS
          </span>
          <h2 className="font-davinci text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#ffffff] drop-shadow-sm">
            Featured Private Acquisitions
          </h2>
          <p className="text-xs text-[#dfdcd5]/90 font-helvetica mt-2 tracking-wide max-w-md mx-auto">
            Three authoritative centerpieces released weekly from our Florentine atelier.
          </p>
        </div>

        {/* 3-Column Grid of Floating Dark Notched Product Cards */}
        <div className="vault-cards-grid relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {featuredAcquisitions.map((product, idx) => {
            const priceInfo = getProductPriceInfo(product);

            return (
              <div
                key={product.id || idx}
                className="vault-card bg-[#000000] text-[#ffffff] p-6 sm:p-7 rounded-[9px] notched-card border border-[#333333] shadow-2xl flex flex-col justify-between hover:border-[#dfdcd5]/60 hover:shadow-3xl transition-all duration-300 will-change-transform transform-gpu"
              >
                {/* Top Label */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-helvetica uppercase tracking-[0.2em] text-[#808080]">
                    FEATURED ACQUISITION
                  </span>
                  <span className="text-[11px] font-helvetica font-medium text-[#ffffff] px-2.5 py-0.5 border border-[#595855] rounded-[28.8px]">
                    NO. 00{idx + 1}
                  </span>
                </div>

                {/* Product Centerpiece Image with Refined Discount Badge */}
                <div className="relative w-full aspect-square mb-5">
                  {priceInfo.discountPercent > 0 && (
                    <span className="absolute -top-2 -right-2 z-20 bg-[#ffffff] text-[#000000] border border-[#dfdcd5] px-2.5 py-0.5 rounded-full text-[10px] font-bold font-helvetica shadow-md uppercase tracking-wider whitespace-nowrap pointer-events-none">
                      -{priceInfo.discountPercent}%
                    </span>
                  )}
                  <Link to={`/product/${product.id}`} className="block w-full h-full bg-[#1a1a1a] rounded-[9px] overflow-hidden group">
                    <img
                      src={product.image_url?.split(',')[0] || PAINTINGS.stillLife1}
                      alt={product.name}
                      onError={(e) => { e.target.src = PAINTINGS.stillLife1; }}
                      className="w-full h-full object-cover filter contrast-[1.02] group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                </div>

                {/* Product Title */}
                <div className="mb-5 flex-1">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-davinci text-xl sm:text-2xl font-medium tracking-tight text-[#ffffff] line-clamp-1 mb-1.5">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#808080] font-helvetica line-clamp-2">
                    {product.description || "Hand-selected seasonal botanicals arranged according to Florentine classical composition."}
                  </p>
                </div>

                {/* Bottom Bar: Lower-left SCROLL micro-label & Action Link */}
                <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
                  <span className="text-[9px] font-helvetica uppercase tracking-[0.25em] text-[#808080]">
                    SCROLL ↓
                  </span>
                  <Link
                    to={`/product/${product.id}`}
                    className="btn-pill-action bg-[#ffffff] text-[#000000] hover:bg-[#e7e5e4] py-1.5 px-4 text-xs font-medium"
                  >
                    <span>View Details</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          3. CURATED FOLIOS / CATEGORY CARDS (Bone #e7e5e4 surface, 9px radius)
          ======================================================== */}
      <section className="folios-section w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="folios-header flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 border-b border-[#dfdcd5] pb-6 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#595855] font-helvetica block mb-1">
              ARCHIVE DIVISIONS
            </span>
            <h2 className="font-davinci text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#000000]">
              Curated Folios by Discipline
            </h2>
          </div>
          <Link to="/products" className="ghost-link text-xs uppercase tracking-widest font-medium self-start sm:self-auto">
            View All Disciplines →
          </Link>
        </div>

        {/* 4-Column Grid of Elevated Bone Cards */}
        <div className="folios-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {Object.entries(categoryVignettes).slice(0, 4).map(([key, item], idx) => (
            <Link
              key={key}
              to={`/products?search=${key}`}
              className="folio-card group bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] p-5 flex flex-col justify-between hover:border-[#000000] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#595855] mb-4 font-helvetica">
                <span>FOLIO NO. 0{idx + 1}</span>
                <span>ARCHIVED</span>
              </div>

              {/* Vignette Image */}
              <div className="relative w-full aspect-[4/3] bg-[#c4c3b6] rounded-[9px] overflow-hidden mb-5">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div>
                <h3 className="font-davinci text-2xl font-medium text-[#000000] mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-[#595855] font-helvetica">
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#dfdcd5] flex justify-between items-center text-xs text-[#000000] font-helvetica">
                <span className="text-[11px] uppercase tracking-wider text-[#595855]">Explore</span>
                <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          4. DARK FEATURE ROOM (Pitch-black #000000 room with circular vignettes & actionable atelier disciplines)
          ======================================================== */}
      <section className="darkroom-section w-full bg-[#000000] text-[#ffffff] py-24 sm:py-32 px-4 sm:px-6 border-y border-[#333333]">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          
          {/* Centered Heading in Davinci */}
          <span className="text-[11px] font-helvetica uppercase tracking-[0.25em] text-[#808080] mb-3">
            ATELIER DISCIPLINES & PROVENANCE
          </span>
          <h2 className="darkroom-title font-davinci text-3xl sm:text-6xl md:text-[84px] leading-[0.95] font-medium tracking-[-0.02em] text-[#ffffff] mb-4 sm:mb-6 max-w-4xl">
            THE ART OF LIVING EXPLAINED
          </h2>
          <p className="text-xs sm:text-sm text-[#808080] font-helvetica max-w-2xl mx-auto mb-16 sm:mb-20 leading-relaxed">
            Three uncompromised disciplines behind every floral arrangement, sculptural artifact, and wax-sealed gift suite delivered to your home.
          </p>

          {/* 3-Column Grid of Actionable Circular Image Vignettes */}
          <div className="darkroom-grid grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 w-full">
            
            {/* Column 1: Fresh Botanicals */}
            <Link
              to="/products?search=flower"
              className="darkroom-col group flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl border border-transparent hover:border-[#333333] hover:bg-[#0a0a0a] transition-all duration-300"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] font-helvetica text-[#808080] group-hover:text-[#DCC6A8] transition-colors mb-2">
                DISCIPLINE 01 • FRESH HARVEST
              </span>
              <h3 className="font-davinci text-2xl font-medium text-[#ffffff] mb-6 tracking-tight group-hover:text-[#DCC6A8] transition-colors">
                Florentine Botanical Harvest
              </h3>
              
              <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full overflow-hidden bg-[#1a1a1a] mb-6 flex-shrink-0 relative ring-1 ring-[#262626] group-hover:ring-[#DCC6A8]/60 transition-all duration-500">
                <img
                  src={PAINTINGS.stillLife1}
                  alt="Floral Harvest"
                  onError={(e) => { e.currentTarget.src = '/images/categories/flower.jpg'; }}
                  className="darkroom-circle-img w-full h-full object-cover filter contrast-[1.05] group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <p className="text-xs text-[#a3a3a3] max-w-xs font-helvetica leading-relaxed mb-4">
                European dawn harvest preserved in moisture-regulated silk vaults, delivering 7+ days of living vitality directly to your salon.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
                <span className="text-[9px] uppercase tracking-wider font-helvetica px-2 py-0.5 rounded-full bg-[#171717] text-[#808080] border border-[#262626]">
                  ✦ 24H Fresh Transit
                </span>
                <span className="text-[9px] uppercase tracking-wider font-helvetica px-2 py-0.5 rounded-full bg-[#171717] text-[#808080] border border-[#262626]">
                  ✦ Hydro-Reservoir
                </span>
              </div>

              {/* Action Button */}
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest font-helvetica text-[#ffffff] group-hover:text-[#DCC6A8] transition-colors">
                <span>Shop Botanicals</span>
                <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Column 2: Sculptures & Objects */}
            <Link
              to="/products?search=decoration"
              className="darkroom-col group flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl border border-transparent hover:border-[#333333] hover:bg-[#0a0a0a] transition-all duration-300"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] font-helvetica text-[#808080] group-hover:text-[#DCC6A8] transition-colors mb-2">
                DISCIPLINE 02 • LIVING ARTIFACTS
              </span>
              <h3 className="font-davinci text-2xl font-medium text-[#ffffff] mb-6 tracking-tight group-hover:text-[#DCC6A8] transition-colors">
                Sculptural Composition
              </h3>

              <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full overflow-hidden bg-[#1a1a1a] mb-6 flex-shrink-0 relative ring-1 ring-[#262626] group-hover:ring-[#DCC6A8]/60 transition-all duration-500">
                <img
                  src={PAINTINGS.sculpture}
                  alt="Sculptural Form"
                  onError={(e) => { e.currentTarget.src = '/images/categories/crafts.jpg'; }}
                  className="darkroom-circle-img w-full h-full object-cover filter contrast-[1.05] group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <p className="text-xs text-[#a3a3a3] max-w-xs font-helvetica leading-relaxed mb-4">
                Hand-cast stone vessels, classical bust artifacts, and bespoke objects calculated with golden ratio proportions for classical interiors.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
                <span className="text-[9px] uppercase tracking-wider font-helvetica px-2 py-0.5 rounded-full bg-[#171717] text-[#808080] border border-[#262626]">
                  ✦ Hand-Cast Stone
                </span>
                <span className="text-[9px] uppercase tracking-wider font-helvetica px-2 py-0.5 rounded-full bg-[#171717] text-[#808080] border border-[#262626]">
                  ✦ Limited Atelier Run
                </span>
              </div>

              {/* Action Button */}
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest font-helvetica text-[#ffffff] group-hover:text-[#DCC6A8] transition-colors">
                <span>Explore Artifacts</span>
                <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Column 3: Wax-Sealed Gifting */}
            <Link
              to="/products?search=combos"
              className="darkroom-col group flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl border border-transparent hover:border-[#333333] hover:bg-[#0a0a0a] transition-all duration-300"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] font-helvetica text-[#808080] group-hover:text-[#DCC6A8] transition-colors mb-2">
                DISCIPLINE 03 • GIFT PRIVILEGE
              </span>
              <h3 className="font-davinci text-2xl font-medium text-[#ffffff] mb-6 tracking-tight group-hover:text-[#DCC6A8] transition-colors">
                Wax-Sealed Vellum Folios
              </h3>

              <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full overflow-hidden bg-[#1a1a1a] mb-6 flex-shrink-0 relative ring-1 ring-[#262626] group-hover:ring-[#DCC6A8]/60 transition-all duration-500">
                <img
                  src={PAINTINGS.landscapeStudy}
                  alt="Vellum Folio"
                  onError={(e) => { e.currentTarget.src = '/images/renaissance_landscape.jpg'; }}
                  className="darkroom-circle-img w-full h-full object-cover filter contrast-[1.05] group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <p className="text-xs text-[#a3a3a3] max-w-xs font-helvetica leading-relaxed mb-4">
                Accompanied by custom handwritten calligraphy on heavy 300gsm deckle-edge rag paper sealed with antique wax with every acquisition.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
                <span className="text-[9px] uppercase tracking-wider font-helvetica px-2 py-0.5 rounded-full bg-[#171717] text-[#808080] border border-[#262626]">
                  ✦ Free Calligraphy
                </span>
                <span className="text-[9px] uppercase tracking-wider font-helvetica px-2 py-0.5 rounded-full bg-[#171717] text-[#808080] border border-[#262626]">
                  ✦ Antique Brass Seal
                </span>
              </div>

              {/* Action Button */}
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest font-helvetica text-[#ffffff] group-hover:text-[#DCC6A8] transition-colors">
                <span>Shop Gift Suites</span>
                <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

          </div>

          {/* Atelier Customer Guarantees Strip */}
          <div className="mt-16 sm:mt-24 pt-10 border-t border-[#222222] w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-8 text-center select-none">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-helvetica uppercase tracking-[0.22em] text-[#808080] mb-1.5">
                Stem Preservation
              </span>
              <span className="text-xs sm:text-sm text-[#ffffff] font-medium font-helvetica">
                7-Day Bloom Vitality Guarantee
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-helvetica uppercase tracking-[0.22em] text-[#808080] mb-1.5">
                Gift Privilege
              </span>
              <span className="text-xs sm:text-sm text-[#ffffff] font-medium font-helvetica">
                Complimentary 300gsm Wax Folio
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-helvetica uppercase tracking-[0.22em] text-[#808080] mb-1.5">
                Atelier Assurance
              </span>
              <span className="text-xs sm:text-sm text-[#ffffff] font-medium font-helvetica">
                100% Secure White-Glove Dispatch
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          5. CURATED CATALOG / WEEKLY BEST SELECTION
          ======================================================== */}
      <section className="catalog-section w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        
        {/* Section Header with Category Filter Chips (28.8px pill radius) */}
        <div className="catalog-header flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#dfdcd5] gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#595855] font-helvetica block mb-1">
              CURRENT CATALOG
            </span>
            <h2 className="font-davinci text-3xl sm:text-5xl font-medium tracking-tight text-[#000000]">
              Weekly Gallery Offerings
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Rarities' },
              { id: 'flower', label: 'Botanicals' },
              { id: 'chocolates', label: 'Confections' },
              { id: 'combos', label: 'Hampers' },
              { id: 'decoration', label: 'Living' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`text-xs px-4 py-2 rounded-[28.8px] font-helvetica uppercase tracking-wider transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-[#000000] text-[#ffffff]'
                    : 'bg-[#e7e5e4] text-[#000000] border border-[#dfdcd5] hover:border-[#000000]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - Pinterest Masonry Layout */}
        {loading ? (
          <MasonryProductGridSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center font-helvetica text-sm text-[#595855]">
            No catalog items found under this folio.
          </div>
        ) : (
          <div className="catalog-masonry columns-2 sm:columns-3 lg:columns-4 gap-4 sm:gap-6 [column-fill:_balance]">
            {filteredProducts.map((product) => {
              const priceInfo = getProductPriceInfo(product);
              const isPortrait = Boolean(portraitMap[product.id]);

              return (
                <div key={product.id} className="break-inside-avoid mb-4 sm:mb-6">
                  <Link
                    to={`/product/${product.id}`}
                    className="catalog-card group block relative bg-[#e7e5e4] border border-[#dfdcd5] rounded-2xl p-2.5 sm:p-4 hover:border-[#000000] transition-colors duration-200"
                  >
                    {/* Image Container: standard aspect-square by default; only naturally tall items get aspect-[3/4] Pinterest height */}
                    <div className={`relative w-full ${isPortrait ? 'aspect-[3/4]' : 'aspect-square'} mb-2.5 rounded-xl overflow-hidden bg-[#dfdcd5] transition-[aspect-ratio] duration-300`}>
                      {/* Refined Luxury Discount Badge */}
                      {priceInfo.discountPercent > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 z-20 bg-[#000000] text-[#ffffff] border border-[#DCC6A8] px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold font-helvetica shadow-md whitespace-nowrap pointer-events-none tracking-wider">
                          -{priceInfo.discountPercent}%
                        </span>
                      )}

                      <img
                        ref={(el) => registerImage(product.id, el)}
                        src={product.image_url?.split(',')[0] || '/favicon.png'}
                        alt={product.name}
                        onLoad={(e) => handleImageLoad(product.id, e)}
                        onError={(e) => { e.target.src = '/favicon.png'; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Metadata & Title */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-[#595855] font-helvetica block mb-0.5">
                        {product.category?.name || 'Curated'}
                      </span>
                      <h4 className="font-davinci text-base sm:text-xl font-medium text-[#000000] line-clamp-1 leading-snug">
                        {product.name}
                      </h4>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            to="/products"
            className="btn-sweep-theme"
          >
            <span>View Full Archive ({products.length} Items)</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ========================================================
          6. EDITORIAL TESTIMONIAL / COVENANT
          ======================================================== */}
      <section className="editorial-section relative w-full bg-[#e7e5e4] border-t border-[#dfdcd5] py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
        {/* Floating Classical Quotation Mark Watermark */}
        <span
          className="editorial-watermark absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 font-davinci text-[160px] sm:text-[240px] leading-none text-[#000000]/[0.04] select-none pointer-events-none will-change-transform"
        >
          “
        </span>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Editorial Quote */}
          <div className="editorial-content text-center max-w-3xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#595855] font-helvetica block mb-4 font-semibold">
              EDITORIAL COVENANT
            </span>
            <blockquote className="font-davinci text-2xl sm:text-3xl md:text-4xl italic text-[#000000] leading-snug mb-6">
              "We treat the presentation of gifts not as a transaction, but as an exhibition of affection that honors Renaissance standards of beauty."
            </blockquote>
            <cite className="text-xs uppercase tracking-widest font-helvetica not-italic text-[#595855]">
              — THE CURATORIAL DESK, VELTRIX
            </cite>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
