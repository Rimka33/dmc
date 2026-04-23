import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import SearchFilter from '../../../Components/Admin/SearchFilter';
import DataTable from '../../../Components/Admin/DataTable';
import StatusBadge from '../../../Components/Admin/StatusBadge';
import ActionButtons from '../../../Components/Admin/ActionButtons';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import { Plus, ShoppingBag } from 'lucide-react';

export default function Index({ products, filters = {}, categories = [] }) {
  const [search, setSearch] = useState(filters.search || '');
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = (id) => {
    setDeletingId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    router.delete(`/admin/products/${deletingId}`, {
      onSuccess: () => {
        setShowConfirm(false);
        setDeletingId(null);
      },
      onFinish: () => setShowConfirm(false),
    });
  };

  const handleAction = (action, productId) => {
    if (action === 'delete') {
      handleDelete(productId);
    } else if (action === 'view') {
      window.open(`/produit/${productId}`, '_blank');
    }
  };

  // Résout correctement le chemin d'une image : accepte les chemins stockés
  // dans storage (DB), les chemins publics sous /images/... ou les URL complètes.
  const resolveSrc = (path) => {
    if (!path) return '/images/placeholder.png';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return path;
    if (path.startsWith('images/') || path.startsWith('public/images/'))
      return `/${path.replace(/^\/+/, '')}`;
    return `/storage/${path}`;
  };

  const filterOptions = [
    {
      key: 'status',
      label: 'Statut',
      type: 'select',
      options: [
        { label: 'Actif', value: 'active' },
        { label: 'Inactif', value: 'inactive' },
      ],
    },
    {
      key: 'category',
      label: 'Catégorie',
      type: 'select',
      options: categories.map((c) => ({ label: c.name, value: c.slug || c.id })),
    },
    {
      key: 'stock',
      label: 'Stock',
      type: 'select',
      options: [
        { label: 'En stock', value: 'in_stock' },
        { label: 'Faible stock', value: 'low_stock' },
        { label: 'Rupture', value: 'out_of_stock' },
      ],
    },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Produit',
      width: '40%',
      render: (value, row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-forest-green/5 rounded-xl flex items-center justify-center overflow-hidden border border-forest-green/10 flex-shrink-0 relative group/img">
            {row.images?.length > 0 ? (
              <img
                src={resolveSrc(row.images[0].image_path)}
                alt={row.name}
                className="w-full h-full object-cover transition-transform group-hover/img:scale-110"
                onError={(e) => {
                  e.target.src = '/images/placeholder.png';
                }}
              />
            ) : (
              <ShoppingBag size={20} className="text-forest-green/30" />
            )}
            <div className="absolute inset-0 bg-forest-green/5 opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-bold text-dark-green truncate text-sm uppercase tracking-tight"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {row.name}
            </p>
            <p className="text-[10px] text-dark-green/40 font-black tracking-widest uppercase mt-0.5">
              SKU: {row.sku || 'N/A'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Catégorie',
      render: (value, row) => (
        <span className="text-dark-green/60 text-xs font-bold uppercase tracking-wider">
          {row.category?.name || 'Non classé'}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Prix',
      render: (value) => (
        <p className="font-black text-forest-green text-sm">
          {new Intl.NumberFormat('fr-FR').format(value)} FCFA
        </p>
      ),
    },
    {
      key: 'stock_quantity',
      label: 'Stock',
      align: 'center',
      render: (value) => (
        <div className="flex items-center justify-center gap-2.5">
          <div
            className={`w-1.5 h-1.5 rounded-full shadow-sm animate-pulse ${
              value > 10
                ? 'bg-forest-green shadow-forest-green/50'
                : value > 0
                  ? 'bg-amber-500 shadow-amber-500/50'
                  : 'bg-red-500 shadow-red-500/50'
            }`}
          />
          <span className="font-black text-dark-green text-xs">{value}</span>
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Statut',
      render: (value) => <StatusBadge status={value ? 'active' : 'inactive'} />,
    },
    {
      key: 'id',
      label: 'Actions',
      align: 'right',
      render: (value) => (
        <ActionButtons
          actions={[
            { key: 'view', icon: 'view', label: 'Détails', color: 'info' },
            { key: 'edit', icon: 'edit', label: 'Modifier', color: 'info' },
            { key: 'delete', icon: 'delete', label: 'Supprimer', color: 'danger' },
          ]}
          onAction={(action) => {
            if (action === 'edit') {
              router.get(`/admin/products/${value}/edit`);
            } else if (action === 'view') {
              router.get(`/admin/products/${value}`);
            } else {
              handleAction(action, value);
            }
          }}
        />
      ),
    },
  ];

  const createButton = (
    <Link
      href="/admin/products/create"
      className="flex items-center gap-2 px-6 py-3 bg-forest-green text-white rounded-xl hover:bg-dark-green transition-all font-bold shadow-lg shadow-forest-green/20"
    >
      <Plus size={18} />
      Nouveau Produit
    </Link>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Gestion des Produits"
          subtitle="Gérez l'inventaire complet de votre boutique DMC"
          action={createButton}
        />

        <SearchFilter
          placeholder="Rechercher par nom ou SKU..."
          filters={filterOptions}
          currentFilters={filters}
          endpoint="/admin/products"
        />

        <DataTable
          columns={columns}
          data={products?.data || []}
          pagination={{
            from: products?.from || 1,
            to: products?.to || 0,
            total: products?.total || 0,
            links: products?.links || [],
          }}
          emptyMessage="Aucun produit trouvé. Créez votre premier produit !"
        />
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Supprimer le produit"
        message="Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
        confirmText="Supprimer"
        isDangerous={true}
      />
    </AdminLayout>
  );
}
