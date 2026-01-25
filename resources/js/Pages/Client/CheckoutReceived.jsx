import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { Check, Phone, Mail, Package } from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';

export default function CheckoutReceived() {
    const location = useLocation();
    const { authenticated } = useContext(AuthContext);
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
            <div className="relative h-56 bg-black overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/back.jpg"
                        alt="confirmation banner"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
                </div>
                <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10">
                    <div className="w-20 h-20 bg-neon-green rounded-full flex items-center justify-center mb-4 shadow-2xl">
                        <Check className="w-10 h-10 text-black" strokeWidth={3} />
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase mb-2 tracking-tight">Merci !</h1>
                    <p className="text-white/80 text-lg">Votre commande a été confirmée</p>
                </div>
            </div>

            {/* Progress Bar */}
            <section className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-5 left-0 right-0 h-1 bg-neon-green"></div>

                            <div className="relative flex flex-col items-center bg-white px-2 z-10">
                                <div className="w-10 h-10 rounded-full bg-neon-green flex items-center justify-center text-black font-black mb-2 shadow-lg">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">Panier</span>
                            </div>

                            <div className="relative flex flex-col items-center bg-white px-2 z-10">
                                <div className="w-10 h-10 rounded-full bg-neon-green flex items-center justify-center text-black font-black mb-2 shadow-lg">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">Vérification</span>
                            </div>

                            <div className="relative flex flex-col items-center bg-white px-2 z-10">
                                <div className="w-10 h-10 rounded-full bg-neon-green flex items-center justify-center text-black font-black mb-2 shadow-lg">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">Confirmation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Order Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Numéro de commande', value: order.order_number },
                            { label: 'Date', value: order.created_at_formatted || new Date(order.created_at).toLocaleDateString() },
                            { label: 'Total', value: order.total_formatted, highlight: true },
                            { label: 'Paiement', value: order.payment_method_formatted || 'À la livraison' }
                        ].map((item, idx) => (
                            <div key={`summary-${idx}`} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-2">{item.label}</span>
                                <span className={`text-base font-black ${item.highlight ? 'text-neon-green' : 'text-gray-900'}`}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b bg-gray-50">
                                    <h3 className="text-lg font-black text-gray-900 uppercase flex items-center gap-2">
                                        <Package className="w-5 h-5 text-forest-green" />
                                        Articles commandés
                                    </h3>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {order.items && order.items.map((item, index) => (
                                        <div key={`order-item-${item.id || index}-${item.product_id || ''}`} className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-lg p-2 border border-gray-100 flex-shrink-0">
                                                    <ShimmerImage
                                                        src={item.product?.primary_image || '/images/products/default.png'}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-contain"
                                                        fallback={'/images/products/default.png'}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm leading-tight mb-1">{item.product_name}</p>
                                                    <p className="text-xs text-gray-500">Quantité: <span className="text-forest-green font-bold">{item.quantity}</span></p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-gray-900">{item.subtotal_formatted || `${(item.price * item.quantity).toLocaleString()} F CFA`}</p>
                                                <p className="text-[10px] text-gray-400">{item.price_formatted || `${item.price.toLocaleString()} F CFA`} / unité</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gray-50 p-6 space-y-3 border-t">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Sous-total</span>
                                        <span className="font-bold text-gray-900">{order.subtotal_formatted}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Expédition</span>
                                        <span className="font-bold text-forest-green">{order.shipping_cost_formatted || '5.000 F CFA'}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-black pt-3 border-t-2 border-gray-900">
                                        <span className="text-gray-900 uppercase">Total</span>
                                        <span className="text-neon-green">{order.total_formatted}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-sm font-black text-gray-900 uppercase mb-4 pb-3 border-b">Adresse de livraison</h3>
                                <div className="space-y-3">
                                    <p className="text-base font-bold text-gray-900">{order.customer_name}</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">{order.shipping_address}</p>
                                    <p className="text-sm font-medium text-gray-900">{order.shipping_city}{order.shipping_postal_code ? `, ${order.shipping_postal_code}` : ''}</p>
                                    <div className="pt-3 mt-3 border-t space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="w-4 h-4 text-forest-green flex-shrink-0" />
                                            <span>{order.customer_phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-4 h-4 text-forest-green flex-shrink-0" />
                                            <span className="truncate">{order.customer_email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-forest-green rounded-xl p-6 text-white">
                                <h4 className="font-black uppercase mb-4 text-sm">Prochaines étapes</h4>
                                <ul className="space-y-3 text-sm">
                                    {[
                                        'Notre équipe vérifie votre commande',
                                        'Vous recevrez un appel de confirmation',
                                        'Livraison à l\'adresse indiquée'
                                    ].map((step, idx) => (
                                        <li key={`step-${idx}`} className="flex gap-3">
                                            <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold">{idx + 1}</span>
                                            <span className="opacity-90">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/"
                            className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-bold uppercase rounded-lg hover:bg-black transition-all shadow-lg text-center"
                        >
                            Retour à l'accueil
                        </Link>
                        {authenticated && (
                            <Link
                                to="/mes-commandes"
                                className="w-full sm:w-auto px-6 py-3 border-2 border-forest-green text-forest-green font-bold uppercase rounded-lg hover:bg-forest-green hover:text-white transition-all text-center"
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
