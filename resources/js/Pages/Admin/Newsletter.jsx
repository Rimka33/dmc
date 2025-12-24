import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import PageHeader from '../../Components/Admin/PageHeader';
import Section from '../../Components/Admin/Section';
import DataTable from '../../Components/Admin/DataTable';
import FormField from '../../Components/Admin/FormField';
import { Mail, Send, Download, Upload } from 'lucide-react';

export default function Newsletter({ stats = {}, subscribers = {}, campaigns = {} }) {
    const [activeTab, setActiveTab] = useState('subscribers');

    const subscriberColumns = [
        {
            key: 'email',
            label: 'Email',
            width: '40%',
            render: (value) => <span className="font-bold text-gray-900">{value}</span>
        },
        {
            key: 'name',
            label: 'Nom',
            render: (value) => <span className="text-gray-700">{value || '-'}</span>
        },
        {
            key: 'subscribed_at',
            label: 'Date d\'inscription',
            render: (value) => <span className="text-gray-600 text-sm">{new Date(value).toLocaleDateString('fr-FR')}</span>
        },
        {
            key: 'active',
            label: 'Statut',
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    value ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                    {value ? '✓ Actif' : '✗ Inactif'}
                </span>
            )
        },
    ];

    const campaignColumns = [
        {
            key: 'subject',
            label: 'Sujet',
            width: '35%',
            render: (value) => <p className="font-bold text-gray-900 truncate">{value}</p>
        },
        {
            key: 'sent_at',
            label: 'Date d\'envoi',
            render: (value) => <span className="text-gray-600 text-sm">{value ? new Date(value).toLocaleDateString('fr-FR') : 'Non envoyé'}</span>
        },
        {
            key: 'recipients_count',
            label: 'Destinataires',
            align: 'center',
            render: (value) => <span className="font-bold text-gray-900">{value}</span>
        },
        {
            key: 'open_rate',
            label: 'Taux d\'ouverture',
            render: (value) => <span className="font-bold text-blue-600">{value}%</span>
        },
        {
            key: 'click_rate',
            label: 'Taux de clic',
            render: (value) => <span className="font-bold text-green-600">{value}%</span>
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Gestion Newsletter"
                    subtitle="Gérez vos abonnés et créez des campagnes marketing"
                />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Section title="Total Abonnés" icon={Mail}>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-forest-green">{stats.total_subscribers || 0}</p>
                        </div>
                    </Section>
                    <Section title="Actifs ce Mois">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-blue-500">{stats.active_this_month || 0}</p>
                        </div>
                    </Section>
                    <Section title="Désabonnements">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-red-500">{stats.unsubscribed_count || 0}</p>
                        </div>
                    </Section>
                    <Section title="Taux d\'engagement">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-green-500">{stats.engagement_rate || 0}%</p>
                        </div>
                    </Section>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-200">
                    {['subscribers', 'campaigns', 'create'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 font-bold border-b-2 transition-all ${
                                activeTab === tab
                                    ? 'border-forest-green text-forest-green'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab === 'subscribers' && 'Abonnés'}
                            {tab === 'campaigns' && 'Campagnes'}
                            {tab === 'create' && 'Nouvelle Campagne'}
                        </button>
                    ))}
                </div>

                {/* Subscribers Tab */}
                {activeTab === 'subscribers' && (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold">
                                <Upload size={18} />
                                Importer
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold">
                                <Download size={18} />
                                Exporter
                            </button>
                        </div>
                        <DataTable 
                            columns={subscriberColumns}
                            data={subscribers?.data || []}
                            pagination={{
                                from: subscribers?.from || 1,
                                to: subscribers?.to || 0,
                                total: subscribers?.total || 0,
                                links: subscribers?.links || []
                            }}
                            emptyMessage="Aucun abonné"
                        />
                    </div>
                )}

                {/* Campaigns Tab */}
                {activeTab === 'campaigns' && (
                    <DataTable 
                        columns={campaignColumns}
                        data={campaigns?.data || []}
                        pagination={{
                            from: campaigns?.from || 1,
                            to: campaigns?.to || 0,
                            total: campaigns?.total || 0,
                            links: campaigns?.links || []
                        }}
                        emptyMessage="Aucune campagne"
                    />
                )}

                {/* Create Campaign Tab */}
                {activeTab === 'create' && (
                    <Section title="Créer une Campagne">
                        <form className="space-y-6">
                            <FormField
                                label="Sujet"
                                placeholder="Ex: Nouvelle collection 2025"
                                required
                            />
                            <FormField
                                label="Contenu"
                                type="textarea"
                                rows={6}
                                placeholder="Contenu de votre email..."
                                required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="Segment d'audience"
                                    type="select"
                                    options={[
                                        { label: 'Tous les abonnés', value: 'all' },
                                        { label: 'Clients actifs', value: 'active' },
                                        { label: 'Gros acheteurs', value: 'vip' },
                                        { label: 'Inactifs', value: 'inactive' },
                                    ]}
                                    required
                                />
                                <FormField
                                    label="Date d'envoi"
                                    type="date"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-3 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold"
                            >
                                <Send size={18} />
                                Créer la Campagne
                            </button>
                        </form>
                    </Section>
                )}
            </div>
        </AdminLayout>
    );
}