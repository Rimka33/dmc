import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Search, ShoppingBag, Eye, Filter } from 'lucide-react';

export default function Index({ products, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/products', { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            router.delete(`/admin/products/${id}`);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
                        <p className="text-gray-500">Gérez l'inventaire des produits de votre boutique.</p>
                    </div>
                    <Link
                        href="/admin/products/create"
                        className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold shadow-lg shadow-forest-green/20"
                    >
                        <Plus size={20} />
                        Nouveau Produit
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                        <form onSubmit={handleSearch} className="relative w-full max-w-md text-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par nom ou SKU..."
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
                                    <th className="px-6 py-4">Produit</th>
                                    <th className="px-6 py-4">Catégorie</th>
                                    <th className="px-6 py-4">Prix</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.data.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group text-sm">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                                                    {product.images?.length > 0 && product.images[0]?.image_path ? (
                                                        <img src={`/storage/products/${product.images[0].image_path}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ShoppingBag size={20} className="text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-gray-400 font-mono">SKU: {product.sku || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-600">{product.category?.name || 'Non classé'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{new Intl.NumberFormat('fr-FR').format(product.price)} F</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 10 ? 'bg-green-500' : product.stock_quantity > 0 ? 'bg-amber-500' : 'bg-red-500'
                                                    }`} />
                                                <span className="font-semibold text-gray-700">{product.stock_quantity}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${product.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {product.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-1">
                                            <Link
                                                href={`/produit/${product.id}`}
                                                className="inline-flex p-2 text-gray-400 hover:text-forest-green hover:bg-green-50 rounded-lg transition-colors"
                                                title="Voir sur le site"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            Affichage de {products.from} à {products.to} sur {products.total} produits
                        </span>
                        <div className="flex gap-2">
                            {products.links.map((link, key) => (
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
