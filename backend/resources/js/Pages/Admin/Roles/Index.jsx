import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import { Shield, Users, Lock, Plus, Edit, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';

export default function Index({ roles }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (id) => {
    setDeletingId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    router.delete(`/admin/roles/${deletingId}`, {
      onSuccess: () => setShowConfirm(false),
      onFinish: () => setShowConfirm(false),
    });
  };
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Rôles & Permissions"
          subtitle="Gestion des niveaux d'accès et des permissions"
          breadcrumbs={['Système', 'Rôles']}
          action={
            <Link
              href="/admin/roles/create"
              className="flex items-center gap-2 px-6 py-3 bg-forest-green text-white rounded-xl hover:bg-dark-green transition-all shadow-lg hover:shadow-xl font-bold text-sm uppercase tracking-wider"
            >
              <Plus size={18} />
              Créer un Rôle
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all group relative overflow-hidden"
            >
              {role.slug === 'admin' && (
                <div className="absolute top-0 right-0 p-2 bg-gray-50 rounded-bl-xl border-b border-l border-gray-100">
                  <Lock size={14} className="text-gray-400" />
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${role.slug === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}
                >
                  <Shield size={24} />
                </div>
                <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs font-bold flex items-center gap-1">
                  <Users size={12} />
                  {role.users_count} utilisateurs
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{role.name}</h3>
              <p className="text-sm text-gray-500 mb-6 flex-grow">{role.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {role.permissions &&
                  role.permissions.slice(0, 3).map((perm) => (
                    <span
                      key={perm.id}
                      className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] uppercase font-bold rounded border border-gray-100"
                    >
                      {perm.name}
                    </span>
                  ))}
                {role.permissions && role.permissions.length > 3 && (
                  <span className="px-2 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded border border-gray-100">
                    +{role.permissions.length - 3} autres
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-gray-50 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                  <Lock size={12} />
                  ID: {role.slug}
                </div>

                {role.slug !== 'admin' && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/roles/${role.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </Link>
                    {!['admin', 'manager', 'customer'].includes(role.slug) && (
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Supprimer le rôle"
        message="Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible."
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
        confirmText="Supprimer"
        isDangerous={true}
      />
    </AdminLayout>
  );
}
