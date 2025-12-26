import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { router, Link } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import Section from '../../../Components/Admin/Section';
import FormField from '../../../Components/Admin/FormField';
import { ArrowLeft, Star, Check, X, Save } from 'lucide-react';

export default function Show({ review }) {
    const [formData, setFormData] = useState({
        rating: review.rating || 5,
        title: review.title || '',
        comment: review.comment || '',
        is_approved: review.is_approved || false,
        is_verified_purchase: review.is_verified_purchase || false,
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        router.put(`/admin/reviews/${review.id}`, formData, {
            onSuccess: () => {
                setLoading(false);
            },
            onFinish: () => setLoading(false)
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Détails de l'Avis"
                    subtitle={`Avis #${review.id}`}
                    breadcrumbs={['Avis', 'Détails']}
                    action={
                        <Link
                            href="/admin/reviews"
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold shadow-sm"
                        >
                            <ArrowLeft size={18} />
                            Retour
                        </Link>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Section title="Informations de l'Avis">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Note</label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map(rating => (
                                            <button
                                                key={rating}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, rating }))}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    size={32}
                                                    className={rating <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-2 text-lg font-bold text-gray-700">{formData.rating}/5</span>
                                    </div>
                                </div>

                                <FormField
                                    label="Titre"
                                    name="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                />

                                <FormField
                                    label="Commentaire"
                                    name="comment"
                                    type="textarea"
                                    value={formData.comment}
                                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                    rows={6}
                                />

                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="is_approved"
                                        checked={formData.is_approved}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_approved: e.target.checked }))}
                                        className="w-5 h-5 text-forest-green rounded focus:ring-forest-green border-gray-300"
                                    />
                                    <label htmlFor="is_approved" className="text-sm font-bold text-gray-700 cursor-pointer">
                                        Avis approuvé
                                    </label>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="is_verified_purchase"
                                        checked={formData.is_verified_purchase}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_verified_purchase: e.target.checked }))}
                                        className="w-5 h-5 text-forest-green rounded focus:ring-forest-green border-gray-300"
                                    />
                                    <label htmlFor="is_verified_purchase" className="text-sm font-bold text-gray-700 cursor-pointer">
                                        Achat vérifié
                                    </label>
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-3 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                    <Link
                                        href="/admin/reviews"
                                        className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold"
                                    >
                                        <ArrowLeft size={18} />
                                        Retour
                                    </Link>
                                </div>
                            </form>
                        </Section>
                    </div>

                    <div className="space-y-6">
                        <Section title="Informations Produit">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Produit</p>
                                    <p className="font-bold text-gray-900">{review.product?.name || 'Avis Boutique'}</p>
                                </div>
                                {review.product && (
                                    <Link
                                        to={`/admin/products/${review.product.id}/edit`}
                                        className="text-forest-green text-sm font-bold hover:underline"
                                    >
                                        Voir le produit →
                                    </Link>
                                )}
                            </div>
                        </Section>

                        <Section title="Informations Client">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Nom</p>
                                    <p className="font-bold text-gray-900">{review.user?.name || 'Anonyme'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                    <p className="text-gray-700">{review.user?.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Date</p>
                                    <p className="text-gray-700">{new Date(review.created_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                            </div>
                        </Section>

                        <Section title="Actions Rapides">
                            <div className="space-y-2">
                                {!review.is_approved && (
                                    <button
                                        onClick={() => {
                                            router.post(`/admin/reviews/${review.id}/approve`, {}, {
                                                onSuccess: () => router.reload()
                                            });
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-bold"
                                    >
                                        <Check size={18} />
                                        Approuver l'avis
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        if (confirm('Supprimer cet avis ?')) {
                                            router.delete(`/admin/reviews/${review.id}`, {
                                                onSuccess: () => router.visit('/admin/reviews')
                                            });
                                        }
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-bold"
                                >
                                    <X size={18} />
                                    Supprimer
                                </button>
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

