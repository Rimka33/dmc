import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import StatusBadge from '../../../Components/Admin/StatusBadge';
import { ArrowLeft, Save, Package, User, MapPin, CreditCard, Calendar } from 'lucide-react';

export default function Show({ order }) {
    const { data, setData, put, processing, errors } = useForm({
        status: order.status || 'pending',
        payment_status: order.payment_status || 'pending',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/orders/${order.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Optionnel: afficher un message de succès
            }
        });
    };

    const statusOptions = [
        { value: 'pending', label: 'En attente', color: 'yellow' },
        { value: 'processing', label: 'En traitement', color: 'blue' },
        { value: 'shipped', label: 'Expédiée', color: 'purple' },
        { value: 'delivered', label: 'Livrée', color: 'green' },
        { value: 'cancelled', label: 'Annulée', color: 'red' },
    ];

    const paymentStatusOptions = [
        { value: 'pending', label: 'En attente', color: 'yellow' },
        { value: 'paid', label: 'Payé', color: 'green' },
        { value: 'failed', label: 'Échoué', color: 'red' },
        { value: 'refunded', label: 'Remboursé', color: 'gray' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader
                    title={`Commande #${order.order_number || order.id}`}
                    subtitle={`Créée le ${new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}`}
                    breadcrumbs={['Commandes', `#${order.order_number || order.id}`]}
                    action={
                        <div className="flex items-center gap-3">
                            <a
                                href={`/admin/orders/${order.id}/invoice`}
                                target="_blank"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                Facture
                            </a>
                            <Link
                                href="/admin/orders"
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold"
                            >
                                <ArrowLeft size={18} />
                                Retour
                            </Link>
                        </div>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informations de la commande */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Package size={20} />
                                    Articles de la commande
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item, index) => (
                                        <div key={index} className="p-6 flex gap-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.product?.images?.[0] ? (
                                                    <img
                                                        src={item.product.images[0].image_path ? (item.product.images[0].image_path.startsWith('http') ? item.product.images[0].image_path : `/storage/${item.product.images[0].image_path}`) : '/images/products/default.png'}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = '/images/products/default.png'; }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Package size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 mb-1">{item.product?.name || 'Produit supprimé'}</h4>
                                                {item.product?.sku && (
                                                    <p className="text-xs text-gray-500 mb-2">SKU: {item.product.sku}</p>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">
                                                        Quantité: <span className="font-bold">{item.quantity}</span>
                                                    </span>
                                                    <span className="font-bold text-gray-900">
                                                        {new Intl.NumberFormat('fr-FR').format(item.price * item.quantity)} FCFA
                                                    </span>
                                                </div>
                                                {item.price && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Prix unitaire: {new Intl.NumberFormat('fr-FR').format(item.price)} FCFA
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-gray-500">
                                        Aucun article trouvé
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Informations client */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <User size={20} />
                                    Informations client
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Nom</p>
                                    <p className="font-bold text-gray-900">{order.customer_name || order.user?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                    <p className="text-gray-700">{order.customer_email || order.user?.email || 'N/A'}</p>
                                </div>
                                {order.customer_phone && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                                        <p className="text-gray-700">{order.customer_phone}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Adresse de livraison */}
                        {order.shipping_address && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <MapPin size={20} />
                                        Adresse de livraison
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {order.shipping_address}
                                        {order.shipping_city && `\n${order.shipping_city}`}
                                        {order.shipping_postal_code && `\n${order.shipping_postal_code}`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Colonne latérale - Statuts et actions */}
                    <div className="space-y-6">
                        {/* Modification des statuts */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Statuts de la commande</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Statut actuel */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Statut actuel
                                    </label>
                                    <div className="mb-3">
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none transition-all bg-white"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                                </div>

                                {/* Statut de paiement actuel */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Statut de paiement actuel
                                    </label>
                                    <div className="mb-3">
                                        <StatusBadge status={order.payment_status === 'paid' ? 'active' : order.payment_status === 'failed' ? 'inactive' : 'pending'}
                                            text={paymentStatusOptions.find(o => o.value === order.payment_status)?.label || order.payment_status} />
                                    </div>
                                    <select
                                        value={data.payment_status}
                                        onChange={e => setData('payment_status', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none transition-all bg-white"
                                    >
                                        {paymentStatusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.payment_status && <p className="text-red-500 text-xs mt-1">{errors.payment_status}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-forest-green text-white rounded-lg font-bold hover:bg-dark-green transition-colors shadow-lg shadow-forest-green/20 disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {processing ? 'Enregistrement...' : 'Mettre à jour les statuts'}
                                </button>
                            </div>
                        </form>

                        {/* Résumé financier */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <CreditCard size={20} />
                                    Résumé financier
                                </h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Sous-total</span>
                                    <span className="font-bold text-gray-900">
                                        {new Intl.NumberFormat('fr-FR').format(order.subtotal || 0)} FCFA
                                    </span>
                                </div>
                                {order.tax > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Taxe</span>
                                        <span className="font-bold text-gray-900">
                                            {new Intl.NumberFormat('fr-FR').format(order.tax)} FCFA
                                        </span>
                                    </div>
                                )}
                                {order.shipping_cost > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Livraison</span>
                                        <span className="font-bold text-gray-900">
                                            {new Intl.NumberFormat('fr-FR').format(order.shipping_cost)} FCFA
                                        </span>
                                    </div>
                                )}
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Réduction</span>
                                        <span className="font-bold text-red-600">
                                            -{new Intl.NumberFormat('fr-FR').format(order.discount)} FCFA
                                        </span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-gray-200 flex justify-between">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-xl font-black text-forest-green">
                                        {new Intl.NumberFormat('fr-FR').format(order.total || 0)} FCFA
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Informations supplémentaires */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar size={20} />
                                    Informations
                                </h3>
                            </div>
                            <div className="p-6 space-y-3 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Méthode de paiement</p>
                                    <p className="font-bold text-gray-900">{order.payment_method || 'N/A'}</p>
                                </div>
                                {order.notes && (
                                    <div>
                                        <p className="text-gray-500 mb-1">Notes</p>
                                        <p className="text-gray-700 whitespace-pre-line">{order.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

