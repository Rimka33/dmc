import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { User, DollarSign, Smartphone, Landmark, Loader, ArrowRight, Check, ShoppingBag, CreditCard } from 'lucide-react';

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
            <div className="relative h-56 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96">
                        <CreditCard className="w-full h-full text-white opacity-10" />
                    </div>
                </div>
                <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10">
                    <h1 className="text-5xl font-black text-neon-green uppercase mb-3 tracking-tight">VÉRIFICATION</h1>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <span>/</span>
                        <Link to="/panier" className="hover:text-neon-green transition-colors">Panier</Link>
                        <span>/</span>
                        <span className="text-neon-green font-bold">Vérification</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <section className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                                <div className="h-full bg-neon-green transition-all duration-500" style={{ width: '66%' }}></div>
                            </div>

                            <div className="relative flex flex-col items-center bg-white px-2 z-10">
                                <div className="w-10 h-10 rounded-full bg-neon-green flex items-center justify-center text-black font-black mb-2 shadow-lg">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">Panier</span>
                            </div>

                            <div className="relative flex flex-col items-center bg-white px-2 z-10">
                                <div className="w-10 h-10 rounded-full bg-neon-green flex items-center justify-center text-black font-black mb-2 shadow-lg">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">Vérification</span>
                            </div>

                            <div className="relative flex flex-col items-center bg-white px-2 z-10">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-black mb-2">
                                    3
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Confirmation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4">
                    {!authenticated && (
                        <div className="max-w-7xl mx-auto mb-8">
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Avez-vous déjà un compte ?</h3>
                                        <p className="text-gray-600 text-sm">Connectez-vous pour un paiement plus rapide.</p>
                                    </div>
                                </div>
                                <Link to="/mon-compte" className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all text-center whitespace-nowrap">
                                    SE CONNECTER
                                </Link>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Billing Details */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                    <h2 className="text-2xl font-black text-gray-900 uppercase mb-6 pb-4 border-b">Détails de livraison</h2>

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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-forest-green focus:outline-none transition-colors"
                                                required
                                            />
                                            {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name[0]}</p>}
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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-forest-green focus:outline-none transition-colors"
                                                required
                                            />
                                            {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone[0]}</p>}
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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-forest-green focus:outline-none transition-colors"
                                                required
                                            />
                                            {errors.customer_email && <p className="text-red-500 text-xs mt-1">{errors.customer_email[0]}</p>}
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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-forest-green focus:outline-none transition-colors"
                                                required
                                            />
                                            {errors.shipping_address && <p className="text-red-500 text-xs mt-1">{errors.shipping_address[0]}</p>}
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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-forest-green focus:outline-none transition-colors"
                                                required
                                            />
                                            {errors.shipping_city && <p className="text-red-500 text-xs mt-1">{errors.shipping_city[0]}</p>}
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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-forest-green focus:outline-none transition-colors"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">
                                                Notes de commande (optionnel)
                                            </label>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder="Instructions spéciales pour la livraison..."
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-forest-green focus:outline-none transition-colors resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                                    <h3 className="text-xl font-black text-gray-900 uppercase mb-6 pb-4 border-b">Votre commande</h3>

                                    {/* Products */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between font-bold text-gray-500 text-[10px] uppercase tracking-widest pb-3 border-b">
                                            <span>Produit</span>
                                            <span>Total</span>
                                        </div>

                                        <div className="max-h-64 overflow-y-auto space-y-3">
                                            {cart.items.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center gap-3">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <div className="w-10 h-10 bg-gray-50 rounded p-1 border border-gray-100 flex-shrink-0">
                                                            <img src={item.image_path || item.image} alt={item.name} className="w-full h-full object-contain" />
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-700 line-clamp-2">
                                                            {item.name} <span className="text-forest-green">× {item.quantity}</span>
                                                        </span>
                                                    </div>
                                                    <span className="font-bold text-gray-900 text-sm whitespace-nowrap">{item.total_formatted || `${(item.price * item.quantity).toLocaleString()} F CFA`}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 space-y-3 border-t">
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Sous-total</span>
                                                <span className="font-bold">{cart.subtotal_formatted || `${(cart.subtotal || 0).toLocaleString()} F CFA`}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Expédition</span>
                                                <span className="font-bold text-forest-green">{cart.shipping_formatted || '5.000 F CFA'}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-black pt-3 border-t-2 border-gray-900">
                                                <span className="text-gray-900 uppercase">Total</span>
                                                <span className="text-neon-green">{cart.total_formatted || `${((cart.subtotal || 0) + (cart.shipping || 5000)).toLocaleString()} F CFA`}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="space-y-3 mb-6">
                                        <h4 className="font-black text-gray-900 uppercase text-xs tracking-wider mb-3">Mode de paiement</h4>

                                        <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.payment_method === 'cash_on_delivery' ? 'border-forest-green bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="cash_on_delivery"
                                                checked={formData.payment_method === 'cash_on_delivery'}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-forest-green"
                                            />
                                            <DollarSign className="w-5 h-5 text-forest-green" />
                                            <span className="text-sm font-bold text-gray-900">Paiement à la livraison</span>
                                        </label>

                                        <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.payment_method === 'mobile_money' ? 'border-forest-green bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="mobile_money"
                                                checked={formData.payment_method === 'mobile_money'}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-forest-green"
                                            />
                                            <Smartphone className="w-5 h-5 text-forest-green" />
                                            <span className="text-sm font-bold text-gray-900">Mobile Money</span>
                                        </label>

                                        <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.payment_method === 'bank_transfer' ? 'border-forest-green bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="bank_transfer"
                                                checked={formData.payment_method === 'bank_transfer'}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-forest-green"
                                            />
                                            <Landmark className="w-5 h-5 text-forest-green" />
                                            <span className="text-sm font-bold text-gray-900">Transfert Bancaire</span>
                                        </label>
                                    </div>

                                    {/* Terms */}
                                    <div className="mb-6">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="termsAccepted"
                                                checked={formData.termsAccepted}
                                                onChange={handleChange}
                                                className="w-4 h-4 mt-1 text-forest-green rounded"
                                                required
                                            />
                                            <span className="text-xs text-gray-600">
                                                J'ai lu et j'accepte les <Link to="/termes" className="text-forest-green underline font-bold">termes et conditions</Link> <span className="text-red-500">*</span>
                                            </span>
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-4 bg-forest-green text-white font-black uppercase rounded-lg hover:bg-dark-green transition-all shadow-lg text-sm tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Traitement...
                                            </>
                                        ) : (
                                            <>
                                                Confirmer la commande
                                                <ArrowRight className="w-5 h-5" />
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
