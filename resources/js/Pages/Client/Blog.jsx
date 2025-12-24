import React, { useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag, Clock } from 'lucide-react';

export default function Blog() {
    // Mock Data for Blog Posts
    const posts = [
        {
            id: 1,
            title: "Comment choisir sa carte graphique en 2025 ?",
            excerpt: "Nvidia RTX 5000, AMD RDNA 4... Le marché des GPU évolue vite. Voici notre guide complet pour faire le bon choix selon vos besoins et votre budget.",
            image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop",
            category: "Guide Hardware",
            author: "Jean Tech",
            date: "24 Déc 2024",
            readTime: "5 min",
            slug: "choisir-carte-graphique-2025"
        },
        {
            id: 2,
            title: "Les meilleures configurations PC Gamer à moins de 1000€",
            excerpt: "Pas besoin de se ruiner pour jouer en 1080p Ultra. Découvrez notre sélection de composants pour monter une bête de course sans casser la tirelire.",
            image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2070&auto=format&fit=crop",
            category: "Configs PC",
            author: "Alex Gamer",
            date: "22 Déc 2024",
            readTime: "8 min",
            slug: "config-pc-gamer-1000-euros"
        },
        {
            id: 3,
            title: "Maintenance PC : 5 astuces pour booster les performances",
            excerpt: "Votre PC ralentit ? Avant de penser à tout changer, suivez ces 5 étapes simples de nettoyage logiciel et matériel pour retrouver de la fluidité.",
            image: "https://images.unsplash.com/photo-1597872252721-240bc289146c?q=80&w=2070&auto=format&fit=crop",
            category: "Tutoriel",
            author: "Sarah Fix",
            date: "18 Déc 2024",
            readTime: "4 min",
            slug: "maintenance-pc-booster-performances"
        },
        {
            id: 4,
            title: "L'essor de l'IA dans les composants PC grand public",
            excerpt: "De l'upscaling vidéo à la génération d'images en local, les NPU débarquent dans nos processeurs. Qu'est-ce que ça change vraiment ?",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
            category: "Technologie",
            author: "Marc IA",
            date: "15 Déc 2024",
            readTime: "6 min",
            slug: "ia-composants-pc"
        }
    ];

    const [activeCategory, setActiveCategory] = useState('Tous');
    const categories = ['Tous', 'Guide Hardware', 'Configs PC', 'Tutoriel', 'Technologie'];

    const filteredPosts = activeCategory === 'Tous'
        ? posts
        : posts.filter(post => post.category === activeCategory);

    return (
        <MainLayout>
            {/* Hero Section */}
            <div className="relative h-56 md:h-64 bg-black overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    <img
                        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
                        alt="Blog Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>

                <div className="relative z-10 text-center container mx-auto px-4">
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-2xl italic">
                        LE <span className="text-neon-green">BLOG</span>
                    </h1>
                    <nav className="flex items-center justify-center gap-2 text-white/90 font-black text-[10px] uppercase tracking-[0.3em]">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <span className="text-neon-green">//</span>
                        <span className="text-white opacity-50">Actualités & Guides</span>
                    </nav>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-16 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 max-w-7xl">

                    {/* Categories Filter */}
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat
                                    ? 'bg-forest-green text-white shadow-lg shadow-forest-green/20 scale-105'
                                    : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <article key={post.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 border border-gray-100 flex flex-col h-full">
                                {/* Image Container */}
                                <div className="h-56 overflow-hidden relative">
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="px-3 py-1.5 bg-black/80 backdrop-blur-md text-neon-green text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10">
                                            {post.category}
                                        </span>
                                    </div>
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-bold">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {post.date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {post.readTime}
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-black text-gray-900 mb-3 leading-tight group-hover:text-forest-green transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-900">{post.author}</span>
                                        </div>

                                        <button className="w-10 h-10 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-forest-green group-hover:border-forest-green group-hover:text-white transition-all duration-300">
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredPosts.length === 0 && (
                        <div className="text-center py-24">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                                <Tag className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Aucun article trouvé</h3>
                            <p className="text-gray-500">Désolé, aucun article ne correspond à cette catégorie pour le moment.</p>
                            <button
                                onClick={() => setActiveCategory('Tous')}
                                className="mt-6 text-forest-green font-bold hover:underline"
                            >
                                Voir tous les articles
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
