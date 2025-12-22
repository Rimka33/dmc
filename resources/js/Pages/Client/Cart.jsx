import React, { useState, useContext } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { Trash2, ShoppingBag, Truck, Store } from 'lucide-react';

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, loading } = useContext(CartContext);
    const [couponCode, setCouponCode] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' or 'pickup'
    const navigate = useNavigate();

    const applyCoupon = () => {
        alert('Fonctionnalité de coupon bientôt disponible !');
    };

    const proceedToCheckout = () => {
        if (deliveryMethod === 'pickup') {
            // Skip verification, go directly to confirmation
            navigate('/checkout');
        } else {
            // Go to verification page
            navigate('/checkout');
        }
    };

    const handleRemove = async (productId) => {
        const result = await removeFromCart(productId);
        if (!result.success) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const result = await updateQuantity(productId, newQuantity);
        if (!result.success) {
            alert('Erreur lors de la mise à jour');
        }
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

    const shippingCost = deliveryMethod === 'delivery' ? (cart.shipping || 5000) : 0;
    const finalTotal = (cart.subtotal || 0) + shippingCost;

    return (
        <MainLayout>
            {/* Hero Banner */}
            <div className="relative h-56 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96">
                        <ShoppingBag className="w-full h-full text-white opacity-10" />
                    </div>
                </div>
                <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10">
                    <h1 className="text-5xl font-black text-neon-green uppercase mb-3 tracking-tight">PANIER</h1>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
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
                                <div className="h-full bg-neon-green transition-all duration-500" style={{ width: '33%' }}></div>
                            </div>

                            <div className="relative flex flex-col items-center bg-white px-2 z-10">
                                <div className="w-10 h-10 rounded-full bg-neon-green flex items-center justify-center text-black font-black mb-2 shadow-lg">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">Panier</span>
                            </div>

                            <div className="relative flex flex-col items-center bg-white px-2 z-10">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-black mb-2">
                                    2
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Vérification</span>
                            </div>

                            <div className="relative flex flex-col items-center bg-white px-2 z-10">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-black mb-2">
                                    3
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Confirmation</span>
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
                            <h2 className="text-3xl font-black text-gray-900 mb-3 uppercase">Votre panier est vide</h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">Découvrez notre sélection de produits premium.</p>
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
                                        {cart.items.map((item) => (
                                            <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors">
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
                                                            <img
                                                                src={item.image_path || item.image || '/images/products/default.png'}
                                                                alt={item.name}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="font-bold text-gray-900 text-xs leading-tight mb-1 line-clamp-2">{item.name}</h3>
                                                            {item.sku && <p className="text-[7px] text-gray-400 font-medium">SKU: {item.sku}</p>}
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="col-span-1 md:col-span-2 text-center">
                                                        <span className="md:hidden text-[10px] text-gray-500 uppercase font-bold block mb-1">Prix</span>
                                                        <span className="font-bold text-gray-900 text-xs">{item.price_formatted || `${item.price} F CFA`}</span>
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="col-span-1 md:col-span-2 flex justify-center">
                                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.product_id || item.id, item.quantity - 1)}
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
                                                                onClick={() => handleUpdateQuantity(item.product_id || item.id, item.quantity + 1)}
                                                                className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Total */}
                                                    <div className="col-span-1 md:col-span-2 text-right">
                                                        <span className="md:hidden text-[10px] text-gray-500 uppercase font-bold block mb-1">Total</span>
                                                        <span className="font-black text-forest-green text-xs">
                                                            {item.total_formatted || `${(item.price * item.quantity).toLocaleString()} F CFA`}
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
                                            className="flex-1 md:w-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-forest-green transition-colors text-sm font-medium uppercase"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            className="px-6 py-3 bg-gray-900 text-white font-bold uppercase rounded-lg hover:bg-black transition-all text-xs tracking-wider"
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
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                                    <h2 className="text-md font-black text-gray-900 uppercase mb-6 pb-4 border-b">Total du panier</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-600">Sous-total</span>
                                            <span className="font-bold text-gray-900">{cart.subtotal_formatted || `${(cart.subtotal || 0).toLocaleString()} F CFA`}</span>
                                        </div>

                                        {/* Delivery Method Selection */}
                                        <div className="space-y-3 py-4 border-y">
                                            <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-3">Mode de récupération</p>

                                            <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${deliveryMethod === 'delivery' ? 'border-forest-green bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
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
                                                    <span className="text-sm font-bold text-gray-900 block">Livraison</span>
                                                    <span className="text-[10px] text-gray-500">5.000 F CFA</span>
                                                </div>
                                            </label>

                                            <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${deliveryMethod === 'pickup' ? 'border-forest-green bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
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
                                                    <span className="text-sm font-bold text-gray-900 block">Récupération en boutique</span>
                                                    <span className="text-[10px] text-gray-500">Gratuit</span>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900">
                                            <span className="text-lg font-black text-gray-900 uppercase">Total</span>
                                            <span className="text-2xl font-black text-neon-green">{finalTotal.toLocaleString()} F CFA</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={proceedToCheckout}
                                        className="w-full py-4 bg-forest-green text-white font-black uppercase rounded-lg hover:bg-dark-green transition-all shadow-lg text-sm tracking-wider"
                                    >
                                        Passer la commande
                                    </button>

                                    <div className="mt-6 flex items-center justify-center gap-3 opacity-40 grayscale">
                                        <img src="/images/payment/visa.png" alt="Visa" className="h-5" />
                                        <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-5" />
                                        <img src="/images/payment/wave.png" alt="Wave" className="h-5" />
                                        <img src="/images/payment/orange-money.png" alt="Orange Money" className="h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
