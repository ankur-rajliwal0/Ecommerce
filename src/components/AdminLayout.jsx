import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tags, Package, ShoppingCart, Menu, X, ArrowLeft } from 'lucide-react';

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
    <div className="bg-[#c4c3b6] min-h-screen flex font-helvetica text-[#000000]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#000000]/60 z-[60] md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Minimal & Professional Ink Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-[70] w-[250px] h-screen bg-[#000000] text-[#808080] flex-shrink-0 border-r border-[#333333] flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full border border-[#ffffff] flex items-center justify-center font-davinci text-base font-medium text-[#ffffff]">
              V
            </div>
            <div>
              <span className="font-davinci text-xl text-[#ffffff] font-medium tracking-tight">Veltrix</span>
              <span className="text-[9px] uppercase tracking-widest text-[#808080] block font-mono">CURATORIAL CTRL</span>
            </div>
          </div>
          
          <nav className="space-y-1 text-xs">
            <Link onClick={() => setIsSidebarOpen(false)} to="/store-control" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[9px] transition-colors font-medium ${isActive('/store-control') ? 'bg-[#1f1f1d] text-[#ffffff] border border-[#333333]' : 'hover:bg-[#1a1a1a] hover:text-[#ffffff]'}`}>
              <LayoutDashboard size={15} /> 
              Overview
            </Link>
            <Link onClick={() => setIsSidebarOpen(false)} to="/store-control/orders" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[9px] transition-colors font-medium ${isActive('/store-control/orders') ? 'bg-[#1f1f1d] text-[#ffffff] border border-[#333333]' : 'hover:bg-[#1a1a1a] hover:text-[#ffffff]'}`}>
              <ShoppingCart size={15} /> 
              Commissions & Orders
            </Link>
            <Link onClick={() => setIsSidebarOpen(false)} to="/store-control/products" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[9px] transition-colors font-medium ${isActive('/store-control/products') ? 'bg-[#1f1f1d] text-[#ffffff] border border-[#333333]' : 'hover:bg-[#1a1a1a] hover:text-[#ffffff]'}`}>
              <Package size={15} /> 
              Catalog & Archive
            </Link>
            <Link onClick={() => setIsSidebarOpen(false)} to="/store-control/categories" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[9px] transition-colors font-medium ${isActive('/store-control/categories') ? 'bg-[#1f1f1d] text-[#ffffff] border border-[#333333]' : 'hover:bg-[#1a1a1a] hover:text-[#ffffff]'}`}>
              <Tags size={15} /> 
              Disciplines & Categories
            </Link>
            <Link onClick={() => setIsSidebarOpen(false)} to="/store-control/users" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[9px] transition-colors font-medium ${isActive('/store-control/users') ? 'bg-[#1f1f1d] text-[#ffffff] border border-[#333333]' : 'hover:bg-[#1a1a1a] hover:text-[#ffffff]'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> 
              Patrons & Accounts
            </Link>
          </nav>
        </div>
        
        {/* Bottom User Area */}
        <div className="mt-auto p-4 border-t border-[#333333]">
          <Link to="/" className="flex items-center gap-2 p-2 rounded-[9px] hover:bg-[#1a1a1a] transition-colors text-xs text-[#808080] hover:text-[#ffffff]">
            <ArrowLeft size={13} />
            <span>Return to Public Gallery</span>
          </Link>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen w-full bg-[#c4c3b6]">
        {/* Top Header */}
        <header className="bg-[#e7e5e4] border-b border-[#dfdcd5] h-14 sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1 text-[#000000] hover:bg-[#dfdcd5] rounded-[9px] transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-davinci text-xl font-medium text-[#000000]">Curatorial Management</h1>
          </div>
          <Link to="/" className="btn-pill-action py-1.5 px-4 text-xs font-normal">
            View Live Store
          </Link>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
