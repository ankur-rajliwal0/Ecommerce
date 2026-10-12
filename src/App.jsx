import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LoaderProvider } from './context/LoaderContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/store-control');

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const scrollToTop = () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    // Try immediately
    scrollToTop();
    
    // Try again after a short delay in case of async rendering/loading states
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#09090b', // Premium dark background
            color: '#fafafa', // Clean white text
            border: '1px solid #27272a', // Subtle border
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '16px 24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981', // Emerald green
              secondary: '#09090b',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // Red
              secondary: '#09090b',
            },
          },
        }}
      />
      {!isAdminRoute && <Navbar />}
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
          
          {/* Admin Routes */}
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
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    return () => {
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
