import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function UserDashboard() {
    const { user, authenticated, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('orders');

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

    if (loading || !user) return (
        <MainLayout>
            <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-forest-green"></div>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            <div className="py-16 bg-[#011a0a] relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 rounded-full bg-forest-green flex items-center justify-center border-4 border-neon-green/20 shadow-xl overflow-hidden">
                            {user.avatar ? <img src={user.avatar} alt={user.name} /> : <span className="text-4xl font-black text-white">{user.name.charAt(0)}</span>}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1">Bonjour, {user.name}</h1>
                            <p className="text-neon-green font-bold text-sm tracking-widest uppercase opacity-70">Membre depuis {new Date(user.created_at).getFullYear()}</p>
                        </div>
                        <div className="md:ml-auto flex gap-4">
                            <button onClick={logout} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-white/10">
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="lg:w-1/4">
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-32">
                            <nav className="space-y-2">
                                {[
                                    { id: 'orders', label: 'Commandes', icon: 'shopping-bag' },
                                    { id: 'profile', label: 'Profil', icon: 'user' },
                                    { id: 'addresses', label: 'Adresses', icon: 'map-pin' },
                                    { id: 'wishlist', label: 'Wishlist', icon: 'heart', link: '/wishlist' }
                                ].map(item => (
                                    item.link ? (
                                        <Link
                                            key={item.id}
                                            to={item.link}
                                            className="flex items-center gap-4 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-400 hover:text-forest-green hover:bg-forest-green/5 transition-all"
                                        >
                                            <i className={`icon-${item.icon} text-lg`}></i>
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-forest-green text-white shadow-lg shadow-forest-green/20 scale-[1.02]' : 'text-gray-400 hover:text-forest-green hover:bg-forest-green/5'}`}
                                        >
                                            <i className={`icon-${item.icon} text-lg`}></i>
                                            {item.label}
                                        </button>
                                    )
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="lg:w-3/4">
                        {activeTab === 'orders' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Mes <span className="text-forest-green">Commandes</span></h2>

                                {ordersLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-forest-green"></div>
                                    </div>
                                ) : orders.length > 0 ? (
                                    <div className="grid gap-6">
                                        {orders.map(order => (
                                            <div key={order.id} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-neon-green/50 transition-all group">
                                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Nº {order.order_number}</span>
                                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'delivered' ? 'bg-neon-green/10 text-forest-green' :
                                                                    order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                                                }`}>
                                                                {order.status_label || order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-500">Passée le {new Date(order.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end gap-2">
                                                        <span className="text-2xl font-black text-gray-900">{order.total_formatted || order.total}</span>
                                                        <Link to={`/checkout/received?order=${order.order_number}`} className="text-[10px] font-black text-forest-green uppercase tracking-widest hover:underline">Voir les détails →</Link>
                                                    </div>
                                                </div>
                                                <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-xl p-2 border border-gray-100 relative group-hover:border-neon-green/20 transition-all">
                                                            <img src={item.product?.primary_image || '/images/products/default.png'} alt="" className="w-full h-full object-contain" />
                                                            {item.quantity > 1 && <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">x{item.quantity}</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-12 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
                                        <i className="icon-shopping-bag text-5xl text-gray-200 mb-6 block"></i>
                                        <p className="text-gray-500 font-bold mb-8">Vous n'avez pas encore passé de commande.</p>
                                        <Link to="/shop" className="px-10 py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-forest-green transition-all shadow-xl shadow-gray-200/50">
                                            Boutique
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-8">Informations du <span className="text-forest-green">Profil</span></h2>
                                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                                    <form className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nom complet</label>
                                                <input type="text" defaultValue={user.name} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Adresse Email</label>
                                                <input type="email" defaultValue={user.email} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl opacity-50 cursor-not-allowed font-bold text-gray-900" disabled />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Téléphone</label>
                                                <input type="text" defaultValue={user.phone} placeholder="+221 ..." className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900" />
                                            </div>
                                        </div>
                                        <button className="px-10 py-5 bg-forest-green text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-dark-green transition-all shadow-xl shadow-forest-green/20">
                                            Enregistrer les modifications
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Mes <span className="text-forest-green">Adresses</span></h2>
                                    <button className="px-6 py-3 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-forest-green transition-all">Ajouter</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-8 bg-white border-2 border-forest-green rounded-[2rem] shadow-xl shadow-forest-green/5 relative overflow-hidden group">
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-forest-green transition-all"><i className="icon-edit"></i></button>
                                            <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"><i className="icon-trash-2"></i></button>
                                        </div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-[9px] font-black text-white bg-forest-green px-3 py-1 rounded-full uppercase tracking-wider">Défaut</span>
                                        </div>
                                        <p className="font-bold text-gray-900 mb-2">{user.name}</p>
                                        <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">{user.address || 'Aucune adresse renseignée'}<br />{user.city}, {user.postal_code}</p>
                                        <p className="text-xs font-black text-gray-900">{user.phone}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
