import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { router, Link } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import FormField from '../../../Components/Admin/FormField';
import Section from '../../../Components/Admin/Section';
import { Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { resolveImagePath } from '../../../utils/imageUtils';

export default function Edit({ banner, types = [], positions = [] }) {
    const [formData, setFormData] = useState({
        title: banner.title || '',
        type: banner.type || 'banner',
        image: null,
        mobile_image: null,
        link: banner.link || '',
        description: banner.description || '',
        position: banner.position || 'top',
        start_date: banner.start_date ? new Date(banner.start_date).toISOString().slice(0, 16) : '',
        end_date: banner.end_date ? new Date(banner.end_date).toISOString().slice(0, 16) : '',
        is_active: banner.is_active !== undefined ? banner.is_active : true,
        display_duration: banner.display_duration || '',
        sort_order: banner.sort_order || 0,
        button_text: banner.button_text || '',
        button_link: banner.button_link || '',
    });

    const [imagePreview, setImagePreview] = useState(banner.image ? resolveImagePath(banner.image) : null);
    const [mobileImagePreview, setMobileImagePreview] = useState(banner.mobile_image ? resolveImagePath(banner.mobile_image) : null);
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

    const handleImageUpload = (e, isMobile = false) => {
        const file = e.target.files?.[0];
        if (file) {
            if (isMobile) {
                setFormData(prev => ({ ...prev, mobile_image: file }));
            } else {
                setFormData(prev => ({ ...prev, image: file }));
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                if (isMobile) {
                    setMobileImagePreview(event.target.result);
                } else {
                    setImagePreview(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (isMobile = false) => {
        if (isMobile) {
            setFormData(prev => ({ ...prev, mobile_image: null }));
            setMobileImagePreview(null);
        } else {
            setFormData(prev => ({ ...prev, image: null }));
            setImagePreview(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataMultipart = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image' || key === 'mobile_image') return;
            formDataMultipart.append(key, formData[key] === null ? '' : formData[key]);
        });

        if (formData.image) {
            formDataMultipart.append('image', formData.image);
        }
        if (formData.mobile_image) {
            formDataMultipart.append('mobile_image', formData.mobile_image);
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image' || key === 'mobile_image') return;

            // Fix boolean fields for FormData
            if (key === 'is_active') {
                formDataToSend.append(key, formData[key] ? '1' : '0');
            } else {
                formDataToSend.append(key, formData[key] === null ? '' : formData[key]);
            }
        });
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        if (formData.mobile_image) {
            formDataToSend.append('mobile_image', formData.mobile_image);
        }
        formDataToSend.append('_method', 'PUT');

        router.post(`/admin/banners/${banner.id}`, formDataToSend, {
            forceFormData: true,
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
                    title="Modifier la Bannière"
                    subtitle={banner.title}
                    breadcrumbs={['Bannières', 'Modifier']}
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
                                label="Titre"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                error={errors.title}
                                required
                            />
                            <FormField
                                label="Type"
                                name="type"
                                type="select"
                                value={formData.type}
                                onChange={handleInputChange}
                                options={types}
                                error={errors.type}
                                required
                            />
                        </div>

                        <FormField
                            label="Description"
                            name="description"
                            type="textarea"
                            value={formData.description}
                            onChange={handleInputChange}
                            error={errors.description}
                            rows={3}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Position"
                                name="position"
                                type="select"
                                value={formData.position}
                                onChange={handleInputChange}
                                options={positions}
                                error={errors.position}
                                required
                            />
                            <FormField
                                label="Ordre d'affichage"
                                name="sort_order"
                                type="number"
                                value={formData.sort_order}
                                onChange={handleInputChange}
                                error={errors.sort_order}
                            />
                        </div>

                        {formData.type === 'popup' && (
                            <FormField
                                label="Durée d'affichage (secondes)"
                                name="display_duration"
                                type="number"
                                value={formData.display_duration}
                                onChange={handleInputChange}
                                error={errors.display_duration}
                            />
                        )}

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-forest-green rounded focus:ring-forest-green border-gray-300"
                            />
                            <label htmlFor="is_active" className="text-sm font-bold text-gray-700 cursor-pointer">
                                Bannière active
                            </label>
                        </div>
                    </Section>

                    <Section title="Images">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Image Desktop
                                </label>
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(false)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex items-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-forest-green transition-colors">
                                        <ImageIcon size={24} className="text-gray-400" />
                                        <div>
                                            <p className="font-bold text-gray-700">Ajouter une image</p>
                                            <p className="text-sm text-gray-500">Cliquez ou glissez un fichier</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, false)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Image Mobile (Optionnel)
                                </label>
                                {mobileImagePreview ? (
                                    <div className="relative">
                                        <img src={mobileImagePreview} alt="Preview Mobile" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(true)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex items-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-forest-green transition-colors">
                                        <ImageIcon size={24} className="text-gray-400" />
                                        <div>
                                            <p className="font-bold text-gray-700">Ajouter une image mobile</p>
                                            <p className="text-sm text-gray-500">Cliquez ou glissez un fichier</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, true)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                                {errors.mobile_image && <p className="text-red-500 text-xs mt-1">{errors.mobile_image}</p>}
                            </div>
                        </div>
                    </Section>

                    <Section title="Liens & Actions">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Lien principal (URL)"
                                name="link"
                                type="url"
                                value={formData.link}
                                onChange={handleInputChange}
                                error={errors.link}
                            />
                            <FormField
                                label="Texte du bouton"
                                name="button_text"
                                value={formData.button_text}
                                onChange={handleInputChange}
                                error={errors.button_text}
                            />
                        </div>
                        <FormField
                            label="Lien du bouton (URL)"
                            name="button_link"
                            type="url"
                            value={formData.button_link}
                            onChange={handleInputChange}
                            error={errors.button_link}
                        />
                    </Section>

                    <Section title="Planning">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Date de début"
                                name="start_date"
                                type="datetime-local"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                error={errors.start_date}
                            />
                            <FormField
                                label="Date de fin"
                                name="end_date"
                                type="datetime-local"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                error={errors.end_date}
                            />
                        </div>
                        <p className="text-xs text-gray-500">Laissez vide pour afficher immédiatement et indéfiniment</p>
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
                            href="/admin/banners"
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

