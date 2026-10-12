import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, LogOut, Menu, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import logo from '../assets/lovora-logo.png';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-border-gray sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-8">
        <Link to="/" className="flex items-center shrink-0">
          <img src={logo} alt="Lovora" className="h-16 md:h-20 w-auto object-contain" />
        </Link>

        <div className="flex-1 max-w-2xl hidden md:block relative search-container">
          <form onSubmit={(e) => {
            e.preventDefault();
            setShowSuggestions(false);
            if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
          }} className="flex items-center bg-gray-100 rounded-xl px-4 py-2 border border-border-gray focus-within:border-primary-teal focus-within:bg-white transition-colors">
            <input 
              type="text" 
              name="q" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-transparent border-none outline-none text-sm" 
            />
            <button type="submit" className="text-gray-900 font-bold hover:text-gray-900 transition-colors"><Search size={20} /></button>
          </form>

          {showSuggestions && searchQuery.trim().length >= 2 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-border-gray shadow-xl rounded-xl py-2 z-50 max-h-[400px] overflow-y-auto">
              {suggestions.length > 0 ? (
                <div>
                  <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Products</div>
                  {suggestions.map(item => (
                    <Link 
                      key={item.id} 
                      to={`/product/${item.id}`}
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-border-gray">
                        {item.image_url ? (
                          <img src={item.image_url.split(',')[0]} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                        <span className="text-xs text-gray-500">{item.category?.name || 'Product'}</span>
                      </div>
                      <div className="font-bold text-gray-900 font-bold text-sm">₹{item.price.toFixed(2)}</div>
                    </Link>
                  ))}
                  <button 
                    onClick={() => {
                      setShowSuggestions(false);
                      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                    }}
                    className="w-full text-center py-3 text-sm text-gray-900 font-bold font-semibold hover:bg-teal-50 transition-colors"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <Link to="/cart" className="relative hover:text-gray-900 font-bold transition-colors p-2">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-accent-orange text-gray-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="relative group">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 hover:text-gray-900 font-bold transition-colors p-2"
              >
                <User size={22} />
                <span className="text-sm font-medium hidden sm:block">Account</span>
              </button>
              
              {isProfileOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
              )}

              <div className={`absolute right-0 top-full mt-1 w-48 bg-white border border-border-gray rounded-xl shadow-lg flex flex-col py-2 z-50 transition-all duration-200 ${isProfileOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                <div className="px-4 py-3 border-b border-border-gray mb-1 bg-gray-50">
                  <p className="text-sm font-bold text-gray-900 capitalize">
                    {profile?.full_name || user?.user_metadata?.full_name || user.email.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                </div>
                {profile?.role === 'admin' && (
                  <Link to="/store-control" onClick={() => setIsProfileOpen(false)} className="px-4 py-2.5 text-sm font-bold text-gray-900 font-bold bg-primary-teal/5 hover:bg-primary-teal/10 flex items-center gap-2 border-l-4 border-primary-teal transition-colors">
                    <Shield size={16} /> Admin Dashboard
                  </Link>
                )}
                <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-bold flex items-center gap-2 mt-1">My Profile</Link>
                <Link to="/my-orders" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-bold flex items-center gap-2">My Orders</Link>
                <button onClick={() => { setIsProfileOpen(false); setShowLogoutConfirm(true); }} className="px-4 py-2 text-sm text-red-600 hover:bg-gray-50 text-left flex items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 hover:text-gray-900 font-bold transition-colors p-2">
              <User size={22} />
              <span className="text-sm font-medium hidden sm:block">Login</span>
            </Link>
          )}
        </div>
      </div>
      
      <nav className="border-t border-border-gray hidden md:block bg-white relative z-40">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-8 text-sm font-medium text-gray-600">
          
          <Link to="/" className="hover:text-gray-900 font-bold transition-colors font-semibold">Home</Link>
          <Link to="/products" className="hover:text-gray-900 font-bold transition-colors font-semibold">All Products</Link>

          {/* Categories Dropdown */}
          <div className="relative group h-full flex items-center ml-auto">
            <Link to="/products" className="text-gray-900 font-bold font-bold hover:text-gray-800 flex items-center gap-1.5 h-full">
              <Menu size={18} />
              Browse Categories
              <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
            </Link>
            
            <div className="absolute top-full right-0 w-56 bg-white border border-border-gray shadow-xl rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-1 z-50">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    to={`/products?category=${cat.id}`} 
                    className="px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-bold border-b border-gray-100 last:border-0 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))
              ) : (
                <div className="px-5 py-3 text-sm text-gray-500 italic">No categories added</div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-[300px] md:max-w-sm w-full p-5 md:p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <LogOut size={20} className="md:w-6 md:h-6" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-center text-gray-900 mb-2">Confirm Logout</h3>
            <p className="text-center text-gray-600 mb-5 md:mb-6 text-sm font-medium">Are you sure you want to log out of your account?</p>
            <div className="flex gap-2.5 md:gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 md:py-2.5 text-sm md:text-base rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => { setShowLogoutConfirm(false); handleLogout(); }}
                className="flex-1 bg-red-600 text-white font-bold py-2 md:py-2.5 text-sm md:text-base rounded-xl hover:bg-red-700 transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
