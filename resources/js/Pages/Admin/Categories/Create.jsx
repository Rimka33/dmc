import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    slug: '',
    description: '',
    icon: '',
    image: null,
    sort_order: 0,
    is_active: true,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/categories', {
      forceFormData: true,
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/categories"
              className="flex items-center gap-1 text-gray-500 hover:text-forest-green mb-2 text-sm"
            >
              <ArrowLeft size={16} /> Retour à la liste
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Nouvelle Catégorie</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nom de la catégorie *</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neon-green outline-none transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Ex: Ordinateurs Portables"
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Slug (optionnel)</label>
                <input
                  type="text"
                  value={data.slug}
                  onChange={(e) => setData('slug', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neon-green outline-none transition-all ${
                    errors.slug ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="ordinateurs-portables"
                />
                <p className="text-[10px] text-gray-400 italic">
                  Laissé vide, le slug sera généré automatiquement.
                </p>
                {errors.slug && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.slug}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-neon-green outline-none transition-all"
                placeholder="Description de la catégorie..."
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Image de couverture</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-400" />
                  )}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <p>Cliquez pour ajouter une image</p>
                  <p className="text-xs">JPG, PNG, WEBP (Max 2MB)</p>
                </div>
              </div>
              {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Ordre d'affichage</label>
                <input
                  type="number"
                  value={data.sort_order}
                  onChange={(e) => setData('sort_order', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-neon-green outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 pt-8">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={data.is_active}
                  onChange={(e) => setData('is_active', e.target.checked)}
                  className="w-4 h-4 text-forest-green rounded border-gray-300 focus:ring-neon-green"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-semibold text-gray-700 cursor-pointer"
                >
                  Actif
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/admin/categories"
              className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold transition-all"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 bg-forest-green text-white rounded-lg hover:bg-dark-green font-bold shadow-lg shadow-forest-green/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save size={20} />
              {processing ? 'Enregistrement...' : 'Enregistrer la catégorie'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
