import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Search, Eye, Filter, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-indigo-100 text-indigo-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    const icons = {
        pending: Clock,
        processing: Clock,
        shipped: Truck,
        delivered: CheckCircle,
        cancelled: XCircle,
    };

    const labels = {
        pending: 'En attente',
        processing: 'En cours',
        shipped: 'Expédié',
        delivered: 'Livré',
        cancelled: 'Annulé',
    };

    const Icon = icons[status] || Clock;

    return (
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            <Icon size={12} />
            {labels[status] || status}
        </span>
    );
};

export default function Index({ orders, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/orders', { search }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
                        <p className="text-gray-500">Suivez et gérez les commandes de vos clients.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                        <form onSubmit={handleSearch} className="relative w-full max-w-md text-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par N° commande, client..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none transition-all"
                            />
                        </form>
                        <div className="flex gap-2 text-sm">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors font-medium">
                                <Filter size={16} />
                                Filtres
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Commande</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Paiement</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors text-sm">
                                        <td className="px-6 py-4 font-mono font-bold text-forest-green">
                                            #{order.order_number}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.customer_name}</div>
                                            <div className="text-xs text-gray-400">{order.customer_email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.payment_status === 'paid' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                    order.payment_status === 'failed' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                        'bg-gray-50 text-gray-600 border border-gray-200'
                                                }`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {new Intl.NumberFormat('fr-FR').format(order.total)} F
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Voir détails"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            Affichage de {orders.from} à {orders.to} sur {orders.total} commandes
                        </span>
                        <div className="flex gap-2">
                            {orders.links.map((link, key) => (
                                link.url ? (
                                    <Link
                                        key={key}
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded-md text-xs transition-all ${link.active
                                            ? 'bg-forest-green text-white font-bold'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                            }`}
                                    />
                                ) : (
                                    <span
                                        key={key}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="px-3 py-1 rounded-md text-xs text-gray-300 pointer-events-none"
                                    ></span>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
