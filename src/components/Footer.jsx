import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Camera, Share2, MapPin, Phone, Mail } from 'lucide-react';
import logo from '../assets/veltrix-logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#292923] text-[#F8F6F1] pt-16 pb-8 border-t border-[#344B38] mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-8 lg:gap-12 mb-10">
          
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-6 block inline-block">
              <img src={logo} alt="Veltrix" className="h-12 md:h-14 w-auto object-contain brightness-110" />
            </Link>
            <p className="text-[#E9E9E0]/80 text-sm mb-6 leading-relaxed max-w-sm">
              We are a premium e-commerce brand delivering the best fashion, furniture, and gifts right to your doorstep.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-[#344B38] text-[#F8F6F1] rounded-full flex items-center justify-center hover:bg-[#829078] hover:text-white transition-colors">
                <Globe size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-[#344B38] text-[#F8F6F1] rounded-full flex items-center justify-center hover:bg-[#829078] hover:text-white transition-colors">
                <MessageCircle size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-[#344B38] text-[#F8F6F1] rounded-full flex items-center justify-center hover:bg-[#829078] hover:text-white transition-colors">
                <Camera size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-[#344B38] text-[#F8F6F1] rounded-full flex items-center justify-center hover:bg-[#829078] hover:text-white transition-colors">
                <Share2 size={16} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-[#DCC6A8] font-bold mb-4 text-base md:text-lg">Quick Links</h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#E9E9E0]/80">
              <li><Link to="/products" className="hover:text-[#DCC6A8] transition-colors">Shop Products</Link></li>
              <li><Link to="/products" className="hover:text-[#DCC6A8] transition-colors">Categories</Link></li>
              <li><Link to="/products" className="hover:text-[#DCC6A8] transition-colors">Super Deals</Link></li>
              <li><Link to="/about" className="hover:text-[#DCC6A8] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#DCC6A8] transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-[#DCC6A8] font-bold mb-4 text-base md:text-lg">Support</h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#E9E9E0]/80">
              <li><Link to="/profile" className="hover:text-[#DCC6A8] transition-colors">My Account</Link></li>
              <li><Link to="/my-orders" className="hover:text-[#DCC6A8] transition-colors">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-[#DCC6A8] transition-colors">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-[#DCC6A8] transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="hover:text-[#DCC6A8] transition-colors">Shipping Info</Link></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-[#DCC6A8] font-bold mb-4 text-base md:text-lg">Contact Us</h4>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm text-[#E9E9E0]/80">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#829078] shrink-0 mt-0.5" />
                <span>1234 Commerce St, Suite 100<br />New York, NY 10011</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#829078] shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#829078] shrink-0" />
                <span>support@veltrix.com</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-6 border-t border-[#344B38]/60 flex flex-col-reverse md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-[#E9E9E0]/60 text-center">
          <p>© {new Date().getFullYear()} Veltrix. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-[#DCC6A8] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#DCC6A8] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
