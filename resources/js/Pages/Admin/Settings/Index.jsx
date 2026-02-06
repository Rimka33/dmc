import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/Admin/PageHeader';
import Section from '../../../Components/Admin/Section';
import FormField from '../../../Components/Admin/FormField';
import {
  Settings,
  Lock,
  Globe,
  Bell,
  Save,
  CheckCircle,
  DollarSign,
  ShieldCheck,
  Mail,
} from 'lucide-react';

export default function SettingsIndex({ settings = {}, flash = {} }) {
  const [activeTab, setActiveTab] = useState('general');

  const {
    data: generalData,
    setData: setGeneralData,
    post: postGeneral,
    processing: generalProcessing,
  } = useForm({
    group: 'general',
    store_name: settings.store_name || '',
    support_email: settings.support_email || '',
    store_description: settings.store_description || '',
    phone: settings.phone || '',
    address: settings.address || '',
    facebook_url: settings.facebook_url || '',
    instagram_url: settings.instagram_url || '',
    twitter_url: settings.twitter_url || '',
    linkedin_url: settings.linkedin_url || '',
    maintenance_mode: settings.maintenance_mode === '1' || settings.maintenance_mode === true,
  });

  const {
    data: paymentData,
    setData: setPaymentData,
    post: postPayment,
    processing: paymentProcessing,
  } = useForm({
    group: 'payment',
    payment_stripe: settings.payment_stripe === '1' || settings.payment_stripe === true,
    payment_paypal: settings.payment_paypal === '1' || settings.payment_paypal === true,
    payment_bank_transfer:
      settings.payment_bank_transfer === '1' || settings.payment_bank_transfer === true,
    payment_cod: settings.payment_cod === '1' || settings.payment_cod === true,
    stripe_key: settings.stripe_key || '',
    paypal_client_id: settings.paypal_client_id || '',
  });

  const {
    data: notifData,
    setData: setNotifData,
    post: postNotif,
    processing: notifProcessing,
  } = useForm({
    group: 'notifications',
    notify_new_order: settings.notify_new_order === '1' || settings.notify_new_order === true,
    notify_low_stock: settings.notify_low_stock === '1' || settings.notify_low_stock === true,
    notify_payment_failed:
      settings.notify_payment_failed === '1' || settings.notify_payment_failed === true,
    notify_customer_review:
      settings.notify_customer_review === '1' || settings.notify_customer_review === true,
    notify_customer_message:
      settings.notify_customer_message === '1' || settings.notify_customer_message === true,
    notification_email: settings.notification_email || '',
  });

  const submitGeneral = (e) => {
    e.preventDefault();
    postGeneral('/admin/settings');
  };

  const submitPayment = (e) => {
    e.preventDefault();
    postPayment('/admin/settings');
  };

  const submitNotif = (e) => {
    e.preventDefault();
    postNotif('/admin/settings');
  };

  const tabs = [
    { key: 'general', label: 'Général', icon: Globe },
    { key: 'payment', label: 'Paiement', icon: DollarSign },
    { key: 'notifications', label: 'Alertes', icon: Bell },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 pb-20">
        <PageHeader
          title="Configuration Système"
          subtitle="Gérez les paramètres globaux de votre boutique DMC Computer"
        />

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-100 overflow-x-auto bg-white px-6 rounded-t-3xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-forest-green text-forest-green'
                    : 'border-transparent text-gray-400 hover:text-gray-900'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <form onSubmit={submitGeneral} className="space-y-6">
              <Section title="Identité & Contact" icon={Globe}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Nom commercial"
                    value={generalData.store_name}
                    onChange={(e) => setGeneralData('store_name', e.target.value)}
                    placeholder="DMC Computer"
                  />
                  <FormField
                    label="Email de contact client"
                    type="email"
                    value={generalData.support_email}
                    onChange={(e) => setGeneralData('support_email', e.target.value)}
                    placeholder="support@dmcomputer.sn"
                  />
                </div>
                <div className="mt-6">
                  <FormField
                    label="Description SEO du site"
                    type="textarea"
                    value={generalData.store_description}
                    onChange={(e) => setGeneralData('store_description', e.target.value)}
                    rows={3}
                    placeholder="Expert en informatique à Dakar..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <FormField
                    label="Téléphone"
                    value={generalData.phone}
                    onChange={(e) => setGeneralData('phone', e.target.value)}
                    placeholder="+221 77 236 77 77"
                  />
                  <FormField
                    label="Adresse physique"
                    value={generalData.address}
                    onChange={(e) => setGeneralData('address', e.target.value)}
                    placeholder="Dakar, Sénégal"
                  />
                </div>
              </Section>

              <Section title="Maintenance et Accès" icon={Lock}>
                <FormField
                  type="checkbox"
                  label="Activer le Mode Maintenance (Site inaccessible aux clients)"
                  value={generalData.maintenance_mode}
                  onChange={(e) => setGeneralData('maintenance_mode', e.target.checked)}
                />
              </Section>

              <Section title="Réseaux Sociaux" icon={Globe}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Facebook"
                    value={generalData.facebook_url}
                    onChange={(e) => setGeneralData('facebook_url', e.target.value)}
                    placeholder="https://..."
                  />
                  <FormField
                    label="Instagram"
                    value={generalData.instagram_url}
                    onChange={(e) => setGeneralData('instagram_url', e.target.value)}
                    placeholder="https://..."
                  />
                  <FormField
                    label="Twitter (X)"
                    value={generalData.twitter_url}
                    onChange={(e) => setGeneralData('twitter_url', e.target.value)}
                    placeholder="https://..."
                  />
                  <FormField
                    label="LinkedIn"
                    value={generalData.linkedin_url}
                    onChange={(e) => setGeneralData('linkedin_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </Section>

              <div className="flex justify-end p-6 bg-white rounded-3xl shadow-sm">
                <button
                  disabled={generalProcessing}
                  className="flex items-center gap-2 px-8 py-4 bg-forest-green text-white rounded-xl hover:bg-dark-green transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-forest-green/20"
                >
                  <Save size={16} />{' '}
                  {generalProcessing ? 'Enregistrement...' : 'Sauvegarder les réglages'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payment' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <form onSubmit={submitPayment} className="space-y-6">
              <Section title="Méthodes de Paiement" icon={DollarSign}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'payment_stripe', label: 'Stripe (Cartes Bancaires)' },
                    { key: 'payment_paypal', label: 'PayPal Checkout' },
                    { key: 'payment_bank_transfer', label: 'Virement Bancaire (Manuel)' },
                    { key: 'payment_cod', label: 'Paiement à la livraison' },
                  ].map((method) => (
                    <label
                      key={method.key}
                      className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all"
                    >
                      <span className="font-bold text-sm text-gray-700">{method.label}</span>
                      <input
                        type="checkbox"
                        checked={paymentData[method.key]}
                        onChange={(e) => setPaymentData(method.key, e.target.checked)}
                        className="w-5 h-5 border-gray-200 rounded text-forest-green focus:ring-forest-green"
                      />
                    </label>
                  ))}
                </div>
              </Section>

              <Section title="Configuration API">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Clé Publique Stripe"
                    value={paymentData.stripe_key}
                    onChange={(e) => setPaymentData('stripe_key', e.target.value)}
                    placeholder="pk_test_..."
                  />
                  <FormField
                    label="PayPal Client ID"
                    value={paymentData.paypal_client_id}
                    onChange={(e) => setPaymentData('paypal_client_id', e.target.value)}
                    placeholder="Axxxxxxxxxxxx"
                  />
                </div>
              </Section>

              <div className="flex justify-end p-6 bg-white rounded-3xl shadow-sm">
                <button
                  disabled={paymentProcessing}
                  className="flex items-center gap-2 px-8 py-4 bg-forest-green text-white rounded-xl hover:bg-dark-green transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-forest-green/20"
                >
                  <Save size={16} />{' '}
                  {paymentProcessing ? 'Enregistrement...' : 'Mettre à jour les paiements'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <form onSubmit={submitNotif} className="space-y-6">
              <Section title="Préférences des Alertes" icon={Bell}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'notify_new_order', label: 'Nouvelles Commandes' },
                    { key: 'notify_low_stock', label: 'Alertes Stocks Critiques' },
                    { key: 'notify_customer_message', label: 'Messages Clients' },
                    { key: 'notify_customer_review', label: 'Modération des Avis' },
                  ].map((notif) => (
                    <label
                      key={notif.key}
                      className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all"
                    >
                      <span className="font-bold text-sm text-gray-700">{notif.label}</span>
                      <input
                        type="checkbox"
                        checked={notifData[notif.key]}
                        onChange={(e) => setNotifData(notif.key, e.target.checked)}
                        className="w-5 h-5 border-gray-200 rounded text-forest-green focus:ring-forest-green"
                      />
                    </label>
                  ))}
                </div>
                <div className="mt-10 border-t border-gray-50 pt-8 max-w-lg">
                  <FormField
                    label="Email de réception"
                    type="email"
                    value={notifData.notification_email}
                    onChange={(e) => setNotifData('notification_email', e.target.value)}
                    placeholder="admin@dmcomputer.sn"
                  />
                  <p className="text-[10px] text-gray-400 font-bold mt-4 italic uppercase tracking-wider">
                    Note: Tous les rapports quotidiens seront envoyés à cette adresse.
                  </p>
                </div>
              </Section>

              <div className="flex justify-end p-6 bg-white rounded-3xl shadow-sm">
                <button
                  disabled={notifProcessing}
                  className="flex items-center gap-2 px-8 py-4 bg-forest-green text-white rounded-xl hover:bg-dark-green transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-forest-green/20"
                >
                  <Save size={16} />{' '}
                  {notifProcessing ? 'Enregistrement...' : 'Sauvegarder les alertes'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
