import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    ShoppingBag,
    Layers,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    ExternalLink,
    FileText,
    Star,
    Mail,
    MessageSquare,
    ChevronDown
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedMenu, setExpandedMenu] = useState(null);

    const navigations = [
        { 
            name: 'Dashboard', 
            icon: LayoutDashboard, 
            href: '/admin/dashboard',
            badge: null
        },
        { 
            name: 'Catalogue', 
            icon: ShoppingBag, 
            submenu: [
                { name: 'Produits', href: '/admin/products' },
                { name: 'Catégories', href: '/admin/categories' },
                { name: 'Collections', href: '/admin/collections' },
            ]
        },
        { 
            name: 'Contenu', 
            icon: FileText, 
            submenu: [
                { name: 'Blog', href: '/admin/blog' },
                { name: 'Pages', href: '/admin/pages' },
                { name: 'Bannières', href: '/admin/banners' },
            ]
        },
        { 
            name: 'Commandes', 
            icon: ShoppingCart, 
            href: '/admin/orders',
            badge: null
        },
        { 
            name: 'Clients', 
            icon: Users, 
            href: '/admin/customers' 
        },
        { 
            name: 'Interactions', 
            icon: MessageSquare, 
            submenu: [
                { name: 'Avis & Notes', href: '/admin/reviews' },
                { name: 'Questions', href: '/admin/questions' },
                { name: 'Messages', href: '/admin/messages' },
            ]
        },
        { 
            name: 'Newsletter', 
            icon: Mail, 
            href: '/admin/newsletter' 
        },
        { 
            name: 'Paramètres', 
            icon: Settings, 
            href: '/admin/settings' 
        },
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    const isMenuActive = (item) => {
        const path = window.location.pathname;
        if (item.href) return path === item.href;
        if (item.submenu) {
            return item.submenu.some(sub => path === sub.href);
        }
        return false;
    };

    const toggleSubmenu = (name) => {
        setExpandedMenu(expandedMenu === name ? null : name);
    };

    return (
        <div className="min-h-screen bg-light-gray-bg flex">
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden z-20"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-dark-green text-white transition-all duration-300 flex flex-col fixed h-screen z-30 overflow-y-auto`}
            >
                {/* Logo */}
                <div className="p-6 flex items-center gap-3 border-b border-forest-green/30 flex-shrink-0">
                    <div className="w-10 h-10 bg-neon-green rounded-lg flex items-center justify-center font-bold text-dark-green text-lg shadow-lg shadow-neon-green/30">
                        D
                    </div>
                    {isSidebarOpen && (
                        <div>
                            <span className="font-black text-sm tracking-wider">DMC</span>
                            <span className="block text-[10px] text-gray-400">ADMIN</span>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
                    {navigations.map((item) => {
                        const Icon = item.icon;
                        const isActive = isMenuActive(item);
                        const isExpanded = expandedMenu === item.name;

                        return (
                            <div key={item.name}>
                                {item.submenu ? (
                                    // Submenu item
                                    <button
                                        onClick={() => toggleSubmenu(item.name)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                                            isActive || isExpanded
                                                ? 'bg-forest-green text-white'
                                                : 'text-gray-300 hover:bg-forest-green/20 hover:text-white'
                                        }`}
                                        title={!isSidebarOpen ? item.name : ''}
                                    >
                                        <Icon size={20} className="flex-shrink-0" />
                                        {isSidebarOpen && (
                                            <>
                                                <span className="flex-1 text-left text-sm font-medium">{item.name}</span>
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                />
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    // Direct link item
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative ${
                                            isActive
                                                ? 'bg-forest-green text-white shadow-lg shadow-forest-green/20'
                                                : 'text-gray-300 hover:bg-forest-green/20 hover:text-white'
                                        }`}
                                        title={!isSidebarOpen ? item.name : ''}
                                    >
                                        <Icon size={20} className="flex-shrink-0" />
                                        {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                                        {item.badge && (
                                            <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                {/* Submenu items */}
                                {item.submenu && isSidebarOpen && isExpanded && (
                                    <div className="pl-8 space-y-1 mt-1 border-l border-forest-green/30">
                                        {item.submenu.map((subitem) => (
                                            <Link
                                                key={subitem.name}
                                                href={subitem.href}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    window.location.pathname === subitem.href
                                                        ? 'bg-forest-green/30 text-white font-medium'
                                                        : 'text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                                {subitem.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer actions */}
                <div className="p-4 border-t border-forest-green/30 space-y-2 flex-shrink-0">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-forest-green/20 rounded-lg transition-colors text-sm"
                        title={!isSidebarOpen ? 'Voir le site' : ''}
                    >
                        <ExternalLink size={20} className="flex-shrink-0" />
                        {isSidebarOpen && <span>Voir le site</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                        title={!isSidebarOpen ? 'Déconnexion' : ''}
                    >
                        <LogOut size={20} className="flex-shrink-0" />
                        {isSidebarOpen && <span>Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} pl-20`}>
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 shadow-sm">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors lg:inline-flex hidden"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex-1"></div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">{auth?.user?.name || 'Admin'}</p>
                                <p className="text-xs text-gray-500 capitalize">{auth?.user?.role || 'administrator'}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-forest-green to-dark-green rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                                {auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white py-4 px-6 text-center text-xs text-gray-500">
                    <p>&copy; 2025 DMC Admin. Tous droits réservés.</p>
                </footer>
            </div>
        </div>
    );
}