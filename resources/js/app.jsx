import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

// Pages Client
import Home from './Pages/Client/Home';
import Shop from './Pages/Client/Shop';
import ProductDetail from './Pages/Client/ProductDetail';
import Contact from './Pages/Client/Contact';
import Cart from './Pages/Client/Cart';
import Checkout from './Pages/Client/Checkout';
import CheckoutReceived from './Pages/Client/CheckoutReceived';
import Auth from './Pages/Client/Auth';
import Category from './Pages/Client/Category';
import Wishlist from './Pages/Client/Wishlist';
import UserDashboard from './Pages/Client/UserDashboard';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/produit/:id" element={<ProductDetail />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/panier" element={<Cart />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/checkout/received" element={<CheckoutReceived />} />

                            {/* Auth Routes */}
                            <Route path="/mon-compte" element={<UserDashboard />} />
                            <Route path="/connexion" element={<Auth defaultMode="login" />} />
                            <Route path="/inscription" element={<Auth defaultMode="register" />} />

                            <Route path="/categorie/:slug" element={<Category />} />

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

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
