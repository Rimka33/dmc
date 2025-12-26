import React, { useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import { RefreshCw, Package, CheckCircle, CreditCard, Clock, ChevronRight } from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';

export default function Returns() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const policies = [
        {
            icon: <Clock className="w-8 h-8 text-forest-green" />,
            title: "Délai de retour",
            content: "Vous disposez de 48 heures après la réception de votre colis ou le retrait en magasin pour signaler un problème technique ou un défaut de fabrication."
        },
        {
            icon: <Package className="w-8 h-8 text-forest-green" />,
            title: "État du produit",
            content: "Le matériel doit être retourné dans son emballage d'origine, avec tous ses accessoires, manuels et sans aucune trace d'utilisation abusive."
        },
        {
            icon: <CheckCircle className="w-8 h-8 text-forest-green" />,
            title: "Vérification technique",
            content: "Tout produit retourné fera l'objet d'une expertise par nos techniciens avant validation du remboursement ou de l'échange."
        },
        {
            icon: <CreditCard className="w-8 h-8 text-forest-green" />,
            title: "Mode de remboursement",
            content: "Le remboursement s'effectue via le mode de paiement initial (Wave, Orange Money ou Espèces) dans un délai de 3 à 5 jours ouvrés."
        }
    ];

    return (
        <MainLayout>
            <div className="relative h-[300px] bg-[#021008] overflow-hidden flex items-center">
                <div className="absolute inset-0 opacity-20">
                    <ShimmerImage src="/images/back.jpg" alt="background" className="w-full h-full object-cover" fallback={'/images/back.jpg'} />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase mb-4 leading-tight">
                        Retours & <span className="text-neon-green">Remboursements</span>
                    </h1>
                    <nav className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-neon-green">Politique de retour</span>
                    </nav>
                </div>
            </div>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="grid gap-8 mb-16">
                        {policies.map((item, index) => (
                            <div key={index} className="flex gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 items-start">
                                <div className="p-4 bg-white rounded-xl shadow-sm flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase mb-2">{item.title}</h3>
                                    <p className="text-gray-600 font-medium leading-relaxed">{item.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 rounded-2xl bg-forest-green text-white text-center">
                        <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-2xl font-black uppercase mb-4">Besoin d'initier un retour ?</h3>
                        <p className="font-medium opacity-90 mb-8 max-w-xl mx-auto">
                            Contactez notre service client par téléphone au +221 77 236 77 77 ou rendez-vous directement dans notre showroom avec votre facture.
                        </p>
                        <Link to="/contact" className="inline-block px-8 py-4 bg-white text-forest-green font-black uppercase rounded-xl hover:bg-neon-green hover:text-black transition-all">
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
