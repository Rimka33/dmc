import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  User,
  Mail,
  AtSign,
  Lock,
  CheckCircle2,
  Phone,
  MapPin,
  Map,
  Globe,
  AlertCircle,
  Building,
  Flag,
} from 'lucide-react';

const SENEGAL_REGIONS = [
  'Dakar',
  'Thiès',
  'Saint-Louis',
  'Diourbel',
  'Louga',
  'Tambacounda',
  'Kaolack',
  'Kolda',
  'Ziguinchor',
  'Matam',
  'Fatick',
  'Kaffrine',
  'Sédhiou',
  'Kédougou',
];

export default function UserDashboard() {
  const { user, authenticated, loading, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Profile states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    region: '',
    neighborhood: '',
    city: '',
    postal_code: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/connexion');
    } else if (authenticated && user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        region: user.region || '',
        neighborhood: user.neighborhood || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
      });
    }
  }, [authenticated, loading, user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.data.success) {
        setUser(response.data.data);
        setStatus({ type: 'success', message: 'Profil mis à jour avec succès !' });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Erreur lors de la mise à jour.',
      });
    } finally {
      setUpdating(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await api.put('/auth/password', passwordData);
      if (response.data.success) {
        setStatus({ type: 'success', message: 'Mot de passe modifié avec succès !' });
        setPasswordData({ current_password: '', password: '', password_confirmation: '' });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Erreur lors du changement de mot de passe.',
      });
    } finally {
      setUpdating(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
    }
  };

  if (loading || !user)
    return (
      <MainLayout>
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative h-56 md:h-64 bg-[#004d1a] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-green/20 to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 opacity-10 blur-sm animate-pulse">
            <User className="w-24 h-24 text-white" />
          </div>
          <div className="absolute top-1/2 left-1/4 opacity-10">
            <MapPin className="w-16 h-16 text-white" />
          </div>
          <div className="absolute top-1/4 right-1/4 opacity-10 blur-[2px] animate-bounce duration-1000">
            <AtSign className="w-20 h-20 text-white" />
          </div>
        </div>

        <div className="relative z-10 text-center container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-black text-neon-green uppercase tracking-tighter mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] italic">
            MON COMPTE
          </h1>
          <nav className="flex items-center justify-center gap-2 text-white/90 font-black text-[10px] uppercase tracking-[0.3em]">
            <Link to="/" className="hover:text-neon-green transition-colors">
              Accueil
            </Link>
            <span className="text-neon-green">//</span>
            <span className="text-white opacity-50">Gestion Profil</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Simplified */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6 sticky top-28">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-50">
                <div className="w-14 h-14 rounded-2xl bg-forest-green flex items-center justify-center text-white font-black text-xl shadow-lg shadow-forest-green/20">
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 truncate max-w-[150px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {user.role}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                <div className="w-full flex items-center gap-3 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all bg-forest-green text-white shadow-xl shadow-forest-green/20">
                  <User className="w-4 h-4" />
                  Profil & Sécurité
                </div>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:w-3/4">
            {status.message && (
              <div
                className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
                  status.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'bg-red-50 text-red-700 border border-red-100'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <p className="text-sm font-bold">{status.message}</p>
              </div>
            )}

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Personal Info & Address Section Merged */}
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-forest-green/10 flex items-center justify-center text-forest-green">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
                    Informations <span className="text-forest-green">Personnelles</span>
                  </h3>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    {/* Row 1 */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Nom complet
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-forest-green transition-colors" />
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Email
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-forest-green transition-colors" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({ ...profileData, email: e.target.value })
                          }
                          className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900"
                          required
                        />
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Téléphone
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-forest-green transition-colors" />
                        <input
                          type="text"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({ ...profileData, phone: e.target.value })
                          }
                          className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Section Sub-block */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-forest-green/5 flex items-center justify-center text-forest-green">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">
                        Coordonnées de livraison
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Adresse complète
                        </label>
                        <input
                          type="text"
                          value={profileData.address}
                          placeholder="Rue, Appt..."
                          onChange={(e) =>
                            setProfileData({ ...profileData, address: e.target.value })
                          }
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Région
                        </label>
                        <div className="relative group">
                          <Flag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-forest-green transition-colors" />
                          <select
                            value={profileData.region}
                            onChange={(e) =>
                              setProfileData({ ...profileData, region: e.target.value })
                            }
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900 appearance-none"
                          >
                            <option value="">Sélectionner une région</option>
                            {SENEGAL_REGIONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Ville
                        </label>
                        <div className="relative group">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-forest-green transition-colors" />
                          <input
                            type="text"
                            value={profileData.city}
                            onChange={(e) =>
                              setProfileData({ ...profileData, city: e.target.value })
                            }
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Quartier
                        </label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-forest-green transition-colors" />
                          <input
                            type="text"
                            value={profileData.neighborhood}
                            onChange={(e) =>
                              setProfileData({ ...profileData, neighborhood: e.target.value })
                            }
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Code Postal
                        </label>
                        <div className="relative group">
                          <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-forest-green transition-colors" />
                          <input
                            type="text"
                            value={profileData.postal_code}
                            onChange={(e) =>
                              setProfileData({ ...profileData, postal_code: e.target.value })
                            }
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="px-10 py-5 bg-forest-green text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-dark-green transition-all shadow-xl shadow-forest-green/20 disabled:opacity-50"
                  >
                    {updating ? 'Mise à jour...' : 'Sauvegarder les modifications'}
                  </button>
                </form>
              </div>

              {/* Password Section */}
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-forest-green/10 flex items-center justify-center text-forest-green">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
                    Sécurité <span className="text-forest-green">du Compte</span>
                  </h3>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, current_password: e.target.value })
                        }
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        value={passwordData.password}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, password: e.target.value })
                        }
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Confirmation
                      </label>
                      <input
                        type="password"
                        value={passwordData.password_confirmation}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            password_confirmation: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-bold text-gray-900"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-10 py-5 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200/50 disabled:opacity-50"
                  >
                    {updating ? 'Mise à jour...' : 'Changer le Mot de Passe'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
