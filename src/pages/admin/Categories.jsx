import React, { useEffect, useState } from 'react';
import { TableSkeleton } from '../../components/Skeletons';
import { supabase } from '../../lib/supabase';
import { Upload, X, Star, Trash2, Edit3, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const defaultCategoryMeta = {
  flower: '/images/categories/flower.jpg',
  chocolates: '/images/categories/chocolates.jpg',
  combos: '/images/categories/combos.jpg',
  jewellary: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  jewelry: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  decoration: '/images/categories/decoration.jpg',
  crafts: '/images/categories/crafts.jpg',
  cakes: '/images/categories/cakes.jpg',
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Add Category form state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Edit Category modal state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [isEditingSaving, setIsEditingSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (!error && data) {
      let overrides = {};
      try {
        overrides = JSON.parse(localStorage.getItem('category_meta_overrides') || '{}');
      } catch (e) {}

      const merged = data.map(c => ({
        ...c,
        image_url: c.image_url || overrides[c.id]?.image_url || null,
        featured: c.featured !== undefined ? Boolean(c.featured) : Boolean(overrides[c.id]?.featured)
      }));
      setCategories(merged);
    }
    setLoading(false);
  };

  const uploadImageToStorage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `category-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error('Image upload failed: ' + uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsUploading(true);
    try {
      let uploadedUrl = null;
      if (imageFile) {
        uploadedUrl = await uploadImageToStorage(imageFile);
      }

      const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const payload = {
        name: newCategoryName.trim(),
        slug: slug,
        image_url: uploadedUrl,
        featured: isFeatured
      };

      let { data: insertedData, error } = await supabase
        .from('categories')
        .insert([payload])
        .select();

      // Fallback if columns image_url or featured do not exist in DB yet
      if (error && (error.code === '42703' || error.message?.includes('image_url') || error.message?.includes('featured'))) {
        const basicPayload = { name: newCategoryName.trim(), slug: slug };
        const res = await supabase.from('categories').insert([basicPayload]).select();
        if (res.error) throw res.error;

        const newId = res.data?.[0]?.id;
        if (newId) {
          const overrides = JSON.parse(localStorage.getItem('category_meta_overrides') || '{}');
          overrides[newId] = { image_url: uploadedUrl, featured: isFeatured };
          localStorage.setItem('category_meta_overrides', JSON.stringify(overrides));
        }
        toast.success('Category added successfully! (Run add_category_columns.sql in Supabase to sync native DB columns)');
      } else if (error) {
        throw error;
      } else {
        toast.success('Category added successfully!');
      }

      // Reset Form
      setNewCategoryName('');
      setImageFile(null);
      setImagePreview(null);
      setIsFeatured(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to add category');
    } finally {
      setIsUploading(false);
    }
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditImageFile(null);
    setEditImagePreview(cat.image_url || defaultCategoryMeta[cat.name.toLowerCase().trim()] || null);
    setEditIsFeatured(Boolean(cat.featured));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editingCategory) return;

    setIsEditingSaving(true);
    try {
      let finalImageUrl = editImagePreview;
      if (editImageFile) {
        finalImageUrl = await uploadImageToStorage(editImageFile);
      }

      const slug = editName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const updateData = {
        name: editName.trim(),
        slug: slug,
        image_url: finalImageUrl,
        featured: editIsFeatured
      };

      let { error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', editingCategory.id);

      if (error && (error.code === '42703' || error.message?.includes('image_url') || error.message?.includes('featured'))) {
        const basicData = { name: editName.trim(), slug: slug };
        const res = await supabase.from('categories').update(basicData).eq('id', editingCategory.id);
        if (res.error) throw res.error;

        const overrides = JSON.parse(localStorage.getItem('category_meta_overrides') || '{}');
        overrides[editingCategory.id] = { image_url: finalImageUrl, featured: editIsFeatured };
        localStorage.setItem('category_meta_overrides', JSON.stringify(overrides));
        toast.success('Category updated successfully!');
      } else if (error) {
        throw error;
      } else {
        toast.success('Category updated successfully!');
      }

      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to update category');
    } finally {
      setIsEditingSaving(false);
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
      const overrides = JSON.parse(localStorage.getItem('category_meta_overrides') || '{}');
      if (overrides[deleteConfirmId]) {
        delete overrides[deleteConfirmId];
        localStorage.setItem('category_meta_overrides', JSON.stringify(overrides));
      }
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
          <h2 className="text-2xl md:text-3xl font-bold text-[#292923] tracking-tight">Manage Categories</h2>
          <p className="text-sm md:text-base text-[#829078] mt-1 md:mt-2">Organize your store collections and showcase images.</p>
        </div>
      </div>

      {/* Add New Category Box */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#DCC6A8] mb-8 hover:shadow-md transition-all">
        <h3 className="text-lg font-bold text-[#292923] mb-5 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#344B38]"></span> Add New Category
        </h3>
        
        <form onSubmit={handleAddCategory} className="flex flex-col gap-5">
          {/* Category Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#292923] uppercase tracking-wider">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g. Handmade Candles, Gift Hampers" 
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)} 
              required
              className="w-full px-4 py-3 bg-[#F8F6F1] border border-[#DCC6A8] rounded-xl outline-none focus:border-[#344B38] focus:bg-white focus:ring-4 focus:ring-[#344B38]/10 transition-all text-sm font-medium text-[#292923]"
            />
          </div>

          {/* Category Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#292923] uppercase tracking-wider">
              Category Image
            </label>
            
            <div className="flex flex-wrap items-center gap-4">
              {imagePreview ? (
                <div className="relative w-28 h-28 rounded-2xl border-2 border-[#344B38] overflow-hidden group shadow-sm bg-[#F8F6F1]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-1.5 right-1.5 bg-rose-600 text-white p-1 rounded-full shadow hover:bg-rose-700 transition-colors"
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="w-full sm:w-auto px-5 py-3.5 border-2 border-dashed border-[#DCC6A8] hover:border-[#344B38] rounded-2xl flex items-center gap-3 cursor-pointer bg-[#F8F6F1] hover:bg-white transition-all text-[#829078] hover:text-[#344B38]">
                  <Upload size={20} className="text-[#344B38]" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#292923] block">Upload Category Image</span>
                    <span className="text-[11px] text-[#829078]">JPG, PNG, WebP up to 5MB</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-[11px] text-[#829078]">Uploaded image will be shown on the homepage and collections banner.</p>
          </div>

          {/* Feature this category Checkbox */}
          <div className="flex items-center gap-3 pt-3 pb-1 border-t border-[#DCC6A8]/40">
            <input 
              type="checkbox" 
              id="featureCategory" 
              checked={isFeatured} 
              onChange={(e) => setIsFeatured(e.target.checked)} 
              className="w-5 h-5 accent-[#344B38] rounded-md cursor-pointer"
            />
            <label htmlFor="featureCategory" className="text-sm font-bold text-[#292923] cursor-pointer select-none">
              Feature this category <span className="text-xs font-normal text-[#829078] block sm:inline sm:ml-1.5">(Highlight on homepage collections)</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isUploading}
              className="bg-[#344B38] text-white text-sm font-bold py-3 px-8 rounded-xl hover:bg-[#829078] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {isUploading ? 'Uploading & Adding...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
      
      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#DCC6A8] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="bg-[#E9E9E0]/40 border-b border-[#E9E9E0]">
                  <th className="text-left px-4 md:px-6 py-4 text-[10px] md:text-xs font-extrabold text-[#292923]/60 uppercase tracking-widest whitespace-nowrap">Image</th>
                  <th className="text-left px-4 md:px-6 py-4 text-[10px] md:text-xs font-extrabold text-[#292923]/60 uppercase tracking-widest whitespace-nowrap">Name</th>
                  <th className="text-left px-4 md:px-6 py-4 text-[10px] md:text-xs font-extrabold text-[#292923]/60 uppercase tracking-widest whitespace-nowrap">Slug</th>
                  <th className="text-center px-4 md:px-6 py-4 text-[10px] md:text-xs font-extrabold text-[#292923]/60 uppercase tracking-widest whitespace-nowrap">Featured</th>
                  <th className="text-right px-4 md:px-6 py-4 text-[10px] md:text-xs font-extrabold text-[#292923]/60 uppercase tracking-widest whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E9E0]">
                {categories.length === 0 ? (
                  <tr><td colSpan="5" className="p-12 text-center text-[#829078] italic">No categories found. Add your first category above!</td></tr>
                ) : (
                  categories.map(c => {
                    const fallbackImg = defaultCategoryMeta[c.name.toLowerCase().trim()];
                    const displayImg = c.image_url || fallbackImg;

                    return (
                      <tr key={c.id} className="hover:bg-[#E9E9E0]/20 transition-colors group">
                        {/* Image Thumbnail */}
                        <td className="px-4 md:px-6 py-4 align-middle whitespace-nowrap">
                          {displayImg ? (
                            <img 
                              src={displayImg} 
                              alt={c.name} 
                              className="w-12 h-12 rounded-xl object-cover border border-[#DCC6A8] bg-[#F8F6F1] shadow-2xs"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#E9E9E0] border border-[#DCC6A8] flex items-center justify-center text-[#829078]">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </td>

                        {/* Category Name */}
                        <td className="px-4 md:px-6 py-4 align-middle whitespace-nowrap">
                          <p className="font-bold text-[#292923] group-hover:text-[#344B38] transition-colors text-sm capitalize">{c.name}</p>
                        </td>

                        {/* Slug */}
                        <td className="px-4 md:px-6 py-4 align-middle whitespace-nowrap">
                          <span className="inline-block bg-[#E9E9E0] text-[#344B38] px-2.5 py-1 rounded-xl text-xs font-mono border border-[#DCC6A8] whitespace-nowrap">
                            /{c.slug}
                          </span>
                        </td>

                        {/* Featured Status */}
                        <td className="px-4 md:px-6 py-4 text-center align-middle whitespace-nowrap">
                          {c.featured ? (
                            <span className="inline-flex items-center gap-1 bg-[#344B38] text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
                              <Star size={11} fill="currentColor" /> Featured
                            </span>
                          ) : (
                            <span className="inline-block bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                              Standard
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 md:px-6 py-4 text-right align-middle whitespace-nowrap">
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => openEditModal(c)} 
                              className="p-2 bg-[#E9E9E0] hover:bg-[#DCC6A8] text-[#292923] rounded-xl text-xs font-bold transition-colors"
                              title="Edit Category"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              onClick={() => handleDelete(c.id)} 
                              className="p-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl text-xs font-bold transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200 border border-[#DCC6A8]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#DCC6A8]/60">
              <h3 className="text-lg font-bold text-[#292923]">Edit Category</h3>
              <button 
                onClick={() => setEditingCategory(null)} 
                className="text-[#829078] hover:text-[#292923] p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#292923] uppercase tracking-wider">Category Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  required
                  className="w-full px-4 py-2.5 bg-[#F8F6F1] border border-[#DCC6A8] rounded-xl outline-none focus:border-[#344B38] font-medium text-sm text-[#292923]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#292923] uppercase tracking-wider">Category Image</label>
                <div className="flex items-center gap-4">
                  {editImagePreview ? (
                    <div className="relative w-20 h-20 rounded-xl border border-[#DCC6A8] overflow-hidden bg-[#F8F6F1]">
                      <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setEditImageFile(null); setEditImagePreview(null); }}
                        className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full shadow"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : null}

                  <label className="px-4 py-2.5 border-2 border-dashed border-[#DCC6A8] hover:border-[#344B38] rounded-xl flex items-center gap-2 cursor-pointer bg-[#F8F6F1] text-xs font-bold text-[#344B38]">
                    <Upload size={16} />
                    <span>{editImagePreview ? 'Change Image' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleEditImageSelect} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="editIsFeatured" 
                  checked={editIsFeatured} 
                  onChange={(e) => setEditIsFeatured(e.target.checked)} 
                  className="w-5 h-5 accent-[#344B38] rounded-md cursor-pointer"
                />
                <label htmlFor="editIsFeatured" className="text-sm font-bold text-[#292923] cursor-pointer">
                  Feature this category on homepage
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isEditingSaving}
                  className="flex-1 bg-[#344B38] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#829078] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isEditingSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-[300px] md:max-w-sm w-full p-5 md:p-6 animate-in fade-in zoom-in-95 duration-200">
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
