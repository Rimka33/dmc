import React, { useEffect, useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import { RefreshCw, ChevronRight } from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';
import axios from 'axios';

export default function Returns() {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPage();
    }, []);

    const fetchPage = async () => {
        try {
            const response = await axios.get('/api/pages/returns');
            setPage(response.data.data);
        } catch (error) {
            console.error("Erreur lors du chargement de la politique de retour:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="relative h-[300px] bg-[#021008] overflow-hidden flex items-center">
                <div className="absolute inset-0 opacity-20">
                    <ShimmerImage src="/images/back.jpg" alt="background" className="w-full h-full object-cover" fallback={'/images/back.jpg'} />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-2xl md:text-3xl font-black text-white uppercase mb-4 leading-tight">
                        Retours & <span className="text-neon-green">Remboursements</span>
                    </h1>
                    <nav className="flex items-center justify-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-neon-green">Politique de retour</span>
                    </nav>
                </div>
            </div>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Chargement...</p>
                        </div>
                    ) : page ? (
                        <>
                            <div className="mb-12">
                                <h2 className="text-xl font-black text-gray-900 uppercase mb-4 tracking-tighter">{page.title}</h2>
                                {page.updated_at && (
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest italic border-b border-gray-100 pb-4">
                                        Dernière mise à jour : {new Date(page.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                )}
                            </div>

                            <div
                                className="text-gray-600 font-medium leading-relaxed mb-16"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <h2 className="text-xl font-black text-gray-900 uppercase mb-4 tracking-tighter">Information non disponible</h2>
                            <p className="text-gray-500 mb-8">Désolé, cette page n'est pas accessible pour le moment.</p>
                            <Link to="/" className="px-8 py-4 bg-forest-green text-white font-black uppercase rounded-sm hover:bg-dark-green transition-all">
                                Retour à l'accueil
                            </Link>
                        </div>
                    )}

                    <div className="p-8 rounded-2xl bg-forest-green text-white text-center">
                        <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-sm font-black uppercase mb-4">Besoin d'initier un retour ?</h3>
                        <p className="font-medium opacity-90 mb-8 max-w-xl mx-auto text-sm">
                            Contactez notre service client par téléphone au <span className="font-black">+221 77 236 77 77</span> ou rendez-vous directement dans notre showroom avec votre facture.
                        </p>
                        <Link to="/contact" className="inline-block px-8 py-4 bg-white text-forest-green font-black uppercase rounded-sm hover:bg-neon-green hover:text-black transition-all">
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
