import React, { useContext } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../../contexts/WishlistContext';
import { CartContext } from '../../contexts/CartContext';
import { Heart, Trash2 } from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';

export default function Wishlist() {
  const { wishlist, loading, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async (product) => {
    const result = await addToCart(product.id, 1);
    if (result.success) {
      removeFromWishlist(product.id);
    }
  };

  return (
    <MainLayout>
      {/* Hero Banner */}
      <div className="relative h-56 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/back.jpg"
            alt="wishlist banner"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10">
          <h1 className="text-5xl font-black text-neon-green uppercase mb-3 tracking-tight">
            WISHLIST
          </h1>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Link to="/" className="hover:text-neon-green transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-neon-green font-bold">Ma Liste de Souhaits</span>
          </div>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-forest-green"></div>
            </div>
          ) : wishlist.length > 0 ? (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Produit
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Prix
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Statut Stock
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Actions
                      </th>
                      <th className="px-8 py-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {wishlist.map((item) => {
                      const product = item.product || item; // Depend sur le format du backend Resource
                      return (
                        <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-6">
                              <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 flex-shrink-0">
                                <ShimmerImage
                                  src={product.primary_image || '/images/products/default.png'}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                  fallback={'/images/products/default.png'}
                                />
                              </div>
                              <div>
                                <Link
                                  to={`/produit/${product.id}`}
                                  className="font-black text-gray-900 hover:text-forest-green transition-colors text-lg uppercase tracking-tight"
                                >
                                  {product.name}
                                </Link>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                                  {product.category_name || 'Informatique'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xl font-black text-forest-green font-mono">
                              {product.price_formatted}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span
                              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock_quantity > 0 ? 'bg-neon-green/10 text-forest-green' : 'bg-red-50 text-red-500'}`}
                            >
                              {product.stock_quantity > 0 ? 'En Stock' : 'Rupture'}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock_quantity <= 0}
                              className="px-6 py-3 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-forest-green transition-all shadow-lg active:scale-95 disabled:opacity-30"
                            >
                              Ajouter au panier
                            </button>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button
                              onClick={() => removeFromWishlist(product.id)}
                              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Heart className="w-12 h-12 text-gray-200" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
                Votre liste est vide
              </h2>
              <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                Vous n'avez pas encore de produits coup de cœur. Parcourez notre catalogue pour
                trouver les meilleures offres.
              </p>
              <Link
                to="/shop"
                className="inline-block px-10 py-5 bg-forest-green text-white font-black uppercase rounded-2xl hover:bg-dark-green transition-all shadow-xl shadow-forest-green/20"
              >
                Continuer mes achats
              </Link>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
