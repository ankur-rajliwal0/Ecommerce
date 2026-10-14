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
    if (!user) {
      toast.error('Please sign in to complete your acquisition');
      navigate('/login?redirect=/checkout');
      return;
    }
    if (cartItems.length === 0) return toast.error('Folio is empty');

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      toast.error('Razorpay Key ID is missing in .env file!');
      return;
    }

    if (typeof window.Razorpay === 'undefined') {
      toast.error('Payment gateway is initializing. Please wait a moment and try again.');
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
        name: "Veltrix",
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
          color: "#000000" // Ink
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
      <div className="w-full bg-[#c4c3b6] min-h-[calc(100vh-140px)] py-16 px-4 sm:px-6 font-helvetica">
        <div className="max-w-md mx-auto text-center p-8 bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px]">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-2">
            AUTHENTICATION REQUIRED
          </span>
          <h2 className="font-davinci text-3xl font-medium text-[#000000] mb-3">Collector Sign In Required</h2>
          <p className="text-xs text-[#595855] mb-6">Please sign in to your folio to confirm dispatch and complete acquisition.</p>
          <button 
            onClick={() => navigate('/login?redirect=/checkout')} 
            className="btn-pill-action py-3 px-8 text-xs uppercase tracking-wider"
          >
            Sign In to Checkout
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full bg-[#c4c3b6] min-h-[calc(100vh-140px)] py-16 px-4 sm:px-6 font-helvetica">
        <div className="max-w-md mx-auto text-center p-8 bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px]">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-2">
            EMPTY FOLIO
          </span>
          <h2 className="font-davinci text-3xl font-medium text-[#000000] mb-3">Your Bag is Empty</h2>
          <p className="text-xs text-[#595855] mb-6">Select pieces from our catalog before proceeding to dispatch.</p>
          <button 
            onClick={() => navigate('/')} 
            className="btn-pill-action py-3 px-8 text-xs uppercase tracking-wider"
          >
            Explore Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#c4c3b6] text-[#000000] min-h-[calc(100vh-140px)] py-10 px-4 sm:px-6 font-helvetica">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-[#dfdcd5] pb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-1">
            FINAL DISPATCH
          </span>
          <h1 className="font-davinci text-3xl sm:text-4xl font-medium text-[#000000]">
            White Glove Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          <div className="w-full">
            <form onSubmit={handleCheckout}>
              
              {/* Shipping Address Card */}
              <div className="bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] p-6 sm:p-8 mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-1">
                  DESTINATION
                </span>
                <h3 className="font-davinci text-2xl font-medium text-[#000000] mb-5 pb-3 border-b border-[#dfdcd5]">
                  Recipient & Delivery Address
                </h3>
                
                {savedAddresses.length > 0 && (
                  <div className="mb-6 space-y-2.5">
                    <label className="text-[11px] uppercase tracking-wider text-[#595855] block mb-2">Saved Addresses</label>
                    {savedAddresses.map((addr, idx) => (
                      <label 
                        key={idx} 
                        className={`flex items-start p-3.5 border rounded-[9px] cursor-pointer transition-colors ${
                          selectedAddressIndex === idx 
                            ? 'border-[#000000] bg-[#ffffff]' 
                            : 'border-[#dfdcd5] hover:border-[#000000] bg-[#e7e5e4]'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="addressSelect" 
                          checked={selectedAddressIndex === idx} 
                          onChange={() => handleAddressSelect(idx)} 
                          className="mt-1 mr-3 text-[#000000]" 
                        />
                        <div className="text-xs">
                          <p className="font-medium text-[#000000]">{addr.fullName} <span className="text-[#595855] ml-2">{addr.phone}</span></p>
                          <p className="text-[#595855] mt-0.5">{addr.address}, {addr.city}, {addr.state} - {addr.zip}</p>
                        </div>
                      </label>
                    ))}
                    <label 
                      className={`flex items-start p-3.5 border rounded-[9px] cursor-pointer transition-colors ${
                        selectedAddressIndex === -1 
                          ? 'border-[#000000] bg-[#ffffff]' 
                          : 'border-[#dfdcd5] hover:border-[#000000] bg-[#e7e5e4]'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="addressSelect" 
                        checked={selectedAddressIndex === -1} 
                        onChange={() => handleAddressSelect(-1)} 
                        className="mt-1 mr-3 text-[#000000]" 
                      />
                      <span className="text-xs font-medium text-[#000000]">Dispatch to a different address</span>
                    </label>
                  </div>
                )}

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${selectedAddressIndex !== -1 && savedAddresses.length > 0 ? 'hidden' : ''}`}>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#595855]">Full Name</label>
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] transition-colors bg-[#ffffff] text-xs text-[#000000]" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#595855]">Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] transition-colors bg-[#ffffff] text-xs text-[#000000]" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#595855]">Phone Number</label>
                    <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] transition-colors bg-[#ffffff] text-xs text-[#000000]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#595855]">PIN Code</label>
                    <input required type="text" name="zip" value={formData.zip} onChange={handlePincodeChange} placeholder="6-digit PIN" className="w-full px-3 py-2 border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] transition-colors bg-[#ffffff] text-xs text-[#000000]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#595855]">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] transition-colors bg-[#ffffff] text-xs text-[#000000]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#595855]">State</label>
                    <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2 border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] transition-colors bg-[#ffffff] text-xs text-[#000000]" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#595855]">Street Address & Landmark</label>
                    <input required={selectedAddressIndex === -1} type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Apartment, Studio, Street name" className="w-full px-3 py-2 border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] transition-colors bg-[#ffffff] text-xs text-[#000000]" />
                  </div>
                  {selectedAddressIndex === -1 && savedAddresses.length > 0 && (
                    <div className="md:col-span-2 mt-2">
                      <label className="flex items-center cursor-pointer text-xs text-[#595855]">
                        <input type="checkbox" checked={saveNewAddress} onChange={(e) => setSaveNewAddress(e.target.checked)} className="mr-2 text-[#000000]" />
                        <span>Preserve this address in your collector folio</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] p-6 sm:p-8 mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-1">
                  PAYMENT CLEARING
                </span>
                <h3 className="font-davinci text-2xl font-medium text-[#000000] mb-5 pb-3 border-b border-[#dfdcd5]">
                  Instant & Encrypted Clearance
                </h3>
                <div className="border border-[#dfdcd5] rounded-[9px] bg-[#ffffff] p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <strong className="text-xs font-medium text-[#000000] block">Razorpay Encrypted Gateway</strong>
                    <p className="text-[11px] text-[#595855] mt-0.5">UPI (Google Pay, PhonePe, Paytm), Netbanking, Credit & Debit Cards</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center px-3 py-1 bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] h-8">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-3.5 object-contain" />
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn-pill-action w-full py-4 text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {loading ? 'Clearing Acquisition...' : `Authorize & Acquire — ₹${Number(cartTotal || 0).toFixed(2)}`}
                </button>
              </div>

            </form>
          </div>

          {/* Right: In Your Bag Summary */}
          <div className="bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] p-6 sticky top-24">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-1">
              FOLIO SUMMARY
            </span>
            <h3 className="font-davinci text-2xl font-medium text-[#000000] mb-4 pb-3 border-b border-[#dfdcd5]">
              Acquisitions ({cartItems.length})
            </h3>
            
            <div className="flex flex-col gap-3 mb-6 max-h-[38vh] overflow-y-auto pr-1">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3 items-center bg-[#ffffff] p-2.5 rounded-[9px] border border-[#dfdcd5]">
                  <img 
                    src={item.image_url ? item.image_url.split(',')[0] : '/favicon.png'} 
                    alt={item.name} 
                    className="w-12 h-12 object-cover rounded-[9px] border border-[#dfdcd5] bg-[#c4c3b6] shrink-0" 
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <h4 className="font-davinci text-sm font-medium text-[#000000] truncate">{item.name}</h4>
                    <div className="flex justify-between items-center text-xs mt-0.5">
                      <span className="text-[11px] text-[#595855]">Qty: {item.quantity}</span>
                      <strong className="text-xs text-[#000000]">₹{((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#dfdcd5] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#595855]">
                <span>Subtotal</span>
                <span className="text-[#000000] font-medium">₹{Number(cartTotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#595855]">
                <span>Delivery</span>
                <span className="text-[#000000] font-medium uppercase tracking-wider text-[11px]">Free White Glove</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#dfdcd5] font-medium text-sm text-[#000000]">
                <span>Total Due</span>
                <span className="text-base font-semibold">₹{Number(cartTotal || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
