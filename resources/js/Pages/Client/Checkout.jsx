import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function Checkout() {
    const navigate = useNavigate();
    const { cart, clearCart, loading: cartLoading } = useContext(CartContext);
    const { user, authenticated } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        shipping_city: '',
        shipping_postal_code: '',
        payment_method: 'cash_on_delivery',
        notes: '',
        termsAccepted: false
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    // Pré-remplir avec les infos utilisateur si disponible
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customer_name: user.name || prev.customer_name,
                customer_email: user.email || prev.customer_email,
                customer_phone: user.phone || prev.customer_phone,
                shipping_address: user.address || prev.shipping_address,
                shipping_city: user.city || prev.shipping_city,
                shipping_postal_code: user.postal_code || prev.shipping_postal_code,
            }));
        }
    }, [user]);

    // Rediriger si le panier est vide
    useEffect(() => {
        if (!cartLoading && cart.items.length === 0) {
            navigate('/panier');
        }
    }, [cart, cartLoading, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.termsAccepted) {
            alert('Vous devez accepter les termes et conditions.');
            return;
        }

        setProcessing(true);
        setErrors({});

        try {
            const response = await api.post('/orders', formData);

            if (response.data.success) {
                // Le panier est déjà vidé par le backend (si session-based on devra peut être appeler clearCart)
                await clearCart();
                navigate(`/checkout/received?order=${response.data.data.order_number}`);
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                alert(error.response?.data?.message || 'Une erreur est survenue lors de la commande.');
            }
        } finally {
            setProcessing(false);
        }
    };

    if (cartLoading) return null;

    return (
        <MainLayout>
            {/* Hero Banner */}
            <div className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, rgba(1, 26, 10, 0.9), rgba(1, 26, 10, 0.7)), url(/images/cart-bg.jpg) center/cover' }}>
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-neon-green uppercase mb-4 tracking-widest italic">VÉRIFIER</h1>
                    <div className="flex items-center justify-center gap-2 text-white text-sm font-medium">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <span className="text-gray-400">/</span>
                        <Link to="/panier" className="hover:text-neon-green transition-colors">Panier</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-neon-green font-bold">Vérification</span>
                    </div>
                </div>
            </div>

            <section className="py-16 bg-white min-h-screen">
                <div className="container mx-auto px-4">
                    {!authenticated && (
                        <div className="max-w-7xl mx-auto mb-10">
                            <div className="bg-forest-green/5 border-l-4 border-forest-green p-6 rounded-r-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-forest-green rounded-full flex items-center justify-center text-white text-xl">
                                        <i className="icon-user"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Avez-vous déjà un compte ?</h3>
                                        <p className="text-gray-600 text-sm">Connectez-vous pour un paiement plus rapide et suivre vos commandes.</p>
                                    </div>
                                </div>
                                <Link to="/mon-compte" className="px-6 py-3 bg-forest-green text-white font-bold rounded-lg hover:bg-dark-green transition-all shadow-md text-center">
                                    SE CONNECTER
                                </Link>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Billing Details */}
                            <div className="lg:col-span-7 space-y-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-8 uppercase italic border-b-2 border-neon-green inline-block">Détails de livraison</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">
                                                Nom complet <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="customer_name"
                                                value={formData.customer_name}
                                                onChange={handleChange}
                                                placeholder="ex: Jean Dupont"
                                                className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-forest-green focus:outline-none transition-colors bg-gray-50/50"
                                                required
                                            />
                                            {errors.customer_name && <p className="text-red-500 text-xs mt-2 font-medium">{errors.customer_name[0]}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">
                                                Téléphone <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="customer_phone"
                                                value={formData.customer_phone}
                                                onChange={handleChange}
                                                placeholder="ex: +221 77 000 00 00"
                                                className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-forest-green focus:outline-none transition-colors bg-gray-50/50"
                                                required
                                            />
                                            {errors.customer_phone && <p className="text-red-500 text-xs mt-2 font-medium">{errors.customer_phone[0]}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">
                                                Adresse e-mail <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="customer_email"
                                                value={formData.customer_email}
                                                onChange={handleChange}
                                                placeholder="ex: jean.dupont@email.com"
                                                className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-forest-green focus:outline-none transition-colors bg-gray-50/50"
                                                required
                                            />
                                            {errors.customer_email && <p className="text-red-500 text-xs mt-2 font-medium">{errors.customer_email[0]}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">
                                                Adresse précise <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="shipping_address"
                                                placeholder="Rue, quartier, numéro de porte, points de repère..."
                                                value={formData.shipping_address}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-forest-green focus:outline-none transition-colors bg-gray-50/50"
                                                required
                                            />
                                            {errors.shipping_address && <p className="text-red-500 text-xs mt-2 font-medium">{errors.shipping_address[0]}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">
                                                Ville <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="shipping_city"
                                                value={formData.shipping_city}
                                                onChange={handleChange}
                                                placeholder="ex: Dakar"
                                                className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-forest-green focus:outline-none transition-colors bg-gray-50/50"
                                                required
                                            />
                                            {errors.shipping_city && <p className="text-red-500 text-xs mt-2 font-medium">{errors.shipping_city[0]}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">
                                                Code postal
                                            </label>
                                            <input
                                                type="text"
                                                name="shipping_postal_code"
                                                value={formData.shipping_postal_code}
                                                onChange={handleChange}
                                                placeholder="ex: 10000"
                                                className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-forest-green focus:outline-none transition-colors bg-gray-50/50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase italic">Informations complémentaires</h3>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">
                                        Notes de commande (optionnel)
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Instructions spéciales pour la livraison..."
                                        className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-forest-green focus:outline-none transition-colors bg-gray-50/50 resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-5">
                                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-28">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-8 uppercase italic border-b border-gray-200 pb-4">Résumé de la commande</h3>

                                    {/* Products */}
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between font-bold text-gray-500 text-xs uppercase tracking-widest pb-3 border-b border-gray-200">
                                            <span>PRODUIT</span>
                                            <span>TOTAL</span>
                                        </div>

                                        <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
                                            {cart.items.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-white rounded-lg p-1 border border-gray-100 flex-shrink-0">
                                                            <img src={item.image_path} alt={item.name} className="w-full h-full object-contain" />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-700 line-clamp-2">
                                                            {item.name} <span className="text-forest-green ml-1">× {item.quantity}</span>
                                                        </span>
                                                    </div>
                                                    <span className="font-bold text-gray-900 whitespace-nowrap">{item.total_formatted}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-6 space-y-3">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Sous-total</span>
                                                <span className="font-bold">{cart.subtotal_formatted}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Expédition</span>
                                                <span className="font-bold text-forest-green">{cart.shipping_formatted}</span>
                                            </div>
                                            <div className="flex justify-between text-2xl font-bold pt-4 border-t-2 border-gray-200">
                                                <span className="text-gray-900">TOTAL</span>
                                                <span className="text-forest-green">{cart.total_formatted}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="space-y-4 mb-8">
                                        <h4 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-4">Mode de paiement</h4>

                                        <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.payment_method === 'cash_on_delivery' ? 'border-forest-green bg-white shadow-md' : 'border-transparent bg-gray-100 hover:bg-white hover:border-gray-200'}`}
                                            onClick={() => setFormData({ ...formData, payment_method: 'cash_on_delivery' })}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.payment_method === 'cash_on_delivery' ? 'border-forest-green' : 'border-gray-400'}`}>
                                                    {formData.payment_method === 'cash_on_delivery' && <div className="w-2.5 h-2.5 bg-forest-green rounded-full"></div>}
                                                </div>
                                                <span className="font-bold text-gray-900">Paiement à la livraison</span>
                                                <i className="icon-cash ml-auto text-xl opacity-50"></i>
                                            </div>
                                            {formData.payment_method === 'cash_on_delivery' && (
                                                <p className="text-xs text-gray-500 mt-2 ml-8">Payez en espèces dès réception de votre commande à domicile.</p>
                                            )}
                                        </div>

                                        <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.payment_method === 'mobile_money' ? 'border-forest-green bg-white shadow-md' : 'border-transparent bg-gray-100 hover:bg-white hover:border-gray-200'}`}
                                            onClick={() => setFormData({ ...formData, payment_method: 'mobile_money' })}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.payment_method === 'mobile_money' ? 'border-forest-green' : 'border-gray-400'}`}>
                                                    {formData.payment_method === 'mobile_money' && <div className="w-2.5 h-2.5 bg-forest-green rounded-full"></div>}
                                                </div>
                                                <span className="font-bold text-gray-900">Mobile Money (Wave / OM)</span>
                                                <i className="icon-smartphone ml-auto text-xl opacity-50"></i>
                                            </div>
                                            {formData.payment_method === 'mobile_money' && (
                                                <p className="text-xs text-gray-500 mt-2 ml-8">Payez via Wave ou Orange Money. Notre équipe vous contactera pour finaliser le transfert.</p>
                                            )}
                                        </div>

                                        <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.payment_method === 'bank_transfer' ? 'border-forest-green bg-white shadow-md' : 'border-transparent bg-gray-100 hover:bg-white hover:border-gray-200'}`}
                                            onClick={() => setFormData({ ...formData, payment_method: 'bank_transfer' })}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.payment_method === 'bank_transfer' ? 'border-forest-green' : 'border-gray-400'}`}>
                                                    {formData.payment_method === 'bank_transfer' && <div className="w-2.5 h-2.5 bg-forest-green rounded-full"></div>}
                                                </div>
                                                <span className="font-bold text-gray-900">Transfert Bancaire</span>
                                                <i className="icon-bank ml-auto text-xl opacity-50"></i>
                                            </div>
                                            {formData.payment_method === 'bank_transfer' && (
                                                <p className="text-xs text-gray-500 mt-2 ml-8">Effectuez votre paiement directement sur notre compte bancaire. Utilisez votre ID de commande comme référence.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Terms */}
                                    <div className="mb-8">
                                        <p className="text-[10px] text-gray-400 leading-relaxed mb-4">
                                            Vos données personnelles seront utilisées pour traiter votre commande, soutenir votre expérience sur ce site Web et à d'autres fins décrites dans notre{' '}
                                            <Link to="/confidentialite" className="text-forest-green underline font-bold">politique de confidentialité</Link>.
                                        </p>

                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative mt-1">
                                                <input
                                                    type="checkbox"
                                                    name="termsAccepted"
                                                    checked={formData.termsAccepted}
                                                    onChange={handleChange}
                                                    className="peer sr-only"
                                                    required
                                                />
                                                <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-forest-green peer-checked:bg-forest-green transition-all"></div>
                                                <i className="icon-check absolute top-0 left-0 text-white text-xs opacity-0 peer-checked:opacity-100 flex items-center justify-center w-full h-full"></i>
                                            </div>
                                            <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors font-medium">
                                                J'ai lu et j'accepte les <Link to="/termes" className="text-forest-green underline font-bold">termes et conditions</Link> du site Web <span className="text-red-500">*</span>
                                            </span>
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-5 bg-forest-green text-white font-extrabold uppercase rounded-2xl hover:bg-dark-green transition-all shadow-xl shadow-forest-green/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                TRAITEMENT...
                                            </>
                                        ) : (
                                            <>
                                                CONFIRMER LA COMMANDE
                                                <i className="icon-arrow-right"></i>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </MainLayout>
    );
}
