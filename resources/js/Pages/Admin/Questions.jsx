import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/Admin/PageHeader';
import SearchFilter from '../../Components/Admin/SearchFilter';
import DataTable from '../../Components/Admin/DataTable';
import ActionButtons from '../../Components/Admin/ActionButtons';
import { MessageSquare } from 'lucide-react';

export default function Questions({ questions = {}, filters = {} }) {
    const filterOptions = [
        { 
            key: 'status', 
            label: 'Statut',
            type: 'select',
            options: [
                { label: 'Sans réponse', value: 'unanswered' },
                { label: 'Répondues', value: 'answered' },
                { label: 'Archivées', value: 'archived' },
            ]
        },
    ];

    const columns = [
        {
            key: 'product_name',
            label: 'Produit',
            width: '30%',
            render: (value) => <p className="font-bold text-gray-900 truncate">{value}</p>
        },
        {
            key: 'question',
            label: 'Question',
            width: '35%',
            render: (value) => <p className="text-gray-700 truncate">{value}</p>
        },
        {
            key: 'author',
            label: 'Auteur',
            render: (value) => <span className="text-gray-600">{value}</span>
        },
        {
            key: 'has_answer',
            label: 'Réponse',
            align: 'center',
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    value ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                }`}>
                    {value ? '✓ Répondu' : '⏳ En attente'}
                </span>
            )
        },
        {
            key: 'published',
            label: 'Visibilité',
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    value ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                }`}>
                    {value ? '👁️ Public' : '🔒 Privé'}
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
                        { key: 'view', icon: 'view', label: 'Détails', color: 'info' },
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
                    title="Questions Produits"
                    subtitle="Consultez et répondez aux questions des clients sur vos produits"
                />

                <SearchFilter 
                    placeholder="Rechercher par question ou auteur..."
                    filters={filterOptions}
                    currentFilters={filters}
                    endpoint="/admin/questions"
                />

                <DataTable 
                    columns={columns}
                    data={questions?.data || []}
                    pagination={{
                        from: questions?.from || 1,
                        to: questions?.to || 0,
                        total: questions?.total || 0,
                        links: questions?.links || []
                    }}
                    emptyMessage="Aucune question trouvée"
                />
            </div>
        </AdminLayout>
    );
}