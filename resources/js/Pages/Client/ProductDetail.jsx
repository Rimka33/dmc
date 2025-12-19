import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { CartContext } from '../../contexts/CartContext';
import { WishlistContext } from '../../contexts/WishlistContext';
import { AuthContext } from '../../contexts/AuthContext';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
    const { authenticated } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Reviews states
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        fetchProduct();
        fetchReviews();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/products/${id}`);
            setProduct(response.data.data);

            const relatedResponse = await api.get('/products', {
                params: {
                    category_id: response.data.data.category?.id,
                    per_page: 5
                }
            });
            setRelatedProducts(relatedResponse.data.data.filter(p => p.id !== parseInt(id)));

            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const response = await api.get(`/products/${id}/reviews`);
            setReviews(response.data.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleToggleWishlist = async () => {
        setWishlistLoading(true);
        const result = await toggleWishlist(product.id);
        setWishlistLoading(false);
        if (!result.success && !authenticated) {
            navigate('/mon-compte');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!authenticated) {
            navigate('/mon-compte');
            return;
        }

        setSubmittingReview(true);
        try {
            await api.post(`/products/${id}/reviews`, reviewForm);
            setReviewForm({ rating: 5, comment: '' });
            setShowReviewForm(false);
            fetchReviews();
            alert('Avis publié avec succès !');
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de la publication de l\'avis.');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleAddToCart = async () => {
        setAddingToCart(true);
        const result = await addToCart(product.id, quantity);
        setAddingToCart(false);
        if (result.success) {
            alert('Produit ajouté au panier !');
        } else {
            alert(result.message);
        }
    };

    const handleBuyNow = async () => {
        setAddingToCart(true);
        const result = await addToCart(product.id, quantity);
        setAddingToCart(false);
        if (result.success) {
            navigate('/panier');
        } else {
            alert(result.message);
        }
    };

    if (loading) return (
        <MainLayout>
            <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
            </div>
        </MainLayout>
    );

    if (!product) return (
        <MainLayout>
            <div className="p-24 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit introuvable</h2>
                <Link to="/shop" className="text-forest-green hover:underline">Retour à la boutique</Link>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            <div className="bg-gray-50 py-4 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link to="/" className="hover:text-forest-green">Accueil</Link>
                        <span>/</span>
                        <Link to="/shop" className="hover:text-forest-green">Boutique</Link>
                        <span>/</span>
                        {product.category && (
                            <>
                                <Link to={`/categorie/${product.category.slug}`} className="hover:text-forest-green">
                                    {product.category.name}
                                </Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-gray-900 font-semibold truncate max-w-[200px]">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
                        {/* Product Images */}
                        <div>
                            {/* Main Image */}
                            <div className="bg-gray-50 rounded-lg p-8 mb-4 flex items-center justify-center aspect-square overflow-hidden">
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[selectedImage].path : product.primary_image}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Thumbnail Images */}
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`bg-gray-50 rounded-lg p-2 border-2 transition-colors ${selectedImage === index
                                                ? 'border-forest-green'
                                                : 'border-transparent hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={image.path}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-20 object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            {product.is_on_sale && (
                                <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded mb-4">
                                    SOLDE
                                </span>
                            )}
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <p className="text-gray-500 mb-4">Marque: <span className="text-gray-900 font-semibold">{product.brand || 'N/A'}</span></p>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating || 0)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-gray-600">({product.review_count || 0} avis clients)</span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-bold text-forest-green">
                                        {product.price_formatted}
                                    </span>
                                    {product.has_discount && (
                                        <span className="text-2xl text-gray-400 line-through">
                                            {product.old_price_formatted}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-2 italic">
                                    Taxes incluses. Frais de port calculés au paiement.
                                </p>
                            </div>

                            {/* Short Description */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <p className="text-gray-700 leading-relaxed">{product.short_description || product.description?.substring(0, 200) + '...'}</p>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6 flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${product.stock_quantity > 0 ? 'bg-neon-green' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {product.stock_quantity > 0 ? `En stock (${product.stock_quantity} disponibles)` : 'Rupture de stock'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="icon-truck text-forest-green text-xl"></i>
                                    <span className="text-sm text-gray-700">
                                        Expédié sous 24h
                                    </span>
                                </div>
                            </div>

                            {/* SKU & Category */}
                            <div className="mb-6 text-sm text-gray-600 space-y-1 bg-gray-50 p-4 rounded-lg">
                                <p><strong>SKU:</strong> {product.sku}</p>
                                <p><strong>Catégorie:</strong> {product.category?.name || 'N/A'}</p>
                            </div>

                            {/* Quantity & Actions */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Quantité
                                </label>
                                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                                    <div className="flex items-center border-2 border-gray-300 rounded overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-3 hover:bg-gray-100 transition-colors font-bold text-xl"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-16 text-center border-x-2 border-gray-300 px-2 py-3 focus:outline-none font-bold text-lg"
                                            min="1"
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                            className="px-4 py-3 hover:bg-gray-100 transition-colors font-bold text-xl"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addingToCart || product.stock_quantity <= 0}
                                        className="flex-1 px-8 py-3 bg-forest-green text-white font-bold uppercase rounded hover:bg-dark-green transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {addingToCart ? 'AJOUT...' : 'AJOUTER AU PANIER'}
                                    </button>

                                    <button
                                        onClick={handleBuyNow}
                                        disabled={addingToCart || product.stock_quantity <= 0}
                                        className="flex-1 px-8 py-3 bg-neon-green text-black font-bold uppercase rounded hover:bg-white border-2 border-neon-green transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ACHETER MAINTENANT
                                    </button>

                                    <button
                                        onClick={handleToggleWishlist}
                                        disabled={wishlistLoading}
                                        className={`w-14 h-14 flex items-center justify-center rounded border-2 transition-all ${isInWishlist(product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'}`}
                                        title={isInWishlist(product.id) ? "Retirer de la liste de souhaits" : "Ajouter à la liste de souhaits"}
                                    >
                                        <i className={`icon-heart${isInWishlist(product.id) ? '-fill' : ''} text-2xl`}></i>
                                    </button>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i className="icon-shield text-forest-green"></i>
                                    Paiement 100% sécurisé
                                </h3>
                                <div className="flex items-center gap-3 flex-wrap opacity-80">
                                    <img src="/images/payment/wave.png" alt="Wave" className="h-8 grayscale hover:grayscale-0 transition-all" />
                                    <img src="/images/payment/orange-money.png" alt="Orange Money" className="h-8 grayscale hover:grayscale-0 transition-all" />
                                    <img src="/images/payment/free-money.png" alt="Free Money" className="h-8 grayscale hover:grayscale-0 transition-all" />
                                    <img src="/images/payment/visa.png" alt="Visa" className="h-8 grayscale hover:grayscale-0 transition-all" />
                                    <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-8 grayscale hover:grayscale-0 transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="max-w-6xl mx-auto">
                        {/* Tab Headers */}
                        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`px-8 py-4 font-bold uppercase whitespace-nowrap transition-colors ${activeTab === 'description'
                                    ? 'border-b-2 border-forest-green text-forest-green'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab('specifications')}
                                className={`px-8 py-4 font-bold uppercase whitespace-nowrap transition-colors ${activeTab === 'specifications'
                                    ? 'border-b-2 border-forest-green text-forest-green'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Caractéristiques
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`px-8 py-4 font-bold uppercase whitespace-nowrap transition-colors ${activeTab === 'reviews'
                                    ? 'border-b-2 border-forest-green text-forest-green'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Avis ({product.review_count || 0})
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white pb-16">
                            {activeTab === 'description' && (
                                <div className="prose max-w-none text-gray-700 leading-relaxed">
                                    <div dangerouslySetInnerHTML={{ __html: product.description }}></div>

                                    {product.features && product.features.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase">Points forts</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {product.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center gap-3">
                                                        <i className="icon-check-circle text-neon-green text-xl"></i>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'specifications' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    {/* Exemples de specs - À adapter si l'API renvoie des specs structurées */}
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-semibold">Marque</span>
                                        <span>{product.brand}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-semibold">Modèle</span>
                                        <span>{product.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-semibold">SKU</span>
                                        <span>{product.sku}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-semibold">Catégorie</span>
                                        <span>{product.category?.name}</span>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div>
                                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-gray-50 p-8 rounded-xl border border-gray-200">
                                        <div className="text-center">
                                            <div className="text-5xl font-bold text-gray-900 mb-2">{product.rating || '0.0'}</div>
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <i key={i} className={`icon-star ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                                                ))}
                                            </div>
                                            <div className="text-sm text-gray-500 uppercase font-bold tracking-wider">{product.review_count || 0} Avis</div>
                                        </div>

                                        <div className="flex-1 w-full space-y-2 max-w-md">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = reviews.filter(r => r.rating === star).length;
                                                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-4">
                                                        <span className="text-sm font-bold w-4">{star}</span>
                                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div className="h-full bg-forest-green" style={{ width: `${percentage}%` }}></div>
                                                        </div>
                                                        <span className="text-xs text-gray-400 w-8">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="md:ml-auto">
                                            {!showReviewForm ? (
                                                <button
                                                    onClick={() => authenticated ? setShowReviewForm(true) : navigate('/mon-compte')}
                                                    className="px-8 py-3 bg-forest-green text-white font-bold uppercase rounded hover:bg-dark-green transition-all shadow-md"
                                                >
                                                    LAISSER UN AVIS
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setShowReviewForm(false)}
                                                    className="px-8 py-3 bg-gray-100 text-gray-600 font-bold uppercase rounded hover:bg-gray-200 transition-all"
                                                >
                                                    ANNULER
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {showReviewForm && (
                                        <div className="mb-12 p-8 border-2 border-forest-green/10 rounded-2xl bg-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                                            <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase">Votre évaluation</h3>
                                            <form onSubmit={handleReviewSubmit} className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Note</label>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                                className={`text-2xl transition-colors ${reviewForm.rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                                            >
                                                                <i className="icon-star"></i>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Votre commentaire</label>
                                                    <textarea
                                                        value={reviewForm.comment}
                                                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                        rows="4"
                                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-forest-green focus:outline-none transition-all resize-none"
                                                        placeholder="Partagez votre expérience avec ce produit..."
                                                        required
                                                    ></textarea>
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={submittingReview}
                                                    className="px-10 py-4 bg-forest-green text-white font-bold uppercase rounded-xl hover:bg-dark-green transition-all shadow-lg disabled:opacity-50"
                                                >
                                                    {submittingReview ? 'PUBLICATION...' : 'PUBLIER MON AVIS'}
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    <div className="space-y-8">
                                        {reviewsLoading ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-forest-green"></div>
                                            </div>
                                        ) : reviews.length > 0 ? (
                                            reviews.map((review) => (
                                                <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">{review.user_name}</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="flex gap-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <i key={i} className={`icon-star text-xs ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}></i>
                                                                    ))}
                                                                </div>
                                                                <span className="text-xs text-gray-400 font-medium">• {review.created_at_formatted || new Date(review.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        {review.is_verified && (
                                                            <span className="px-2 py-1 bg-neon-green/10 text-forest-green text-[10px] font-black uppercase rounded flex items-center gap-1">
                                                                <i className="icon-check-circle"></i> Achat vérifié
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 px-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                                <i className="icon-message-circle text-4xl text-gray-200 mb-4 block"></i>
                                                <p className="text-gray-500 font-medium">Il n'y a pas encore d'avis pour ce produit.</p>
                                                <p className="text-sm text-gray-400 mt-2">Soyez le premier à donner votre avis !</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
                <section className="py-16 bg-gray-50 border-t">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 uppercase">Produits similaires</h2>
                            <Link to="/shop" className="text-forest-green font-bold hover:underline">Voir tout →</Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {relatedProducts.slice(0, 5).map((related, index) => (
                                <Link
                                    key={index}
                                    to={`/produit/${related.id}`}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all p-4 group"
                                >
                                    <div className="aspect-square mb-3 overflow-hidden rounded">
                                        <img
                                            src={related.primary_image}
                                            alt={related.name}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
                                        {related.name}
                                    </h3>
                                    <p className="text-lg font-bold text-forest-green">
                                        {related.price_formatted}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
