import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import Section from '../../../Components/Admin/Section';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Calendar,
  DollarSign,
  Package,
} from 'lucide-react';

export default function Show({ customer, orders, stats }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title={`Fiche Client: ${customer.name}`}
          subtitle={`Client #${customer.id} - ${customer.email}`}
          breadcrumbs={['Clients', customer.name]}
          action={
            <Link
              href="/admin/customers"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold shadow-sm"
            >
              <ArrowLeft size={18} />
              Retour
            </Link>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <ShoppingCart size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Commandes</p>
              <p className="text-2xl font-black text-gray-900">{stats.total_orders}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Dépensé</p>
              <p className="text-2xl font-black text-gray-900">
                {formatCurrency(stats.total_spent)}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">En attente</p>
              <p className="text-2xl font-black text-gray-900">{stats.pending_orders}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="space-y-6">
            <Section title="Informations Personnelles" icon={User}>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-gray-900 font-bold">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Téléphone
                    </p>
                    <p className="text-gray-900 font-bold">{customer.phone || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Localisation Principale
                    </p>
                    <p className="text-gray-900 font-bold">
                      {customer.neighborhood ? `${customer.neighborhood}, ` : ''}
                      {customer.city}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {customer.region}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Inscrit le
                    </p>
                    <p className="text-gray-900 font-bold">
                      {new Date(customer.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Adresses Enregistrées" icon={MapPin}>
              <div className="space-y-4">
                {customer.addresses && customer.addresses.length > 0 ? (
                  customer.addresses.map((address, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs font-black text-forest-green uppercase tracking-widest mb-2">
                        {address.is_default ? '📍 Résidence Principale' : `📍 Adresse #${idx + 1}`}
                      </p>
                      <p className="text-gray-900 font-bold">{address.address}</p>
                      <p className="text-gray-600 text-sm">
                        {address.city}, {address.postal_code}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm text-center py-4">
                    Aucune adresse enregistrée
                  </p>
                )}
              </div>
            </Section>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <Section title="Historique des Commandes" icon={ShoppingCart}>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        N° Commande
                      </th>
                      <th className="py-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Date
                      </th>
                      <th className="py-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                        Articles
                      </th>
                      <th className="py-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Statut
                      </th>
                      <th className="py-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {orders.data && orders.data.length > 0 ? (
                      orders.data.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-2 font-bold text-gray-900">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="hover:text-forest-green underline"
                            >
                              #{order.order_number || order.id}
                            </Link>
                          </td>
                          <td className="py-4 px-2 text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="py-4 px-2 text-center text-gray-700 font-medium">
                            {order.items?.length || 0}
                          </td>
                          <td className="py-4 px-2">
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                order.status === 'delivered'
                                  ? 'bg-green-50 text-green-600'
                                  : order.status === 'pending'
                                    ? 'bg-yellow-50 text-yellow-600'
                                    : 'bg-blue-50 text-blue-600'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right font-black text-gray-900">
                            {formatCurrency(order.total)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-400 italic">
                          Aucune commande pour ce client
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
