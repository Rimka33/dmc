import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import PageHeader from '../../Components/Admin/PageHeader';
import SearchFilter from '../../Components/Admin/SearchFilter';
import DataTable from '../../Components/Admin/DataTable';
import ActionButtons from '../../Components/Admin/ActionButtons';
import { Star, DollarSign, ShoppingCart } from 'lucide-react';
import Section from '../../Components/Admin/Section';

export default function Customers({ customers = {}, filters = {} }) {
  const handleView = (id) => {
    router.get(`/admin/customers/${id}`);
  };
  const filterOptions = [
    {
      key: 'status',
      label: 'Type',
      type: 'select',
      options: [
        { label: 'VIP', value: 'vip' },
        { label: 'Normal', value: 'normal' },
        { label: 'À risque', value: 'risk' },
      ],
    },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Client',
      width: '30%',
      render: (value, row) => (
        <div>
          <p className="font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Téléphone',
      render: (value) => <span className="text-gray-700">{value || '-'}</span>,
    },
    {
      key: 'total_orders',
      label: 'Commandes',
      align: 'center',
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
          <ShoppingCart size={14} className="mr-1" />
          {value || 0}
        </span>
      ),
    },
    {
      key: 'total_spent',
      label: 'Dépensé',
      render: (value) => (
        <p className="font-bold text-gray-900">
          {new Intl.NumberFormat('fr-FR').format(value || 0)} FCFA
        </p>
      ),
    },
    {
      key: 'is_active',
      label: 'Statut',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            value ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
          }`}
        >
          {value ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      align: 'right',
      render: (value) => (
        <ActionButtons
          actions={[{ key: 'view', icon: 'view', label: 'Fiche', color: 'info' }]}
          onAction={(action) => {
            if (action === 'view') {
              handleView(value);
            }
          }}
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Gestion des Clients"
          subtitle="Consultez et gérez les profils de vos clients"
        />

        <SearchFilter
          placeholder="Rechercher par nom, email ou téléphone..."
          filters={filterOptions}
          currentFilters={filters}
          endpoint="/admin/customers"
        />

        <DataTable
          columns={columns}
          data={customers?.data || []}
          pagination={{
            from: customers?.from || 1,
            to: customers?.to || 0,
            total: customers?.total || 0,
            links: customers?.links || [],
          }}
          emptyMessage="Aucun client trouvé"
        />
      </div>
    </AdminLayout>
  );
}
