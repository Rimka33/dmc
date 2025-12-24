import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/Admin/PageHeader';
import SearchFilter from '../../Components/Admin/SearchFilter';
import DataTable from '../../Components/Admin/DataTable';
import ActionButtons from '../../Components/Admin/ActionButtons';
import { Mail } from 'lucide-react';

export default function Messages({ messages = {}, filters = {} }) {
    const filterOptions = [
        { 
            key: 'status', 
            label: 'Statut',
            type: 'select',
            options: [
                { label: 'Nouveau', value: 'new' },
                { label: 'En cours', value: 'in_progress' },
                { label: 'Résolu', value: 'resolved' },
            ]
        },
    ];

    const columns = [
        {
            key: 'subject',
            label: 'Sujet',
            width: '30%',
            render: (value) => <p className="font-bold text-gray-900 truncate">{value}</p>
        },
        {
            key: 'name',
            label: 'Client',
            render: (value) => <span className="text-gray-700">{value}</span>
        },
        {
            key: 'email',
            label: 'Email',
            width: '25%',
            render: (value) => <span className="text-gray-600 text-sm truncate">{value}</span>
        },
        {
            key: 'status',
            label: 'Statut',
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    value === 'new' ? 'bg-blue-50 text-blue-600' :
                    value === 'in_progress' ? 'bg-orange-50 text-orange-600' :
                    'bg-green-50 text-green-600'
                }`}>
                    {value === 'new' ? '🆕 Nouveau' : value === 'in_progress' ? '⏳ En cours' : '✓ Résolu'}
                </span>
            )
        },
        {
            key: 'created_at',
            label: 'Date',
            render: (value) => <span className="text-gray-600 text-sm">{new Date(value).toLocaleDateString('fr-FR')}</span>
        },
        {
            key: 'id',
            label: 'Actions',
            align: 'right',
            render: (value) => (
                <ActionButtons 
                    actions={[
                        { key: 'view', icon: 'view', label: 'Lire', color: 'info' },
                        { key: 'reply', icon: 'edit', label: 'Répondre', color: 'success' },
                    ]}
                />
            )
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Boîte de Réception"
                    subtitle="Messages et demandes de support des clients"
                />

                <SearchFilter 
                    placeholder="Rechercher par sujet ou client..."
                    filters={filterOptions}
                    currentFilters={filters}
                    endpoint="/admin/messages"
                />

                <DataTable 
                    columns={columns}
                    data={messages?.data || []}
                    pagination={{
                        from: messages?.from || 1,
                        to: messages?.to || 0,
                        total: messages?.total || 0,
                        links: messages?.links || []
                    }}
                    emptyMessage="Aucun message"
                />
            </div>
        </AdminLayout>
    );
}