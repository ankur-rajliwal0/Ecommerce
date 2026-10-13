import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

import { X, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signIn(email, password);
      
      // Prevent admins from logging in through the user portal
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      if (profileData?.role === 'admin') {
        await supabase.auth.signOut();
        throw new Error("Admins can only login using the Admin Login portal.");
      }

      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error('Login failed: ' + err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1950&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
      </div>

      {/* Close Button - Desktop */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 right-6 z-50 hidden md:flex bg-white/20 hover:bg-white/40 text-white rounded-full p-3 backdrop-blur-md transition-all shadow-lg"
      >
        <X size={24} />
      </button>

      {/* Login Card */}
      <div className="relative max-w-5xl w-full bg-white border border-border-gray rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 animate-fade-in-up">
        
        {/* Close Button - Mobile */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 z-50 md:hidden bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side - Image/Branding */}
        <div className="md:w-1/2 bg-gray-900 relative hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1950&auto=format&fit=crop" 
            alt="Gift Crafts" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          <div className="relative h-full flex flex-col justify-end p-12 text-white">
            <h3 className="text-3xl font-bold mb-3 leading-tight">Handcrafted with love.</h3>
            <p className="text-gray-300 font-medium">Log in to discover unique gifts, custom crafts, and special offers created just for you.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-[#292923] mb-2 tracking-tight">Sign In</h2>
            <p className="text-[#829078] font-medium">Please enter your details to sign in.</p>
          </div>
          
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 font-medium">{error}</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#292923]">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-3.5 bg-[#F8F6F1] border border-[#DCC6A8]/60 rounded-xl outline-none focus:border-[#344B38] focus:ring-1 focus:ring-[#344B38] transition-all text-[#292923]" 
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-[#292923]">Password</label>
                <a href="#" className="text-xs font-semibold text-[#344B38] hover:text-[#829078]">Forgot Password?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full p-3.5 bg-[#F8F6F1] border border-[#DCC6A8]/60 rounded-xl outline-none focus:border-[#344B38] focus:ring-1 focus:ring-[#344B38] transition-all pr-12 text-[#292923]" 
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#344B38] hover:bg-[#829078] text-white font-bold py-4 px-4 rounded-xl mt-4 transition-colors disabled:opacity-70 shadow-lg shadow-[#344B38]/20"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <p className="text-center mt-8 text-sm font-medium text-gray-600">
            Don't have an account? <Link to="/signup" className="text-[#344B38] font-bold hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
