import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, X, Upload, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductPriceInfo } from '../../lib/productUtils';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    is_discounted: false,
    stock: '',
    category_id: '',
    featured: false
  });
  
  const [existingImages, setExistingImages] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  };

  const fetchProduct = async () => {
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    if (data) {
      const priceInfo = getProductPriceInfo(data);
      setFormData({
        name: data.name,
        description: priceInfo.cleanDescription,
        price: data.price != null ? String(data.price) : '',
        original_price: priceInfo.originalPrice != null ? String(priceInfo.originalPrice) : '',
        is_discounted: priceInfo.isDiscounted,
        stock: data.stock != null ? String(data.stock) : '',
        category_id: data.category_id || '',
        featured: Boolean(data.featured)
      });
      if (data.image_url) {
        setExistingImages(data.image_url.split(','));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - (existingImages.length + filesToUpload.length);
    const newFiles = files.slice(0, remainingSlots).map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setFilesToUpload(prev => [...prev, ...newFiles]);
  };

  const removeExisting = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeUpload = (index) => {
    setFilesToUpload(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadedUrls = [];

    try {
      // 1. Upload new files to Supabase Storage
      for (const item of filesToUpload) {
        const fileExt = item.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, item.file);

        if (uploadError) {
          throw new Error("Failed to upload image: " + uploadError.message + " (Please ensure 'product-images' bucket is created in Supabase Storage and has public access!)");
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrlData.publicUrl);
      }
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
      return;
    }

    const finalImages = [...existingImages, ...uploadedUrls].filter(url => url.trim() !== '').join(',');

    const isDiscounted = Boolean(formData.is_discounted);
    const sellingPrice = parseFloat(formData.price);
    const actualPrice = formData.original_price ? parseFloat(formData.original_price) : null;

    if (isNaN(sellingPrice) || sellingPrice <= 0) {
      toast.error('Please enter a valid price');
      setLoading(false);
      return;
    }

    if (isDiscounted) {
      if (!actualPrice || isNaN(actualPrice) || actualPrice <= 0) {
        toast.error('Please enter the Actual / MRP Price');
        setLoading(false);
        return;
      }
      if (sellingPrice >= actualPrice) {
        toast.error('Discounted Price must be lower than Actual Price (MRP)!');
        setLoading(false);
        return;
      }
    }

    const cleanDesc = (formData.description || '').replace(/<!--discount:.*?-->/g, '').trim();

    const productData = {
      name: formData.name,
      description: cleanDesc,
      price: sellingPrice,
      stock: parseInt(formData.stock, 10),
      category_id: formData.category_id || null,
      featured: Boolean(formData.featured),
      image_url: finalImages || null,
      is_discounted: isDiscounted,
      original_price: isDiscounted ? actualPrice : null
    };

    if (!isEdit) {
      const baseSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      productData.slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;
    }

    let error;
    if (isEdit) {
      let res = await supabase.from('products').update(productData).eq('id', id);
      // Fallback if columns original_price or is_discounted do not exist in DB yet
      if (res.error && (res.error.code === '42703' || res.error.message?.includes('original_price') || res.error.message?.includes('is_discounted'))) {
        const metadata = { is_discounted: isDiscounted, original_price: isDiscounted ? actualPrice : null };
        const fallbackDesc = cleanDesc + `\n<!--discount:${JSON.stringify(metadata)}-->`;
        const fallbackData = { ...productData, description: fallbackDesc };
        delete fallbackData.original_price;
        delete fallbackData.is_discounted;
        res = await supabase.from('products').update(fallbackData).eq('id', id);
      }
      error = res.error;
    } else {
      let res = await supabase.from('products').insert([productData]);
      // Fallback if columns original_price or is_discounted do not exist in DB yet
      if (res.error && (res.error.code === '42703' || res.error.message?.includes('original_price') || res.error.message?.includes('is_discounted'))) {
        const metadata = { is_discounted: isDiscounted, original_price: isDiscounted ? actualPrice : null };
        const fallbackDesc = cleanDesc + `\n<!--discount:${JSON.stringify(metadata)}-->`;
        const fallbackData = { ...productData, description: fallbackDesc };
        delete fallbackData.original_price;
        delete fallbackData.is_discounted;
        res = await supabase.from('products').insert([fallbackData]);
      }
      error = res.error;
    }

    setLoading(false);

    if (error) {
      toast.error('Error saving product: ' + error.message);
    } else {
      toast.success('Product saved successfully');
      navigate('/store-control/products');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#DCC6A8]">
        <h2 className="text-2xl font-bold text-[#292923]">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
        <button onClick={() => navigate('/store-control/products')} className="text-[#829078] hover:text-[#344B38] font-bold transition-colors">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-2xl border border-[#DCC6A8] shadow-sm flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#292923]">Product Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2.5 border border-[#DCC6A8] rounded-xl outline-none focus:border-[#344B38] text-[#292923] transition-colors" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#292923]">Category</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-2.5 border border-[#DCC6A8] rounded-xl outline-none focus:border-[#344B38] transition-colors bg-white text-[#292923]">
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#292923]">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-2.5 border border-[#DCC6A8] rounded-xl outline-none focus:border-[#344B38] text-[#292923] transition-colors"></textarea>
        </div>

        {/* Pricing & Discount Settings Box */}
        <div className="bg-[#F8F6F1] p-5 rounded-2xl border border-[#DCC6A8] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCC6A8]/60">
            <div>
              <span className="font-bold text-[#292923] text-sm flex items-center gap-1.5">
                <Tag size={16} className="text-[#344B38]" /> Apply Discount / Sale Price
              </span>
              <span className="text-xs text-[#829078]">Show discounted price with actual MRP struck through on the website</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_discounted"
                checked={formData.is_discounted}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#344B38]"></div>
            </label>
          </div>

          {formData.is_discounted ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#292923] uppercase tracking-wider">
                  Actual Price / MRP (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  placeholder="e.g. 1499"
                  className="w-full p-2.5 border border-[#DCC6A8] rounded-xl outline-none focus:border-[#344B38] text-[#292923] bg-white transition-colors font-medium"
                />
                <span className="text-[11px] text-[#829078]">Displayed struck through (e.g. <span className="line-through">₹1499</span>)</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#344B38] uppercase tracking-wider">
                  Discounted Selling Price (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 999"
                  className="w-full p-2.5 border-2 border-[#344B38] rounded-xl outline-none focus:ring-2 focus:ring-[#344B38]/20 text-[#344B38] font-bold bg-white transition-colors"
                />
                <span className="text-[11px] text-[#344B38] font-semibold">Customers will pay this price</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#292923] uppercase tracking-wider">
                Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 999"
                className="w-full p-2.5 border border-[#DCC6A8] rounded-xl outline-none focus:border-[#344B38] text-[#292923] bg-white transition-colors font-medium"
              />
            </div>
          )}

          {/* Dynamic live preview banner when discount is active */}
          {formData.is_discounted && formData.original_price && formData.price && (
            (() => {
              const original = parseFloat(formData.original_price);
              const discounted = parseFloat(formData.price);
              if (original > discounted && discounted > 0) {
                const percent = Math.round(((original - discounted) / original) * 100);
                const savings = (original - discounted).toFixed(2);
                return (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <span>🎉</span> {percent}% OFF applied!
                    </span>
                    <span className="font-semibold text-emerald-700">
                      Customer saves ₹{savings}
                    </span>
                  </div>
                );
              } else if (discounted >= original) {
                return (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs font-bold text-rose-700">
                    ⚠️ Discounted price must be less than the Actual MRP price.
                  </div>
                );
              }
              return null;
            })()
          )}
        </div>

        {/* Stock Quantity */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#292923]">Stock Quantity</label>
          <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-2.5 border border-[#DCC6A8] rounded-xl outline-none focus:border-[#344B38] text-[#292923] transition-colors" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#292923]">Product Images (Up to 5)</label>
          
          <div className="flex flex-wrap gap-4 mt-2">
            {existingImages.map((img, idx) => (
              <div key={`existing-${idx}`} className="relative w-24 h-24 rounded-xl border border-[#DCC6A8] bg-[#F8F6F1] overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeExisting(idx)} className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {filesToUpload.map((item, idx) => (
              <div key={`upload-${idx}`} className="relative w-24 h-24 rounded-xl border border-[#DCC6A8] bg-[#F8F6F1] overflow-hidden">
                <img src={item.previewUrl} alt="" className="w-full h-full object-cover opacity-80" />
                <button type="button" onClick={() => removeUpload(idx)} className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}

            {(existingImages.length + filesToUpload.length) < 5 && (
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-[#DCC6A8] flex flex-col items-center justify-center text-[#829078] cursor-pointer hover:border-[#344B38] hover:text-[#344B38] transition-colors bg-[#F8F6F1]">
                <Upload size={24} className="mb-1" />
                <span className="text-xs font-semibold">Upload</span>
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-xs text-[#829078] mt-1">Select files from your computer. First image will be the primary product image.</p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 accent-[#344B38]" />
          <label htmlFor="featured" className="text-sm font-semibold text-[#292923] cursor-pointer">Feature this product on homepage</label>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#344B38] hover:bg-[#829078] text-white font-bold py-3.5 px-4 rounded-xl mt-4 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm">
          {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
          {loading ? 'Saving & Uploading...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
