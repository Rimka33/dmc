import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import PageHeader from '../../Components/Admin/PageHeader';
import SearchFilter from '../../Components/Admin/SearchFilter';
import DataTable from '../../Components/Admin/DataTable';
import { Mail, Download, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Newsletter({ subscriptions = {}, stats = {}, filters = {} }) {
  const filterOptions = [
    {
      key: 'status',
      label: 'Statut',
      type: 'select',
      options: [
        { label: 'Tous', value: '' },
        { label: 'Actifs', value: 'active' },
        { label: 'Inactifs', value: 'inactive' },
      ],
    },
  ];

  const columns = [
    {
      key: 'email',
      label: 'Email',
      width: '35%',
      render: (value) => <span className="font-bold text-gray-900">{value}</span>,
    },
    {
      key: 'name',
      label: 'Nom',
      width: '20%',
      render: (value) => <span className="text-gray-700">{value || '-'}</span>,
    },
    {
      key: 'subscribed_at',
      label: "Date d'inscription",
      width: '20%',
      render: (value) => (
        <span className="text-gray-600 text-sm">
          {value ? new Date(value).toLocaleDateString('fr-FR') : '-'}
        </span>
      ),
    },
    {
      key: 'is_active',
      label: 'Statut',
      width: '10%',
      render: (value, row) => (
        <button
          onClick={() => {
            router.post(
              `/admin/newsletter/${row.id}/toggle-status`,
              {},
              {
                preserveScroll: true,
                onSuccess: () => router.reload(),
              }
            );
          }}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
            value
              ? 'bg-green-50 text-green-600 hover:bg-green-100'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          {value ? '✓ Actif' : '✗ Inactif'}
        </button>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      align: 'right',
      render: (value) => (
        <button
          onClick={() => {
            if (confirm('Supprimer cet abonnement ?')) {
              router.delete(`/admin/newsletter/${value}`, {
                preserveScroll: true,
                onSuccess: () => router.reload(),
              });
            }
          }}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Supprimer"
        >
          <span className="text-sm font-bold">✕</span>
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Gestion Newsletter" subtitle="Gérez vos abonnés à la newsletter" />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="text-forest-green" size={24} />
              <h3 className="text-sm font-bold text-gray-600">Total Abonnés</h3>
            </div>
            <p className="text-3xl font-black text-forest-green">{stats.total || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <ToggleRight className="text-green-500" size={24} />
              <h3 className="text-sm font-bold text-gray-600">Actifs</h3>
            </div>
            <p className="text-3xl font-black text-green-500">{stats.active || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <ToggleLeft className="text-red-500" size={24} />
              <h3 className="text-sm font-bold text-gray-600">Inactifs</h3>
            </div>
            <p className="text-3xl font-black text-red-500">{stats.inactive || 0}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <SearchFilter
            placeholder="Rechercher par email ou nom..."
            filters={filterOptions}
            currentFilters={filters}
            endpoint="/admin/newsletter"
          />
          <div className="flex gap-2">
            <a
              href="/admin/newsletter/export"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold"
            >
              <Download size={18} />
              Exporter CSV
            </a>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={subscriptions?.data || []}
          pagination={{
            from: subscriptions?.from || 1,
            to: subscriptions?.to || 0,
            total: subscriptions?.total || 0,
            links: subscriptions?.links || [],
          }}
          emptyMessage="Aucun abonné"
        />
      </div>
    </AdminLayout>
  );
}
