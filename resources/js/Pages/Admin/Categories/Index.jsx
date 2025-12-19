import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Search, Layers } from 'lucide-react';

export default function Index({ categories }) {
    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
                        <p className="text-gray-500">Gérez les catégories de produits de votre boutique.</p>
                    </div>
                    <Link
                        href="/admin/categories/create"
                        className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold shadow-lg shadow-forest-green/20"
                    >
                        <Plus size={20} />
                        Nouvelle Catégorie
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher une catégorie..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Icône</th>
                                    <th className="px-6 py-4">Nom</th>
                                    <th className="px-6 py-4">Slug</th>
                                    <th className="px-6 py-4 text-center">Produits</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.data.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                                {category.icon ? (
                                                    <img src={category.icon} alt="" className="w-6 h-6 object-contain" />
                                                ) : (
                                                    <Layers size={20} />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{category.name}</td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{category.slug}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-bold">
                                                {category.products_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${category.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {category.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link
                                                href={`/admin/categories/${category.id}/edit`}
                                                className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id)}
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
                        <span className="text-sm text-gray-500">
                            Affichage de {categories.from} à {categories.to} sur {categories.total} catégories
                        </span>
                        <div className="flex gap-2">
                            {categories.links.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-md text-sm transition-all ${link.active
                                            ? 'bg-forest-green text-white font-bold'
                                            : link.url ? 'bg-white text-gray-600 hover:bg-gray-100' : 'text-gray-300 pointer-events-none'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
