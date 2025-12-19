import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';

export default function CheckoutReceived() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderNumber = queryParams.get('order');

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderNumber) {
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [orderNumber]);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/orders/${orderNumber}`);
            if (response.data.success) {
                setOrder(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
                </div>
            </MainLayout>
        );
    }

    if (!order) {
        return (
            <MainLayout>
                <div className="py-24 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande non trouvée</h2>
                    <Link to="/" className="text-forest-green font-bold underline">Retour à l'accueil</Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* Hero Banner */}
            <div className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, rgba(1, 26, 10, 0.9), rgba(1, 26, 10, 0.7)), url(/images/cart-bg.jpg) center/cover' }}>
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-neon-green uppercase mb-4 tracking-widest italic">MERCI !</h1>
                    <div className="flex items-center justify-center gap-2 text-white text-sm">
                        <Link to="/" className="hover:text-neon-green">Accueil</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-neon-green font-bold uppercase">Commande confirmée</span>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16">
                        <div className="w-24 h-24 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-neon-green/20">
                            <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">VOTRE COMMANDE EST REÇUE !</h2>
                        <p className="text-gray-500 text-lg">Merci pour votre confiance. Nous avons bien reçu votre commande.</p>
                    </div>

                    {/* Order Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {[
                            { label: 'Numéro:', value: order.order_number },
                            { label: 'Date:', value: order.created_at_formatted },
                            { label: 'Total:', value: order.total_formatted, highlight: true },
                            { label: 'Paiement:', value: order.payment_method_formatted }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-center items-center text-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{item.label}</span>
                                <span className={`text-lg font-bold ${item.highlight ? 'text-forest-green' : 'text-gray-900'}`}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Order Items */}
                        <div className="lg:col-span-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-8 uppercase italic border-b-2 border-neon-green inline-block">Détails des articles</h3>

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 border border-gray-100 flex-shrink-0">
                                                <img
                                                    src={item.product?.primary_image || '/images/products/default.png'}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-tight mb-1">{item.product_name}</p>
                                                <p className="text-sm text-gray-400 font-medium">Quantité: <span className="text-forest-green">{item.quantity}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 text-lg">{item.subtotal_formatted}</p>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">{item.price_formatted} / unité</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="bg-gray-50 p-8 space-y-4">
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <span>Sous-total</span>
                                        <span className="font-bold text-gray-900">{order.subtotal_formatted}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <span>Expédition</span>
                                        <span className="font-bold text-forest-green">{order.shipping_cost_formatted}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-black pt-6 border-t border-gray-200">
                                        <span className="text-gray-900">MONTANT TOTAL</span>
                                        <span className="text-neon-green">{order.total_formatted}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="lg:col-span-4 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase italic">Adresse de livraison</h3>
                                <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl space-y-2">
                                    <p className="font-black text-neon-green uppercase text-sm tracking-widest border-b border-white/10 pb-2 mb-4">Destinataire</p>
                                    <p className="text-lg font-bold">{order.customer_name}</p>
                                    <p className="text-gray-400 text-sm leading-relaxed">{order.shipping_address}</p>
                                    <p className="text-gray-100 font-medium">{order.shipping_city}{order.shipping_postal_code ? `, ${order.shipping_postal_code}` : ''}</p>
                                    <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-2">
                                        <div className="flex items-center gap-3 text-sm">
                                            <i className="icon-phone text-neon-green"></i>
                                            <span>{order.customer_phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <i className="icon-mail text-neon-green"></i>
                                            <span className="truncate">{order.customer_email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-forest-green p-8 rounded-3xl text-white">
                                <h4 className="font-bold mb-4 uppercase italic">Prochaines étapes</h4>
                                <ul className="space-y-4 text-sm opacity-90">
                                    <li className="flex gap-3">
                                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                                        <span>Notre équipe vérifie actuellement votre commande.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                                        <span>Vous recevrez un appel de confirmation sous peu.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                                        <span>La livraison sera effectuée à l'adresse indiquée.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/"
                            className="w-full sm:w-auto px-12 py-4 bg-gray-900 text-white font-bold uppercase rounded-xl hover:bg-black transition-all shadow-lg active:scale-95 text-center"
                        >
                            Retour à l'accueil
                        </Link>
                        {authenticated && (
                            <Link
                                to="/commandes"
                                className="w-full sm:w-auto px-12 py-4 border-2 border-forest-green text-forest-green font-bold uppercase rounded-xl hover:bg-forest-green hover:text-white transition-all active:scale-95 text-center"
                            >
                                Mes commandes
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
