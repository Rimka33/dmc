import React, { useState, useEffect, useContext } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { WishlistContext } from '../../contexts/WishlistContext';
import { CartContext } from '../../contexts/CartContext';
import {
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  X,
  Camera,
  LayoutGrid,
  ChevronDown,
  User,
} from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';
import { AuthContext } from '../../contexts/AuthContext';
import { useRef } from 'react';
import { resolveCategoryImage } from '../../utils/imageUtils';

// Popup Banner Component
function PopupBanner({ banner, onClose }) {
  if (!banner) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-all z-20 text-white"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col md:flex-row h-full">
          {/* Banner Image */}
          <div className="w-full md:w-1/2 h-64 md:h-[450px]">
            <img
              src={banner.image || '/images/placeholder.png'}
              className="w-full h-full object-cover"
              alt={banner.title}
            />
          </div>
          {/* Content */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white">
            <span className="text-neon-green font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              Offre Exclusive
            </span>
            <h2 className="text-3xl font-black text-gray-900 uppercase leading-tight mb-4">
              {banner.title}
            </h2>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed italic line-clamp-4">
              "{banner.description}"
            </p>
            <Link
              to={banner.link || banner.button_link || '/shop'}
              onClick={onClose}
              className="w-full bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-center hover:bg-forest-green transition-all shadow-xl shadow-forest-green/20"
            >
              {banner.button_text || 'Découvrir maintenant'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Static Banner Component
function StaticBanner({ banner, className = '' }) {
  if (!banner) return null;

  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <Link to={banner.link || banner.button_link || '/shop'} className="block group">
          <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={banner.image || '/images/placeholder.png'}
              alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent flex items-center px-12">
              <div className="max-w-md space-y-4">
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase leading-tight">
                  {banner.title}
                </h2>
                {banner.description && (
                  <p className="text-white/80 text-sm font-bold line-clamp-2">
                    {banner.description}
                  </p>
                )}
                <span className="inline-block px-6 py-3 bg-neon-green text-black font-black text-[10px] uppercase tracking-widest rounded-xl">
                  {banner.button_text || "Voir l'offre"}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

// Countdown Component
function Countdown({ endDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      setTimeLeft({
        days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hours: String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(
          2,
          '0'
        ),
        minutes: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
        seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0'),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="bg-gray-100 rounded p-2 text-center">
        <div className="text-sm font-bold text-black">{timeLeft.days}</div>
        <div className="text-xs text-black">Jours</div>
      </div>
      <div className="bg-gray-100 rounded p-2 text-center">
        <div className="text-sm font-bold text-black">{timeLeft.hours}</div>
        <div className="text-xs text-black">Heures</div>
      </div>
      <div className="bg-gray-100 rounded p-2 text-center">
        <div className="text-sm font-bold text-black">{timeLeft.minutes}</div>
        <div className="text-xs text-black">Mins</div>
      </div>
      <div className="bg-gray-100 rounded p-2 text-center">
        <div className="text-sm font-bold text-black">{timeLeft.seconds}</div>
        <div className="text-xs text-black">Secs</div>
      </div>
    </div>
  );
}

// Horizontal Product Card for Featured Section
function HorizontalProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  if (!product) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex h-44 relative border border-gray-100/50">
      {/* Wishlist Button */}
      <button
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await toggleWishlist(product);
        }}
        className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
        title={isInWishlist(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <Heart
          className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : ''}`}
        />
      </button>

      {/* Main Single Link for the whole card content */}
      <Link to={`/produit/${product.id}`} state={{ product }} className="flex w-full h-full">
        {/* Image Section */}
        <div className="w-2/5 relative overflow-hidden bg-gray-50 flex-shrink-0">
          <ShimmerImage
            src={product.primary_image || '/images/products/default.png'}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            fallback={'/images/products/default.png'}
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col justify-center text-left">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">({product.review_count || 0})</span>
          </div>

          <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-forest-green transition-colors leading-tight">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-base font-black text-forest-green">
              {product.price_formatted}
            </span>
            {product.has_discount && (
              <span className="text-xs text-gray-400 line-through">
                {product.old_price_formatted}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group relative">
      <Link to={`/produit/${product.id}`} state={{ product }} className="flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-white mb-1">
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
        </div>

        <div className="flex flex-col flex-grow text-left px-3 pb-3">
          <p className="text-[8px] text-gray-400 uppercase font-bold tracking-wider mb-0.5 leading-none">
            {product.category_name}
          </p>
          <h3 className="text-[11px] font-bold text-gray-800 mb-1 line-clamp-2 min-h-[1.6rem] leading-snug group-hover:text-forest-green transition-colors">
            {product.name}
          </h3>

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
      </Link>

      <button
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await toggleWishlist(product);
        }}
        className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Heart
          className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : ''}`}
        />
      </button>
    </div>
  );
}

// Skeleton Loader Component
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>;
}

// Review Form Modal
function ReviewModal({ isOpen, onClose, user }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reviews/shop', {
        rating,
        comment,
        title: 'Avis Boutique',
      });
      alert('Merci pour votre avis ! Il sera visible après modération.');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      const msg = error.response?.data?.message || "Erreur lors de l'envoi de l'avis.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="p-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">
              Donner mon avis
            </h3>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">
              Partagez votre expérience DMC
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Selector */}
            <div className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-3xl">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Votre Note
              </span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      className={`w-8 h-8 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                Votre Message
              </label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Dites-nous ce que vous avez pensé de nos services..."
                className="w-full bg-gray-50 border-none rounded-3xl px-6 py-4 text-sm focus:ring-2 focus:ring-forest-green h-32 resize-none"
              ></textarea>
            </div>

            {/* User Preview */}
            <div className="flex items-center gap-4 px-4 py-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-5 h-5 text-gray-300" />
                )}
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">
                  {user?.name || 'Utilisateur DMC'}
                </p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                  Votre profil public
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-4 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-forest-green transition-all shadow-xl disabled:opacity-50"
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, authenticated } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentPopup, setCurrentPopup] = useState(null);

  // Refs for scrolling sections
  const offersRef = useRef(null);
  const newProductsRef = useRef(null);
  const bestSellersRef = useRef(null);
  const categoriesRef = useRef(null);

  const [data, setData] = useState({
    featuredProducts: [],
    categories: [],
    specialOffers: [],
    newProducts: [],
    bestSellers: [],
    banners: [],
    reviews: [],
    reviewStats: { average: 4.2, total: 100, counts: { 5: 95, 4: 5, 3: 0, 2: 0, 1: 0 } },
  });

  const [activeBestSellerCat, setActiveBestSellerCat] = useState('TOUTES');
  const [activeNewProductCat, setActiveNewProductCat] = useState('Tous les produits');
  const [featuredSlideIndex, setFeaturedSlideIndex] = useState(0);
  const [isNewProductDropdownOpen, setIsNewProductDropdownOpen] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Auto-slide for hero banners
  useEffect(() => {
    if (!data.banners || data.banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev === data.banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [data.banners]);

  // Auto-slide for featured banner in Nouveautés section
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedSlideIndex((prev) => (prev === 2 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount =
        direction === 'left' ? -ref.current.offsetWidth : ref.current.offsetWidth;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/home');
        setData({
          featuredProducts:
            response.data.featuredProducts?.data || response.data.featuredProducts || [],
          categories: response.data.categories?.data || response.data.categories || [],
          specialOffers: response.data.specialOffers || [],
          newProducts: response.data.newProducts?.data || response.data.newProducts || [],
          bestSellers: response.data.bestSellers?.data || response.data.bestSellers || [],
          banners: response.data.banners || [],
          reviews: response.data.reviews || [],
          reviewStats: response.data.reviewStats || {
            average: 4.2,
            total: 100,
            counts: { 5: 95, 4: 5, 3: 0, 2: 0, 1: 0 },
          },
        });

        // Handle Popup
        const popups = response.data.banners.filter((b) => b.type === 'popup');
        if (popups.length > 0) {
          setCurrentPopup(popups[0]);
          const timer = setTimeout(() => {
            setIsPopupVisible(true);
          }, 2000);

          if (popups[0].display_duration) {
            setTimeout(() => setIsPopupVisible(false), (popups[0].display_duration + 2) * 1000);
          }

          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la home', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeNewProductCategories = [
    'Tous les produits',
    ...new Set(
      (data.newProducts || []).map((p) => p.category_name || p.category?.name).filter(Boolean)
    ),
  ];

  const filteredNewProducts = (data.newProducts || []).filter((p) => {
    if (activeNewProductCat === 'Tous les produits') return true;
    const prodCat = p.category_name || p.category?.name;
    return prodCat === activeNewProductCat;
  });

  // Determine source for "Meilleures Ventes" with fallback to featured products
  const bestSellersSource =
    data.bestSellers && data.bestSellers.length > 0
      ? data.bestSellers
      : data.featuredProducts || [];

  const bestSellerCategories = [
    'TOUTES',
    ...new Set(bestSellersSource.map((p) => p.category_name || p.category?.name).filter(Boolean)),
  ];

  const filteredBestSellers = bestSellersSource.filter((p) => {
    if (activeBestSellerCat === 'TOUTES') return true;
    const prodCat = p.category_name || p.category?.name;
    return prodCat === activeBestSellerCat;
  });

  const totalSlides = Math.ceil((data.featuredProducts?.length || 0) / itemsPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <MainLayout>
      <Head>
        <title>DMC - Boutique Informatique à Dakar, Sénégal</title>
        <meta
          name="description"
          content="DMC SARL : Votre expert informatique à Dakar. Vente d'ordinateurs (HP, Dell, Apple), accessoires, maintenance et solutions tech premium au Sénégal."
        />
        <meta property="og:title" content="DMC - Boutique Informatique" />
        <meta
          property="og:description"
          content="Expert informatique à Dakar : Vente, Entretien et Conseil."
        />
        <meta property="og:image" content="/images/logo.png" />
      </Head>
      {/* Hero and Featured Products with Gradient Background */}
      <div className="bg-gradient-dark-green" style={{ marginTop: '-7%' }}>
        {/* Hero Section */}
        <section className="header py-16 relative overflow-hidden min-h-[500px] flex items-center">
          <div className="container mx-auto px-4 z-10">
            {data.banners.filter(
              (b) => b.type === 'slider' || (b.type === 'banner' && b.position === 'top')
            ).length > 0 ? (
              <div className="relative">
                {data.banners
                  .filter(
                    (b) => b.type === 'slider' || (b.type === 'banner' && b.position === 'top')
                  )
                  .map((banner, index) => (
                    <div
                      key={banner.id}
                      className={`transition-opacity duration-700 ease-in-out absolute inset-0 ${index === currentHeroSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      style={{
                        position: index === currentHeroSlide ? 'relative' : 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                      }}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Hero Text */}
                        <div className="space-y-6 text-left">
                          <p className="text-neon-green text-lg font-bold uppercase animate-in slide-in-from-left duration-700 delay-100">
                            {banner.type === 'banner'
                              ? 'Offre Spéciale'
                              : 'Chez DAROUL Mouhty COMPUTER - SARL'}
                          </p>

                          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase leading-tight animate-in slide-in-from-left duration-700 delay-200">
                            {banner.title}
                          </h1>

                          {banner.description && (
                            <p className="text-neon-green text-xl md:text-2xl font-bold animate-in slide-in-from-left duration-700 delay-300">
                              {banner.description}
                            </p>
                          )}

                          <Link
                            to={banner.link || banner.button_link || '/shop'}
                            className="inline-block px-8 py-4 text-base bg-neon-green text-black font-bold uppercase rounded hover:bg-white transition-colors animate-in zoom-in duration-500 delay-500"
                          >
                            {banner.button_text || 'Acheter Maintenant'}
                          </Link>
                        </div>

                        {/* Hero Images */}
                        <div className="relative h-96 lg:h-[500px] flex items-center justify-center">
                          <img
                            src={banner.image || '/images/placeholder.png'}
                            alt={banner.title}
                            className="w-full h-full object-contain animate-in fade-in zoom-in duration-1000"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Slider Navigation Arrows */}
                {data.banners.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentHeroSlide((prev) =>
                          prev === 0 ? data.banners.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 rounded-full bg-white/10 hover:bg-neon-green hover:text-black text-white flex items-center justify-center z-20 backdrop-blur-sm transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentHeroSlide((prev) =>
                          prev === data.banners.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 rounded-full bg-white/10 hover:bg-neon-green hover:text-black text-white flex items-center justify-center z-20 backdrop-blur-sm transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                      {data.banners.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentHeroSlide(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === currentHeroSlide ? 'bg-neon-green w-6' : 'bg-white/30'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 items-center">
                {/* Hero Text (Fallback) */}
                <div className="space-y-2 z-10" style={{ marginTop: '3%' }}>
                  <p className="text-neon-green text-lg font-bold uppercase">
                    Chez DAROUL Mouhty COMPUTER - SARL
                  </p>

                  <h1 className="text-3xl md:text-2xl lg:text-3xl font-bold text-white uppercase leading-tight">
                    Retrouver le Meilleur matériels informatiques
                  </h1>

                  <p className="text-neon-green text-1xl font-bold">À PARTIR DE 75.000 FCFA</p>

                  <Link
                    to="/shop"
                    className="inline-block px-8 py-4 text-base bg-neon-green text-black font-bold uppercase rounded hover:bg-white transition-colors"
                  >
                    Acheter Maintenant
                  </Link>
                </div>

                {/* Hero Images (Fallback) */}
                <div className="relative h-80 lg:h-[320px]">
                  <img
                    src="/images/hero-slider-1.png"
                    alt="Gaming Setup"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <img
                    src="/images/hero-slider-2.png"
                    alt="Laptop"
                    className="absolute -top-20 right-50 w-24 h-24 object-contain rotate-145"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Featured Products Carousel */}
        <section className="py-0 bg-transparent pb-16">
          <div className="container mx-auto px-4">
            <div className="relative">
              {/* Products Carousel */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)` }}
                >
                  {loading
                    ? [...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          style={{ width: `${100 / itemsPerView}%` }}
                          className="flex-shrink-0 px-3"
                        >
                          <Skeleton className="h-44 w-full" />
                        </div>
                      ))
                    : data.featuredProducts?.map((product, index) => (
                        <div
                          key={index}
                          style={{ width: `${100 / itemsPerView}%` }}
                          className="flex-shrink-0 px-3"
                        >
                          <HorizontalProductCard product={product} />
                        </div>
                      ))}
                </div>
              </div>

              {/* Navigation Buttons - Hidden on Mobile */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 items-center justify-center bg-gray-200 hover:bg-neon-green transition-colors rounded-full z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-black" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 items-center justify-center bg-gray-200 hover:bg-neon-green transition-colors rounded-full z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-black" />
                  </button>

                  {/* Mobile/Tablet Arrows Overlay */}
                  <div className="lg:hidden absolute inset-y-0 left-0 flex items-center">
                    <button
                      onClick={prevSlide}
                      className="bg-black/20 backdrop-blur-sm p-2 rounded-r-xl text-white"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="lg:hidden absolute inset-y-0 right-0 flex items-center">
                    <button
                      onClick={nextSlide}
                      className="bg-black/20 backdrop-blur-sm p-2 rounded-l-xl text-white"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Slide Indicators */}
                  <div className="flex items-center justify-center gap-2 mt-6">
                    {[...Array(totalSlides)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                          currentSlide === index ? 'bg-neon-green' : 'bg-gray-400'
                        }`}
                      ></button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="relative">
            {/* Navigation Arrows - Only show if more than 8 categories */}
            {data.categories && data.categories.length > 8 && (
              <>
                <button
                  onClick={() => scroll(categoriesRef, 'left')}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-400 hover:text-forest-green z-30 transition-all border border-gray-100 hidden md:flex"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll(categoriesRef, 'right')}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-400 hover:text-forest-green z-30 transition-all border border-gray-100 hidden md:flex"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Categories Horizontal Scroll */}
            <div
              ref={categoriesRef}
              className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            >
              {loading
                ? [...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-[calc(12.5%-0.5rem)] min-w-[120px] snap-start"
                    >
                      <Skeleton className="h-32 w-full" />
                    </div>
                  ))
                : data.categories?.map((category, index) => (
                    <Link
                      key={index}
                      to={`/categorie/${category.slug}`}
                      className="flex-shrink-0 w-[calc(12.5%-0.5rem)] min-w-[120px] bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow px-3 py-4 flex flex-col items-center text-center group snap-start"
                    >
                      <img
                        src={resolveCategoryImage(category)}
                        alt={category.name}
                        className="w-14 h-14 mx-auto mb-2 object-contain group-hover:scale-110 transition-transform"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                        }}
                      />
                      <h3 className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2">
                        {category.name}
                      </h3>
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* Middle Banners */}
      {data.banners
        .filter((b) => b.type === 'banner' && b.position === 'middle')
        .map((banner) => (
          <StaticBanner key={banner.id} banner={banner} />
        ))}

      {/* Special Offers Section */}
      {data.specialOffers && data.specialOffers.length > 0 && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-1xl font-bold text-gray-900 uppercase">Offres du moment</h2>
              <div className="flex gap-1">
                <button
                  onClick={() => scroll(offersRef, 'left')}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded hover:bg-neon-green transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll(offersRef, 'right')}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded hover:bg-neon-green transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left hero image */}
              <div className="lg:w-1/5 hidden md:block">
                <img
                  src="/images/offers/laptop-colorful.jpg"
                  alt="Special Offer"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Horizontal offers list */}
              <div className="lg:w-3/4 relative">
                <div
                  ref={offersRef}
                  className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-3 px-3 scrollbar-hide snap-x"
                >
                  {data.specialOffers.map((offer, index) => (
                    <div
                      key={index}
                      className="min-w-[280px] md:min-w-[360px] bg-white border border-gray-200 rounded-lg shadow p-3 md:p-4 flex gap-4 snap-start"
                    >
                      <Link to={`/produit/${offer.id}`} className="w-32 flex-shrink-0 group">
                        <img
                          src={offer.primary_image}
                          alt={offer.name}
                          className="w-full h-28 object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        {offer.is_on_sale && (
                          <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded">
                            SOLDE
                          </span>
                        )}
                      </Link>

                      <div className="flex-1 flex flex-col justify-between">
                        <Link to={`/produit/${offer.id}`} className="group">
                          <p className="text-gray-500 text-[10px] font-bold uppercase group-hover:text-forest-green transition-colors">
                            {offer.category_name}
                          </p>
                          <h3 className="text-xs font-bold group-hover:text-forest-green transition-colors line-clamp-2 leading-tight mb-1">
                            {offer.name}
                          </h3>

                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm font-black text-red-600">
                              {offer.price_formatted}
                            </span>
                            {offer.has_discount && (
                              <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
                                -{offer.discount_percentage}%
                              </span>
                            )}
                          </div>

                          <ul className="mt-2 space-y-0.5 text-[10px] text-gray-600">
                            {offer.features?.slice(0, 2).map((feature, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <Check className="w-3 h-3 text-forest-green" />
                                <span className="truncate">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </Link>

                        <div className="mt-4">
                          <div className="mt-2">
                            <div className="w-1/2 h-1 bg-gray-200 rounded-xs overflow-hidden">
                              <div
                                className="h-1 bg-forest-green"
                                style={{ width: `${offer.stock_quantity > 0 ? 30 : 100}%` }}
                              ></div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">
                              Disponible : {offer.stock_quantity}
                            </p>
                          </div>

                          <div className="mt-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart(offer.product || offer);
                              }}
                              className="w-2/3 px-3 py-2 text-xs bg-forest-green text-white  rounded hover:bg-dark-green transition-colors"
                            >
                              Ajout au panier
                            </button>
                            <p className="text-xs text-gray-500 mt-2">SKU: {offer.sku}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Detail Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-1xl font-bold mb-2">Dell Desktop Ultrasharp 32 U3223QE</h3>
                <p className="text-xs text-gray-600 mb-4">
                  Écran 4K+ avec des couleurs réalistes. Avec 1,5 million de pixels supplémentaires
                  par rapport à la 4K standard, vous bénéficierez d'une vision plus large et plus
                  claire, tant au travail que dans la vie.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6 text-xs text-gray-700">
                  <div className="flex items-start gap-3">
                    <img src="/images/icons/monitor.jpeg" alt="4K+" className="w-8 h-8" />
                    <div>
                      <strong>4K+</strong>
                      <div className="text-xs">Écran 4K+ Ultra HD</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <img src="/images/icons/palette.jpeg" alt="DCI-P3" className="w-8 h-8" />
                    <div>
                      <strong>DCI-P3</strong>
                      <div className="text-xs">Gamme de couleurs de niveau cinéma</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <img src="/images/icons/sun.jpeg" alt="HDR" className="w-8 h-8" />
                    <div>
                      <strong>HDR</strong>
                      <div className="text-xs">Plage dynamique élevée</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <img src="/images/icons/usb.jpeg" alt="USB-C" className="w-8 h-8" />
                    <div>
                      <strong>USB-C</strong>
                      <div className="text-xs">Connecteur USB-C</div>
                    </div>
                  </div>
                </div>

                <Link to="/shop" className="inline-block mt-6 text-forest-green font-bold">
                  Voir Plus →
                </Link>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                <img
                  src="/images/products/speaker-3.png"
                  alt="Monitor"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
              <h2 className="text-1xl font-bold text-gray-900 uppercase">NOUVEAUTÉS</h2>
              <div className="hidden md:block h-4 w-px bg-gray-200"></div>
              <div className="relative flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-gray-400">
                <span className="hidden md:inline">Trier Par</span>
                <button
                  onClick={() => setIsNewProductDropdownOpen(!isNewProductDropdownOpen)}
                  className="flex items-center gap-1 text-forest-green hover:text-dark-green transition-colors uppercase tracking-widest"
                >
                  {activeNewProductCat}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${isNewProductDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isNewProductDropdownOpen && (
                  <div className="absolute top-full left-16 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                    <button
                      onClick={() => {
                        setActiveNewProductCat('Tous les produits');
                        setIsNewProductDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${activeNewProductCat === 'Tous les produits' ? 'text-forest-green font-bold' : ''}`}
                    >
                      Tous les produits
                    </button>
                    {activeNewProductCategories
                      .filter((cat) => cat !== 'Tous les produits')
                      .map((catName) => (
                        <button
                          key={catName}
                          onClick={() => {
                            setActiveNewProductCat(catName);
                            setIsNewProductDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${activeNewProductCat === catName ? 'text-forest-green font-bold' : ''}`}
                        >
                          {catName}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1 mr-4">
                <button
                  onClick={() => scroll(newProductsRef, 'left')}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-forest-green rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-2 bg-gray-50 text-gray-400 hover:text-forest-green rounded-lg transition-colors">
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll(newProductsRef, 'right')}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-forest-green rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Featured Banner */}
            <div className="lg:col-span-4 flex flex-col items-center text-center bg-gray-50/50 rounded-2xl p-8 border border-gray-100/50">
              <div className="mb-10">
                <p className="text-[10px] font-black text-forest-green uppercase tracking-widest mb-2">
                  NOUVELLES ARRIVAGES
                </p>
                <h3 className="text-xl font-bold text-gray-900 uppercase mb-4 leading-tight min-h-[3rem]">
                  {filteredNewProducts[featuredSlideIndex]?.name || 'NOUVEAUX ARRIVAGES'}
                </h3>
                <Link
                  to={
                    filteredNewProducts[featuredSlideIndex]
                      ? `/produit/${filteredNewProducts[featuredSlideIndex].id}`
                      : '/shop'
                  }
                  className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-forest-green transition-colors group"
                >
                  Voir Plus
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-700 h-full"
                  style={{ transform: `translateX(-${featuredSlideIndex * 100}%)` }}
                >
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="min-w-full h-full flex items-center justify-center p-4">
                      <img
                        src={
                          filteredNewProducts[i]?.primary_image || '/images/home/laptop-feature.png'
                        }
                        alt="Featured Product"
                        className="w-full h-full object-contain"
                        onError={(e) => (e.target.src = '/images/home/laptop-feature.png')}
                      />
                    </div>
                  ))}
                </div>
                {/* Carousel dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setFeaturedSlideIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${featuredSlideIndex === i ? 'bg-forest-green w-4' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Products Grid (2 lines of 4 products, paginated) */}
            <div
              ref={newProductsRef}
              className="lg:col-span-8 flex overflow-x-hidden gap-4 scrollbar-hide snap-x"
            >
              {loading ? (
                <div className="min-w-full grid grid-cols-2 lg:grid-cols-4 gap-3 h-full">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="aspect-square w-full" />
                  ))}
                </div>
              ) : filteredNewProducts.length > 0 ? (
                Array.from({ length: Math.ceil(filteredNewProducts.length / 8) }).map(
                  (_, slideIndex) => (
                    <div
                      key={slideIndex}
                      className="min-w-full grid grid-cols-2 lg:grid-cols-4 gap-4 snap-start pb-2"
                    >
                      {filteredNewProducts
                        .slice(slideIndex * 8, (slideIndex + 1) * 8)
                        .map((product, pIndex) => (
                          <ProductCard key={pIndex} product={product} />
                        ))}
                    </div>
                  )
                )
              ) : (
                <div className="min-w-full flex items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">
                    Aucun produit trouvé dans cette catégorie.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-white border-t border-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">
              RECHERCHER PAR MARQUE
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              {
                name: 'Acer',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_2011.svg',
              },
              {
                name: 'Asus',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg',
              },
              {
                name: 'Dell',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg',
              },
              {
                name: 'Apple',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
              },
              {
                name: 'Lenovo',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg',
              },
              {
                name: 'HP',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/330px-HP_logo_2012.svg.png',
              },
            ].map((brand, i) => (
              <Link
                key={i}
                to={`/shop?search=${brand.name}`}
                className="h-24 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-6 grayscale hover:grayscale-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
            {/* Company Description */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl md:text-xl font-black text-gray-900 uppercase tracking-tight">
                Daroul Mouhty Computer Sarl
              </h2>
              <div className="space-y-2 text-gray-500 text-[5px] md:text-base leading-relaxed max-w-1xl text-justify">
                <p>
                  Votre destination unique pour tous vos besoins informatiques. <br />
                  Nous sommes une société informatique leader basée au Sénégal, offrant une large
                  gamme d'ordinateurs portables, d'ordinateurs de bureau et d'accessoires
                  informatiques de haute qualité à des prix imbattables. Que ce soit que vous soyez
                  un professionnel férus de technologie, un étudiant ou un passionné de jeux, nous
                  avons la solution parfaite pour répondre à vos exigences.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-x-8 gap-y-12 py-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-1">
                  <span className="text-2xl font-black text-gray-900 tracking-tighter">5.000</span>
                  <span className="text-xl font-black text-forest-green">+</span>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-tight">
                  Produits
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-1">
                  <span className="text-2xl font-black text-gray-900 tracking-tighter">10</span>
                  <span className="text-xl font-black text-forest-green">+</span>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-tight">
                  Catégories de produits
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-1">
                  <span className="text-2xl font-black text-gray-900 tracking-tighter">4.000</span>
                  <span className="text-xl font-black text-forest-green">+</span>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-tight">
                  Les produits ont été vendus
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-1">
                  <span className="text-2xl font-black text-gray-900 tracking-tighter">500</span>
                  <span className="text-xl font-black text-forest-green">+</span>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-tight">
                  Clients satisfaits
                </p>
              </div>
            </div>
          </div>

          {/* Service Features - Vertical Layout with Circles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
            {[
              {
                icon: '/images/icons/delivery.png',
                title: 'Livraison partout au senegal',
                desc: 'Livraison rapide et sécurisée dans tout le pays',
              },
              {
                icon: '/images/icons/payment.png',
                title: 'Paiements Sécurisée',
                desc: 'Nous acceptons Visa, Mastercard et mobile money',
              },
              {
                icon: '/images/icons/shield.png',
                title: 'Garantie 3 à 12 mois',
                desc: 'Tous nos produits sont garantis contre les défauts',
              },
              {
                icon: '/images/icons/settings.png',
                title: 'Service client réactif',
                desc: 'Contactez-nous 24/7 - Appelez: +221 77 236 77 77',
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mb-6 border border-gray-50 group-hover:scale-110 transition-transform duration-500">
                  <img src={feature.icon} alt="" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[200px]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Reviews / Testimonials Section */}
          <div className="max-w-6xl mx-auto pt-12 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Rating Summary Card */}
              <div className="lg:col-span-3 bg-black rounded-[1.5rem] p-4 flex flex-col items-center justify-center text-white h-fit self-center">
                <div className="text-center">
                  <h4 className="text-4xl font-black mb-0.5">{data.reviewStats.average}</h4>
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                    Basé sur {data.reviewStats.total} avis
                  </p>
                  <div className="space-y-1 w-full px-2 mb-4">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = data.reviewStats.counts[star] || 0;
                      const perc =
                        data.reviewStats.total > 0 ? (count / data.reviewStats.total) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <div className="flex gap-0.5 w-10">
                            {[...Array(5)].map((_, si) => (
                              <Star
                                key={si}
                                className={`w-1 h-1 ${si < star ? 'text-neon-green fill-neon-green' : 'text-gray-900'}`}
                              />
                            ))}
                          </div>
                          <div className="flex-1 h-0.5 bg-gray-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-neon-green"
                              style={{ width: `${perc}%` }}
                            ></div>
                          </div>
                          <span className="text-[6px] font-bold text-gray-600 w-4">
                            {Math.round(perc)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!authenticated) {
                      alert('Veuillez vous connecter pour laisser un avis.');
                      return;
                    }
                    setIsReviewModalOpen(true);
                  }}
                  className="w-full bg-white/5 hover:bg-neon-green hover:text-black py-2.5 rounded-lg text-[7px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-2.5 h-2.5" />
                  Donner mon avis
                </button>
              </div>

              {/* Testimonial Cards */}
              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4 h-fit">
                {data.reviews.length > 0
                  ? data.reviews.map((testi, i) => (
                      <div
                        key={testi.id || i}
                        className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-50 flex flex-col items-center text-center group hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative mb-2">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-50 shadow-sm flex items-center justify-center bg-gray-50">
                            {testi.avatar ? (
                              <img
                                src={testi.avatar}
                                alt={testi.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-gray-300" />
                            )}
                          </div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white shadow-xs rounded-full p-1 z-10">
                            <svg
                              className="w-2 h-2 text-forest-green"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9125 16 16.0171 16H19.0171V14.5C19.0171 13.1193 17.8978 12 16.5171 12H15.5171V10H16.5171C19.0023 10 21.0171 12.0147 21.0171 14.5V21H14.017ZM3 21L3 18C3 16.8954 3.89543 16 5 16H8V14.5C8 13.1193 6.88071 12 5.5 12H4.5V10H5.5C7.98528 10 10 12.0147 10 14.5V21H3Z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(5)].map((_, si) => (
                            <Star
                              key={si}
                              className={`w-2 h-2 ${si < testi.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium italic leading-[1.4] mb-3 line-clamp-4">
                          "{testi.comment}"
                        </p>
                        <div className="mt-auto">
                          <h5 className="text-[9px] font-black text-gray-900 uppercase tracking-widest mb-0.5">
                            {testi.name}
                          </h5>
                          <p className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter">
                            {testi.date}
                          </p>
                        </div>
                      </div>
                    ))
                  : // Fallback text if no real reviews yet
                    [
                      {
                        name: 'Ali Traoré',
                        role: 'Étudiant',
                        text: "Un endroit parfait surtout pour étudiants ou jeunes professionnels. Bon prix pour une très bonne qualité d'ordinateurs... Je recommande vivement",
                      },
                      {
                        name: 'Kayzo Offishal (Zo)',
                        role: 'Client Fidéle',
                        text: "Cadre propre, climatisé, accueil chaleureux, on y sert même du café et de l'eau. Ils vendent de bon ordinateurs, fiables et avec garantie.",
                      },
                      {
                        name: 'Anta Fall',
                        role: 'Designer',
                        text: "Pour ceux qui cherchent des ordis faites y un tour vous n'allez pas le regretter. Prix défiant toute concurrence",
                      },
                    ].map((testi, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-50 flex flex-col items-center text-center group hover:shadow-lg transition-all duration-300 opacity-60"
                      >
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(5)].map((_, si) => (
                            <Star key={si} className="w-2 h-2 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium italic leading-[1.4] mb-3">
                          "{testi.text}"
                        </p>
                        <div className="mt-auto">
                          <h5 className="text-[9px] font-black text-gray-900 uppercase tracking-widest mb-0.5">
                            {testi.name}
                          </h5>
                          <p className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter">
                            {testi.role}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          {/* Meilleures Ventes Section */}
          <div className="max-w-6xl mx-auto pb-12 md:pb-24 px-4 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">
                MEILLEURES VENTES
              </h2>
              <div className="flex items-center gap-4 md:gap-6 justify-between md:justify-end">
                <div className="flex gap-4 md:gap-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide">
                  {bestSellerCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveBestSellerCat(cat)}
                      className={`${activeBestSellerCat === cat ? 'text-forest-green underline decoration-2 underline-offset-8 shrink-0' : 'text-gray-400 hover:text-gray-600 shrink-0'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => scroll(bestSellersRef, 'left')}
                    className="p-1.5 text-gray-300 hover:text-gray-600"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 text-gray-400">
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => scroll(bestSellersRef, 'right')}
                    className="p-1.5 text-gray-300 hover:text-gray-600"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div
              ref={bestSellersRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x pt-2"
            >
              {loading
                ? [...Array(5)].map((_, i) => (
                    <div key={i} className="min-w-[45%] md:min-w-[19%] snap-start">
                      <Skeleton className="aspect-square w-full" />
                    </div>
                  ))
                : filteredBestSellers.map((product, index) => (
                    <div key={index} className="min-w-[45%] md:min-w-[19%] snap-start">
                      <ProductCard product={product} />
                    </div>
                  ))}
            </div>
          </div>

          {/* Bottom Banners */}
          {data.banners
            .filter((b) => b.type === 'banner' && b.position === 'bottom')
            .map((banner) => (
              <StaticBanner key={banner.id} banner={banner} className="py-12" />
            ))}

          {/* Trending Tags Section */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-widest mb-8 text-center">
              TAGS TENDANCES
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Boutique Informatique',
                'Ordinateurs Portables',
                'Ordinateur Portable Pas Cher',
                'Ordinateurs Bureau',
                'Accessoires Informatiques',
                'Chargeurs Ordinateurs',
                'Souris & Clavier',
                'Dell',
                'Acer',
                'MacBook',
                'Asus',
                'HP',
                'Lenovo',
                'Toshiba',
              ].map((tag, i) => (
                <Link
                  key={i}
                  to={`/shop?search=${tag}`}
                  className="px-5 py-1 bg-gray-50 hover:bg-forest-green hover:text-white rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest transition-all"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Review Form Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        user={user}
      />

      {/* Popup Banner */}
      {isPopupVisible && (
        <PopupBanner banner={currentPopup} onClose={() => setIsPopupVisible(false)} />
      )}
    </MainLayout>
  );
}
