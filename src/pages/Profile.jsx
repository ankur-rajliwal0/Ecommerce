import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { OrderCardSkeleton } from '../components/Skeletons';
import { User, Mail, Shield, Save, Package, ShoppingBag, ArrowRight, Activity, LogOut, Phone, MapPin, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

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
      toast.success('Patron folio updated successfully');
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

  if (!user) {
    return (
      <div className="w-full bg-[#c4c3b6] min-h-[calc(100vh-80px)] py-20 px-4 text-center font-helvetica text-sm text-[#595855]">
        Please sign in to view your collector folio.
      </div>
    );
  }

  return (
    <div className="w-full bg-[#c4c3b6] min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 font-helvetica text-[#000000]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section (Bone #e7e5e4, 9px radius, hairline border) */}
        <div className="bg-[#e7e5e4] rounded-[9px] border border-[#dfdcd5] p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto">
            {/* Monogram Avatar */}
            <div className="w-16 h-16 rounded-full border-[1.5px] border-[#000000] bg-[#c4c3b6] flex items-center justify-center font-davinci text-2xl font-medium text-[#000000] shrink-0">
              {fullName ? fullName.charAt(0).toUpperCase() : 'V'}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-3 w-full max-w-md bg-[#ffffff] p-5 rounded-[9px] border border-[#dfdcd5]">
                <span className="text-[10px] uppercase tracking-wider text-[#595855]">Edit Collector Folio</span>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 text-xs border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] bg-[#ffffff] text-[#000000]" placeholder="Full Legal Name" />
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 text-xs border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] bg-[#ffffff] text-[#000000]" placeholder="Contact Phone" />
                
                <input type="text" value={zip} onChange={handlePincodeChange} className="w-full px-3 py-2 text-xs border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] bg-[#ffffff] text-[#000000]" placeholder="6-Digit PIN Code" />
                
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 text-xs border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] bg-[#ffffff] text-[#000000]" placeholder="City" />
                  <input type="text" value={stateValue} onChange={(e) => setStateValue(e.target.value)} className="w-full px-3 py-2 text-xs border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] bg-[#ffffff] text-[#000000]" placeholder="State" />
                </div>
                
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 text-xs border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] bg-[#ffffff] text-[#000000]" placeholder="Street Address, House No" />
                <div className="flex gap-2 mt-2">
                  <button type="submit" disabled={loading} className="btn-pill-action flex-1 py-2 text-xs">
                    {loading ? 'Preserving...' : 'Save Folio'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-[#dfdcd5] text-xs text-[#000000] rounded-[28.8px] hover:bg-[#dfdcd5]/60 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-1">
                  PATRON IDENTITY
                </span>
                <h1 className="font-davinci text-2xl md:text-3xl font-medium text-[#000000] mb-2">
                  {fullName || 'Honored Collector'}
                </h1>
                <div className="flex flex-col gap-1 text-xs text-[#595855]">
                  <p className="flex items-center gap-2"><Mail size={13} /> {user.email}</p>
                  {phone && <p className="flex items-center gap-2"><Phone size={13} /> {phone}</p>}
                  {(address || city || stateValue || zip) ? (
                    <p className="flex items-start gap-2 mt-0.5">
                      <MapPin size={13} className="mt-0.5 shrink-0" /> 
                      <span className="max-w-sm">{address}{address && ','} {city}{city && ','} {stateValue} {zip}</span>
                    </p>
                  ) : (
                    <p className="text-[#808080] italic mt-0.5">No dispatch address recorded</p>
                  )}
                </div>
                <button onClick={() => setIsEditing(true)} className="mt-3 text-xs text-[#000000] flex items-center gap-1.5 hover:underline font-medium">
                  <Edit size={12} /> Edit Folio Credentials
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto self-start md:self-center">
            {profile?.role === 'admin' && (
              <Link to="/store-control" className="btn-pill-action py-2 px-4 text-xs">
                <Shield size={12} />
                <span>Store Control</span>
              </Link>
            )}
            <button 
              onClick={() => setShowLogoutConfirm(true)} 
              className="px-3.5 py-1.5 rounded-[28.8px] border border-[#dfdcd5] text-xs text-red-800 hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 2-Column Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          
          {/* Left: Quick Stats */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#e7e5e4] p-5 rounded-[9px] border border-[#dfdcd5] text-center">
                <span className="text-[10px] uppercase tracking-wider text-[#595855] block mb-1">Acquisitions</span>
                <h3 className="font-davinci text-3xl font-medium text-[#000000]">{orders.length}</h3>
              </div>
              <div className="bg-[#e7e5e4] p-5 rounded-[9px] border border-[#dfdcd5] text-center">
                <span className="text-[10px] uppercase tracking-wider text-[#595855] block mb-1">In Current Bag</span>
                <h3 className="font-davinci text-3xl font-medium text-[#000000]">{itemCount}</h3>
              </div>
            </div>

            <div className="bg-[#e7e5e4] p-5 rounded-[9px] border border-[#dfdcd5]">
              <span className="text-[10px] uppercase tracking-widest text-[#595855] block mb-2 font-mono">
                MEMBERSHIP TIER
              </span>
              <h4 className="font-davinci text-xl font-medium text-[#000000] mb-1">Patron of the Arts</h4>
              <p className="text-xs text-[#595855] leading-relaxed">
                Enjoy priority access to limited seasonal botanical releases and wax-sealed calligraphy card upgrades.
              </p>
            </div>
          </div>

          {/* Right: Recent Acquisitions */}
          <div className="bg-[#e7e5e4] rounded-[9px] border border-[#dfdcd5] p-6">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#dfdcd5]">
              <h2 className="font-davinci text-2xl font-medium text-[#000000]">
                Recent Folio Activity
              </h2>
              <Link to="/my-orders" className="ghost-link text-xs uppercase tracking-wider flex items-center gap-1">
                All Orders <ArrowRight size={12} />
              </Link>
            </div>

            {ordersLoading ? (
              <OrderCardSkeleton count={2} />
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#595855]">
                No recent acquisitions recorded in this folio.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[#ffffff] border border-[#dfdcd5] rounded-[9px] p-4">
                    <div className="flex justify-between items-start mb-3 text-xs">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#595855]">Order #{String(order?.id || '').split('-')[0].toUpperCase()}</p>
                        <p className="font-medium text-[#000000]">₹{Number(order.total_amount || 0).toFixed(2)} • {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-[28.8px] text-[10px] uppercase tracking-wider border border-[#dfdcd5] bg-[#e7e5e4] text-[#000000]">
                        {order.order_status}
                      </span>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {order.order_items.map(item => (
                        <div key={item.id} className="relative w-14 h-14 rounded-[9px] border border-[#dfdcd5] overflow-hidden bg-[#c4c3b6] shrink-0" title={item.product?.name}>
                          <img src={item.product?.image_url ? item.product.image_url.split(',')[0] : '/favicon.png'} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-[#000000]/60 z-[100] flex items-center justify-center p-4 backdrop-blur-xs font-helvetica">
          <div className="bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="font-davinci text-2xl font-medium text-[#000000] mb-2">Confirm Sign Out</h3>
            <p className="text-xs text-[#595855] mb-6">Are you sure you wish to conclude your session at the Salon?</p>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-[28.8px] border border-[#dfdcd5] text-xs text-[#000000] hover:bg-[#dfdcd5]/60 transition-colors"
              >
                Remain
              </button>
              <button 
                onClick={handleLogout}
                className="btn-pill-action flex-1 py-2 text-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
