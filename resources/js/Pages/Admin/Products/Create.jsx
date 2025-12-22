import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { Save, X, Upload } from 'lucide-react';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: '',
        category_id: '',
        price: '',
        stock_quantity: '',
        description: '',
        is_active: true,
        image: null // Placeholder for future image upload
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/products');
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Nouveau Produit</h1>
                        <p className="text-gray-500">Ajoutez un nouveau produit à votre catalogue.</p>
                    </div>
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
                                        placeholder="Ex: Ordinateur Portable HP..."
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
                                        placeholder="Ex: LAP-HP-001"
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
                                    placeholder="Description détaillée du produit..."
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
                                        placeholder="0"
                                    />
                                    {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Quantité en stock</label>
                                    <input
                                        type="number"
                                        value={data.stock_quantity}
                                        onChange={e => setData('stock_quantity', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none transition-all"
                                        placeholder="0"
                                    />
                                    {errors.stock_quantity && <p className="text-red-500 text-xs">{errors.stock_quantity}</p>}
                                </div>

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
                            {processing ? 'Enregistrement...' : 'Créer le produit'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
