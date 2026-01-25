import React, { useEffect, useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function PrivacyPolicy() {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPage();
    }, []);

    const fetchPage = async () => {
        try {
            const response = await axios.get('/api/pages/privacy-policy');
            setPage(response.data.data);
        } catch (error) {
            console.error("Erreur lors du chargement de la politique de confidentialité:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="relative h-[200px] bg-[#021008] overflow-hidden flex items-center">
                <div className="absolute inset-0 opacity-20">
                    <img src="/images/back.jpg" alt="background" className="w-full h-full object-cover" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-2xl md:text-3xl font-black text-white uppercase mb-4 leading-tight">
                        Politique de <span className="text-neon-green">Confidentialité</span>
                    </h1>
                    <nav className="flex items-center justify-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-neon-green">Confidentialité</span>
                    </nav>
                </div>
            </div>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Chargement...</p>
                        </div>
                    ) : page ? (
                        <div className="prose prose-sm max-w-none">
                            <div className="mb-12">
                                <h2 className="text-xl font-black text-gray-900 uppercase mb-4 tracking-tighter">{page.title}</h2>
                                {page.updated_at && (
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest italic border-b border-gray-100 pb-4">
                                        Dernière mise à jour : {new Date(page.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                )}
                            </div>

                            <div
                                className="text-gray-600 font-medium leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />

                            <div className="mt-12 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                                <h3 className="text-lg font-black text-gray-900 uppercase mb-4">Vos droits</h3>
                                <p className="text-gray-600 font-medium leading-relaxed mb-6 italic text-sm">
                                    Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ce droit à tout moment depuis votre espace client ou en nous contactant.
                                </p>
                                <Link to="/mon-compte" className="text-forest-green font-black uppercase text-[10px] tracking-widest hover:text-neon-green transition-colors flex items-center gap-2">
                                    Gérer mon profil <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h2 className="text-xl font-black text-gray-900 uppercase mb-4 tracking-tighter">Information non disponible</h2>
                            <p className="text-gray-500 mb-8">Désolé, cette page n'est pas accessible pour le moment.</p>
                            <Link to="/" className="px-8 py-4 bg-forest-green text-white font-black uppercase rounded-sm hover:bg-dark-green transition-all">
                                Retour à l'accueil
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
