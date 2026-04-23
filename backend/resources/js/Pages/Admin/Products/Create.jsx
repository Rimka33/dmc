import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { router, Link } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import Section from '../../../Components/Admin/Section';
import FormField from '../../../Components/Admin/FormField';
import TagInput from '../../../Components/Admin/TagInput';
import { useNotification } from '../../../contexts/NotificationContext';
import { Save, ArrowLeft, Image as ImageIcon, X, Star } from 'lucide-react';

export default function Create({ categories = [] }) {
  const { showNotification } = useNotification();
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
    primary_image_index: 0,
  });

  const [imagePreview, setImagePreview] = useState([]);
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
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview((prev) => {
          const isFirst = prev.length === 0;
          return [
            ...prev,
            {
              id: Math.random(),
              src: event.target.result,
              type: file.type.startsWith('video/') ? 'video' : 'image',
              file: file,
              is_primary: isFirst,
            },
          ];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSetPrimary = (id) => {
    setImagePreview((prev) => {
      const newList = prev.map((img) => ({
        ...img,
        is_primary: img.id === id,
      }));
      const newIndex = newList.findIndex((img) => img.id === id);
      setFormData((f) => ({ ...f, primary_image_index: newIndex }));
      return newList;
    });
  };

  const removeImage = (id) => {
    setImagePreview((prev) => {
      const imgToRemove = prev.find((img) => img.id === id);
      const newList = prev.filter((img) => img.id !== id);

      // Si on supprime l'image principale, on en définit une nouvelle (la première restante)
      if (imgToRemove?.is_primary && newList.length > 0) {
        newList[0].is_primary = true;
        setFormData((f) => ({ ...f, primary_image_index: 0 }));
      } else if (newList.length === 0) {
        setFormData((f) => ({ ...f, primary_image_index: 0 }));
      } else {
        // Recalculer l'index de la principale
        const newIndex = newList.findIndex((img) => img.is_primary);
        setFormData((f) => ({ ...f, primary_image_index: newIndex }));
      }
      return newList;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataMultipart = new FormData();
    Object.keys(formData).forEach((key) => {
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
        showNotification('Veuillez corriger les erreurs dans le formulaire.', 'error');
        setErrors(errs);
        setLoading(false);
      },
      onFinish: () => setLoading(false),
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
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
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
                options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
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
                onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between ml-1">
                    <p className="text-[10px] font-black text-forest-green uppercase tracking-[0.2em]">
                      Médias Uploadés
                    </p>
                    <p className="text-[9px] font-bold text-forest-green uppercase italic">
                      * Cliquez sur l'étoile pour définir l'image principale
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreview.map((img) => (
                      <div
                        key={img.id}
                        className={`relative group rounded-xl overflow-hidden border-2 aspect-square transition-all ${
                          img.is_primary ? 'border-neon-green shadow-lg' : 'border-forest-green/10'
                        }`}
                      >
                        {img.type === 'video' ? (
                          <video src={img.src} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={img.src} alt="preview" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-2 flex justify-center gap-3 border-t border-forest-green/10 transition-all duration-300">
                          {!img.is_primary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(img.id)}
                              className="w-8 h-8 flex items-center justify-center bg-forest-green/5 text-forest-green rounded-lg hover:bg-neon-green hover:text-dark-green transition-all"
                              title="Définir comme principale"
                            >
                              <Star size={16} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="Supprimer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {img.is_primary && (
                          <div className="absolute top-2 left-2 bg-neon-green text-dark-green text-[8px] px-2 py-1 rounded-full uppercase font-black shadow-sm tracking-widest">
                            Principale
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 sticky bottom-0 bg-white/50 backdrop-blur-md p-4 -mx-4 lg:-mx-8 border-t border-forest-green/10 z-20">
            <div className="relative group">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-forest-green text-white rounded-xl hover:bg-dark-green transition-all font-bold shadow-lg shadow-forest-green/20 disabled:opacity-50 relative z-10"
              >
                <Save size={18} />
                {loading ? 'Analyse...' : 'Créer le Produit'}
              </button>
              <div className="absolute -inset-1 bg-neon-green blur-lg opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
            </div>
            <Link
              href="/admin/products"
              className="flex items-center gap-2 px-8 py-3 bg-white/80 border border-forest-green/10 text-dark-green rounded-xl hover:bg-forest-green/5 transition-all font-bold"
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
