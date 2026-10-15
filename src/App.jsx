import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WelcomeSplash from './components/WelcomeSplash';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import ProductDetails from './pages/ProductDetails';
import Shop from './pages/Shop';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminProductForm from './pages/admin/ProductForm';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminLogin from './pages/admin/AdminLogin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import About from './pages/About';
import Contact from './pages/Contact';
import Returns from './pages/Returns';
import Faq from './pages/Faq';
import Shipping from './pages/Shipping';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LoaderProvider } from './context/LoaderContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/store-control') || location.pathname.startsWith('/control-shop');

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const scrollToTop = () => {
      // 1. Reset Lenis smooth scroll inertia and force to 0 immediately
      if (window.lenis) {
        try {
          window.lenis.stop();
          window.lenis.scrollTo(0, { immediate: true, force: true });
          window.lenis.start();
        } catch {
          // ignore
        }
      }

      // 2. Native window and document scroll reset
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // 3. Recalculate GSAP ScrollTrigger positions for new page view
      ScrollTrigger.refresh();
    };

    // Immediate execution
    scrollToTop();

    // Single settled refresh after route transition & layout settles
    const t1 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(t1);
    };
  }, [location.pathname, location.search]);

  return (
    <div className="app-container flex flex-col min-h-screen overflow-x-hidden">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#000000', // Ink
            color: '#ffffff', // Paper
            border: '1px solid #dfdcd5', // Vellum
            borderRadius: '9px', // Cards radius
            fontSize: '12px',
            fontFamily: 'var(--font-helvetica)',
            fontWeight: '400',
            padding: '12px 20px',
            boxShadow: 'none',
          },
          success: {
            iconTheme: {
              primary: '#ffffff',
              secondary: '#000000',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      {!isAdminRoute && <WelcomeSplash />}
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartSidebar />}
      <div className={isAdminRoute ? "w-full" : "flex-1"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin Routes & Aliases */}
          <Route path="/control-shop" element={<Navigate to="/store-control" replace />} />
          <Route path="/control-shop/*" element={<Navigate to="/store-control" replace />} />
          <Route path="/store-control/login" element={<AdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/store-control" element={<AdminDashboard />} />
              <Route path="/store-control/categories" element={<AdminCategories />} />
              <Route path="/store-control/products" element={<AdminProducts />} />
              <Route path="/store-control/products/add" element={<AdminProductForm />} />
              <Route path="/store-control/products/edit/:id" element={<AdminProductForm />} />
              <Route path="/store-control/orders" element={<AdminOrders />} />
              <Route path="/store-control/users" element={<AdminUsers />} />
            </Route>
          </Route>
          
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/shipping" element={<Shipping />} />
          
          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.25,
    });

    window.lenis = lenis;

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerUpdate = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(tickerUpdate);
      window.lenis = null;
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <LoaderProvider>
            <AppContent />
          </LoaderProvider>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
