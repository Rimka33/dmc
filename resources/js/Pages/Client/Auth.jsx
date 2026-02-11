import React, { useState, useContext, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Eye, EyeOff, CheckCircle2, XCircle, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function Auth({ defaultMode = 'login' }) {
  const navigate = useNavigate();
  const { login, register, authenticated, loading } = useContext(AuthContext);
  const [mode, setMode] = useState(defaultMode);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && authenticated) {
      navigate('/', { replace: true });
    }
  }, [authenticated, loading, navigate]);

  // Login state
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
    remember: false,
  });
  const [loginError, setLoginError] = useState('');
  const [loginProcessing, setLoginProcessing] = useState(false);

  // Register state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    city: '',
    neighborhood: '',
    password: '',
    password_confirmation: '',
    acceptTerms: false,
  });
  const [registerError, setRegisterError] = useState('');
  const [registerProcessing, setRegisterProcessing] = useState(false);

  // Visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginProcessing(true);
    setLoginError('');

    try {
      const result = await login(loginData.identifier, loginData.password, loginData.remember);
      if (!result.success) {
        setLoginError(result.message);
        setLoginProcessing(false);
      }
    } catch (err) {
      setLoginError('Une erreur inattendue est survenue.');
      setLoginProcessing(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.password_confirmation) {
      setRegisterError('Les mots de passe ne correspondent pas.');
      return;
    }

    setRegisterProcessing(true);
    setRegisterError('');

    try {
      const result = await register(registerData);
      if (!result.success) {
        setRegisterError(result.message);
        setRegisterProcessing(false);
      }
    } catch (err) {
      setRegisterError('Une erreur inattendue est survenue.');
      setRegisterProcessing(false);
    }
  };

  if (loading) return null;

  const passwordsMatch =
    registerData.password && registerData.password === registerData.password_confirmation;
  const showPasswordMatchIndicator = registerData.password_confirmation.length > 0;

  return (
    <MainLayout>
      <div className="min-h-[85vh] bg-gray-50 flex items-center justify-center py-8 px-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-forest-green/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl w-full relative z-10 flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[550px]">
          {/* Left Panel */}
          <div className="hidden md:flex md:w-5/12 bg-dark-green p-10 flex-col justify-center text-center text-white relative">
            <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat pointer-events-none" />
            <div className="relative z-10">
              <Link to="/" className="inline-block mb-8">
                <img src="/images/logo.png" alt="DMC" className="h-20 w-auto mx-auto" />
              </Link>
              <h2 className="text-xl font-black mb-4 uppercase italic tracking-tighter">
                {mode === 'login' ? 'Content de vous revoir !' : 'Bienvenue chez DMC'}
              </h2>
            </div>
          </div>

          {/* Right Panel (Forms) */}
          <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col">
            {/* Tabs */}
            <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center mb-8 w-full max-w-sm mx-auto shadow-inner">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-white text-forest-green shadow-md scale-[1.02]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  mode === 'register'
                    ? 'bg-white text-forest-green shadow-md scale-[1.02]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Inscription
              </button>
            </div>

            <div className="flex-1">
              {mode === 'login' ? (
                <motion.div
                  key="login-section"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-black text-gray-900 uppercase italic">
                      Authentification
                    </h3>
                    <div className="w-12 h-1 bg-neon-green mt-1 rounded-full" />
                  </div>

                  {loginError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-left-2 transition-all">
                      <XCircle className="text-red-500 flex-shrink-0" size={18} />
                      <p className="text-red-700 text-xs font-bold leading-tight">{loginError}</p>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                        Identifiant
                      </label>
                      <input
                        type="text"
                        value={loginData.identifier}
                        onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-forest-green focus:bg-white focus:outline-none transition-all text-sm font-bold"
                        placeholder="Téléphone ou Email"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Mot de passe
                        </label>
                        <Link
                          to="/forgot-password"
                          size="sm"
                          className="text-forest-green text-[10px] hover:underline font-black uppercase italic"
                        >
                          Oublié ?
                        </Link>
                      </div>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-forest-green focus:bg-white focus:outline-none transition-all text-sm font-bold pr-12"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-forest-green"
                        >
                          {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="py-2">
                      <label className="flex items-center gap-3 cursor-pointer group w-fit">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={loginData.remember}
                          onChange={(e) =>
                            setLoginData({ ...loginData, remember: e.target.checked })
                          }
                        />
                        <div
                          className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${loginData.remember ? 'bg-forest-green border-forest-green' : 'border-gray-200 bg-white'}`}
                        >
                          {loginData.remember && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        <span className="text-[10px] font-black text-gray-500 group-hover:text-gray-900 uppercase tracking-tight">
                          Rester connecté
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loginProcessing}
                      className="w-full py-4.5 bg-forest-green text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-dark-green transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                    >
                      <span className="flex items-center gap-2">
                        {loginProcessing ? 'Connexion...' : 'Se connecter'}
                        {!loginProcessing && (
                          <LogIn
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        )}
                      </span>
                    </button>
                  </form>

                  <div className="text-center pt-4">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      Pas de compte ?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        className="text-forest-green font-black underline italic hover:text-dark-green"
                      >
                        Inscrivez-vous
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register-section"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-gray-900 uppercase italic">
                      Nouveau Compte
                    </h3>
                    <div className="w-12 h-1 bg-neon-green mt-1 rounded-full" />
                  </div>

                  {registerError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-xl flex items-center gap-2 animate-in fade-in transition-all">
                      <XCircle className="text-red-500 flex-shrink-0" size={16} />
                      <p className="text-red-700 text-[10px] font-bold">{registerError}</p>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:border-forest-green focus:bg-white focus:outline-none transition-all text-xs font-bold"
                        placeholder="Amadou Diallo"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                          Téléphone
                        </label>
                        <div className="relative flex">
                          <div className="flex items-center px-3 border-r border-gray-100 bg-gray-100/50 text-gray-500 font-black text-[10px] rounded-l-2xl">
                            +221
                          </div>
                          <input
                            type="tel"
                            value={registerData.phone}
                            onChange={(e) =>
                              setRegisterData({ ...registerData, phone: e.target.value })
                            }
                            className="w-full px-4 py-3.5 bg-gray-50 border-l-0 border-transparent rounded-r-2xl focus:border-forest-green focus:bg-white focus:outline-none transition-all text-xs font-bold"
                            placeholder="77..."
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                          Email (Opt.)
                        </label>
                        <input
                          type="email"
                          value={registerData.email}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, email: e.target.value })
                          }
                          className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:border-forest-green focus:bg-white focus:outline-none transition-all text-xs font-bold"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                          Région
                        </label>
                        <select
                          value={registerData.region}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, region: e.target.value })
                          }
                          className="w-full px-3 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:border-forest-green focus:outline-none transition-all text-[10px] font-bold"
                          required
                        >
                          <option value="">...</option>
                          {SENEGAL_REGIONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                          Ville
                        </label>
                        <input
                          type="text"
                          value={registerData.city}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, city: e.target.value })
                          }
                          className="w-full px-3 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:border-forest-green focus:outline-none transition-all text-[10px] font-bold"
                          placeholder="Dakar"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                          Quartier
                        </label>
                        <input
                          type="text"
                          value={registerData.neighborhood}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, neighborhood: e.target.value })
                          }
                          className="w-full px-3 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:border-forest-green focus:outline-none transition-all text-[10px] font-bold"
                          placeholder="Médina"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                          Mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showRegisterPassword ? 'text' : 'password'}
                            value={registerData.password}
                            onChange={(e) =>
                              setRegisterData({ ...registerData, password: e.target.value })
                            }
                            className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:border-forest-green focus:bg-white focus:outline-none transition-all text-xs font-bold pr-10"
                            placeholder="••••••••"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                          >
                            {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                          Confirmation
                        </label>
                        <div className="relative">
                          <input
                            type={showRegisterConfirmPassword ? 'text' : 'password'}
                            value={registerData.password_confirmation}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                password_confirmation: e.target.value,
                              })
                            }
                            className={`w-full px-4 py-3.5 bg-gray-50 border rounded-2xl focus:bg-white focus:outline-none transition-all text-xs font-bold pr-10 ${
                              showPasswordMatchIndicator
                                ? passwordsMatch
                                  ? 'border-green-500'
                                  : 'border-red-500'
                                : 'border-transparent focus:border-forest-green'
                            }`}
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowRegisterConfirmPassword(!showRegisterConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                          >
                            {showRegisterConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={registerData.acceptTerms}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, acceptTerms: e.target.checked })
                          }
                          required
                        />
                        <div
                          className={`w-5 h-5 rounded-lg border-2 mt-0.5 flex-shrink-0 transition-all flex items-center justify-center ${registerData.acceptTerms ? 'bg-forest-green border-forest-green' : 'border-gray-200 bg-white'}`}
                        >
                          {registerData.acceptTerms && (
                            <CheckCircle2 size={12} className="text-white" />
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase leading-tight tracking-tight">
                          J'accepte les{' '}
                          <Link to="/termes" className="text-forest-green underline italic">
                            conditions
                          </Link>{' '}
                          DMC.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={registerProcessing}
                      className="w-full py-4 bg-forest-green text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-dark-green transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      <span className="flex items-center gap-2">
                        {registerProcessing ? 'Création...' : 'Créer mon compte'}
                        {!registerProcessing && <UserPlus size={18} />}
                      </span>
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      Déjà membre ?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="text-forest-green font-black underline italic hover:text-dark-green text-xs"
                      >
                        Connectez-vous
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
