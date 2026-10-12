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
        <div className="bg-white rounded-xl md:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 md:p-8 sticky top-24 z-10">
          <div 
            className="flex items-center justify-between cursor-pointer md:cursor-default mb-0 md:mb-6 pb-0 md:pb-5 md:border-b border-gray-100"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary-teal/10 rounded-xl text-gray-900 font-bold">
                <Filter size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">Refine Search</h2>
            </div>
            {/* Mobile Toggle Icon */}
            <div className="md:hidden text-gray-900 font-bold p-1.5 bg-primary-teal/5 rounded-xl transition-colors hover:bg-primary-teal/10">
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
                className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-primary-teal focus:ring-4 focus:ring-primary-teal/10 text-sm font-semibold transition-all text-gray-800 placeholder:text-gray-400 placeholder:font-medium"
              />
              <Search size={18} className="absolute left-4 top-[12px] md:top-[14px] text-gray-400 group-focus-within:text-gray-900 font-bold transition-colors" />
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4 ml-1">Categories</h3>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={() => handleCategoryClick('all')}
                  className={`w-full text-left py-2.5 md:py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-between group ${categoryFilter === 'all' ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <span>All Products</span>
                </button>
              </li>
              {categories.map(c => (
                <li key={c.id}>
                  <button 
                    onClick={() => handleCategoryClick(c.id)}
                    className={`w-full text-left py-2.5 md:py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-between group ${categoryFilter === c.id ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
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
        <h1 className="text-3xl font-bold text-gray-900 font-bold mb-2">Shop Our Collection</h1>
        <p className="text-gray-500 mb-8">Browse the best quality products for you.</p>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-20 text-center text-gray-500 bg-white border border-border-gray rounded-xl">
                No products found matching your criteria.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="group border border-border-gray rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col">
                  <Link to={`/product/${product.id}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url.split(',')[0]} alt={product.name} className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </Link>
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 hover:text-gray-900 font-bold mb-1 line-clamp-1">{product.name}</h3>
                    </Link>
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">{product.category?.name || 'Uncategorized'}</p>
                    <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <span className="font-bold text-base sm:text-lg text-gray-900 font-bold">₹{Number(product.price).toFixed(2)}</span>
                      {cartItems.some(item => item.id === product.id) ? (
                        <Link 
                          to="/cart"
                          className="bg-primary-teal text-gray-900 text-[10px] sm:text-sm font-bold px-2 sm:px-3 py-1.5 rounded-xl hover:opacity-90 transition-opacity text-center w-full sm:w-auto"
                        >
                          Go to Cart
                        </Link>
                      ) : product.stock > 0 ? (
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-accent-orange text-gray-900 text-[10px] sm:text-sm font-bold px-2 sm:px-3 py-1.5 rounded-xl hover:opacity-90 transition-opacity w-full sm:w-auto"
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
