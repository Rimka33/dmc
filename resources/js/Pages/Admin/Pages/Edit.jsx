import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { router, Link } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import FormField from '../../../Components/Admin/FormField';
import Section from '../../../Components/Admin/Section';
import { Save, ArrowLeft } from 'lucide-react';

export default function Edit({ page }) {
    const [formData, setFormData] = useState({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        status: page.status || 'draft',
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        sort_order: page.sort_order || 0,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        router.put(`/admin/pages/${page.id}`, formData, {
            onSuccess: () => {
                setLoading(false);
            },
            onError: (errs) => {
                setErrors(errs);
                setLoading(false);
            },
            onFinish: () => setLoading(false)
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Modifier la Page"
                    subtitle={page.title}
                    breadcrumbs={['Pages', 'Modifier']}
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Erreurs de validation
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

                    <Section title="Informations de Base">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Titre de la page"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                error={errors.title}
                                required
                            />
                            <FormField
                                label="Slug (URL)"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                error={errors.slug}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Statut"
                                name="status"
                                type="select"
                                value={formData.status}
                                onChange={handleInputChange}
                                options={[
                                    { label: 'Brouillon', value: 'draft' },
                                    { label: 'Publié', value: 'published' },
                                ]}
                                required
                            />
                            <FormField
                                label="Ordre d'affichage"
                                name="sort_order"
                                type="number"
                                value={formData.sort_order}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Section>

                    <Section title="Contenu">
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-sm text-blue-700 font-medium">
                                💡 Ce champ supporte le code HTML pour la mise en forme (ex: &lt;h1&gt;, &lt;p&gt;, &lt;br&gt;, &lt;strong&gt;).
                            </p>
                        </div>
                        <FormField
                            label="Contenu de la page"
                            name="content"
                            type="textarea"
                            value={formData.content}
                            onChange={handleInputChange}
                            error={errors.content}
                            rows={20}
                            required
                        />
                    </Section>

                    <Section title="SEO (Optionnel)">
                        <FormField
                            label="Meta Title"
                            name="meta_title"
                            value={formData.meta_title}
                            onChange={handleInputChange}
                        />
                        <FormField
                            label="Meta Description"
                            name="meta_description"
                            type="textarea"
                            value={formData.meta_description}
                            onChange={handleInputChange}
                            rows={3}
                        />
                    </Section>

                    <div className="flex items-center gap-3 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold shadow-lg shadow-forest-green/20 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? 'Enregistrement...' : 'Mettre à jour'}
                        </button>
                        <Link
                            href="/admin/pages"
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

