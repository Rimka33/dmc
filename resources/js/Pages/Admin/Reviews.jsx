import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import PageHeader from '../../Components/Admin/PageHeader';
import SearchFilter from '../../Components/Admin/SearchFilter';
import DataTable from '../../Components/Admin/DataTable';
import ActionButtons from '../../Components/Admin/ActionButtons';
import { Star } from 'lucide-react';

export default function Reviews({ reviews = {}, filters = {} }) {
    const filterOptions = [
        { 
            key: 'rating', 
            label: 'Note',
            type: 'select',
            options: [
                { label: '⭐⭐⭐⭐⭐ (5 stars)', value: '5' },
                { label: '⭐⭐⭐⭐ (4 stars)', value: '4' },
                { label: '⭐⭐⭐ (3 stars)', value: '3' },
                { label: '⭐⭐ (2 stars)', value: '2' },
                { label: '⭐ (1 star)', value: '1' },
            ]
        },
        { 
            key: 'status', 
            label: 'Statut',
            type: 'select',
            options: [
                { label: 'En attente', value: 'pending' },
                { label: 'Approuvé', value: 'approved' },
                { label: 'Rejeté', value: 'rejected' },
                { label: 'Caché', value: 'hidden' },
            ]
        },
    ];

    const columns = [
        {
            key: 'rating',
            label: 'Note',
            width: '10%',
            render: (value) => (
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={i < value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                        />
                    ))}
                </div>
            )
        },
        {
            key: 'product_name',
            label: 'Produit',
            width: '30%',
            render: (value) => <p className="font-bold text-gray-900 truncate">{value}</p>
        },
        {
            key: 'author',
            label: 'Auteur',
            render: (value) => <span className="text-gray-700">{value}</span>
        },
        {
            key: 'comment',
            label: 'Commentaire',
            width: '25%',
            render: (value) => <p className="text-gray-600 truncate text-sm">{value}</p>
        },
        {
            key: 'status',
            label: 'Statut',
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    value === 'approved' ? 'bg-green-50 text-green-600' :
                    value === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                    value === 'hidden' ? 'bg-gray-50 text-gray-600' :
                    'bg-red-50 text-red-600'
                }`}>
                    {value === 'approved' ? 'Approuvé' : value === 'pending' ? 'En attente' : value === 'hidden' ? 'Caché' : 'Rejeté'}
                </span>
            )
        },
        {
            key: 'id',
            label: 'Actions',
            align: 'right',
            render: (value) => (
                <ActionButtons 
                    actions={[
                        { key: 'view', icon: 'view', label: 'Voir', color: 'info' },
                        { key: 'approve', icon: 'edit', label: 'Approuver', color: 'success' },
                        { key: 'delete', icon: 'delete', label: 'Refuser', color: 'danger' },
                    ]}
                />
            )
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Modération des Avis"
                    subtitle="Validez, refusez ou répondez aux avis clients"
                />

                <SearchFilter 
                    placeholder="Rechercher par produit ou auteur..."
                    filters={filterOptions}
                    currentFilters={filters}
                    endpoint="/admin/reviews"
                />

                <DataTable 
                    columns={columns}
                    data={reviews?.data || []}
                    pagination={{
                        from: reviews?.from || 1,
                        to: reviews?.to || 0,
                        total: reviews?.total || 0,
                        links: reviews?.links || []
                    }}
                    emptyMessage="Aucun avis trouvé"
                />
            </div>
        </AdminLayout>
    );
}