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
            width: '20%',
            render: (value, row) => (
                <div className="flex flex-col">
                    <p className="font-black text-dark-green text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>#{value || row.id}</p>
                    <p className="text-[10px] text-dark-green/40 font-black tracking-widest uppercase mt-0.5">{new Date(row.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
            )
        },
        {
            key: 'customer_name',
            label: 'Client',
            width: '25%',
            render: (value) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-forest-green/10 flex items-center justify-center">
                        <span className="text-xs font-black text-forest-green">{(value || 'C')[0].toUpperCase()}</span>
                    </div>
                    <span className="text-dark-green font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{value || 'Client'}</span>
                </div>
            )
        },
        {
            key: 'total',
            label: 'Montant',
            width: '15%',
            render: (value) => (
                <p className="font-black text-forest-green text-sm">
                    {new Intl.NumberFormat('fr-FR').format(value)} FCFA
                </p>
            )
        },
        {
            key: 'items_count',
            label: 'Articles',
            align: 'center',
            render: (value) => (
                <span className="px-2 py-1 bg-dark-green/5 rounded-lg text-xs font-bold text-dark-green">
                    {value} {value > 1 ? 'articles' : 'article'}
                </span>
            )
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
