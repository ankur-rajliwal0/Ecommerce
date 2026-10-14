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
      style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.15)' }}
    >
      {/* Main Single-Line Navigation Bar with Centered Links & Generous Height */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] sm:h-[80px] flex items-center justify-between gap-4">
        
        {/* Left: Circled Monogram Logo Mark + Brand Title */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            {/* 32px Circled Monogram Logo Mark */}
            <div className="w-8 h-8 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center font-davinci text-lg font-medium text-[#000000] transition-transform duration-300 group-hover:scale-105">
              V
            </div>
            <span className="font-davinci text-2xl sm:text-[26px] tracking-[-0.03em] font-medium text-[#000000] uppercase">
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

        {/* Right: Search, Auth, and Bag Action */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          
          {/* Integrated Minimal Search */}
          <div className="relative search-container">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  autoFocus
                  className="w-44 sm:w-64 bg-[#e7e5e4] text-[#000000] placeholder-[#595855] text-xs px-3 py-1.5 rounded-[9px] border border-[#dfdcd5] focus:outline-none focus:border-[#000000] font-helvetica"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-1.5 text-[#595855] hover:text-[#000000] p-1"
                >
                  <X size={14} />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-[#000000] hover:text-[#595855] p-1 transition-colors flex items-center gap-1.5 text-xs font-helvetica"
                title="Search"
              >
                <Search size={16} strokeWidth={1.75} />
                <span className="hidden lg:inline text-[12px] uppercase tracking-wider">Search</span>
              </button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] shadow-none overflow-hidden z-50">
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

          {/* Account Profile Dropdown */}
          <div className="relative profile-container">
            {user ? (
              <div>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 text-xs font-helvetica text-[#000000] hover:text-[#595855] transition-colors py-1"
                >
                  <User size={16} strokeWidth={1.75} />
                  <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider">
                    {profile?.full_name ? profile.full_name.split(' ')[0] : 'Account'}
                  </span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-[#dfdcd5]">
                      <p className="text-[10px] text-[#595855] uppercase tracking-wider">Signed In As</p>
                      <p className="text-xs font-medium text-[#000000] truncate font-helvetica">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-xs text-[#000000] hover:bg-[#dfdcd5]/60 transition-colors font-helvetica"
                    >
                      Profile & Details
                    </Link>
                    <Link
                      to="/my-orders"
                      className="block px-3 py-2 text-xs text-[#000000] hover:bg-[#dfdcd5]/60 transition-colors font-helvetica"
                    >
                      My Orders
                    </Link>
                    {(profile?.role === 'admin' || user.email === 'admin@veltrix.com') && (
                      <Link
                        to="/store-control"
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#000000] hover:bg-[#dfdcd5]/60 transition-colors border-t border-[#dfdcd5]/60"
                      >
                        <Shield size={12} />
                        Store Control
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-1.5 px-3 py-2 text-xs text-red-700 hover:bg-[#dfdcd5]/60 transition-colors border-t border-[#dfdcd5]/60 font-helvetica"
                    >
                      <LogOut size={12} />
                      Sign Out
                    </button>
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
            className="btn-pill-action py-1.5 px-3 sm:px-4 text-[11px] sm:text-xs"
          >
            <ShoppingBag size={13} strokeWidth={2} />
            <span className="uppercase tracking-wider">Bag [{itemCount}]</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-[#000000] p-1.5 ml-1 rounded-md hover:bg-[#000000]/5 transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#c4c3b6] border-t border-[#000000]/15 px-4 py-5 animate-in slide-in-from-top duration-200">
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
