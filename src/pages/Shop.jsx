import React, { useEffect, useState } from 'react';
import { ProductGridSkeleton } from '../components/Skeletons';
import { supabase } from '../lib/supabase';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(urlSearch);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*, category:categories(name)').order('created_at', { ascending: false });
    
    if (categoryFilter !== 'all') {
      query = query.eq('category_id', categoryFilter);
    }
    
    const { data } = await query;
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('search', val);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleCategoryClick = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    setSearchParams(params);
    // Close mobile filters after selecting category
    setShowFiltersMobile(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 min-h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 md:gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-72 shrink-0">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#DCC6A8]/60 p-5 md:p-8 sticky top-24 z-10">
          <div 
            className="flex items-center justify-between cursor-pointer md:cursor-default mb-0 md:mb-6 pb-0 md:pb-5 md:border-b border-gray-100"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#829078]/20 rounded-xl text-[#344B38]">
                <Filter size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[#292923] tracking-tight">Refine Search</h2>
            </div>
            {/* Mobile Toggle Icon */}
            <div className="md:hidden text-[#344B38] p-1.5 bg-[#E9E9E0] rounded-xl transition-colors hover:bg-[#DCC6A8]/50">
              {showFiltersMobile ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
          
          <div className={`${showFiltersMobile ? 'block mt-6' : 'hidden'} md:block`}>
            <div className="mb-6 md:mb-8 relative group">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-[#F8F6F1] border border-[#DCC6A8]/60 rounded-xl outline-none focus:bg-white focus:border-[#344B38] focus:ring-4 focus:ring-[#344B38]/10 text-sm font-semibold transition-all text-[#292923] placeholder:text-[#829078]"
              />
              <Search size={18} className="absolute left-4 top-[12px] md:top-[14px] text-[#829078] group-focus-within:text-[#344B38] transition-colors" />
            </div>

            <h3 className="text-xs font-bold text-[#829078] uppercase tracking-widest mb-3 md:mb-4 ml-1">Categories</h3>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={() => handleCategoryClick('all')}
                  className={`w-full text-left py-2.5 md:py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-between group ${categoryFilter === 'all' ? 'bg-[#344B38] text-white shadow-md shadow-[#344B38]/20' : 'text-[#292923] hover:bg-[#E9E9E0] hover:text-[#344B38]'}`}
                >
                  <span>All Products</span>
                </button>
              </li>
              {categories.map(c => (
                <li key={c.id}>
                  <button 
                    onClick={() => handleCategoryClick(c.id)}
                    className={`w-full text-left py-2.5 md:py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-between group ${categoryFilter === c.id ? 'bg-[#344B38] text-white shadow-md shadow-[#344B38]/20' : 'text-[#292923] hover:bg-[#E9E9E0] hover:text-[#344B38]'}`}
                  >
                    <span className="capitalize">{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <h1 className="text-3xl font-bold text-[#292923] mb-2">Shop Our Collection</h1>
        <p className="text-[#829078] mb-8 font-medium">Browse the best quality products for you.</p>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-20 text-center text-[#829078] bg-white border border-[#DCC6A8] rounded-2xl">
                No products found matching your criteria.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="group border border-[#DCC6A8]/60 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col">
                  <Link to={`/product/${product.id}`} className="block relative aspect-square bg-[#F8F6F1] overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url.split(',')[0]} alt={product.name} className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </Link>
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-sm sm:text-base text-[#292923] hover:text-[#344B38] mb-1 line-clamp-1">{product.name}</h3>
                    </Link>
                    <p className="text-[10px] sm:text-xs text-[#829078] mb-2 sm:mb-3">{product.category?.name || 'Uncategorized'}</p>
                    <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <span className="font-bold text-base sm:text-lg text-[#344B38]">₹{Number(product.price).toFixed(2)}</span>
                      {cartItems.some(item => item.id === product.id) ? (
                        <Link 
                          to="/cart"
                          className="bg-[#829078] text-white text-[10px] sm:text-sm font-bold px-2 sm:px-3 py-1.5 rounded-xl hover:bg-[#344B38] transition-colors text-center w-full sm:w-auto"
                        >
                          Go to Cart
                        </Link>
                      ) : product.stock > 0 ? (
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-[#344B38] text-white text-[10px] sm:text-sm font-bold px-2 sm:px-3 py-1.5 rounded-xl hover:bg-[#829078] transition-colors w-full sm:w-auto shadow-sm"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <span className="text-red-500 text-[10px] sm:text-sm font-bold px-2 sm:px-3 py-1.5 bg-red-50 rounded-xl border border-red-100 w-full sm:w-auto text-center">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
