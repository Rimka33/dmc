import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// Countdown Component
function Countdown({ endDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

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
                hours: String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
                minutes: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
                seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0')
            });
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [endDate]);

    return (
        <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-100 rounded p-2 text-center">
                <div className="text-sm font-bold">{timeLeft.days}</div>
                <div className="text-xs">Jours</div>
            </div>
            <div className="bg-gray-100 rounded p-2 text-center">
                <div className="text-sm font-bold">{timeLeft.hours}</div>
                <div className="text-xs">Heures</div>
            </div>
            <div className="bg-gray-100 rounded p-2 text-center">
                <div className="text-sm font-bold">{timeLeft.minutes}</div>
                <div className="text-xs">Mins</div>
            </div>
            <div className="bg-gray-100 rounded p-2 text-center">
                <div className="text-sm font-bold">{timeLeft.seconds}</div>
                <div className="text-xs">Secs</div>
            </div>
        </div>
    );
}

// Product Card Component
function ProductCard({ product }) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
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
                <p className="text-xs text-gray-500 uppercase mb-1">{product.category_name}</p>
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
                    <span className="text-sm text-gray-500 ml-1">({product.review_count || 0})</span>
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
        </div>
    );
}

export default function Home() {
    const [data, setData] = useState({
        featuredProducts: [],
        categories: [],
        specialOffers: [],
        newProducts: []
    });
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerView = 3;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/home');
                setData({
                    featuredProducts: response.data.featuredProducts || [],
                    categories: response.data.categories || [],
                    specialOffers: response.data.specialOffers || [],
                    newProducts: response.data.newProducts || []
                });
            } catch (error) {
                console.error("Erreur lors du chargement de la home", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* Hero and Featured Products with Gradient Background */}
            <div style={{ background: 'linear-gradient(to bottom, rgba(1, 26, 10, 1), rgba(5, 128, 49, 1))' }}>
                {/* Hero Section */}
                <section className="header py-16 relative overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Hero Text */}
                            <div className="space-y-6 z-10">
                                <p className="text-neon-green text-lg font-bold uppercase">
                                    Chez DAROUL Mouhty COMPUTER - SARL
                                </p>

                                <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-white uppercase leading-tight">
                                    Retrouver le Meilleur matériels informatiques
                                </h1>

                                <p className="text-neon-green text-2xl font-bold">
                                    À PARTIR DE 75.000 FCFA
                                </p>

                                <Link to="/shop" className="inline-block px-8 py-4 text-base bg-neon-green text-black font-bold uppercase rounded hover:bg-white transition-colors">
                                    Acheter Maintenant
                                </Link>
                            </div>

                            {/* Hero Images */}
                            <div className="relative h-96 lg:h-[500px]">
                                <img
                                    src="/images/hero-slider-1.png"
                                    alt="Gaming Setup"
                                    className="absolute inset-0 w-full h-full object-contain"
                                />
                                <img
                                    src="/images/hero-slider-2.png"
                                    alt="Laptop"
                                    className="absolute top-10 -right-20 w-25 h-25 object-contain rotate-180"
                                />
                            </div>
                        </div>

                        {/* Slider Navigation */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button className="w-8 h-8 flex items-center justify-center bg-white/10 rounded hover:bg-neon-green transition-colors">
                                <i className="icon-chevron-left text-white"></i>
                            </button>
                            <div className="flex gap-2">
                                <span className="text-white font-bold">1</span>
                                <span className="text-white">-</span>
                                <span className="text-white font-bold">2</span>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center bg-white/10 rounded hover:bg-neon-green transition-colors">
                                <i className="icon-chevron-right text-white"></i>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Featured Products Carousel */}
                <section className="py-0 bg-transparent pb-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-white uppercase mb-8">Produits en vedette</h2>

                        <div className="relative">
                            {/* Products Carousel */}
                            <div className="overflow-hidden">
                                <div
                                    className="flex transition-transform duration-500 ease-out"
                                    style={{ transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)` }}
                                >
                                    {data.featuredProducts?.map((product, index) => (
                                        <div
                                            key={index}
                                            style={{ width: `${100 / itemsPerView}%` }}
                                            className="flex-shrink-0 px-3"
                                        >
                                            <Link to={`/produit/${product.id}`}>
                                                <ProductCard product={product} />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            {totalSlides > 1 && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 flex items-center justify-center bg-gray-200 hover:bg-neon-green transition-colors rounded-full z-10"
                                    >
                                        <i className="icon-chevron-left text-black text-xl"></i>
                                    </button>

                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 flex items-center justify-center bg-gray-200 hover:bg-neon-green transition-colors rounded-full z-10"
                                    >
                                        <i className="icon-chevron-right text-black text-xl"></i>
                                    </button>

                                    {/* Slide Indicators */}
                                    <div className="flex items-center justify-center gap-2 mt-6">
                                        {[...Array(totalSlides)].map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentSlide(index)}
                                                className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentSlide === index ? 'bg-neon-green' : 'bg-gray-400'
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
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {data.categories?.map((category, index) => (
                            <Link
                                key={index}
                                to={`/categorie/${category.slug}`}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col items-center text-center group"
                            >
                                <img
                                    src={category.icon}
                                    alt={category.name}
                                    className="w-20 h-20 mx-auto mb-4 object-contain group-hover:scale-110 transition-transform"
                                />
                                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                                    {category.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Special Offers Section */}
            {data.specialOffers && data.specialOffers.length > 0 && (
                <section className="py-8 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-3xl font-bold text-gray-900 uppercase">Offres du moment</h2>
                            <div className="flex gap-1">
                                <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded hover:bg-neon-green transition-colors">
                                    <i className="icon-chevron-left"></i>
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded hover:bg-neon-green transition-colors">
                                    <i className="icon-chevron-right"></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left hero image */}
                            <div className="lg:w-1/3 hidden md:block">
                                <img
                                    src="/images/offers/laptop-colorful.jpg"
                                    alt="Special Offer"
                                    className="w-full h-full object-cover rounded-lg shadow-md"
                                />
                            </div>

                            {/* Horizontal offers list */}
                            <div className="lg:w-2/3">
                                <div className="flex gap-6 overflow-x-auto pb-4 -mx-3 px-3">
                                    {data.specialOffers.map((offer, index) => (
                                        <div key={index} className="min-w-[420px] bg-white border border-gray-200 rounded-lg shadow p-4 flex gap-4">
                                            <div className="w-36 flex-shrink-0">
                                                <img
                                                    src={offer.primary_image}
                                                    alt={offer.name}
                                                    className="w-full h-28 object-contain"
                                                />
                                                {offer.is_on_sale && (
                                                    <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded">
                                                        SOLDE
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <p className="text-gray-500 text-xs font-bold uppercase">{offer.category_name}</p>
                                                    <h3 className="text-lg font-semibold">{offer.name}</h3>

                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-2xl font-bold text-red-600">
                                                            {offer.price_formatted}
                                                        </span>
                                                        {offer.has_discount && (
                                                            <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold">
                                                                -{offer.discount_percentage}%
                                                            </span>
                                                        )}
                                                    </div>

                                                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                                                        {offer.features?.slice(0, 3).map((feature, i) => (
                                                            <li key={i} className="flex items-center gap-2">
                                                                <i className="icon-check text-forest-green"></i>
                                                                <span>{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="mt-4">
                                                    {/* On pourrait ajouter un timer ici si l'API renvoie une date de fin */}

                                                    <div className="mt-3">
                                                        <div className="h-2 bg-gray-200 rounded overflow-hidden">
                                                            <div
                                                                className="h-full bg-forest-green"
                                                                style={{ width: `${(offer.stock_quantity > 0 ? 30 : 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            Disponible : {offer.stock_quantity}
                                                        </p>
                                                    </div>

                                                    <div className="mt-3">
                                                        <button className="w-full px-4 py-2 bg-forest-green text-white font-bold rounded hover:bg-dark-green transition-colors">
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
                                <h3 className="text-2xl font-bold mb-2">Dell Desktop Ultrasharp 32 U3223QE</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Écran 4K+ avec des couleurs réalistes. Avec 1,5 million de pixels supplémentaires par rapport à la 4K standard, vous bénéficierez d'une vision plus large et plus claire, tant au travail que dans la vie.
                                </p>

                                <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-gray-700">
                                    <div className="flex items-start gap-3">
                                        <i className="icon-monitor"></i>
                                        <div>
                                            <strong>4K+</strong>
                                            <div className="text-xs">Écran 4K+ Ultra HD</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <i className="icon-palette"></i>
                                        <div>
                                            <strong>DCI-P3</strong>
                                            <div className="text-xs">Gamme de couleurs de niveau cinéma</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <i className="icon-sun"></i>
                                        <div>
                                            <strong>HDR</strong>
                                            <div className="text-xs">Plage dynamique élevée</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <i className="icon-usb"></i>
                                        <div>
                                            <strong>USB-C</strong>
                                            <div className="text-xs">Connecteur USB-C</div>
                                        </div>
                                    </div>
                                </div>

                                <Link to="/shop" className="inline-block mt-6 text-forest-green font-bold">Voir Plus →</Link>
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
            {data.newProducts && data.newProducts.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-bold text-gray-900 uppercase">NOUVEAUTÉS</h2>
                                <div className="h-6 w-px bg-gray-900"></div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">Trier Par</span>
                                    <select className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neon-green">
                                        <option>Ordinateurs Portables</option>
                                        <option>Ordinateurs Bureau</option>
                                        <option>Accessoires</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="w-10 h-10 flex items-center justify-center bg-white rounded hover:bg-neon-green transition-colors">
                                    <i className="icon-chevron-left"></i>
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center bg-white rounded hover:bg-neon-green transition-colors">
                                    <i className="icon-chevron-right"></i>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Left: Large Feature */}
                            <div className="lg:col-span-4 order-2 lg:order-1">
                                <div className="hidden md:flex flex-col justify-between h-full">
                                    <div className="mb-6">
                                        <p className="text-neon-green text-sm font-bold uppercase">NOUVELLES ARRIVAGES</p>
                                        <h3 className="text-2xl font-bold uppercase text-gray-900 mt-2">ORDINATEURS PORTABLES</h3>
                                        <Link to="/shop" className="inline-block mt-3 text-sm text-forest-green font-bold">Voir Plus →</Link>
                                    </div>

                                    <div className="w-full">
                                        <img
                                            src="/images/products/speaker-2.png"
                                            alt="Ordinateurs Portables"
                                            className="w-full h-auto object-contain rounded-lg shadow-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Products grid */}
                            <div className="lg:col-span-8 order-1 lg:order-2">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {data.newProducts.slice(0, 8).map((product, index) => (
                                        <Link key={index} to={`/produit/${product.id}`}>
                                            <ProductCard product={product} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Company Stats Section */}
            <section className="py-16 bg-light-gray-bg">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                        {/* Company Description */}
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-gray-900">Daroul Mouhty Computer Sarl</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Votre destination unique pour tous vos besoins informatiques. Nous sommes une société informatique leader basée au Sénégal, offrant une large gamme d'ordinateurs portables, d'ordinateurs de bureau et d'accessoires informatiques de haute qualité à des prix imbattables.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-900 mb-2">Produits</p>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-5xl font-bold text-gray-900">5.000</span>
                                    <span className="text-5xl font-bold text-gray-900">+</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-900 mb-2">Catégories de produits</p>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-5xl font-bold text-gray-900">10</span>
                                    <span className="text-5xl font-bold text-gray-900">+</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-900 mb-2">Les produits ont été vendus</p>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-5xl font-bold text-gray-900">4.000</span>
                                    <span className="text-5xl font-bold text-gray-900">+</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-900 mb-2">Clients satisfaits</p>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-5xl font-bold text-gray-900">500</span>
                                    <span className="text-5xl font-bold text-gray-900">+</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex gap-4">
                            <img src="/images/icons/delivery.png" alt="Delivery" className="w-12 h-12 object-contain" />
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase mb-1">Livraison partout au senegal</h3>
                                <p className="text-sm text-gray-600">Livraison rapide et sécurisée dans tout le pays</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <img src="/images/icons/payment.png" alt="Payment" className="w-12 h-12 object-contain" />
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase mb-1">paiements Sécurisée</h3>
                                <p className="text-sm text-gray-600">Nous acceptons Visa, Mastercard et mobile money</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <img src="/images/icons/shield.png" alt="Warranty" className="w-12 h-12 object-contain" />
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase mb-1">Garantie 3 à 12 mois</h3>
                                <p className="text-sm text-gray-600">Tous nos produits sont garantis contre les défauts</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <img src="/images/icons/settings.png" alt="Support" className="w-12 h-12 object-contain" />
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase mb-1">Service client réactif</h3>
                                <p className="text-sm text-gray-600">Contactez-nous 24/7 - Appelez: +221 77 236 77 77</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
