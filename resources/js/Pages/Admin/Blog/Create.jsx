import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { router, Link } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import FormField from '../../../Components/Admin/FormField';
import Section from '../../../Components/Admin/Section';
import { Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';

export default function Create({ categories = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: null,
    category: '',
    author: '',
    status: 'draft',
    read_time: '',
    meta_title: '',
    meta_description: '',
    is_featured: false,
    sort_order: 0,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataMultipart = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'image') return;
      const value = formData[key];
      formDataMultipart.append(
        key,
        value === null ? '' : typeof value === 'boolean' ? (value ? '1' : '0') : value
      );
    });

    if (formData.image) {
      formDataMultipart.append('image', formData.image);
    }

    router.post('/admin/blog', formDataMultipart, {
      forceFormData: true,
      onSuccess: () => {
        setLoading(false);
      },
      onError: (errs) => {
        setErrors(errs);
        setLoading(false);
      },
      onFinish: () => setLoading(false),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Créer un Article"
          subtitle="Ajoutez un nouvel article à votre blog"
          breadcrumbs={['Blog', 'Nouvel Article']}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Erreurs de validation</h3>
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
                label="Titre de l'article"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Comment choisir sa carte graphique"
                error={errors.title}
                required
              />
              <FormField
                label="Slug (URL)"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="Sera généré automatiquement si vide"
                error={errors.slug}
              />
            </div>

            <FormField
              label="Résumé (Excerpt)"
              name="excerpt"
              type="textarea"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Court résumé de l'article..."
              error={errors.excerpt}
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                label="Catégorie"
                name="category"
                type="select"
                value={formData.category}
                onChange={handleInputChange}
                options={[
                  { label: 'Sélectionner...', value: '' },
                  ...categories.map((cat) => ({ label: cat, value: cat })),
                ]}
                error={errors.category}
              />
              <FormField
                label="Auteur"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Nom de l'auteur"
                error={errors.author}
              />
              <FormField
                label="Temps de lecture (minutes)"
                name="read_time"
                type="number"
                value={formData.read_time}
                onChange={handleInputChange}
                placeholder="Sera calculé automatiquement"
                error={errors.read_time}
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
                  { label: 'Archivé', value: 'archived' },
                ]}
                error={errors.status}
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

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="w-5 h-5 text-forest-green rounded focus:ring-forest-green border-gray-300"
              />
              <label
                htmlFor="is_featured"
                className="text-sm font-bold text-gray-700 cursor-pointer"
              >
                Mettre en vedette
              </label>
            </div>
          </Section>

          <Section title="Contenu">
            <FormField
              label="Contenu de l'article"
              name="content"
              type="textarea"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Rédigez votre article ici..."
              error={errors.content}
              rows={15}
              required
            />
          </Section>

          <Section title="Image à la Une">
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
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
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </Section>

          <Section title="SEO (Optionnel)">
            <FormField
              label="Meta Title"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleInputChange}
              placeholder="Titre pour les moteurs de recherche"
              error={errors.meta_title}
            />
            <FormField
              label="Meta Description"
              name="meta_description"
              type="textarea"
              value={formData.meta_description}
              onChange={handleInputChange}
              placeholder="Description pour les moteurs de recherche"
              error={errors.meta_description}
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
              {loading ? 'Création...' : "Créer l'Article"}
            </button>
            <Link
              href="/admin/blog"
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
