import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutReceived from './pages/CheckoutReceived';
import Auth from './pages/Auth';
import Category from './pages/Category';
import Wishlist from './pages/Wishlist';
import UserDashboard from './pages/UserDashboard';
import Orders from './pages/Orders';
import Terms from './pages/Terms';
import Returns from './pages/Returns';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import ForgotPassword from './pages/ForgotPassword';

export default function App() {
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
                            <Route path="/login" element={<Navigate to="/connexion" replace />} />
                            <Route path="*" element={<Home />} />
                        </Routes>
                    </BrowserRouter>
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    );
}
