import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import PageHeader from '../../Components/Admin/PageHeader';
import SearchFilter from '../../Components/Admin/SearchFilter';
import DataTable from '../../Components/Admin/DataTable';
import ActionButtons from '../../Components/Admin/ActionButtons';
import ConfirmDialog from '../../Components/Admin/ConfirmDialog';
import { Star, Eye, Check, X } from 'lucide-react';

export default function Reviews({ reviews = {}, filters = {} }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleApprove = (id) => {
    setConfirmConfig({
      title: 'Approuver cet avis',
      message: 'Êtes-vous sûr de vouloir approuver cet avis ?',
      isDangerous: false,
      onConfirm: () => {
        router.post(
          `/admin/reviews/${id}/approve`,
          {},
          {
            preserveScroll: true,
            onSuccess: () => {
              router.reload();
              setShowConfirm(false);
            },
          }
        );
      },
    });
    setShowConfirm(true);
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      title: 'Supprimer cet avis',
      message: 'Êtes-vous sûr de vouloir supprimer cet avis ?',
      isDangerous: true,
      onConfirm: () => {
        router.delete(`/admin/reviews/${id}`, {
          preserveScroll: true,
          onSuccess: () => {
            router.reload();
            setShowConfirm(false);
          },
        });
      },
    });
    setShowConfirm(true);
  };
  const filterOptions = [
    {
      key: 'rating',
      label: 'Note',
      type: 'select',
      options: [
        { label: 'Toutes', value: '' },
        { label: '⭐⭐⭐⭐⭐ (5)', value: '5' },
        { label: '⭐⭐⭐⭐ (4)', value: '4' },
        { label: '⭐⭐⭐ (3)', value: '3' },
        { label: '⭐⭐ (2)', value: '2' },
        { label: '⭐ (1)', value: '1' },
      ],
    },
    {
      key: 'status',
      label: 'Statut',
      type: 'select',
      options: [
        { label: 'Tous', value: '' },
        { label: 'Approuvé', value: 'approved' },
        { label: 'En attente', value: 'pending' },
      ],
    },
  ];

  const columns = [
    {
      key: 'rating',
      label: 'Note',
      width: '10%',
      render: (value) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'product_name',
      label: 'Produit',
      width: '25%',
      render: (value) => <p className="font-bold text-gray-900 truncate">{value || 'N/A'}</p>,
    },
    {
      key: 'user_name',
      label: 'Auteur',
      width: '20%',
      render: (value) => <span className="text-gray-700">{value || 'Anonyme'}</span>,
    },
    {
      key: 'title',
      label: 'Titre',
      width: '20%',
      render: (value) => <p className="text-gray-900 font-semibold truncate">{value || '-'}</p>,
    },
    {
      key: 'comment',
      label: 'Commentaire',
      width: '15%',
      render: (value) => (
        <p className="text-gray-600 truncate text-sm">
          {value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'}
        </p>
      ),
    },
    {
      key: 'is_approved',
      label: 'Statut',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            value ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
          }`}
        >
          {value ? 'Approuvé' : 'En attente'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      align: 'right',
      render: (value, row) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => router.get(`/admin/reviews/${value}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Voir"
          >
            <Eye size={16} />
          </button>
          {!row.is_approved && (
            <button
              onClick={() => handleApprove(value)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Approuver"
            >
              <Check size={16} />
            </button>
          )}
          <button
            onClick={() => handleDelete(value)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer"
          >
            <X size={16} />
          </button>
        </div>
      ),
    },
  ];

  const formatData = (reviews) => {
    return (
      reviews?.data?.map((review) => ({
        ...review,
        product_name: review.product?.name || 'Avis Boutique',
        user_name: review.user?.name || 'Anonyme',
      })) || []
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Modération des Avis"
          subtitle="Validez, refusez ou modérez les avis clients"
        />

        <SearchFilter
          placeholder="Rechercher par produit, auteur ou commentaire..."
          filters={filterOptions}
          currentFilters={filters}
          endpoint="/admin/reviews"
        />

        <DataTable
          columns={columns}
          data={formatData(reviews)}
          pagination={{
            from: reviews?.from || 1,
            to: reviews?.to || 0,
            total: reviews?.total || 0,
            links: reviews?.links || [],
          }}
          emptyMessage="Aucun avis trouvé"
        />
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setShowConfirm(false)}
        isDangerous={confirmConfig.isDangerous}
        confirmText={confirmConfig.isDangerous ? 'Supprimer' : 'Approuver'}
      />
    </AdminLayout>
  );
}
