import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { router, Link, useForm } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import Section from '../../../Components/Admin/Section';
import FormField from '../../../Components/Admin/FormField';
import TagInput from '../../../Components/Admin/TagInput';
import { Save, ArrowLeft, Image as ImageIcon, X, Trash2, Star } from 'lucide-react';

export default function Edit({ product, categories = [] }) {
  // Initialisation des tags (tableau de chaînes)
  const initialTags = product.tags
    ? typeof product.tags === 'string'
      ? JSON.parse(product.tags)
      : product.tags
    : [];

  // On cherche l'image principale actuelle
  const currentPrimary = product.images?.find((img) => img.is_primary);

  const { data, setData, post, processing, errors, transform } = useForm({
    _method: 'PUT',
    name: product.name || '',
    sku: product.sku || '',
    description: product.description || '',
    price: product.price || '',
    discount_price: product.discount_price || '',
    stock_quantity: product.stock_quantity || '',
    category_id: product.category_id || '',
    is_active: Boolean(product.is_active),
    tags: initialTags,
    new_images: [],
    deleted_images: [],
    primary_image_id: currentPrimary ? currentPrimary.id : null,
    primary_image_new_index: null,
  });

  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState(product.images || []);

  // Transformation des données avant l'envoi (pour les tags et les booléens si nécessaire)
  transform((data) => ({
    ...data,
    tags: JSON.stringify(data.tags),
    is_active: data.is_active ? '1' : '0',
  }));

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(name, type === 'checkbox' ? checked : value);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview((prev) => [
          ...prev,
          {
            id: Math.random(),
            src: event.target.result,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            file: file,
            is_primary: false,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (id) => {
    setImagePreview((prev) => {
      const newList = prev.filter((img) => img.id !== id);
      // Si on supprime l'image qui était marquée comme principale (nouvelle)
      const wasPrimary = prev.find((img) => img.id === id)?.is_primary;
      if (wasPrimary) {
        setData('primary_image_new_index', null);
      }
      return newList;
    });
  };

  const removeExistingImage = (id) => {
    setExistingImages((prev) => {
      const newList = prev.filter((img) => img.id !== id);
      // Mettre à jour deleted_images en utilisant la forme fonctionnelle
      setData((d) => ({
        ...d,
        deleted_images: [...d.deleted_images, id],
        // Si on supprime l'image principale existante
        primary_image_id: d.primary_image_id === id ? null : d.primary_image_id,
      }));
      return newList;
    });
  };

  const handleSetPrimary = (id, type) => {
    if (type === 'existing') {
      setData((d) => ({
        ...d,
        primary_image_id: id,
        primary_image_new_index: null,
      }));
      setExistingImages((prev) => prev.map((img) => ({ ...img, is_primary: img.id === id })));
      setImagePreview((prev) => prev.map((img) => ({ ...img, is_primary: false })));
    } else {
      const index = imagePreview.findIndex((img) => img.id === id);
      setData((d) => ({
        ...d,
        primary_image_id: null,
        primary_image_new_index: index,
      }));
      setImagePreview((prev) => prev.map((img) => ({ ...img, is_primary: img.id === id })));
      setExistingImages((prev) => prev.map((img) => ({ ...img, is_primary: false })));
    }
  };

  useEffect(() => {
    setData(
      'new_images',
      imagePreview.map((img) => img.file)
    );
    // Si on a un index de nouvelle image principale, il faut peut-être le recalculer si les images bougent
    // Mais ici on ajoute juste à la fin, donc l'index reste stable tant qu'on ne supprime pas.
  }, [imagePreview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/admin/products/${product.id}`, {
      forceFormData: true,
      preserveScroll: true,
    });
  };

  const resolveSrc = (path) => {
    if (!path) return '/images/placeholder.png';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return path;
    return `/storage/${path}`;
  };

  const tagSuggestions = ['Nouveau', 'Meilleure vente', 'Offre du moment', 'Produit vedette'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title={`Modifier: ${product.name}`}
          subtitle="Mettez à jour les informations et images du produit"
          breadcrumbs={['Produits', 'Modifier']}
          action={
            <Link
              href="/admin/products"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-forest-green/10 text-dark-green rounded-xl hover:bg-forest-green/5 transition-all font-bold"
            >
              <ArrowLeft size={18} />
              Retour
            </Link>
          }
        />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Section title="Informations de Base" icon={ImageIcon}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Nom du produit"
                  name="name"
                  value={data.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                />
                <FormField
                  label="SKU (Référence)"
                  name="sku"
                  value={data.sku}
                  onChange={handleInputChange}
                  error={errors.sku}
                />
              </div>

              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={data.description}
                onChange={handleInputChange}
                error={errors.description}
                rows={5}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Catégorie"
                  name="category_id"
                  type="select"
                  value={data.category_id}
                  onChange={handleInputChange}
                  options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
                  error={errors.category_id}
                  required
                />
                <FormField
                  label="Actif"
                  name="is_active"
                  type="checkbox"
                  value={data.is_active}
                  onChange={handleInputChange}
                />
              </div>
            </Section>

            {/* Images */}
            <Section title="Gestion des Images & Vidéos">
              <div className="space-y-6">
                {/* Zone d'upload */}
                <label className="flex items-center gap-3 px-6 py-8 border-2 border-dashed border-forest-green/20 bg-forest-green/5 rounded-2xl cursor-pointer hover:border-forest-green transition-all group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} className="text-forest-green" />
                  </div>
                  <div>
                    <p className="font-bold text-dark-green uppercase text-xs tracking-widest">
                      Ajouter des médias
                    </p>
                    <p className="text-[10px] text-dark-green/40 font-bold uppercase tracking-tighter mt-1">
                      Images ou vidéos (Max 50MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Images existantes */}
                {existingImages.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                      <p className="text-[10px] font-black text-dark-green/40 uppercase tracking-[0.2em]">
                        Images Actuelles
                      </p>
                      <p className="text-[9px] font-bold text-forest-green uppercase italic">
                        * Cliquez sur l'étoile pour définir l'image principale
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingImages.map((media) => (
                        <div
                          key={media.id}
                          className={`relative group rounded-xl overflow-hidden border-2 aspect-square transition-all ${media.is_primary ? 'border-neon-green shadow-lg' : 'border-forest-green/10'}`}
                        >
                          <img
                            src={resolveSrc(media.image_path)}
                            alt="product"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-2 flex justify-center gap-3 border-t border-forest-green/10 transition-all duration-300">
                            {!media.is_primary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(media.id, 'existing')}
                                className="w-8 h-8 flex items-center justify-center bg-forest-green/5 text-forest-green rounded-lg hover:bg-neon-green hover:text-dark-green transition-all"
                                title="Définir comme principale"
                              >
                                <Star size={16} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeExistingImage(media.id)}
                              className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          {media.is_primary && (
                            <div className="absolute top-2 left-2 bg-neon-green text-dark-green text-[8px] px-2 py-1 rounded-full uppercase font-black shadow-sm tracking-widest">
                              Principale
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nouvelles images (Preview) */}
                {imagePreview.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-forest-green uppercase tracking-[0.2em] ml-1">
                      Nouveaux Médias
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreview.map((img) => (
                        <div
                          key={img.id}
                          className={`relative group rounded-xl overflow-hidden border-2 aspect-square transition-all ${img.is_primary ? 'border-neon-green shadow-lg' : 'border-forest-green/30'}`}
                        >
                          {img.type === 'video' ? (
                            <video src={img.src} className="w-full h-full object-cover" muted />
                          ) : (
                            <img
                              src={img.src}
                              className="w-full h-full object-cover"
                              alt="preview"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-2 flex justify-center gap-3 border-t border-forest-green/10 transition-all duration-300">
                            {!img.is_primary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(img.id, 'new')}
                                className="w-8 h-8 flex items-center justify-center bg-forest-green/5 text-forest-green rounded-lg hover:bg-neon-green hover:text-dark-green transition-all"
                              >
                                <Star size={16} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeNewImage(img.id)}
                              className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
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
          </div>

          <div className="space-y-6">
            {/* Pricing & Stock */}
            <Section title="Prix et Stock">
              <div className="space-y-6">
                <FormField
                  label="Prix (FCFA)"
                  name="price"
                  type="number"
                  value={data.price}
                  onChange={handleInputChange}
                  error={errors.price}
                  required
                />
                <FormField
                  label="Prix Promo (Optionnel)"
                  name="discount_price"
                  type="number"
                  value={data.discount_price}
                  onChange={handleInputChange}
                  error={errors.discount_price}
                />
                <FormField
                  label="En Stock"
                  name="stock_quantity"
                  type="number"
                  value={data.stock_quantity}
                  onChange={handleInputChange}
                  error={errors.stock_quantity}
                  required
                />
              </div>
            </Section>

            {/* Tags */}
            <Section title="Tags & SEO">
              <TagInput
                value={data.tags}
                onChange={(tags) => setData('tags', tags)}
                suggestions={tagSuggestions}
              />
            </Section>

            {/* Save Actions */}
            <div className="bg-dark-green p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-neon-green text-dark-green rounded-2xl hover:bg-white hover:scale-[1.02] transition-all font-black uppercase tracking-widest text-xs shadow-xl disabled:opacity-50"
                >
                  <Save size={20} />
                  {processing ? 'Enregistrement...' : 'Mettre à jour'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                      router.delete(`/admin/products/${product.id}`);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]"
                >
                  Supprimer le produit
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-neon-green/20 transition-colors"></div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
