import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { router, Link } from '@inertiajs/react';
import PageHeader from '../../../Components/Admin/PageHeader';
import Section from '../../../Components/Admin/Section';
import FormField from '../../../Components/Admin/FormField';
import { ArrowLeft, Mail, CheckCircle, Archive, Save } from 'lucide-react';

export default function Show({ message }) {
    const [formData, setFormData] = useState({
        status: message.status || 'new',
        admin_notes: message.admin_notes || '',
        reply: message.reply || '',
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        router.put(`/admin/messages/${message.id}`, formData, {
            onSuccess: () => {
                setLoading(false);
            },
            onFinish: () => setLoading(false)
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Détails du Message"
                    subtitle={message.subject || 'Sans sujet'}
                    breadcrumbs={['Messages', 'Détails']}
                    action={
                        <Link
                            href="/admin/messages"
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold shadow-sm"
                        >
                            <ArrowLeft size={18} />
                            Retour
                        </Link>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Section title="Message">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Sujet</p>
                                    <p className="font-bold text-gray-900 text-lg">{message.subject || 'Sans sujet'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Message</p>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title="Gestion">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <FormField
                                    label="Statut"
                                    name="status"
                                    type="select"
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                    options={[
                                        { label: 'Nouveau', value: 'new' },
                                        { label: 'Lu', value: 'read' },
                                        { label: 'Répondu', value: 'replied' },
                                        { label: 'Archivé', value: 'archived' },
                                    ]}
                                />

                                <FormField
                                    label="Notes Admin"
                                    name="admin_notes"
                                    type="textarea"
                                    value={formData.admin_notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                                    rows={3}
                                    placeholder="Notes internes sur ce message..."
                                />

                                <FormField
                                    label="Réponse au client (visible par le client)"
                                    name="reply"
                                    type="textarea"
                                    value={formData.reply}
                                    onChange={(e) => setFormData(prev => ({ ...prev, reply: e.target.value }))}
                                    rows={4}
                                    placeholder="Écrivez votre réponse ici..."
                                />

                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-3 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                    <Link
                                        href="/admin/messages"
                                        className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold"
                                    >
                                        <ArrowLeft size={18} />
                                        Retour
                                    </Link>
                                </div>
                            </form>
                        </Section>
                    </div>

                    <div className="space-y-6">
                        <Section title="Informations Expéditeur">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Nom</p>
                                    <p className="font-bold text-gray-900">{message.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                    <a href={`mailto:${message.email}`} className="text-forest-green hover:underline">
                                        {message.email}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Date</p>
                                    <p className="text-gray-700">{new Date(message.created_at).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Statut</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${message.status === 'new' ? 'bg-blue-50 text-blue-600' :
                                        message.status === 'read' ? 'bg-gray-50 text-gray-600' :
                                            message.status === 'replied' ? 'bg-green-50 text-green-600' :
                                                'bg-yellow-50 text-yellow-600'
                                        }`}>
                                        {message.status === 'new' ? '🆕 Nouveau' :
                                            message.status === 'read' ? '📖 Lu' :
                                                message.status === 'replied' ? '✓ Répondu' :
                                                    '📦 Archivé'}
                                    </span>
                                </div>
                            </div>
                        </Section>

                        <Section title="Actions Rapides">
                            <div className="space-y-2">
                                {message.status === 'new' && (
                                    <button
                                        onClick={() => {
                                            router.post(`/admin/messages/${message.id}/mark-as-read`, {}, {
                                                onSuccess: () => router.reload()
                                            });
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-bold"
                                    >
                                        <CheckCircle size={18} />
                                        Marquer comme lu
                                    </button>
                                )}
                                {message.status !== 'replied' && (
                                    <button
                                        onClick={() => {
                                            router.post(`/admin/messages/${message.id}/mark-as-replied`, {}, {
                                                onSuccess: () => router.reload()
                                            });
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-bold"
                                    >
                                        <CheckCircle size={18} />
                                        Marquer comme répondu
                                    </button>
                                )}
                                {message.status !== 'archived' && (
                                    <button
                                        onClick={() => {
                                            router.post(`/admin/messages/${message.id}/archive`, {}, {
                                                onSuccess: () => router.reload()
                                            });
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-bold"
                                    >
                                        <Archive size={18} />
                                        Archiver
                                    </button>
                                )}
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

