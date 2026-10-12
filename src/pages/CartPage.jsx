import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 min-h-[calc(100vh-140px)]">
        <div className="max-w-md mx-auto mt-20 text-center p-10 bg-white border border-border-gray rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <button className="bg-primary-teal text-gray-900 px-6 py-2 rounded-xl font-medium hover:bg-secondary-teal transition-colors" onClick={() => navigate('/')}>Start Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-[calc(100vh-140px)]">
      <h1 className="text-3xl font-bold text-gray-900 font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10 items-start">
        <div className="w-full">
          <table className="w-full border-collapse hidden md:table">
            <thead>
              <tr className="border-b-2 border-border-gray">
                <th className="text-left py-4 text-sm font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left py-4 text-sm font-semibold text-gray-500 uppercase">Price</th>
                <th className="text-left py-4 text-sm font-semibold text-gray-500 uppercase">Quantity</th>
                <th className="text-left py-4 text-sm font-semibold text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="border-b border-border-gray">
                  <td className="py-6 pr-4">
                    <div className="flex gap-5 items-center">
                      <img src={item.image_url ? item.image_url.split(',')[0] : 'https://via.placeholder.com/100'} alt={item.name} className="w-24 h-24 object-cover rounded-xl border border-border-gray bg-gray-50" />
                      <div className="flex flex-col gap-1">
                        <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 hover:text-gray-900 font-bold transition-colors">{item.name}</Link>
                        <span className="text-sm text-gray-500">{item.category?.name || 'Category'}</span>
                        <button className="flex items-center gap-1 text-sm text-red-600 hover:underline mt-1 w-max p-0" onClick={() => removeFromCart(item.id)}>
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 pr-4 font-medium">₹{Number(item.price).toFixed(2)}</td>
                  <td className="py-6 pr-4">
                    <div className="inline-flex items-center border border-border-gray rounded-xl bg-white">
                      <button className="p-2 hover:bg-gray-50 transition-colors" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14}/></button>
                      <span className="min-w-[30px] text-center font-medium">{item.quantity}</span>
                      <button 
                        className={`p-2 hover:bg-gray-50 transition-colors ${item.quantity >= item.stock ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        title={item.quantity >= item.stock ? "Maximum stock reached" : ""}
                      ><Plus size={14}/></button>
                    </div>
                  </td>
                  <td className="py-6 font-bold text-gray-900"> ₹{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile view */}
          <div className="md:hidden flex flex-col gap-4">
             {cartItems.map((item) => (
               <div key={item.id} className="border border-border-gray rounded-xl bg-white p-4 flex gap-4">
                  <img src={item.image_url ? item.image_url.split(',')[0] : 'https://via.placeholder.com/100'} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-border-gray" />
                  <div className="flex-1 flex flex-col">
                    <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 hover:text-gray-900 font-bold line-clamp-1">{item.name}</Link>
                    <div className="font-bold text-gray-900 my-1">₹{Number(item.price).toFixed(2)}</div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center border border-border-gray rounded-xl bg-white">
                        <button className="p-1.5 hover:bg-gray-50" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14}/></button>
                        <span className="min-w-[24px] text-center font-medium text-sm">{item.quantity}</span>
                        <button 
                          className={`p-1.5 hover:bg-gray-50 ${item.quantity >= item.stock ? 'opacity-50 cursor-not-allowed' : ''}`} 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          title={item.quantity >= item.stock ? "Maximum stock reached" : ""}
                        ><Plus size={14}/></button>
                      </div>
                      <button className="text-red-600 p-1" onClick={() => removeFromCart(item.id)}><Trash2 size={16}/></button>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl border border-border-gray sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 font-bold mb-6 pb-4 border-b border-border-gray">Order Summary</h2>
          <div className="flex justify-between mb-4 text-gray-800 font-medium">
            <span>Subtotal</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-800 font-medium">
            <span>Shipping</span>
            <span className="text-green-600 font-bold">Free</span>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-border-gray font-bold text-lg text-gray-900 font-bold">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <button className="w-full bg-primary-teal text-gray-900 py-3 rounded-xl font-bold mt-6 hover:bg-secondary-teal transition-colors" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
