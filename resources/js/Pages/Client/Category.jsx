import React, { useState, useEffect, useContext } from 'react';
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
    Check
} from 'lucide-react';

// Product Card Component
function ProductCard({ product }) {
    const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

    return (
        <div className="group relative bg-white flex flex-col h-full transition-all border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl">
            <Link to={`/produit/${product.id}`} className="block relative aspect-square overflow-hidden bg-white mb-2">
                <img
                    src={product.primary_image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-6"
                />

                {product.is_on_sale && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-black uppercase rounded shadow-lg z-10">
                        SOLDE
                    </span>
                )}
            </Link>

            <div className="flex flex-col flex-grow text-left px-4 pb-4">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">
                    {product.category_name}
                </span>
                <Link to={`/produit/${product.id}`} className="block group-hover:text-forest-green transition-colors">
                    <h3 className="text-[13px] font-bold text-gray-800 mb-1.5 line-clamp-2 min-h-[2.2rem] leading-snug">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-2.5 h-2.5 ${i < Math.floor(product.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                        />
                    ))}
                </div>

                <div className="mt-auto flex items-baseline gap-1.5">
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

            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
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
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState('grid');
    const [priceRange, setPriceRange] = useState({ min: MIN_PRICE, max: MAX_PRICE });

    useEffect(() => {
        // Reset filters when category changes
        setPriceRange({ min: MIN_PRICE, max: MAX_PRICE });
        fetchCategoryData(1, false);
        fetchCategories();
    }, [slug]);

    const handleMinChange = (e) => {
        const val = Math.min(Number(e.target.value), priceRange.max - PRICE_GAP);
        setPriceRange(prev => ({ ...prev, min: val }));
    };

    const handleMaxChange = (e) => {
        const val = Math.max(Number(e.target.value), priceRange.min + PRICE_GAP);
        setPriceRange(prev => ({ ...prev, max: val }));
    };



    const fetchCategoryData = async (pageNum = 1, append = false) => {
        if (append) setLoadingMore(true);
        else setLoading(true);

        try {
            // Updated fetch to include price range
            const response = await api.get(`/categories/${slug}`, {
                params: {
                    page: pageNum,
                    min_price: priceRange.min,
                    max_price: priceRange.max
                }
            });
            const responseData = response.data;

            // Laravel Resources wrap in 'data'
            const catData = responseData.category?.data || responseData.category;
            const productList = responseData.products?.data || responseData.products || [];

            setCategory(catData);

            if (append) {
                setProducts(prev => [...prev, ...productList]);
            } else {
                setProducts(productList || []);
            }

            setMeta(responseData.meta);
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

    const handleLoadMore = () => {
        if (page < meta?.last_page) {
            fetchCategoryData(page + 1, true);
        }
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
            {/* Hero Dark Banner with Floating Card */}
            <section className="relative bg-[#021008] border-b border-white/5 h-[400px] flex items-center justify-center overflow-visible z-10">
                {/* Background Pattern/Gradient */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] opacity-[0.03]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#021008] via-[#021008] to-transparent"></div>
                </div>

                {/* Right Hero Image (Contextual) */}
                {category?.image && (
                    <div className="absolute right-0 top-0 h-full w-1/2 md:w-2/5 animate-in slide-in-from-right duration-1000">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#021008] to-transparent z-10 w-2/3"></div>
                        <img
                            src={category.image.startsWith('http') ? category.image : `/storage/${category.image}`}
                            alt=""
                            className="w-full h-full object-contain object-right p-8 opacity-40 mix-blend-screen"
                        />
                    </div>
                )}

                {/* Center Content */}
                <div className="container mx-auto px-4 relative z-20 text-center -mt-10">
                    <h1 className="text-4xl md:text-6xl font-black text-neon-green uppercase tracking-[0.05em] mb-6 drop-shadow-[0_0_25px_rgba(31,224,96,0.3)]">
                        {category?.name || 'CATÉGORIE'}
                    </h1>
                    <div className="flex items-center justify-center gap-3 text-white/50 text-[11px] font-black uppercase tracking-widest">
                        <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
                        <ChevronRight className="w-3 h-3 text-white/20" />
                        <span className="text-white">{category?.name}</span>
                    </div>
                    {category?.description && (
                        <div className="max-w-2xl mx-auto mt-4 text-gray-400 text-sm font-medium leading-relaxed line-clamp-2">
                            {category.description}
                        </div>
                    )}
                </div>

                {/* Floating Card */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30">
                    <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-8 w-[240px] aspect-square flex flex-col items-center justify-center text-center border border-gray-100 relative group transition-all hover:-translate-y-2">
                        {/* Decorative glow */}
                        <div className="absolute inset-0 bg-forest-green/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        {/* Image */}
                        <div className="w-32 h-32 mb-4 flex items-center justify-center relative z-10">
                            {category?.image ? (
                                <img
                                    src={category.image.startsWith('http') ? category.image : `/storage/${category.image}`}
                                    alt={category.name}
                                    className="w-full h-full object-contain filter drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : category?.icon ? (
                                <img src={category.icon} alt={category.name} className="w-full h-full object-contain" />
                            ) : (
                                <LayoutGrid className="w-16 h-16 text-gray-200" />
                            )}
                        </div>

                        <div className="relative z-10 w-full">
                            <h2 className="text-sm font-black text-gray-900 leading-tight mb-1 truncate px-2">
                                {category?.name}
                            </h2>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider inline-block">
                                {meta?.total || 0} Produits
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Layout with Sidebar (Adjusted padding top for floating card) */}
            <section className="bg-white py-16 pt-32">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* SIDEBAR FILTER (col-span-3) */}
                        <aside className="lg:col-span-3 space-y-10">

                            {/* Categories Filter Section */}
                            <div className="border-b border-gray-100 pb-8">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center justify-between group cursor-pointer">
                                    Catégories
                                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-forest-green" />
                                </h3>
                                <div className="space-y-3">
                                    {categories.map((cat, i) => (
                                        <Link
                                            key={i}
                                            to={`/categorie/${cat.slug}`}
                                            className="flex items-center gap-3 group"
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${cat.id === category?.id ? 'bg-forest-green border-forest-green' : 'border-gray-200 group-hover:border-forest-green'}`}>
                                                {cat.id === category?.id && <Check className="w-2.5 h-2.5 text-white" />}
                                            </div>
                                            <span className={`text-[12px] font-bold uppercase tracking-wide transition-colors ${cat.id === category?.id ? 'text-forest-green' : 'text-gray-500 group-hover:text-gray-900'}`}>
                                                {cat.name}
                                            </span>
                                            <span className="text-[10px] text-gray-300 ml-auto font-bold">{cat.products_count}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter Section */}
                            <div className="border-b border-gray-100 pb-8">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-6">Prix</h3>
                                <div className="space-y-6">
                                    {/* Dual Range Slider */}
                                    <div className="relative h-10 mb-6 pt-6">
                                        {/* Floating Tooltip Min */}
                                        <div
                                            className="absolute top-0 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-80 pointer-events-none transition-all"
                                            style={{
                                                left: `${((priceRange.min - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`
                                            }}
                                        >
                                            {formatPrice(priceRange.min)}
                                        </div>

                                        {/* Floating Tooltip Max */}
                                        <div
                                            className="absolute top-0 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-80 pointer-events-none transition-all"
                                            style={{
                                                left: `${((priceRange.max - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`
                                            }}
                                        >
                                            {formatPrice(priceRange.max)}
                                        </div>

                                        <input
                                            type="range"
                                            min={MIN_PRICE}
                                            max={MAX_PRICE}
                                            step={5000}
                                            value={priceRange.min}
                                            onChange={handleMinChange}
                                            className="absolute w-full h-1 bg-transparent pointer-events-none appearance-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-forest-green [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md cursor-pointer"
                                        />
                                        <input
                                            type="range"
                                            min={MIN_PRICE}
                                            max={MAX_PRICE}
                                            step={5000}
                                            value={priceRange.max}
                                            onChange={handleMaxChange}
                                            className="absolute w-full h-1 bg-transparent pointer-events-none appearance-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-forest-green [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md cursor-pointer"
                                        />
                                        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full z-10 overflow-hidden">
                                            <div
                                                className="absolute h-full bg-forest-green rounded-full"
                                                style={{
                                                    left: `${((priceRange.min - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                                                    right: `${100 - ((priceRange.max - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Labels */}
                                    <div className="flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <span>{new Intl.NumberFormat('fr-FR').format(priceRange.min)} F</span>
                                        <span>{new Intl.NumberFormat('fr-FR').format(priceRange.max)} F</span>
                                    </div>

                                    <button
                                        onClick={() => fetchCategoryData(1, false)}
                                        className="w-full py-2 bg-gray-900 text-[10px] font-black text-white uppercase tracking-widest rounded-lg hover:bg-forest-green transition-all"
                                    >
                                        Filtrer
                                    </button>
                                </div>
                            </div>

                            {/* Brand Filter Section (Dummy) */}
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-6">Marque</h3>
                                <div className="space-y-3">
                                    {['HP', 'Dell', 'Lenovo', 'Apple', 'Asus'].map((brand, i) => (
                                        <label key={i} className="flex items-center gap-3 group cursor-pointer">
                                            <div className="w-4 h-4 rounded border border-gray-200 group-hover:border-forest-green transition-all"></div>
                                            <span className="text-[12px] font-bold uppercase tracking-wide text-gray-500 group-hover:text-gray-900">{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* PRODUCT CONTENT (col-span-9) */}
                        <div className="lg:col-span-9">

                            {/* Horizontal Filter Bar matching Image 1 */}
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex bg-gray-50 p-1 rounded-lg">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-forest-green text-white' : 'text-gray-400'}`}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-forest-green text-white' : 'text-gray-400'}`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Affichage de {products.length} sur {meta?.total} résultats
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer group">
                                    Trier par
                                    <ChevronDown className="w-3 h-3 group-hover:text-forest-green" />
                                </div>
                            </div>

                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">
                                NOS ARTICLES : {category?.name}
                            </h2>

                            {/* Product Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))
                                ) : (
                                    <div className="col-span-full py-24 text-center">
                                        <p className="text-gray-400 font-bold">Aucun produit trouvé dans cette catégorie.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination/Load More */}
                            {meta?.total > 0 && products.length < meta.total && (
                                <div className="mt-16 flex flex-col items-center gap-6">
                                    <div className="w-full max-w-xs h-1 bg-gray-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-forest-green rounded-full shadow-[0_0_8px_rgba(5,128,49,0.3)] transition-all duration-700"
                                            style={{ width: `${(products.length / meta.total) * 100}%` }}
                                        ></div>
                                    </div>
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="px-12 py-4 bg-gray-900 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-forest-green transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {loadingMore ? 'Chargement...' : 'Charger Plus'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Description & SEO Section (Bottom part of Image 1) */}
            {category?.description && (
                <section className="bg-gray-50 py-20 border-t border-gray-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="mb-12">
                            <h2 className="text-2xl font-black text-gray-800 uppercase mb-6">{category.name}</h2>
                            <div className="prose prose-sm text-gray-500 font-medium leading-[28px]">
                                {category.description}
                            </div>
                        </div>

                        {/* Tags Section */}
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Tags Tendances</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Ordinateurs', 'Pc Portable', 'Informatique', 'DMC', 'Dakar', 'Sénégal'].map((tag, i) => (
                                    <button key={i} className="px-5 py-2.5 bg-white border border-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-400 hover:border-forest-green hover:text-forest-green transition-all">
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
