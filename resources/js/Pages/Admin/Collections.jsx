import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import PageHeader from '../../Components/Admin/PageHeader';
import SearchFilter from '../../Components/Admin/SearchFilter';
import DataTable from '../../Components/Admin/DataTable';
import StatusBadge from '../../Components/Admin/StatusBadge';
import ActionButtons from '../../Components/Admin/ActionButtons';
import { Plus, Layers } from 'lucide-react';

export default function Collections({ collections = {}, filters = {} }) {
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
    ];

    const columns = [
        {
            key: 'name',
            label: 'Collection',
            width: '40%',
            render: (value, row) => (
                <div>
                    <p className="font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{row.description}</p>
                </div>
            )
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
                />
            )
        },
    ];

    const createButton = (
        <Link
            href="/admin/collections/create"
            className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold shadow-lg shadow-forest-green/20"
        >
            <Plus size={18} />
            Nouvelle Collection
        </Link>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Collections"
                    subtitle="Créez des collections de produits (vedettes, offres, nouveautés)"
                    action={createButton}
                />

                <SearchFilter 
                    placeholder="Rechercher une collection..."
                    filters={filterOptions}
                    currentFilters={filters}
                    endpoint="/admin/collections"
                />

                <DataTable 
                    columns={columns}
                    data={collections?.data || []}
                    pagination={{
                        from: collections?.from || 1,
                        to: collections?.to || 0,
                        total: collections?.total || 0,
                        links: collections?.links || []
                    }}
                    emptyMessage="Aucune collection trouvée"
                />
            </div>
        </AdminLayout>
    );
}