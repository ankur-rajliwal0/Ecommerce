import React, { useEffect, useState } from 'react';
import { ProductGridSkeleton } from '../components/Skeletons';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Truck, ShieldCheck, Clock, CreditCard, Mail, Star, Quote } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();

  const reviews = [
    {
      id: 1,
      text: "Absolutely love the quality of the handcrafted gifts. Delivery was fast and the customer support team was incredibly helpful!",
      name: "Sarah J.",
      image: "Sarah+J"
    },
    {
      id: 2,
      text: "The products are perfectly made and feel so premium. Definitely my new go-to store for special occasions. Highly recommended!",
      name: "Michael T.",
      image: "Michael+T"
    },
    {
      id: 3,
      text: "Got a beautiful customized gift for my husband's birthday. It arrived in gorgeous packaging and he absolutely loved it.",
      name: "Emily R.",
      image: "Emily+R"
    },
    {
      id: 4,
      text: "The chocolate gift box was divine! Best assortment I've ever tasted. Will definitely be ordering more for the holidays.",
      name: "David L.",
      image: "David+L"
    },
    {
      id: 5,
      text: "I was looking for a unique anniversary gift and found the perfect personalized craft here. My wife was thrilled!",
      name: "John S.",
      image: "John+S"
    },
    {
      id: 6,
      text: "Incredible customer service. There was a mix-up with my shipping address but they fixed it immediately. A+ experience.",
      name: "Amanda C.",
      image: "Amanda+C"
    }
  ];

  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const visibleItems = isMobile ? 1 : 3;
        const maxIndex = reviews.length - visibleItems;
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  useEffect(() => {
    const fetchHomeData = async () => {
      const { data: prodData } = await supabase
        .from('products')
        .select('*, category:categories(name)')
        .order('created_at', { ascending: false })
        .limit(8);

      if (prodData) setProducts(prodData);

      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .limit(6);

      if (catData) setCategories(catData);

      setLoading(false);
    };

    fetchHomeData();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[500px]">
          <div className="flex flex-col gap-6">
            <Link to="/products" className="flex-1 rounded-xl p-8 flex flex-col justify-center relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 bg-[url('/images/gift_box_banner.jpg')] bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900 font-bold mb-2 block">Premium Gifts</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">Thoughtful<br />Surprises</h2>
                <p className="text-gray-600 text-sm mb-6 max-w-xs font-medium">Handcrafted gift boxes perfect for any occasion.</p>
                <button className="bg-primary-teal text-gray-900 w-32 py-2 rounded-xl font-bold group-hover:bg-gray-900 transition-colors shadow-lg">Shop Now</button>
              </div>
            </Link>

            <Link to="/products" className="flex-1 rounded-xl p-8 flex flex-col justify-center relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 bg-[url('/images/handmade_craft_banner.jpg')] bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 block">Handmade Crafts</span>
                <h2 className="text-3xl font-bold text-white mb-6 leading-tight drop-shadow-md">Artisan<br />Collection</h2>
                <button className="bg-white text-gray-900 w-32 py-2 rounded-xl font-bold group-hover:bg-primary-teal group-hover:text-gray-900 transition-colors shadow-lg">Shop Now</button>
              </div>
            </Link>
          </div>

          <Link to="/products" className="rounded-xl p-8 md:p-12 flex flex-col justify-end items-start h-[400px] md:h-full relative overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-[url('/images/flower_bouquet_banner.jpg')] bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            <div className="relative z-10 w-full">
              <span className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 block">Fresh Arrivals</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">Beautiful Handcrafted<br />Bouquets</h1>
              <p className="text-gray-200 mb-8 max-w-sm font-medium">Explore our stunning collection of carefully arranged fresh and dried flowers.</p>
              <button className="bg-primary-teal text-gray-900 px-8 py-3 rounded-xl font-bold group-hover:bg-white group-hover:text-gray-900 font-bold transition-colors shadow-xl">Discover Collection</button>
            </div>
          </Link>
        </div>
      </section>

      {/* Shop By Category */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-8 md:mt-16 mb-4 md:mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 font-bold mb-6 md:mb-10">Shop by Category</h2>
          <div className="flex overflow-x-auto flex-nowrap md:flex-wrap justify-start md:justify-center gap-6 md:gap-10 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat, index) => {
              return (
                <Link key={cat.id} to={`/products?category=${cat.id}`} className="flex flex-col items-center group cursor-pointer shrink-0 snap-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-4 transition-all duration-300 shadow-md border-4 border-white group-hover:border-primary-teal/20 relative">
                    <img
                      src={`/images/categories/${cat.name.toLowerCase()}.jpg`}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback if image not found
                        e.target.src = `https://ui-avatars.com/api/?name=${cat.name}&background=random&size=200&font-size=0.33`
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900 font-bold transition-colors">{cat.name}</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Weekly Best Deals */}
      <section className="bg-white py-8 md:py-16 border-t border-border-gray mt-4 md:mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-900 font-bold">Weekly Best Deals</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary-teal text-gray-900">Up to 50% off</button>
              <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Under ₹50</button>
              <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Almost Sold Out</button>
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-border-gray">
                  No products found. Add some from the Admin Dashboard!
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="group border border-border-gray rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col">
                    <Link to={`/product/${product.id}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url.split(',')[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#F8F9FA] py-10 md:py-16 border-y border-border-gray mt-8 md:mt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 font-bold mb-8 md:mb-12">What Our Customers Say</h2>
          
          <div className="relative w-full mx-auto md:max-w-7xl max-w-md">
            <div className="overflow-hidden rounded-xl pb-4">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: typeof window !== 'undefined' && window.innerWidth >= 768 ? `translateX(-${activeReviewIndex * 33.333}%)` : `translateX(-${activeReviewIndex * 100}%)` }}
              >
                {reviews.map((review) => (
                  <div key={review.id} className="w-full md:w-1/3 shrink-0 px-4">
                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 relative text-center h-full flex flex-col justify-between mx-auto">
                      <Quote className="absolute top-6 left-6 text-gray-100 rotate-180" size={40} />
                      <div className="flex justify-center gap-1 text-gray-900 mb-6 relative z-10">
                        <Star size={20} fill="currentColor" />
                        <Star size={20} fill="currentColor" />
                        <Star size={20} fill="currentColor" />
                        <Star size={20} fill="currentColor" />
                        <Star size={20} fill="currentColor" />
                      </div>
                      <p className="text-gray-700 mb-8 italic relative z-10 text-base md:text-lg font-medium leading-relaxed">"{review.text}"</p>
                      <div className="flex flex-col items-center gap-3 mt-auto">
                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 overflow-hidden shadow-sm ring-4 ring-gray-50">
                          <img src={`https://ui-avatars.com/api/?name=${review.image}&background=random`} alt={review.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base">{review.name}</h4>
                          <p className="text-xs text-gray-900 font-bold font-semibold">Verified Buyer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-primary-teal/20 py-10 md:py-16 relative overflow-hidden mt-8 md:mt-16 mb-4 md:mb-8">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-40 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-40 rounded-full translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white border border-gray-100 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all shadow-md">
              <div className="w-16 h-16 bg-primary-teal/30 rounded-full flex items-center justify-center mb-5 text-gray-900 shadow-sm">
                <Truck size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Free Shipping</h3>
              <p className="text-sm text-gray-600 font-medium">Free shipping on all orders over ₹999.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white border border-gray-100 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all shadow-md">
              <div className="w-16 h-16 bg-primary-teal/30 rounded-full flex items-center justify-center mb-5 text-gray-900 shadow-sm">
                <Clock size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">24/7 Support</h3>
              <p className="text-sm text-gray-600 font-medium">Contact us 24 hours a day, 7 days a week.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white border border-gray-100 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all shadow-md">
              <div className="w-16 h-16 bg-primary-teal/30 rounded-full flex items-center justify-center mb-5 text-gray-900 shadow-sm">
                <CreditCard size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Secure Payment</h3>
              <p className="text-sm text-gray-600 font-medium">We ensure secure payment processing.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white border border-gray-100 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all shadow-md">
              <div className="w-16 h-16 bg-primary-teal/30 rounded-full flex items-center justify-center mb-5 text-gray-900 shadow-sm">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">100% Money Back</h3>
              <p className="text-sm text-gray-600 font-medium">You have 30 days to Return items.</p>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
};

export default Home;
