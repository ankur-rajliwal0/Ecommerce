import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const { signUp, user, loading: authLoading } = useAuth();
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
      const data = await signUp(email, password, fullName);
      if (data?.user) {
        await supabase.from('profiles').upsert({ id: data.user.id, full_name: fullName, role: 'customer' });
      }
      toast.success('Account enrolled successfully. Welcome to Veltrix.');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      toast.error('Enrollment failed: ' + err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-helvetica bg-[#c4c3b6]">
      {/* Vibrant Light Red Floral Blurred Background (Higher opacity & clarity) */}
      <div
        className="absolute inset-0 overflow-hidden cursor-pointer bg-[#c4c3b6]"
        onClick={() => navigate(redirectPath !== '/' ? redirectPath : '/')}
      >
        <img
          src="/images/auth_floral_bg.jpg"
          alt="Classical Floral Atmosphere"
          className="w-full h-full object-cover filter blur-[3px] sm:blur-[5px] scale-105 brightness-[1.08] contrast-[1.06]"
        />
        {/* Soft Vignette (Zero bleed-through, rich vibrant floral colors) */}
        <div className="absolute inset-0 bg-black/8 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15 pointer-events-none" />
      </div>

      {/* Floating Ambient Luxury Gradient Glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 sm:w-[520px] sm:h-[520px] rounded-full bg-gradient-to-br from-[#991b1b]/35 via-[#DCC6A8]/30 to-[#344B38]/20 filter blur-[70px] sm:blur-[110px] pointer-events-none animate-float-orb-1 z-0" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#344B38]/35 via-[#829078]/25 to-[#DCC6A8]/25 filter blur-[70px] sm:blur-[110px] pointer-events-none animate-float-orb-2 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[620px] sm:h-[620px] rounded-full bg-gradient-to-r from-[#DCC6A8]/20 via-[#991b1b]/15 to-[#344B38]/15 filter blur-[90px] sm:blur-[130px] pointer-events-none animate-pulse z-0" />

      {/* Close Button */}
      <button
        onClick={() => navigate(redirectPath !== '/' ? redirectPath : '/')}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 bg-[#e7e5e4] hover:bg-[#dfdcd5] text-[#000000] border border-[#dfdcd5] rounded-full p-2 sm:p-2.5 transition-colors cursor-pointer"
      >
        <X size={18} />
      </button>

      {/* Signup Card (Bone #e7e5e4 surface, 9px radius, boundary white line removed, shadow removed) */}
      <div className="relative max-w-4xl w-full bg-[#e7e5e4] border-0 rounded-[9px] overflow-hidden flex flex-col md:flex-row-reverse z-10 shadow-none">

        {/* Visual Panel: Craft Keepsakes & Gifting (Desktop Only) */}
        <div className="hidden md:flex md:w-1/2 bg-[#000000] relative md:min-h-[500px] overflow-hidden flex-col justify-between">
          <img
            src="/images/handmade_craft_banner.jpg"
            alt="Handcrafted Keepsakes & Gifting Atelier"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-[1.05]"
          />
          {/* Ambient overlay for text clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-black/40 to-black/20 pointer-events-none" />

          {/* Foreground content */}
          <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full min-h-[500px]">
            <div>
              <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center font-davinci text-sm md:text-base bg-black/40 backdrop-blur-md text-white">
                V
              </div>
            </div>

            <div className="mt-8">
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#DCC6A8] block mb-1 font-helvetica font-medium">
                CLIENT PRIVILEGES
              </span>
              <h3 className="font-davinci text-xl sm:text-2xl md:text-3xl font-medium mb-1.5 leading-tight text-[#ffffff]">
                Join the Gifting Atelier.
              </h3>
              <p className="text-xs text-[#d4d4d4] font-helvetica leading-relaxed hidden sm:block">
                Enjoy priority allocation on limited handmade craft suites, bespoke ceramic vessels, and custom wax-sealed folios.
              </p>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-[#e7e5e4]">
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#595855] block mb-1">
              REGISTRATION
            </span>
            <h2 className="font-davinci text-3xl font-medium text-[#000000] mb-1">
              Create Your Account
            </h2>

          </div>

          {error && (
            <div className="bg-[#dfdcd5]/60 text-red-800 p-3 rounded-[9px] mb-4 text-xs border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#595855]">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] text-xs text-[#000000] placeholder:text-[#808080]"
                placeholder="Eleanor Vance"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#595855]">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] text-xs text-[#000000] placeholder:text-[#808080]"
                placeholder="eleanor@domain.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#595855]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dfdcd5] rounded-[9px] outline-none focus:border-[#000000] pr-10 text-xs text-[#000000] placeholder:text-[#808080]"
                  placeholder="Minimum 6 characters"
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-5 text-xs text-[#595855]">
            Already have an account?{' '}
            <Link
              to={redirectPath !== '/' ? `/login?redirect=${encodeURIComponent(redirectPath)}` : '/login'}
              className="text-[#000000] underline font-medium"
            >
              Sign in to your account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
