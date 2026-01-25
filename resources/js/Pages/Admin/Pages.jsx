import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import PageHeader from '../../Components/Admin/PageHeader';
import SearchFilter from '../../Components/Admin/SearchFilter';
import DataTable from '../../Components/Admin/DataTable';
import StatusBadge from '../../Components/Admin/StatusBadge';
import ActionButtons from '../../Components/Admin/ActionButtons';
import { Plus, FileText } from 'lucide-react';

export default function Pages({ pages = {}, filters = {} }) {
    const filterOptions = [
        {
            key: 'status',
            label: 'Statut',
            type: 'select',
            options: [
                { label: 'Publié', value: 'published' },
                { label: 'Brouillon', value: 'draft' },
            ]
        },
    ];

    const columns = [
        {
            key: 'title',
            label: 'Page',
            width: '40%',
            render: (value) => <p className="font-bold text-gray-900">{value}</p>
        },
        {
            key: 'slug',
            label: 'URL',
            render: (value) => <span className="text-gray-600 text-sm font-mono">/{value}</span>
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
                        { key: 'edit', icon: 'edit', label: 'Modifier', color: 'info' },
                        { key: 'delete', icon: 'delete', label: 'Supprimer', color: 'danger' },
                    ]}
                    onAction={(action) => {
                        if (action === 'edit') {
                            router.get(`/admin/pages/${value}/edit`);
                        } else if (action === 'delete') {
                            if (confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
                                router.delete(`/admin/pages/${value}`);
                            }
                        }
                    }}
                />
            )
        },
    ];

    const createButton = (
        <Link
            href="/admin/pages/create"
            className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold shadow-lg shadow-forest-green/20"
        >
            <Plus size={18} />
            Nouvelle Page
        </Link>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Pages"
                    subtitle="Créez et gérez les pages statiques de votre site"
                    action={createButton}
                />

                <SearchFilter
                    placeholder="Rechercher une page..."
                    filters={filterOptions}
                    currentFilters={filters}
                    endpoint="/admin/pages"
                />

                <DataTable
                    columns={columns}
                    data={pages?.data || []}
                    pagination={{
                        from: pages?.from || 1,
                        to: pages?.to || 0,
                        total: pages?.total || 0,
                        links: pages?.links || []
                    }}
                    emptyMessage="Aucune page trouvée"
                />
            </div>
        </AdminLayout>
    );
}
