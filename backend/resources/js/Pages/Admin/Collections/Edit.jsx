import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, AlertCircle, Plus, X, Search, GripVertical } from 'lucide-react';
import { resolveImagePath } from '../../../utils/imageUtils';

export default function Edit({ collection, products = [], types = [] }) {
  const { data, setData, put, processing, errors } = useForm({
    name: collection?.name || '',
    slug: collection?.slug || '',
    description: collection?.description || '',
    type: collection?.type || 'custom',
    sort_order: collection?.sort_order || 0,
    limit: collection?.limit || 8,
    is_active: collection?.is_active ?? true,
    products:
      collection?.products?.map((p) => ({
        id: p.id,
        sort_order: p.pivot?.sort_order || 0,
      })) || [],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState(
    collection?.products?.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      price: p.price,
      image: p.images?.[0]?.image_path || p.primary_image || null,
      sort_order: p.pivot?.sort_order || 0,
    })) || []
  );

  useEffect(() => {
    setData(
      'products',
      selectedProducts.map((p) => ({ id: p.id, sort_order: p.sort_order }))
    );
  }, [selectedProducts]);

  const filteredProducts = products.filter(
    (p) =>
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      !selectedProducts.find((sp) => sp.id === p.id)
  );

  const handleAddProduct = (product) => {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      const newProduct = {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        image: product.images?.[0]?.image_path || product.primary_image || null,
        sort_order: selectedProducts.length,
      };
      setSelectedProducts([...selectedProducts, newProduct]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const handleSortOrderChange = (productId, sortOrder) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.id === productId ? { ...p, sort_order: parseInt(sortOrder) || 0 } : p
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/collections/${collection.id}`);
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/collections"
              className="flex items-center gap-1 text-gray-500 hover:text-forest-green mb-2 text-sm"
            >
              <ArrowLeft size={16} /> Retour à la liste
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Modifier la Collection</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Nom de la collection *
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neon-green outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Ex: Produits en vedette"
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Type de collection *</label>
                <select
                  value={data.type}
                  onChange={(e) => setData('type', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neon-green outline-none transition-all ${errors.type ? 'border-red-500' : 'border-gray-200'}`}
                  required
                >
                  {types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.type}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Slug *</label>
                <input
                  type="text"
                  value={data.slug}
                  onChange={(e) => setData('slug', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neon-green outline-none transition-all ${errors.slug ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="produits-en-vedette"
                  required
                />
                {errors.slug && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.slug}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Limite de produits</label>
                <input
                  type="number"
                  value={data.limit}
                  onChange={(e) => setData('limit', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-neon-green outline-none transition-all"
                  min="1"
                  max="50"
                />
                <p className="text-[10px] text-gray-400 italic">
                  Nombre maximum de produits à afficher
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-neon-green outline-none transition-all"
                placeholder="Description de la collection..."
              ></textarea>
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

          {/* Products Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Produits de la collection</h2>

            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Produits sélectionnés ({selectedProducts.length})
                  {data.limit && (
                    <span className="text-xs text-gray-500 font-normal ml-2">
                      (Limite: {data.limit} produits)
                    </span>
                  )}
                </label>
                <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {selectedProducts
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((product, index) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-forest-green transition-all group"
                      >
                        <GripVertical
                          className="text-gray-400 group-hover:text-forest-green cursor-move"
                          size={18}
                        />

                        {/* Product Image */}
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <img
                              src={resolveImagePath(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/images/placeholder.png';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              IMG
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {product.name}
                          </p>
                          {product.sku && (
                            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                          )}
                          {product.price && (
                            <p className="text-xs text-gray-600 font-medium">
                              {parseFloat(product.price).toLocaleString('fr-FR')} FCFA
                            </p>
                          )}
                        </div>

                        {/* Sort Order */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500">Ordre:</label>
                          <input
                            type="number"
                            value={product.sort_order}
                            onChange={(e) => handleSortOrderChange(product.id, e.target.value)}
                            className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center"
                            min="0"
                          />
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer de la collection"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {selectedProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-sm">Aucun produit dans cette collection</p>
                <p className="text-xs mt-1">
                  Utilisez la recherche ci-dessous pour ajouter des produits
                </p>
              </div>
            )}

            {/* Product Search */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Ajouter des produits</label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-neon-green outline-none"
                  placeholder="Rechercher un produit..."
                />
              </div>
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg mt-2">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const productImage =
                      product.images?.[0]?.image_path || product.primary_image || null;
                    return (
                      <div
                        key={product.id}
                        className="p-3 border-b border-gray-100 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        {/* Product Image */}
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {productImage ? (
                            <img
                              src={resolveImagePath(productImage)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/images/placeholder.png';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              IMG
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          {product.sku && (
                            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                          )}
                          {product.price && (
                            <p className="text-xs text-gray-600 font-medium">
                              {parseFloat(product.price).toLocaleString('fr-FR')} FCFA
                            </p>
                          )}
                        </div>

                        {/* Add Button */}
                        <button
                          type="button"
                          onClick={() => handleAddProduct(product)}
                          className="p-2 text-forest-green hover:bg-green-50 rounded-lg transition-colors flex-shrink-0"
                          title="Ajouter à la collection"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-sm text-gray-500">
                    {searchQuery ? (
                      <>
                        <p className="font-medium">Aucun produit trouvé</p>
                        <p className="text-xs mt-1">Essayez avec un autre terme de recherche</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">Tous les produits sont déjà ajoutés</p>
                        <p className="text-xs mt-1">Ou aucun produit disponible</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/admin/collections"
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
              {processing ? 'Enregistrement...' : 'Mettre à jour la collection'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
