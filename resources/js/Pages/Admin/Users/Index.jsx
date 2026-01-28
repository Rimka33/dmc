import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Search, User, Trash2, Shield, Edit, Plus, CheckCircle, XCircle } from 'lucide-react';

export default function Index({ users, filters }) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearch = (e) => {
    e.preventDefault();
    router.get('/admin/users', { search }, { preserveState: true });
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      router.delete(`/admin/users/${id}`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
            <p className="text-gray-500">Gérez les comptes utilisateurs et leurs rôles.</p>
          </div>
          <Link
            href="/admin/users/create"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-forest-green text-white rounded-xl hover:bg-dark-green transition-all shadow-lg hover:shadow-xl font-bold text-sm uppercase tracking-wider"
          >
            <Plus size={18} />
            Ajouter
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="relative w-full max-w-md text-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom ou email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none transition-all"
              />
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Utilisateur</th>
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
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
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
    </AdminLayout>
  );
}
