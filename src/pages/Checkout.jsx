import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { CreditCard, QrCode } from 'lucide-react';
import paymentImage from '../assets/1760089449538_content_img.jpeg';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchingPincode, setFetchingPincode] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, email: user.email || '', fullName: user.user_metadata?.full_name || '' }));

      const fetchProfile = async () => {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        
        let addrs = [];
        // Add DB Profile address as Default if it exists
        if (data && data.address) {
          addrs.push({
            fullName: data.full_name || user.user_metadata?.full_name || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zip: data.postal_code || ''
          });
        }
        
        // Add saved addresses from user metadata
        const metadataAddresses = user.user_metadata?.saved_addresses || [];
        addrs = [...addrs, ...metadataAddresses];
        
        setSavedAddresses(addrs);
        if (addrs.length > 0) {
          setFormData(prev => ({ ...prev, ...addrs[0] }));
          setSelectedAddressIndex(0);
        } else {
          setSelectedAddressIndex(-1);
          if (data) {
             setFormData(prev => ({
               ...prev,
               fullName: data.full_name || prev.fullName,
               phone: data.phone || ''
             }));
          }
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length > 6) return;
    setFormData(prev => ({ ...prev, zip: val }));
    
    if (val.length === 6) {
      setFetchingPincode(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setFormData(prev => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State
          }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingPincode(false);
      }
    }
  };

  const handleAddressSelect = (index) => {
    setSelectedAddressIndex(index);
    if (index >= 0 && index < savedAddresses.length) {
      setFormData(prev => ({ ...prev, ...savedAddresses[index] }));
    } else {
      setFormData(prev => ({ ...prev, address: '', city: '', state: '', zip: '' }));
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error('Cart is empty');

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      toast.error('Razorpay Key ID is missing in .env file!');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Razorpay Order via Supabase Edge Function
      const { data: rzpOrder, error: fnError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: cartTotal }
      });

      if (fnError) throw fnError;
      if (!rzpOrder || !rzpOrder.id) throw new Error("Could not create Razorpay Order");

      // 2. Initialize Razorpay
      const options = {
        key: razorpayKeyId,
        amount: rzpOrder.amount, // in paise
        currency: "INR",
        name: "Gift & Flower",
        description: "Order Payment",
        order_id: rzpOrder.id,
        handler: async function (response) {
          try {
            toast.loading('Verifying payment...', { id: 'payment-verify' });

            // 3. Verify Payment and Create Order via Edge Function
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,

                // Pass order details to be saved in DB
                user_id: user.id,
                customer_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.zip,
                subtotal: cartTotal,
                delivery_charge: 0,
                total_amount: cartTotal,
                cartItems: cartItems.map(item => ({
                  product_id: item.id,
                  product_name: item.name,
                  product_image: item.image_url ? item.image_url.split(',')[0] : null,
                  price: item.price,
                  quantity: item.quantity
                }))
              }
            });

            if (verifyError) throw verifyError;

            // 4. Update the user's profile with the latest address if no addresses exist
            // Or if they select to save it as the new default
            if (savedAddresses.length === 0) {
              await supabase.from('profiles').update({
                full_name: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zip
              }).eq('id', user.id);
            }
            
            // Save to metadata if adding new address and checked
            if (selectedAddressIndex === -1 && saveNewAddress) {
              const newAddress = {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zip
              };
              const updatedAddresses = [...(user.user_metadata?.saved_addresses || []), newAddress];
              await supabase.auth.updateUser({
                data: { saved_addresses: updatedAddresses }
              });
            }

            // 5. Decrement inventory stock if tracking is enabled
            try {
              const { data: settings } = await supabase.from('store_settings').select('inventory_tracking').eq('id', 1).maybeSingle();
              
              const isTracking = (settings && settings.inventory_tracking !== undefined) ? settings.inventory_tracking : true;
              
              if (isTracking) {
                for (const item of cartItems) {
                  await supabase.rpc('decrement_stock', {
                    p_id: item.id,
                    p_quantity: item.quantity
                  });
                }
              }
            } catch (err) {
              console.error('Failed to decrement stock:', err);
            }

            toast.success('Order placed successfully! 🎉', { id: 'payment-verify' });
            clearCart();
            navigate('/order-success');
          } catch (err) {
            console.error("Payment Verification Failed:", err);

            // Try to extract the real error message from the Edge Function
            let realMessage = err.message;
            if (err.context && typeof err.context.text === 'function') {
              try {
                const bodyText = await err.context.text();
                const bodyJson = JSON.parse(bodyText);
                if (bodyJson.error) realMessage = bodyJson.error;
              } catch (e) { }
            }

            toast.error('Payment verification failed: ' + realMessage, { id: 'payment-verify', duration: 10000 });
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#0d9488" // primary-teal
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        toast.error(`Payment Failed: ${response.error.description}`);
      });

      rzp.open();

    } catch (error) {
      console.error(error);
      toast.error('Checkout failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 min-h-[calc(100vh-140px)]">
        <div className="max-w-md mx-auto mt-20 text-center p-10 bg-white border border-border-gray rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 font-bold mb-4">Sign in required</h2>
          <p className="text-gray-500 mb-6">Please log in to your account to securely complete your purchase.</p>
          <button onClick={() => navigate('/login')} className="bg-primary-teal text-gray-900 px-6 py-2 rounded-xl font-medium hover:bg-secondary-teal transition-colors">Log In to Checkout</button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 min-h-[calc(100vh-140px)]">
        <div className="max-w-md mx-auto mt-20 text-center p-10 bg-white border border-border-gray rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 font-bold mb-4">Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="bg-primary-teal text-gray-900 px-6 py-2 rounded-xl font-medium hover:bg-secondary-teal transition-colors">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-[calc(100vh-140px)]">
      <h1 className="text-3xl font-bold text-gray-900 font-bold mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
        <div className="w-full">
          <form onSubmit={handleCheckout}>
            <div className="bg-white border border-border-gray rounded-xl p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-900 font-bold mb-6 pb-3 border-b border-border-gray">Shipping Information</h3>
              
              {savedAddresses.length > 0 && (
                <div className="mb-6 space-y-3">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Select Address</label>
                  {savedAddresses.map((addr, idx) => (
                    <label key={idx} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddressIndex === idx ? 'border-primary-teal bg-primary-teal/5' : 'border-border-gray hover:border-gray-300'}`}>
                      <input type="radio" name="addressSelect" checked={selectedAddressIndex === idx} onChange={() => handleAddressSelect(idx)} className="mt-1 mr-3 text-primary-teal focus:ring-primary-teal" />
                      <div>
                        <p className="font-semibold text-gray-900">{addr.fullName} <span className="font-normal text-gray-500 text-sm ml-2">{addr.phone}</span></p>
                        <p className="text-gray-600 text-sm mt-1">{addr.address}, {addr.city}, {addr.state} - {addr.zip}</p>
                      </div>
                    </label>
                  ))}
                  <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddressIndex === -1 ? 'border-primary-teal bg-primary-teal/5' : 'border-border-gray hover:border-gray-300'}`}>
                    <input type="radio" name="addressSelect" checked={selectedAddressIndex === -1} onChange={() => handleAddressSelect(-1)} className="mt-1 mr-3 text-primary-teal focus:ring-primary-teal" />
                    <span className="font-semibold text-gray-900">Add a new address</span>
                  </label>
                </div>
              )}

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${selectedAddressIndex !== -1 && savedAddresses.length > 0 ? 'hidden' : ''}`}>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2.5 border border-border-gray rounded-xl outline-none focus:border-primary-teal transition-colors" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2.5 border border-border-gray rounded-xl outline-none focus:border-primary-teal transition-colors" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                  <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2.5 border border-border-gray rounded-xl outline-none focus:border-primary-teal transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    ZIP / Postal Code
                  </label>
                  <input required type="text" name="zip" value={formData.zip} onChange={handlePincodeChange} placeholder="Enter 6-digit PIN" className="w-full p-2.5 border border-border-gray rounded-xl outline-none focus:border-primary-teal transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2.5 border border-border-gray rounded-xl outline-none focus:border-primary-teal transition-colors bg-gray-50" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">State</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-2.5 border border-border-gray rounded-xl outline-none focus:border-primary-teal transition-colors bg-gray-50" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Street Address</label>
                  <input required={selectedAddressIndex === -1} type="text" name="address" value={formData.address} onChange={handleChange} placeholder="House No, Building, Street, Area" className="w-full p-2.5 border border-border-gray rounded-xl outline-none focus:border-primary-teal transition-colors" />
                </div>
                {selectedAddressIndex === -1 && savedAddresses.length > 0 && (
                  <div className="md:col-span-2 mt-2">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" checked={saveNewAddress} onChange={(e) => setSaveNewAddress(e.target.checked)} className="mr-2 rounded border-gray-300 text-primary-teal focus:ring-primary-teal" />
                      <span className="text-sm font-medium text-gray-700">Save this address for future orders</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-border-gray rounded-xl p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-900 font-bold mb-6 pb-3 border-b border-border-gray">Payment</h3>
              <div className="border border-border-gray rounded-xl bg-blue-50 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <strong className="text-gray-900 block">Razorpay Secure Payment</strong>
                  <p className="text-sm text-gray-500 mt-1">Pay via UPI, Cards, Netbanking, or Wallets</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center justify-center px-3 py-1.5 bg-white border border-border-gray rounded-xl shadow-sm h-10 w-16">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-4 object-cover" />
                  </div>
                  <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-border-gray rounded-xl shadow-sm h-10">
                    <img src={paymentImage} alt="Visa" className="h-4 object-cover" />
                    <div className="w-[1px] h-4 bg-gray-200"></div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 object-cover" />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary-teal hover:bg-secondary-teal text-gray-900 font-bold py-4 px-4 rounded-xl transition-colors disabled:opacity-70">
                {loading ? 'Processing...' : 'Confirm Order & Pay'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 border border-border-gray rounded-xl p-8 sticky top-24">
          <h3 className="text-xl font-bold text-gray-900 font-bold mb-6">In your bag</h3>
          <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-4 items-center relative group bg-white p-2 rounded-xl border border-transparent hover:border-gray-200 transition-colors">
                <img src={item.image_url ? item.image_url.split(',')[0] : 'https://via.placeholder.com/100'} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-border-gray bg-white shrink-0" />
                <div className="flex flex-col gap-1 flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 pr-6">{item.name}</h4>
                  <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                  <strong className="text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</strong>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-xl transition-colors"
                  title="Remove item"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-border-gray pt-6">
            <div className="flex justify-between mb-3 text-sm text-gray-800 font-medium">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 text-sm text-gray-800 font-medium">
              <span>Shipping</span>
              <span className="text-green-600 font-bold">Free</span>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-border-gray font-bold text-lg text-gray-900 font-bold">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
