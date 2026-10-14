import React, { useEffect, useState } from 'react';
import { DetailSkeleton } from '../components/Skeletons';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Minus, Plus, ShoppingBag, ArrowLeft, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductPriceInfo } from '../lib/productUtils';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      // Fetch Product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*, category:categories(name)')
        .eq('id', id)
        .single();
        
      if (!productError && productData) {
        setProduct(productData);
        if (productData.image_url) {
          const imgs = productData.image_url.split(',');
          setImages(imgs);
          setActiveImage(imgs[0]);
        }
      }

      // Fetch Reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id, rating, review_text, created_at,
          profile:profiles(full_name)
        `)
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (!reviewsError && reviewsData) {
        setReviews(reviewsData);
      }

      setLoading(false);
    };

    fetchProductAndReviews();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to submit a review.");
    if (rating < 1 || rating > 5) return;
    
    setSubmittingReview(true);
    const { error } = await supabase.from('reviews').insert({
      product_id: id,
      user_id: user.id,
      rating: rating,
      review_text: reviewText
    });

    if (!error) {
      const { data: newReviews } = await supabase
        .from('reviews')
        .select('id, rating, review_text, created_at, profile:profiles(full_name)')
        .eq('product_id', id)
        .order('created_at', { ascending: false });
      if (newReviews) setReviews(newReviews);
      
      setReviewText('');
      toast.success("Thank you for your appraisal.");
    } else {
      toast.error("Error submitting review: " + (error?.message || "Unknown error"));
    }
    setSubmittingReview(false);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    const priceInfo = getProductPriceInfo(product);
    const cartProduct = { 
      ...product, 
      price: priceInfo.price,
      original_price: priceInfo.originalPrice,
      is_discounted: priceInfo.isDiscounted,
      image_url: images[0] || product.image_url 
    };
    addToCart(cartProduct, quantity);
    setTimeout(() => {
      setIsAdding(false);
      navigate('/cart');
    }, 350);
  };

  const increment = () => setQuantity(prev => (prev < product.stock ? prev + 1 : prev));
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) return <DetailSkeleton />;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center font-helvetica text-sm text-[#595855]">Acquisition not found in archive.</div>;

  const priceInfo = getProductPriceInfo(product);

  return (
    <div className="w-full bg-[#c4c3b6] text-[#000000] min-h-[calc(100vh-120px)] py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <button 
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#595855] hover:text-[#000000] font-helvetica mb-8 transition-colors" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={14} />
          <span>Return to Archive</span>
        </button>
        
        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          
          {/* Left: Classical Framing & Thumbnail Row */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] overflow-hidden relative aspect-square">
              {priceInfo.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-[#000000] text-[#ffffff] text-[10px] font-helvetica px-2.5 py-1 rounded-[28.8px] uppercase tracking-wider z-10">
                  -{priceInfo.discountPercent}% Folio Offer
                </span>
              )}
              <img 
                src={activeImage || '/favicon.png'} 
                alt={product.name} 
                onError={(e) => { e.target.src = '/favicon.png'; }}
                className="w-full h-full object-cover block" 
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-[9px] border overflow-hidden transition-all ${
                      activeImage === img ? 'border-[#000000] opacity-100' : 'border-[#dfdcd5] opacity-60 hover:opacity-100 bg-[#e7e5e4]'
                    }`}
                  >
                    <img src={img} alt={`${product.name} vignette ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Right: Curatorial Metadata & Acquisiton Action */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] font-helvetica block mb-2">
              DISCIPLINE: {product.category?.name || 'ARTIFACT'}
            </span>
            <h1 className="font-davinci text-3xl sm:text-4xl md:text-5xl font-medium text-[#000000] leading-tight mb-4 tracking-tight">
              {product.name}
            </h1>
            
            {/* Rating Summary */}
            <div className="flex items-center gap-2 mb-6 font-helvetica text-xs">
              <div className="flex items-center text-[#000000]">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={14} 
                    fill={star <= Math.round(calculateAverageRating()) ? "currentColor" : "none"} 
                    className={star <= Math.round(calculateAverageRating()) ? "text-[#000000]" : "text-[#dfdcd5]"} 
                  />
                ))}
              </div>
              <span className="font-medium text-[#000000]">{calculateAverageRating()}</span>
              <span className="text-[#595855]">({reviews.length} appraisals)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-6 flex-wrap border-y border-[#dfdcd5] py-4">
              <span className="text-3xl font-helvetica font-medium text-[#000000]">
                ₹{Number(priceInfo.price || product.price || 0).toFixed(2)}
              </span>
              {priceInfo.originalPrice && priceInfo.isDiscounted && (
                <>
                  <span className="text-sm text-[#808080] line-through font-helvetica">
                    ₹{Number(priceInfo.originalPrice).toFixed(2)}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#595855] font-helvetica border border-[#dfdcd5] px-2 py-0.5 rounded-[28.8px]">
                    Save ₹{Number(priceInfo.originalPrice - (priceInfo.price || 0)).toFixed(2)}
                  </span>
                </>
              )}
            </div>
            
            {/* Description */}
            <div className="text-xs sm:text-sm text-[#595855] leading-relaxed mb-6 font-helvetica whitespace-pre-wrap">
              {priceInfo.cleanDescription || 'Florentine handcrafted piece selected for museum-grade botanical or confectionary preservation.'}
            </div>
            
            <div className="mb-6 font-helvetica text-xs uppercase tracking-wider">
               {product.stock > 0 ? (
                 <span className="text-[#000000] font-medium">● Available in Vault ({product.stock} items)</span>
               ) : (
                 <span className="text-[#808080]">○ Archived / Out of Season</span>
               )}
            </div>

            {/* Quantity Stepper & Pill Action Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!cartItems.some(item => item?.id === product.id) && (
                <div className="flex items-center border border-[#dfdcd5] rounded-[28.8px] bg-[#ffffff] self-start sm:self-auto">
                  <button className="px-3 py-2 text-[#000000] hover:bg-[#e7e5e4] transition-colors rounded-l-[28.8px]" onClick={decrement}>
                    <Minus size={13}/>
                  </button>
                  <span className="min-w-[36px] text-center font-helvetica text-xs font-medium text-[#000000]">
                    {quantity}
                  </span>
                  <button className="px-3 py-2 text-[#000000] hover:bg-[#e7e5e4] transition-colors rounded-r-[28.8px]" onClick={increment}>
                    <Plus size={13}/>
                  </button>
                </div>
              )}
              
              {cartItems.some(item => item?.id === product.id) ? (
                <button 
                  className="btn-pill-action py-3 px-6 text-xs uppercase tracking-widest"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingBag size={13} />
                  <span>Go to Bag</span>
                </button>
              ) : (
                <button 
                  className={`btn-pill-action py-3 px-8 text-xs uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed ${isAdding ? 'opacity-70' : ''}`}
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingBag size={13} />
                  <span>{isAdding ? 'Adding to Bag...' : 'Add to Bag'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews / Appraisals Section */}
        <div className="mt-20 border-t border-[#dfdcd5] pt-12">
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] font-helvetica block mb-1">
              PROVENANCE CRITIQUE
            </span>
            <h2 className="font-davinci text-3xl sm:text-4xl font-medium text-[#000000]">
              Client Appraisals ({reviews.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Reviews List */}
            <div>
              {reviews.length === 0 ? (
                <p className="text-xs text-[#595855] italic font-helvetica">
                  No public appraisals recorded yet. Be the first to appraise this piece.
                </p>
              ) : (
                <div className="flex flex-col gap-5">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-xs text-[#000000] font-helvetica">
                          {review.profile?.full_name || 'Anonymous Collector'}
                        </span>
                        <span className="text-[10px] text-[#595855] font-helvetica">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2 text-[#000000]">
                        {[1, 2, 3, 4, 5].map(star => (
                           <Star key={star} size={11} fill={star <= review.rating ? "currentColor" : "none"} className={star <= review.rating ? "text-[#000000]" : "text-[#dfdcd5]"} />
                        ))}
                      </div>
                      <p className="text-xs text-[#595855] font-helvetica leading-relaxed">{review.review_text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div>
              <div className="bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] p-6 font-helvetica">
                <h3 className="font-davinci text-2xl font-medium text-[#000000] mb-4">
                  Submit an Appraisal
                </h3>
                {!user ? (
                  <div className="py-4">
                    <p className="text-xs text-[#595855] mb-4">You must be signed in to submit an appraisal.</p>
                    <button 
                      onClick={() => navigate('/login')} 
                      className="btn-pill-action py-2 px-5 text-xs"
                    >
                      Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitReview} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#595855] mb-1.5">Rating</label>
                      <div className="flex gap-1.5 text-[#000000]">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none">
                            <Star size={18} fill={star <= rating ? "currentColor" : "none"} className={star <= rating ? "text-[#000000]" : "text-[#dfdcd5]"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#595855] mb-1.5">Your Critique</label>
                      <textarea 
                        required
                        rows="3" 
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Detail the botanical freshness, scent, or presentation craft..."
                        className="w-full p-3 border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] resize-none bg-[#ffffff] text-xs text-[#000000]"
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={submittingReview} 
                      className="btn-pill-action py-2.5 px-6 text-xs uppercase tracking-wider self-start disabled:opacity-40"
                    >
                      {submittingReview ? 'Submitting...' : 'Post Appraisal'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
