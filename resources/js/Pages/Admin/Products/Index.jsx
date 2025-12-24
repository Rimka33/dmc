import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import SearchFilter from '../../../Components/Admin/SearchFilter';
import DataTable from '../../../Components/Admin/DataTable';
import StatusBadge from '../../../Components/Admin/StatusBadge';
import ActionButtons from '../../../Components/Admin/ActionButtons';
import { Plus, ShoppingBag } from 'lucide-react';

export default function Index({ products, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
            router.delete(`/admin/products/${id}`, {
                onSuccess: () => setDeletingId(null),
            });
        }
    };

    const handleAction = (action, productId) => {
        if (action === 'delete') {
            handleDelete(productId);
        } else if (action === 'view') {
            window.open(`/produit/${productId}`, '_blank');
        }
    };

    const filterOptions = [
        {
            key: 'status',
            label: 'Statut',
            type: 'select',
            options: [
                { label: 'Actif', value: 'active' },
                { label: 'Inactif', value: 'inactive' },
            ]
        },
        {
            key: 'category',
            label: 'Catégorie',
            type: 'select',
            options: [
                { label: 'Électronique', value: 'electronics' },
                { label: 'Informatique', value: 'computer' },
            ]
        },
        {
            key: 'stock',
            label: 'Stock',
            type: 'select',
            options: [
                { label: 'En stock', value: 'in_stock' },
                { label: 'Faible stock', value: 'low_stock' },
                { label: 'Rupture', value: 'out_of_stock' },
            ]
        },
    ];

    const columns = [
        {
            key: 'name',
            label: 'Produit',
            width: '30%',
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                        {row.images?.length > 0 ? (
                            <img
                                src={row.images[0].image_path ? `/storage/${row.images[0].image_path}` : '/images/placeholder.png'}
                                alt={row.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                            />
                        ) : (
                            <ShoppingBag size={18} className="text-gray-400" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{row.name}</p>
                        <p className="text-xs text-gray-400 font-mono">SKU: {row.sku || 'N/A'}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'category',
            label: 'Catégorie',
            render: (value, row) => <span className="text-gray-600 text-sm">{row.category?.name || 'Non classé'}</span>
        },
        {
            key: 'price',
            label: 'Prix',
            render: (value) => (
                <p className="font-bold text-gray-900">
                    {new Intl.NumberFormat('fr-FR').format(value)} F
                </p>
            )
        },
        {
            key: 'stock_quantity',
            label: 'Stock',
            align: 'center',
            render: (value) => (
                <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${value > 10 ? 'bg-green-500' :
                        value > 0 ? 'bg-amber-500' :
                            'bg-red-500'
                        }`} />
                    <span className="font-semibold text-gray-700 text-sm">{value}</span>
                </div>
            )
        },
        {
            key: 'is_active',
            label: 'Statut',
            render: (value) => <StatusBadge status={value ? 'active' : 'inactive'} />
        },
        {
            key: 'id',
            label: 'Actions',
            align: 'right',
            render: (value) => (
                <ActionButtons
                    actions={[
                        { key: 'view', icon: 'view', label: 'Voir sur le site', color: 'info' },
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
            )
        },
    ];

    const createButton = (
        <Link
            href="/admin/products/create"
            className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold shadow-lg shadow-forest-green/20"
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
                        links: products?.links || []
                    }}
                    emptyMessage="Aucun produit trouvé. Créez votre premier produit !"
                />
            </div>
        </AdminLayout>
    );
}