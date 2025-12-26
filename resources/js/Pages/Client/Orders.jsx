import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ShoppingBag, Package, ChevronRight, Calendar, CreditCard, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';

export default function Orders() {
    const { user, authenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        if (!loading && !authenticated) {
            navigate('/connexion');
        } else if (authenticated) {
            fetchOrders();
        }
    }, [authenticated, loading]);

    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            const response = await api.get('/orders/user/history');
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setOrdersLoading(false);
        }
    };

    if (loading) return (
        <MainLayout>
            <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            {/* Hero Section */}
            {/* Hero Banner */}
            <div className="relative h-56 bg-black overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/back.jpg"
                        alt="orders banner"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
                </div>
                <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10">
                    <h1 className="text-5xl font-black text-neon-green uppercase mb-3 tracking-tight">MES COMMANDES</h1>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <span>/</span>
                        <span className="text-neon-green font-bold">Historique</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    {ordersLoading ? (
                        <div className="flex justify-center py-24">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {orders.map(order => (
                                <Link
                                    key={order.id}
                                    to={`/checkout/received?order=${order.order_number}`}
                                    className="aspect-square bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-forest-green transition-all duration-300 group flex flex-col p-4 relative overflow-hidden"
                                >
                                    {/* Background accent */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-neon-green/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Status Badge */}
                                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[9px] font-bold uppercase z-10 ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {order.status_label || order.status}
                                    </span>

                                    {/* Top Section - Order Number & Icon */}
                                    <div className="flex items-start justify-between mb-3 relative z-10">
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Commande</p>
                                            <h3 className="text-xs font-black text-gray-900 uppercase break-words">#{order.order_number}</h3>
                                        </div>
                                        <div className="w-8 h-8 bg-forest-green/10 rounded-lg flex items-center justify-center text-forest-green flex-shrink-0">
                                            <Package className="w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Date & Payment */}
                                    <div className="text-[10px] text-gray-600 font-medium space-y-1 mb-3 flex-1 relative z-10">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3 text-forest-green flex-shrink-0" />
                                            <span>{new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <CreditCard className="w-3 h-3 text-forest-green flex-shrink-0" />
                                            <span className="truncate text-[9px]">{order.payment_method_formatted || 'À la livraison'}</span>
                                        </div>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="mb-3 relative z-10">
                                        <p className="text-[9px] text-gray-500 font-bold uppercase mb-1.5">Articles</p>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {order.items?.slice(0, 4).map((item, idx) => (
                                                <div key={idx} className="w-8 h-8 bg-gray-50 rounded-lg border border-gray-200 p-0.5 relative group/item flex-shrink-0" title={item.product_name}>
                                                    <ShimmerImage
                                                        src={item.product?.primary_image || '/images/products/default.png'}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-contain"
                                                        fallback={'/images/products/default.png'}
                                                    />
                                                    {item.quantity > 1 && (
                                                        <span className="absolute -top-1 -right-1 bg-forest-green text-white text-[7px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                                            {item.quantity}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                            {(order.items?.length || 0) > 4 && (
                                                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom Section - Total */}
                                    <div className="mt-auto pt-3 border-t border-gray-100 relative z-10">
                                        <p className="text-[9px] text-gray-500 font-bold uppercase mb-0.5">Total</p>
                                        <p className="text-lg font-black text-gray-900">{order.total_formatted}</p>
                                    </div>

                                    {/* Hover Arrow */}
                                    <div className="absolute bottom-4 right-4 w-6 h-6 bg-forest-green text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[3rem] p-24 text-center shadow-2xl shadow-gray-200/50 border border-gray-100 animate-in zoom-in duration-500">
                            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-dashed border-gray-100">
                                <ShoppingBag className="w-16 h-16 text-gray-200" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">Aucune commande trouvée</h2>
                            <p className="text-gray-500 font-bold mb-12 max-w-sm mx-auto">Vous n'avez pas encore passé de commande chez DMC. Découvrez notre catalogue pour commencer !</p>
                            <Link to="/shop" className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-forest-green transition-all shadow-2xl hover:shadow-forest-green/20">
                                <ShoppingBag className="w-4 h-4" /> Vers la Boutique
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
