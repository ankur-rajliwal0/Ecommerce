import React, { useEffect, useState } from 'react';
import { TableSkeleton } from '../../components/Skeletons';
import { supabase } from '../../lib/supabase';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Products count
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      
      // Orders and Revenue
      const { data: orders } = await supabase.from('orders').select('id, total_amount, order_status, created_at').order('created_at', { ascending: false });
      
      let revenue = 0;
      if (orders) {
        revenue = orders.reduce((sum, order) => {
          if (order.order_status !== 'cancelled') return sum + Number(order.total_amount);
          return sum;
        }, 0);
        setRecentOrders(orders.slice(0, 5));
      }

      setStats({
        revenue: revenue,
        orders: orders ? orders.length : 0,
        products: productCount || 0
      });

    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const StatCard = ({ title, value, icon, trend, gradientFrom, gradientTo, delayClass }) => (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientTo} p-6 rounded-2xl shadow-lg group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:scale-[1.03] transition-all duration-500 text-white animate-in fade-in zoom-in-95 slide-in-from-bottom-8 ${delayClass} fill-mode-both`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-[1.8] group-hover:opacity-20 duration-700 ease-out"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-5 rounded-full -ml-8 -mb-8 transition-transform group-hover:scale-150 duration-700 ease-out"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="text-white/90 font-bold mb-1 tracking-wider uppercase text-xs">{title}</p>
          <h3 className="text-4xl font-black tracking-tight drop-shadow-sm">{value}</h3>
        </div>
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white shadow-inner group-hover:bg-white/30 transition-colors duration-300">
          <div className="transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-sm font-bold text-white/95 bg-black/15 w-fit px-3 py-1.5 rounded-full relative z-10 backdrop-blur-sm group-hover:bg-black/25 transition-colors duration-300">
        <TrendingUp size={14} className="group-hover:animate-bounce" /> {trend}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#292923] tracking-tight">Dashboard Overview</h2>
          <p className="text-[#829078] mt-2">Here's what's happening with your store today.</p>
        </div>
      </div>
      
      {loading ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-[#DCC6A8] shadow-sm flex flex-col gap-4">
                <div className="h-4 skeleton-shimmer rounded-md w-28"></div>
                <div className="h-8 skeleton-shimmer rounded-md w-36"></div>
                <div className="h-4 skeleton-shimmer rounded-md w-20"></div>
              </div>
            ))}
          </div>
          <TableSkeleton rows={4} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard 
              title="Total Revenue" 
              value={`₹${stats.revenue.toFixed(2)}`} 
              icon={<DollarSign size={28} />} 
              gradientFrom="from-[#344B38]"
              gradientTo="to-[#202f23]"
              trend="+12% from last month"
              delayClass="delay-[0ms]"
            />
            <StatCard 
              title="Total Orders" 
              value={stats.orders} 
              icon={<ShoppingBag size={28} />} 
              gradientFrom="from-[#829078]"
              gradientTo="to-[#5e6a56]"
              trend="+5% from last month"
              delayClass="delay-[150ms]"
            />
            <StatCard 
              title="Active Products" 
              value={stats.products} 
              icon={<Package size={28} />} 
              gradientFrom="from-[#292923]"
              gradientTo="to-[#181814]"
              trend="Inventory looks good"
              delayClass="delay-[300ms]"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#DCC6A8] overflow-hidden">
            <div className="px-8 py-6 border-b border-[#E9E9E0] flex justify-between items-center bg-white">
              <h3 className="font-bold text-[#292923] text-lg">Recent Transactions</h3>
              <Link to="/store-control/orders" className="text-sm font-semibold text-[#344B38] hover:text-[#292923] transition-colors bg-[#E9E9E0] px-4 py-2 rounded-xl">View All Orders</Link>
            </div>
            
            {recentOrders.length === 0 ? (
              <div className="p-12 text-center text-[#829078] bg-[#F8F6F1]/50">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-40 text-[#829078]" />
                <p>No recent orders found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-extrabold text-[#292923]/60 uppercase tracking-widest border-b border-[#E9E9E0] bg-[#E9E9E0]/40">
                      <th className="px-4 md:px-8 py-5">Order ID</th>
                      <th className="px-4 md:px-8 py-5">Date</th>
                      <th className="px-4 md:px-8 py-5">Status</th>
                      <th className="px-4 md:px-8 py-5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E9E0]">
                    {recentOrders.map((order, idx) => (
                      <tr 
                        key={order.id} 
                        className="hover:bg-[#F8F6F1] hover:scale-[1.01] hover:shadow-lg relative hover:z-10 transition-all duration-300 group cursor-pointer"
                        style={{ animationDelay: `${idx * 100 + 400}ms` }}
                      >
                        <td className="px-4 md:px-8 py-5 text-sm font-bold text-[#292923] group-hover:text-[#344B38] transition-colors md:rounded-l-xl whitespace-nowrap">
                          #{order.id.split('-')[0].toUpperCase()}
                        </td>
                        <td className="px-4 md:px-8 py-5 text-sm text-[#829078] font-medium group-hover:text-[#292923] transition-colors whitespace-nowrap">
                          {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-4 md:px-8 py-5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-110
                            ${order.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 
                              order.order_status === 'shipped' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 
                              order.order_status === 'cancelled' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 
                              'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                            {order.order_status}
                          </span>
                        </td>
                        <td className="px-4 md:px-8 py-5 text-sm font-black text-[#344B38] text-right md:rounded-r-xl transition-colors whitespace-nowrap">
                          ₹{Number(order.total_amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
