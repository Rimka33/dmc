import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import SearchFilter from '../../../Components/Admin/SearchFilter';
import DataTable from '../../../Components/Admin/DataTable';
import StatusBadge from '../../../Components/Admin/StatusBadge';
import ActionButtons from '../../../Components/Admin/ActionButtons';
import { Plus, Layers, Star, Sparkles, Gift, Award } from 'lucide-react';

export default function Index({ collections = {}, filters = {} }) {
    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette collection ?')) {
            router.delete(`/admin/collections/${id}`);
        }
    };

    const handleAction = (action, collectionId) => {
        if (action === 'delete') {
            handleDelete(collectionId);
        }
    };

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
            width: '30%',
            render: (value, row) => (
                <div>
                    <p className="font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{row.description || 'Aucune description'}</p>
                </div>
            )
        },
        {
            key: 'type',
            label: 'Type',
            width: '15%',
            render: (value) => {
                const types = {
                    'featured': 'Vedette',
                    'new': 'Nouveautés',
                    'special_offers': 'Offres',
                    'best_sellers': 'Meilleures ventes',
                    'custom': 'Personnalisée'
                };
                return (
                    <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
                        {types[value] || value}
                    </span>
                );
            }
        },
        {
            key: 'products_count',
            label: 'Produits',
            align: 'center',
            render: (value, row) => (
                <Link
                    href={`/admin/collections/${row.id}/edit`}
                    className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                >
                    {value || 0} produit{value !== 1 ? 's' : ''}
                </Link>
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
                            router.get(`/admin/collections/${value}/edit`);
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

                {/* Afficher les collections existantes dans un tableau */}
                {(collections?.data && collections.data.length > 0) ? (
                    <DataTable
                        columns={columns}
                        data={collections.data}
                        pagination={{
                            from: collections?.from || 1,
                            to: collections?.to || 0,
                            total: collections?.total || 0,
                            links: collections?.links || []
                        }}
                        emptyMessage="Aucune collection trouvée. Créez votre première collection !"
                    />
                ) : (
                    <div className="space-y-6">
                        {/* Message d'information */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                            <p className="text-gray-700 font-semibold mb-2">Aucune collection créée</p>
                            <p className="text-sm text-gray-600">Créez vos premières collections pour organiser vos produits sur la page d'accueil</p>
                        </div>

                        {/* Types de collections disponibles */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Types de collections disponibles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { type: 'featured', label: 'Produits en Vedette', icon: Star, bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600', description: 'Mettez en avant vos meilleurs produits' },
                                    { type: 'new', label: 'Nouveautés', icon: Sparkles, bgColor: 'bg-blue-50', iconColor: 'text-blue-600', description: 'Affichez vos nouveaux produits' },
                                    { type: 'special_offers', label: 'Offres Spéciales', icon: Gift, bgColor: 'bg-red-50', iconColor: 'text-red-600', description: 'Promotions et offres spéciales' },
                                    { type: 'best_sellers', label: 'Meilleures Ventes', icon: Award, bgColor: 'bg-green-50', iconColor: 'text-green-600', description: 'Vos produits les plus vendus' },
                                ].map((section) => {
                                    const Icon = section.icon;
                                    const existingCollection = collections?.data?.find(c => c.type === section.type);

                                    return (
                                        <Link
                                            key={section.type}
                                            href={existingCollection ? `/admin/collections/${existingCollection.id}/edit` : `/admin/collections/create?type=${section.type}`}
                                            className="group p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-forest-green transition-all hover:shadow-lg"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`p-3 ${section.bgColor} rounded-lg`}>
                                                    <Icon className={`w-6 h-6 ${section.iconColor}`} />
                                                </div>
                                                {existingCollection ? (
                                                    <StatusBadge status="active" size="sm" text="Créée" />
                                                ) : (
                                                    <StatusBadge status="inactive" size="sm" text="Non créée" />
                                                )}
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-1 group-hover:text-forest-green transition-colors">
                                                {section.label}
                                            </h4>
                                            <p className="text-xs text-gray-500 mb-3">{section.description}</p>
                                            <div className="pt-3 border-t border-gray-100">
                                                <span className="text-xs font-semibold text-forest-green group-hover:underline">
                                                    {existingCollection ? 'Modifier →' : 'Créer →'}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

