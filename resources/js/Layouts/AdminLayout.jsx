'use client';

import { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useNotification } from '../contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ExternalLink,
  FileText,
  Mail,
  MessageSquare,
  ChevronDown,
  Search,
  User,
  Leaf,
  Shield,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { url } = usePage();
  const { auth, flash } = usePage().props;
  const user = auth?.user;
  const { showNotification } = useNotification();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setGlobalSearch(params.get('search') || '');
  }, [url]);

  useEffect(() => {
    if (flash?.success) {
      showNotification(flash.success, 'success');
    }
    if (flash?.error) {
      showNotification(flash.error, 'error');
    }
    if (flash?.warning) {
      showNotification(flash.warning, 'warning');
    }
    if (flash?.info) {
      showNotification(flash.info, 'info');
    }
  }, [flash]);

  const hasPermission = (permission) => {
    if (user?.role === 'admin') return true;
    return user?.permissions?.includes(permission);
  };

  const allNavigations = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
      badge: null,
      permission: 'dashboard.view',
    },
    {
      name: 'Catalogue',
      icon: ShoppingBag,
      // Visible if has products.view OR marketing.collections.manage
      groupPermissions: ['products.view', 'marketing.collections.manage'],
      submenu: [
        { name: 'Produits', href: '/admin/products', permission: 'products.view' },
        { name: 'Catégories', href: '/admin/categories', permission: 'products.view' },
        {
          name: 'Collections',
          href: '/admin/collections',
          permission: 'marketing.collections.manage',
        },
      ],
    },
    {
      name: 'Contenu',
      icon: FileText,
      // Visible if has ANY of below
      groupPermissions: ['content.blog.manage', 'content.pages.manage', 'content.banners.manage'],
      submenu: [
        { name: 'Blog', href: '/admin/blog', permission: 'content.blog.manage' },
        { name: 'Pages', href: '/admin/pages', permission: 'content.pages.manage' },
        { name: 'Bannières', href: '/admin/banners', permission: 'content.banners.manage' },
      ],
    },
    {
      name: 'Commandes',
      icon: ShoppingCart,
      href: '/admin/orders',
      badge: null,
      permission: 'orders.manage',
    },
    {
      name: 'Clients',
      icon: Users,
      href: '/admin/customers',
      permission: 'customers.view',
    },
    {
      name: 'Interactions',
      icon: MessageSquare,
      groupPermissions: [
        'interactions.reviews.manage',
        'interactions.questions.manage',
        'interactions.messages.manage',
      ],
      submenu: [
        { name: 'Avis & Notes', href: '/admin/reviews', permission: 'interactions.reviews.manage' },
        {
          name: 'Questions',
          href: '/admin/questions',
          permission: 'interactions.questions.manage',
        },
        { name: 'Messages', href: '/admin/messages', permission: 'interactions.messages.manage' },
      ],
    },
    {
      name: 'Système',
      icon: Shield,
      groupPermissions: ['users.manage', 'roles.manage'],
      submenu: [
        { name: 'Utilisateurs', href: '/admin/users', permission: 'users.manage' },
        { name: 'Rôles & Permissions', href: '/admin/roles', permission: 'roles.manage' },
      ],
    },
    {
      name: 'Newsletter',
      icon: Mail,
      href: '/admin/newsletter',
      permission: 'marketing.newsletter.manage',
    },
    {
      name: 'Paramètres',
      icon: Settings,
      href: '/admin/settings',
      permission: 'settings.manage',
    },
  ];

  const navigations = allNavigations
    .filter((item) => {
      // 1. Check direct permission
      if (item.permission) {
        return hasPermission(item.permission);
      }
      // 2. Check group permissions (if has any of them)
      if (item.groupPermissions) {
        return item.groupPermissions.some((perm) => hasPermission(perm));
      }
      // 3. Fallback to Admin role if no permissions defined (should not happen with new setup)
      return user?.role === 'admin';
    })
    .map((item) => {
      // Filter submenu items if they have specific permissions
      if (item.submenu) {
        return {
          ...item,
          submenu: item.submenu.filter((sub) => !sub.permission || hasPermission(sub.permission)),
        };
      }
      return item;
    });

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.post('/logout');
  };

  const isMenuActive = (item) => {
    if (item.href) return url === item.href;
    if (item.submenu) {
      return item.submenu.some((sub) => url === sub.href);
    }
    return false;
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden font-bai-jamjuree">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-20 backdrop-blur-xl border-r border-forest-green/20 z-50 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'rgba(255, 255, 255, 0.98)' }}
      >
        {/* Logo - Fixed Top */}
        <div className="flex-shrink-0 flex items-center justify-center h-20 bg-dark-green relative overflow-hidden">
          <Link
            href="/admin/dashboard"
            className="relative z-10 transition-transform hover:scale-110"
          >
            <img
              src="/images/logo.png"
              alt="DMC"
              className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(0,255,36,0.3)]"
            />
          </Link>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-green/30 to-transparent"></div>
        </div>

        {/* Navigation Area - Calculated height to prevent overflow */}
        <div className="flex-1 min-h-0 py-4">
          <div className="h-full overflow-y-auto no-scrollbar px-2">
            <nav className="flex flex-col items-center gap-1">
              {navigations.map((item) => {
                const Icon = item.icon;
                const isActive = isMenuActive(item);
                const isHovered = hoveredItem === item.name;

                return (
                  <div
                    key={item.name}
                    className="relative flex justify-center w-full flex-shrink-0"
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    data-nav-item={item.name}
                  >
                    <div className="py-2">
                      <Link
                        href={item.href || (item.submenu ? item.submenu[0].href : '#')}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative z-10 ${
                          isActive
                            ? 'bg-forest-green shadow-lg shadow-forest-green/30'
                            : 'hover:bg-forest-green/10'
                        }`}
                      >
                        <Icon
                          size={20}
                          className={`transition-colors ${isActive ? 'text-neon-green' : 'text-dark-green/60 group-hover:text-forest-green'}`}
                        />
                        {isActive && (
                          <motion.div
                            layoutId="activeGlow"
                            className="absolute -inset-1 blur-md opacity-20 rounded-2xl"
                          />
                        )}
                      </Link>
                    </div>

                    {/* Submenu Flyout - Fixed positioning to escape overflow */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, x: -10, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="fixed left-20 z-[100]"
                          style={{
                            top: `${document.querySelector(`[data-nav-item="${item.name}"]`)?.getBoundingClientRect().top || 0}px`,
                          }}
                          data-submenu={item.name}
                        >
                          <div className="flex items-center pl-2">
                            <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-forest-green/10"></div>

                            {item.submenu ? (
                              <div className="bg-white/95 backdrop-blur-xl border border-forest-green/15 rounded-[2rem] shadow-2xl min-w-[220px] py-4 px-2 border-l-[4px] border-l-forest-green">
                                <div className="px-5 py-2 mb-2 border-b border-forest-green/5">
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-green/30">
                                    {item.name}
                                  </span>
                                </div>
                                <div className="space-y-1 px-1">
                                  {item.submenu.map((sub) => (
                                    <Link
                                      key={sub.name}
                                      href={sub.href}
                                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${url === sub.href ? 'bg-forest-green/10 text-forest-green' : 'text-dark-green/60 hover:text-dark-green hover:bg-forest-green/5'}`}
                                    >
                                      <div
                                        className={`w-1.5 h-1.5 rounded-full ${url === sub.href ? 'bg-forest-green shadow-[0_0_8px_rgba(5,128,49,0.5)]' : 'bg-dark-green/10'}`}
                                      ></div>
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="px-4 py-2 bg-dark-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap">
                                {item.name}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Logout - Safe fixed bottom */}
        <div className="flex-shrink-0 p-4 border-t border-forest-green/10 flex flex-col items-center gap-2 bg-white/50 backdrop-blur-md">
          <button
            onClick={handleLogout}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-dark-green/30 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />{' '}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-20">
        <header className="h-20 border-b border-forest-green/10 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-dark-green/60"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold font-montserrat uppercase tracking-tight text-dark-green">
              DMC <span className="text-forest-green font-medium ml-1">Admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-forest-green/10 text-forest-green hover:bg-forest-green hover:text-white rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest group"
            >
              <ExternalLink
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
              <span className="hidden md:inline">Voir le site</span>
            </Link>
            <div className="flex items-center gap-3 pl-6 border-l border-forest-green/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-dark-green font-montserrat">
                  {auth?.user?.name || 'Admin'}
                </p>
                <p className="text-[10px] font-bold text-dark-green/40 uppercase tracking-widest">
                  Gérant
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-forest-green/10 flex items-center justify-center text-forest-green">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        <footer className="py-4 text-center text-[10px] font-bold text-dark-green/20 uppercase tracking-[0.3em] border-t border-forest-green/5">
          &copy; 2025 DAROUL MOUHTY COMPUTER. TOUS DROITS RÉSERVÉS. CONÇU PAR ITEA
        </footer>
      </div>

      {/* Background Grid */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#058031 1px, transparent 1px), linear-gradient(90deg, #058031 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      ></div>
    </div>
  );
}
