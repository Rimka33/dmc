import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import SearchFilter from '../../../Components/Admin/SearchFilter';
import DataTable from '../../../Components/Admin/DataTable';
import StatusBadge from '../../../Components/Admin/StatusBadge';
import ActionButtons from '../../../Components/Admin/ActionButtons';
import { Eye, Download } from 'lucide-react';

export default function Index({ orders, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const filterOptions = [
        { 
            key: 'status', 
            label: 'Statut',
            type: 'select',
            options: [
                { label: 'En attente', value: 'pending' },
                { label: 'Payée', value: 'paid' },
                { label: 'En préparation', value: 'preparing' },
                { label: 'Expédiée', value: 'shipped' },
                { label: 'Livrée', value: 'delivered' },
                { label: 'Annulée', value: 'cancelled' },
            ]
        },
        { 
            key: 'date', 
            label: 'Date',
            type: 'date',
        },
    ];

    const columns = [
        {
            key: 'order_number',
            label: 'Commande',
            width: '15%',
            render: (value, row) => (
                <div>
                    <p className="font-bold text-gray-900">#{value || row.id}</p>
                    <p className="text-xs text-gray-500">{new Date(row.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
            )
        },
        {
            key: 'customer_name',
            label: 'Client',
            width: '25%',
            render: (value) => <span className="text-gray-700">{value || 'Client'}</span>
        },
        {
            key: 'total',
            label: 'Montant',
            width: '15%',
            render: (value) => (
                <p className="font-bold text-gray-900">
                    {new Intl.NumberFormat('fr-FR').format(value)} F
                </p>
            )
        },
        {
            key: 'items_count',
            label: 'Articles',
            align: 'center',
            render: (value) => <span className="text-sm">{value}</span>
        },
        {
            key: 'status',
            label: 'Statut',
            render: (value) => <StatusBadge status={value} />
        },
        {
            key: 'id',
            label: 'Actions',
            align: 'right',
            render: (value) => (
                <ActionButtons 
                    actions={[
                        { key: 'view', icon: 'view', label: 'Détails', color: 'info' },
                        { key: 'download', icon: 'download', label: 'Facture', color: 'info' },
                    ]}
                    onAction={(action) => {
                        if (action === 'view') {
                            router.get(`/admin/orders/${value}`);
                        }
                    }}
                />
            )
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Gestion des Commandes"
                    subtitle="Suivez et gérez toutes les commandes de votre boutique"
                />

                <SearchFilter 
                    placeholder="Rechercher par numéro de commande ou client..."
                    filters={filterOptions}
                    currentFilters={filters}
                    endpoint="/admin/orders"
                />

                <DataTable 
                    columns={columns}
                    data={orders?.data || []}
                    pagination={{
                        from: orders?.from || 1,
                        to: orders?.to || 0,
                        total: orders?.total || 0,
                        links: orders?.links || []
                    }}
                    emptyMessage="Aucune commande trouvée"
                />
            </div>
        </AdminLayout>
    );
}