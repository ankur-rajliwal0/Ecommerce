import React, { useEffect, useState } from 'react';
import { ProductGridSkeleton } from '../components/Skeletons';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowRight, ShoppingBag, Heart, Star, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductPriceInfo } from '../lib/productUtils';

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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const { addToCart, cartItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        supabase
          .from('products')
          .select('*, category:categories(name)')
          .order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      setLoading(false);
    };

    fetchData();
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
    <div className="w-full bg-[#c4c3b6] text-[#000000] overflow-x-hidden">
      
      {/* ========================================================
          1. HERO WORDMARK SECTION (Putty canvas, monumental typography)
          ======================================================== */}
      <section className="relative w-full bg-[#c4c3b6] pt-16 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 flex flex-col items-center justify-between min-h-[82vh] overflow-hidden border-b border-[#000000]/15">
        
        {/* Top Centered Editorial Cluster */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto z-10 pt-4">
          
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
            className="btn-pill-action py-3 px-6 sm:px-8 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-200"
          >
            <span>Explore the Archive</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Monumental Hero Wordmark: Davinci 500, extreme display size, intentionally cropped at viewport edges */}
        <div className="w-full relative mt-12 sm:mt-16 flex items-center justify-center select-none overflow-hidden pointer-events-none">
          <span 
            className="font-davinci font-medium text-[#000000] text-[20vw] sm:text-[22vw] md:text-[23vw] leading-[0.8] tracking-[-0.04em] whitespace-nowrap opacity-95 transform translate-y-[8%]"
            style={{ letterSpacing: '-0.04em' }}
          >
            VELTRIX
          </span>
        </div>
      </section>

      {/* ========================================================
      {/* ========================================================
          2. FLOATING SHOWCASE OVER CLASSICAL OIL PAINTING PANEL (3-Item Curated Acquisition Trio)
          ======================================================== */}
      <section 
        className="relative w-full py-16 sm:py-24 overflow-hidden border-b border-[#000000]/15 bg-[#c4c3b6] bg-cover bg-center flex flex-col items-center justify-center min-h-[660px]"
        style={{ backgroundImage: `url(${PAINTINGS.heroLandscape})` }}
      >
        {/* Full-bleed Renaissance Landscape Painting (Edge-to-Edge Canvas) */}
        <img
          src={PAINTINGS.heroLandscape}
          alt="Renaissance Classical Landscape"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />

        {/* Ambient Dark Scrim for High Contrast & Readability */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Section Header Floating Over Painting */}
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4 mb-10 sm:mb-14">
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
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {featuredAcquisitions.map((product, idx) => {
            const priceInfo = getProductPriceInfo(product);
            const cartItem = product?.id ? cartItems.find(i => i.id === product.id) : null;
            const inCart = Boolean(cartItem);

            return (
              <div
                key={product.id || idx}
                className="bg-[#000000] text-[#ffffff] p-6 sm:p-7 rounded-[9px] notched-card border border-[#333333] shadow-2xl flex flex-col justify-between hover:border-[#595855] transition-all duration-300"
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

                {/* Product Centerpiece Image */}
                <Link to={`/product/${product.id}`} className="block relative w-full aspect-square bg-[#1a1a1a] rounded-[9px] overflow-hidden mb-5 group">
                  <img
                    src={product.image_url?.split(',')[0] || PAINTINGS.stillLife1}
                    alt={product.name}
                    onError={(e) => { e.target.src = PAINTINGS.stillLife1; }}
                    className="w-full h-full object-cover filter contrast-[1.02] group-hover:scale-105 transition-transform duration-500"
                  />
                  {priceInfo.discountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-[#ffffff] text-[#000000] text-[10px] font-helvetica px-2 py-0.5 rounded-[28.8px] uppercase tracking-wider font-medium">
                      -{priceInfo.discountPercent}%
                    </span>
                  )}
                </Link>

                {/* Product Title and Price */}
                <div className="mb-5 flex-1">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-davinci text-xl sm:text-2xl font-medium tracking-tight text-[#ffffff] hover:underline line-clamp-1 mb-1.5">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#808080] font-helvetica line-clamp-2 mb-3">
                    {product.description || "Hand-selected seasonal botanicals arranged according to Florentine classical composition."}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-helvetica font-medium text-[#ffffff]">
                      ₹{Number(priceInfo.price || product.price || 0).toFixed(2)}
                    </span>
                    {priceInfo.originalPrice && priceInfo.isDiscounted && (
                      <span className="text-xs text-[#808080] line-through font-helvetica">
                        ₹{Number(priceInfo.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Bar: Lower-left SCROLL micro-label & Action Button */}
                <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
                  <span className="text-[9px] font-helvetica uppercase tracking-[0.25em] text-[#808080]">
                    SCROLL ↓
                  </span>
                  {inCart ? (
                    <button
                      onClick={() => {
                        setIsCartOpen(true);
                      }}
                      className="btn-pill-action bg-[#ffffff] text-[#000000] hover:bg-[#e7e5e4] py-1.5 px-4 text-xs font-medium"
                    >
                      <ShoppingBag size={12} />
                      <span>Go to Bag</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addToCart(product);
                      }}
                      className="btn-pill-action bg-[#ffffff] text-[#000000] hover:bg-[#e7e5e4] py-1.5 px-4 text-xs font-medium"
                    >
                      <ShoppingBag size={12} />
                      <span>Add to Bag</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          3. CURATED FOLIOS / CATEGORY CARDS (Bone #e7e5e4 surface, 9px radius)
          ======================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 border-b border-[#dfdcd5] pb-6 gap-4">
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

        {/* 4-Column Grid of Elevated Bone Cards (9px radius, hairline borders) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(categoryVignettes).slice(0, 4).map(([key, item], idx) => (
            <Link
              key={key}
              to={`/products?search=${key}`}
              className="group bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] p-5 flex flex-col justify-between hover:border-[#000000] transition-colors duration-200"
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
                <h3 className="font-davinci text-2xl font-medium text-[#000000] mb-1 group-hover:underline">
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
          4. DARK FEATURE ROOM (Pitch-black #000000 room with circular vignettes & hex indicators)
          ======================================================== */}
      <section className="w-full bg-[#000000] text-[#ffffff] py-24 sm:py-32 px-4 sm:px-6 border-y border-[#333333]">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          
          {/* Centered Heading in Davinci 72-94px weight 500, letter-spacing -0.85px */}
          <span className="text-[11px] font-helvetica uppercase tracking-[0.25em] text-[#808080] mb-3">
            PHILOSOPHY & PROVENANCE
          </span>
          <h2 className="font-davinci text-3xl sm:text-6xl md:text-[84px] leading-[0.95] font-medium tracking-[-0.02em] text-[#ffffff] mb-16 sm:mb-20 max-w-4xl">
            THE ART OF LIVING EXPLAINED
          </h2>

          {/* 3-Column Grid of Circular Classical Image Vignettes (~200px diameter) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full">
            
            {/* Column 1 */}
            <div className="flex flex-col items-center text-center">
              <h4 className="font-davinci text-2xl font-medium text-[#ffffff] mb-6 tracking-tight">
                Florentine Botanical Harvest
              </h4>
              <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full overflow-hidden bg-[#1a1a1a] mb-6 flex-shrink-0">
                <img
                  src={PAINTINGS.stillLife1}
                  alt="Floral Harvest"
                  onError={(e) => { e.currentTarget.src = '/images/categories/flower.jpg'; }}
                  className="w-full h-full object-cover filter contrast-[1.05]"
                />
              </div>
              <p className="text-xs text-[#808080] max-w-xs font-helvetica leading-relaxed mb-6">
                Sourced from ancestral European farms with dewy early-morning cuts preserved in temperature-regulated silk vaults.
              </p>
              {/* 12px Hexagonal Outline Nav Indicator */}
              <div className="hex-indicator text-[#ffffff]" />
            </div>

            {/* Column 2 */}
            <div className="flex flex-col items-center text-center">
              <h4 className="font-davinci text-2xl font-medium text-[#ffffff] mb-6 tracking-tight">
                Sculptural Composition
              </h4>
              <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full overflow-hidden bg-[#1a1a1a] mb-6 flex-shrink-0">
                <img
                  src={PAINTINGS.sculpture}
                  alt="Sculptural Form"
                  onError={(e) => { e.currentTarget.src = '/images/categories/crafts.jpg'; }}
                  className="w-full h-full object-cover filter contrast-[1.05]"
                />
              </div>
              <p className="text-xs text-[#808080] max-w-xs font-helvetica leading-relaxed mb-6">
                Every arrangement is calculated with golden ratio proportions to create an authoritative focal point in classical interiors.
              </p>
              {/* 12px Hexagonal Outline Nav Indicator */}
              <div className="hex-indicator text-[#ffffff]" />
            </div>

            {/* Column 3 */}
            <div className="flex flex-col items-center text-center">
              <h4 className="font-davinci text-2xl font-medium text-[#ffffff] mb-6 tracking-tight">
                Wax-Sealed Vellum Folios
              </h4>
              <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full overflow-hidden bg-[#1a1a1a] mb-6 flex-shrink-0">
                <img
                  src={PAINTINGS.landscapeStudy}
                  alt="Vellum Folio"
                  onError={(e) => { e.currentTarget.src = '/images/renaissance_landscape.jpg'; }}
                  className="w-full h-full object-cover filter contrast-[1.05]"
                />
              </div>
              <p className="text-xs text-[#808080] max-w-xs font-helvetica leading-relaxed mb-6">
                Accompanied by custom handwritten calligraphy on heavy 300gsm deckle-edge rag paper sealed with antique wax.
              </p>
              {/* 12px Hexagonal Outline Nav Indicator */}
              <div className="hex-indicator text-[#ffffff]" />
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          5. CURATED CATALOG / WEEKLY BEST SELECTION
          ======================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        
        {/* Section Header with Category Filter Chips (28.8px pill radius) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#dfdcd5] gap-6">
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

        {/* Product Grid (9px radius, hairline borders, no shadows) */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center font-helvetica text-sm text-[#595855]">
            No catalog items found under this folio.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const priceInfo = getProductPriceInfo(product);
              const cartItem = product?.id ? cartItems.find(i => i.id === product.id) : null;
              const inCart = Boolean(cartItem);

              return (
                <div
                  key={product.id}
                  className="group bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] p-2.5 sm:p-4 flex flex-col justify-between hover:border-[#000000] transition-colors duration-200 overflow-hidden"
                >
                  {/* Image Container with 1:1 Aspect Ratio on neutral surface */}
                  <Link to={`/product/${product.id}`} className="block relative w-full aspect-square bg-[#dfdcd5] rounded-[9px] overflow-hidden mb-3">
                    <img
                      src={product.image_url?.split(',')[0] || '/favicon.png'}
                      alt={product.name}
                      onError={(e) => { e.target.src = '/favicon.png'; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {priceInfo.discountPercent > 0 && (
                      <span className="absolute top-2 left-2 bg-[#000000] text-[#ffffff] text-[10px] font-helvetica px-2 py-0.5 rounded-[28.8px] uppercase tracking-wider">
                        -{priceInfo.discountPercent}%
                      </span>
                    )}
                  </Link>

                  {/* Metadata & Title */}
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#595855] font-helvetica block mb-0.5">
                      {product.category?.name || 'Curated'}
                    </span>
                    <Link to={`/product/${product.id}`}>
                      <h4 className="font-davinci text-base sm:text-xl font-medium text-[#000000] line-clamp-1 hover:underline mb-1.5 leading-snug">
                        {product.name}
                      </h4>
                    </Link>
                  </div>

                  {/* Price & Action Pill Button */}
                  <div className="mt-2 pt-2.5 sm:pt-3 border-t border-[#dfdcd5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-baseline flex-wrap gap-x-1.5">
                      <span className="text-xs sm:text-base font-helvetica font-medium text-[#000000]">
                        ₹{Number(priceInfo.price || product.price || 0).toFixed(2)}
                      </span>
                      {priceInfo.originalPrice && priceInfo.isDiscounted && (
                        <span className="text-[10px] sm:text-xs text-[#808080] line-through font-helvetica">
                          ₹{Number(priceInfo.originalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>

                    {inCart ? (
                      <button
                        onClick={() => {
                          setIsCartOpen(true);
                        }}
                        className="btn-pill-action w-full sm:w-auto py-1.5 px-3 text-[11px] justify-center"
                        title="Go to bag"
                      >
                        <ShoppingBag size={11} className="shrink-0" />
                        <span>Go to Bag</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          addToCart(product);
                        }}
                        className="btn-pill-action w-full sm:w-auto py-1.5 px-3 text-[11px] justify-center"
                        title="Add to order"
                      >
                        <ShoppingBag size={11} className="shrink-0" />
                        <span>Add to Bag</span>
                      </button>
                    )}
                  </div>
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
          6. STAT PAIR & EDITORIAL TESTIMONIAL / COVENANT
          ======================================================== */}
      <section className="w-full bg-[#e7e5e4] border-t border-[#dfdcd5] py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Stat Pair */}
          <div className="flex flex-col sm:flex-row justify-between items-center pb-14 border-b border-[#dfdcd5] gap-8 text-center sm:text-left">
            <div>
              <div className="font-davinci text-4xl sm:text-5xl font-medium text-[#000000] mb-1">
                100% BOTANICAL
              </div>
              <div className="text-xs uppercase tracking-widest text-[#595855] font-helvetica">
                Pristine stems cut daily from master growers
              </div>
            </div>
            
            <div className="h-12 w-[1px] bg-[#dfdcd5] hidden sm:block" />

            <div>
              <div className="font-davinci text-4xl sm:text-5xl font-medium text-[#000000] mb-1">
                WHITE GLOVE
              </div>
              <div className="text-xs uppercase tracking-widest text-[#595855] font-helvetica">
                Hand-delivered in temperature-secured vaults
              </div>
            </div>

            <div className="h-12 w-[1px] bg-[#dfdcd5] hidden sm:block" />

            <div>
              <div className="font-davinci text-4xl sm:text-5xl font-medium text-[#000000] mb-1">
                WAX-SEALED
              </div>
              <div className="text-xs uppercase tracking-widest text-[#595855] font-helvetica">
                Deckle-edge vellum message cards with wax seal
              </div>
            </div>
          </div>

          {/* Editorial Quote */}
          <div className="pt-14 text-center max-w-3xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#595855] font-helvetica block mb-4">
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
