"use client"

import { useState } from "react"
import { Link, router, usePage } from "@inertiajs/react"
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
} from "lucide-react"

export default function AdminLayout({ children }) {
  const { auth } = usePage().props
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [expandedMenu, setExpandedMenu] = useState(null)

  const navigations = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      badge: null,
    },
    {
      name: "Catalogue",
      icon: ShoppingBag,
      submenu: [
        { name: "Produits", href: "/admin/products" },
        { name: "Catégories", href: "/admin/categories" },
        { name: "Collections", href: "/admin/collections" },
      ],
    },
    {
      name: "Contenu",
      icon: FileText,
      submenu: [
        { name: "Blog", href: "/admin/blog" },
        { name: "Pages", href: "/admin/pages" },
        { name: "Bannières", href: "/admin/banners" },
      ],
    },
    {
      name: "Commandes",
      icon: ShoppingCart,
      href: "/admin/orders",
      badge: null,
    },
    {
      name: "Clients",
      icon: Users,
      href: "/admin/customers",
    },
    {
      name: "Interactions",
      icon: MessageSquare,
      submenu: [
        { name: "Avis & Notes", href: "/admin/reviews" },
        { name: "Questions", href: "/admin/questions" },
        { name: "Messages", href: "/admin/messages" },
      ],
    },
    {
      name: "Newsletter",
      icon: Mail,
      href: "/admin/newsletter",
    },
    {
      name: "Paramètres",
      icon: Settings,
      href: "/admin/settings",
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.post("/logout")
  }

  const isMenuActive = (item) => {
    const path = window.location.pathname
    if (item.href) return path === item.href
    if (item.submenu) {
      return item.submenu.some((sub) => path === sub.href)
    }
    return false
  }

  const toggleSubmenu = (name) => {
    setExpandedMenu(expandedMenu === name ? null : name)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 lg:hidden z-40" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar - Fixed height with internal scroll */}
      <aside
        className={`${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"
          } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed lg:sticky top-0 h-screen z-50 shadow-2xl`}
      >
        {/* Logo - Added flex-shrink-0 to prevent crushing */}
        <div className="p-5 flex items-center gap-3 border-b border-gray-100 flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-forest-green to-dark-green rounded-xl flex items-center justify-center font-black text-white shadow-lg">
            D
          </div>
          {isSidebarOpen && (
            <div className="min-w-0">
              <span className="font-black text-lg tracking-tight text-gray-900 block truncate">DMC</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Navigation - Added overflow-y-auto with custom scrollbar */}
        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {navigations.map((item) => {
            const Icon = item.icon
            const isActive = isMenuActive(item)
            const isExpanded = expandedMenu === item.name

            return (
              <div key={item.name}>
                {item.submenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm group ${isActive || isExpanded
                      ? "bg-forest-green/5 text-forest-green"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    title={!isSidebarOpen ? item.name : ""}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {isSidebarOpen && (
                      <>
                        <span className="flex-1 text-left truncate">{item.name}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm group ${isActive
                      ? "bg-forest-green text-white shadow-lg shadow-forest-green/20"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    title={!isSidebarOpen ? item.name : ""}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {isSidebarOpen && <span className="truncate">{item.name}</span>}
                    {item.badge && isSidebarOpen && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center shadow flex-shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}

                {/* Submenu items */}
                {item.submenu && isSidebarOpen && isExpanded && (
                  <div className="pl-9 space-y-1 mt-1 border-l-2 border-gray-100 ml-3 mb-2">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all font-medium truncate ${window.location.pathname === subitem.href
                          ? "bg-forest-green/10 text-forest-green font-bold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                      >
                        <span className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0"></span>
                        <span className="truncate">{subitem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer actions - Added flex-shrink-0 */}
        <div className="p-3 border-t border-gray-100 space-y-1 flex-shrink-0 bg-gray-50/50">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-forest-green hover:bg-white rounded-xl transition-all text-sm font-semibold"
            title={!isSidebarOpen ? "Voir le site" : ""}
          >
            <ExternalLink size={18} className="flex-shrink-0" />
            {isSidebarOpen && <span className="truncate">Voir le site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-semibold"
            title={!isSidebarOpen ? "Déconnexion" : ""}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {isSidebarOpen && <span className="truncate">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content - Better responsive structure */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:w-auto">
        {/* Top Header - Made it sticky with better z-index */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm flex-shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex-1"></div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg relative transition-all">
                <Bell size={20} />
                {(usePage().props.admin_notifications?.pending_orders > 0 ||
                  usePage().props.admin_notifications?.new_messages > 0 ||
                  usePage().props.admin_notifications?.pending_reviews > 0 ||
                  usePage().props.admin_notifications?.pending_questions > 0) && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                  )}
              </button>

              {/* Notification Dropdown */}
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                  <h3 className="font-black text-sm uppercase tracking-wider text-gray-900">Notifications prioritaires</h3>
                </div>
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  {usePage().props.admin_notifications?.pending_orders > 0 && (
                    <Link href="/admin/orders?status=pending" className="flex items-center gap-4 p-3 hover:bg-forest-green/5 rounded-xl transition-colors group/item">
                      <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                        <ShoppingCart size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{usePage().props.admin_notifications.pending_orders} commandes en attente</p>
                        <p className="text-[10px] text-gray-500 font-medium">À traiter rapidement</p>
                      </div>
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    </Link>
                  )}
                  {usePage().props.admin_notifications?.new_messages > 0 && (
                    <Link href="/admin/messages" className="flex items-center gap-4 p-3 hover:bg-forest-green/5 rounded-xl transition-colors">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <Mail size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{usePage().props.admin_notifications.new_messages} nouveaux messages</p>
                        <p className="text-[10px] text-gray-500 font-medium">Contact clients</p>
                      </div>
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    </Link>
                  )}
                  {usePage().props.admin_notifications?.pending_reviews > 0 && (
                    <Link href="/admin/reviews" className="flex items-center gap-4 p-3 hover:bg-forest-green/5 rounded-xl transition-colors">
                      <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                        <Star size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{usePage().props.admin_notifications.pending_reviews} avis à modérer</p>
                        <p className="text-[10px] text-gray-500 font-medium">Gestion e-réputation</p>
                      </div>
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    </Link>
                  )}
                  {usePage().props.admin_notifications?.pending_questions > 0 && (
                    <Link href="/admin/questions" className="flex items-center gap-4 p-3 hover:bg-forest-green/5 rounded-xl transition-colors">
                      <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                        <MessageSquare size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{usePage().props.admin_notifications.pending_questions} questions en attente</p>
                        <p className="text-[10px] text-gray-500 font-medium">Conseil produit</p>
                      </div>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    </Link>
                  )}
                  {!(usePage().props.admin_notifications?.pending_orders > 0 ||
                    usePage().props.admin_notifications?.new_messages > 0 ||
                    usePage().props.admin_notifications?.pending_reviews > 0 ||
                    usePage().props.admin_notifications?.pending_questions > 0) && (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                          <Bell size={24} />
                        </div>
                        <p className="text-sm font-bold text-gray-900">Aucune notification</p>
                        <p className="text-xs text-gray-500">Tout est à jour !</p>
                      </div>
                    )}
                </div>
                <div className="p-4 border-t border-gray-50 text-center">
                  <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-forest-green hover:text-dark-green transition-colors">
                    Voir toutes les activités
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{auth?.user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500 capitalize font-medium truncate">
                  {auth?.user?.role || "administrator"}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-forest-green to-dark-green rounded-full flex items-center justify-center font-black text-white shadow-lg flex-shrink-0">
                {auth?.user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Added proper scrolling container */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>

        {/* Footer - Made it flex-shrink-0 */}
        <footer className="border-t border-gray-200 bg-white py-3 px-6 text-center text-xs text-gray-500 font-medium flex-shrink-0">
          <p>&copy; 2025 DMC Admin. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  )
}
