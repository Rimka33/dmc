import React, { useState, useContext, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function Auth() {
    const navigate = useNavigate();
    const { login, register, authenticated, loading } = useContext(AuthContext);

    // Rediriger si déjà connecté
    useEffect(() => {
        if (!loading && authenticated) {
            navigate('/');
        }
    }, [authenticated, loading, navigate]);

    // Login state
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const [loginError, setLoginError] = useState('');
    const [loginProcessing, setLoginProcessing] = useState(false);

    // Register state
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        acceptTerms: false
    });
    const [registerError, setRegisterError] = useState('');
    const [registerProcessing, setRegisterProcessing] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginProcessing(true);
        setLoginError('');

        const result = await login(loginData.email, loginData.password);

        if (result.success) {
            navigate('/');
        } else {
            setLoginError(result.message);
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

        const result = await register(registerData);

        if (result.success) {
            navigate('/');
        } else {
            setRegisterError(result.message);
            setRegisterProcessing(false);
        }
    };

    if (loading) return null;

    return (
        <MainLayout>
            {/* Breadcrumb */}
            <section className="bg-light-gray-bg py-4 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link to="/" className="text-forest-green hover:underline">Accueil</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600 font-semibold">Mon Compte</span>
                    </div>
                </div>
            </section>

            {/* Auth Section */}
            <section className="py-12 md:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Login Form */}
                        <div className="space-y-6">
                            <div className="border-b-2 border-neon-green pb-3">
                                <h2 className="text-2xl font-bold text-gray-900 uppercase italic">Se connecter</h2>
                            </div>

                            {loginError && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm mb-4">
                                    {loginError}
                                </div>
                            )}

                            <form onSubmit={handleLoginSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase mb-2">
                                        Adresse e-mail <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 focus:border-forest-green focus:outline-none transition-colors"
                                        placeholder="votre@email.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase mb-2">
                                        Mot de passe <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 focus:border-forest-green focus:outline-none transition-colors"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            className="w-4 h-4 border-gray-300 text-forest-green focus:ring-forest-green"
                                        />
                                        <label htmlFor="remember" className="text-gray-600 text-sm cursor-pointer hover:text-gray-900">
                                            Souviens-toi de moi
                                        </label>
                                    </div>

                                    <Link to="/forgot-password" size="sm" className="text-forest-green text-sm hover:underline font-semibold">
                                        Mot de passe oublié ?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loginProcessing}
                                    className="w-full py-4 bg-forest-green text-white font-bold uppercase tracking-wider hover:bg-dark-green transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loginProcessing ? 'Connexion en cours...' : 'Se connecter'}
                                </button>
                            </form>
                        </div>

                        {/* Register Form */}
                        <div className="space-y-6">
                            <div className="border-b-2 border-neon-green pb-3">
                                <h2 className="text-2xl font-bold text-gray-900 uppercase italic">S'inscrire</h2>
                            </div>

                            {registerError && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm mb-4">
                                    {registerError}
                                </div>
                            )}

                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase mb-2">
                                        Nom complet <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={registerData.name}
                                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 focus:border-forest-green focus:outline-none transition-colors"
                                        placeholder="Prénom Nom"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase mb-2">
                                        Adresse email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 focus:border-forest-green focus:outline-none transition-colors"
                                        placeholder="votre@email.com"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase mb-2">
                                            Mot de passe <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 focus:border-forest-green focus:outline-none transition-colors"
                                            placeholder="••••••••"
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase mb-2">
                                            Confirmation <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={registerData.password_confirmation}
                                            onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 focus:border-forest-green focus:outline-none transition-colors"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded border border-gray-100 mt-4">
                                    <p className="text-gray-500 text-xs leading-relaxed mb-4">
                                        Vos données personnelles seront utilisées pour soutenir votre expérience sur ce site Web, pour gérer l'accès à votre compte et à d'autres fins décrites dans notre{' '}
                                        <Link to="/privacy" className="text-forest-green font-bold underline">
                                            politique de confidentialité
                                        </Link>
                                        .
                                    </p>

                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={registerData.acceptTerms}
                                            onChange={(e) => setRegisterData({ ...registerData, acceptTerms: e.target.checked })}
                                            className="w-4 h-4 mt-1 border-gray-300 text-forest-green focus:ring-forest-green cursor-pointer"
                                            required
                                        />
                                        <label htmlFor="terms" className="text-gray-600 text-sm cursor-pointer">
                                            J'ai lu et j'accepte les{' '}
                                            <Link to="/terms" className="text-forest-green font-bold underline">
                                                conditions générales
                                            </Link>{' '}
                                            du site Web <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={registerProcessing}
                                    className="w-full py-4 bg-forest-green text-white font-bold uppercase tracking-wider hover:bg-dark-green transition-all shadow-md active:scale-[0.98] disabled:opacity-50 mt-4"
                                >
                                    {registerProcessing ? 'Création du compte...' : "S'inscrire"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
