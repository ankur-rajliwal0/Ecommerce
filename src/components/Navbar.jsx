import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, LogOut, Menu, ChevronDown, Shield, X, Gift, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import logo from '../assets/veltrix-logo.png';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // When near the top, always keep navbar visible
      if (currentScrollY <= 80) {
        setIsVisible(true);
      } else {
        const diff = currentScrollY - lastScrollY.current;
        // Scrolling down by more than 6px: fold and hide
        if (diff > 6) {
          setIsVisible(false);
          setShowSuggestions(false);
          setIsProfileOpen(false);
        } 
        // Scrolling up by more than 6px: unfold and show
        else if (diff < -6) {
          setIsVisible(true);
        }
      }

      setScrolled(currentScrollY > 25);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      
      const { data } = await supabase
        .from('products')
        .select('id, name, image_url, price, category:categories(name)')
        .ilike('name', `%${searchQuery.trim()}%`)
        .limit(5);
        
      if (data) setSuggestions(data);
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
      if (!e.target.closest('.profile-container')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsVisible(true);
    setScrolled(false);
    setIsMobileMenuOpen(false);
    setShowSuggestions(false);
    setIsProfileOpen(false);
  }

  useEffect(() => {
    lastScrollY.current = window.scrollY;
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/products' },
    { name: 'Bouquets', path: '/products?search=bouquet' },
    { name: 'Gift Hampers', path: '/products?search=gift' },
    { name: 'Chocolates', path: '/products?search=chocolate' },
    { name: 'About', path: '/about' },
  ];

  // 3D Paper fold wrapper (creates perspective container)
  const wrapperContainerClass = isHome
    ? 'fixed top-0 left-0 right-0 z-50 navbar-paper-wrapper pointer-events-none'
    : 'sticky top-0 z-50 navbar-paper-wrapper pointer-events-none';

  // 3D Paper fold element (handles the physical folding motion, rotation, and lighting)
  const headerPaperClass = `w-full relative navbar-paper-fold ${
    isVisible ? 'is-unfolded pointer-events-auto' : 'is-folded pointer-events-none'
  } ${
    isHome
      ? scrolled
        ? 'bg-white/95 backdrop-blur-md'
        : 'bg-gradient-to-b from-[#F8F6F1]/90 via-[#F8F6F1]/40 to-transparent'
      : 'bg-white/95 backdrop-blur-md'
  }`;

  return (
    <>
      <div className={wrapperContainerClass}>
        <header className={headerPaperClass}>
          {/* Paper Fold Crease & Depth Lighting Effect */}
          <div 
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-20 bg-gradient-to-b from-[#292923]/20 via-transparent to-[#292923]/30 ${
              isVisible ? 'opacity-0' : 'opacity-100'
            }`}
            aria-hidden="true"
          />

          {/* 1. Subtle, Minimal Announcement Ribbon */}
          <div className="bg-[#344B38] text-[#F8F6F1] py-1.5 px-4 text-[11px] font-medium tracking-wider text-center border-b border-[#DCC6A8]/20 flex items-center justify-center">
            <span>Complimentary Handcrafted Gift Packaging on Orders above ₹799 • Free Express Delivery</span>
          </div>

      {/* 2. Unified Humanized Luxury Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Left: Brand Logo & Editorial Links */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link to="/" className="flex items-center shrink-0 group transition-transform duration-300 hover:scale-105">
            <img 
              src={logo} 
              alt="Veltrix" 
              className="h-11 sm:h-12 md:h-13 w-auto object-contain drop-shadow-xs" 
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-bold tracking-wider uppercase">
            {navLinks.map((link) => {
              const currentFullPath = location.pathname + location.search;
              const isActive = link.path === '/' 
                ? location.pathname === '/' 
                : (link.path.includes('?') ? currentFullPath === link.path : location.pathname === link.path && !location.search);
              
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`group relative py-1 transition-colors font-bold ${
                    isActive ? 'text-[#344B38]' : 'text-[#292923]/80 hover:text-[#344B38]'
                  }`}
                >
                  <span>{link.name}</span>
                  <span 
                    className={`absolute -bottom-0.5 left-0 h-[2px] bg-[#344B38] rounded-full transition-all duration-300 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} 
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Compact Search Bar + Cart + Account */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Compact Search Bar */}
          <div className="hidden sm:block relative search-container w-44 md:w-56 lg:w-64">
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowSuggestions(false);
              if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            }} className="flex items-center bg-white/80 hover:bg-white focus-within:bg-white rounded-full px-3.5 py-1.5 border border-[#DCC6A8] focus-within:border-[#344B38] focus-within:ring-2 focus-within:ring-[#344B38]/15 shadow-2xs transition-all">
              <Search size={14} className="text-[#829078] shrink-0 mr-2" />
              <input 
                type="text" 
                name="q" 
                placeholder="Search gifts..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-transparent border-none outline-none text-xs text-[#292923] placeholder:text-[#829078] font-medium" 
              />
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full right-0 w-72 mt-2 bg-white border border-[#DCC6A8] shadow-2xl rounded-2xl py-2 z-50 max-h-[380px] overflow-y-auto">
                {suggestions.length > 0 ? (
                  <div>
                    <div className="px-4 py-2 text-[10px] font-extrabold text-[#829078] uppercase tracking-[0.2em] border-b border-gray-100 flex items-center justify-between">
                      <span>Curated Gifts</span>
                      <span className="text-[#344B38]">{suggestions.length} items</span>
                    </div>
                    {suggestions.map(item => (
                      <Link 
                        key={item.id} 
                        to={`/product/${item.id}`}
                        onClick={() => {
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8F6F1] transition-colors border-b border-gray-50 last:border-0 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white overflow-hidden shrink-0 border border-[#DCC6A8]/50">
                          {item.image_url ? (
                            <img src={item.image_url.split(',')[0]} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400">No Img</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#292923] truncate group-hover:text-[#344B38] transition-colors">{item.name}</h4>
                          <span className="text-[11px] text-[#829078]">{item.category?.name || 'Gift'}</span>
                        </div>
                        <div className="font-extrabold text-[#344B38] text-xs">₹{item.price.toFixed(2)}</div>
                      </Link>
                    ))}
                    <button 
                      onClick={() => {
                        setShowSuggestions(false);
                        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                      }}
                      className="w-full text-center py-2.5 text-xs uppercase tracking-wider text-[#344B38] font-bold hover:bg-[#E9E9E0] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>View all results</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500 text-xs">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Pill */}
          <Link 
            to="/cart" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#DCC6A8] text-[#292923] hover:text-[#344B38] transition-all hover:scale-105 active:scale-95 shadow-2xs"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag size={17} className="text-[#344B38]" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#344B38] text-white text-[9px] font-black h-3.5 w-3.5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold hidden md:inline text-[#292923]">Cart</span>
          </Link>
          
          {/* User / Login */}
          {user ? (
            <div className="relative group profile-container">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#DCC6A8] text-[#292923] hover:text-[#344B38] transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-[#344B38] text-white flex items-center justify-center text-[10px] font-black">
                  {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold hidden md:block max-w-[80px] truncate">
                  {profile?.full_name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown size={12} className="text-[#829078]" />
              </button>

              <div className={`absolute right-0 top-full mt-2 w-52 bg-white border border-[#DCC6A8] rounded-2xl shadow-2xl flex flex-col py-2 z-50 transition-all duration-200 overflow-hidden ${isProfileOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                <div className="px-4 py-2.5 border-b border-[#DCC6A8]/40 mb-1 bg-[#F8F6F1]">
                  <p className="text-xs font-extrabold text-[#292923] capitalize truncate">
                    {profile?.full_name || user?.user_metadata?.full_name || user.email.split('@')[0]}
                  </p>
                  <p className="text-[11px] text-[#829078] truncate">{user.email}</p>
                </div>
                {profile?.role === 'admin' && (
                  <Link to="/store-control" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-xs font-bold text-[#344B38] bg-[#E9E9E0] hover:bg-[#DCC6A8]/40 flex items-center gap-2 border-l-4 border-[#344B38] transition-colors">
                    <Shield size={13} /> Store Admin
                  </Link>
                )}
                <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-xs font-semibold text-[#292923] hover:bg-[#F8F6F1] hover:text-[#344B38] flex items-center gap-2 transition-colors">
                  <User size={13} className="text-[#829078]" /> My Profile
                </Link>
                <Link to="/my-orders" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-xs font-semibold text-[#292923] hover:bg-[#F8F6F1] hover:text-[#344B38] flex items-center gap-2 transition-colors">
                  <Gift size={13} className="text-[#829078]" /> My Orders
                </Link>
                <button onClick={() => { setIsProfileOpen(false); setShowLogoutConfirm(true); }} className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-left flex items-center gap-2 transition-colors border-t border-gray-100 mt-1 cursor-pointer">
                  <LogOut size={13} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#344B38] hover:bg-[#263829] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <User size={13} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-[#292923] hover:text-[#344B38] transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  </div>

    {/* Mobile Drawer */}
    {isMobileMenuOpen && (
      <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
        <div className="w-4/5 max-w-sm bg-white h-full p-6 flex flex-col shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-[#DCC6A8]/50 mb-6">
            <img src={logo} alt="Veltrix" className="h-10 w-auto object-contain" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-[#292923]">
              <X size={22} />
            </button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={(e) => {
            e.preventDefault();
            setIsMobileMenuOpen(false);
            if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
          }} className="flex items-center bg-[#F8F6F1] rounded-full px-3.5 py-2 border border-[#DCC6A8] mb-6">
            <Search size={14} className="text-[#829078] mr-2" />
            <input 
              type="text" 
              placeholder="Search gifts, flowers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xs text-[#292923]" 
            />
          </form>

          <div className="space-y-4 mb-6">
            <div className="text-[11px] font-bold text-[#829078] uppercase tracking-wider">Collections</div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-bold text-[#292923] hover:text-[#344B38]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="space-y-2 mb-6">
            <div className="text-[11px] font-bold text-[#829078] uppercase tracking-wider">Categories</div>
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs font-semibold text-[#292923]/80 hover:text-[#344B38]"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setShowLogoutConfirm(true); }}
                className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut size={14} /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#344B38] text-white text-center text-xs font-bold uppercase tracking-wider"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
        <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
      </div>
    )}

    {/* Logout Confirmation Modal */}
    {showLogoutConfirm && (
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-xs">
        <div className="bg-white rounded-2xl shadow-2xl max-w-[320px] md:max-w-sm w-full p-6 border border-[#DCC6A8] animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <LogOut size={22} />
          </div>
          <h3 className="text-xl font-bold text-center text-[#292923] mb-2">Confirm Logout</h3>
          <p className="text-center text-[#829078] mb-6 text-sm font-medium">Are you sure you want to log out of Veltrix?</p>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 bg-gray-100 text-[#292923] font-bold py-2.5 text-sm rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={() => { setShowLogoutConfirm(false); handleLogout(); }}
              className="flex-1 bg-red-600 text-white font-bold py-2.5 text-sm rounded-xl hover:bg-red-700 transition-colors shadow-md cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Navbar;
