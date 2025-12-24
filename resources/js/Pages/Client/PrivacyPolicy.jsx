import React, { useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, FileCheck, ChevronRight } from 'lucide-react';

export default function PrivacyPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <MainLayout>
            <div className="relative h-[300px] bg-[#021008] overflow-hidden flex items-center">
                <div className="absolute inset-0 opacity-20">
                    <img src="/images/back.jpg" alt="background" className="w-full h-full object-cover" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase mb-4 leading-tight">
                        Politique de <span className="text-neon-green">Confidentialité</span>
                    </h1>
                    <nav className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-neon-green">Confidentialité</span>
                    </nav>
                </div>
            </div>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="prose prose-lg max-w-none">
                        <div className="flex items-center gap-4 mb-8">
                            <Shield className="w-12 h-12 text-forest-green" />
                            <h2 className="text-3xl font-black text-gray-900 uppercase m-0">Protection de vos données</h2>
                        </div>

                        <div className="space-y-12">
                            <section>
                                <h3 className="text-xl font-black text-gray-900 border-l-4 border-neon-green pl-4 uppercase tracking-tight">1. Collecte des données</h3>
                                <p className="text-gray-600 font-medium leading-relaxed mt-4">
                                    Nous collectons les informations que vous nous fournissez lors de la création d'un compte, d'un achat ou de l'inscription à notre newsletter (Nom, email, numéro de téléphone, adresse). Ces données sont indispensables pour traiter vos commandes.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-black text-gray-900 border-l-4 border-neon-green pl-4 uppercase tracking-tight">2. Utilisation des informations</h3>
                                <div className="grid md:grid-cols-2 gap-4 mt-6">
                                    <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                                        <Lock className="w-5 h-5 text-forest-green" />
                                        <span className="text-sm font-bold text-gray-700">Traitement sécurisé des commandes</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                                        <Eye className="w-5 h-5 text-forest-green" />
                                        <span className="text-sm font-bold text-gray-700">Amélioration de votre expérience</span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-black text-gray-900 border-l-4 border-neon-green pl-4 uppercase tracking-tight">3. Protection des données</h3>
                                <p className="text-gray-600 font-medium leading-relaxed mt-4">
                                    DMC met en œuvre toutes les mesures de sécurité nécessaires (cryptage SSL, accès restreints) pour protéger vos données personnelles contre tout accès non autorisé.
                                </p>
                            </section>

                            <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <FileCheck className="w-6 h-6 text-forest-green" />
                                    <h3 className="text-xl font-black text-gray-900 uppercase m-0">Vos droits</h3>
                                </div>
                                <p className="text-gray-600 font-medium leading-relaxed mb-6">
                                    Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ce droit à tout moment depuis votre espace client ou en nous contactant.
                                </p>
                                <Link to="/mon-compte" className="text-forest-green font-black uppercase text-sm hover:text-neon-green transition-colors flex items-center gap-2">
                                    Gérer mon profil <ChevronRight className="w-4 h-4" />
                                </Link>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
