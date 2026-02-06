import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNotification } from './NotificationContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { showNotification } = useNotification();
  const [cart, setCart] = useState({
    items: [],
    count: 0,
    subtotal: 0,
    shipping: 5000,
    tax: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data.data);
    } catch (error) {
      console.error('Error fetching cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', { product_id: productId, quantity });
      setCart(response.data.data);
      showNotification('Produit ajouté au panier', 'success');
      return { success: true, message: 'Produit ajouté au panier' };
    } catch (error) {
      console.error('Error adding to cart', error);
      const message = error.response?.data?.message || "Erreur lors de l'ajout au panier";
      showNotification(message, 'error');
      return { success: false, message: message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await api.put(`/cart/update/${productId}`, { quantity });
      setCart(response.data.data);
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity', error);
      showNotification('Erreur lors de la mise à jour de la quantité', 'error');
      return { success: false };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await api.delete(`/cart/remove/${productId}`);
      setCart(response.data.data);
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart', error);
      showNotification('Erreur lors de la suppression du produit', 'error');
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart({
        items: [],
        count: 0,
        subtotal: 0,
        shipping: 5000,
        tax: 0,
        total: 0,
      });
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart', error);
      return { success: false };
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
