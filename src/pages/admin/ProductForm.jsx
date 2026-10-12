import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

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
      setFormData({
        name: data.name,
        description: data.description || '',
        price: data.price,
        stock: data.stock,
        category_id: data.category_id || '',
        featured: data.featured
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

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      category_id: formData.category_id || null,
      image_url: finalImages || null
    };

    if (!isEdit) {
      const baseSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      productData.slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;
    }

    let error;
    if (isEdit) {
      const { error: updateError } = await supabase.from('products').update(productData).eq('id', id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('products').insert([productData]);
      error = insertError;
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
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-border-gray">
        <h2 className="text-2xl font-bold text-gray-900 font-bold">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
        <button onClick={() => navigate('/store-control/products')} className="text-gray-500 hover:text-gray-900 font-bold font-medium transition-colors">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-xl border border-border-gray flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Product Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2.5 border border-border-gray rounded-xl outline-none focus:border-primary-teal transition-colors" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Category</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-2.5 border border-border-gray rounded-xl outline-none focus:border-primary-teal transition-colors bg-white">
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-2.5 border border-border-gray rounded-xl outline-none focus:border-primary-teal transition-colors"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
            <input required type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} className="w-full p-2.5 border border-border-gray rounded-xl outline-none focus:border-primary-teal transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Stock Quantity</label>
            <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-2.5 border border-border-gray rounded-xl outline-none focus:border-primary-teal transition-colors" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Product Images (Up to 5)</label>
          
          <div className="flex flex-wrap gap-4 mt-2">
            {existingImages.map((img, idx) => (
              <div key={`existing-${idx}`} className="relative w-24 h-24 rounded-xl border border-border-gray bg-gray-50 overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeExisting(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {filesToUpload.map((item, idx) => (
              <div key={`upload-${idx}`} className="relative w-24 h-24 rounded-xl border border-border-gray bg-gray-50 overflow-hidden">
                <img src={item.previewUrl} alt="" className="w-full h-full object-cover opacity-80" />
                <button type="button" onClick={() => removeUpload(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}

            {(existingImages.length + filesToUpload.length) < 5 && (
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-primary-teal hover:text-gray-900 font-bold transition-colors bg-gray-50">
                <Upload size={24} className="mb-1" />
                <span className="text-xs font-semibold">Upload</span>
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Select files from your computer. First image will be the primary product image.</p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 accent-primary-teal" />
          <label htmlFor="featured" className="text-sm font-semibold text-gray-700 cursor-pointer">Feature this product on homepage</label>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-primary-teal hover:bg-secondary-teal text-gray-900 font-bold py-3 px-4 rounded-xl mt-4 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
          {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
          {loading ? 'Saving & Uploading...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
