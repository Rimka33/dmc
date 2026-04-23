import React, { useState, useEffect, useCallback } from 'react';
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
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  Map,
} from 'lucide-react';
import PageHeader from '../../../Components/Admin/PageHeader';
import FormField from '../../../Components/Admin/FormField';
import Section from '../../../Components/Admin/Section';
import axios from 'axios';

// Simple debounce implementation
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

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

export default function Create({ roles }) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, setData, post, processing, errors, clearErrors } = useForm({
    user_id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    role_id: '',
    is_active: true,
    address: '',
    city: '',
    region: '',
    neighborhood: '',
  });

  // Real-time password check
  const passwordsMatch = data.password && passwordConfirm && data.password === passwordConfirm;
  const showPasswordError = data.password && passwordConfirm && !passwordsMatch;

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Search logic
  const fetchUsers = useCallback(async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await axios.get(`/admin/users/search?q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(debouncedSearchQuery);
  }, [debouncedSearchQuery, fetchUsers]);

  const [phoneChecking, setPhoneChecking] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);

  const debouncedPhone = useDebounce(data.phone, 500);

  useEffect(() => {
    const checkPhone = async () => {
      if (debouncedPhone.length > 5 && !selectedUser) {
        setPhoneChecking(true);
        try {
          const response = await axios.get(`/admin/users/search?q=${debouncedPhone}`);
          const match = response.data.find((u) => u.phone === debouncedPhone);
          setPhoneExists(!!match);
          if (match && !selectedUser) {
            // Optionnel: On pourrait proposer de le sélectionner automatiquement
          }
        } catch (e) {
          console.error(e);
        } finally {
          setPhoneChecking(false);
        }
      } else {
        setPhoneExists(false);
      }
    };
    checkPhone();
  }, [debouncedPhone, selectedUser]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery('');
    setSearchResults([]);

    setData({
      ...data,
      user_id: user.id,
      name: user.name,
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      region: user.region || '',
      neighborhood: user.neighborhood || '',
    });
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setData({
      ...data,
      user_id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      region: '',
      neighborhood: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/users');
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <PageHeader
          title="Création Hybride Utilisateur"
          subtitle="Recherchez un client existant ou créez un nouveau profil"
          breadcrumbs={['Utilisateurs', 'Création Hybride']}
        >
          <Link
            href="/admin/users"
            className="flex items-center gap-2 text-gray-500 hover:text-dark-green transition-colors font-bold text-sm"
          >
            <ArrowLeft size={16} />
            Retour à la liste
          </Link>
        </PageHeader>

        {/* Search Section */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-forest-green transition-colors" />
          </div>
          <input
            type="text"
            className="w-full h-16 pl-14 pr-6 bg-white border-2 border-transparent shadow-lg rounded-2xl focus:border-forest-green focus:ring-4 focus:ring-forest-green/5 transition-all text-lg font-medium outline-none placeholder:text-gray-300"
            placeholder="Rechercher par nom ou numéro de téléphone (Sénégal)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Rechercher un client"
          />

          {isSearching && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-forest-green animate-spin" />
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-forest-green/5 transition-colors text-left border-b border-gray-50 last:border-0"
                >
                  <div className="w-10 h-10 rounded-full bg-forest-green/10 flex items-center justify-center text-forest-green">
                    <User size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-400 font-medium">
                      {user.phone || 'Pas de téléphone'} • {user.email || "Pas d'email"}
                    </p>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-forest-green bg-forest-green/10 px-2 py-1 rounded">
                    Client Existant
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="bg-forest-green text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in zoom-in duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} />
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-80">
                  Client Sélectionné
                </p>
                <p className="font-bold">{selectedUser.name}</p>
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
              Changer / Nouveau
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Personal Info & Location */}
            <div className="lg:col-span-2 space-y-6">
              <Section title="Informations Personnelles" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Nom complet"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Ex: Amadou Diop"
                    error={errors.name}
                    required
                    icon={User}
                  />
                  <div className="relative">
                    <FormField
                      label="Numéro de Téléphone (Login)"
                      name="phone"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      placeholder="77 XXX XX XX"
                      error={
                        errors.phone ||
                        (phoneExists
                          ? 'Ce numéro est déjà lié à un compte existant. Cherchez le client en haut pour le promouvoir.'
                          : null)
                      }
                      required
                      icon={Phone}
                    />
                    {phoneChecking && (
                      <div className="absolute right-3 top-9">
                        <Loader2 className="w-4 h-4 text-forest-green animate-spin" />
                      </div>
                    )}
                    {phoneExists && !selectedUser && (
                      <p className="text-[10px] text-amber-600 font-bold mt-1 bg-amber-50 p-2 rounded-lg border border-amber-200 animate-pulse">
                        ⚠️ Attention: Ce numéro existe déjà. Utilisez la recherche en haut pour
                        modifier ce client.
                      </p>
                    )}
                  </div>
                  <FormField
                    label="Adresse Email (Optionnel)"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="amadou@example.com"
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
                        setData('city', ''); // Reset city on region change
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
                    placeholder="Ex: Medina, Plateau..."
                    error={errors.neighborhood}
                    icon={MapPin}
                  />

                  <FormField
                    label="Adresse Précise"
                    name="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Ex: Rue 10 x 12, Villa 45"
                    error={errors.address}
                    icon={MapPin}
                  />
                </div>
              </Section>
            </div>

            {/* Right Column: Roles & Security */}
            <div className="space-y-6">
              <Section title="Attribution de Rôle" icon={Shield}>
                <div className="space-y-4">
                  <div className="p-4 bg-forest-green/5 border border-forest-green/10 rounded-2xl">
                    <label
                      htmlFor="role-select"
                      className="text-[10px] text-forest-green font-black uppercase tracking-widest mb-3"
                    >
                      Rôle & Responsabilité
                    </label>
                    <select
                      id="role-select"
                      value={data.role_id}
                      onChange={(e) => setData('role_id', e.target.value)}
                      className="w-full h-12 px-4 bg-white border-2 border-transparent rounded-xl focus:border-forest-green focus:ring-0 transition-all font-bold text-sm outline-none shadow-sm"
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
                    <p className="text-[9px] text-gray-400 mt-2 font-medium leading-tight">
                      Note: L&apos;utilisateur conserve ses attributs "Client" même s&apos;il
                      devient staff.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
                      Compte Actif
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

              <Section title="Sécurité" icon={Lock}>
                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label
                      htmlFor="password-input"
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                    >
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 px-4 pr-12 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-forest-green focus:ring-0 transition-all font-medium text-sm outline-none"
                        required={!selectedUser}
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
                      Confirmer
                    </label>
                    <input
                      id="password-confirm"
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl focus:bg-white focus:ring-0 transition-all font-medium text-sm outline-none ${showPasswordError ? 'border-red-500 bg-red-50' : data.password && passwordsMatch ? 'border-forest-green bg-forest-green/5' : 'border-transparent'}`}
                      required={!selectedUser || data.password}
                    />
                  </div>

                  {/* Password Feedback */}
                  {data.password && passwordConfirm && (
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight ${passwordsMatch ? 'bg-forest-green/10 text-forest-green' : 'bg-red-500/10 text-red-500'}`}
                    >
                      {passwordsMatch ? (
                        <>
                          <CheckCircle2 size={12} />
                          Correspondance parfaite
                        </>
                      ) : (
                        <>
                          <XCircle size={12} />
                          Les mots de passe ne correspondent pas
                        </>
                      )}
                    </div>
                  )}

                  {selectedUser && (
                    <p className="text-[9px] text-amber-600 font-bold bg-amber-50 p-2 rounded-lg border border-amber-100">
                      Laissez vide pour conserver le mot de passe actuel du client.
                    </p>
                  )}
                </div>
              </Section>

              <button
                type="submit"
                disabled={processing || (data.password && !passwordsMatch)}
                className="w-full group flex items-center justify-center gap-3 px-8 py-5 bg-dark-green text-white rounded-2xl hover:bg-forest-green hover:scale-[1.02] active:scale-95 transition-all font-black uppercase tracking-widest shadow-2xl shadow-forest-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} className="group-hover:rotate-12 transition-transform" />
                {processing
                  ? 'Traitement...'
                  : selectedUser
                    ? 'Mettre à jour & Assigner'
                    : "Créer l'utilisateur"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
