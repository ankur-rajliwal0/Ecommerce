import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tags, Package, ShoppingCart, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (route) => {
    if (route === '/store-control' && path === '/store-control') return true;
    if (route !== '/store-control' && path.includes(route)) return true;
    return false;
  };
  return (
    <div className="bg-[#F8F6F1] min-h-screen flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Minimal & Professional Dark Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-[70] w-[260px] h-screen bg-[#292923] text-gray-300 flex-shrink-0 border-r border-[#344B38]/30 flex flex-col selection:bg-[#344B38]/50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-[#DCC6A8] rounded-xl flex items-center justify-center">
              <span className="font-extrabold text-[#292923] text-sm">A</span>
            </div>
            <h2 className="text-lg font-bold text-[#F8F6F1] tracking-tight">Admin<span className="text-[#829078]">Pro</span></h2>
          </div>
          
          <nav className="space-y-1">
            <Link onClick={() => setIsSidebarOpen(false)} to="/store-control" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${isActive('/store-control') ? 'bg-[#344B38] text-white shadow-sm' : 'hover:bg-white/10 hover:text-white'}`}>
              <LayoutDashboard size={18} className={isActive('/store-control') ? 'text-white' : 'text-[#829078]'} /> 
              Overview
            </Link>
            <Link onClick={() => setIsSidebarOpen(false)} to="/store-control/orders" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${isActive('/store-control/orders') ? 'bg-[#344B38] text-white shadow-sm' : 'hover:bg-white/10 hover:text-white'}`}>
              <ShoppingCart size={18} className={isActive('/store-control/orders') ? 'text-white' : 'text-[#829078]'} /> 
              Orders
            </Link>
            <Link onClick={() => setIsSidebarOpen(false)} to="/store-control/products" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${isActive('/store-control/products') ? 'bg-[#344B38] text-white shadow-sm' : 'hover:bg-white/10 hover:text-white'}`}>
              <Package size={18} className={isActive('/store-control/products') ? 'text-white' : 'text-[#829078]'} /> 
              Products
            </Link>
            <Link onClick={() => setIsSidebarOpen(false)} to="/store-control/categories" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${isActive('/store-control/categories') ? 'bg-[#344B38] text-white shadow-sm' : 'hover:bg-white/10 hover:text-white'}`}>
              <Tags size={18} className={isActive('/store-control/categories') ? 'text-white' : 'text-[#829078]'} /> 
              Categories
            </Link>
            <Link onClick={() => setIsSidebarOpen(false)} to="/store-control/users" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${isActive('/store-control/users') ? 'bg-[#344B38] text-white shadow-sm' : 'hover:bg-white/10 hover:text-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isActive('/store-control/users') ? 'text-white' : 'text-[#829078]'}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> 
              Users
            </Link>
          </nav>
        </div>
        
        {/* Bottom User Area */}
        <div className="mt-auto p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#344B38] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#F8F6F1]">Admin</p>
              <p className="text-xs text-[#829078]">View Store</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen w-full">
        {/* Top Header */}
        <header className="bg-white border-b border-[#DCC6A8] h-16 sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-[#292923] hover:bg-[#E9E9E0] rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-[#292923]">Dashboard Panel</h1>
          </div>
          <Link to="/" className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-[#344B38] text-white text-xs md:text-sm font-bold rounded-xl hover:bg-[#829078] shadow-sm transition-colors">
            Go to Store
          </Link>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 p-4 md:p-8 bg-[#F8F6F1] w-full overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
