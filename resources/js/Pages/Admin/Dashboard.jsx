import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import {
    ShoppingBag,
    ShoppingCart,
    Users,
    DollarSign,
    ArrowUpRight,
    Package,
    AlertTriangle
} from 'lucide-react';

export default function Dashboard({ stats }) {
    const statCards = [
        {
            name: 'Produits',
            value: stats.total_products,
            icon: ShoppingBag,
            color: 'bg-blue-500',
            label: 'Total produits en ligne'
        },
        {
            name: 'Commandes',
            value: stats.total_orders,
            icon: ShoppingCart,
            color: 'bg-green-500',
            label: 'Commandes passées'
        },
        {
            name: 'Clients',
            value: stats.total_customers,
            icon: Users,
            color: 'bg-purple-500',
            label: 'Utilisateurs inscrits'
        },
        {
            name: 'Revenus',
            value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(stats.revenue || 0),
            icon: DollarSign,
            color: 'bg-amber-500',
            label: 'Chiffre d\'affaires total'
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Welcome */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                    <p className="text-gray-500">Vue d'ensemble de votre boutique e-commerce.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${card.color} p-3 rounded-lg text-white`}>
                                        <Icon size={24} />
                                    </div>
                                    <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                        <ArrowUpRight size={12} />
                                        Stable
                                    </span>
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium">{card.name}</h3>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                                <p className="text-xs text-gray-400 mt-2">{card.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <Package size={18} className="text-blue-500" />
                                Dernières Commandes
                            </h2>
                            <button className="text-forest-green text-sm font-semibold hover:underline">Voir tout</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">N° Commande</th>
                                        <th className="px-6 py-4">Client</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {stats.recent_orders.length > 0 ? stats.recent_orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">#{order.order_number || order.id}</td>
                                            <td className="px-6 py-4 text-gray-600">{order.customer_name || 'Client'}</td>
                                            <td className="px-6 py-4 font-bold text-gray-900">{order.total} F</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">Aucune commande récente</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2 text-red-600">
                                <AlertTriangle size={18} />
                                Alertes de Stock
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {stats.low_stock_products.length > 0 ? stats.low_stock_products.map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded border border-red-200 flex items-center justify-center overflow-hidden">
                                            <ShoppingBag size={20} className="text-red-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{product.name}</h4>
                                            <p className="text-xs text-red-600 font-semibold">Stock critique: {product.stock_quantity}</p>
                                        </div>
                                    </div>
                                    <button className="px-3 py-1 bg-white border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-600 hover:text-white transition-colors">
                                        Réapprovisionner
                                    </button>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-400">
                                    <Package size={32} className="mx-auto mb-2 opacity-20" />
                                    <p>Tout est en stock !</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Banner */}
                <div className="bg-gradient-to-r from-forest-green to-neon-green rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-neon-green/10">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold">Bienvenue dans votre Dashboard Premium</h3>
                        <p className="text-white/80 max-w-lg">
                            Gérez vos produits, suivez vos ventes et optimisez votre boutique DMC Computer en toute simplicité.
                        </p>
                    </div>
                    <Link href="/" className="px-6 py-3 bg-white text-forest-green font-bold rounded-xl hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-sm">
                        <ArrowUpRight size={18} />
                        Voir la boutique
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
