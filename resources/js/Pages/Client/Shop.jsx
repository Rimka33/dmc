import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { WishlistContext } from '../../contexts/WishlistContext';
import {
    Grid,
    List,
    Search,
    ChevronLeft,
    ChevronRight,
    Star,
    SlidersHorizontal,
    LayoutGrid,
    Check,
    Heart,
    ChevronDown
} from 'lucide-react';

const StarRating = ({ rating, count }) => (
    <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-2.5 h-2.5 ${i < Math.floor(rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
            />
        ))}
        <span className="text-[9px] text-gray-400 ml-1">({count || 0})</span>
    </div>
);

function ProductCard({ product, viewMode = 'grid' }) {
    const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

    if (viewMode === 'list') {
        return (
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex gap-6 p-5 relative">
                <Link to={`/produit/${product.id}`} className="flex-shrink-0">
                    <div className="relative w-56 aspect-square overflow-hidden bg-white rounded-2xl flex-shrink-0">
                        <img
                            src={product.primary_image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                        />
                        {product.is_on_sale && (
                            <span className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg">
                                SOLDE
                            </span>
                        )}
                    </div>
                </Link>
                <div className="flex flex-col py-2 flex-grow text-left">
                    <Link to={`/produit/${product.id}`} className="group">
                        <div className="mb-1">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                {product.category_name}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-forest-green transition-colors leading-tight">
                            {product.name}
                        </h3>
                    </Link>
                    <StarRating rating={product.rating} count={product.review_count} />
                    <div className="text-gray-500 text-sm font-medium line-clamp-2 mb-6 max-w-2xl leading-relaxed">
                        {product.description || "Découvrez ce produit exceptionnel de haute qualité chez DMC SARL."}
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-black text-forest-green">
                                {product.price_formatted}
                            </span>
                            {product.has_discount && (
                                <span className="text-sm text-gray-400 line-through font-bold">
                                    {product.old_price_formatted}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleWishlist(product);
                                }}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}
                            >
                                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
                            </button>
                            <Link to={`/produit/${product.id}`} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-forest-green transition-all">
                                VOIR DETAILS
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative bg-white flex flex-col h-full transition-all border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl duration-300">
            {/* Image Container */}
            <Link to={`/produit/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-50 mb-2 block overflow-hidden">
                <img
                    src={product.primary_image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-6 mix-blend-multiply"
                />

                {product.is_on_sale && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-[9px] font-black uppercase rounded shadow-lg z-10">
                        SOLDE
                    </span>
                )}
            </Link>

            {/* Content Container */}
            <div className="flex flex-col flex-grow text-left px-4 pb-4">
                <div className="mb-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none line-clamp-1">
                        {product.category_name}
                    </span>
                </div>

                <Link to={`/produit/${product.id}`} className="block mb-1.5 group-hover:text-forest-green transition-colors">
                    <h3 className="text-[13px] font-bold text-gray-800 line-clamp-2 min-h-[2.5em] leading-snug">
                        {product.name}
                    </h3>
                </Link>

                <StarRating rating={product.rating} count={product.review_count} />

                <div className="mt-auto flex items-baseline gap-2 pt-2 border-t border-gray-50">
                    <span className="text-[15px] font-black text-forest-green">
                        {product.price_formatted}
                    </span>
                    {product.has_discount && (
                        <span className="text-[11px] text-gray-400 line-through font-bold">
                            {product.old_price_formatted}
                        </span>
                    )}
                </div>
            </div>

            {/* Wishlist Button Overlay */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                }}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 hover:scale-110"
            >
                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : ''}`} />
            </button>
        </div>
    );
}

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') || null);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        const querySearch = searchParams.get('search');
        if (querySearch !== null) {
            setSearch(querySearch);
            setCurrentPage(1);
        }

        const catId = searchParams.get('category_id');
        if (catId) {
            setSelectedCategory(catId);
        }
    }, [searchParams]);

    const fetchProducts = async (page = 1, append = false) => {
        try {
            if (append) setLoadingMore(true);
            else setLoading(true);

            const params = {
                page: page,
                per_page: 12,
                sort_by: sortBy,
                sort_order: sortOrder,
            };

            if (selectedCategory) params.category_id = selectedCategory;
            if (search) params.search = search;

            const response = await api.get('/products', { params });

            if (append) {
                setProducts(prev => [...prev, ...(response.data.data || [])]);
            } else {
                setProducts(response.data.data || []);
            }

            setPagination(response.data.meta || {});
            setCurrentPage(page);
        } catch (error) {
            console.error('Erreur lors du chargement des produits', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des catégories', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts(1, false);
    }, [selectedCategory, sortBy, sortOrder, search]);

    const handleLoadMore = () => {
        if (currentPage < pagination.last_page) {
            fetchProducts(currentPage + 1, true);
        }
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        const newParams = new URLSearchParams(searchParams);
        if (categoryId) newParams.set('category_id', categoryId);
        else newParams.delete('category_id');
        setSearchParams(newParams);
    };

    const handleSort = (value) => {
        if (value === 'price-asc') {
            setSortBy('price'); setSortOrder('asc');
        } else if (value === 'price-desc') {
            setSortBy('price'); setSortOrder('desc');
        } else if (value === 'newest') {
            setSortBy('created_at'); setSortOrder('desc');
        } else {
            setSortBy('created_at'); setSortOrder('desc');
        }
    };

    return (
        <MainLayout>
            {/* Banner Section matching design */}
            <div className="relative h-[380px] bg-black overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="shop banner"
                        className="w-full h-full object-cover opacity-40 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
                </div>

                <div className="relative z-10 text-center space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-neon-green uppercase tracking-[0.25em] drop-shadow-[0_0_20px_rgba(85,255,0,0.3)]">
                        BOUTIQUE
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-white/70 text-[11px] font-black uppercase tracking-widest">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <span className="text-white/30 text-[8px] mx-1 opacity-50">—</span>
                        <span className="text-white">Boutique</span>
                    </div>
                </div>

                <div className="absolute right-10 bottom-10 hidden lg:block opacity-20 transform rotate-12 scale-150">
                    <LayoutGrid className="w-48 h-48 text-white" />
                </div>
            </div>

            {/* Main Catalogue Section */}
            <section className="bg-white py-12">
                <div className="container mx-auto px-4">

                    {/* Categories Row (Design Cards) */}
                    <div className="mb-16">
                        <div className="flex items-center gap-5 overflow-x-auto pb-8 pt-4 scrollbar-hide -mx-4 px-4">
                            <Link
                                to="/shop"
                                className={`flex-shrink-0 w-40 bg-white rounded-xl p-5 shadow-lg border-2 transition-all text-center group ${!selectedCategory ? 'border-neon-green scale-105 shadow-neon-green/5' : 'border-gray-50 hover:border-neon-green/30'}`}
                            >
                                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <LayoutGrid className="w-7 h-7 text-gray-400" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-tight text-gray-900 mb-1">Tous</h3>
                                <div className="text-[9px] font-bold text-gray-400 uppercase">Catalogue Complet</div>
                            </Link>

                            {categories?.map((category, index) => (
                                <Link
                                    key={index}
                                    to={`/categorie/${category.slug}`}
                                    className="flex-shrink-0 w-40 bg-white rounded-xl p-5 shadow-lg border-2 border-gray-50 hover:border-neon-green/30 transition-all text-center group"
                                >
                                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform overflow-hidden">
                                        <img
                                            src={category.icon || '/images/icons/default.svg'}
                                            alt={category.name}
                                            className="w-8 h-8 object-contain"
                                        />
                                    </div>
                                    <h3 className="text-[11px] font-black uppercase tracking-tight text-gray-900 mb-1 line-clamp-1">{category.name}</h3>
                                    <div className="text-[9px] font-bold text-gray-400 uppercase">{category.products_count || 0} Produits</div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Filter Header Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 border-b-2 border-forest-green pb-2">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">FILTRER PAR</h2>
                        </div>

                        {/* Top Filters Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Meilleures ventes', options: ['Par défaut'] },
                                { label: 'Prix', options: ['Par défaut', 'De - à +', 'De + à -'] },
                                { label: 'Par défaut', options: ['Par défaut', 'Nouveautés', 'Promos'] },
                                { label: 'Marque', options: ['Toute marque'] }
                            ].map((f, i) => (
                                <div key={i} className="relative group">
                                    <select
                                        className="w-full bg-gray-50 border-none rounded-lg px-4 py-3.5 text-xs font-black text-gray-700 uppercase tracking-wider appearance-none cursor-pointer focus:ring-1 focus:ring-forest-green transition-all"
                                        onChange={(e) => i === 1 ? handleSort(e.target.value === 'De - à +' ? 'price-asc' : 'price-desc') : null}
                                    >
                                        <option>{f.label}</option>
                                        {f.options.map(o => <option key={o}>{o}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-forest-green transition-colors" />
                                </div>
                            ))}
                        </div>

                        {/* View Mode Toolbar */}
                        <div className="flex items-center justify-between py-5 border-t border-b border-gray-100">
                            <div className="flex items-center gap-6">
                                <div className="flex p-1 bg-gray-50 rounded-lg shadow-inner">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-forest-green' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-forest-green' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex gap-1">
                                    <span>Affichage de</span>
                                    <span>{products.length}</span>
                                    <span>résultats sur</span>
                                    <span>{pagination.total || 0}</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-forest-green cursor-pointer transition-colors uppercase tracking-[0.15em] px-2">
                                <span>SORT PAR</span>
                                <ChevronDown className="w-3.5 h-3.5" />
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading && products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-forest-green"></div>
                            </div>
                        ) : (
                            <div className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 py-8'
                                    : 'flex flex-col gap-10 py-8'
                            }>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductCard key={product.id} product={product} viewMode={viewMode} />
                                    ))
                                ) : (
                                    <div className="col-span-full py-24 text-center">
                                        <Search className="w-12 h-12 text-gray-100 mx-auto mb-6" />
                                        <h3 className="text-lg font-black text-gray-900 mb-2 uppercase">Aucun produit trouvé</h3>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination Progress & Load More (Design Match) */}
                        {pagination.total > 0 && products.length < pagination.total && (
                            <div className="mt-20 flex flex-col items-center gap-8">
                                <div className="flex flex-col items-center gap-4 w-full max-w-[280px]">
                                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-forest-green rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(5,128,49,0.3)]"
                                            style={{ width: `${(products.length / pagination.total) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">
                                        Affichage de {products.length} sur {pagination.total} produits
                                    </div>
                                </div>
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="px-14 py-4 bg-gray-900 hover:bg-forest-green text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-forest-green/20 disabled:opacity-50 flex items-center gap-3"
                                >
                                    {loadingMore ? 'Chargement...' : 'Charger plus d\'articles'}
                                    {!loadingMore && <ChevronDown className="w-4 h-4" />}
                                </button>
                            </div>
                        )}

                        {/* Final Finish Message */}
                        {pagination.total > 0 && products.length >= pagination.total && !loading && (
                            <div className="mt-20 py-8 border-t border-gray-50 text-center">
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Vous avez parcouru tout le catalogue</div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
