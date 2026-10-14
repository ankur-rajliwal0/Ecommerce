import React, { useEffect, useState } from 'react';
import { OrderCardSkeleton } from '../components/Skeletons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';

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

  const getStatusBadge = (status) => {
    const s = (status || 'Recorded').toUpperCase();
    return (
      <span className="px-2.5 py-0.5 rounded-[28.8px] text-[10px] font-helvetica font-medium uppercase tracking-wider border border-[#dfdcd5] bg-[#ffffff] text-[#000000]">
        {s}
      </span>
    );
  };

  return (
    <div className="w-full bg-[#c4c3b6] min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6 font-helvetica text-[#000000]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 border-b border-[#dfdcd5] pb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-1">
            CLIENT ARCHIVE
          </span>
          <h1 className="font-davinci text-3xl sm:text-4xl font-medium text-[#000000]">
            Acquisition History
          </h1>
        </div>
        
        {loading ? (
          <div className="mt-8"><OrderCardSkeleton count={3} /></div>
        ) : orders.length === 0 ? (
          <div className="bg-[#e7e5e4] border border-[#dfdcd5] p-10 rounded-[9px] text-center max-w-lg mx-auto">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-2">
              NO ACQUISITIONS FOUND
            </span>
            <h2 className="font-davinci text-2xl font-medium text-[#000000] mb-2">Folio History Empty</h2>
            <p className="text-xs text-[#595855] mb-6 font-helvetica">You have not completed any acquisitions from our collections yet.</p>
            <Link to="/products" className="btn-pill-action py-3 px-6 text-xs uppercase tracking-wider">
              <span>Explore Collection</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] overflow-hidden">
                {/* Order Top Ribbon */}
                <div className="bg-[#dfdcd5]/40 px-6 py-3.5 border-b border-[#dfdcd5] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-8 text-xs">
                    <div>
                      <p className="text-[10px] text-[#595855] uppercase tracking-wider mb-0.5">Recorded On</p>
                      <p className="text-xs font-medium text-[#000000]">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#595855] uppercase tracking-wider mb-0.5">Valuation</p>
                      <p className="text-xs font-medium text-[#000000]">₹{Number(order.total_amount || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#595855] uppercase tracking-wider mb-0.5">Folio Number</p>
                      <p className="text-xs font-medium text-[#000000]">#{String(order?.id || '').split('-')[0].toUpperCase()}</p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(order.order_status)}
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="p-6">
                  <div className="flex flex-col gap-5">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 border-b border-[#dfdcd5]/60 pb-4 last:border-0 last:pb-0">
                        <img 
                          src={item.product?.image_url ? item.product.image_url.split(',')[0] : '/favicon.png'} 
                          alt={item.product?.name || 'Product'} 
                          className="w-16 h-16 object-cover border border-[#dfdcd5] rounded-[9px] bg-[#c4c3b6]"
                        />
                        <div className="flex-1">
                          <Link to={`/product/${item.product_id}`} className="font-davinci text-lg font-medium text-[#000000] hover:underline line-clamp-1">
                            {item.product?.name || 'Curated Piece'}
                          </Link>
                          <p className="text-xs text-[#595855] mt-0.5">Quantity: {item.quantity}</p>
                          <p className="text-xs font-medium text-[#000000]">₹{Number(item.price || 0).toFixed(2)}</p>
                        </div>
                        <div className="hidden sm:block text-right">
                          <Link to={`/product/${item.product_id}`} className="btn-pill-action py-1.5 px-3.5 text-[11px]">
                            Inspect Item
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
    </div>
  );
};

export default MyOrders;
