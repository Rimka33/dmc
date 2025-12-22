import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { WishlistContext } from '../contexts/WishlistContext';
import api from '../services/api';
import { MapPin, ChevronDown, Heart, ShoppingCart, User, Menu, Search, X, Facebook, Instagram, Twitter, Youtube, Phone, Mail, Package } from 'lucide-react';

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
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [ordersCount, setOrdersCount] = useState(0);

    useEffect(() => {
        fetchCategories();
        if (authenticated) {
            fetchOrdersCount();
        }
    }, [authenticated]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchOrdersCount = async () => {
        try {
            const response = await api.get('/orders');
            if (response.data.success) {
                setOrdersCount(response.data.data ? response.data.data.length : 0);
            }
        } catch (error) {
            console.error('Error fetching orders count:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${searchQuery}`);
            setSearchQuery('');
            setShowSuggestions(false);
        }
    };

    const handleSearchChange = async (value) => {
        setSearchQuery(value);

        if (value.trim().length >= 2) {
            setSearchLoading(true);
            setShowSuggestions(true);
            try {
                const response = await api.get('/products', {
                    params: { search: value, per_page: 5 }
                });
                setSearchSuggestions(response.data.data || []);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSearchSuggestions([]);
            } finally {
                setSearchLoading(false);
            }
        } else {
            setShowSuggestions(false);
            setSearchSuggestions([]);
        }
    };

    const selectSuggestion = (product) => {
        navigate(`/produit/${product.id}`);
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const handleLogout = async () => {
        await logout();
        setOrdersCount(0);
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full shadow-2xl">
                {/* Top Bar */}
                <div className="py-2.5 bg-dark-green border-b border-white/5">
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
                                        <MapPin className="w-4 h-4 text-neon-green" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Showroom Dakar</span>
                                    </button>
                                </div>
                            </div>

                            {/* Middle Logo */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0">
                                <Link to="/" className="block">
                                    <img src="/images/logo.png" alt="DMC Logo" className="h-8 md:h-12 w-auto object-contain brightness-110" />
                                </Link>
                            </div>

                            {/* Right Side Icons */}
                            <div className="flex items-center gap-3 sm:gap-6">
                                <Link to="/wishlist" className="text-white/80 hover:text-neon-green transition-all relative group hidden sm:block">
                                    <Heart className="w-5 h-5" />
                                    {wishlist.length > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-neon-green text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-dark-green">
                                            {wishlist.length}
                                        </span>
                                    )}
                                </Link>

                                <div className="flex items-center gap-4">
                                    {/* Orders Icon - Only show if user has orders */}
                                    {authenticated && ordersCount > 0 && (
                                        <Link to="/mon-compte" className="text-white/80 hover:text-neon-green transition-all relative group hidden sm:block">
                                            <Package className="w-5 h-5" />
                                            <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-dark-green">
                                                {ordersCount}
                                            </span>
                                        </Link>
                                    )}

                                    <Link to="/panier" className="flex items-center gap-3 group">
                                        <div className="relative">
                                            <ShoppingCart className="w-5 h-5 text-white group-hover:text-neon-green transition-all" />
                                            {cart.items.length > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-dark-green">
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
                                                    {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-white" />}
                                                </div>
                                                <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {userMenuOpen && (
                                                <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-3 z-[60] border border-gray-100 overflow-hidden">
                                                    <div className="px-5 py-3 border-b border-gray-50 mb-2">
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Connecté en tant que</p>
                                                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                                                    </div>
                                                    <Link to="/mon-compte" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-forest-green font-bold transition-all">
                                                        <User className="w-4 h-4 text-gray-400" /> Mon Profil
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition-all"
                                                    >
                                                        <X className="w-4 h-4" /> Déconnexion
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link to="/mon-compte" className="flex items-center gap-2 group">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-neon-green group-hover:border-neon-green transition-all">
                                                <User className="w-4 h-4 text-white group-hover:text-black" />
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
                <div className="bg-forest-green h-14">
                    <div className="container mx-auto px-4 h-full flex items-center justify-between gap-8">
                        {/* Categories Dropdown */}
                        <div
                            className="relative h-full flex items-center"
                            onMouseEnter={() => setCategoriesOpen(true)}
                            onMouseLeave={() => setCategoriesOpen(false)}
                        >
                            <button
                                className={`flex items-center gap-2 px-3 h-8 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${categoriesOpen ? 'bg-white text-forest-green' : 'bg-black/10 text-white hover:bg-black/20'}`}
                            >
                                <Menu className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">Catégories Produits</span>
                                <ChevronDown className={`w-2.5 h-2.5 ml-1 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {categoriesOpen && (
                                <div className="absolute top-full left-0 mt-0 w-72 bg-white shadow-2xl rounded-b-2xl overflow-hidden z-50 border border-t-0 border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
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
                                                <ChevronDown className="ml-auto w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -rotate-90" />
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
                            )}
                        </div>

                        {/* Main Navigation Menu */}
                        <nav className="hidden lg:flex flex-1 items-center justify-center gap-2">
                            {[
                                { name: 'Accueil', path: '/' },
                                { name: 'Boutique', path: '/shop' },
                                { name: 'Promotions', path: '/shop?on_sale=1' },
                                { name: 'Nos Services', path: '/services' },
                                { name: 'Contact', path: '/contact' }
                            ].map(item => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${location.pathname === item.path ? 'bg-white text-forest-green shadow-sm' : 'text-white hover:text-neon-green'}`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-sm relative">
                            <form onSubmit={handleSearch} className="w-full relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    placeholder="TROUVER VITE UN PRODUIT..."
                                    className="w-full bg-white text-gray-800 placeholder-gray-400 text-[10px] font-bold py-1.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-neon-green transition-all"
                                />
                                <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-neon-green hover:scale-110 transition-transform">
                                    <Search className="w-4 h-4" />
                                </button>
                            </form>

                            {/* Search Suggestions Dropdown */}
                            {showSuggestions && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[70] max-h-96 overflow-y-auto">
                                    {searchLoading ? (
                                        <div className="p-4 text-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-forest-green mx-auto"></div>
                                        </div>
                                    ) : searchSuggestions.length > 0 ? (
                                        <div>
                                            {searchSuggestions.map((product) => (
                                                <button
                                                    key={product.id}
                                                    onClick={() => selectSuggestion(product)}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                                                >
                                                    <img
                                                        src={product.primary_image}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-contain bg-gray-50 rounded"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                                                        <p className="text-xs font-black text-forest-green mt-0.5">{product.price_formatted}</p>
                                                    </div>
                                                    <Search className="w-4 h-4 text-gray-300" />
                                                </button>
                                            ))}
                                            <div className="p-2 bg-gray-50 text-center">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); handleSearch(e); }}
                                                    className="text-[10px] font-black text-forest-green uppercase tracking-wider hover:underline"
                                                >
                                                    Voir tous les résultats →
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-sm text-gray-500">
                                            Aucun produit trouvé
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Sidebar Navigation */}
                {
                    mobileMenuOpen && (
                        <div className="lg:hidden fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                                <div className="p-6 bg-forest-green flex items-center justify-between">
                                    <img src="/images/logo.png" alt="DMC" className="h-8" />
                                    <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                        <X className="w-5 h-5" />
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
                                                        {item.icon === 'home' && <Menu className="w-5 h-5 text-forest-green" />}
                                                        {item.icon === 'shopping-bag' && <ShoppingCart className="w-5 h-5 text-forest-green" />}
                                                        {item.icon === 'shopping-cart' && <ShoppingCart className="w-5 h-5 text-forest-green" />}
                                                        {item.icon === 'mail' && <Search className="w-5 h-5 text-forest-green" />}
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
                    )
                }
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="relative pt-24 pb-12 overflow-hidden bg-forest-green text-white">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0 opacity-30">
                    <img
                        src="/images/footer-bg.png"
                        alt="Footer Background"
                        className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-forest-green/60 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-green via-forest-green/40 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20 text-[11px] font-bold">
                        {/* Column 1: BOUTIQUE */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-tighter italic border-b border-white/10 pb-2 mb-4">BOUTIQUE</h3>
                            <ul className="space-y-3 opacity-70">
                                <li><Link to="/shop?cat=accessoires" className="hover:text-neon-green transition-colors">Accessoires Informatique</Link></li>
                                <li><Link to="/shop?cat=portables" className="hover:text-neon-green transition-colors">Ordinateurs Portables</Link></li>
                                <li><Link to="/shop?cat=bureau" className="hover:text-neon-green transition-colors">Ordinateurs Bureau</Link></li>
                                <li><Link to="/shop?cat=chargeurs" className="hover:text-neon-green transition-colors">Chargeurs Ordinateurs</Link></li>
                                <li><Link to="/shop?cat=batteries" className="hover:text-neon-green transition-colors">Batteries Ordinateurs</Link></li>
                                <li><Link to="/shop?cat=imprimantes" className="hover:text-neon-green transition-colors">Imprimantes & Accessoires</Link></li>
                                <li><Link to="/shop?cat=multimedia" className="hover:text-neon-green transition-colors">Multimédia & Electronique</Link></li>
                            </ul>
                        </div>

                        {/* Column 2: A PROPOS */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-tighter italic border-b border-white/10 pb-2 mb-4">A PROPOS</h3>
                            <ul className="space-y-3 opacity-70 mb-6">
                                <li><Link to="/a-propos" className="hover:text-neon-green transition-colors">Qui sommes-Nous</Link></li>
                                <li><Link to="/temoignages" className="hover:text-neon-green transition-colors">Témoignages</Link></li>
                                <li><Link to="/contact" className="hover:text-neon-green transition-colors">Nos Contacts</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: MON COMPTE */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-tighter italic border-b border-white/10 pb-2 mb-4">MON COMPTE</h3>
                            <ul className="space-y-3 opacity-70">
                                <li><Link to="/mon-compte" className="hover:text-neon-green transition-colors">Se connecter</Link></li>
                                <li><Link to="/mon-compte" className="hover:text-neon-green transition-colors">S'inscrire</Link></li>
                                <li><Link to="/wishlist" className="hover:text-neon-green transition-colors">Liste de souhaits</Link></li>
                                <li><Link to="/mon-compte" className="hover:text-neon-green transition-colors">Suivez vos commandes</Link></li>
                                <li><Link to="/verifier" className="hover:text-neon-green transition-colors">Vérifier</Link></li>
                            </ul>
                        </div>

                        {/* Column 4: SERVICE CLIENTÈLE */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-tighter italic border-b border-white/10 pb-2 mb-4">SERVICE CLIENTÈLE</h3>
                            <ul className="space-y-3 opacity-70 mb-8">
                                <li><Link to="/retours" className="hover:text-neon-green transition-colors">Retours & Remboursement</Link></li>
                                <li><Link to="/politique-de-confidentialite" className="hover:text-neon-green transition-colors">Politique de Confidentialité</Link></li>
                                <li><Link to="/termes-et-conditions" className="hover:text-neon-green transition-colors">Termes & Conditions</Link></li>
                            </ul>
                            <div className="flex gap-2">
                                <a href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-neon-green hover:text-black transition-all">
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-neon-green hover:text-black transition-all">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-neon-green hover:text-black transition-all">
                                    <Twitter className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-neon-green hover:text-black transition-all">
                                    <Youtube className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Column 5: NEWSLETTER */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-tighter italic border-b border-white/10 pb-2 mb-4">NEWSLETTER</h3>
                            <div className="opacity-60 leading-relaxed mb-6">
                                Bénéficiez de 15% de réduction sur votre premier achat ! Soyez également informé(e) en avant-première des promotions, des lancements de nouveaux produits et des offres exclusives !
                            </div>
                            <form className="relative mb-8">
                                <input
                                    type="email"
                                    placeholder="VOTRE EMAIL"
                                    className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg text-[10px] font-black focus:outline-none"
                                />
                                <button className="absolute right-1 top-1 bottom-1 px-4 bg-gray-900 text-white rounded-md text-[9px] font-black uppercase hover:bg-black transition-colors">
                                    S'inscrire
                                </button>
                            </form>
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-neon-green" />
                                    <span className="text-neon-green font-black">Nous Joindre :</span>
                                    <span className="font-black">+221 77 236 77 77</span>
                                </div>
                                <div className="flex items-start gap-3 opacity-80">
                                    <MapPin className="w-4 h-4 text-neon-green mt-0.5 flex-shrink-0" />
                                    <span><span className="text-neon-green">DMC BOUTIQUE :</span> 345 Rue FA 22, Dakar - Sénégal</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-80">
                                    <Mail className="w-4 h-4 text-neon-green" />
                                    <span>Email: <a href="mailto:contact@dmcomputer.sn" className="hover:text-neon-green transition-colors">contact@dmcomputer.sn</a></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black tracking-widest text-white/40">
                        <p>© 2025 DAROUL MOUHTY COMPUTER. TOUS DROITS RÉSERVÉS.</p>
                        <div className="flex items-center gap-4 grayscale brightness-50 opacity-50">
                            <img src="/images/payment/visa.png" alt="Visa" className="h-4" />
                            <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-4" />
                            <img src="/images/payment/wave.png" alt="Wave" className="h-4" />
                        </div>
                        <p>CONÇU PAR <span className="text-neon-green opacity-100">ITEA</span></p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
