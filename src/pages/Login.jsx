import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  React.useEffect(() => {
    if (!authLoading && user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, authLoading, navigate, redirectPath]);

  if (!authLoading && user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signIn(email, password);
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      if (profileData?.role === 'admin') {
        await supabase.auth.signOut();
        throw new Error("Admins can only login using the Admin Login portal.");
      }

      toast.success('Welcome back to the Salon');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      toast.error('Sign in failed: ' + err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-helvetica">
      {/* Dimmed Canvas Background */}
      <div 
        className="absolute inset-0 bg-[#c4c3b6]/90 backdrop-blur-sm"
        onClick={() => navigate(redirectPath !== '/' ? redirectPath : '/')}
      />

      {/* Close Button */}
      <button 
        onClick={() => navigate(redirectPath !== '/' ? redirectPath : '/')}
        className="absolute top-6 right-6 z-50 bg-[#e7e5e4] hover:bg-[#dfdcd5] text-[#000000] border border-[#dfdcd5] rounded-full p-2.5 transition-colors"
      >
        <X size={18} />
      </button>

      {/* Login Card (Bone #e7e5e4 surface, 9px radius, hairline border) */}
      <div className="relative max-w-4xl w-full bg-[#e7e5e4] border border-[#dfdcd5] rounded-[9px] overflow-hidden flex flex-col md:flex-row z-10 shadow-2xl">
        
        {/* Left Side: Classical Painting Reproduction */}
        <div className="md:w-1/2 bg-[#000000] relative hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85" 
            alt="Classical Renaissance Art" 
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
          />
          <div className="relative h-full flex flex-col justify-between p-10 text-[#ffffff] z-10 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent">
            <div className="w-8 h-8 rounded-full border border-[#ffffff] flex items-center justify-center font-davinci text-base">
              V
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#808080] block mb-2 font-helvetica">
                SALON ARCHIVE
              </span>
              <h3 className="font-davinci text-3xl font-medium mb-2 leading-tight">
                Curated with Florentine grace.
              </h3>
              <p className="text-xs text-[#808080] font-helvetica leading-relaxed">
                Enter your private folio to access seasonal botanical releases and bespoke orders.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#e7e5e4]">
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-1">
              AUTHENTICATION
            </span>
            <h2 className="font-davinci text-3xl font-medium text-[#000000] mb-1">
              Sign In to Your Folio
            </h2>
            <p className="text-xs text-[#595855]">Please enter your registered credentials.</p>
          </div>
          
          {error && (
            <div className="bg-[#dfdcd5]/60 text-red-800 p-3 rounded-[9px] mb-5 text-xs border border-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#595855]">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] text-xs text-[#000000] placeholder:text-[#808080]" 
                placeholder="name@domain.com"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase tracking-wider text-[#595855]">Password</label>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] pr-10 text-xs text-[#000000] placeholder:text-[#808080]" 
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#595855] hover:text-[#000000]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-pill-action w-full py-3 text-xs uppercase tracking-widest mt-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Folio'}
            </button>
          </form>
          
          <p className="text-center mt-6 text-xs text-[#595855]">
            New to the Salon?{' '}
            <Link 
              to={redirectPath !== '/' ? `/signup?redirect=${encodeURIComponent(redirectPath)}` : '/signup'} 
              className="text-[#000000] underline font-medium"
            >
              Create a collector account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
