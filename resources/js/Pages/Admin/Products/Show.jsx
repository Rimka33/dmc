import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import Section from '../../../Components/Admin/Section';
import StatusBadge from '../../../Components/Admin/StatusBadge';
import { Edit, ArrowLeft, Package, DollarSign, Tag, Image as ImageIcon, Video } from 'lucide-react';

export default function Show({ product }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  const resolveSrc = (path) => {
    if (!path) return '/images/placeholder.png';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return path;
    if (path.startsWith('images/') || path.startsWith('public/images/'))
      return `/${path.replace(/^\/+/, '')}`;
    return `/storage/${path}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title={`Détails: ${product.name}`}
          subtitle={`SKU: ${product.sku || 'N/A'}`}
          breadcrumbs={['Produits', product.name]}
          action={
            <div className="flex items-center gap-3">
              <Link
                href="/admin/products"
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold shadow-sm"
              >
                <ArrowLeft size={18} />
                Retour
              </Link>
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-md"
              >
                <Edit size={18} />
                Modifier
              </Link>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Section title="Informations Générales" icon={Package}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom du produit</p>
                    <p className="font-bold text-gray-900 text-lg">{product.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <div className="mt-1">
                      <StatusBadge status={product.is_active ? 'active' : 'inactive'} />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
                    {product.description || 'Aucune description disponible.'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Catégorie</p>
                    <p className="font-semibold text-gray-900">
                      {product.category?.name || 'Non classé'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.tags &&
                        JSON.parse(product.tags).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      {(!product.tags || JSON.parse(product.tags).length === 0) && (
                        <span className="text-sm text-gray-400 italic">Aucun tag</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Galerie Média" icon={ImageIcon}>
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.images.map((media) => {
                    const src = resolveSrc(media.image_path);
                    const isVideo =
                      typeof src === 'string' && (src.endsWith('.mp4') || src.endsWith('.webm'));
                    return (
                      <div
                        key={media.id}
                        className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square"
                      >
                        {isVideo ? (
                          <video src={src} className="w-full h-full object-cover" controls />
                        ) : (
                          <img
                            src={src}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/images/placeholder.png';
                            }}
                          />
                        )}
                        {media.is_primary && (
                          <div className="absolute top-2 left-2 bg-forest-green text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold shadow-sm">
                            Principal
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 italic">
                  Aucune image ou vidéo disponible.
                </div>
              )}
            </Section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Section title="Prix et Stock" icon={DollarSign}>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Prix de base</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                {product.discount_price && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Prix promo</span>
                    <span className="font-bold text-red-600 text-lg">
                      {formatCurrency(product.discount_price)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">En stock</span>
                  <span
                    className={`font-bold ${product.stock_quantity > 10 ? 'text-green-600' : 'text-orange-500'}`}
                  >
                    {product.stock_quantity} unités
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Dernière mise à jour</span>
                  <span className="text-sm text-gray-900">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
