import React, { useEffect, useState } from 'react';
import { ProductGridSkeleton, CategoryListSkeleton } from '../components/Skeletons';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  Truck, ShieldCheck, Star, Quote, Leaf, 
  ArrowRight, Gift, Heart, ChevronLeft, ChevronRight, CheckCircle2, Mail 
} from 'lucide-react';
import toast from 'react-hot-toast';
import heroBanner from '../assets/hero-banner.png';
import giftCraftBanner from '../assets/gift-craft-banner.png';

const categoryMeta = {
  flower: {
    name: 'Fresh Flowers',
    image: '/images/categories/flower.jpg',
    tag: 'Bouquets',
  },
  chocolates: {
    name: 'Artisan Chocolates',
    image: '/images/categories/chocolates.jpg',
    tag: 'Gourmet Treats',
  },
  combos: {
    name: 'Gift Hampers',
    image: '/images/categories/combos.jpg',
    tag: 'Luxury Sets',
  },
  jewellary: {
    name: 'Jewellery & Keepsakes',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    tag: 'Precious Gifts',
  },
  jewelry: {
    name: 'Jewellery & Keepsakes',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    tag: 'Precious Gifts',
  },
  decoration: {
    name: 'Home & Living',
    image: '/images/categories/decoration.jpg',
    tag: 'Candles & Decor',
  },
  crafts: {
    name: 'Handmade Crafts',
    image: '/images/categories/crafts.jpg',
    tag: 'Artisan Art',
  },
  cakes: {
    name: 'Celebration Cakes',
    image: '/images/categories/cakes.jpg',
    tag: 'Fresh Baked',
  },
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();

  const [vipEmail, setVipEmail] = useState('');

  const handleVipSubmit = (e) => {
    e.preventDefault();
    if (!vipEmail.trim()) return;
    toast.success('Welcome to the Veltrix Gifting Circle! Check your email for ₹200 off.');
    setVipEmail('');
  };

  const reviews = [
    {
      id: 1,
      text: "The fresh blush bouquet arrived in pristine condition, still dewy! The handwritten wax-sealed card was such an emotional touch. My sister cried happy tears.",
      name: "Sarah J.",
      occasion: "Birthday Bouquet",
      city: "Mumbai"
    },
    {
      id: 2,
      text: "The artisan chocolate gift hamper feels so luxurious. You can tell real craft went into every detail. Definitely my new go-to store for all family celebrations.",
      name: "Michael T.",
      occasion: "Anniversary Hamper",
      city: "Delhi"
    },
    {
      id: 3,
      text: "Ordered a personalized keepsake box for my partner. The packaging was beyond expectations — heavy satin ribbon, rigid gift box, and impeccable presentation.",
      name: "Emily R.",
      occasion: "Romantic Keepsake",
      city: "Bangalore"
    },
    {
      id: 4,
      text: "The Belgian truffles were divine, best assortment we've ever tasted! Delivery was right on time for our anniversary dinner. Highly recommend Veltrix.",
      name: "David L.",
      occasion: "Gourmet Chocolates",
      city: "Pune"
    },
    {
      id: 5,
      text: "I was looking for a unique anniversary gift and found the perfect floral arrangement here. The fragrance filled the whole living room. 10/10 experience!",
      name: "John S.",
      occasion: "Luxury Florals",
      city: "Hyderabad"
    },
    {
      id: 6,
      text: "Incredible customer care. There was a mix-up with my apartment number and their concierge team coordinated with the courier instantly. Outstanding service.",
      name: "Amanda C.",
      occasion: "Surprise Hamper",
      city: "Chandigarh"
    }
  ];

  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const nextReview = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const visibleItems = isMobile ? 1 : 3;
    const maxIndex = reviews.length - visibleItems;
    setActiveReviewIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevReview = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const visibleItems = isMobile ? 1 : 3;
    const maxIndex = reviews.length - visibleItems;
    setActiveReviewIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const visibleItems = isMobile ? 1 : 3;
        const maxIndex = reviews.length - visibleItems;
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [reviews.length]);

  useEffect(() => {
    const fetchHomeData = async () => {
      const { data: prodData } = await supabase
        .from('products')
        .select('*, category:categories(name)')
        .order('created_at', { ascending: false })
        .limit(8);

      if (prodData) setProducts(prodData);

      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .limit(6);

      if (catData) setCategories(catData);

      setLoading(false);
    };

    fetchHomeData();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F6F1]">
      {/* Full-Bleed Hero Section (Zero Side Margins, Edge-to-Edge) */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center overflow-hidden bg-[#F8F6F1]">
        {/* Edge-to-Edge Background Photography */}
        <img 
          src={heroBanner} 
          alt="Handcrafted Florals & Gifts" 
          className="absolute inset-0 w-full h-full object-cover object-[82%_center] md:object-[75%_center] lg:object-center select-none"
        />

        {/* Natural Cream Gradient Wash on the Left for Superior Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F6F1] via-[#F8F6F1]/92 md:via-[#F8F6F1]/75 to-transparent w-full md:w-[62%] lg:w-[54%] z-0 pointer-events-none" />

        {/* Foreground Hero Content (Aligned with 7xl Grid) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full pt-32 sm:pt-36 pb-16 lg:pb-24 flex flex-col items-start">
          
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#829078] mb-3 block">
            Artisanal Florals & Thoughtful Gifts
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#292923] tracking-tight leading-[1.12] mb-5 font-heading max-w-xl">
            Flowers & gifts that say what words can’t.
          </h1>

          <p className="text-[#292923]/80 text-base sm:text-lg mb-8 leading-relaxed font-medium max-w-lg">
            Fresh hand-arranged blooms, artisanal Belgian chocolates, and bespoke gift hampers — crafted with patience and delivered with utmost care.
          </p>

          <div className="flex flex-row flex-wrap items-center gap-2.5 sm:gap-4">
            <Link 
              to="/products" 
              className="btn-sweep-theme group"
            >
              <span>Shop the Collection</span>
              <ArrowRight size={14} className="sm:w-[17px] sm:h-[17px] shrink-0 transition-transform duration-300" />
            </Link>

            <Link 
              to="/products?search=gift" 
              className="inline-flex items-center justify-center gap-1.5 bg-white/90 hover:bg-white text-[#292923] hover:text-[#344B38] py-[0.55rem] px-3.5 sm:py-[0.875rem] sm:px-7 rounded-xl font-bold border-[1.5px] sm:border-2 border-[#DCC6A8] hover:border-[#344B38] shadow-2xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all text-[0.8125rem] sm:text-[0.9375rem] tracking-[0.3px] sm:tracking-[0.5px] whitespace-nowrap text-center"
            >
              <span>Browse Gift Hampers</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Humanized Reassurance Strip Directly Underneath Hero */}
      <section className="bg-white border-y border-[#DCC6A8]/60 py-6 mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#E9E9E0] flex items-center justify-center text-[#344B38] shrink-0">
                <Truck size={19} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#292923]">Free Express Delivery</h4>
                <p className="text-[11px] text-[#829078] font-medium">On orders above ₹799</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#E9E9E0] flex items-center justify-center text-[#344B38] shrink-0">
                <Leaf size={19} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#292923]">Daily Fresh Harvest</h4>
                <p className="text-[11px] text-[#829078] font-medium">Hand-cut florals daily</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#E9E9E0] flex items-center justify-center text-[#344B38] shrink-0">
                <Gift size={19} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#292923]">Bespoke Handwritten Card</h4>
                <p className="text-[11px] text-[#829078] font-medium">Complimentary with every gift</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#E9E9E0] flex items-center justify-center text-[#344B38] shrink-0">
                <ShieldCheck size={19} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#292923]">100% Protected Checkout</h4>
                <p className="text-[11px] text-[#829078] font-medium">Razorpay encrypted payment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category - Item-First Luxury Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 md:mt-18 mb-14 md:mb-20">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#829078]">
                Curated Collections
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#292923] tracking-tight font-heading">
              Shop by Category
            </h2>
            <p className="text-sm text-[#292923]/70 font-medium mt-1.5 max-w-lg">
              Handcrafted gifts and floral arrangements curated with love.
            </p>
          </div>

          <Link 
            to="/products" 
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#344B38] hover:text-[#263829] py-2 px-4 rounded-xl border border-[#DCC6A8] hover:border-[#344B38] bg-white transition-all shadow-2xs hover:shadow-xs self-start sm:self-auto group"
          >
            <span>All Collections</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid (Spacious 5 Cards - Item Focus) */}
        {loading ? (
          <CategoryListSkeleton count={5} />
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.slice(0, 5).map((cat) => {
              const key = cat.name.toLowerCase().trim();
              const meta = categoryMeta[key] || {
                name: cat.name,
                image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
                tag: 'Curated Gifts',
              };

              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="group flex flex-col cursor-pointer"
                >
                  {/* Card Image Container - Clean Item Showcase */}
                  <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#F8F6F1] border border-[#DCC6A8] group-hover:border-[#344B38] shadow-xs group-hover:shadow-xl transition-all duration-500">
                    <img
                      src={meta.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    
                    {/* Subtle hover gradient wash */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                  </div>

                  {/* Typography Below Image - Clean, Human, Editorial */}
                  <div className="mt-3.5 px-1 flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#829078]">
                      {meta.tag}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#292923] group-hover:text-[#344B38] transition-colors font-heading capitalize mt-0.5">
                      {meta.name || cat.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#344B38] mt-1 group-hover:translate-x-1 transition-transform">
                      <span>Shop Now</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </section>

      {/* Editorial Luxury Gift Craft Banner (Full-Bleed Edge-to-Edge) */}
      <section className="relative w-full overflow-hidden border-y border-[#DCC6A8]/60 my-12 md:my-18 bg-[#F8F6F1]">
        {/* Full-Bleed Panoramic Background Image */}
        <div className="relative w-full min-h-[480px] sm:min-h-[500px] md:min-h-[520px] lg:min-h-[540px] xl:min-h-[560px] flex items-center justify-center">
          <img 
            src={giftCraftBanner} 
            alt="Handcrafted Gift Hampers & Keepsakes" 
            className="absolute inset-0 w-full h-full object-cover object-center select-none"
          />

          {/* Seamless Radial Glow in the Center (Completely Blends with Photo's Natural Cream Tone) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(248,246,241,0.85)_0%,_rgba(248,246,241,0.5)_50%,_transparent_80%)] pointer-events-none" />

          {/* Blended Editorial Typography & CTAs (Directly on the Picture, No Enclosing Box) */}
          <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 text-center py-12 sm:py-16">
            
            {/* Elegant Serif Eyebrow */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <span className="w-8 sm:w-12 h-px bg-[#829078]/70" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#829078]">
                The Art of Thoughtful Gifting
              </span>
              <span className="w-8 sm:w-12 h-px bg-[#829078]/70" />
            </div>

            {/* Editorial Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black text-[#292923] tracking-tight leading-[1.12] font-heading mb-4 sm:mb-5">
              Handcrafted with Love,<br className="hidden sm:inline" /> Wrapped in Warmth
            </h2>

            {/* Poetic Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-[#292923]/85 font-medium max-w-xl mx-auto leading-relaxed mb-7 sm:mb-9">
              Delicate fresh blooms, artisan Belgian chocolates, and hand-poured scented candles — bespoke gift hampers designed to turn special moments into lifelong memories.
            </p>

            {/* Seamless Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 mb-8 sm:mb-9">
              <Link 
                to="/products?search=gift" 
                className="inline-flex items-center gap-2.5 bg-[#344B38] hover:bg-[#263829] text-white px-8 py-3.5 sm:py-4 rounded-full font-bold shadow-lg shadow-[#344B38]/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm tracking-wider uppercase group/btn"
              >
                <span>Curate a Gift Hamper</span>
                <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link 
                to="/products?search=bouquet" 
                className="inline-flex items-center gap-2 bg-white/80 hover:bg-white text-[#292923] hover:text-[#344B38] px-7 py-3.5 sm:py-4 rounded-full font-bold border border-[#DCC6A8] hover:border-[#344B38] backdrop-blur-xs shadow-xs hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm tracking-wider uppercase"
              >
                <span>Explore Blooms</span>
              </Link>
            </div>

            {/* Micro Perks Directly Blended */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-[#829078] flex-wrap">
              <span className="flex items-center gap-1.5">
                <Gift size={14} className="text-[#344B38]" />
                Satin Ribbon Box
              </span>
              <span className="text-[#DCC6A8]">•</span>
              <span className="flex items-center gap-1.5">
                <Heart size={14} className="text-[#344B38]" />
                Wax-Sealed Note
              </span>
              <span className="text-[#DCC6A8]">•</span>
              <span className="flex items-center gap-1.5">
                <Truck size={14} className="text-[#344B38]" />
                Express Delivery
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Weekly Best Deals */}
      <section className="bg-white py-8 md:py-16 border-t border-[#DCC6A8]/50 mt-4 md:mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
            <h2 className="text-2xl font-bold text-[#292923]">Weekly Best Deals</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              <button className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[#344B38] text-white shadow-sm">Up to 50% off</button>
              <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#E9E9E0] text-[#292923] hover:bg-[#DCC6A8] transition-colors">Under ₹50</button>
              <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#E9E9E0] text-[#292923] hover:bg-[#DCC6A8] transition-colors">Almost Sold Out</button>
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-20 text-[#829078] bg-[#F8F6F1] rounded-2xl border border-[#DCC6A8]">
                  No products found. Add some from the Admin Dashboard!
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="group border border-[#DCC6A8]/60 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col">
                    <Link to={`/product/${product.id}`} className="block relative aspect-square bg-[#F8F6F1] overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url.split(',')[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </Link>
                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-sm sm:text-base text-[#292923] hover:text-[#344B38] mb-1 line-clamp-1">{product.name}</h3>
                      </Link>
                      <p className="text-[10px] sm:text-xs text-[#829078] mb-2 sm:mb-3">{product.category?.name || 'Uncategorized'}</p>
                      <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                        <span className="font-bold text-base sm:text-lg text-[#344B38]">₹{Number(product.price).toFixed(2)}</span>
                        {cartItems.some(item => item.id === product.id) ? (
                          <Link
                            to="/cart"
                            className="bg-[#829078] text-white text-[10px] sm:text-sm font-bold px-2 sm:px-3 py-1.5 rounded-xl hover:bg-[#344B38] transition-colors text-center w-full sm:w-auto"
                          >
                            Go to Cart
                          </Link>
                        ) : product.stock > 0 ? (
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-[#344B38] text-white text-[10px] sm:text-sm font-bold px-2 sm:px-3 py-1.5 rounded-xl hover:bg-[#829078] transition-colors w-full sm:w-auto shadow-sm"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <span className="text-red-500 text-[10px] sm:text-sm font-bold px-2 sm:px-3 py-1.5 bg-red-50 rounded-xl border border-red-100 w-full sm:w-auto text-center">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials - Dramatic Deep Forest Green Jewel Showcase */}
      <section className="bg-[#344B38] text-[#F8F6F1] py-16 md:py-24 relative overflow-hidden">
        {/* Ambient Decorative Lighting */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#829078]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#DCC6A8]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Header with Title + Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#DCC6A8] border border-[#DCC6A8]/30 text-[11px] font-bold uppercase tracking-widest mb-3">
                <Heart size={12} className="text-[#DCC6A8]" fill="currentColor" />
                <span>Over 12,000+ Hearts Touched</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F8F6F1] font-heading tracking-tight leading-tight">
                Words of Love & Affection
              </h2>
              <p className="text-sm sm:text-base text-[#F8F6F1]/75 font-medium mt-2 max-w-xl">
                Real stories and heartfelt moments shared by our thoughtful gifters across India.
              </p>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <button 
                onClick={prevReview}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#DCC6A8] text-[#F8F6F1] hover:text-[#344B38] border border-[#DCC6A8]/30 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextReview}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#DCC6A8] text-[#F8F6F1] hover:text-[#344B38] border border-[#DCC6A8]/30 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                aria-label="Next Testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Testimonials Carousel Track */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out -mx-3"
              style={{ 
                transform: typeof window !== 'undefined' && window.innerWidth >= 768 
                  ? `translateX(-${activeReviewIndex * 33.333}%)` 
                  : `translateX(-${activeReviewIndex * 100}%)` 
              }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full md:w-1/3 shrink-0 px-3">
                  <div className="bg-[#263829]/75 backdrop-blur-md p-7 sm:p-8 rounded-2xl border border-[#DCC6A8]/25 hover:border-[#DCC6A8]/80 text-left h-full flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 group">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-1 text-[#DCC6A8]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={15} fill="currentColor" />
                          ))}
                        </div>
                        <Quote size={26} className="text-[#DCC6A8]/30 group-hover:text-[#DCC6A8]/70 transition-colors" />
                      </div>
                      <p className="text-[#F8F6F1]/90 italic text-sm sm:text-base leading-relaxed mb-6 font-medium">
                        "{review.text}"
                      </p>
                    </div>

                    <div className="pt-5 border-t border-[#DCC6A8]/20 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#DCC6A8]/15 border border-[#DCC6A8]/40 text-[#DCC6A8] flex items-center justify-center font-bold text-sm shrink-0 shadow-inner">
                          {review.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#F8F6F1] text-sm leading-snug">{review.name}</h4>
                          <p className="text-[11px] text-[#829078] font-medium">{review.occasion} • {review.city}</p>
                        </div>
                      </div>

                      <span className="text-[10px] uppercase tracking-wider text-[#DCC6A8] font-bold bg-white/10 px-2.5 py-1 rounded-full border border-[#DCC6A8]/30 shrink-0 flex items-center gap-1">
                        <CheckCircle2 size={11} className="text-[#DCC6A8]" />
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* The Veltrix Standard (Clean, Airy 4-Pillar Showcase - Zero Repetitive Cards) */}
      <section className="bg-[#F8F6F1] py-16 md:py-24 border-t border-[#DCC6A8]/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-14 md:mb-18">
            <div className="inline-flex items-center gap-2 mb-2 text-[#829078] text-xs font-bold uppercase tracking-[0.25em]">
              <ShieldCheck size={13} className="text-[#344B38]" />
              <span>Uncompromising Quality</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#292923] font-heading tracking-tight">
              The Veltrix Standard
            </h2>
            <p className="text-sm sm:text-base text-[#292923]/70 font-medium mt-2">
              Every bloom, ribbon, and confection meets our highest artisanal benchmark.
            </p>
          </div>

          {/* 4 Pillars Grid (Borderless, Airy, Modern Editorial) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            
            {/* Pillar 1 */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#E9E9E0] border border-[#DCC6A8]/60 flex items-center justify-center text-[#344B38] mb-5 shadow-xs">
                <Leaf size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#292923] font-heading mb-2">Daily Morning Harvest</h3>
              <p className="text-xs sm:text-sm text-[#292923]/75 leading-relaxed font-medium">
                Fresh-cut stems sourced directly from premium growers at dawn, never cold-stored overnight.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#E9E9E0] border border-[#DCC6A8]/60 flex items-center justify-center text-[#344B38] mb-5 shadow-xs">
                <Gift size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#292923] font-heading mb-2">Bespoke Ribbon Curation</h3>
              <p className="text-xs sm:text-sm text-[#292923]/75 leading-relaxed font-medium">
                Packaged in handcrafted rigid keepsake boxes with double-satin ribbon and a wax-sealed card.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#E9E9E0] border border-[#DCC6A8]/60 flex items-center justify-center text-[#344B38] mb-5 shadow-xs">
                <Truck size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#292923] font-heading mb-2">Climate-Controlled Transit</h3>
              <p className="text-xs sm:text-sm text-[#292923]/75 leading-relaxed font-medium">
                Hand-delivered in temperature-stabilized carriers to guarantee blooms arrive crisp and lively.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#E9E9E0] border border-[#DCC6A8]/60 flex items-center justify-center text-[#344B38] mb-5 shadow-xs">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#292923] font-heading mb-2">100% Happiness Guarantee</h3>
              <p className="text-xs sm:text-sm text-[#292923]/75 leading-relaxed font-medium">
                If your recipient isn’t completely ecstatic with their gift, we replace or refund with zero fuss.
              </p>
            </div>

          </div>

          {/* VIP Gifting Concierge & Milestone Reminder Banner */}
          <div className="mt-14 md:mt-18 rounded-2xl bg-white border border-[#DCC6A8] p-8 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(41,41,35,0.06)] flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-lg">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#829078] block mb-2">
                ✦ Veltrix Gifting Concierge
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#292923] font-heading tracking-tight mb-2">
                Never Miss a Milestone Again
              </h3>
              <p className="text-xs sm:text-sm text-[#292923]/75 font-medium leading-relaxed">
                Join our private Gifting Circle for automated anniversary & birthday reminders, plus receive <strong className="text-[#344B38]">₹200 off</strong> your first order.
              </p>
            </div>

            <form onSubmit={handleVipSubmit} className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 shrink-0">
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829078]" />
                <input 
                  type="email" 
                  required 
                  value={vipEmail}
                  onChange={(e) => setVipEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full sm:w-72 pl-11 pr-4 py-3.5 rounded-full border border-[#DCC6A8] bg-[#F8F6F1] text-xs text-[#292923] placeholder:text-[#829078] outline-none focus:border-[#344B38] focus:ring-2 focus:ring-[#344B38]/15 font-medium"
                />
              </div>
              <button 
                type="submit"
                className="bg-[#344B38] hover:bg-[#263829] text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
              >
                Claim ₹200 Off
              </button>
            </form>
          </div>

        </div>
      </section>


    </main>
  );
};

export default Home;
