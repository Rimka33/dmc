import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

function ProductCard({ product }) {
    return (
        <Link to={`/produit/${product.id}`} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                    src={product.primary_image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {product.is_on_sale && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded">
                        SOLDE
                    </span>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-forest-green">
                        {product.price_formatted}
                    </span>
                    {product.has_discount && (
                        <span className="text-sm text-gray-400 line-through">
                            {product.old_price_formatted}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function Shop() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
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
    }, [searchParams]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                per_page: 12,
                sort_by: sortBy,
                sort_order: sortOrder,
            };

            if (selectedCategory) params.category_id = selectedCategory;
            if (search) params.search = search;
            if (minPrice) params.min_price = minPrice;
            if (maxPrice) params.max_price = maxPrice;

            const response = await api.get('/products', { params });
            setProducts(response.data.data || []);
            setPagination(response.data.meta || {});
        } catch (error) {
            console.error('Erreur lors du chargement des produits', error);
        } finally {
            setLoading(false);
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
        fetchProducts();
    }, [currentPage, selectedCategory, sortBy, sortOrder, search, minPrice, maxPrice]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts();
    };

    const handlePriceFilter = (range) => {
        setCurrentPage(1);
        if (range === 'all') {
            setMinPrice('');
            setMaxPrice('');
        } else if (range === '0-100k') {
            setMinPrice(0);
            setMaxPrice(100000);
        } else if (range === '100k-500k') {
            setMinPrice(100000);
            setMaxPrice(500000);
        } else if (range === '500k+') {
            setMinPrice(500000);
            setMaxPrice('');
        }
    };

    const handleSort = (value) => {
        if (value === 'price-asc') {
            setSortBy('price');
            setSortOrder('asc');
        } else if (value === 'price-desc') {
            setSortBy('price');
            setSortOrder('desc');
        } else if (value === 'newest') {
            setSortBy('created_at');
            setSortOrder('desc');
        } else {
            setSortBy('created_at');
            setSortOrder('desc');
        }
    };

    return (
        <MainLayout>
            {/* Hero Banner */}
            <div className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, rgba(1, 26, 10, 0.9), rgba(1, 26, 10, 0.7)), url(/images/shop-bg.jpg) center/cover' }}>
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-neon-green uppercase mb-4">BOUTIQUE</h1>
                    <div className="flex items-center justify-center gap-2 text-white text-sm">
                        <Link to="/" className="hover:text-neon-green">Accueil</Link>
                        <span>/</span>
                        <span className="text-neon-green">Boutique</span>
                    </div>
                </div>
            </div>

            {/* Categories Icons Bar */}
            <section className="py-8 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-6 flex-wrap">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`flex flex-col items-center group ${!selectedCategory ? 'scale-110' : ''}`}
                        >
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-2 transition-colors ${!selectedCategory ? 'bg-neon-green' : 'bg-gray-100 group-hover:bg-neon-green'}`}>
                                <i className="icon-grid text-xl"></i>
                            </div>
                            <span className={`text-xs text-center font-medium ${!selectedCategory ? 'text-forest-green' : 'text-gray-700 group-hover:text-forest-green'}`}>
                                Tous
                            </span>
                        </button>
                        {categories?.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex flex-col items-center group ${selectedCategory === category.id ? 'scale-110' : ''}`}
                            >
                                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-2 transition-colors ${selectedCategory === category.id ? 'bg-neon-green' : 'bg-gray-100 group-hover:bg-neon-green'}`}>
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>
                                <span className={`text-xs text-center font-medium ${selectedCategory === category.id ? 'text-forest-green' : 'text-gray-700 group-hover:text-forest-green'}`}>
                                    {category.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Shop Section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Filters */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                                {/* Search */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase">RECHERCHE</h3>
                                    <form onSubmit={handleSearch} className="relative">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Rechercher..."
                                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-neon-green"
                                        />
                                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                                            <i className="icon-search text-gray-500"></i>
                                        </button>
                                    </form>
                                </div>

                                {/* Price Filter */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase">PRIX</h3>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="priceRange"
                                                onChange={() => handlePriceFilter('all')}
                                                defaultChecked
                                                className="w-4 h-4 text-neon-green focus:ring-neon-green"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-forest-green">Tous</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="priceRange"
                                                onChange={() => handlePriceFilter('0-100k')}
                                                className="w-4 h-4 text-neon-green focus:ring-neon-green"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-forest-green">0 - 100.000 FCFA</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="priceRange"
                                                onChange={() => handlePriceFilter('100k-500k')}
                                                className="w-4 h-4 text-neon-green focus:ring-neon-green"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-forest-green">100.000 - 500.000 FCFA</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="priceRange"
                                                onChange={() => handlePriceFilter('500k+')}
                                                className="w-4 h-4 text-neon-green focus:ring-neon-green"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-forest-green">500.000+ FCFA</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="lg:col-span-3">
                            {/* Toolbar */}
                            <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">
                                        Affichage de {products?.length || 0} résultats sur {pagination.total || 0}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* View Mode Toggle */}
                                    <div className="flex items-center gap-1 border border-gray-300 rounded">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 ${viewMode === 'grid' ? 'bg-forest-green text-white' : 'text-gray-600'}`}
                                        >
                                            <i className="icon-grid w-5 h-5 flex items-center justify-center"></i>
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 ${viewMode === 'list' ? 'bg-forest-green text-white' : 'text-gray-600'}`}
                                        >
                                            <i className="icon-list w-5 h-5 flex items-center justify-center"></i>
                                        </button>
                                    </div>

                                    {/* Sort Dropdown */}
                                    <select
                                        onChange={(e) => handleSort(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neon-green"
                                    >
                                        <option value="newest">Plus récent</option>
                                        <option value="price-asc">Prix croissant</option>
                                        <option value="price-desc">Prix décroissant</option>
                                    </select>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
                                </div>
                            ) : (
                                <>
                                    <div className={
                                        viewMode === 'grid'
                                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                            : 'flex flex-col gap-4'
                                    }>
                                        {products.length > 0 ? (
                                            products.map((product, index) => (
                                                <ProductCard key={index} product={product} />
                                            ))
                                        ) : (
                                            <div className="col-span-full py-12 text-center text-gray-500">
                                                Aucun produit ne correspond à vos critères.
                                            </div>
                                        )}
                                    </div>

                                    {/* Pagination */}
                                    {pagination.last_page > 1 && (
                                        <div className="mt-12 flex items-center justify-center gap-2">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prev => prev - 1)}
                                                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-forest-green hover:text-white hover:border-forest-green transition-colors disabled:opacity-50"
                                            >
                                                <i className="icon-chevron-left"></i>
                                            </button>
                                            {[...Array(pagination.last_page)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`w-10 h-10 flex items-center justify-center rounded ${currentPage === i + 1 ? 'bg-forest-green text-white' : 'border border-gray-300 hover:bg-gray-100'}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                            <button
                                                disabled={currentPage === pagination.last_page}
                                                onClick={() => setCurrentPage(prev => prev + 1)}
                                                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-forest-green hover:text-white hover:border-forest-green transition-colors disabled:opacity-50"
                                            >
                                                <i className="icon-chevron-right"></i>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
