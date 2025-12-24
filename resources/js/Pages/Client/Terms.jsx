import React, { useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, RefreshCw, FileText, ChevronRight } from 'lucide-react';

export default function Terms() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            icon: <FileText className="w-8 h-8 text-forest-green" />,
            title: "1. Présentation du site",
            content: "Le site Daroul Mouhty Computer (DMC) est une plateforme de commerce électronique spécialisée dans la vente de matériel informatique. En accédant à ce site, vous acceptez les présentes conditions générales d'utilisation."
        },
        {
            icon: <CreditCard className="w-8 h-8 text-forest-green" />,
            title: "2. Prix et Paiement",
            content: "Les prix de nos produits sont indiqués en Francs CFA (FCFA) toutes taxes comprises. DMC se réserve le droit de modifier ses prix à tout moment. Les produits sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande."
        },
        {
            icon: <Truck className="w-8 h-8 text-forest-green" />,
            title: "3. Livraison et Récupération",
            content: "Nous proposons deux modes d'obtention : la livraison à domicile (avec frais supplémentaires selon la zone) et la récupération gratuite dans notre showroom à Dakar. Les délais de livraison sont donnés à titre indicatif."
        },
        {
            icon: <RefreshCw className="w-8 h-8 text-forest-green" />,
            title: "4. Droit de rétractation",
            content: "Conformément à la législation en vigueur, vous disposez d'un délai pour retourner un produit qui ne vous satisferait pas. Le produit doit être retourné dans son emballage d'origine, complet et en parfait état de revente."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-forest-green" />,
            title: "5. Garantie et SAV",
            content: "Tous nos produits bénéficient d'une garantie constructeur ou d'une garantie DMC. En cas de panne ou de défaut, notre service après-vente est à votre disposition dans notre showroom."
        }
    ];

    return (
        <MainLayout>
            {/* Hero Header */}
            <div className="relative h-[300px] bg-[#021008] overflow-hidden flex items-center">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="/images/back.jpg"
                        alt="background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-black text-white uppercase mb-4 leading-tight">
                            Termes & <span className="text-neon-green">Conditions</span>
                        </h1>
                        <nav className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
                            <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-neon-green">Conditions Générales</span>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-black text-gray-900 uppercase mb-4">Conditions Générales de Vente</h2>
                            <p className="text-gray-500 font-medium italic">Dernière mise à jour : 24 Décembre 2025</p>
                        </div>

                        <div className="grid gap-12">
                            {sections.map((section, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-6 p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-forest-green/30 transition-all duration-300 group">
                                    <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                        {section.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 uppercase mb-3 tracking-tight">
                                            {section.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed font-medium">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 p-8 rounded-2xl bg-forest-green text-white">
                            <h3 className="text-2xl font-black uppercase mb-4">Vous avez des questions ?</h3>
                            <p className="font-medium opacity-90 mb-6">
                                Notre équipe est à votre disposition pour vous éclairer sur nos conditions ou pour toute autre demande concernant vos achats chez DMC.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-forest-green font-black uppercase rounded-xl hover:bg-neon-green hover:text-black transition-all"
                            >
                                Contactez-nous
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
