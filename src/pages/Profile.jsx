import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { OrderCardSkeleton } from '../components/Skeletons';
import { User, Mail, Shield, Save, Package, ShoppingCart, ArrowRight, Activity, LogOut, Phone, MapPin, Edit } from 'lucide-react';

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const { cartItems, itemCount } = useCart();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [zip, setZip] = useState('');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fetchingPincode, setFetchingPincode] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setCity(profile.city || '');
      setStateValue(profile.state || '');
      setZip(profile.postal_code || '');
    }
    if (user) {
      fetchRecentOrders();
    }
  }, [profile, user]);

  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length > 6) return;
    setZip(val);
    
    if (val.length === 6) {
      setFetchingPincode(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setCity(postOffice.District);
          setStateValue(postOffice.State);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingPincode(false);
      }
    }
  };

  const fetchRecentOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products(name, image_url)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (!error && data) {
      setOrders(data);
    }
    setOrdersLoading(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: fullName, 
          phone: phone,
          address: address,
          city: city,
          state: stateValue,
          postal_code: zip
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return <div className="text-center py-20 text-gray-500">Please log in to view your profile.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-10">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#DCC6A8]/60 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#344B38] opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 z-10 w-full md:w-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-md border-4 border-white bg-[#E9E9E0] flex-shrink-0 flex items-center justify-center text-[#344B38] mt-2 md:mt-0">
              <User size={40} strokeWidth={1.5} />
            </div>
            
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-3 w-full max-w-md bg-[#F8F6F1] p-4 rounded-xl border border-[#DCC6A8]/60">
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2.5 text-sm border border-[#DCC6A8]/60 rounded-xl outline-none focus:border-[#344B38] bg-white text-[#292923]" placeholder="Full Name" />
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2.5 text-sm border border-[#DCC6A8]/60 rounded-xl outline-none focus:border-[#344B38] bg-white text-[#292923]" placeholder="Phone Number" />
                
                <div className="relative">
                  <input type="text" value={zip} onChange={handlePincodeChange} className="w-full p-2.5 text-sm border border-[#DCC6A8]/60 rounded-xl outline-none focus:border-[#344B38] bg-white text-[#292923]" placeholder="6-Digit PIN Code" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-2.5 text-sm border border-[#DCC6A8]/60 rounded-xl outline-none focus:border-[#344B38] bg-white text-[#292923]" placeholder="City" />
                  <input type="text" value={stateValue} onChange={(e) => setStateValue(e.target.value)} className="w-full p-2.5 text-sm border border-[#DCC6A8]/60 rounded-xl outline-none focus:border-[#344B38] bg-white text-[#292923]" placeholder="State" />
                </div>
                
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2.5 text-sm border border-[#DCC6A8]/60 rounded-xl outline-none focus:border-[#344B38] bg-white text-[#292923]" placeholder="Street Address, House No, Area" />
                <div className="flex gap-3 mt-2">
                  <button type="submit" disabled={loading} className="flex-1 bg-[#344B38] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#829078] transition-colors disabled:opacity-50 shadow-md">
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-[#E9E9E0] text-[#292923] py-2.5 rounded-xl font-bold text-sm hover:bg-[#DCC6A8]/50 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-[#292923] mb-3">Hello, {fullName || 'User'}!</h1>
                <div className="flex flex-col gap-2">
                  <p className="text-[#292923]/80 flex items-center gap-2.5 text-sm"><Mail size={16} className="text-[#829078]" /> {user.email}</p>
                  {phone && <p className="text-[#292923]/80 flex items-center gap-2.5 text-sm"><Phone size={16} className="text-[#829078]" /> {phone}</p>}
                  {(address || city || stateValue || zip) ? (
                    <p className="text-[#292923]/80 flex items-start gap-2.5 text-sm mt-1">
                      <MapPin size={16} className="text-[#829078] mt-0.5 shrink-0" /> 
                      <span className="max-w-sm">{address}{address && ','} {city}{city && ','} {stateValue} {zip}</span>
                    </p>
                  ) : (
                    <p className="text-[#829078] text-sm italic mt-1">No address provided</p>
                  )}
                </div>
                <button onClick={() => setIsEditing(true)} className="mt-4 text-sm font-bold text-[#344B38] flex items-center gap-1.5 hover:underline bg-[#E9E9E0] px-3 py-1.5 rounded-xl w-fit">
                  <Edit size={16} /> Edit Details
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full md:w-auto mt-4 md:mt-0 items-start self-start md:self-center">
            {profile?.role === 'admin' && (
              <Link to="/store-control" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#344B38] text-white px-4 py-2.5 md:py-2 rounded-xl font-semibold text-sm hover:bg-[#829078] transition-colors w-full sm:w-auto shadow-sm">
                <Shield size={16} /> Admin Panel
              </Link>
            )}
            <button onClick={() => setShowLogoutConfirm(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 md:py-2 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors w-full sm:w-auto">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5 md:gap-8">
          
          {/* Left Column: Stats & Settings */}
          <div className="flex flex-col gap-5 md:gap-8">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-[#DCC6A8]/60 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#829078]/20 text-[#344B38] rounded-full flex items-center justify-center mb-2 md:mb-3">
                  <Package size={20} className="md:w-6 md:h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#344B38] mb-1">{orders.length > 0 ? orders.length : '0'}</h3>
                <p className="text-xs md:text-sm text-[#829078] font-medium">Orders Found</p>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-[#DCC6A8]/60 shadow-sm flex flex-col items-center justify-center text-center relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#DCC6A8]/40 text-[#344B38] rounded-full flex items-center justify-center mb-2 md:mb-3">
                  <ShoppingCart size={20} className="md:w-6 md:h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#344B38] mb-1">{itemCount}</h3>
                <p className="text-xs md:text-sm text-[#829078] font-medium">Items in Cart</p>
                {itemCount > 0 && (
                  <Link to="/cart" className="absolute inset-0 z-10 rounded-2xl ring-2 ring-transparent hover:ring-[#344B38] transition-all"></Link>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Orders & Activity */}
          <div className="flex flex-col gap-5 md:gap-8">
            
            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#DCC6A8]/60 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 border-b border-[#DCC6A8]/40">
                <h2 className="text-lg md:text-xl font-bold text-[#292923] flex items-center gap-2">
                  <Activity size={20} className="text-[#344B38]" /> Recent Orders
                </h2>
                <Link to="/my-orders" className="text-sm font-semibold text-[#344B38] hover:text-[#829078] hover:underline flex items-center gap-1 transition-colors">
                  View All <ArrowRight size={16} />
                </Link>
              </div>

              {ordersLoading ? (
                <OrderCardSkeleton count={2} />
              ) : orders.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center border-2 border-dashed border-[#DCC6A8] rounded-2xl bg-[#F8F6F1]">
                  <Package size={40} className="text-[#829078] mb-3" />
                  <h3 className="text-lg font-bold text-[#292923] mb-1">No orders yet</h3>
                  <p className="text-[#829078] text-sm mb-4">When you place orders, they will appear here.</p>
                  <Link to="/" className="bg-[#344B38] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#829078] transition-colors shadow-md">Start Shopping</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-border-gray rounded-2xl p-4 md:p-5 hover:border-primary-teal transition-colors group relative bg-gray-50 hover:bg-white">
                      <Link to="/my-orders" className="absolute inset-0 z-10"></Link>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] md:text-xs text-gray-500 font-semibold mb-1">ORDER #{order.id.split('-')[0].toUpperCase()}</p>
                          <p className="text-xs md:text-sm font-bold text-gray-900">₹{Number(order.total_amount).toFixed(2)} • {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${getStatusColor(order.order_status)}`}>
                          {order.order_status}
                        </span>
                      </div>
                      
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {order.order_items.map(item => (
                           <div key={item.id} className="flex-shrink-0 relative w-16 h-16 rounded-xl border border-border-gray bg-white overflow-hidden" title={item.product?.name}>
                             <img src={item.product?.image_url ? item.product.image_url.split(',')[0] : 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                             {item.quantity > 1 && (
                               <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-xl">
                                 x{item.quantity}
                               </div>
                             )}
                           </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Current Cart Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-border-gray p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-gray">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingCart size={20} className="text-gray-900 font-bold" /> Currently in Cart
                </h2>
                <Link to="/cart" className="text-sm font-semibold text-gray-900 font-bold hover:underline flex items-center gap-1">
                  Go to Cart <ArrowRight size={16} />
                </Link>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-2xl border border-border-gray">
                  Your cart is empty.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {cartItems.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border border-border-gray rounded-xl bg-white relative hover:border-primary-teal transition-colors">
                      <Link to="/cart" className="absolute inset-0 z-10"></Link>
                      <img src={item.image_url ? item.image_url.split(',')[0] : 'https://via.placeholder.com/100'} alt="" className="w-14 h-14 object-cover rounded-xl border border-border-gray" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right font-bold text-gray-900 text-sm relative z-20"> ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <div className="text-center mt-2">
                      <Link to="/cart" className="text-sm font-medium text-gray-500 hover:text-gray-900 font-bold">
                        + {cartItems.length - 3} more items in cart
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-[300px] md:max-w-sm w-full p-5 md:p-6 animate-in fade-in zoom-in-95 duration-200">
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
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white font-bold py-2 md:py-2.5 text-sm md:text-base rounded-xl hover:bg-red-700 transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
