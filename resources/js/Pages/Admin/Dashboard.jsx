"use client"

import { useState } from "react"
import { Link, usePage } from "@inertiajs/react"
import AdminLayout from "../../Layouts/AdminLayout"
import StatCard from "../../Components/Admin/StatCard"
import ChartCard from "../../Components/Admin/ChartCard"
import Section from "../../Components/Admin/Section"
import PageHeader from "../../Components/Admin/PageHeader"
import StatusBadge from "../../Components/Admin/StatusBadge"
import {
  ShoppingBag,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  Eye,
  LayoutGrid,
  Star,
  Sparkles,
  Gift,
  Award,
  MessageSquare,
  Mail,
  ChevronRight,
  TrendingDown,
  Activity,
  Zap,
} from "lucide-react"

export default function Dashboard({ stats = {}, collections = [] }) {
  const formatPrice = (value) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", minimumFractionDigits: 0 }).format(value);

  const mainStats = [
    {
      title: "Chiffre d'Affaires",
      value: formatPrice(stats.revenue_this_month || 0),
      icon: DollarSign,
      trendValue: "Ce mois",
      trendLabel: "Encaissé",
      color: "amber",
      description: "Cumul mensuel",
    },
    {
      title: "Commandes",
      value: stats.total_orders || 0,
      icon: ShoppingCart,
      trendValue: stats.pending_orders > 0 ? `${stats.pending_orders} en attente` : "Tout traité",
      trendLabel: "Priorité",
      color: "blue",
      description: "Total commandes",
    },
    {
      title: "Clients",
      value: stats.total_customers || 0,
      icon: Users,
      trendValue: "Actifs",
      trendLabel: "Inscrits",
      color: "purple",
      description: "Base client",
    },
    {
      title: "Produits",
      value: stats.total_products || 0,
      icon: Package,
      trendValue: stats.low_stock_count > 0 ? `${stats.low_stock_count} alertes` : "Stock OK",
      trendLabel: "Inventaire",
      color: "green",
      description: "Articles en ligne",
    },
  ]

  const recentOrders = stats.recent_orders || []
  const lowStockProducts = stats.low_stock_products || []
  const topProducts = stats.top_products || []

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        {/* Page Header with Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <PageHeader
            title="Tableau de Bord"
            subtitle="Bienvenue, voici l'état de votre boutique DMC ce matin."
          />
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 px-6 py-3 bg-forest-green text-white rounded-xl hover:bg-dark-green transition-all font-bold shadow-lg shadow-forest-green/20"
            >
              <ShoppingCart size={18} />
              Gérer les commandes
            </Link>
          </div>
        </div>

        {/* Priority Actions Banner */}
        {(stats.pending_orders > 0 || stats.new_messages > 0 || stats.pending_reviews > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.pending_orders > 0 && (
              <Link href="/admin/orders?status=pending" className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-tighter">Commandes à traiter</p>
                  <p className="text-xl font-black text-gray-900">{stats.pending_orders}</p>
                </div>
                <ChevronRight className="ml-auto text-amber-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {stats.new_messages > 0 && (
              <Link href="/admin/messages" className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter">Nouveaux Messages</p>
                  <p className="text-xl font-black text-gray-900">{stats.new_messages}</p>
                </div>
                <ChevronRight className="ml-auto text-blue-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {stats.pending_reviews > 0 && (
              <Link href="/admin/reviews" className="flex items-center gap-4 p-4 bg-purple-50 border border-purple-100 rounded-2xl hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <Star size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-tighter">Avis à modérer</p>
                  <p className="text-xl font-black text-gray-900">{stats.pending_reviews}</p>
                </div>
                <ChevronRight className="ml-auto text-purple-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Sales Overview */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Section
              title="Ventes Récentes"
              icon={Activity}
              actions={
                <Link href="/admin/orders" className="text-xs font-black uppercase tracking-widest text-forest-green hover:underline">
                  Voir historique complet →
                </Link>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                      <th className="pb-4">Commande</th>
                      <th className="pb-4">Client</th>
                      <th className="pb-4">Montant</th>
                      <th className="pb-4 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <p className="text-sm font-black text-gray-900">#{order.order_number}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-sm font-bold text-gray-700">{order.customer_name}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-sm font-black text-forest-green">{formatPrice(order.total)}</p>
                        </td>
                        <td className="py-4 text-right">
                          <StatusBadge status={order.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Top Products Grid */}
            <Section title="Top Produits" icon={Zap}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topProducts.map((product, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center font-black text-forest-green shadow-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate uppercase">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.total_sold} ventes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                ))}
                {topProducts.length === 0 && (
                  <p className="text-center col-span-2 py-6 text-gray-500 text-sm">Pas encore de données de vente ce mois-ci.</p>
                )}
              </div>
            </Section>
          </div>

          {/* Side Panels */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Revenue Widget */}
            <div className="bg-black rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-forest-green/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Revenus aujourd'hui</p>
              <h3 className="text-3xl font-black mb-2">{formatPrice(stats.revenue_today || 0)}</h3>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  <TrendingUp size={14} className="text-neon-green" />
                </div>
                <p className="text-[10px] font-bold text-neon-green uppercase tracking-widest">En direct</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Total encaissé</span>
                  <span className="font-bold">{formatPrice(stats.revenue_total || 0)}</span>
                </div>
                <div className="h-0.5 bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-forest-green w-[65%]"></div>
                </div>
              </div>
            </div>

            {/* Stock Alerts */}
            <Section
              title="Alertes Stock"
              icon={AlertTriangle}
              className="border-red-100"
            >
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                      <p className="text-[10px] font-black text-red-600 uppercase">{product.stock_quantity} restants</p>
                    </div>
                    <Link href={`/admin/products/${product.id}/edit`} className="p-2 bg-white rounded-lg shadow-sm text-red-500 hover:bg-red-50 transition-colors">
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <p className="text-center py-6 text-gray-500 text-xs">Félicitations ! Aucun article n'est en rupture.</p>
                )}
              </div>
            </Section>

            {/* Interaction Summary */}
            <Section title="E-Réputation" icon={MessageSquare}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                  <p className="text-xs font-bold text-gray-600">Avis non traités</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${stats.pending_reviews > 0 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                    {stats.pending_reviews}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                  <p className="text-xs font-bold text-gray-600">Questions sans réponse</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${stats.pending_questions > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                    {stats.pending_questions}
                  </span>
                </div>
              </div>
            </Section>
          </div>
        </div>

        {/* Homepage Sections Management */}
        <Section
          title="Gestion du Site Vitrine"
          icon={LayoutGrid}
          actions={
            <Link href="/admin/collections" className="text-xs font-black uppercase tracking-widest text-forest-green hover:underline">
              Paramètres avancés →
            </Link>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'featured', label: 'En Vedette', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
              { type: 'new', label: 'Nouveautés', icon: Sparkles, color: 'text-blue-500', bg: 'bg-blue-50' },
              { type: 'special_offers', label: 'Promotions', icon: Gift, color: 'text-red-500', bg: 'bg-red-50' },
              { type: 'best_sellers', label: 'Ventes Top', icon: Award, color: 'text-green-500', bg: 'bg-green-50' },
            ].map((section) => {
              const collection = collections?.find(c => c.type === section.type && c.is_active);
              const Icon = section.icon;

              return (
                <Link
                  key={section.type}
                  href={collection ? `/admin/collections/${collection.id}/edit` : `/admin/collections/create?type=${section.type}`}
                  className="p-5 border border-gray-200 rounded-2xl hover:border-forest-green transition-all hover:bg-gray-50 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 ${section.bg} rounded-lg ${section.color}`}>
                      <Icon size={20} />
                    </div>
                    {collection && <span className="w-2 h-2 bg-neon-green rounded-full"></span>}
                  </div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter mb-1">{section.label}</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {collection ? `${collection.products_count} articles` : 'Non configuré'}
                  </p>
                </Link>
              );
            })}
          </div>
        </Section>
      </div>
    </AdminLayout>
  )
}
