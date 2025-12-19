import React, { useState, useContext } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, loading } = useContext(CartContext);
    const [couponCode, setCouponCode] = useState('');
    const navigate = useNavigate();

    const applyCoupon = () => {
        alert('Fonctionnalité de coupon bientôt disponible !');
    };

    const proceedToCheckout = () => {
        navigate('/checkout');
    };

    if (loading && cart.items.length === 0) {
        return (
            <MainLayout>
                <div className="flex justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* Hero Banner */}
            <div className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, rgba(1, 26, 10, 0.9), rgba(1, 26, 10, 0.7)), url(/images/cart-bg.jpg) center/cover' }}>
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-neon-green uppercase mb-4 tracking-widest italic">PANIER</h1>
                    <div className="flex items-center justify-center gap-2 text-white text-sm font-medium">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-neon-green font-bold">Panier</span>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <section className="py-10 bg-gray-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 -z-10"></div>

                        <div className="flex flex-col items-center bg-gray-50 px-4">
                            <div className="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center text-white font-bold mb-2 shadow-lg ring-4 ring-white">
                                1
                            </div>
                            <span className="text-xs font-bold text-gray-900 uppercase">PANIER</span>
                        </div>

                        <div className="flex flex-col items-center bg-gray-50 px-4">
                            <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-400 font-bold mb-2">
                                2
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase">VÉRIFICATION</span>
                        </div>

                        <div className="flex flex-col items-center bg-gray-50 px-4">
                            <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-400 font-bold mb-2">
                                3
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase">CONFIRMATION</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cart Content */}
            <section className="py-16 bg-white min-h-[600px]">
                <div className="container mx-auto px-4">
                    {!cart.items || cart.items.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 max-w-4xl mx-auto">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <i className="icon-cart-empty text-4xl text-gray-300"></i>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">Il semble que vous n'ayez pas encore ajouté de produits. Découvrez notre sélection de matériel informatique premium.</p>
                            <Link
                                to="/shop"
                                className="inline-block px-10 py-4 bg-forest-green text-white font-bold uppercase rounded shadow-xl hover:bg-dark-green hover:-translate-y-1 transition-all active:scale-95"
                            >
                                Continuer vos achats
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
                            {/* Cart Items */}
                            <div className="lg:col-span-8">
                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
                                    {/* Table Header - Desktop Only */}
                                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-5 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 text-xs uppercase tracking-wider">
                                        <div className="col-span-6">PRODUIT</div>
                                        <div className="col-span-2 text-center">PRIX</div>
                                        <div className="col-span-2 text-center">QUANTITÉ</div>
                                        <div className="col-span-2 text-right">TOTAL</div>
                                    </div>

                                    {/* Items List */}
                                    <div className="divide-y divide-gray-100">
                                        {cart.items.map((item) => (
                                            <div key={item.id} className="p-6 transition-colors hover:bg-gray-50/50">
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                                    {/* Product Info */}
                                                    <div className="col-span-1 md:col-span-6 flex items-center gap-5">
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                            title="Supprimer"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </button>
                                                        <div className="w-24 h-24 bg-gray-50 rounded-lg p-2 flex items-center justify-center flex-shrink-0 border border-gray-100">
                                                            <img
                                                                src={item.image_path || '/images/products/default.png'}
                                                                alt={item.name}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 leading-snug mb-1">{item.name}</h3>
                                                            {item.sku && <p className="text-xs text-gray-400">SKU: {item.sku}</p>}
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="col-span-1 md:col-span-2 text-center">
                                                        <span className="md:hidden text-xs text-gray-500 uppercase font-bold block mb-1">Prix Unitaire</span>
                                                        <span className="font-bold text-gray-900">{item.price_formatted}</span>
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="col-span-1 md:col-span-2 flex flex-col items-center">
                                                        <span className="md:hidden text-xs text-gray-500 uppercase font-bold block mb-2">Quantité</span>
                                                        <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="px-3 py-1 hover:bg-gray-100 transition-colors text-lg font-bold"
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                value={item.quantity}
                                                                className="w-10 text-center border-x-2 border-gray-200 py-1 bg-transparent font-bold text-gray-900"
                                                            />
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="px-3 py-1 hover:bg-gray-100 transition-colors text-lg font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Total */}
                                                    <div className="col-span-1 md:col-span-2 text-right">
                                                        <span className="md:hidden text-xs text-gray-500 uppercase font-bold block mb-1">Total Ligne</span>
                                                        <span className="font-bold text-forest-green text-lg">{item.total_formatted}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Cart Actions */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-2">
                                    <div className="flex w-full md:w-auto gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="CODE PROMO"
                                            className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-forest-green transition-colors font-bold text-sm tracking-widest uppercase"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            className="px-8 py-3 bg-gray-900 text-white font-bold uppercase rounded-lg hover:bg-black transition-all shadow-md active:scale-95 text-xs tracking-wider"
                                        >
                                            APPLIQUER
                                        </button>
                                    </div>

                                    <Link
                                        to="/shop"
                                        className="text-forest-green font-bold uppercase text-sm tracking-widest hover:underline flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Continuer vos achats
                                    </Link>
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="lg:col-span-4">
                                <div className="bg-gray-900 rounded-2xl p-8 text-white sticky top-28 shadow-2xl">
                                    <h2 className="text-2xl font-bold mb-8 uppercase italic border-b border-white/10 pb-4">RÉCAPITULATIF</h2>

                                    <div className="space-y-6 mb-8">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 font-medium">Sous-total</span>
                                            <span className="font-bold text-xl">{cart.subtotal_formatted}</span>
                                        </div>

                                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                            <div>
                                                <span className="text-gray-400 font-medium block">Expédition</span>
                                                <span className="text-xs text-neon-green">Livraison standard incluse</span>
                                            </div>
                                            <span className="font-bold">{cart.shipping_formatted}</span>
                                        </div>

                                        <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                            <span className="text-xl font-bold text-neon-green">TOTAL</span>
                                            <span className="text-3xl font-bold text-neon-green">{cart.total_formatted}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={proceedToCheckout}
                                        className="w-full py-5 bg-neon-green text-black font-extrabold uppercase rounded-xl hover:bg-white hover:-translate-y-1 transition-all shadow-xl active:scale-95 text-lg tracking-tighter"
                                    >
                                        Passer à la commande
                                    </button>

                                    <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale saturate-0">
                                        <img src="/images/payment/visa.png" alt="Visa" className="h-6" />
                                        <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-6" />
                                        <img src="/images/payment/wave.png" alt="Wave" className="h-6" />
                                        <img src="/images/payment/orange-money.png" alt="Orange Money" className="h-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout >
    );
}
