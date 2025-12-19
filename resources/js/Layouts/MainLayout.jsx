import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { WishlistContext } from '../contexts/WishlistContext';
import api from '../services/api';

export default function MainLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart } = useContext(CartContext);
    const { user, authenticated, logout } = useContext(AuthContext);
    const { wishlist } = useContext(WishlistContext);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${searchQuery}`);
            setSearchQuery('');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full shadow-2xl">
                {/* Top Bar */}
                <div className="py-2.5 bg-[#011a0a] border-b border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between">
                            {/* Left Side */}
                            <div className="flex items-center gap-6">
                                <div className="hidden lg:flex items-center gap-2">
                                    <span className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">Support:</span>
                                    <a href="tel:+221772367777" className="text-neon-green font-black text-xs hover:text-white transition-colors">
                                        +221 77 236 77 77
                                    </a>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-2 text-white/70 hover:text-neon-green transition-all group">
                                        <i className="icon-map-pin text-sm text-neon-green"></i>
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Showroom Dakar</span>
                                    </button>
                                </div>
                            </div>

                            {/* Middle Logo (Centered on mobile/tablet, right-aligned on large screens in the original but let's make it cleaner) */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0">
                                <Link to="/" className="block">
                                    <img src="/images/logo.png" alt="DMC Logo" className="h-8 md:h-12 w-auto object-contain brightness-110" />
                                </Link>
                            </div>

                            {/* Right Side Icons */}
                            <div className="flex items-center gap-3 sm:gap-6">
                                <Link to="/wishlist" className="text-white/80 hover:text-neon-green transition-all relative group hidden sm:block">
                                    <i className="icon-heart text-xl"></i>
                                    {wishlist.length > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-neon-green text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-[#011a0a]">
                                            {wishlist.length}
                                        </span>
                                    )}
                                </Link>

                                <div className="flex items-center gap-4">
                                    <Link to="/panier" className="flex items-center gap-3 group">
                                        <div className="relative">
                                            <i className="icon-shopping-cart text-xl text-white group-hover:text-neon-green transition-all"></i>
                                            {cart.items.length > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-[#011a0a]">
                                                    {cart.items.length}
                                                </span>
                                            )}
                                        </div>
                                        <div className="hidden md:flex flex-col items-start leading-none">
                                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Votre Panier</span>
                                            <span className="text-sm font-black text-neon-green">{cart.total_formatted}</span>
                                        </div>
                                    </Link>

                                    <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

                                    {authenticated ? (
                                        <div className="relative">
                                            <button
                                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                                className="flex items-center gap-2 group"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-forest-green flex items-center justify-center border border-white/20 group-hover:border-neon-green transition-all overflow-hidden">
                                                    {user?.avatar ? <img src={user.avatar} alt="" /> : <i className="icon-user text-white text-sm"></i>}
                                                </div>
                                                <i className={`icon-chevron-down text-[10px] text-white/50 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}></i>
                                            </button>

                                            {userMenuOpen && (
                                                <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-3 z-[60] border border-gray-100 overflow-hidden">
                                                    <div className="px-5 py-3 border-b border-gray-50 mb-2">
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Connecté en tant que</p>
                                                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                                                    </div>
                                                    <Link to="/mon-compte" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-forest-green font-bold transition-all">
                                                        <i className="icon-user text-gray-400"></i> Profil & Commandes
                                                    </Link>
                                                    {user?.role === 'admin' && (
                                                        <a href="/admin/dashboard" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-forest-green font-bold transition-all">
                                                            <i className="icon-settings text-gray-400"></i> Administration
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition-all"
                                                    >
                                                        <i className="icon-log-out"></i> Déconnexion
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link to="/mon-compte" className="flex items-center gap-2 group">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-neon-green group-hover:border-neon-green transition-all">
                                                <i className="icon-user text-white group-hover:text-black text-sm"></i>
                                            </div>
                                            <span className="hidden sm:block text-xs font-black text-white uppercase tracking-wider group-hover:text-neon-green">Se connecter</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Navigation Bar */}
                <div className="bg-forest-green h-16">
                    <div className="container mx-auto px-4 h-full flex items-center justify-between gap-8">
                        {/* Categories Dropdown */}
                        <div className="relative h-full flex items-center">
                            <button
                                onClick={() => setCategoriesOpen(!categoriesOpen)}
                                className={`flex items-center gap-3 px-6 h-11 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${categoriesOpen ? 'bg-neon-green text-black' : 'bg-black/20 text-white hover:bg-black/30'}`}
                            >
                                <i className="icon-menu text-lg"></i>
                                <span className="hidden md:inline">Parcourir les produits</span>
                                <i className={`icon-chevron-down text-[10px] ml-1 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {categoriesOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setCategoriesOpen(false)}></div>
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-2xl rounded-3xl overflow-hidden z-50 border border-gray-100 py-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                        {categories.length > 0 ? (
                                            categories.map(cat => (
                                                <Link
                                                    key={cat.id}
                                                    to={`/categorie/${cat.slug}`}
                                                    onClick={() => setCategoriesOpen(false)}
                                                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-forest-green hover:text-white text-gray-700 transition-all font-bold text-sm group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-white/20">
                                                        <img src={cat.icon || '/images/icons/default.svg'} alt="" className="w-5 h-5 object-contain" />
                                                    </div>
                                                    <span>{cat.name}</span>
                                                    <i className="icon-chevron-right ml-auto text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="px-6 py-4 text-gray-400 text-sm italic">Chargement...</div>
                                        )}
                                        <div className="mt-4 px-6 pt-4 border-t border-gray-100">
                                            <Link to="/shop" className="block w-full py-3 bg-gray-900 text-white text-center rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                                                Voir tout le catalogue
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Main Navigation Menu */}
                        <nav className="hidden lg:flex flex-1 items-center justify-center gap-2">
                            {[
                                { name: 'Accueil', path: '/' },
                                { name: 'La Boutique', path: '/shop' },
                                { name: 'Promotions', path: '/shop?on_sale=1' },
                                { name: 'Nos Services', path: '/services' },
                                { name: 'Contact', path: '/contact' }
                            ].map(item => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${location.pathname === item.path ? 'bg-white text-forest-green shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Chercher un PC, une pièce..."
                                className="w-full bg-white/10 border-2 border-white/10 text-white placeholder-white/40 text-xs font-bold py-2.5 pl-5 pr-12 rounded-2xl focus:outline-none focus:bg-white focus:text-gray-900 focus:border-neon-green transition-all"
                            />
                            <button type="submit" className="absolute right-1 top-1 h-9 w-10 flex items-center justify-center bg-neon-green text-black rounded-xl hover:scale-105 transition-transform">
                                <i className="icon-search text-lg"></i>
                            </button>
                        </form>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white"
                        >
                            <i className={mobileMenuOpen ? 'icon-x text-2xl' : 'icon-menu text-2xl'}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Sidebar Navigation */}
                {mobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                            <div className="p-6 bg-forest-green flex items-center justify-between">
                                <img src="/images/logo.png" alt="DMC" className="h-8" />
                                <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                    <i className="icon-x text-xl"></i>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-8">
                                <nav className="px-6 space-y-6">
                                    <div className="mb-8">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Navigation</p>
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { name: 'Accueil', path: '/', icon: 'home' },
                                                { name: 'Boutique', path: '/shop', icon: 'shopping-bag' },
                                                { name: 'Panier', path: '/panier', icon: 'shopping-cart' },
                                                { name: 'Contact', path: '/contact', icon: 'mail' }
                                            ].map(item => (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-700"
                                                >
                                                    <i className={`icon-${item.icon} text-forest-green text-lg`}></i>
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Catégories</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {categories.map(cat => (
                                                <Link
                                                    key={cat.id}
                                                    to={`/categorie/${cat.slug}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-2xl bg-white hover:border-neon-green transition-all"
                                                >
                                                    <img src={cat.icon || '/images/icons/default.svg'} alt="" className="w-8 h-8 mb-2" />
                                                    <span className="text-[9px] font-bold text-center text-gray-600 line-clamp-1 truncate">{cat.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </nav>
                            </div>

                            <div className="p-8 border-t border-gray-100">
                                {authenticated ? (
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest"
                                    >
                                        Déconnexion
                                    </button>
                                ) : (
                                    <Link
                                        to="/mon-compte"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full py-4 bg-gray-900 text-white text-center rounded-2xl font-black text-xs uppercase tracking-widest"
                                    >
                                        Se Connecter
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 pt-24 pb-12 overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 opacity-5 -mr-24 -mt-24 pointer-events-none">
                    <img src="/images/logo.png" alt="" className="w-96" />
                </div>

                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
                        {/* Company Info */}
                        <div className="lg:col-span-4">
                            <img src="/images/logo.png" alt="DMC" className="h-14 mb-8 brightness-110" />
                            <p className="text-gray-400 font-medium leading-relaxed mb-8 max-w-sm">
                                Daroul Mouhty Computer (DMC) est votre partenaire informatique de confiance au Sénégal. Nous fournissons du matériel premium et un service après-vente irréprochable depuis plus de 10 ans.
                            </p>
                            <div className="flex gap-4">
                                {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'].map(s => (
                                    <a key={s} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:bg-neon-green hover:text-black transition-all">
                                        <i className={`icon-${s} text-lg`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="lg:col-span-2">
                            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 border-l-2 border-neon-green pl-4">Menu</h3>
                            <ul className="space-y-4">
                                <li><Link to="/shop" className="text-gray-500 hover:text-neon-green transition-colors font-bold text-sm">Boutique</Link></li>
                                <li><Link to="/contact" className="text-gray-500 hover:text-neon-green transition-colors font-bold text-sm">Contacts</Link></li>
                                <li><Link to="/a-propos" className="text-gray-500 hover:text-neon-green transition-colors font-bold text-sm">Qui sommes-nous</Link></li>
                                <li><Link to="/mon-compte" className="text-gray-500 hover:text-neon-green transition-colors font-bold text-sm">Mon Compte</Link></li>
                            </ul>
                        </div>

                        {/* Marketplace */}
                        <div className="lg:col-span-3">
                            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 border-l-2 border-neon-green pl-4">Légal</h3>
                            <ul className="space-y-4">
                                <li><Link to="/politique-de-confidentialite" className="text-gray-500 hover:text-neon-green transition-colors font-bold text-sm">Confidentialité</Link></li>
                                <li><Link to="/termes-et-conditions" className="text-gray-500 hover:text-neon-green transition-colors font-bold text-sm">Conditions d'utilisation</Link></li>
                                <li><Link to="/politique-de-retour" className="text-gray-500 hover:text-neon-green transition-colors font-bold text-sm">Retours & Garanties</Link></li>
                            </ul>
                        </div>

                        {/* Contact & Newsletter */}
                        <div className="lg:col-span-3">
                            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 border-l-2 border-neon-green pl-4">Newsletter</h3>
                            <p className="text-gray-500 text-xs font-medium mb-6">Restez informé de nos arrivages et promotions.</p>
                            <form className="relative group">
                                <input
                                    type="email"
                                    placeholder="votre@email.com"
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 pl-6 pr-12 text-white text-xs font-bold focus:outline-none focus:border-neon-green transition-all"
                                />
                                <button className="absolute right-2 top-2 bottom-2 px-4 bg-neon-green text-black rounded-xl font-black text-[10px] uppercase hover:scale-105 transition-transform">OK</button>
                            </form>
                            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-forest-green/20 flex items-center justify-center">
                                        <i className="icon-phone text-neon-green"></i>
                                    </div>
                                    <p className="text-xs font-black text-white">+221 77 236 77 77</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                            © 2025 DAROUL MOUHTY COMPUTER. TOUS DROITS RÉSERVÉS.
                        </p>
                        <div className="flex items-center gap-2 grayscale brightness-50 contrast-150">
                            <img src="/images/payment/visa.png" alt="Visa" className="h-4" />
                            <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-4" />
                            <img src="/images/payment/wave.png" alt="Wave" className="h-4" />
                        </div>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                            CONÇU PAR <span className="text-neon-green">ITEA</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
