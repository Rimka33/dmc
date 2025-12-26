import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { router, Link } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import Section from '../../../Components/Admin/Section';
import FormField from '../../../Components/Admin/FormField';
import { ArrowLeft, MessageSquare, Save, Eye, EyeOff } from 'lucide-react';

export default function Show({ question }) {
    const [formData, setFormData] = useState({
        answer: question.answer || '',
        question: question.question || '',
        is_visible: question.is_visible !== undefined ? question.is_visible : true,
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        router.put(`/admin/questions/${question.id}`, formData, {
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
                    title="Répondre à la Question"
                    subtitle={`Question #${question.id}`}
                    breadcrumbs={['Questions', 'Répondre']}
                    action={
                        <Link
                            href="/admin/questions"
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold shadow-sm"
                        >
                            <ArrowLeft size={18} />
                            Retour
                        </Link>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Section title="Question">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-900">{question.question}</p>
                            </div>
                        </Section>

                        <Section title="Réponse">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <FormField
                                    label="Votre réponse"
                                    name="answer"
                                    type="textarea"
                                    value={formData.answer}
                                    onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                                    rows={8}
                                    placeholder="Rédigez votre réponse ici..."
                                    required
                                />

                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="is_visible"
                                        checked={formData.is_visible}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                                        className="w-5 h-5 text-forest-green rounded focus:ring-forest-green border-gray-300"
                                    />
                                    <label htmlFor="is_visible" className="text-sm font-bold text-gray-700 cursor-pointer">
                                        Rendre cette question et réponse visibles publiquement
                                    </label>
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-3 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {loading ? 'Enregistrement...' : 'Enregistrer la réponse'}
                                    </button>
                                    <Link
                                        href="/admin/questions"
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
                                    <p className="font-bold text-gray-900">{question.product?.name || 'N/A'}</p>
                                </div>
                                {question.product && (
                                    <Link
                                        to={`/admin/products/${question.product.id}/edit`}
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
                                    <p className="font-bold text-gray-900">{question.user?.name || 'Anonyme'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                    <p className="text-gray-700">{question.user?.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Date</p>
                                    <p className="text-gray-700">{new Date(question.created_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                            </div>
                        </Section>

                        {question.answer && (
                            <Section title="Réponse Actuelle">
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-gray-900">{question.answer}</p>
                                </div>
                            </Section>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

