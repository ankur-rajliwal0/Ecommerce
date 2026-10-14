import React from 'react';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-helvetica">
      {/* Dark overlay */}
      <div 
        className="fixed inset-0 bg-[#000000]/50 backdrop-blur-[2px] transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#e7e5e4] border-l border-[#dfdcd5] flex flex-col justify-between shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-[#dfdcd5] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block">
                FOLIO REVIEW
              </span>
              <h2 className="font-davinci text-2xl font-medium text-[#000000]">
                Your Bag ({cartItems.length})
              </h2>
            </div>
            <button 
              className="text-[#595855] hover:text-[#000000] p-1.5 rounded-full hover:bg-[#dfdcd5]/60 transition-colors" 
              onClick={() => setIsCartOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-davinci text-xl text-[#000000] mb-2">Your bag is empty.</p>
                <p className="text-xs text-[#595855] mb-6">Explore our archive of living botanicals and fine confections.</p>
                <button 
                  className="btn-pill-action py-2.5 px-6 text-xs uppercase tracking-wider" 
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="bg-[#ffffff] border border-[#dfdcd5] rounded-[9px] p-3 flex gap-3.5 items-center">
                  <img 
                    src={item.image_url ? item.image_url.split(',')[0] : '/favicon.png'} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-[9px] bg-[#c4c3b6] border border-[#dfdcd5]" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-davinci text-base font-medium text-[#000000] truncate">{item.name}</h4>
                    <p className="text-xs font-medium text-[#000000] mt-0.5">₹{Number(item.price).toFixed(2)}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-[#dfdcd5] rounded-[28.8px] bg-[#e7e5e4]">
                        <button className="px-2 py-0.5 text-[#000000]" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus size={11}/>
                        </button>
                        <span className="min-w-[20px] text-center text-xs font-medium text-[#000000]">{item.quantity}</span>
                        <button 
                          className="px-2 py-0.5 text-[#000000]" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={11}/>
                        </button>
                      </div>

                      <button 
                        className="text-[#595855] hover:text-red-700 p-1 transition-colors" 
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-[#dfdcd5] bg-[#dfdcd5]/30">
              <div className="flex justify-between items-center mb-4 text-xs font-medium">
                <span className="text-[#595855] uppercase tracking-wider text-[11px]">Subtotal Valuation</span>
                <span className="text-sm font-semibold text-[#000000]">₹{Number(cartTotal || 0).toFixed(2)}</span>
              </div>
              <button 
                className="btn-pill-action w-full py-3.5 text-xs uppercase tracking-widest" 
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={13} />
              </button>
              <button 
                className="w-full text-center text-[11px] text-[#595855] hover:text-[#000000] mt-2.5 transition-colors underline"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
              >
                View Detailed Folio
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
