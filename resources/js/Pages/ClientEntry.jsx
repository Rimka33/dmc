import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { WishlistProvider } from '../contexts/WishlistContext';

import ScrollToTop from '../Components/ScrollToTop';

// Pages Client
import Home from './Client/Home';
import Shop from './Client/Shop';
import ProductDetail from './Client/ProductDetail';
import Contact from './Client/Contact';
import Cart from './Client/Cart';
import Checkout from './Client/Checkout';
import CheckoutReceived from './Client/CheckoutReceived';
import Auth from './Client/Auth';
import Category from './Client/Category';
import Wishlist from './Client/Wishlist';
import UserDashboard from './Client/UserDashboard';
import Orders from './Client/Orders';
import Terms from './Client/Terms';
import Returns from './Client/Returns';
import PrivacyPolicy from './Client/PrivacyPolicy';
import About from './Client/About';
import Blog from './Client/Blog';
import BlogPost from './Client/BlogPost';
import ForgotPassword from './Client/ForgotPassword';

export default function ClientEntry() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/produit/:id" element={<ProductDetail />} />

              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/received" element={<CheckoutReceived />} />

              {/* Auth Routes */}
              <Route path="/mon-compte" element={<UserDashboard />} />
              <Route path="/mes-commandes" element={<Orders />} />
              <Route path="/connexion" element={<Auth defaultMode="login" />} />
              <Route path="/inscription" element={<Auth defaultMode="register" />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/categorie/:slug" element={<Category />} />
              <Route path="/termes" element={<Terms />} />
              <Route path="/retours" element={<Returns />} />
              <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
              <Route path="/a-propos" element={<About />} />

              {/* Aliases for better SEO/UX */}
              <Route path="/login" element={<Navigate to="/mon-compte" replace />} />
              <Route path="/register" element={<Navigate to="/mon-compte" replace />} />

              {/* Fallback route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
