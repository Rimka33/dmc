import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { Save, Trash2, ArrowLeft } from 'lucide-react';

export default function Edit({ product, categories }) {
    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        name: product.name || '',
        sku: product.sku || '',
        category_id: product.category_id || '',
        price: product.price || '',
        discount_price: product.discount_price || '',
        stock_quantity: product.stock_quantity || '',
        description: product.description || '',
        is_active: Boolean(product.is_active),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/products/${product.id}`);
    };

    const handleDelete = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            destroy(`/admin/products/${product.id}`);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/products" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-forest-green hover:border-forest-green transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Modifier Produit</h1>
                            <p className="text-gray-500">Mise à jour des informations du produit.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={18} />
                        Supprimer
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 space-y-8">
                        {/* Section 1: Informations de base */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Informations Générales</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Nom du produit</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none transition-all"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">SKU (Référence)</label>
                                    <input
                                        type="text"
                                        value={data.sku}
                                        onChange={e => setData('sku', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none transition-all"
                                    />
                                    {errors.sku && <p className="text-red-500 text-xs">{errors.sku}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none transition-all"
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                            </div>
                        </div>

                        {/* Section 2: Prix et Stock */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Prix et Inventaire</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Prix (FCFA)</label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none transition-all"
                                    />
                                    {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Prix Promotionnel (FCFA)</label>
                                    <input
                                        type="number"
                                        value={data.discount_price}
                                        onChange={e => setData('discount_price', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none transition-all"
                                    />
                                    <p className="text-xs text-gray-500">Laisser vide si pas de promotion</p>
                                    {errors.discount_price && <p className="text-red-500 text-xs">{errors.discount_price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Quantité en stock</label>
                                    <input
                                        type="number"
                                        value={data.stock_quantity}
                                        onChange={e => setData('stock_quantity', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none transition-all"
                                    />
                                    {errors.stock_quantity && <p className="text-red-500 text-xs">{errors.stock_quantity}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Catégorie</label>
                                    <select
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none transition-all bg-white"
                                    >
                                        <option value="">Sélectionner...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-red-500 text-xs">{errors.category_id}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Statut */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                                className="w-5 h-5 text-forest-green rounded focus:ring-forest-green border-gray-300"
                            />
                            <label htmlFor="is_active" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                                Produit actif et visible sur le site
                            </label>
                            {errors.is_active && <p className="text-red-500 text-xs ml-auto">{errors.is_active}</p>}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4">
                        <Link
                            href="/admin/products"
                            className="px-6 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                        >
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-forest-green text-white rounded-lg font-bold hover:bg-dark-green transition-colors flex items-center gap-2 shadow-lg shadow-forest-green/20"
                        >
                            <Save size={18} />
                            {processing ? 'Enregistrement...' : 'Mettre à jour'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
