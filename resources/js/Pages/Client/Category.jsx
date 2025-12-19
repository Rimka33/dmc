import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';

function ProductCard({ product }) {
    return (
        <Link to={`/produit/${product.id}`} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
                <img
                    src={product.primary_image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.is_on_sale && (
                        <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg">
                            SOLDE
                        </span>
                    )}
                    {product.is_new && (
                        <span className="px-3 py-1 bg-neon-green text-black text-[10px] font-black uppercase rounded-full shadow-lg">
                            NOUVEAU
                        </span>
                    )}
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-200'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1">({product.review_count || 0})</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-forest-green transition-colors">
                    {product.name}
                </h3>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-forest-green">
                            {product.price_formatted}
                        </span>
                        {product.is_on_sale && (
                            <span className="text-xs text-gray-400 line-through">
                                {product.old_price_formatted}
                            </span>
                        )}
                    </div>
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white group-hover:bg-forest-green transition-colors shadow-lg">
                        <i className="icon-cart-plus text-lg"></i>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function Category() {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchCategoryData();
        fetchCategories();
    }, [slug, page]);

    const fetchCategoryData = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/categories/${slug}?page=${page}`);
            setCategory(response.data.data);
            setProducts(response.data.data.products || []);
            setMeta(response.data.meta);
        } catch (error) {
            console.error('Error fetching category data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setAllCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    if (loading && !category) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-forest-green"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* Hero Banner */}
            <div className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, rgba(1, 26, 10, 0.9), rgba(1, 26, 10, 0.8)), url(/images/category-bg.jpg) center/cover' }}>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-black text-neon-green uppercase mb-6 tracking-tighter italic">
                        {category?.name}
                    </h1>
                    <div className="flex items-center justify-center gap-3 text-white text-sm font-bold tracking-widest uppercase bg-white/5 py-3 px-6 rounded-full inline-flex border border-white/10">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <span className="text-gray-500">/</span>
                        <Link to="/shop" className="hover:text-neon-green transition-colors">Boutique</Link>
                        <span className="text-gray-500">/</span>
                        <span className="text-neon-green">{category?.name}</span>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-forest-green/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
            </div>

            {/* Sub-categories Navigation */}
            <section className="py-12 bg-gray-50 border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-8 overflow-x-auto pb-4 no-scrollbar">
                        {allCategories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/categorie/${cat.slug}`}
                                className={`flex flex-col items-center min-w-[100px] group transition-all ${cat.slug === slug ? 'scale-110' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 shadow-lg ${cat.slug === slug ? 'bg-neon-green text-black rotate-3' : 'bg-white group-hover:bg-neon-green group-hover:rotate-3'}`}>
                                    <img src={cat.icon || '/images/icons/default.svg'} alt={cat.name} className="w-8 h-8 object-contain" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest text-center ${cat.slug === slug ? 'text-forest-green' : 'text-gray-500 group-hover:text-forest-green'}`}>
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">
                                Explorer <span className="text-forest-green">{category?.name}</span>
                            </h2>
                            <p className="text-gray-500 font-medium">Affichage de {products.length} sur {meta?.total || products.length} produits</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <select className="px-6 py-3 bg-gray-100 border-none rounded-xl font-bold text-xs uppercase tracking-wider focus:ring-2 focus:ring-neon-green">
                                <option>Tri par défaut</option>
                                <option>Les plus récents</option>
                                <option>Prix: Croissant</option>
                                <option>Prix: Décroissant</option>
                                <option>Mieux notés</option>
                            </select>
                        </div>
                    </div>

                    {/* Category Description Tag */}
                    {category?.description && (
                        <div className="bg-forest-green/5 border-l-4 border-forest-green p-6 rounded-r-2xl mb-12 italic text-gray-700 leading-relaxed max-w-4xl">
                            {category.description}
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center">
                                <i className="icon-search text-6xl text-gray-200 mb-6 block"></i>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
                                <p className="text-gray-500 mb-8 font-medium">Nous n'avons pas encore de produits dans cette catégorie.</p>
                                <Link to="/shop" className="px-8 py-4 bg-gray-900 text-white font-bold uppercase rounded-xl hover:bg-black transition-all">
                                    Voir toute la boutique
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {meta?.last_page > 1 && (
                        <div className="mt-20 flex items-center justify-center gap-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-gray-100 hover:border-forest-green hover:bg-forest-green hover:text-white transition-all disabled:opacity-30"
                            >
                                <i className="icon-chevron-left text-xl"></i>
                            </button>

                            {[...Array(meta.last_page)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-14 h-14 flex items-center justify-center rounded-2xl font-black text-lg transition-all ${page === i + 1 ? 'bg-forest-green text-white shadow-xl shadow-forest-green/30 scale-110' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                disabled={page === meta.last_page}
                                className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-gray-100 hover:border-forest-green hover:bg-forest-green hover:text-white transition-all disabled:opacity-30"
                            >
                                <i className="icon-chevron-right text-xl"></i>
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
