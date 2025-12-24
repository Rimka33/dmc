import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/Admin/PageHeader';
import Section from '../../../Components/Admin/Section';
import FormField from '../../../Components/Admin/FormField';
import { Settings, Lock, Globe, Bell } from 'lucide-react';

export default function SettingsIndex({ settings = {}, roles = [] }) {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { key: 'general', label: 'Paramètres Généraux', icon: Globe },
        { key: 'roles', label: 'Rôles & Permissions', icon: Lock },
        { key: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Paramètres"
                    subtitle="Configurez votre boutique et gérez les accès"
                />

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-4 py-3 font-bold border-b-2 transition-all whitespace-nowrap ${
                                    activeTab === tab.key
                                        ? 'border-forest-green text-forest-green'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* General Settings */}
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <Section title="Informations Générales">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="Nom de la Boutique"
                                        placeholder="DMC Computer"
                                        defaultValue={settings.store_name}
                                    />
                                    <FormField
                                        label="Email Support"
                                        type="email"
                                        placeholder="support@dmc.com"
                                        defaultValue={settings.support_email}
                                    />
                                </div>
                                <FormField
                                    label="Description"
                                    type="textarea"
                                    placeholder="Description de votre boutique..."
                                    defaultValue={settings.store_description}
                                    rows={4}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="Téléphone"
                                        placeholder="+226 25 XX XX XX"
                                        defaultValue={settings.phone}
                                    />
                                    <FormField
                                        label="Adresse"
                                        placeholder="Burkina Faso"
                                        defaultValue={settings.address}
                                    />
                                </div>
                                <button className="px-6 py-3 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold">
                                    Enregistrer les Modifications
                                </button>
                            </form>
                        </Section>

                        <Section title="Réseaux Sociaux">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {['facebook', 'instagram', 'twitter', 'linkedin'].map((social) => (
                                        <FormField
                                            key={social}
                                            label={social.charAt(0).toUpperCase() + social.slice(1)}
                                            placeholder={`https://${social}.com/...`}
                                            defaultValue={settings[`${social}_url`]}
                                        />
                                    ))}
                                </div>
                                <button className="px-6 py-3 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold">
                                    Enregistrer les Liens
                                </button>
                            </form>
                        </Section>

                        <Section title="Modes de Paiement">
                            <div className="space-y-4">
                                {['stripe', 'paypal', 'bank_transfer', 'cash_on_delivery'].map((method) => (
                                    <label key={method} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            defaultChecked={settings[`payment_${method}`]}
                                            className="w-4 h-4 border-gray-200 rounded accent-forest-green"
                                        />
                                        <span className="font-medium text-gray-700">
                                            {method === 'stripe' && 'Stripe'}
                                            {method === 'paypal' && 'PayPal'}
                                            {method === 'bank_transfer' && 'Virement Bancaire'}
                                            {method === 'cash_on_delivery' && 'Paiement à la Livraison'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </Section>
                    </div>
                )}

                {/* Roles & Permissions */}
                {activeTab === 'roles' && (
                    <div className="space-y-6">
                        {roles.map((role) => (
                            <Section key={role.id} title={role.name}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['create', 'read', 'update', 'delete'].map((permission) => (
                                        <label key={permission} className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                defaultChecked={role.permissions?.[permission]}
                                                className="w-4 h-4 border-gray-200 rounded accent-forest-green"
                                            />
                                            <span className="text-gray-700 font-medium capitalize">{permission}</span>
                                        </label>
                                    ))}
                                </div>
                            </Section>
                        ))}
                    </div>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                    <div className="space-y-6">
                        <Section title="Alertes Email">
                            <div className="space-y-4">
                                {[
                                    { key: 'new_order', label: 'Nouvelles Commandes' },
                                    { key: 'low_stock', label: 'Stocks Bas' },
                                    { key: 'payment_failed', label: 'Échecs de Paiement' },
                                    { key: 'customer_review', label: 'Avis Clients' },
                                    { key: 'customer_message', label: 'Messages Clients' },
                                ].map((notif) => (
                                    <label key={notif.key} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            defaultChecked={settings[`notify_${notif.key}`]}
                                            className="w-4 h-4 border-gray-200 rounded accent-forest-green"
                                        />
                                        <span className="font-medium text-gray-700">{notif.label}</span>
                                    </label>
                                ))}
                            </div>
                        </Section>

                        <Section title="Adresse Email de Notification">
                            <form className="space-y-4">
                                <FormField
                                    label="Email Principal"
                                    type="email"
                                    placeholder="admin@dmc.com"
                                    defaultValue={settings.notification_email}
                                />
                                <button className="px-6 py-3 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold">
                                    Enregistrer
                                </button>
                            </form>
                        </Section>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}