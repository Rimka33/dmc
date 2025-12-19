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
    ExternalLink
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigations = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { name: 'Produits', icon: ShoppingBag, href: '/admin/products' },
        { name: 'Catégories', icon: Layers, href: '/admin/categories' },
        { name: 'Commandes', icon: ShoppingCart, href: '/admin/orders' },
        { name: 'Clients', icon: Users, href: '/admin/users' },
        { name: 'Paramètres', icon: Settings, href: '/admin/settings' },
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-full z-30`}
            >
                {/* Logo */}
                <div className="p-6 flex items-center gap-3 border-b border-gray-800">
                    <div className="w-8 h-8 bg-neon-green rounded flex items-center justify-center font-bold text-gray-900">
                        D
                    </div>
                    {isSidebarOpen && <span className="font-bold text-xl tracking-wider">DMC ADMIN</span>}
                </div>

                {/* Navigations */}
                <nav className="flex-1 mt-6 px-3 space-y-2">
                    {navigations.map((item) => {
                        const Icon = item.icon;
                        const isActive = window.location.pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-forest-green text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                                title={!isSidebarOpen ? item.name : ''}
                            >
                                <Icon size={20} />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Return to Site & Logout */}
                <div className="p-4 border-t border-gray-800 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-3 text-gray-400 hover:text-white transition-colors"
                        title={!isSidebarOpen ? 'Voir le site' : ''}
                    >
                        <ExternalLink size={20} />
                        {isSidebarOpen && <span>Voir le site</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 text-gray-400 hover:text-red-400 transition-colors"
                        title={!isSidebarOpen ? 'Déconnexion' : ''}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}>
                {/* TopBar */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900">{auth.user.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{auth.user.role}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                {auth.user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
