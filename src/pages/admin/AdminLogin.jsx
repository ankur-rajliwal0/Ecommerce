import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await signIn(email, password);
      
      // Fetch profile to verify admin role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      if (profileData?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin privileges required.");
      }
      
      toast.success('Welcome to Admin Portal!');
      navigate('/store-control');
    } catch (err) {
      toast.error('Login failed: ' + err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative background elements matching dashboard subtle theme */}
      <div className="absolute top-0 w-full h-[40vh] bg-gradient-to-b from-primary-teal/5 to-transparent"></div>
      
      {/* Login Card */}
      <div className="relative max-w-[420px] w-full bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="px-10 pt-12 pb-6 text-center">
          <div className="w-16 h-16 bg-primary-teal/10 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary-teal/20">
            <Shield size={32} className="text-gray-900 font-bold" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Admin Control Panel</h2>
          <p className="text-gray-500 mt-2 font-medium text-sm">Please sign in to continue</p>
        </div>
        
        <div className="px-10 pb-10">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 font-semibold text-center flex items-center justify-center gap-2">
              <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">!</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-teal focus:ring-4 focus:ring-primary-teal/10 focus:bg-white text-gray-900 transition-all font-semibold placeholder:text-gray-400 placeholder:font-medium" 
                placeholder="admin@store.com"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-teal focus:ring-4 focus:ring-primary-teal/10 focus:bg-white text-gray-900 transition-all font-semibold placeholder:text-gray-400 placeholder:font-medium" 
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gray-900 hover:bg-primary-teal text-gray-900 font-bold py-4 px-4 rounded-xl mt-4 transition-all duration-300 disabled:opacity-70 shadow-lg shadow-gray-200 hover:shadow-primary-teal/30 transform hover:-translate-y-0.5"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-900 font-bold font-bold transition-colors flex items-center justify-center gap-2 mx-auto group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Main Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
