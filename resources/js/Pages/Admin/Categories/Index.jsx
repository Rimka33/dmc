import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import SearchFilter from '../../../Components/Admin/SearchFilter';
import DataTable from '../../../Components/Admin/DataTable';
import StatusBadge from '../../../Components/Admin/StatusBadge';
import ActionButtons from '../../../Components/Admin/ActionButtons';
import { Plus, Layers } from 'lucide-react';
import { resolveImagePath } from '../../../utils/imageUtils';

export default function Index({ categories }) {
    const [search, setSearch] = useState('');

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    const handleAction = (action, categoryId) => {
        if (action === 'delete') {
            handleDelete(categoryId);
        }
    };

    const columns = [
        {
            key: 'icon',
            label: 'Icône',
            width: '5%',
            render: (value, row) => (
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                    {row.image || row.icon ? (
                        <img
                            src={resolveImagePath(row.image || row.icon)}
                            alt={row.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                        />
                    ) : (
                        <Layers size={18} className="text-gray-400" />
                    )}
                </div>
            )
        },
        {
            key: 'name',
            label: 'Catégorie',
            width: '35%',
            render: (value) => <span className="font-bold text-gray-900">{value}</span>
        },
        {
            key: 'slug',
            label: 'Slug',
            width: '25%',
            render: (value) => <span className="text-gray-500 font-mono text-xs">{value}</span>
        },
        {
            key: 'products_count',
            label: 'Produits',
            align: 'center',
            render: (value) => (
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                    {value}
                </span>
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
                        { key: 'edit', icon: 'edit', label: 'Modifier', color: 'info' },
                        { key: 'delete', icon: 'delete', label: 'Supprimer', color: 'danger' },
                    ]}
                    onAction={(action) => {
                        if (action === 'edit') {
                            router.get(`/admin/categories/${value}/edit`);
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
            href="/admin/categories/create"
            className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold shadow-lg shadow-forest-green/20"
        >
            <Plus size={18} />
            Nouvelle Catégorie
        </Link>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Gestion des Catégories"
                    subtitle="Organisez vos produits par catégories et sous-catégories"
                    action={createButton}
                />

                <SearchFilter
                    placeholder="Rechercher une catégorie..."
                    currentFilters={{}}
                    endpoint="/admin/categories"
                    showFilters={false}
                />

                <DataTable
                    columns={columns}
                    data={categories?.data || []}
                    pagination={{
                        from: categories?.from || 1,
                        to: categories?.to || 0,
                        total: categories?.total || 0,
                        links: categories?.links || []
                    }}
                    emptyMessage="Aucune catégorie trouvée. Créez votre première catégorie !"
                />
            </div>
        </AdminLayout>
    );
}
