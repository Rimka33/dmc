import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, User, Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import PageHeader from '../../../Components/Admin/PageHeader';
import FormField from '../../../Components/Admin/FormField';
import Section from '../../../Components/Admin/Section';

export default function Edit({ user, roles }) {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, put, processing, errors } = useForm({
    name: user.name || '',
    email: user.email || '',
    password: '',
    role_id: user.role_id || '',
    is_active: user.is_active ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/users/${user.id}`);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <PageHeader
          title="Modifier l'Utilisateur"
          subtitle={`Édition du compte : ${user.name}`}
          breadcrumbs={['Utilisateurs', user.name, 'Modifier']}
        >
          <Link
            href="/admin/users"
            className="flex items-center gap-2 text-gray-500 hover:text-dark-green transition-colors font-bold text-sm"
          >
            <ArrowLeft size={16} />
            Retour à la liste
          </Link>
        </PageHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Section title="Informations Personnelles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Nom complet"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Ex: Jean Dupont"
                error={errors.name}
                required
                icon={User}
              />
              <FormField
                label="Adresse Email"
                name="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="jean.dupont@example.com"
                error={errors.email}
                required
                icon={Mail}
              />
            </div>
          </Section>

          <Section title="Sécurité & Accès">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest">
                  <Shield size={14} className="text-forest-green" />
                  Rôle Utilisateur
                </label>
                <select
                  value={data.role_id}
                  onChange={(e) => setData('role_id', e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-forest-green focus:ring-0 transition-all font-medium text-sm outline-none"
                  required
                >
                  <option value="" disabled>
                    Sélectionner un rôle
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {errors.role_id && (
                  <p className="text-xs text-red-500 font-bold mt-1">{errors.role_id}</p>
                )}
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  Détermine les permissions et l'accès aux modules de l'application.
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest">
                  <Lock size={14} className="text-forest-green" />
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Laisser vide pour conserver l'actuel"
                    className="w-full h-12 px-4 pr-12 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-forest-green focus:ring-0 transition-all font-medium text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest-green transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-bold mt-1">{errors.password}</p>
                )}
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  Au moins 8 caractères. Optionnel lors de la modification.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <FormField
                label="Compte Actif"
                name="is_active"
                type="checkbox"
                value={data.is_active}
                onChange={(e) => setData('is_active', e.target.checked)}
                hint="Désactiver pour empêcher l'utilisateur de se connecter."
              />
            </div>
          </Section>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2 px-8 py-4 bg-forest-green text-white rounded-xl hover:bg-dark-green hover:scale-[1.02] active:scale-95 transition-all font-black uppercase tracking-widest shadow-xl shadow-forest-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {processing ? 'Enregistrement...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
