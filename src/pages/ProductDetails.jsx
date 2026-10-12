import React, { useEffect, useState } from 'react';
import { DetailSkeleton } from '../components/Skeletons';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, StarHalf } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
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
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);

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
      // Re-fetch reviews to show the new one
      const { data: newReviews } = await supabase
        .from('reviews')
        .select('id, rating, review_text, created_at, profile:profiles(full_name)')
        .eq('product_id', id)
        .order('created_at', { ascending: false });
      if (newReviews) setReviews(newReviews);
      
      setReviewText('');
      
      // If positive review, prompt for Google
      if (rating >= 4) {
        setShowGooglePrompt(true);
      } else {
        toast.success("Thank you for your review!");
      }
    } else {
      console.error("Review Insert Error:", error);
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
    // Create a copy of the product but force image_url to only be the first image so the cart thumbnail is clean
    const cartProduct = { ...product, image_url: images[0] || product.image_url };
    addToCart(cartProduct, quantity);
    setTimeout(() => {
      setIsAdding(false);
      navigate('/cart');
    }, 400);
  };

  const increment = () => setQuantity(prev => (prev < product.stock ? prev + 1 : prev));
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) return <DetailSkeleton />;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500 font-medium">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-[80vh]">
      <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold font-medium mb-6 transition-colors" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 rounded-xl overflow-hidden border border-border-gray relative aspect-square">
            <img src={activeImage || 'https://via.placeholder.com/600'} alt={product.name} className="w-full h-full object-cover block" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-xl border-2 overflow-hidden transition-colors ${activeImage === img ? 'border-primary-teal' : 'border-transparent hover:border-gray-300 bg-gray-50'}`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-bold uppercase tracking-wider mb-3">{product.category?.name || 'Uncategorized'}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-bold leading-tight mb-4">{product.name}</h1>
          
          {/* Rating Summary */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-yellow-400">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={20} fill={star <= Math.round(calculateAverageRating()) ? "currentColor" : "none"} className={star <= Math.round(calculateAverageRating()) ? "text-yellow-400" : "text-gray-300"} />
              ))}
            </div>
            <span className="font-bold text-gray-700">{calculateAverageRating()}</span>
            <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
          </div>

          <div className="text-3xl font-bold text-gray-900 mb-6">₹{Number(product.price).toFixed(2)}</div>
          
          <div className="text-gray-600 leading-relaxed mb-8 border-b border-border-gray pb-8 whitespace-pre-wrap">
            {product.description || 'No description available for this product.'}
          </div>
          
          <div className="mb-6 font-semibold text-sm">
             {product.stock > 0 ? <span className="text-green-600">In Stock ({product.stock} available)</span> : <span className="text-red-600">Out of Stock</span>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {!cartItems.some(item => item?.id === product.id) && (
              <div className="flex items-center border border-border-gray rounded-xl bg-white">
                <button className="p-4 text-gray-700 hover:bg-gray-50 transition-colors" onClick={decrement}><Minus size={16}/></button>
                <span className="min-w-[40px] text-center font-semibold text-lg">{quantity}</span>
                <button className="p-4 text-gray-700 hover:bg-gray-50 transition-colors" onClick={increment}><Plus size={16}/></button>
              </div>
            )}
            
            {cartItems.some(item => item?.id === product.id) ? (
              <button 
                className="flex-1 flex justify-center items-center gap-3 bg-secondary-teal text-gray-900 font-bold text-lg rounded-xl px-6 py-4 hover:bg-primary-teal transition-all"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart size={20} />
                Go to Cart
              </button>
            ) : (
              <button 
                className={`flex-1 flex justify-center items-center gap-3 bg-primary-teal text-gray-900 font-bold text-lg rounded-xl px-6 py-4 hover:bg-secondary-teal transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isAdding ? 'opacity-80' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart size={20} />
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 border-t border-border-gray pt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Reviews List */}
          <div>
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="flex flex-col gap-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-border-gray pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm">
                        {review.profile?.full_name?.charAt(0) || 'U'}
                      </div>
                      <span className="font-bold text-gray-900">{review.profile?.full_name || 'Anonymous User'}</span>
                      <span className="text-xs text-gray-400 ml-auto">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map(star => (
                         <Star key={star} size={14} fill={star <= review.rating ? "currentColor" : "none"} className={star <= review.rating ? "text-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm">{review.review_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write a Review Form */}
          <div>
            <div className="bg-gray-50 rounded-xl p-6 border border-border-gray">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
              {!user ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">You must be logged in to write a review.</p>
                  <button onClick={() => navigate('/login')} className="bg-primary-teal text-gray-900 px-6 py-2 rounded-xl font-medium hover:bg-secondary-teal">Log In</button>
                </div>
              ) : (
                <form onSubmit={submitReview} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none">
                          <Star size={24} fill={star <= rating ? "currentColor" : "none"} className={star <= rating ? "text-yellow-400 hover:scale-110 transition-transform" : "text-gray-300 hover:text-gray-400 transition-colors"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Review</label>
                    <textarea 
                      required
                      rows="4" 
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="What did you like or dislike about this product?"
                      className="w-full p-3 border border-border-gray rounded-xl outline-none focus:border-primary-teal resize-none"
                    ></textarea>
                  </div>
                  <button type="submit" disabled={submittingReview} className="bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50">
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Google Review Prompt Modal */}
      {showGooglePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} fill="currentColor" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">We're glad you loved it!</h3>
            <p className="text-gray-600 mb-6">Thank you for your 5-star rating! As a small business, reviews on Google help us grow immensely. Could you take a moment to share your experience on Google?</p>
            <div className="flex flex-col gap-3">
              <a href="https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review" target="_blank" rel="noreferrer" onClick={() => setShowGooglePrompt(false)} className="bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors">
                Share on Google
              </a>
              <button onClick={() => setShowGooglePrompt(false)} className="text-gray-500 font-medium py-2 hover:text-gray-800 transition-colors">
                No thanks, maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
