import React, { useState, useContext, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Trash2, ShoppingBag, Truck, Store, Loader } from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';

export default function Cart() {
  const { user } = useContext(AuthContext);
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useContext(CartContext);
  const { showNotification } = useNotification();
  const [couponCode, setCouponCode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' or 'pickup'
  const navigate = useNavigate();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const applyCoupon = () => {
    showNotification('Fonctionnalité de coupon bientôt disponible !', 'info');
  };

  const proceedToCheckout = async () => {
    // Optimisation : Si "Retrait en boutique" et utilisateur connecté avec infos complètes -> Commande directe
    if (deliveryMethod === 'pickup' && user && user.phone) {
      setShowConfirmModal(true);
    } else {
      // Flux standard (Livraison OU Invité OU Infos manquantes)
      navigate('/checkout', { state: { deliveryMethod } });
    }
  };

  const handleConfirmPickup = async () => {
    setShowConfirmModal(false);
    setIsProcessing(true);
    try {
      // Construction de la commande simplifiée
      const orderData = {
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone,
        delivery_method: 'pickup',
        payment_method: 'cash_on_delivery', // Paiement au comptoir par défaut
        notes: 'Commande Express - Retrait Boutique',
        termsAccepted: true, // Auto-acceptation implicite via le confirm
      };

      const response = await import('../../services/api').then((module) =>
        module.default.post('/orders', orderData)
      );

      if (response.data.success) {
        await clearCart();
        showNotification('Commande express confirmée !', 'success');
        // Redirection vers "Mes Commandes" comme demandé par l'utilisateur
        navigate('/mes-commandes');
      }
    } catch (error) {
      console.error('Erreur commande express:', error);
      // En cas d'erreur (ex: validation), on redirige vers le checkout classique
      navigate('/checkout', { state: { deliveryMethod } });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async (productId) => {
    setIsUpdating(true);
    await removeFromCart(productId);
    setIsUpdating(false);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    await updateQuantity(productId, newQuantity);
    setIsUpdating(false);
  };

  if (loading && (!cart.items || cart.items.length === 0)) {
    return (
      <MainLayout>
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
        </div>
      </MainLayout>
    );
  }

  const currentSubtotal = Number(cart.subtotal) || 0;
  const shippingCost = deliveryMethod === 'delivery' ? Number(cart.shipping) || 5000 : 0;
  const finalTotal = currentSubtotal + shippingCost;

  return (
    <MainLayout>
      {/* Hero Banner */}
      <div className="relative h-56 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/back.jpg"
            alt="cart banner"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10">
          <h1 className="text-3xl font-black text-neon-green uppercase mb-3 tracking-tight">
            PANIER
          </h1>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Link to="/" className="hover:text-neon-green transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-neon-green font-bold">Panier</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-neon-green transition-all duration-500"
                  style={{ width: '33%' }}
                ></div>
              </div>

              <div className="relative flex flex-col items-center bg-white px-2 z-10">
                <div className="w-10 h-10 rounded-full bg-neon-green flex items-center justify-center text-black font-black mb-2 shadow-lg">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">
                  Panier
                </span>
              </div>

              <div className="relative flex flex-col items-center bg-white px-2 z-10">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-black mb-2">
                  2
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Vérification
                </span>
              </div>

              <div className="relative flex flex-col items-center bg-white px-2 z-10">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-black mb-2">
                  3
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Confirmation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12 bg-gray-50 min-h-[600px]">
        <div className="container mx-auto px-4">
          {!cart.items || cart.items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 max-w-2xl mx-auto shadow-sm">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-300" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3 uppercase">
                Votre panier est vide
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Découvrez notre sélection de produits premium.
              </p>
              <Link
                to="/shop"
                className="inline-block px-10 py-4 bg-forest-green text-white font-bold uppercase rounded-lg shadow-lg hover:bg-dark-green hover:-translate-y-1 transition-all"
              >
                Continuer vos achats
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    <div className="col-span-6">Produit</div>
                    <div className="col-span-2 text-center">Prix</div>
                    <div className="col-span-2 text-center">Quantité</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-100">
                    {cart.items.map((item, index) => (
                      <div
                        key={`cart-item-${item.id || item.product_id || index}`}
                        className="p-6 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          {/* Product Info */}
                          <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                            <button
                              onClick={() => handleRemove(item.product_id || item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                            <div className="w-20 h-20 bg-gray-50 rounded-lg p-2 flex items-center justify-center flex-shrink-0 border border-gray-100">
                              <ShimmerImage
                                src={
                                  item.image || item.image_path || '/images/products/default.png'
                                }
                                alt={item.name}
                                className="w-full h-full object-contain"
                                fallback={'/images/products/default.png'}
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-900 text-xs leading-tight mb-1 line-clamp-2">
                                {item.name}
                              </h3>
                              {item.sku && (
                                <p className="text-[7px] text-gray-400 font-medium">
                                  SKU: {item.sku}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="col-span-1 md:col-span-2 text-center">
                            <span className="md:hidden text-[10px] text-gray-500 uppercase font-bold block mb-1">
                              Prix
                            </span>
                            <span className="font-bold text-gray-900 text-xs">
                              {item.price_formatted || `${item.price} F CFA`}
                            </span>
                          </div>

                          {/* Quantity */}
                          <div className="col-span-1 md:col-span-2 flex justify-center">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.product_id || item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-bold"
                              >
                                -
                              </button>
                              <input
                                type="text"
                                readOnly
                                value={item.quantity}
                                className="w-6 text-center border-x border-gray-300 py-2 bg-white font-bold text-gray-900 text-sm"
                              />
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.product_id || item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Total */}
                          <div className="col-span-1 md:col-span-2 text-right">
                            <span className="md:hidden text-[10px] text-gray-500 uppercase font-bold block mb-1">
                              Total
                            </span>
                            <span className="font-black text-forest-green text-xs">
                              {item.total_formatted ||
                                `${(item.price * item.quantity).toLocaleString()} F CFA`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
                  <div className="flex w-full md:w-auto gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="CODE PROMO"
                      className="flex-1 md:w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-forest-green transition-colors text-sm font-medium uppercase"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-6 py-2 bg-gray-900 text-white font-bold uppercase rounded-lg hover:bg-black transition-all text-xs tracking-wider"
                    >
                      Appliquer
                    </button>
                  </div>

                  <Link
                    to="/shop"
                    className="text-forest-green font-bold uppercase text-xs tracking-wider hover:underline flex items-center gap-2"
                  >
                    ← Continuer vos achats
                  </Link>
                </div>
              </div>

              {/* Summary Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-2 sticky top-24">
                  <h2 className="text-sm font-black text-gray-900 uppercase mb-6 pb-4 border-b">
                    Total du panier
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Sous-total</span>
                      <span className="text-xs text-gray-900">
                        {cart.subtotal_formatted ||
                          `${(cart.subtotal || 0).toLocaleString()} F CFA`}
                      </span>
                    </div>

                    {/* Delivery Method Selection */}
                    <div className="space-y-3 py-4 border-y">
                      <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-3">
                        Mode de récupération
                      </p>

                      <label
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${deliveryMethod === 'delivery' ? 'border-forest-green bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value="delivery"
                          checked={deliveryMethod === 'delivery'}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="w-4 h-4 text-forest-green"
                        />
                        <Truck className="w-5 h-5 text-forest-green" />
                        <div className="flex-1">
                          <span className="text-xs font-bold text-gray-900 block">Livraison</span>
                          <span className="text-[10px] text-gray-500">
                            dépendra de votre position
                          </span>
                        </div>
                      </label>

                      <label
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${deliveryMethod === 'pickup' ? 'border-forest-green bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value="pickup"
                          checked={deliveryMethod === 'pickup'}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="w-4 h-4 text-forest-green"
                        />
                        <Store className="w-5 h-5 text-forest-green" />
                        <div className="flex-1">
                          <span className="text-xs font-bold text-gray-900 block">
                            Récupération en boutique
                          </span>
                          <span className="text-[10px] text-gray-500">Gratuit</span>
                        </div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900">
                      <span className="text-sm font-black text-gray-900 uppercase">Total</span>
                      <span
                        className={`text-1xl font-black text-neon-green transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}
                      >
                        {finalTotal.toLocaleString()} F CFA
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={proceedToCheckout}
                    disabled={isProcessing}
                    className="w-full py-4 bg-forest-green text-white font-black uppercase rounded-lg hover:bg-dark-green transition-all shadow-lg text-xs tracking-wider disabled:opacity-75 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      'Passer la commande'
                    )}
                  </button>

                  <div className="mt-6 flex items-center justify-center">
                    <img
                      src="/images/payment-methods.png"
                      alt="Moyens de paiement sécurisés"
                      className="h-6 object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowConfirmModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-forest-green" />
              </div>

              <h3 className="text-xl font-black text-gray-900 uppercase mb-2">
                Confirmer le retrait ?
              </h3>

              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Vous avez choisi de récupérer votre commande en boutique. Les articles seront
                réservés et disponibles immédiatement à notre showroom.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirmPickup}
                  className="w-full py-3.5 bg-forest-green text-white font-bold uppercase rounded-lg hover:bg-dark-green transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Oui, confirmer la commande
                </button>

                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full py-3.5 bg-gray-100 text-gray-600 font-bold uppercase rounded-lg hover:bg-gray-200 transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
