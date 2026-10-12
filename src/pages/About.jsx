import React from 'react';
import { Heart, Package, ShieldCheck, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-teal opacity-20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-teal opacity-10 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Our Story</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-300 leading-relaxed font-medium">
            From a small boutique to your favorite online destination for premium fashion, unique gifts, and elegant furniture. We believe in bringing joy to your everyday life.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">More Than Just a Store</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
              At Lovora, we don't just sell products; we deliver experiences. What started in 2020 as a passion project for curating the perfect gifts has now blossomed into a full-scale lifestyle brand.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Every item in our collection is hand-picked by our dedicated team of designers and trend-spotters. Whether you're looking for that perfect dress for a special occasion, a thoughtful gift for a loved one, or a statement piece for your living room, we've got you covered.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square md:aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Our Store" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hidden md:block">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-orange-100 text-gray-900 rounded-full flex items-center justify-center">
                  <Star size={32} fill="currentColor" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-gray-900">50k+</p>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Our Core Values</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">The principles that guide everything we do and every product we ship.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100 group">
            <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-900 font-bold mb-6 group-hover:bg-primary-teal group-hover:text-gray-900 transition-colors">
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Made with Love</h3>
            <p className="text-gray-600 leading-relaxed font-medium">We pour our hearts into selecting every single product, ensuring it meets our sky-high standards for quality and aesthetics.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100 group">
            <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-900 font-bold mb-6 group-hover:bg-primary-teal group-hover:text-gray-900 transition-colors">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Uncompromising Quality</h3>
            <p className="text-gray-600 leading-relaxed font-medium">We partner strictly with ethical manufacturers and artisans who share our commitment to true craftsmanship and extreme durability.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100 group">
            <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-900 font-bold mb-6 group-hover:bg-primary-teal group-hover:text-gray-900 transition-colors">
              <Package size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Delightful Unboxing</h3>
            <p className="text-gray-600 leading-relaxed font-medium">The experience doesn't end at checkout. We've designed our packaging to make every delivery feel like opening a precious gift.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
