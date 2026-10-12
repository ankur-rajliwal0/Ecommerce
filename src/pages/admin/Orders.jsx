import React, { useEffect, useState } from 'react';
import { TableSkeleton } from '../../components/Skeletons';
import { supabase } from '../../lib/supabase';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrdersAndProfiles();
  }, []);

  const fetchOrdersAndProfiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (ordersError) throw ordersError;
        
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name');
        
      if (profilesError) throw profilesError;
        
      const profileMap = {};
      if (profilesData) {
        profilesData.forEach(p => {
          profileMap[p.id] = p.full_name;
        });
      }

      if (ordersData) {
        setOrders(ordersData);
      }
      setProfiles(profileMap);
    } catch (err) {
      console.error("Error fetching orders data:", err);
      setError(err.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }
    
    setExpandedOrder(orderId);
    
    if (!orderItems[orderId]) {
      const { data } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(name, image_url)
        `)
        .eq('order_id', orderId);
        
      if (data) {
        setOrderItems(prev => ({ ...prev, [orderId]: data }));
      }
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ order_status: newStatus })
      .eq('id', orderId);
      
    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
    } else {
      toast.error('Failed to update status: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => (o.order_status || 'pending').toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Orders</h2>
          <p className="text-gray-500 mt-1">View and manage customer orders.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-200 ${
                filterStatus === status 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-8 p-5 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl text-rose-700 shadow-sm">
          <p className="font-bold">Error loading orders:</p>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-gray-400 animate-pulse flex flex-col items-center">
           <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p>Loading orders...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">No {filterStatus !== 'all' ? filterStatus : ''} orders found.</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                
                <div 
                  onClick={() => toggleOrder(order.id)}
                  className="bg-white px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer relative"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-gray-200 to-transparent group-hover:via-primary-teal transition-colors"></div>
                  
                  <div className="flex flex-wrap gap-10 items-center flex-1">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1.5">Order ID</p>
                      <p className="text-base font-black text-gray-900">#{order.id.split('-')[0].toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1.5">Customer</p>
                      <p className="text-sm font-semibold text-gray-700">{order.customer_name || profiles[order.user_id] || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1.5">Date</p>
                      <p className="text-sm font-semibold text-gray-700">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1.5">Total</p>
                      <p className="text-base font-black text-gray-900 font-bold">₹{Number(order.total_amount).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      <select 
                        value={order.order_status || 'pending'}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`appearance-none text-xs font-black uppercase tracking-widest outline-none rounded-full px-4 py-2 pr-8 border border-transparent shadow-sm cursor-pointer transition-colors ${getStatusColor(order.order_status || 'pending')}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-teal/10 group-hover:text-gray-900 font-bold transition-colors">
                      <div className={`transform transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-180' : 'rotate-0'}`}>
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`grid transition-all duration-300 ease-in-out ${expandedOrder === order.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="px-8 pb-8 pt-4 bg-gray-50/50 border-t border-gray-100">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                          <h4 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary-teal"></span> Shipping Details
                          </h4>
                          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">{order.address}</p>
                          </div>
                        </div>

                        <div className="lg:col-span-2">
                          <h4 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent-orange"></span> Items Ordered
                          </h4>
                          
                          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {!orderItems[order.id] ? (
                              <div className="p-8 text-center text-gray-400">Loading items...</div>
                            ) : (
                              <div className="divide-y divide-gray-100">
                                {orderItems[order.id].map(item => (
                                  <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                      <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                                        <img 
                                          src={item.product?.image_url ? item.product.image_url.split(',')[0] : 'https://via.placeholder.com/60'} 
                                          alt={item.product?.name} 
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-gray-900 mb-0.5">{item.product_name || item.product?.name || 'Unknown Product'}</p>
                                        <p className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-xl inline-block">Qty: {item.quantity}</p>
                                      </div>
                                    </div>
                                    <p className="text-base font-black text-gray-900">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
