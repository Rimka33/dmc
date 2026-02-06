import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import SearchFilter from '../../../Components/Admin/SearchFilter';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import { User, Trash2, Shield, Edit, Plus, CheckCircle, XCircle } from 'lucide-react';

export default function Index({ users, filters = {} }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (id) => {
    setDeletingId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    router.delete(`/admin/users/${deletingId}`, {
      onSuccess: () => setShowConfirm(false),
      onFinish: () => setShowConfirm(false),
    });
  };

  const filterOptions = [
    {
      key: 'role',
      label: 'Rôle',
      type: 'select',
      options: [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Client', value: 'customer' },
      ],
    },
    {
      key: 'status',
      label: 'Statut',
      type: 'select',
      options: [
        { label: 'Actif', value: 'active' },
        { label: 'Inactif', value: 'inactive' },
      ],
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Utilisateurs"
          subtitle="Gérez les comptes utilisateurs et leurs rôles."
          action={
            <Link
              href="/admin/users/create"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-forest-green text-white rounded-xl hover:bg-dark-green transition-all shadow-lg hover:shadow-xl font-bold text-sm uppercase tracking-wider"
            >
              <Plus size={18} />
              Ajouter
            </Link>
          }
        />

        <SearchFilter
          placeholder="Rechercher par nom ou email..."
          filters={filterOptions}
          currentFilters={filters}
          endpoint="/admin/users"
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Téléphone</th>
                  <th className="px-6 py-4">Localisation</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Inscription</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email || "Pas d'email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <Phone size={14} className="text-forest-green" />
                        {user.phone || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 font-medium">
                        {user.neighborhood || user.city || '-'}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-tighter">
                        {user.region || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const getRoleBadgeStyle = (roleName) => {
                          const name = roleName?.toLowerCase() || '';
                          if (name.includes('admin'))
                            return 'bg-purple-100 text-purple-700 border border-purple-200';
                          if (name.includes('gestionnaire'))
                            return 'bg-blue-100 text-blue-700 border border-blue-200';
                          if (name.includes('client'))
                            return 'bg-green-100 text-green-700 border border-green-200';
                          return 'bg-gray-100 text-gray-700 border border-gray-200';
                        };

                        return (
                          <span
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit ${getRoleBadgeStyle(user.role)}`}
                          >
                            {user.role?.toLowerCase().includes('admin') && <Shield size={12} />}
                            {user.role}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                          <CheckCircle size={14} /> Actif
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                          <XCircle size={14} /> Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.created_at}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Affichage de {users.from} à {users.to} sur {users.total} utilisateurs
            </span>
            <div className="flex gap-2">
              {users.links.map((link, key) =>
                link.url ? (
                  <Link
                    key={key}
                    href={link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1 rounded-md text-xs transition-all ${
                      link.active
                        ? 'bg-forest-green text-white font-bold'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  />
                ) : (
                  <span
                    key={key}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className="px-3 py-1 rounded-md text-xs text-gray-300 pointer-events-none"
                  ></span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
        confirmText="Supprimer"
        isDangerous={true}
      />
    </AdminLayout>
  );
}
