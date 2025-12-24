import React from 'react';

const statusStyles = {
  // Order statuses
  'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'paid': 'bg-blue-50 text-blue-700 border-blue-200',
  'preparing': 'bg-orange-50 text-orange-700 border-orange-200',
  'shipped': 'bg-purple-50 text-purple-700 border-purple-200',
  'delivered': 'bg-green-50 text-green-700 border-green-200',
  'cancelled': 'bg-red-50 text-red-700 border-red-200',
  'refunded': 'bg-gray-50 text-gray-700 border-gray-200',
  
  // Product statuses
  'active': 'bg-green-50 text-green-700 border-green-200',
  'inactive': 'bg-red-50 text-red-700 border-red-200',
  'draft': 'bg-gray-50 text-gray-700 border-gray-200',
  'published': 'bg-green-50 text-green-700 border-green-200',
  
  // Payment statuses
  'successful': 'bg-green-50 text-green-700 border-green-200',
  'failed': 'bg-red-50 text-red-700 border-red-200',
  'pending_payment': 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const labelMap = {
  'pending': 'En attente',
  'paid': 'Payée',
  'preparing': 'En préparation',
  'shipped': 'Expédiée',
  'delivered': 'Livrée',
  'cancelled': 'Annulée',
  'refunded': 'Remboursée',
  'active': 'Actif',
  'inactive': 'Inactif',
  'draft': 'Brouillon',
  'published': 'Publié',
  'successful': 'Succès',
  'failed': 'Échoué',
  'pending_payment': 'En attente de paiement',
};

export default function StatusBadge({ status, size = 'sm', className = '' }) {
  const style = statusStyles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  const label = labelMap[status] || status;
  
  const sizeClass = size === 'lg' ? 'px-3 py-2 text-sm' : size === 'md' ? 'px-2 py-1 text-xs' : 'px-2 py-1 text-[10px]';

  return (
    <span className={`inline-flex items-center font-bold uppercase rounded-full border ${style} ${sizeClass} ${className}`}>
      {label}
    </span>
  );
}