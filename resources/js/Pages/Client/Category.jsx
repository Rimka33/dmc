import React, { useState, useEffect, useContext } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import { WishlistContext } from '../../contexts/WishlistContext';
import {
    Star,
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    LayoutGrid,
    ChevronDown,
    Heart,
    Tag,
    Grid,
    List,
    Check,
    RotateCcw
} from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';
import { resolveCategoryImage } from '../../utils/imageUtils';

// Product Card Component
function ProductCard({ product }) {
    const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

    return (
        <div className="group relative bg-white flex flex-col h-full transition-all border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl">
            <Link to={`/produit/${product.id}`} className="block relative aspect-square overflow-hidden bg-white mb-1">
                <ShimmerImage
                    src={product.primary_image || '/images/products/default.png'}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-3"
                    fallback={'/images/products/default.png'}
                />

                {product.is_on_sale && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-black uppercase rounded shadow-lg z-10">
                        SOLDE
                    </span>
                )}
            </Link>

            <div className="flex flex-col flex-grow text-left px-3 pb-3">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 leading-none">
                    {product.category_name}
                </span>
                <Link to={`/produit/${product.id}`} className="block group-hover:text-forest-green transition-colors">
                    <h3 className="text-[11px] font-bold text-gray-800 mb-1 line-clamp-2 min-h-[1.6rem] leading-snug">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-2.5 h-2.5 ${i < Math.floor(product.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                        />
                    ))}
                </div>

                <div className="mt-auto flex items-baseline gap-1.5">
                    <span className="text-[11px] font-black text-forest-green">
                        {product.price_formatted}
                    </span>
                    {product.has_discount && (
                        <span className="text-[9px] text-gray-400 line-through font-bold">
                            {product.old_price_formatted}
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const result = await toggleWishlist(product);
                    if (result && !result.success) {
                        alert(result.message);
                    }
                }}
                className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : ''}`} />
            </button>
        </div>
    );
}

const MIN_PRICE = 1000;
const MAX_PRICE = 5000000;
const PRICE_GAP = 50000;

const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        maximumFractionDigits: 0
    }).format(price).replace('XOF', '').trim() + ' FCFA';
};

export default function Category() {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [meta, setMeta] = useState({ total: 0, last_page: 1, current_page: 1 });
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState('grid');
    const [priceRange, setPriceRange] = useState({ min: MIN_PRICE, max: MAX_PRICE });
    const [selectedBrands, setSelectedBrands] = useState([]);

    const fetchCategoryData = async (pageNum = 1, append = false) => {
        if (append) setLoadingMore(true);
        else setLoading(true);

        try {
            const response = await api.get(`/categories/${slug}`, {
                params: {
                    page: pageNum,
                    per_page: 12,
                    min_price: priceRange.min,
                    max_price: priceRange.max,
                    brands: selectedBrands.join(',')
                }
            });
            const responseData = response.data;

            const catData = responseData.category?.data || responseData.category;
            const productList = responseData.products?.data || responseData.products || [];

            setCategory(catData);

            if (append) {
                setProducts(prev => [...prev, ...productList]);
            } else {
                setProducts(productList || []);
            }

            const total = responseData.meta?.total || responseData.total || productList.length;
            const lastPage = responseData.meta?.last_page || Math.ceil(total / 12);

            setMeta({
                total: total,
                last_page: Number(lastPage),
                current_page: pageNum
            });
            setPage(pageNum);
        } catch (error) {
            console.error('Error fetching category data:', error);
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
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategoryData(1, false);
        fetchCategories();
    }, [slug]);

    const handleResetFilters = () => {
        setPriceRange({ min: MIN_PRICE, max: MAX_PRICE });
        setSelectedBrands([]);
        fetchCategoryData(1, false);
    };

    const handleMinChange = (e) => {
        const val = Math.min(Number(e.target.value), priceRange.max - PRICE_GAP);
        setPriceRange(prev => ({ ...prev, min: val }));
    };

    const handleMaxChange = (e) => {
        const val = Math.max(Number(e.target.value), priceRange.min + PRICE_GAP);
        setPriceRange(prev => ({ ...prev, max: val }));
    };

    if (loading && !category) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-white border-t border-gray-100">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-forest-green"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head>
                <title>{category?.name || 'Chargement...'}</title>
                <meta name="description" content={category?.description || `Découvrez notre sélection de produits dans la catégorie ${category?.name} chez DMC.`} />
            </Head>
            {/* Hero Dark Banner with Floating Card */}
            <section className="relative bg-[#021008] h-[340px] md:h-[400px] flex items-center justify-center z-10">
                <div className="absolute inset-0">
                    <img
                        src={category?.image || category?.icon ? resolveCategoryImage(category) : '/images/back.jpg'}
                        alt=""
                        className="absolute right-0 top-0 w-full h-full object-cover md:object-contain object-right opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#021008] via-[#021008]/80 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 relative z-20 text-center">
                    <h1 className="text-2xl md:text-3xl font-black text-neon-green uppercase tracking-widest mb-4 drop-shadow-[0_0_20px_rgba(5,255,0,0.3)]">
                        {category?.name}
                    </h1>
                    <div className="flex items-center justify-center gap-3 text-white/70 text-[10px] uppercase font-black tracking-widest">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-white">{category?.name}</span>
                    </div>
                </div>

                {/* Floating Category Info Card */}
                <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 w-48 h-48 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-4 border border-gray-50 group">
                    <div className="w-24 h-24 mb-2 flex items-center justify-center transition-transform group-hover:scale-110">
                        <img src={resolveCategoryImage(category)} alt={category?.name} className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-xs font-black text-gray-900 uppercase truncate w-full text-center px-2">{category?.name}</h2>
                    <span className="text-[10px] font-bold text-gray-400">{meta.total} ARTICLES</span>
                </div>
            </section>

            {/* Main Content Sections */}
            <section className="bg-white pt-40 pb-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Sidebar */}
                        <aside className="lg:col-span-3 space-y-10">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <h3 className="text-xs font-black text-gray-900 uppercase">Filtres</h3>
                                <button onClick={handleResetFilters} className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1">
                                    <RotateCcw className="w-3 h-3" /> Reset
                                </button>
                            </div>

                            {/* Price range */}
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Prix (CFA)</h4>
                                <div className="space-y-6">
                                    <div className="relative h-2 bg-gray-100 rounded-full">
                                        <div
                                            className="absolute h-full bg-forest-green rounded-full"
                                            style={{
                                                left: `${((priceRange.min - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                                                right: `${100 - ((priceRange.max - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`
                                            }}
                                        ></div>
                                        <input type="range" min={MIN_PRICE} max={MAX_PRICE} value={priceRange.min} onChange={handleMinChange} className="absolute w-full top-0 appearance-none bg-transparent pointer-events-none z-30 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-forest-green [&::-webkit-slider-thumb]:appearance-none" />
                                        <input type="range" min={MIN_PRICE} max={MAX_PRICE} value={priceRange.max} onChange={handleMaxChange} className="absolute w-full top-0 appearance-none bg-transparent pointer-events-none z-30 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-forest-green [&::-webkit-slider-thumb]:appearance-none" />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-600">
                                        <span>{formatPrice(priceRange.min)}</span>
                                        <span>{formatPrice(priceRange.max)}</span>
                                    </div>
                                    <button onClick={() => fetchCategoryData(1)} className="w-full py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase rounded-lg hover:bg-forest-green">Appliquer</button>
                                </div>
                            </div>

                            {/* Categories list */}
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Catégories</h4>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <Link key={cat.id} to={`/categorie/${cat.slug}`} className={`flex items-center gap-2 text-[11px] font-bold uppercase transition-colors ${cat.id === category?.id ? 'text-forest-green' : 'text-gray-500 hover:text-gray-900'}`}>
                                            <div className={`w-3 h-3 rounded-sm border ${cat.id === category?.id ? 'bg-forest-green border-forest-green' : 'border-gray-200'}`}></div>
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid Area */}
                        <div className="lg:col-span-9">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 uppercase text-[10px] font-black text-gray-500">
                                <div>Affichage de {products.length} sur {meta.total} produits</div>
                                <div className="flex gap-4">
                                    <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'text-forest-green' : 'text-gray-300'}><Grid className="w-4 h-4" /></button>
                                    <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'text-forest-green' : 'text-gray-300'}><List className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                                {products.map(product => <ProductCard key={product.id} product={product} />)}
                            </div>

                            {/* STYLED PAGINATION - HIGHLY VISIBLE */}
                            {meta.total > 0 && (
                                <div className="mt-20 flex flex-col items-center gap-10 py-10 border-t border-gray-50">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-forest-green shadow-[0_0_10px_rgba(5,128,49,0.5)] transition-all duration-1000"
                                                style={{ width: `${(products.length / meta.total) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                                            {products.length} de {meta.total} produits
                                        </span>
                                    </div>

                                    {meta.last_page > 1 && (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => fetchCategoryData(page - 1)}
                                                disabled={page === 1}
                                                className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center hover:border-forest-green hover:text-forest-green transition-all disabled:opacity-20"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>

                                            <div className="flex items-center gap-2">
                                                {[...Array(meta.last_page)].map((_, i) => {
                                                    const p = i + 1;
                                                    if (p === 1 || p === meta.last_page || (p >= page - 1 && p <= page + 1)) {
                                                        return (
                                                            <button
                                                                key={p}
                                                                onClick={() => fetchCategoryData(p)}
                                                                className={`w-12 h-12 rounded-2xl font-black text-sm transition-all border-2 ${page === p
                                                                    ? 'bg-forest-green border-forest-green text-white shadow-xl shadow-forest-green/30 scale-110'
                                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-forest-green hover:text-forest-green'}`}
                                                            >
                                                                {p}
                                                            </button>
                                                        );
                                                    }
                                                    if (p === page - 2 || p === page + 2) return <span key={p} className="text-gray-300 font-bold px-1">...</span>;
                                                    return null;
                                                })}
                                            </div>

                                            <button
                                                onClick={() => fetchCategoryData(page + 1)}
                                                disabled={page === meta.last_page}
                                                className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center hover:border-forest-green hover:text-forest-green transition-all disabled:opacity-20"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
