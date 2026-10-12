import React, { useEffect, useState } from 'react';
import { TableSkeleton } from '../../components/Skeletons';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventoryTracking, setInventoryTracking] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data: settings } = await supabase.from('store_settings').select('inventory_tracking').eq('id', 1).single();
    if (settings) {
      setInventoryTracking(settings.inventory_tracking);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data);
    setLoading(false);
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    
    const { error } = await supabase.from('products').delete().eq('id', deleteConfirmId);
    if (!error) {
      setProducts(products.filter(p => p.id !== deleteConfirmId));
      toast.success('Product deleted successfully');
    } else {
      toast.error('Failed to delete product.');
    }
    setDeleteConfirmId(null);
  };

  const toggleInventoryTracking = async () => {
    const newVal = !inventoryTracking;
    setInventoryTracking(newVal);
    
    try {
      const { data, error } = await supabase.from('store_settings')
        .update({ inventory_tracking: newVal })
        .eq('id', 1)
        .select();
        
      if (error || !data || data.length === 0) {
        setInventoryTracking(!newVal);
        const errMsg = error ? error.message : "Row with id=1 not found or RLS blocked update.";
        toast.error(`Failed to save setting!\nReason: ${errMsg}`);
      } else {
        toast.success("Settings saved!");
      }
    } catch (err) {
      console.error(err);
      setInventoryTracking(!newVal);
      toast.error(`Unexpected error: ${err.message}`);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Manage Products</h2>
          <p className="text-sm md:text-base text-gray-500 mt-1 md:mt-2">Add, edit or remove products from your store.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-4 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-sm font-semibold text-gray-700">Inventory Tracking</span>
            <button 
              onClick={toggleInventoryTracking}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none flex-shrink-0 ${inventoryTracking ? 'bg-primary-teal' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${inventoryTracking ? 'translate-x-5' : 'translate-x-0'}`}></span>
            </button>
          </div>
          <Link to="/store-control/products/add" className="bg-primary-teal hover:bg-secondary-teal text-gray-900 font-bold py-2.5 px-5 rounded-xl shadow-sm hover:shadow-md transition-all whitespace-nowrap flex items-center justify-center gap-2">
            <span>+</span> Add New Product
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="py-20 text-center text-gray-400 animate-pulse flex flex-col items-center">
           <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p>Loading products...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="text-left px-4 md:px-8 py-5 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="text-left px-4 md:px-8 py-5 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="text-left px-4 md:px-8 py-5 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Stock</th>
                  <th className="text-left px-4 md:px-8 py-5 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="text-right px-4 md:px-8 py-5 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr><td colSpan="5" className="p-12 text-center text-gray-400 italic">No products found. Start by adding one!</td></tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-4 md:px-8 py-5 whitespace-nowrap md:whitespace-normal min-w-[250px]">
                      <div className="flex items-center gap-4">
                        {p.image_url ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                            <img src={p.image_url.split(',')[0]} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 flex items-center justify-center bg-gray-100 text-[10px] text-gray-400 rounded-xl border border-gray-200 shadow-sm uppercase font-bold">No Pic</div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-gray-900 font-bold transition-colors line-clamp-1">{p.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{p.description || 'No description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-5 font-black text-gray-900 whitespace-nowrap">₹{Number(p.price).toFixed(2)}</td>
                    <td className="px-4 md:px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold ${p.stock > 10 ? 'bg-green-50 text-green-700 border border-green-200' : p.stock > 0 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-5 whitespace-nowrap">
                      {p.featured ? <span className="bg-primary-teal/10 text-gray-900 font-bold border border-primary-teal/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Featured</span> : <span className="text-gray-400 text-xs font-semibold uppercase">Standard</span>}
                    </td>
                    <td className="px-4 md:px-8 py-5 whitespace-nowrap">
                      <div className="flex gap-3 justify-end items-center">
                        <Link to={`/store-control/products/edit/${p.id}`} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-colors">Edit</Link>
                        <button onClick={() => handleDelete(p.id)} className="px-4 py-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl text-sm font-bold transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-[300px] md:max-w-sm w-full p-5 md:p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg md:text-xl font-bold text-center text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-center text-gray-600 mb-5 md:mb-6 text-sm font-medium">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex gap-2.5 md:gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 md:py-2.5 text-sm md:text-base rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white font-bold py-2 md:py-2.5 text-sm md:text-base rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
