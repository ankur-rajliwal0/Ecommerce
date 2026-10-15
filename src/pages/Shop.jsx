import React, { useEffect, useState } from 'react';
import { ProductGridSkeleton } from '../components/Skeletons';
import { supabase } from '../lib/supabase';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Search, Filter, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { getProductPriceInfo } from '../lib/productUtils';
import toast from 'react-hot-toast';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems, setIsCartOpen } = useCart();
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
    setShowFiltersMobile(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[#c4c3b6] min-h-[calc(100vh-120px)] py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters (Bone #e7e5e4 surface, 9px radius, hairline border) */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] p-5 sticky top-24 z-10 font-helvetica">
            
            <div 
              className="flex items-center justify-between cursor-pointer md:cursor-default mb-0 md:mb-5 pb-0 md:pb-4 md:border-b border-[#dfdcd5]"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            >
              <div className="flex items-center gap-2">
                <Filter size={15} className="text-[#000000]" />
                <h2 className="text-xs uppercase tracking-[0.16em] font-medium text-[#000000]">Filter Archive</h2>
              </div>
              <div className="md:hidden text-[#000000] p-1">
                {showFiltersMobile ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
            
            <div className={`${showFiltersMobile ? 'block mt-5' : 'hidden'} md:block`}>
              {/* Search in sidebar */}
              <div className="mb-6 relative">
                <input 
                  type="text" 
                  placeholder="Filter by keyword..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-3 py-2 bg-[#ffffff] border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] text-xs text-[#000000] placeholder:text-[#808080] font-helvetica"
                />
                <Search size={14} className="absolute left-3 top-[10px] text-[#595855]" />
              </div>

              <h3 className="text-[10px] font-medium text-[#595855] uppercase tracking-[0.2em] mb-2.5">
                Categories
              </h3>
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => handleCategoryClick('all')}
                    className={`w-full text-left py-2 px-3 rounded-[28.8px] text-xs font-medium transition-colors flex items-center justify-between ${
                      categoryFilter === 'all' 
                        ? 'bg-[#000000] text-[#ffffff]' 
                        : 'text-[#000000] hover:bg-[#dfdcd5]/60'
                    }`}
                  >
                    <span>All Products</span>
                  </button>
                </li>
                {categories.map(c => (
                  <li key={c.id}>
                    <button 
                      onClick={() => handleCategoryClick(c.id)}
                      className={`w-full text-left py-2 px-3 rounded-[28.8px] text-xs font-medium transition-colors flex items-center justify-between ${
                        categoryFilter === c.id 
                          ? 'bg-[#000000] text-[#ffffff]' 
                          : 'text-[#000000] hover:bg-[#dfdcd5]/60'
                      }`}
                    >
                      <span className="capitalize">{c.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Products Gallery */}
        <main className="flex-1">
          {/* Header */}
          <div className="mb-8 border-b border-[#dfdcd5] pb-5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] font-helvetica block mb-1">
              OUR CATALOG
            </span>
            <h1 className="font-davinci text-3xl sm:text-5xl font-medium tracking-tight text-[#000000]">
              The Permanent Collection
            </h1>
          </div>

          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full py-20 text-center text-[#595855] bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] font-helvetica text-xs">
                  No products found matching your search.
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const priceInfo = getProductPriceInfo(product);
                  const cartItem = product?.id ? cartItems.find(i => i.id === product.id) : null;
                  const inCart = Boolean(cartItem);

                  return (
                    <div 
                      key={product.id} 
                      className="group bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] p-2.5 sm:p-4 flex flex-col justify-between hover:border-[#000000] transition-colors duration-200 overflow-hidden"
                    >
                      {/* Image */}
                      <Link to={`/product/${product.id}`} className="block relative aspect-square bg-[#dfdcd5] rounded-[9px] overflow-hidden mb-3">
                        {priceInfo.discountPercent > 0 && (
                          <span className="absolute top-2 left-2 bg-[#000000] text-[#ffffff] text-[10px] font-helvetica px-2 py-0.5 rounded-[28.8px] uppercase tracking-wider z-10">
                            -{priceInfo.discountPercent}%
                          </span>
                        )}
                        {product.image_url ? (
                          <img 
                            src={product.image_url.split(',')[0]} 
                            alt={product.name} 
                            onError={(e) => { e.target.src = '/favicon.png'; }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-[#808080]">No Image</div>
                        )}
                      </Link>

                      {/* Content */}
                      <div className="flex-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#595855] font-helvetica block mb-0.5">
                          {product.category?.name || 'Artifact'}
                        </span>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-davinci text-base sm:text-xl font-medium text-[#000000] line-clamp-1 hover:underline mb-1.5 leading-snug">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      {/* Price & Action */}
                      <div className="mt-2 pt-2.5 sm:pt-3 border-t border-[#dfdcd5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-baseline flex-wrap gap-x-1.5">
                          <span className="text-xs sm:text-base font-helvetica font-medium text-[#000000]">
                            ₹{Number(priceInfo.price || product.price || 0).toFixed(2)}
                          </span>
                          {priceInfo.originalPrice && priceInfo.isDiscounted && (
                            <span className="text-[10px] sm:text-xs text-[#808080] line-through font-helvetica">
                              ₹{Number(priceInfo.originalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>

                        {product.stock > 0 ? (
                          inCart ? (
                            <button 
                              onClick={() => {
                                setIsCartOpen(true);
                              }}
                              className="btn-pill-action w-full sm:w-auto py-1.5 px-3 text-[11px] justify-center"
                            >
                              <ShoppingBag size={11} className="shrink-0" />
                              <span>Go to Bag</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                addToCart(product);
                              }}
                              className="btn-pill-action w-full sm:w-auto py-1.5 px-3 text-[11px] justify-center"
                            >
                              <ShoppingBag size={11} className="shrink-0" />
                              <span>Add to Bag</span>
                            </button>
                          )
                        ) : (
                          <span className="text-[#808080] text-[10px] font-helvetica uppercase tracking-wider py-1 px-2.5 bg-[#dfdcd5] rounded-[28.8px] text-center w-full sm:w-auto">
                            Archived
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
