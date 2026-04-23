import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import PageHeader from '../../Components/Admin/PageHeader';
import SearchFilter from '../../Components/Admin/SearchFilter';
import DataTable from '../../Components/Admin/DataTable';
import ActionButtons from '../../Components/Admin/ActionButtons';
import { Star, DollarSign, ShoppingCart, MapPin, Trash2 } from 'lucide-react';
import Section from '../../Components/Admin/Section';
import ConfirmDialog from '../../Components/Admin/ConfirmDialog';

export default function Customers({ customers = {}, filters = {} }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleView = (id) => {
    router.get(`/admin/customers/${id}`);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    router.delete(`/admin/customers/${deletingId}`, {
      onSuccess: () => setShowConfirm(false),
    });
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
      width: '25%',
      render: (value, row) => (
        <div>
          <p className="font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.email || "Pas d'email"}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Téléphone',
      render: (value) => <span className="text-gray-700 font-medium">{value || '-'}</span>,
    },
    {
      key: 'location_preview',
      label: 'Quartier/Ville',
      render: (value, row) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <MapPin size={12} className="text-forest-green flex-shrink-0" />
          <span className="truncate max-w-[120px]">{value}</span>
        </div>
      ),
    },
    {
      key: 'total_orders',
      label: 'Orders',
      align: 'center',
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black">
          {value || 0}
        </span>
      ),
    },
    {
      key: 'total_spent',
      label: 'Total',
      render: (value) => (
        <p className="font-bold text-gray-900 text-xs">
          {new Intl.NumberFormat('fr-FR').format(value || 0)} FCFA
        </p>
      ),
    },
    {
      key: 'is_active',
      label: 'Statut',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
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
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleView(value)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Détails"
          >
            <Star size={16} />
          </button>
          <button
            onClick={() => handleDelete(value)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Gestion des Clients"
          subtitle="Consultez et gérez les profils de vos clients (Hybrid)"
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

      <ConfirmDialog
        isOpen={showConfirm}
        title="Supprimer le client"
        message="Êtes-vous sûr ? Cela supprimera également le compte utilisateur associé s'il existe."
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
        confirmText="Supprimer définitivement"
        isDangerous={true}
      />
    </AdminLayout>
  );
}
