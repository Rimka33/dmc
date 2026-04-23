import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import PageHeader from '../../Components/Admin/PageHeader';
import SearchFilter from '../../Components/Admin/SearchFilter';
import DataTable from '../../Components/Admin/DataTable';
import { Eye, Mail, Archive } from 'lucide-react';

export default function Messages({ messages = {}, filters = {} }) {
  const filterOptions = [
    {
      key: 'status',
      label: 'Statut',
      type: 'select',
      options: [
        { label: 'Tous', value: '' },
        { label: 'Nouveau', value: 'new' },
        { label: 'Lu', value: 'read' },
        { label: 'Répondu', value: 'replied' },
        { label: 'Archivé', value: 'archived' },
      ],
    },
  ];

  const columns = [
    {
      key: 'subject',
      label: 'Sujet',
      width: '25%',
      render: (value) => (
        <p className="font-bold text-gray-900 truncate">{value || 'Sans sujet'}</p>
      ),
    },
    {
      key: 'name',
      label: 'Nom',
      width: '15%',
      render: (value) => <span className="text-gray-700">{value || '-'}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      width: '20%',
      render: (value) => <span className="text-gray-600 text-sm truncate">{value}</span>,
    },
    {
      key: 'message',
      label: 'Message',
      width: '20%',
      render: (value) => (
        <p className="text-gray-600 text-sm truncate">
          {value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'}
        </p>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      width: '10%',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            value === 'new'
              ? 'bg-blue-50 text-blue-600'
              : value === 'read'
                ? 'bg-gray-50 text-gray-600'
                : value === 'replied'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-yellow-50 text-yellow-600'
          }`}
        >
          {value === 'new'
            ? '🆕 Nouveau'
            : value === 'read'
              ? '📖 Lu'
              : value === 'replied'
                ? '✓ Répondu'
                : '📦 Archivé'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      width: '10%',
      render: (value) => (
        <span className="text-gray-600 text-sm">{new Date(value).toLocaleDateString('fr-FR')}</span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      align: 'right',
      render: (value, row) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => router.get(`/admin/messages/${value}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Lire"
          >
            <Eye size={16} />
          </button>
          {row.status !== 'archived' && (
            <button
              onClick={() => {
                router.post(
                  `/admin/messages/${value}/archive`,
                  {},
                  {
                    preserveScroll: true,
                    onSuccess: () => router.reload(),
                  }
                );
              }}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Archiver"
            >
              <Archive size={16} />
            </button>
          )}
        </div>
      ),
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
          placeholder="Rechercher par sujet, nom ou email..."
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
            links: messages?.links || [],
          }}
          emptyMessage="Aucun message"
        />
      </div>
    </AdminLayout>
  );
}
