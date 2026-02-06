import React, { useState, useEffect, useContext, useRef } from 'react';
import { Head } from '@inertiajs/react';
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
  ChevronDown,
} from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';
import { resolveCategoryImage } from '../../utils/imageUtils';

const StarRating = ({ rating, count }) => (
  <div className="flex items-center gap-1 mb-2">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-2.5 h-2.5 ${i < Math.floor(rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
      />
    ))}
    <span className="text-[9px] text-gray-400 ml-1">
      (<span>{count || 0}</span>)
    </span>
  </div>
);

function ProductCard({ product, viewMode = 'grid' }) {
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex gap-6 p-5 relative">
        <Link to={`/produit/${product.id}`} state={{ product }} className="flex-shrink-0">
          <div className="relative w-56 aspect-square overflow-hidden bg-white rounded-2xl flex-shrink-0">
            <ShimmerImage
              src={product.primary_image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
              fallback={'/images/products/default.png'}
            />
            {product.is_on_sale && (
              <span className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg">
                SOLDE
              </span>
            )}
          </div>
        </Link>
        <div className="flex flex-col py-2 flex-grow text-left">
          <Link to={`/produit/${product.id}`} state={{ product }} className="group">
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
            {product.description ||
              'Découvrez ce produit exceptionnel de haute qualité chez DMC SARL.'}
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
              <Link
                to={`/produit/${product.id}`}
                state={{ product }}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-forest-green transition-all"
              >
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
      <Link
        to={`/produit/${product.id}`}
        state={{ product }}
        className="relative aspect-square overflow-hidden bg-white mb-1 block overflow-hidden"
      >
        <ShimmerImage
          src={product.primary_image || '/images/products/default.png'}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
          fallback={'/images/products/default.png'}
        />

        {product.is_on_sale && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-[9px] font-black uppercase rounded shadow-lg z-10">
            SOLDE
          </span>
        )}
      </Link>

      {/* Content Container */}
      <div className="flex flex-col flex-grow text-left px-3 pb-3">
        <div className="mb-0.5">
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none line-clamp-1">
            {product.category_name}
          </span>
        </div>

        <Link
          to={`/produit/${product.id}`}
          state={{ product }}
          className="block mb-1 group-hover:text-forest-green transition-colors"
        >
          <h3 className="text-[11px] font-bold text-gray-800 line-clamp-2 min-h-[1.6rem] leading-snug">
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.rating} count={product.review_count} />

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

      {/* Wishlist Button Overlay */}
      <button
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await toggleWishlist(product);
        }}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 hover:scale-110"
      >
        <Heart
          className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : ''}`}
        />
      </button>
    </div>
  );
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, last_page: 1, current_page: 1 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') || null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [onSale, setOnSale] = useState(searchParams.get('on_sale') === '1');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid-compact');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [openFilter, setOpenFilter] = useState(null);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo =
        direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const querySearch = searchParams.get('search');
    if (querySearch !== null) {
      setSearch(querySearch);
      setCurrentPage(1);
    }

    setSelectedCategory(searchParams.get('category_id') || null);
    setOnSale(searchParams.get('on_sale') === '1');
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
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (onSale) params.on_sale = 1;
      if (selectedBrands.length > 0) params.brands = selectedBrands.join(',');
      if (selectedRating) params.rating = selectedRating;

      const response = await api.get('/products', { params });

      const responseData = response.data;
      const productList = responseData.data || responseData;

      if (append) {
        setProducts((prev) => [...prev, ...(productList || [])]);
      } else {
        setProducts(productList || []);
      }

      // Gestion ultra-robuste du total et des métadonnées (certains environnements renvoient des tableaux [22, 22])
      const getSafeNumber = (val, fallback = 0) => {
        if (Array.isArray(val)) return Number(val[0]) || fallback;
        if (typeof val === 'object' && val !== null)
          return Number(Object.values(val)[0]) || fallback;
        return Number(val) || fallback;
      };

      const total =
        getSafeNumber(responseData.meta?.total || responseData.total, 0) ||
        (Array.isArray(productList) ? productList.length : 0);
      const lastPage = getSafeNumber(
        responseData.meta?.last_page || responseData.last_page,
        Math.ceil(total / 12)
      );

      setPagination({
        total: total,
        last_page: lastPage || 1,
        current_page: getSafeNumber(
          responseData.meta?.current_page || responseData.current_page,
          page
        ),
        per_page: getSafeNumber(responseData.meta?.per_page || responseData.per_page, 12),
      });
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
  }, [
    selectedCategory,
    sortBy,
    sortOrder,
    search,
    minPrice,
    maxPrice,
    onSale,
    selectedBrands,
    selectedRating,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrands([]);
    setSelectedRating(null);
    setOnSale(false);
    setSearchParams({});
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

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

  const selectedCategoryData = categories.find((c) => c.id == selectedCategory);

  return (
    <MainLayout>
      <Head>
        <title>
          {onSale ? 'Promotions' : selectedCategoryData?.name || 'Boutique Informatique Dakar'}
        </title>
        <meta
          name="description"
          content="Boutique d'informatique DMC à Dakar. Large choix d'ordinateurs, accessoires et maintenance informatique premium au Sénégal."
        />
      </Head>
      {/* Banner Section matching design - Dynamic Background */}
      <div className="relative h-[300px] md:h-[340px] bg-[#021008] overflow-visible flex items-center justify-center mb-20">
        <div className="absolute inset-0 z-0">
          {/* The Image - Masked by gradient */}
          <img
            src={
              selectedCategoryData ? resolveCategoryImage(selectedCategoryData) : '/images/back.jpg'
            }
            alt=""
            className="absolute right-0 top-0 w-full h-full object-cover md:object-contain object-right opacity-90 transition-opacity duration-1000"
          />

          {/* Multi-stop Smooth Gradient: Solid -> Smooth Fade -> Transparent */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#021008] via-[#021008] via-[#021008]/90 via-[#021008]/40 to-transparent z-10"></div>
        </div>

        <div className="relative z-10 text-center px-4 -mt-10">
          <h1 className="text-2xl md:text-4xl font-black text-neon-green uppercase tracking-[0.1em] drop-shadow-[0_0_20px_rgba(85,255,0,0.4)] mb-4 leading-tight">
            {onSale ? 'PROMOTIONS' : selectedCategoryData?.name || 'BOUTIQUE'}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/70 text-[10px] md:text-[11px] font-black uppercase tracking-widest">
            <Link to="/" className="hover:text-neon-green transition-colors">
              Accueil
            </Link>
            <ChevronRight className="w-3 h-3 text-white/30" />
            <span className="text-white">
              {onSale ? 'Nos Promotions' : selectedCategoryData?.name || 'Boutique'}
            </span>
          </div>
        </div>

        {/* Categories Row - Floating Layout matching provide image */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20">
          <div className="container mx-auto px-4">
            <div className="relative group">
              {/* Navigation Arrows */}
              <button
                onClick={() => scroll('left')}
                className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-400 hover:text-forest-green z-30 transition-all border border-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-400 hover:text-forest-green z-30 transition-all border border-gray-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Cards Container */}
              <div
                ref={scrollContainerRef}
                className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide px-2 snap-x snap-mandatory"
              >
                {/* All Category Card */}
                <Link
                  to="/shop"
                  onClick={() => handleCategorySelect(null)}
                  className={`flex-shrink-0 w-[105px] aspect-[4/5] bg-white rounded-2xl p-2 shadow-sm transition-all flex flex-col items-center justify-center text-center border-2 group snap-start ${!selectedCategory ? 'border-neon-green' : 'border-transparent hover:border-neon-green/30'}`}
                >
                  <div className="w-16 h-16 mb-2 flex items-center justify-center bg-white rounded-xl group-hover:bg-neon-green/5 transition-colors">
                    <LayoutGrid
                      className={`w-9 h-9 ${!selectedCategory ? 'text-forest-green' : 'text-gray-300'} group-hover:text-forest-green transition-colors`}
                    />
                  </div>
                  <h3 className="text-[9px] font-black uppercase tracking-tighter text-gray-900 leading-none">
                    Tous
                  </h3>
                </Link>

                {categories?.map((cat) => (
                  <Link
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`flex-shrink-0 w-[105px] aspect-[4/5] bg-white rounded-2xl p-2 shadow-sm transition-all flex flex-col items-center justify-center text-center border-2 group snap-start ${selectedCategory == cat.id ? 'border-neon-green' : 'border-transparent hover:border-neon-green/30'}`}
                  >
                    <div className="w-16 h-16 mb-2 flex items-center justify-center relative bg-white rounded-xl overflow-hidden group-hover:bg-neon-green/5 transition-colors">
                      {cat.image || cat.icon ? (
                        <img
                          src={resolveCategoryImage(cat)}
                          alt={cat.name}
                          className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                          onError={(e) => {
                            e.target.src = '/images/placeholder.png';
                          }}
                        />
                      ) : (
                        <img
                          src="/images/icons/default.svg"
                          alt="Icone par défaut"
                          className="w-8 h-8 text-gray-400 group-hover:text-forest-green transition-colors opacity-90"
                        />
                      )}
                    </div>
                    <h3 className="text-[9px] font-black uppercase tracking-tighter text-gray-900 line-clamp-1 leading-none">
                      {cat.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalogue Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          {/* Filter Header Section */}
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-forest-green pb-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-forest-green" />
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                  FILTRER PAR
                </h2>
              </div>
              {(selectedCategory ||
                search ||
                minPrice ||
                maxPrice ||
                selectedBrands.length > 0 ||
                selectedRating ||
                onSale) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors flex items-center gap-1"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>

            {/* Top Filters Block - Responsive Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 md:grid-cols-4 bg-[#f8f8f8] rounded-xl overflow-hidden border border-gray-100 shadow-sm relative z-40">
                {/* Categories Filter Column */}
                <div
                  onClick={() => setOpenFilter(openFilter === 'categories' ? null : 'categories')}
                  className={`p-4 md:p-5 border-r border-b md:border-b-0 border-gray-200/50 group hover:bg-white transition-colors cursor-pointer ${openFilter === 'categories' ? 'bg-white' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest md:tracking-[0.15em]">
                      Catégories
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 group-hover:text-forest-green transition-transform ${openFilter === 'categories' ? 'rotate-180 text-forest-green' : ''}`}
                    />
                  </div>
                </div>

                {/* Prix Filter Column */}
                <div
                  onClick={() => setOpenFilter(openFilter === 'price' ? null : 'price')}
                  className={`p-4 md:p-5 border-b md:border-b-0 md:border-r border-gray-200/50 group hover:bg-white transition-colors cursor-pointer ${openFilter === 'price' ? 'bg-white' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest md:tracking-[0.15em]">
                      Prix
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 group-hover:text-forest-green transition-transform ${openFilter === 'price' ? 'rotate-180 text-forest-green' : ''}`}
                    />
                  </div>
                </div>

                {/* Marques Filter Column */}
                <div
                  onClick={() => setOpenFilter(openFilter === 'brands' ? null : 'brands')}
                  className={`p-4 md:p-5 border-r border-gray-200/50 group hover:bg-white transition-colors cursor-pointer ${openFilter === 'brands' ? 'bg-white' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest md:tracking-[0.15em]">
                      Marques
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 group-hover:text-forest-green transition-transform ${openFilter === 'brands' ? 'rotate-180 text-forest-green' : ''}`}
                    />
                  </div>
                </div>

                {/* Avis Filter Column */}
                <div
                  onClick={() => setOpenFilter(openFilter === 'rating' ? null : 'rating')}
                  className={`p-4 md:p-5 group hover:bg-white transition-colors cursor-pointer ${openFilter === 'rating' ? 'bg-white' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest md:tracking-[0.15em]">
                      Avis
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 group-hover:text-forest-green transition-transform ${openFilter === 'rating' ? 'rotate-180 text-forest-green' : ''}`}
                    />
                  </div>
                </div>
              </div>

              {/* Dropdown Contents - Responsive Padding */}
              {openFilter && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 shadow-2xl rounded-b-2xl z-30 animate-in slide-in-from-top-4 fade-in duration-200 p-4 md:p-8">
                  {openFilter === 'categories' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            handleCategorySelect(cat.id === selectedCategory ? null : cat.id);
                            setOpenFilter(null);
                          }}
                          className="flex items-center gap-3 group text-left"
                        >
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${selectedCategory == cat.id ? 'bg-forest-green border-forest-green' : 'border-gray-200 group-hover:border-forest-green'}`}
                          >
                            {selectedCategory == cat.id && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${selectedCategory == cat.id ? 'text-forest-green' : 'text-gray-500 group-hover:text-gray-900'}`}
                          >
                            {cat.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {openFilter === 'price' && (
                    <div className="max-w-md mx-auto space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            Min (CFA)
                          </label>
                          <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="0"
                            className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-forest-green focus:border-forest-green transition-all"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            Max (CFA)
                          </label>
                          <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="5 000 000"
                            className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-forest-green focus:border-forest-green transition-all"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setOpenFilter(null)}
                        className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-forest-green transition-all"
                      >
                        Appliquer les prix
                      </button>
                    </div>
                  )}

                  {openFilter === 'brands' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {['HP', 'Dell', 'Lenovo', 'Apple', 'Asus', 'Acer'].map((brand) => (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          className="flex items-center gap-3 group text-left"
                        >
                          <div
                            className={`w-5 h-5 rounded-lg border transition-all flex items-center justify-center ${selectedBrands.includes(brand) ? 'bg-forest-green border-forest-green' : 'border-gray-200 group-hover:border-forest-green'}`}
                          >
                            {selectedBrands.includes(brand) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${selectedBrands.includes(brand) ? 'text-forest-green' : 'text-gray-500 group-hover:text-gray-900'}`}
                          >
                            {brand}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {openFilter === 'rating' && (
                    <div className="flex flex-wrap justify-center gap-8">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <button
                          key={stars}
                          onClick={() => {
                            setSelectedRating(selectedRating === stars ? null : stars);
                            setOpenFilter(null);
                          }}
                          className="flex items-center gap-2 group"
                        >
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest transition-colors mt-0.5 ${selectedRating === stars ? 'text-forest-green' : 'text-gray-400 group-hover:text-forest-green'}`}
                          >
                            {stars === 5 ? '5 Étoiles' : '& Plus'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* View Mode Toolbar - Precise Match & Responsive */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8">
              <div className="flex items-center justify-between w-full sm:w-auto gap-4 md:gap-6">
                <div className="flex bg-[#f2f2f2] p-1.5 rounded-xl gap-1">
                  {[
                    { id: 'grid-compact', icon: LayoutGrid, size: 'w-4 h-4' },
                    { id: 'grid', icon: Grid, size: 'w-4 h-4' },
                    { id: 'grid-large', icon: LayoutGrid, size: 'w-5 h-5' },
                    { id: 'list', icon: List, size: 'w-4 h-4' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                        viewMode === mode.id
                          ? 'bg-forest-green shadow-lg text-white'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <mode.icon className={mode.size} />
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Affichage de <span>{products.length}</span> sur{' '}
                  <span>{pagination.total || 0}</span> résultats
                </span>
              </div>

              <div className="relative group w-full sm:w-[180px]">
                <select
                  className="w-full appearance-none bg-white border border-gray-100 rounded-xl pl-5 pr-12 py-3 md:py-3.5 text-[11px] font-black text-gray-600 uppercase tracking-widest focus:ring-4 focus:ring-forest-green/5 focus:border-forest-green outline-none transition-all cursor-pointer shadow-sm"
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="newest">Tri par défaut</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="popular">Les plus populaires</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-forest-green transition-colors" />
              </div>
            </div>

            {/* Products Grid */}
            {loading && products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-forest-green"></div>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid-compact'
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-8'
                    : viewMode === 'grid-large'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-12 py-8'
                      : viewMode === 'list'
                        ? 'flex flex-col gap-10 py-8'
                        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 py-8'
                }
              >
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))
                ) : (
                  <div className="col-span-full py-24 text-center">
                    <Search className="w-12 h-12 text-gray-100 mx-auto mb-6" />
                    <h3 className="text-lg font-black text-gray-900 mb-2 uppercase">
                      Aucun produit trouvé
                    </h3>
                  </div>
                )}
              </div>
            )}

            {/* Pagination Progress & Navigation - COMPACT */}
            {products.length > 0 && (
              <div className="mt-12 flex flex-col items-center gap-8 mb-20 relative z-[60]">
                <div className="flex flex-col items-center gap-3 w-full max-w-[280px]">
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden shadow-sm">
                    <div
                      className="h-full bg-forest-green rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(5,128,49,0.3)]"
                      style={{
                        width: `${(products.length / (Math.max(Number(pagination.total), products.length) || 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">
                    AFFICHAGE DE <span className="text-forest-green">{products.length}</span> SUR{' '}
                    <span className="text-forest-green">
                      {Math.max(Number(pagination.total), products.length)}
                    </span>{' '}
                    PRODUITS
                  </div>
                </div>

                {Number(pagination.last_page) > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchProducts(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-forest-green hover:text-forest-green transition-all disabled:opacity-20 shadow-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {[...Array(Number(pagination.last_page))].map((_, i) => {
                        const page = i + 1;
                        if (
                          page === 1 ||
                          page === Number(pagination.last_page) ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => fetchProducts(page)}
                              className={`w-10 h-10 rounded-xl font-black text-[11px] transition-all border-2 ${
                                currentPage === page
                                  ? 'bg-forest-green border-forest-green text-white shadow-lg shadow-forest-green/20'
                                  : 'bg-white border-gray-100 text-gray-400 hover:border-forest-green hover:text-forest-green'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          if (page === currentPage - 2 && currentPage > 3)
                            return (
                              <span key={page} className="text-gray-300 font-bold px-1">
                                ...
                              </span>
                            );
                          if (
                            page === currentPage + 2 &&
                            currentPage < Number(pagination.last_page) - 2
                          )
                            return (
                              <span key={page} className="text-gray-300 font-bold px-1">
                                ...
                              </span>
                            );
                          return null;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => fetchProducts(currentPage + 1)}
                      disabled={currentPage === Number(pagination.last_page) || loading}
                      className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-forest-green hover:text-forest-green transition-all disabled:opacity-20 shadow-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {Number(pagination.last_page) > 1 && products.length < Number(pagination.total) && (
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-10 py-3.5 bg-gray-900 hover:bg-forest-green text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-forest-green/20 disabled:opacity-50 flex items-center gap-2 active:scale-95"
                  >
                    {loadingMore ? 'Chargement...' : 'Charger la suite'}
                    {!loadingMore && <ChevronDown className="w-4 h-4" />}
                  </button>
                )}
              </div>
            )}

            {/* Final Finish Message */}
            {pagination.total > 0 &&
              products.length >= pagination.total &&
              !loading &&
              currentPage === (pagination.last_page || 1) && (
                <div className="mt-20 py-8 border-t border-gray-50 text-center mb-20">
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                    Vous avez parcouru tout le catalogue
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
