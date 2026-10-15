import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, LogOut, Menu, X, ChevronDown, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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

    const timer = setTimeout(fetchSuggestions, 200);
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

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowSuggestions(false);
    setIsProfileOpen(false);
    setIsMobileProfileOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setIsSearchOpen(false);
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-[#c4c3b6] ${
        scrolled ? 'bg-[#c4c3b6]/95 backdrop-blur-md shadow-sm' : ''
      }`}
    >
      {/* Main Single-Line Navigation Bar with Centered Links & Generous Height */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[64px] sm:h-[80px] flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Circled Monogram Logo Mark + Brand Title */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            {/* Circled Monogram Logo Mark */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center font-davinci text-base sm:text-lg font-medium text-[#000000] transition-transform duration-300 group-hover:scale-105">
              V
            </div>
            <span className="hidden sm:inline font-davinci text-xl sm:text-2xl md:text-[26px] tracking-[-0.03em] font-medium text-[#000000] uppercase">
              Veltrix
            </span>
          </Link>
        </div>

        {/* Center: Desktop Ghost Text Navigation Links (Centered in the viewport) */}
        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-1 px-4">
          <Link to="/products" className="ghost-link text-xs tracking-wider uppercase font-medium hover:underline text-[#000000]">
            Collection
          </Link>
          <Link to="/products?search=bouquet" className="ghost-link text-xs tracking-wider uppercase font-medium hover:underline text-[#000000]">
            Botanicals
          </Link>
          <Link to="/products?search=gift" className="ghost-link text-xs tracking-wider uppercase font-medium hover:underline text-[#000000]">
            Hampers
          </Link>
          <Link to="/products?search=chocolate" className="ghost-link text-xs tracking-wider uppercase font-medium hover:underline text-[#000000]">
            Confections
          </Link>
          <Link to="/about" className="ghost-link text-xs tracking-wider uppercase font-medium hover:underline text-[#000000]">
            Exhibition
          </Link>
          <Link to="/contact" className="ghost-link text-xs tracking-wider uppercase font-medium hover:underline text-[#000000]">
            Concierge
          </Link>
        </nav>

        {/* Mobile Middle Space: Search Input Bar with embedded search icon */}
        <div className="flex-1 max-w-[210px] sm:max-w-xs mx-1 sm:mx-2 lg:hidden relative search-container">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <Search 
              size={13} 
              className="absolute left-2.5 text-[#595855] pointer-events-none" 
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              className="w-full bg-[#e7e5e4] text-[#000000] placeholder-[#73726c] text-[11px] sm:text-xs pl-7 pr-6 py-1.5 rounded-full border border-[#dfdcd5] focus:outline-none focus:border-[#344B38] font-helvetica transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                className="absolute right-2 text-[#595855] hover:text-[#000000] p-0.5"
                title="Clear search"
              >
                <X size={11} />
              </button>
            )}
          </form>

          {/* Mobile Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#e7e5e4] border border-[#dfdcd5] rounded-xl shadow-lg max-h-64 overflow-y-auto z-50">
              <div className="px-2.5 py-1.5 border-b border-[#dfdcd5] text-[10px] uppercase tracking-wider text-[#595855] font-helvetica">
                Catalog Results
              </div>
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center gap-2.5 p-2 hover:bg-[#dfdcd5]/60 transition-colors border-b border-[#dfdcd5]/40 last:border-0"
                >
                  <img 
                    src={item.image_url?.split(',')[0] || '/favicon.png'} 
                    alt={item.name} 
                    className="w-7 h-7 object-cover rounded-[3px] bg-[#c4c3b6] shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#000000] truncate font-helvetica">{item.name}</p>
                    <p className="text-[10px] text-[#595855] font-helvetica">₹{Number(item.price || 0).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right: Search, Auth, and Bag Action */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Integrated Minimal Search (Desktop) */}
          <div className="hidden lg:block relative search-container">
            {/* Desktop Search Input */}
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center">
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  autoFocus
                  className="w-48 sm:w-64 bg-[#e7e5e4] text-[#000000] placeholder-[#595855] text-xs px-3 py-1.5 rounded-[9px] border border-[#dfdcd5] focus:outline-none focus:border-[#000000] font-helvetica"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-1.5 text-[#595855] hover:text-[#000000] p-1"
                >
                  <X size={14} />
                </button>
              </form>
            ) : null}

            {/* Search Icon Trigger */}
            {!isSearchOpen && (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-[#000000] hover:text-[#595855] p-1.5 transition-colors flex items-center gap-1.5 text-xs font-helvetica"
                title="Search"
                aria-label="Search"
              >
                <Search size={17} strokeWidth={1.75} />
                <span className="hidden lg:inline text-[12px] uppercase tracking-wider">Search</span>
              </button>
            )}

            {/* Desktop Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="hidden sm:block absolute right-0 top-full mt-2 w-72 bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] shadow-none overflow-hidden z-50">
                <div className="p-2 border-b border-[#dfdcd5] text-[10px] uppercase tracking-wider text-[#595855] font-helvetica">
                  Catalog Results
                </div>
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-[#dfdcd5]/60 transition-colors border-b border-[#dfdcd5]/40 last:border-0"
                  >
                    <img 
                      src={item.image_url?.split(',')[0] || '/favicon.png'} 
                      alt={item.name} 
                      className="w-9 h-9 object-cover rounded-[2px] bg-[#c4c3b6]" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#000000] truncate font-helvetica">{item.name}</p>
                      <p className="text-[11px] text-[#595855] font-helvetica">₹{Number(item.price || 0).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Account Profile Dropdown (visible on desktop sm+) */}
          <div className="relative profile-container hidden sm:block">
            {user ? (
              <div>
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 text-xs font-helvetica text-[#000000] hover:text-[#595855] transition-colors py-1 cursor-pointer"
                  title="My Account"
                  aria-label="Account Menu"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#000000] text-[#ffffff] flex items-center justify-center font-davinci text-xs sm:text-sm shrink-0">
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : 'V'}
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline">
                    {profile?.full_name ? profile.full_name.split(' ')[0] : 'Account'}
                  </span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-[#e7e5e4] border border-[#dfdcd5] rounded-[12px] p-2.5 z-50 shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-[#dfdcd5] mb-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#000000] text-[#ffffff] flex items-center justify-center font-davinci text-xs shrink-0">
                          {profile?.full_name ? profile.full_name[0].toUpperCase() : 'V'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#000000] truncate font-helvetica">
                            {profile?.full_name || 'My Account'}
                          </p>
                          <p className="text-[10px] text-[#595855] truncate font-helvetica">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#000000] hover:bg-[#dfdcd5]/70 rounded-[8px] transition-colors font-helvetica"
                      >
                        <User size={14} className="text-[#595855]" />
                        <span className="flex-1">Profile</span>
                        <ArrowRight size={11} className="text-[#595855]" />
                      </Link>

                      <Link
                        to="/my-orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#000000] hover:bg-[#dfdcd5]/70 rounded-[8px] transition-colors font-helvetica"
                      >
                        <ShoppingBag size={14} className="text-[#595855]" />
                        <span className="flex-1">My Orders</span>
                        <ArrowRight size={11} className="text-[#595855]" />
                      </Link>

                      {(profile?.role === 'admin' || user.email === 'admin@veltrix.com') && (
                        <Link
                          to="/store-control"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#ffffff] bg-[#000000] rounded-[8px] transition-colors font-helvetica mt-1"
                        >
                          <Shield size={14} />
                          <span className="flex-1">Store Control</span>
                          <ArrowRight size={11} />
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-red-700 hover:bg-red-50 rounded-[8px] transition-colors border-t border-[#dfdcd5]/60 mt-1 font-helvetica cursor-pointer"
                      >
                        <LogOut size={13} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="ghost-link text-xs uppercase tracking-wider font-medium text-[#000000] flex items-center gap-1"
              >
                <User size={15} strokeWidth={1.75} />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>

          {/* Bag Action Pill Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn-pill-action py-1.5 px-3 sm:px-4 text-[11px] sm:text-xs shrink-0"
          >
            <ShoppingBag size={13} strokeWidth={2} />
            <span className="uppercase tracking-wider">Bag [{itemCount}]</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-[#000000] p-1.5 rounded-md hover:bg-[#000000]/5 transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>


      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#c4c3b6] border-t border-[#000000]/15 px-4 py-5 animate-in slide-in-from-top duration-200">
          
          {/* Account Section in Mobile Menu (Compact width, right aligned) */}
          <div className="mb-5 pb-4 border-b border-[#000000]/15 font-helvetica flex justify-end">
            {user ? (
              <div className="bg-[#e7e5e4] w-full max-w-[270px] rounded-[10px] border border-[#dfdcd5] p-3 shadow-xs transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-2.5 mb-2.5 pb-2.5 border-b border-[#dfdcd5]">
                  <div className="w-8 h-8 rounded-full bg-[#000000] text-[#ffffff] flex items-center justify-center font-davinci text-xs shrink-0">
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : 'V'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#000000] truncate">
                      {profile?.full_name || 'My Account'}
                    </p>
                    <p className="text-[10px] text-[#595855] truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[#dfdcd5] text-xs font-medium text-[#000000] hover:border-[#000000] transition-colors"
                  >
                    <User size={13} className="text-[#595855]" />
                    <span className="flex-1">Profile</span>
                    <ArrowRight size={11} className="text-[#595855]" />
                  </Link>

                  <Link
                    to="/my-orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[#dfdcd5] text-xs font-medium text-[#000000] hover:border-[#000000] transition-colors"
                  >
                    <ShoppingBag size={13} className="text-[#595855]" />
                    <span className="flex-1">My Orders</span>
                    <ArrowRight size={11} className="text-[#595855]" />
                  </Link>

                  {(profile?.role === 'admin' || user.email === 'admin@veltrix.com') && (
                    <Link
                      to="/store-control"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 bg-[#000000] text-[#ffffff] rounded-[8px] text-xs font-medium transition-colors"
                    >
                      <Shield size={13} />
                      <span className="flex-1">Store Control</span>
                      <ArrowRight size={11} />
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs text-red-700 hover:bg-red-50 transition-colors mt-0.5 font-medium cursor-pointer"
                  >
                    <LogOut size={12} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full max-w-[270px]">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-pill-action flex-1 py-2.5 text-xs uppercase tracking-wider justify-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-[28.8px] border border-[#dfdcd5] bg-[#e7e5e4] text-[#000000] text-xs uppercase tracking-wider text-center font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-3 font-helvetica">
            <Link 
              to="/products" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-[#000000] uppercase tracking-wider py-1.5 border-b border-[#dfdcd5]/50"
            >
              All Collections
            </Link>
            <Link 
              to="/products?search=bouquet" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-[#000000] uppercase tracking-wider py-1.5 border-b border-[#dfdcd5]/50"
            >
              Botanicals & Bouquets
            </Link>
            <Link 
              to="/products?search=gift" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-[#000000] uppercase tracking-wider py-1.5 border-b border-[#dfdcd5]/50"
            >
              Curated Hampers
            </Link>
            <Link 
              to="/products?search=chocolate" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-[#000000] uppercase tracking-wider py-1.5 border-b border-[#dfdcd5]/50"
            >
              Artisan Confections
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-[#000000] uppercase tracking-wider py-1.5 border-b border-[#dfdcd5]/50"
            >
              About the Exhibition
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-[#000000] uppercase tracking-wider py-1.5"
            >
              Concierge & Inquiries
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
