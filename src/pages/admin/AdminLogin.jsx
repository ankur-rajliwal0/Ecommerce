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
    <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative background elements matching subtle theme */}
      <div className="absolute top-0 w-full h-[40vh] bg-gradient-to-b from-[#344B38]/5 to-transparent"></div>
      
      {/* Login Card */}
      <div className="relative max-w-[420px] w-full bg-white rounded-2xl shadow-xl border border-[#DCC6A8] overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="px-10 pt-12 pb-6 text-center">
          <div className="w-16 h-16 bg-[#E9E9E0] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#DCC6A8]">
            <Shield size={32} className="text-[#344B38]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#292923] tracking-tight">Admin Control Panel</h2>
          <p className="text-[#829078] mt-2 font-medium text-sm">Please sign in to continue</p>
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
              <label className="text-xs font-bold text-[#292923] uppercase tracking-wider ml-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-[#DCC6A8] rounded-xl outline-none focus:border-[#344B38] focus:ring-4 focus:ring-[#344B38]/10 focus:bg-white text-[#292923] transition-all font-semibold placeholder:text-gray-400 placeholder:font-medium" 
                placeholder="admin@store.com"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#292923] uppercase tracking-wider ml-1">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-[#DCC6A8] rounded-xl outline-none focus:border-[#344B38] focus:ring-4 focus:ring-[#344B38]/10 focus:bg-white text-[#292923] transition-all font-semibold placeholder:text-gray-400 placeholder:font-medium" 
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#344B38] hover:bg-[#829078] text-white font-bold py-4 px-4 rounded-xl mt-4 transition-all duration-300 disabled:opacity-70 shadow-lg shadow-[#344B38]/20 hover:shadow-[#344B38]/40 transform hover:-translate-y-0.5"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center pt-6 border-t border-[#E9E9E0]">
            <button onClick={() => navigate('/')} className="text-sm text-[#829078] hover:text-[#344B38] font-bold transition-colors flex items-center justify-center gap-2 mx-auto group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Main Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
