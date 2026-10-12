import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

import { X, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signUp(email, password, fullName);
      if (data?.user) {
        await supabase.from('profiles').upsert({ id: data.user.id, full_name: fullName, role: 'customer' });
      }
      toast.success('Account created successfully! Welcome!');
      navigate('/');
    } catch (err) {
      toast.error('Signup failed: ' + err.message);
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

      {/* Signup Card */}
      <div className="relative max-w-5xl w-full bg-white border border-border-gray rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse z-10 animate-fade-in-up">
        
        {/* Close Button - Mobile */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 z-50 md:hidden bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Right Side - Image/Branding (Reversed for variation) */}
        <div className="md:w-1/2 bg-gray-900 relative hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=1950&auto=format&fit=crop" 
            alt="Gift Boxes" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          <div className="relative h-full flex flex-col justify-end p-12 text-white">
            <h3 className="text-3xl font-bold mb-3 leading-tight">Join the community.</h3>
            <p className="text-gray-300 font-medium">Create an account to track your orders, save your favorite gifts, and checkout faster.</p>
          </div>
        </div>

        {/* Left Side - Form */}
        <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Create Account</h2>
            <p className="text-gray-500 font-medium">Join us today to start shopping.</p>
          </div>
          
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 font-medium">{error}</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Full Name</label>
              <input 
                type="text" 
                required 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="w-full p-3.5 bg-gray-50 border border-border-gray rounded-xl outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-all" 
                placeholder="Enter your full name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-3.5 bg-gray-50 border border-border-gray rounded-xl outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-all" 
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full p-3.5 bg-gray-50 border border-border-gray rounded-xl outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-all pr-12" 
                  placeholder="Create a password"
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
              className="w-full bg-primary-teal hover:bg-secondary-teal text-gray-900 font-bold py-4 px-4 rounded-xl mt-4 transition-colors disabled:opacity-70 shadow-lg shadow-primary-teal/20"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          
          <p className="text-center mt-8 text-sm font-medium text-gray-600">
            Already have an account? <Link to="/login" className="text-gray-900 font-bold font-bold hover:underline">Sign in instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
