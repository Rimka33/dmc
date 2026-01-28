import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { authenticated } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [authenticated]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await api.get('/wishlist');
      setWishlist(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!authenticated) {
      return {
        success: false,
        message: 'Veuillez vous connecter pour ajouter à votre liste de souhaits.',
      };
    }

    try {
      const response = await api.post('/wishlist', { product_id: productId });
      await fetchWishlist();
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Erreur lors de l'ajout à la liste.",
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      await fetchWishlist();
      return { success: true, message: 'Produit retiré de la liste.' };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la suppression.' };
    }
  };

  const isInWishlist = (param) => {
    if (!param) return false;
    const id = typeof param === 'object' ? param.id || param.product_id : param;
    return wishlist.some(
      (item) => Number(item.product_id) === Number(id) || Number(item.id) === Number(id)
    );
  };

  const toggleWishlist = async (param) => {
    if (!param) return;
    const id = typeof param === 'object' ? param.id || param.product_id : param;

    if (isInWishlist(id)) {
      return await removeFromWishlist(id);
    } else {
      return await addToWishlist(id);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
