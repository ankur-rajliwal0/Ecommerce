import React, { useEffect, useState } from 'react';
import { TableSkeleton } from '../../components/Skeletons';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (!error) setCategories(data);
    setLoading(false);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { error } = await supabase.from('categories').insert([{ name: newCategoryName, slug: slug }]);
    if (error) {
      toast.error('Failed to add category: ' + error.message);
    } else {
      setNewCategoryName('');
      fetchCategories();
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    
    const { error } = await supabase.from('categories').delete().eq('id', deleteConfirmId);
    if (!error) {
      setCategories(categories.filter(c => c.id !== deleteConfirmId));
      toast.success('Category deleted successfully');
    } else {
      toast.error('Failed to delete category (some products might still be linked to it).');
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Manage Categories</h2>
          <p className="text-sm md:text-base text-gray-500 mt-1 md:mt-2">Organize your store's products efficiently.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 hover:shadow-md transition-all">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-teal"></span> Add New Category
        </h3>
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 w-full">
            <input 
              type="text" 
              placeholder="Category Name (e.g. Flowers, Gifts)" 
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)} 
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-teal focus:bg-white focus:ring-4 focus:ring-primary-teal/10 transition-all text-sm font-medium text-gray-800"
            />
          </div>
          <button type="submit" className="bg-slate-900 text-gray-900 text-sm font-bold py-2.5 px-6 rounded-xl hover:bg-primary-teal shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap">
            Add Category
          </button>
        </form>
      </div>
      
      {loading ? (
        <div className="py-20 text-center text-gray-400 animate-pulse flex flex-col items-center">
           <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p>Loading categories...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="text-left px-3 md:px-8 py-4 md:py-5 text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest w-[35%]">Name</th>
                  <th className="text-left px-3 md:px-8 py-4 md:py-5 text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest w-[40%]">Slug</th>
                  <th className="text-right px-3 md:px-8 py-4 md:py-5 text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest w-[25%]">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.length === 0 ? (
                <tr><td colSpan="3" className="p-12 text-center text-gray-400 italic">No categories found. Add your first category above!</td></tr>
              ) : (
                categories.map(c => (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-3 md:px-8 py-4 md:py-5 align-middle">
                      <p className="font-semibold text-gray-900 group-hover:text-gray-900 font-bold transition-colors text-sm break-words">{c.name}</p>
                    </td>
                    <td className="px-3 md:px-8 py-4 md:py-5 align-middle">
                      <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-xl text-xs font-mono border border-gray-200 break-all">/{c.slug}</span>
                    </td>
                    <td className="px-3 md:px-8 py-4 md:py-5 text-right align-middle whitespace-nowrap">
                      <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 md:px-4 md:py-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl text-xs md:text-sm font-bold transition-colors">Delete</button>
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
            <p className="text-center text-gray-600 mb-5 md:mb-6 text-sm font-medium">Are you sure you want to delete this category? (Make sure no products are using it)</p>
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
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
