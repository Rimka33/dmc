import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, Shield } from 'lucide-react';
import PageHeader from '../../../Components/Admin/PageHeader';
import FormField from '../../../Components/Admin/FormField';
import Section from '../../../Components/Admin/Section';

export default function Create({ permissions }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    permissions: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/roles');
  };

  const handlePermissionChange = (permissionId) => {
    const currentPermissions = [...data.permissions];
    if (currentPermissions.includes(permissionId)) {
      setData(
        'permissions',
        currentPermissions.filter((id) => id !== permissionId)
      );
    } else {
      setData('permissions', [...currentPermissions, permissionId]);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <PageHeader
          title="Créer un Rôle"
          subtitle="Définissez un nouveau niveau d'accès et ses permissions"
          breadcrumbs={['Rôles', 'Créer']}
          action={
            <Link
              href="/admin/roles"
              className="flex items-center gap-2 text-gray-500 hover:text-dark-green transition-colors font-bold text-sm"
            >
              <ArrowLeft size={16} />
              Retour à la liste
            </Link>
          }
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <Section title="Informations Générales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Nom du rôle"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Ex: Éditeur de Blog"
                error={errors.name}
                required
                icon={Shield}
              />
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="w-full min-h-[50px] px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-forest-green focus:ring-0 transition-all font-medium text-sm outline-none resize-none"
                  placeholder="Description courte des responsabilités..."
                  rows="2"
                />
              </div>
            </div>
          </Section>

          <Section title="Permissions">
            <p className="text-sm text-gray-500 mb-6 font-medium">
              Cochez les fonctionnalités auxquelles ce rôle aura accès.
            </p>

            <div className="space-y-8">
              {Object.entries(permissions).map(([group, groupPermissions]) => (
                <div key={group} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-black uppercase tracking-wider text-forest-green mb-4 pb-2 border-b border-gray-100">
                    {group}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupPermissions.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 cursor-pointer hover:border-forest-green/30 transition-all group"
                      >
                        <div className="relative flex items-center mt-0.5">
                          <input
                            type="checkbox"
                            value={perm.id}
                            checked={data.permissions.includes(perm.id)}
                            onChange={() => handlePermissionChange(perm.id)}
                            className="w-4 h-4 text-forest-green border-gray-300 rounded focus:ring-forest-green"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-700 group-hover:text-forest-green transition-colors">
                            {perm.name}
                          </span>
                          <span className="block text-[10px] text-gray-400 mt-0.5 font-medium">
                            {perm.slug}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {errors.permissions && (
              <p className="text-sm text-red-500 font-bold mt-4">{errors.permissions}</p>
            )}
          </Section>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2 px-8 py-4 bg-forest-green text-white rounded-xl hover:bg-dark-green hover:scale-[1.02] active:scale-95 transition-all font-black uppercase tracking-widest shadow-xl shadow-forest-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {processing ? 'Création...' : 'Créer le Rôle'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
