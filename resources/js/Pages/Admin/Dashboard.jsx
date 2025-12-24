import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import StatCard from '../../Components/Admin/StatCard';
import ChartCard from '../../Components/Admin/ChartCard';
import Section from '../../Components/Admin/Section';
import PageHeader from '../../Components/Admin/PageHeader';
import StatusBadge from '../../Components/Admin/StatusBadge';
import DataTable from '../../Components/Admin/DataTable';
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
    Download
} from 'lucide-react';

// Simple Chart Component (without external library)
function SimpleChart({ data, height = 'h-64' }) {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const scale = 100 / maxValue;

    return (
        <div className={`${height} flex flex-col justify-end gap-2 items-end`}>
            <div className="flex gap-2 items-end h-full w-full">
                {data.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-2">
                        <div
                            className="w-full bg-gradient-to-t from-forest-green to-neon-green rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                            style={{ height: `${item.value * scale}%` }}
                            title={`${item.label}: ${item.value}`}
                        />
                        <span className="text-xs text-gray-600 text-center font-medium">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PieChart({ data, height = 'h-64' }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const slices = data.map((item) => {
        const sliceAngle = (item.value / total) * 360;
        const slice = {
            ...item,
            startAngle: currentAngle,
            angle: sliceAngle,
            color: item.color || '#058031'
        };
        currentAngle += sliceAngle;
        return slice;
    });

    return (
        <div className={`${height} flex items-center justify-center`}>
            <div className="w-48 h-48 rounded-full relative" style={{ background: 'conic-gradient(' + slices.map(s => `${s.color} ${s.startAngle}deg ${s.startAngle + s.angle}deg`).join(',') + ')' }}>
                <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{total}</p>
                        <p className="text-xs text-gray-500">Total</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({ stats = {} }) {
    const [dateRange, setDateRange] = useState('month');

    const statCards = [
        {
            title: 'Ventes du mois',
            value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(stats.month_sales || 0),
            icon: DollarSign,
            trend: stats.sales_trend || 12,
            trendValue: '+12%',
            trendLabel: 'vs mois dernier',
            color: 'amber',
            description: 'Revenu total'
        },
        {
            title: 'Commandes',
            value: stats.orders_count || 0,
            icon: ShoppingCart,
            trend: stats.orders_trend || 5,
            trendValue: '+5%',
            trendLabel: 'nouvelles commandes',
            color: 'blue',
            description: 'Ce mois'
        },
        {
            title: 'Clients',
            value: stats.total_customers || 0,
            icon: Users,
            trend: stats.customers_trend || 8,
            trendValue: '+8%',
            trendLabel: 'nouveaux clients',
            color: 'purple',
            description: 'Total actifs'
        },
        {
            title: 'Panier moyen',
            value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(stats.avg_cart_value || 0),
            icon: ShoppingBag,
            trend: null,
            color: 'green',
            description: 'Valeur moyenne'
        },
    ];

    const salesData = [
        { label: 'Lun', value: 2400 },
        { label: 'Mar', value: 1398 },
        { label: 'Mer', value: 9800 },
        { label: 'Jeu', value: 3908 },
        { label: 'Ven', value: 4800 },
        { label: 'Sam', value: 3800 },
        { label: 'Dim', value: 4300 },
    ];

    const topProductsData = [
        { label: 'Produit A', value: 25, color: '#058031' },
        { label: 'Produit B', value: 20, color: '#00ff24' },
        { label: 'Produit C', value: 18, color: '#4B5563' },
        { label: 'Autres', value: 37, color: '#d1d5db' },
    ];

    const recentOrders = stats.recent_orders || [];
    const lowStockProducts = stats.low_stock_products || [];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <PageHeader 
                    title="Tableau de Bord"
                    subtitle="Vue d'ensemble de votre boutique e-commerce DMC"
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card) => (
                        <StatCard 
                            key={card.title}
                            {...card}
                        />
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Chart */}
                    <ChartCard 
                        title="Évolution des ventes"
                        subtitle="7 derniers jours"
                        className="lg:col-span-2"
                        height="h-80"
                    >
                        <SimpleChart data={salesData} />
                    </ChartCard>

                    {/* Top Products */}
                    <ChartCard 
                        title="Top Produits"
                        subtitle="Par nombre de ventes"
                        height="h-80"
                    >
                        <PieChart data={topProductsData} />
                    </ChartCard>
                </div>

                {/* Second Row - Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <Section 
                        title="Dernières Commandes"
                        icon={Package}
                        actions={
                            <Link 
                                href="/admin/orders"
                                className="text-sm text-forest-green hover:underline font-semibold"
                            >
                                Voir tout →
                            </Link>
                        }
                    >
                        {recentOrders.length > 0 ? (
                            <div className="space-y-3">
                                {recentOrders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900">#{order.order_number || order.id}</p>
                                            <p className="text-xs text-gray-500">{order.customer_name || 'Client'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">{order.total} F</p>
                                            <StatusBadge status={order.status} size="sm" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-gray-400">Aucune commande</p>
                        )}
                    </Section>

                    {/* Low Stock Alerts */}
                    <Section 
                        title="Alertes de Stock"
                        icon={AlertTriangle}
                        actions={
                            lowStockProducts.length > 0 && (
                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                    {lowStockProducts.length}
                                </span>
                            )
                        }
                    >
                        {lowStockProducts.length > 0 ? (
                            <div className="space-y-3">
                                {lowStockProducts.slice(0, 5).map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                                            <p className="text-xs text-red-600 font-semibold">Stock: {product.stock_quantity} unités</p>
                                        </div>
                                        <Link 
                                            href={`/admin/products/${product.id}/edit`}
                                            className="px-2 py-1 bg-white border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            Éditer
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-gray-400">Tout est en stock ! ✓</p>
                        )}
                    </Section>
                </div>

                {/* Bottom Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Section 
                        title="Taux de Conversion"
                        icon={TrendingUp}
                    >
                        <div className="text-center">
                            <p className="text-4xl font-bold text-forest-green">3.2%</p>
                            <p className="text-sm text-gray-500 mt-2">Augmentation de 0.5% ce mois</p>
                        </div>
                    </Section>

                    <Section 
                        title="Commandes en Attente"
                        icon={Clock}
                    >
                        <div className="text-center">
                            <p className="text-4xl font-bold text-amber-500">{stats.pending_orders || 0}</p>
                            <p className="text-sm text-gray-500 mt-2">À traiter prioritairement</p>
                        </div>
                    </Section>

                    <Section 
                        title="Visites Aujourd'hui"
                        icon={Eye}
                    >
                        <div className="text-center">
                            <p className="text-4xl font-bold text-blue-500">{stats.today_visits || 1240}</p>
                            <p className="text-sm text-gray-500 mt-2">+18% vs hier</p>
                        </div>
                    </Section>
                </div>

                {/* Banner */}
                <div className="bg-gradient-to-r from-forest-green via-dark-green to-forest-green rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-forest-green/20 border border-neon-green/20">
                    <div className="space-y-2 flex-1">
                        <h3 className="text-3xl font-bold">Bienvenue dans votre Dashboard Premium</h3>
                        <p className="text-white/80 max-w-xl">
                            Gérez votre boutique DMC Computer avec les meilleurs outils d'e-commerce. Suivez vos ventes, analysez vos statistiques et optimisez votre business.
                        </p>
                    </div>
                    <Link 
                        href="/" 
                        className="px-6 py-3 bg-neon-green text-dark-green font-bold rounded-xl hover:bg-white transition-all flex items-center gap-2 shadow-lg shadow-neon-green/30 flex-shrink-0"
                    >
                        <Eye size={18} />
                        Voir la boutique
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}