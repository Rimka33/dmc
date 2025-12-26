import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import PageHeader from '../../Components/Admin/PageHeader';
import SearchFilter from '../../Components/Admin/SearchFilter';
import DataTable from '../../Components/Admin/DataTable';
import StatusBadge from '../../Components/Admin/StatusBadge';
import ActionButtons from '../../Components/Admin/ActionButtons';
import { Plus, FileText } from 'lucide-react';

export default function Blog({ articles = {}, filters = {} }) {
    const filterOptions = [
        { 
            key: 'status', 
            label: 'Statut',
            type: 'select',
            options: [
                { label: 'Publié', value: 'published' },
                { label: 'Brouillon', value: 'draft' },
                { label: 'Archivé', value: 'archived' },
            ]
        },
    ];

    const columns = [
        {
            key: 'title',
            label: 'Article',
            width: '35%',
            render: (value, row) => (
                <div>
                    <p className="font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{new Date(row.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
            )
        },
        {
            key: 'category',
            label: 'Catégorie',
            render: (value) => <span className="text-gray-700">{value || 'Non classé'}</span>
        },
        {
            key: 'excerpt',
            label: 'Résumé',
            width: '25%',
            render: (value) => <p className="text-gray-600 text-sm truncate">{value}</p>
        },
        {
            key: 'status',
            label: 'Statut',
            render: (value) => <StatusBadge status={value} />
        },
        {
            key: 'views',
            label: 'Vues',
            align: 'center',
            render: (value) => <span className="font-bold text-gray-900">{value || 0}</span>
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
                            router.get(`/admin/blog/${value}/edit`);
                        } else if (action === 'delete') {
                            if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
                                router.delete(`/admin/blog/${value}`);
                            }
                        }
                    }}
                />
            )
        },
    ];

    const createButton = (
        <Link
            href="/admin/blog/create"
            className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold shadow-lg shadow-forest-green/20"
        >
            <Plus size={18} />
            Nouvel Article
        </Link>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Gestion du Blog"
                    subtitle="Créez et gérez les articles de votre blog"
                    action={createButton}
                />

                <SearchFilter 
                    placeholder="Rechercher par titre..."
                    filters={filterOptions}
                    currentFilters={filters}
                    endpoint="/admin/blog"
                />

                <DataTable 
                    columns={columns}
                    data={articles?.data || []}
                    pagination={{
                        from: articles?.from || 1,
                        to: articles?.to || 0,
                        total: articles?.total || 0,
                        links: articles?.links || []
                    }}
                    emptyMessage="Aucun article trouvé"
                />
            </div>
        </AdminLayout>
    );
}
