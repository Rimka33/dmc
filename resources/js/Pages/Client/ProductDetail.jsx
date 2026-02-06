import React, { useState, useEffect, useContext } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { CartContext } from '../../contexts/CartContext';
import { WishlistContext } from '../../contexts/WishlistContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import {
  Star,
  Heart,
  Minus,
  Plus,
  HelpCircle,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  MessageCircle,
} from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const { authenticated } = useContext(AuthContext);
  const { showNotification } = useNotification();

  const [product, setProduct] = useState(location.state?.product || null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(!location.state?.product);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Questions states
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionForm, setQuestionForm] = useState('');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    fetchQuestions();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      const productData = response.data.product?.data || response.data.product;
      setProduct(productData);

      if (productData) {
        const relatedResponse = await api.get('/products', {
          params: {
            category_id:
              productData.category?.data?.id || productData.category?.id || productData.category_id,
            per_page: 5,
          },
        });
        const relatedList = relatedResponse.data.data || relatedResponse.data || [];
        setRelatedProducts(relatedList.filter((p) => p.id !== parseInt(id)));
      }

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

  const fetchQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const response = await api.get(`/products/${id}/questions`);
      setQuestions(response.data.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!authenticated) {
      navigate('/mon-compte');
      return;
    }

    setSubmittingQuestion(true);
    try {
      await api.post(`/products/${id}/questions`, { question: questionForm });
      setQuestionForm('');
      setShowQuestionModal(false);
      fetchQuestions();
      showNotification('Question envoyée avec succès !', 'success');
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Erreur lors de l'envoi de la question.",
        'error'
      );
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleToggleWishlist = async () => {
    setWishlistLoading(true);
    await toggleWishlist(product.id);
    setWishlistLoading(false);
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
      showNotification('Avis publié avec succès !', 'success');
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Erreur lors de la publication de l'avis.",
        'error'
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addToCart(product.id, quantity);
    setAddingToCart(false);
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

  // No early return with loading spinner

  if (!product)
    return (
      <MainLayout>
        <div className="p-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit introuvable</h2>
          <Link to="/shop" className="text-forest-green hover:underline">
            Retour à la boutique
          </Link>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <Head>
        <title>{product.name}</title>
        <meta
          name="description"
          content={
            product.short_description ||
            product.description?.replace(/<[^>]+>/g, '').substring(0, 160)
          }
        />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.short_description} />
        <meta property="og:image" content={product.primary_image} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-forest-green">
              Accueil
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-forest-green">
              Boutique
            </Link>
            <span>/</span>
            {product.category && (
              <>
                <Link
                  to={`/categorie/${product.category.slug}`}
                  className="hover:text-forest-green"
                >
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 font-semibold truncate max-w-[200px]">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
            {/* Product Images */}
            <div>
              {/* Main Image/Video */}
              <div className="bg-gray-50 rounded-lg p-8 mb-4 flex items-center justify-center aspect-square overflow-hidden relative">
                {product.images && product.images.length > 0 ? (
                  product.images[selectedImage].type === 'video' ? (
                    <video
                      src={product.images[selectedImage].path}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ShimmerImage
                      src={product.images[selectedImage].path}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      fallback={'/images/products/default.png'}
                    />
                  )
                ) : (
                  <ShimmerImage
                    src={product.primary_image || '/images/products/default.png'}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    fallback={'/images/products/default.png'}
                  />
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`bg-gray-50 rounded-lg p-2 border-2 transition-colors relative ${
                        selectedImage === index
                          ? 'border-forest-green'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      {media.type === 'video' ? (
                        <div className="relative w-full h-20 bg-black/10 flex items-center justify-center">
                          <video src={media.path} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 rounded-full p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                              >
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <ShimmerImage
                          src={media.path}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-20 object-contain"
                          fallback={'/images/products/default.png'}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col h-full">
              <div className="border-b border-gray-100 pb-6 mb-6">
                <h1 className="text-lg font-black text-gray-900 mb-2 leading-tight uppercase tracking-tight">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-xl font-black text-forest-green">
                    {product.price_formatted}
                  </span>
                  {product.has_discount && (
                    <span className="text-xl text-gray-400 line-through font-bold">
                      {product.old_price_formatted}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock_quantity > 0 ? 'bg-forest-green/10 text-forest-green' : 'bg-red-500/10 text-red-500'}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${product.stock_quantity > 0 ? 'bg-forest-green shadow-[0_0_8px_rgba(5,128,49,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse'}`}
                    ></div>
                    {product.stock_quantity > 0
                      ? `En Stock (${product.stock_quantity})`
                      : 'Rupture de Stock'}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Action Row 1: Quantity + Add to Cart + Wishlist */}
                  <div className="flex items-stretch gap-3 h-12">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 w-32">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-white rounded-md transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 w-full bg-transparent text-center font-bold text-gray-900 focus:outline-none text-xs appearance-none"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-white rounded-md transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart || product.stock_quantity <= 0}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-extrabold text-[11px] uppercase tracking-widest rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs"
                    >
                      {addingToCart ? 'AJOUT...' : 'AJOUTER AU PANIER'}
                    </button>

                    {/* Wishlist Button */}
                    <button
                      onClick={handleToggleWishlist}
                      disabled={wishlistLoading}
                      className={`w-12 flex-shrink-0 flex items-center justify-center rounded-lg border-2 transition-all ${isInWishlist(product.id) ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-600'}`}
                    >
                      <Heart
                        className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Action Row 2: Buy Now */}
                  <button
                    onClick={handleBuyNow}
                    disabled={addingToCart || product.stock_quantity <= 0}
                    className="w-full h-12 bg-forest-green hover:bg-dark-green text-white font-extrabold text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    ACHETER MAINTENANT
                  </button>
                </div>

                {/* Action Row 3: Meta Links */}
                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setShowQuestionModal(true)}
                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-forest-green transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Poser une question
                  </button>
                  <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-forest-green transition-colors">
                    <Share2 className="w-4 h-4" />
                    Partager sur
                  </button>
                </div>
              </div>

              {/* Payment Security Box */}
              <div className="bg-gray-50 rounded-xl p-2 mb-6">
                <div className="flex items-center justify-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <ShieldCheck className="w-4 h-4" />
                  Garantie de paiement sécurisé
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src="/images/payment-methods.png"
                    alt="Moyens de paiement sécurisés"
                    className="h-3 md:h-4 object-contain opacity-80"
                  />
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                  <div className="mt-0.5 text-gray-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase">Livraison estimée</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">03 - 05 Jours ouvrés</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                  <div className="mt-0.5 text-gray-400">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase">Retours Gratuits</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Sur toute commande supérieure à 50.000 FCFA
                    </p>
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="mt-8 pt-6 border-t border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest space-y-2">
                <p>
                  SKU: <span className="text-gray-600 font-bold">{product.sku}</span>
                </p>
                <p>
                  Catégorie:{' '}
                  <span className="text-gray-600 font-bold">{product.category?.name}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="max-w-6xl mx-auto">
            {/* Tab Headers */}
            <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 px-2 border-b-2 font-black uppercase text-sm tracking-widest transition-colors whitespace-nowrap ${
                  activeTab === 'description'
                    ? 'border-forest-green text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`pb-3 px-2 border-b-2 font-black uppercase text-sm tracking-widest transition-colors whitespace-nowrap ${
                  activeTab === 'specifications'
                    ? 'border-forest-green text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Informations Complémentaires
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 px-2 border-b-2 font-black uppercase text-sm tracking-widest transition-colors whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'border-forest-green text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Avis ({product.review_count || 0})
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`pb-3 px-2 border-b-2 font-black uppercase text-sm tracking-widest transition-colors whitespace-nowrap ${
                  activeTab === 'questions'
                    ? 'border-forest-green text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Questions ({questions.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white pb-16">
              {activeTab === 'description' && (
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: product.description }}></div>

                  {product.features && product.features.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase">
                        Points forts
                      </h3>
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
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {product.rating || '0.0'}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`icon-star ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                          ></i>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 uppercase font-bold tracking-wider">
                        {product.review_count || 0} Avis
                      </div>
                    </div>

                    <div className="flex-1 w-full space-y-2 max-w-md">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter((r) => r.rating === star).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-4">
                            <span className="text-sm font-bold w-4">{star}</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-forest-green"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-400 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="md:ml-auto">
                      {!showReviewForm ? (
                        <button
                          onClick={() =>
                            authenticated ? setShowReviewForm(true) : navigate('/mon-compte')
                          }
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
                      <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase">
                        Votre évaluation
                      </h3>
                      <form onSubmit={handleReviewSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                            Note
                          </label>
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
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                            Votre commentaire
                          </label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) =>
                              setReviewForm({ ...reviewForm, comment: e.target.value })
                            }
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
                        <div
                          key={review.id}
                          className="border-b border-gray-100 pb-8 last:border-0"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-gray-900">{review.user_name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <i
                                      key={i}
                                      className={`icon-star text-xs ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                    ></i>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-400 font-medium">
                                  •{' '}
                                  {review.created_at_formatted ||
                                    new Date(review.created_at).toLocaleDateString()}
                                </span>
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
                        <p className="text-gray-500 font-medium">
                          Il n'y a pas encore d'avis pour ce produit.
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Soyez le premier à donner votre avis !
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'questions' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-gray-900 uppercase">
                      Questions & Réponses
                    </h3>
                    {!showQuestionModal && (
                      <button
                        onClick={() =>
                          authenticated ? setShowQuestionModal(true) : navigate('/mon-compte')
                        }
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-bold uppercase rounded hover:bg-gray-200 transition-all text-xs tracking-wider"
                      >
                        Poser une question
                      </button>
                    )}
                  </div>

                  <div className="space-y-8">
                    {questionsLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-forest-green"></div>
                      </div>
                    ) : questions.length > 0 ? (
                      questions.map((q) => (
                        <div key={q.id} className="border-b border-gray-100 pb-8 last:border-0">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                              Q
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-baseline mb-2">
                                <span className="font-bold text-gray-900 text-sm">
                                  {q.user?.name || 'Utilisateur'}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(q.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-800 font-medium mb-4">{q.question}</p>

                              {q.answer ? (
                                <div className="bg-gray-50 p-4 rounded-lg flex gap-4">
                                  <div className="w-8 h-8 rounded-full bg-forest-green flex items-center justify-center text-white font-bold text-xs">
                                    A
                                  </div>
                                  <div>
                                    <div className="font-bold text-forest-green text-xs uppercase mb-1">
                                      Réponse de la boutique
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                      {q.answer}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400 italic">
                                  En attente de réponse...
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 px-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Aucune question pour le moment.</p>
                        <p className="text-sm text-gray-400 mt-2">
                          N'hésitez pas à poser la première question !
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900 uppercase">Poser une question</h3>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="icon-x text-2xl"></i>
                </button>
              </div>

              {!authenticated ? (
                <div className="text-center py-8">
                  <p className="mb-6 text-gray-600">
                    Vous devez être connecté pour poser une question.
                  </p>
                  <button
                    onClick={() => navigate('/mon-compte')}
                    className="px-8 py-3 bg-forest-green text-white font-bold uppercase rounded hover:bg-dark-green transition-all"
                  >
                    Se connecter
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuestionSubmit}>
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Votre question
                    </label>
                    <textarea
                      value={questionForm}
                      onChange={(e) => setQuestionForm(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-forest-green focus:bg-white focus:outline-none transition-all resize-none text-sm"
                      placeholder="Ex: Quelle est la durée de la garantie ?"
                      required
                    ></textarea>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowQuestionModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold uppercase rounded-lg hover:bg-gray-200 transition-all text-sm"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={submittingQuestion}
                      className="flex-1 px-6 py-3 bg-forest-green text-white font-bold uppercase rounded-lg hover:bg-dark-green transition-all text-sm shadow-lg disabled:opacity-50"
                    >
                      {submittingQuestion ? 'Envoi...' : 'Envoyer'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50 border-t">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-1xl font-bold text-gray-900 uppercase">Produits similaires</h2>
              <Link to="/shop" className="text-forest-green font-bold hover:underline">
                Voir tout →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {relatedProducts.slice(0, 5).map((related, index) => (
                <Link
                  key={index}
                  to={`/produit/${related.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all p-4 group"
                >
                  <div className="aspect-square mb-3 overflow-hidden rounded">
                    <ShimmerImage
                      src={related.primary_image}
                      alt={related.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      fallback={'/images/products/default.png'}
                    />
                  </div>
                  <h3 className="font-semibold text-xs text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
                    {related.name}
                  </h3>
                  <p className="text-xs font-bold text-forest-green">{related.price_formatted}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
