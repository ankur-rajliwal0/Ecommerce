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
      try {
        if (user) {
          const userKey = `cart_${user.id}`;
          const saved = localStorage.getItem(userKey);
          let initialItems = saved ? JSON.parse(saved) : [];

          // Also check for guest cart items to merge
          const guestSaved = localStorage.getItem('cart_guest');
          if (guestSaved) {
            try {
              const guestItems = JSON.parse(guestSaved);
              if (Array.isArray(guestItems) && guestItems.length > 0) {
                guestItems.forEach(gItem => {
                  if (gItem && gItem.id) {
                    const match = initialItems.find(i => i.id === gItem.id);
                    if (match) {
                      match.quantity += (gItem.quantity || 1);
                    } else {
                      initialItems.push(gItem);
                    }
                  }
                });
                localStorage.removeItem('cart_guest');
              }
            } catch (err) {}
          }

          if (initialItems.length > 0) {
            setCartItems(initialItems.filter(i => i && i.id));
          }

          // Fetch latest from DB
          const { data } = await supabase
            .from('user_carts')
            .select('cart_items')
            .eq('user_id', user.id)
            .single();

          if (data && Array.isArray(data.cart_items) && data.cart_items.length > 0) {
            setCartItems(data.cart_items.filter(i => i && i.id));
            localStorage.setItem(userKey, JSON.stringify(data.cart_items));
          }
        } else {
          // Guest mode: load from localStorage
          const guestSaved = localStorage.getItem('cart_guest');
          if (guestSaved) {
            const parsed = JSON.parse(guestSaved);
            if (Array.isArray(parsed)) {
              setCartItems(parsed.filter(i => i && i.id));
            }
          }
        }
      } catch (err) {
        console.warn('Error loading cart:', err);
      }
      setIsInitialLoad(false);
    };

    fetchCart();
  }, [user]);

  // Save cart to DB and LocalStorage when cartItems change
  useEffect(() => {
    const saveCart = async () => {
      if (isInitialLoad) return;
      const cleanItems = cartItems.filter(i => i && i.id);

      if (user) {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(cleanItems));

        await supabase
          .from('user_carts')
          .upsert({
            user_id: user.id,
            cart_items: cleanItems,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });
      } else {
        localStorage.setItem('cart_guest', JSON.stringify(cleanItems));
      }
    };

    saveCart();
  }, [cartItems, user, isInitialLoad]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
      console.warn('Invalid product passed to addToCart:', product);
      return;
    }

    const existingItem = cartItems.find(item => item && item.id === product.id);
    if (existingItem) {
      setIsCartOpen(true);
      toast('Item already in your bag', {
        icon: '🛍️',
        style: {
          background: '#000000',
          color: '#ffffff',
          borderRadius: '28.8px',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        },
      });
      return;
    }

    setCartItems(prev => {
      const cleanPrev = Array.isArray(prev) ? prev.filter(i => i && i.id) : [];
      return [...cleanPrev, { ...product, quantity }];
    });

    toast.success('Acquisition added to bag', {
      style: {
        background: '#000000',
        color: '#ffffff',
        borderRadius: '28.8px',
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast('Item removed from bag', {
      icon: '🗑️',
      style: { background: '#000000', color: '#ffffff', borderRadius: '28.8px', fontSize: '12px', fontFamily: 'Inter, sans-serif' }
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
    toast('Bag cleared', {
      icon: '🗑️',
      style: { background: '#000000', color: '#ffffff', borderRadius: '28.8px', fontSize: '12px', fontFamily: 'Inter, sans-serif' }
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
