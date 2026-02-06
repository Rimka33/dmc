import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import {
  Save,
  ArrowLeft,
  User,
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Map,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import PageHeader from '../../../Components/Admin/PageHeader';
import FormField from '../../../Components/Admin/FormField';
import Section from '../../../Components/Admin/Section';

const SENEGAL_REGIONS = [
  'Dakar',
  'Thiès',
  'Saint-Louis',
  'Ziguinchor',
  'Diourbel',
  'Louga',
  'Tamba',
  'Kaolack',
  'Kolda',
  'Matam',
  'Fatick',
  'Kaffrine',
  'Kédougou',
  'Sédhiou',
];

const COMMON_CITIES = {
  Dakar: ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Diamniadio'],
  Thiès: ['Thiès', 'Mbour', 'Tivaouane', 'Joal-Fadiouth'],
  'Saint-Louis': ['Saint-Louis', 'Richard-Toll', 'Dagana', 'Podor'],
};

export default function Edit({ user, roles }) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const { data, setData, put, processing, errors } = useForm({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    password: '',
    role_id: user.role_id || '',
    is_active: user.is_active ?? true,
    address: user.address || '',
    city: user.city || '',
    region: user.region || '',
    neighborhood: user.neighborhood || '',
  });

  const passwordsMatch = !data.password || data.password === passwordConfirm;
  const showMatchFeedback = data.password && passwordConfirm;

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/users/${user.id}`);
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <PageHeader
          title="Modifier l'Utilisateur"
          subtitle={`Édition du compte Hybrid : ${user.name}`}
          breadcrumbs={['Utilisateurs', user.name, 'Modification']}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Section title="Informations Personnelles" icon={User}>
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
                    label="Téléphone"
                    name="phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder="77 XXX XX XX"
                    error={errors.phone}
                    required
                    icon={Phone}
                  />
                  <FormField
                    label="Adresse Email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="jean.dupont@example.com"
                    error={errors.email}
                    icon={Mail}
                  />
                </div>
              </Section>

              <Section title="Localisation & Adresse" icon={MapPin}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="region-select"
                      className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2"
                    >
                      <Map size={14} className="text-forest-green" />
                      Région
                    </label>
                    <select
                      id="region-select"
                      value={data.region}
                      onChange={(e) => {
                        setData('region', e.target.value);
                        setData('city', '');
                      }}
                      className="w-full h-12 px-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-forest-green focus:ring-0 transition-all font-medium text-sm outline-none"
                    >
                      <option value="">Sélectionner une région</option>
                      {SENEGAL_REGIONS.map((reg) => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="city-input"
                      className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2"
                    >
                      <MapPin size={14} className="text-forest-green" />
                      Ville / Commune
                    </label>
                    {COMMON_CITIES[data.region] ? (
                      <select
                        id="city-input"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        className="w-full h-12 px-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-forest-green focus:ring-0 transition-all font-medium text-sm outline-none"
                      >
                        <option value="">Sélectionner une ville</option>
                        {COMMON_CITIES[data.region].map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="city-input"
                        type="text"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        placeholder="Ex: Saint-Louis"
                        className="w-full h-12 px-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-forest-green focus:ring-0 transition-all font-medium text-sm outline-none"
                      />
                    )}
                  </div>

                  <FormField
                    label="Quartier / Zone"
                    name="neighborhood"
                    value={data.neighborhood}
                    onChange={(e) => setData('neighborhood', e.target.value)}
                    placeholder="Ex: Medina..."
                    error={errors.neighborhood}
                    icon={MapPin}
                  />

                  <FormField
                    label="Adresse Précise"
                    name="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Ex: Rue 10 x 12"
                    error={errors.address}
                    icon={MapPin}
                  />
                </div>
              </Section>
            </div>

            <div className="space-y-6">
              <Section title="Attribution de Rôle" icon={Shield}>
                <div className="space-y-4">
                  <div className="p-4 bg-forest-green/5 border border-forest-green/10 rounded-2xl">
                    <label
                      htmlFor="role-select"
                      className="mb-3 block text-[10px] font-black uppercase tracking-widest text-forest-green"
                    >
                      Rôle Actuel
                    </label>
                    <select
                      id="role-select"
                      value={data.role_id}
                      onChange={(e) => setData('role_id', e.target.value)}
                      className="w-full h-12 px-4 bg-white border-2 border-transparent rounded-xl focus:border-forest-green transition-all font-bold text-sm outline-none shadow-sm"
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
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
                      Actif
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-green"></div>
                    </label>
                  </div>
                </div>
              </Section>

              <Section title="Changer le Mot de passe" icon={Lock}>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="password-input"
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                    >
                      Nouveau (optionnel)
                    </label>
                    <div className="relative">
                      <input
                        id="password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Laisser vide"
                        className="w-full h-12 px-4 pr-12 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-forest-green transition-all font-medium text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password-confirm"
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                    >
                      Confirmation
                    </label>
                    <input
                      id="password-confirm"
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl focus:bg-white transition-all font-medium text-sm outline-none ${data.password && !passwordsMatch ? 'border-red-500 bg-red-50' : data.password && passwordsMatch ? 'border-forest-green bg-forest-green/5' : 'border-transparent'}`}
                    />
                  </div>

                  {showMatchFeedback && (
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight ${passwordsMatch ? 'bg-forest-green/10 text-forest-green' : 'bg-red-500/10 text-red-500'}`}
                    >
                      {passwordsMatch ? (
                        <>
                          <CheckCircle2 size={12} /> Correspondance
                        </>
                      ) : (
                        <>
                          <XCircle size={12} /> Pas de correspondance
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Section>

              <button
                type="submit"
                disabled={processing || (data.password && !passwordsMatch)}
                className="w-full group flex items-center justify-center gap-3 px-8 py-5 bg-dark-green text-white rounded-2xl hover:bg-forest-green hover:scale-[1.02] active:scale-95 transition-all font-black uppercase tracking-widest shadow-2xl disabled:opacity-50"
              >
                <Save size={20} className="group-hover:rotate-12 transition-transform" />
                {processing ? 'Enregistrement...' : 'Mettre à jour'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
