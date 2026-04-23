import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import FormField from '../../../Components/Admin/FormField';
import Section from '../../../Components/Admin/Section';
import { Save, ArrowLeft, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

export default function Create({ types = [], positions = [] }) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    type: 'banner',
    image: null,
    mobile_image: null,
    link: '',
    description: '',
    position: 'top',
    start_date: '',
    end_date: '',
    is_active: true,
    display_duration: '',
    sort_order: 0,
    button_text: '',
    button_link: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [mobileImagePreview, setMobileImagePreview] = useState(null);

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setData(field, file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (field === 'mobile_image') {
          setMobileImagePreview(event.target.result);
        } else {
          setImagePreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field) => {
    setData(field, null);
    if (field === 'mobile_image') {
      setMobileImagePreview(null);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/banners', {
      forceFormData: true,
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <PageHeader
          title="Créer une Bannière"
          subtitle="Ajoutez une nouvelle bannière promotionnelle ou un popup"
          breadcrumbs={['Bannières', 'Nouvelle Bannière']}
        >
          <Link
            href="/admin/banners"
            className="flex items-center gap-2 text-gray-500 hover:text-dark-green transition-colors font-bold text-sm"
          >
            <ArrowLeft size={16} />
            Retour à la liste
          </Link>
        </PageHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Section title="Format & Contenu">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Titre de la bannière"
                    name="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Ex: Arrivage de Noël"
                    error={errors.title}
                    required
                  />
                  <FormField
                    label="Type de bannière"
                    name="type"
                    type="select"
                    value={data.type}
                    onChange={(e) => setData('type', e.target.value)}
                    options={types}
                    error={errors.type}
                    required
                  />
                </div>

                <FormField
                  label="Description courte"
                  name="description"
                  type="textarea"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Texte qui apparaîtra sur la bannière"
                  error={errors.description}
                  rows={3}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Texte du bouton"
                    name="button_text"
                    value={data.button_text}
                    onChange={(e) => setData('button_text', e.target.value)}
                    placeholder="Ex: Acheter maintenant"
                    error={errors.button_text}
                  />
                  <FormField
                    label="Lien de destination"
                    name="link"
                    value={data.link}
                    onChange={(e) => setData('link', e.target.value)}
                    placeholder="https://..."
                    error={errors.link}
                  />
                </div>
              </Section>

              <Section title="Images & Visuels">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Desktop Image */}
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-dark-green/40 uppercase tracking-wider">
                      Image Desktop (HD) *
                    </label>
                    <div className="relative group">
                      {imagePreview ? (
                        <div className="relative aspect-[16/6] rounded-2xl overflow-hidden border-2 border-forest-green shadow-xl shadow-forest-green/10">
                          <img
                            src={imagePreview}
                            alt="Desktop preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage('image')}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-[16/6] border-2 border-dashed border-forest-green/20 rounded-2xl cursor-pointer hover:border-forest-green hover:bg-forest-green/5 transition-all text-dark-green/30 hover:text-forest-green">
                          <ImageIcon size={48} strokeWidth={1} />
                          <span className="text-xs font-black uppercase mt-4 tracking-widest">
                            Choisir Image Desktop
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'image')}
                          />
                        </label>
                      )}
                    </div>
                    {errors.image && (
                      <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.image}
                      </p>
                    )}
                  </div>

                  {/* Mobile Image */}
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-dark-green/40 uppercase tracking-wider">
                      Image Mobile (Verticale)
                    </label>
                    <div className="relative group">
                      {mobileImagePreview ? (
                        <div className="relative aspect-[9/16] max-h-[250px] mx-auto rounded-2xl overflow-hidden border-2 border-forest-green shadow-xl shadow-forest-green/10">
                          <img
                            src={mobileImagePreview}
                            alt="Mobile preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage('mobile_image')}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-[9/16] max-h-[250px] mx-auto border-2 border-dashed border-forest-green/20 rounded-2xl cursor-pointer hover:border-forest-green hover:bg-forest-green/5 transition-all text-dark-green/30 hover:text-forest-green">
                          <ImageIcon size={32} strokeWidth={1} />
                          <span className="text-[10px] font-black uppercase mt-2 tracking-widest px-4 text-center">
                            Image Mobile (Optionnel)
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'mobile_image')}
                          />
                        </label>
                      )}
                    </div>
                    {errors.mobile_image && (
                      <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.mobile_image}
                      </p>
                    )}
                  </div>
                </div>
              </Section>
            </div>

            {/* Sidebar Options */}
            <div className="space-y-6 text-dark-green">
              <Section title="Paramètres">
                <FormField
                  label="Emplacement"
                  name="position"
                  type="select"
                  value={data.position}
                  onChange={(e) => setData('position', e.target.value)}
                  options={positions}
                  error={errors.position}
                  required
                />

                <FormField
                  label="Ordre d'affichage"
                  name="sort_order"
                  type="number"
                  value={data.sort_order}
                  onChange={(e) => setData('sort_order', e.target.value)}
                  error={errors.sort_order}
                />

                {data.type === 'popup' && (
                  <FormField
                    label="Durée d'affichage (sec)"
                    name="display_duration"
                    type="number"
                    value={data.display_duration}
                    onChange={(e) => setData('display_duration', e.target.value)}
                    hint="Temps avant la fermeture auto"
                    error={errors.display_duration}
                  />
                )}

                <div className="mt-6">
                  <FormField
                    label="Bannière active"
                    name="is_active"
                    type="checkbox"
                    value={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                  />
                </div>
              </Section>

              <Section title="Planification">
                <FormField
                  label="Date de début"
                  name="start_date"
                  type="datetime-local"
                  value={data.start_date}
                  onChange={(e) => setData('start_date', e.target.value)}
                  error={errors.start_date}
                />
                <FormField
                  label="Date de fin"
                  name="end_date"
                  type="datetime-local"
                  value={data.end_date}
                  onChange={(e) => setData('end_date', e.target.value)}
                  error={errors.end_date}
                />
                <p className="text-[10px] text-dark-green/40 mt-4 leading-relaxed font-bold uppercase tracking-wider bg-gray-50/50 p-3 rounded-xl border border-dashed border-gray-200">
                  Si vide, la bannière sera visible immédiatement et sans limite de temps dès
                  qu'elle est active.
                </p>
              </Section>

              <div className="sticky bottom-6 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-forest-green text-white rounded-2xl hover:bg-dark-green hover:scale-[1.02] active:scale-95 transition-all font-black uppercase tracking-widest shadow-xl shadow-forest-green/20 disabled:opacity-50"
                >
                  <Save size={20} />
                  {processing ? 'Création en cours...' : 'Publier la Bannière'}
                </button>
                <Link
                  href="/admin/banners"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-dark-green/10 text-dark-green rounded-2xl hover:bg-gray-50 transition-all font-black uppercase tracking-widest"
                >
                  Annuler
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
