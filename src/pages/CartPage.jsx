import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="w-full bg-[#c4c3b6] min-h-[calc(100vh-140px)] py-16 px-4 sm:px-6">
        <div className="max-w-md mx-auto text-center p-8 bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px]">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] font-helvetica block mb-2">
            YOUR BAG IS EMPTY
          </span>
          <h2 className="font-davinci text-3xl font-medium text-[#000000] mb-3">Your Bag is Empty</h2>
          <p className="text-xs text-[#595855] font-helvetica mb-6">
            You haven't added any products to your bag yet.
          </p>
          <button 
            className="btn-pill-action py-3 px-6 text-xs uppercase tracking-wider" 
            onClick={() => navigate('/products')}
          >
            <span>Explore Collection</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#c4c3b6] text-[#000000] min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 border-b border-[#dfdcd5] pb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] font-helvetica block mb-1">
            SHOPPING BAG
          </span>
          <h1 className="font-davinci text-3xl sm:text-4xl font-medium text-[#000000]">
            Shopping Bag ({cartItems.length} items)
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          
          {/* Items Table / List */}
          <div className="bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] p-5 sm:p-6 font-helvetica">
            
            {/* Desktop Table View */}
            <table className="w-full border-collapse hidden md:table">
              <thead>
                <tr className="border-b border-[#dfdcd5] text-[10px] uppercase tracking-wider text-[#595855]">
                  <th className="text-left py-3 font-medium">Product</th>
                  <th className="text-left py-3 font-medium">Price</th>
                  <th className="text-left py-3 font-medium">Quantity</th>
                  <th className="text-right py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b border-[#dfdcd5]/60 last:border-0">
                    <td className="py-4 pr-4">
                      <div className="flex gap-4 items-center">
                        <img 
                          src={item.image_url ? item.image_url.split(',')[0] : '/favicon.png'} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-[9px] border border-[#dfdcd5] bg-[#c4c3b6]" 
                        />
                        <div className="flex flex-col">
                          <Link to={`/product/${item.id}`} className="font-davinci text-lg font-medium text-[#000000] hover:underline">
                            {item.name}
                          </Link>
                          <span className="text-[11px] text-[#595855]">{item.category?.name || 'Artifact'}</span>
                          <button 
                            className="flex items-center gap-1 text-[11px] text-[#595855] hover:text-red-700 mt-1 w-max" 
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-xs font-medium text-[#000000]">
                      <span>₹{Number(item.price).toFixed(2)}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="inline-flex items-center border border-[#dfdcd5] rounded-[28.8px] bg-[#ffffff]">
                        <button className="px-2.5 py-1 text-[#000000] hover:bg-[#e7e5e4] transition-colors rounded-l-[28.8px]" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus size={11}/>
                        </button>
                        <span className="min-w-[28px] text-center text-xs font-medium text-[#000000]">{item.quantity}</span>
                        <button 
                          className={`px-2.5 py-1 text-[#000000] hover:bg-[#e7e5e4] transition-colors rounded-r-[28.8px] ${item.quantity >= item.stock ? 'opacity-40 cursor-not-allowed' : ''}`} 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={11}/>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-right text-xs font-medium text-[#000000]">
                      ₹{((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="border-b border-[#dfdcd5] pb-4 last:border-0 flex gap-3">
                  <img 
                    src={item.image_url ? item.image_url.split(',')[0] : '/favicon.png'} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-[9px] border border-[#dfdcd5]" 
                  />
                  <div className="flex-1 flex flex-col">
                    <Link to={`/product/${item.id}`} className="font-davinci text-base font-medium text-[#000000] line-clamp-1 hover:underline">
                      {item.name}
                    </Link>
                    <span className="text-xs font-medium text-[#000000] my-0.5">₹{Number(item.price).toFixed(2)}</span>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#dfdcd5] rounded-[28.8px] bg-[#ffffff]">
                        <button className="px-2 py-0.5" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={10}/></button>
                        <span className="min-w-[22px] text-center text-xs font-medium">{item.quantity}</span>
                        <button className="px-2 py-0.5" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}><Plus size={10}/></button>
                      </div>
                      <button className="text-[#595855] hover:text-red-700 p-1" onClick={() => removeFromCart(item.id)}><Trash2 size={13}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Folio Summary Card */}
          <div className="bg-[#e7e5e4] p-6 rounded-[9px] border border-[#dfdcd5] font-helvetica sticky top-24">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-1">
              ESTIMATE
            </span>
            <h2 className="font-davinci text-2xl font-medium text-[#000000] mb-5 pb-3 border-b border-[#dfdcd5]">
              Summary & Courier
            </h2>
            <div className="flex justify-between mb-3 text-xs text-[#595855]">
              <span>Subtotal</span>
              <span className="text-[#000000] font-medium">₹{Number(cartTotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 text-xs text-[#595855]">
              <span>Florentine White Glove Delivery</span>
              <span className="text-[#000000] font-medium uppercase tracking-wider text-[11px]">Complimentary</span>
            </div>
            <div className="flex justify-between mb-3 text-xs text-[#595855]">
              <span>Deckle-Edge Wax Sealed Card</span>
              <span className="text-[#000000] font-medium uppercase tracking-wider text-[11px]">Included</span>
            </div>
            <div className="flex justify-between mt-5 pt-4 border-t border-[#dfdcd5] font-medium text-sm text-[#000000]">
              <span>Grand Total</span>
              <span className="text-base">₹{Number(cartTotal || 0).toFixed(2)}</span>
            </div>
            <button 
              className="btn-pill-action w-full py-3.5 text-xs uppercase tracking-widest mt-6" 
              onClick={() => navigate('/checkout')}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={13} />
            </button>
            <p className="text-[10px] text-center text-[#595855] mt-3">
              Secure payment via Razorpay • 100% Guaranteed Freshness
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
