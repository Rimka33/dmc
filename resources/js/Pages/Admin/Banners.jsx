import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import PageHeader from '../../Components/Admin/PageHeader';
import DataTable from '../../Components/Admin/DataTable';
import StatusBadge from '../../Components/Admin/StatusBadge';
import ActionButtons from '../../Components/Admin/ActionButtons';
import { Plus, Image } from 'lucide-react';

export default function Banners({ banners = {} }) {
    const columns = [
        {
            key: 'title',
            label: 'Bannière',
            width: '30%',
            render: (value) => <p className="font-bold text-gray-900">{value}</p>
        },
        {
            key: 'position',
            label: 'Emplacement',
            render: (value) => <span className="text-gray-600 text-sm capitalize">{value}</span>
        },
        {
            key: 'start_date',
            label: 'Début',
            render: (value) => <span className="text-gray-600 text-sm">{new Date(value).toLocaleDateString('fr-FR')}</span>
        },
        {
            key: 'end_date',
            label: 'Fin',
            render: (value) => <span className="text-gray-600 text-sm">{new Date(value).toLocaleDateString('fr-FR')}</span>
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
                            router.get(`/admin/banners/${value}/edit`);
                        } else if (action === 'delete') {
                            if (confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
                                router.delete(`/admin/banners/${value}`);
                            }
                        }
                    }}
                />
            )
        },
    ];

    const createButton = (
        <Link
            href="/admin/banners/create"
            className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold shadow-lg shadow-forest-green/20"
        >
            <Plus size={18} />
            Nouvelle Bannière
        </Link>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Bannières & Sliders"
                    subtitle="Créez des bannières promotionnelles pour votre page d'accueil"
                    action={createButton}
                />

                <DataTable
                    columns={columns}
                    data={banners?.data || []}
                    pagination={{
                        from: banners?.from || 1,
                        to: banners?.to || 0,
                        total: banners?.total || 0,
                        links: banners?.links || []
                    }}
                    emptyMessage="Aucune bannière trouvée"
                />
            </div>
        </AdminLayout>
    );
}
