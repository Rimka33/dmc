import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import PageHeader from '../../Components/Admin/PageHeader';
import SearchFilter from '../../Components/Admin/SearchFilter';
import DataTable from '../../Components/Admin/DataTable';
import { Eye, MessageSquare, CheckCircle } from 'lucide-react';

export default function Questions({ questions = {}, filters = {} }) {
    const filterOptions = [
        { 
            key: 'status', 
            label: 'Statut',
            type: 'select',
            options: [
                { label: 'Tous', value: '' },
                { label: 'Sans réponse', value: 'unanswered' },
                { label: 'Répondues', value: 'answered' },
                { label: 'Visibles', value: 'visible' },
                { label: 'Masquées', value: 'hidden' },
            ]
        },
    ];

    const columns = [
        {
            key: 'product_name',
            label: 'Produit',
            width: '25%',
            render: (value) => <p className="font-bold text-gray-900 truncate">{value || 'N/A'}</p>
        },
        {
            key: 'question',
            label: 'Question',
            width: '30%',
            render: (value) => <p className="text-gray-700 truncate">{value ? (value.length > 60 ? value.substring(0, 60) + '...' : value) : '-'}</p>
        },
        {
            key: 'user_name',
            label: 'Auteur',
            width: '15%',
            render: (value) => <span className="text-gray-600">{value || 'Anonyme'}</span>
        },
        {
            key: 'has_answer',
            label: 'Réponse',
            width: '10%',
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
            key: 'is_visible',
            label: 'Visibilité',
            width: '10%',
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
            render: (value, row) => (
                <div className="flex items-center gap-2 justify-end">
                    <button
                        onClick={() => router.get(`/admin/questions/${value}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir/Répondre"
                    >
                        <Eye size={16} />
                    </button>
                    {!row.answer && (
                        <button
                            onClick={() => router.get(`/admin/questions/${value}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Répondre"
                        >
                            <MessageSquare size={16} />
                        </button>
                    )}
                </div>
            )
        },
    ];

    const formatData = (questions) => {
        return questions?.data?.map(question => ({
            ...question,
            product_name: question.product?.name || 'N/A',
            user_name: question.user?.name || 'Anonyme',
            has_answer: !!question.answer,
        })) || [];
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Questions Produits"
                    subtitle="Consultez et répondez aux questions des clients sur vos produits"
                />

                <SearchFilter 
                    placeholder="Rechercher par question, produit ou auteur..."
                    filters={filterOptions}
                    currentFilters={filters}
                    endpoint="/admin/questions"
                />

                <DataTable 
                    columns={columns}
                    data={formatData(questions)}
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
