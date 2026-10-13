import React, { useEffect, useState } from 'react';
import { OrderCardSkeleton } from '../components/Skeletons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
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
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-[calc(100vh-140px)]">
      <h1 className="text-3xl font-bold text-gray-900 font-bold mb-8">My Orders</h1>
      
      {loading ? (
        <div className="mt-8"><OrderCardSkeleton count={3} /></div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-[#DCC6A8] p-10 rounded-2xl text-center shadow-sm">
          <Package size={48} className="mx-auto text-[#829078] mb-4" />
          <h2 className="text-xl font-bold text-[#292923] mb-2">No orders found</h2>
          <p className="text-[#829078] mb-6 font-medium">Looks like you haven't placed any orders yet.</p>
          <Link to="/" className="bg-[#344B38] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#829078] transition-colors shadow-md">Start Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-[#DCC6A8]/60 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#F8F6F1] px-6 py-4 border-b border-[#DCC6A8]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-8">
                  <div>
                    <p className="text-xs text-[#829078] font-semibold uppercase mb-1">Order Placed</p>
                    <p className="text-sm text-[#292923]">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#829078] font-semibold uppercase mb-1">Total</p>
                    <p className="text-sm text-[#344B38] font-bold">₹{Number(order.total_amount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#829078] font-semibold uppercase mb-1">Order ID</p>
                    <p className="text-sm text-[#292923]">#{order.id.split('-')[0]}</p>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col gap-6">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img 
                        src={item.product?.image_url ? item.product.image_url.split(',')[0] : 'https://via.placeholder.com/100'} 
                        alt={item.product?.name || 'Product'} 
                        className="w-20 h-20 object-cover border border-[#DCC6A8]/50 rounded-xl bg-[#F8F6F1]"
                      />
                      <div className="flex-1">
                        <Link to={`/product/${item.product_id}`} className="font-semibold text-[#292923] hover:text-[#344B38] line-clamp-1 mb-1 transition-colors">
                          {item.product?.name || 'Unknown Product'}
                        </Link>
                        <p className="text-sm text-[#829078] mb-1">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-[#344B38]">₹{Number(item.price).toFixed(2)}</p>
                      </div>
                      <div className="hidden sm:block text-right">
                        <Link to={`/product/${item.product_id}`} className="text-sm text-[#344B38] font-bold hover:bg-[#E9E9E0] border border-[#344B38] rounded-xl px-4 py-1.5 transition-colors">
                          View Item
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
