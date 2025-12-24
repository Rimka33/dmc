import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { router, Link } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import Section from '../../../Components/Admin/Section';
import FormField from '../../../Components/Admin/FormField';
import TagInput from '../../../Components/Admin/TagInput';
import { Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';

export default function Create({ categories = [] }) {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        price: '',
        discount_price: '',
        stock_quantity: '',
        category_id: '',
        is_active: true,
        tags: [],
        images: [],
    });

    const [imagePreview, setImagePreview] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(prev => [...prev, {
                    id: Math.random(),
                    src: event.target.result,
                    type: file.type.startsWith('video/') ? 'video' : 'image',
                    file: file
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (id) => {
        setImagePreview(prev => prev.filter(img => img.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataMultipart = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'images' || key === 'tags') return;
            // Convert boolean to 1/0 explicitly for Laravel validation
            if (key === 'is_active') {
                formDataMultipart.append(key, formData[key] ? '1' : '0');
                return;
            }
            formDataMultipart.append(key, formData[key] === null ? '' : formData[key]);
        });

        formDataMultipart.append('tags', JSON.stringify(formData.tags));
        imagePreview.forEach((img, idx) => {
            formDataMultipart.append(`images[${idx}]`, img.file);
        });

        router.post('/admin/products', formDataMultipart, {
            forceFormData: true,
            onSuccess: () => {
                setLoading(false);
                // Redirect is handled by backend but validation errors might keep us here
            },
            onError: (errs) => {
                console.error("Submission errors:", JSON.stringify(errs, null, 2));
                setErrors(errs);
                setLoading(false);
            },
            onFinish: () => setLoading(false)
        });
    };

    const tagSuggestions = ['Nouveau', 'Meilleure vente', 'Offre du moment', 'Produit vedette'];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Créer un Produit"
                    subtitle="Ajoutez un nouveau produit à votre catalogue"
                    breadcrumbs={['Produits', 'Nouveau']}
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Alert */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-pulse">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Impossible de créer le produit
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            {Object.entries(errors).map(([field, error]) => (
                                                <li key={field}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Basic Info */}
                    <Section title="Informations de Base" icon={ImageIcon}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Nom du produit"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Ex: Laptop Gaming RTX 4090"
                                error={errors.name}
                                required
                            />
                            <FormField
                                label="SKU (Référence)"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                placeholder="Ex: LAPTOP-RTX-001"
                                error={errors.sku}
                            />
                        </div>

                        <FormField
                            label="Description"
                            name="description"
                            type="textarea"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Décrivez votre produit..."
                            error={errors.description}
                            rows={5}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Catégorie"
                                name="category_id"
                                type="select"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                options={categories.map(cat => ({ label: cat.name, value: cat.id }))}
                                error={errors.category_id}
                                required
                            />
                            <FormField
                                label="Actif"
                                name="is_active"
                                type="checkbox"
                                value={formData.is_active}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Section>

                    {/* Pricing & Stock */}
                    <Section title="Prix et Stock">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                label="Prix"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                error={errors.price}
                                required
                            />
                            <FormField
                                label="Prix Promotionnel"
                                name="discount_price"
                                type="number"
                                value={formData.discount_price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                hint="Laisser vide si pas de promotion"
                            />
                            <FormField
                                label="Quantité en Stock"
                                name="stock_quantity"
                                type="number"
                                value={formData.stock_quantity}
                                onChange={handleInputChange}
                                placeholder="0"
                                error={errors.stock_quantity}
                                required
                            />
                        </div>
                    </Section>

                    {/* Tags */}
                    <Section title="Tags & Catégorisation">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Tags (ex: Nouveau, Meilleure vente)
                            </label>
                            <TagInput
                                value={formData.tags}
                                onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                                suggestions={tagSuggestions}
                            />
                        </div>
                    </Section>

                    {/* Images */}
                    <Section title="Images">
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-forest-green transition-colors">
                                <ImageIcon size={24} className="text-gray-400" />
                                <div>
                                    <p className="font-bold text-gray-700">Ajouter des images</p>
                                    <p className="text-sm text-gray-500">Cliquez ou glissez des fichiers</p>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>

                            {imagePreview.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imagePreview.map((img) => (
                                        <div key={img.id} className="relative group">
                                            {img.type === 'video' ? (
                                                <video
                                                    src={img.src}
                                                    className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                                                    controls
                                                />
                                            ) : (
                                                <img
                                                    src={img.src}
                                                    alt="preview"
                                                    className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                                                />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(img.id)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Section>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold shadow-lg shadow-forest-green/20 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? 'Création...' : 'Créer le Produit'}
                        </button>
                        <Link
                            href="/admin/products"
                            className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold"
                        >
                            <ArrowLeft size={18} />
                            Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}