"use client"

import { useState } from "react"
import { Link, usePage } from "@inertiajs/react"
import AdminLayout from "../../Layouts/AdminLayout"
import StatCard from "../../Components/Admin/StatCard"
import ChartCard from "../../Components/Admin/ChartCard"
import Section from "../../Components/Admin/Section"
import StatusBadge from "../../Components/Admin/StatusBadge"
import {
  ShoppingBag,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  AlertTriangle,
  LayoutGrid,
  Star,
  Sparkles,
  Gift,
  Award,
  Mail,
  ChevronRight,
  Activity,
  Zap,
  Plus,
  Upload,
  Download,
  FileText,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"

export default function Dashboard({ stats = {}, collections = [] }) {
  const { auth } = usePage().props

  const chartData = [
    { name: 'Lun', value: 4000 },
    { name: 'Mar', value: 3000 },
    { name: 'Mer', value: 2000 },
    { name: 'Jeu', value: 2780 },
    { name: 'Ven', value: 1890 },
    { name: 'Sam', value: 2390 },
    { name: 'Dim', value: 3490 },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <AdminLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 pb-10"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="mb-2">
          <h2 className="text-3xl font-bold text-dark-green mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Welcome back, {auth?.user?.name || 'Admin'}
          </h2>
          <p className="text-dark-green/60 font-medium">
            Voici ce qui se passe dans votre boutique DMC aujourd'hui.
          </p>
        </motion.div>

        {/* Priority Actions */}
        {(stats.pending_orders > 0 || stats.new_messages > 0 || stats.pending_reviews > 0) && (
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            {stats.pending_orders > 0 && (
              <Link href="/admin/orders?status=pending" className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-amber-500/20 transition-all">
                <ShoppingCart size={12} strokeWidth={3} />
                {stats.pending_orders} commandes en attente
              </Link>
            )}
            {stats.new_messages > 0 && (
              <Link href="/admin/messages" className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500/20 transition-all">
                <Mail size={12} strokeWidth={3} />
                {stats.new_messages} nouveaux messages
              </Link>
            )}
            {stats.pending_reviews > 0 && (
              <Link href="/admin/reviews" className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-700 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-purple-500/20 transition-all">
                <Star size={12} strokeWidth={3} />
                {stats.pending_reviews} avis à modérer
              </Link>
            )}
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={itemVariants}>
            <StatCard
              title="Revenue Total"
              value={formatPrice(stats.revenue_this_month || 0)}
              trend={18.2}
              trendValue="+18.2%"
              icon={DollarSign}
              description="Ce mois-ci"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Commandes"
              value={stats.total_orders || 0}
              trend={12.5}
              trendValue="+12.5%"
              icon={ShoppingBag}
              description="Total historique"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Clients Actifs"
              value={stats.total_customers || 0}
              trend={8.3}
              trendValue="+8.3%"
              icon={Users}
              description="Base client fiable"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Stock"
              value={stats.total_products || 0}
              trend={stats.low_stock_count > 0 ? -1 : 1}
              trendValue={stats.low_stock_count > 0 ? `${stats.low_stock_count} alertes` : "OK"}
              icon={Package}
              description="Articles en ligne"
            />
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <ChartCard title="Vue d'ensemble des revenus" subtitle="Ventes et performances financières hebdomadaires">
              <div className="w-full h-full min-h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#058031" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#058031" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(5, 128, 49, 0.05)" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(1, 26, 10, 0.4)' }}
                    />
                    <YAxis hide={true} />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: '16px',
                        border: '1px solid rgba(5, 128, 49, 0.1)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        fontFamily: 'Montserrat'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#058031"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Section title="Actions Rapides" subtitle="Fonctions les plus utilisées">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Plus, label: 'Ajout Produit', href: '/admin/products/create', color: 'from-forest-green to-neon-green' },
                  { icon: Upload, label: 'Import Données', href: '/admin/products', color: 'from-forest-green to-emerald-600' },
                  { icon: Download, label: 'Export Rapport', href: '/admin/orders', color: 'from-emerald-600 to-forest-green' },
                  { icon: FileText, label: 'Factures', href: '/admin/orders', color: 'from-neon-green to-forest-green' },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group relative p-4 rounded-xl bg-forest-green/5 border border-forest-green/15 hover:border-forest-green/30 transition-all overflow-hidden text-center"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    <div className="relative flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-forest-green/10 border border-forest-green/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <action.icon className="w-5 h-5 text-forest-green" strokeWidth={2} />
                      </div>
                      <span className="text-[10px] font-black uppercase text-dark-green group-hover:text-forest-green transition-colors leading-tight">
                        {action.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Section>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Section
              title="Ventes Récentes"
              icon={Activity}
              actions={
                <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-forest-green hover:underline">
                  Voir tout →
                </Link>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-dark-green/40 uppercase tracking-[0.2em] border-b border-forest-green/10">
                      <th className="pb-4">Commande</th>
                      <th className="pb-4">Client</th>
                      <th className="pb-4">Montant</th>
                      <th className="pb-4 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest-green/5">
                    {(stats.recent_orders || []).map((order) => (
                      <tr key={order.id} className="group hover:bg-forest-green/5 transition-colors">
                        <td className="py-4">
                          <p className="text-sm font-black text-dark-green">#{order.order_number}</p>
                          <p className="text-[10px] text-dark-green/40 font-bold">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-sm font-bold text-dark-green">{order.customer_name}</p>
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
          </motion.div>

          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Section title="Top Produits" icon={Zap}>
                <div className="space-y-4">
                  {(stats.top_products || []).map((product, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-forest-green/5 rounded-xl border border-forest-green/10 group hover:border-forest-green/30 transition-all">
                      <div className="w-9 h-9 bg-white rounded-lg border border-forest-green/20 flex items-center justify-center font-black text-forest-green text-sm shadow-sm group-hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-dark-green truncate uppercase tracking-tighter">{product.name}</p>
                        <p className="text-[10px] text-dark-green/40 font-black">{product.total_sold} VENTES</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-dark-green">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </motion.div>

            {stats.low_stock_products?.length > 0 && (
              <motion.div variants={itemVariants}>
                <Section title="Alertes Stock" icon={AlertTriangle} className="border-red-500/10">
                  <div className="space-y-3">
                    {stats.low_stock_products.slice(0, 3).map((product) => (
                      <div key={product.id} className="p-3 bg-red-500/5 rounded-xl border border-red-500/10 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-dark-green truncate">{product.name}</p>
                          <p className="text-[10px] font-black text-red-600 uppercase">{product.stock_quantity} EN STOCK</p>
                        </div>
                        <Link href={`/admin/products/${product.id}/edit`} className="p-2 bg-white rounded-lg shadow-sm text-red-500 hover:bg-red-50">
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </Section>
              </motion.div>
            )}
          </div>
        </div>

        {/* Homepage Sections */}
        <motion.div variants={itemVariants}>
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
                    className="p-5 border border-forest-green/10 rounded-2xl hover:border-forest-green transition-all hover:bg-forest-green/5 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 ${section.bg} rounded-lg ${section.color}`}>
                        <Icon size={20} />
                      </div>
                      {collection && <span className="w-2 h-2 bg-neon-green rounded-full"></span>}
                    </div>
                    <h3 className="text-sm font-black text-dark-green uppercase tracking-tighter mb-1">{section.label}</h3>
                    <p className="text-[10px] text-dark-green/40 font-bold uppercase tracking-widest">
                      {collection ? `${collection.products_count} articles` : 'Non configuré'}
                    </p>
                  </Link>
                );
              })}
            </div>
          </Section>
        </motion.div>
      </motion.div>
    </AdminLayout>
  )
}
