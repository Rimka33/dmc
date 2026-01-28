import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, AlertCircle, Upload, X } from 'lucide-react';

export default function Edit({ category }) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'put',
    name: category.name || '',
    slug: category.slug || '',
    description: category.description || '',
    icon: category.icon || '',
    image: null,
    sort_order: category.sort_order || 0,
    is_active: category.is_active ?? true,
  });

  const [imagePreview, setImagePreview] = useState(
    category.image ? `/storage/${category.image}` : null
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setData('image', null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/admin/categories/${category.id}`, {
      forceFormData: true,
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/categories"
              className="flex items-center gap-1 text-gray-500 hover:text-forest-green mb-2 text-sm"
            >
              <ArrowLeft size={16} /> Retour à la liste
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Modifier la Catégorie</h1>
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
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Slug *</label>
                <input
                  type="text"
                  value={data.slug}
                  onChange={(e) => setData('slug', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neon-green outline-none transition-all ${
                    errors.slug ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
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
              ></textarea>
            </div>

            {/* Upload Image */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Image de la catégorie</label>
              <div className="flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-100 shadow-sm group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-forest-green hover:bg-forest-green/5 transition-all">
                    <Upload className="text-gray-400 group-hover:text-forest-green" size={24} />
                    <span className="text-[10px] text-gray-400 font-medium mt-2">Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                )}
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-2">
                    Cette image sera affichée sur la page boutique et les listes de catégories.
                    Format recommandé : Carré (ex: 500x500px), Max 2Mo.
                  </p>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-forest-green/10 file:text-forest-green hover:file:bg-forest-green/20"
                    accept="image/*"
                  />
                </div>
              </div>
              {errors.image && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.image}
                </p>
              )}
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
              {processing ? 'Enregistrement...' : 'Mettre à jour la catégorie'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
