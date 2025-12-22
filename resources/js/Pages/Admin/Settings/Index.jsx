import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Settings, Bell, Lock, Globe } from 'lucide-react';

export default function Index() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                    <p className="text-gray-500">Configuration générale de votre boutique.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Settings */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <Globe size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900">Général</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Informations sur la boutique, devise, langue...</p>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                            Configurer
                        </button>
                    </div>

                    {/* Security */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                                <Lock size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900">Sécurité</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Mots de passe, authentification à deux facteurs...</p>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                            Gérer
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center">
                                <Bell size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Emails, alertes de stock, nouvelles commandes...</p>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                            Modifier
                        </button>
                    </div>

                    {/* Other */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                                <Settings size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900">Avancé</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">API keys, webhooks, maintenance mode...</p>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                            Accéder
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
