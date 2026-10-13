import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load cart from DB and LocalStorage on mount/user change
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        // Quick load from local storage
        const saved = localStorage.getItem(`cart_${user.id}`);
        if (saved) {
          setCartItems(JSON.parse(saved));
        }

        // Fetch latest from DB
        const { data, error } = await supabase
          .from('user_carts')
          .select('cart_items')
          .eq('user_id', user.id)
          .single();

        if (data && data.cart_items) {
          setCartItems(data.cart_items);
          localStorage.setItem(`cart_${user.id}`, JSON.stringify(data.cart_items));
        }
      } else {
        setCartItems([]);
      }
      setIsInitialLoad(false);
    };

    fetchCart();
  }, [user]);

  // Save cart to DB and LocalStorage when cartItems change
  useEffect(() => {
    const saveCart = async () => {
      if (user && !isInitialLoad) {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));

        const { error } = await supabase
          .from('user_carts')
          .upsert({
            user_id: user.id,
            cart_items: cartItems,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error saving cart to DB:', error);
        }
      }
    };

    saveCart();
  }, [cartItems, user, isInitialLoad]);

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
    toast.success('Added to cart!', {
      style: {
        background: '#003F3B',
        color: '#fff',
      },
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast('Item removed from cart', {
      icon: '🗑️',
      style: { background: '#333', color: '#fff' }
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCartItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast('Cart cleared', {
      icon: '🗑️',
      style: { background: '#333', color: '#fff' }
    });
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      isCartOpen, setIsCartOpen, cartTotal, itemCount
    }}>
      {children}
      
      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-[#DCC6A8] animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-[#E9E9E0] rounded-full flex items-center justify-center mx-auto mb-5 border border-[#DCC6A8]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#344B38]"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h3 className="text-xl font-black text-[#292923] mb-2">Login Required</h3>
              <p className="text-sm text-[#829078] mb-8 font-medium">You need to be logged in to add items to your cart. Please login or create a new account.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLoginModal(false)} className="flex-1 py-3 px-4 border-2 border-[#DCC6A8] rounded-xl text-[#292923] font-bold hover:bg-[#E9E9E0] transition-colors">Cancel</button>
                <button onClick={() => { setShowLoginModal(false); window.location.href='/login'; }} className="flex-1 py-3 px-4 bg-[#344B38] text-white rounded-xl font-bold hover:bg-[#829078] shadow-md hover:shadow-lg transition-all">Login Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
