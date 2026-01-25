import React, { useState, useContext, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { MapPin, Phone, Mail, Send, Check, Loader, Smartphone, MessageSquare, AtSign, PhoneCall, Globe, ArrowRight, Instagram } from 'lucide-react';

export default function Contact() {
    const { user, authenticated } = useContext(AuthContext);
    const [data, setData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        if (authenticated && user) {
            setData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [authenticated, user]);

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [userMessages, setUserMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    useEffect(() => {
        if (authenticated) {
            fetchUserMessages();
        }
    }, [authenticated]);

    const fetchUserMessages = async () => {
        setLoadingMessages(true);
        try {
            const response = await api.get('/contact/my-messages');
            setUserMessages(response.data.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleDataChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccess(false);

        try {
            await api.post('/contact', data);
            setData(prev => ({
                ...prev,
                subject: '',
                message: ''
            }));
            setSuccess(true);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Contact form error:', error);
                const serverError = error.response?.data?.message || error.response?.data?.error || error.message || 'Erreur inconnue';
                alert('Une erreur est survenue lors de l\'envoi du message.\n\nDétails: ' + serverError);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <MainLayout>
            {/* Hero Banner - Recreated to match image */}
            <div className="relative h-56 md:h-64 bg-[#004d1a] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-forest-green/30 to-transparent"></div>

                    {/* Floating Icons Background Layer */}
                    <div className="absolute top-1/4 left-[35%] opacity-20 blur-[1px] animate-pulse">
                        <Smartphone className="w-24 h-24 text-white" />
                    </div>
                    <div className="absolute top-[20%] left-[45%] opacity-20">
                        <MessageSquare className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute top-[35%] right-[20%] opacity-20 blur-[2px] animate-bounce duration-[3000ms]">
                        <AtSign className="w-24 h-24 text-white" />
                    </div>
                    <div className="absolute top-[50%] right-[30%] opacity-20">
                        <Mail className="w-20 h-20 text-white" />
                    </div>
                    <div className="absolute top-[60%] right-[10%] opacity-20 animate-pulse">
                        <PhoneCall className="w-16 h-16 text-white" />
                    </div>

                    {/* Phone Image Overlay at the bottom */}
                    <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-full max-w-2xl opacity-40">
                        {/* Placeholder for the hand holding phone image if available, else decorative blur */}
                        <div className="h-64 bg-gradient-to-t from-dark-green to-transparent blur-2xl"></div>
                    </div>
                </div>

                <div className="relative z-10 text-center container mx-auto px-4">
                    <h1 className="text-2xl md:text-4xl font-black text-neon-green uppercase tracking-tighter mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] italic">
                        CONTACTEZ-NOUS
                    </h1>
                    <nav className="flex items-center justify-center gap-2 text-white/90 font-black text-[10px] uppercase tracking-[0.3em]">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <span className="text-neon-green">{'>'}</span>
                        <span className="text-white opacity-50">Contact</span>
                    </nav>
                </div>
            </div>

            {/* Main Contact Section - New Figma Design */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Form Column - Left side */}
                        <div className="lg:col-span-8">
                            <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">
                                ENTRER EN CONTACT
                            </h2>
                            <p className="text-gray-400 text-sm font-medium mb-12">
                                Veuillez saisir les détails de votre demande. Un membre de notre équipe d'assistance vous répondra dans les plus brefs délais.
                            </p>

                            {success ? (
                                <div className="bg-forest-green/5 border-2 border-forest-green/20 p-12 rounded-3xl text-center animate-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Check className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2 uppercase">Message Envoyé !</h3>
                                    <p className="text-gray-500 mb-8 font-medium">Nous vous contacterons dans les plus brefs délais.</p>
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="px-8 py-3 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-forest-green transition-all"
                                    >
                                        Envoyer un autre message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="group">
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => handleDataChange('name', e.target.value)}
                                                className={`w-full px-5 py-4 border border-gray-200 rounded-lg focus:border-forest-green focus:outline-none transition-all text-xs font-bold text-gray-900 uppercase tracking-widest ${authenticated ? 'bg-gray-50' : 'bg-white'}`}
                                                placeholder="VOTRE NOM"
                                                required
                                                disabled={authenticated}
                                            />
                                            {errors.name && <p className="text-red-500 text-[9px] mt-1 font-black uppercase">{errors.name[0]}</p>}
                                        </div>
                                        <div className="group">
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => handleDataChange('email', e.target.value)}
                                                className={`w-full px-5 py-4 border border-gray-200 rounded-lg focus:border-forest-green focus:outline-none transition-all text-xs font-bold text-gray-900 uppercase tracking-widest ${authenticated ? 'bg-gray-50' : 'bg-white'}`}
                                                placeholder="VOTRE E-MAIL"
                                                required
                                                disabled={authenticated}
                                            />
                                            {errors.email && <p className="text-red-500 text-[9px] mt-1 font-black uppercase">{errors.email[0]}</p>}
                                        </div>
                                    </div>

                                    <div className="group">
                                        <input
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) => handleDataChange('subject', e.target.value)}
                                            className="w-full px-5 py-4 border border-gray-200 rounded-lg bg-white focus:border-forest-green focus:outline-none transition-all text-xs font-bold text-gray-900 uppercase tracking-widest"
                                            placeholder="SUJET"
                                            required
                                        />
                                        {errors.subject && <p className="text-red-500 text-[9px] mt-1 font-black uppercase">{errors.subject[0]}</p>}
                                    </div>

                                    <div className="group">
                                        <textarea
                                            value={data.message}
                                            onChange={(e) => handleDataChange('message', e.target.value)}
                                            rows="8"
                                            className="w-full px-5 py-4 border border-gray-200 rounded-lg bg-white focus:border-forest-green focus:outline-none transition-all text-xs font-bold text-gray-900 uppercase tracking-widest resize-none"
                                            placeholder="VOTRE MESSAGE"
                                            required
                                        ></textarea>
                                        {errors.message && <p className="text-red-500 text-[9px] mt-1 font-black uppercase">{errors.message[0]}</p>}
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-10 py-4 bg-forest-green text-white font-black text-xs uppercase tracking-widest rounded-lg hover:bg-dark-green transition-all shadow-lg shadow-forest-green/10 disabled:opacity-50 flex items-center gap-3 active:scale-[0.98]"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                    TRAITEMENT...
                                                </>
                                            ) : 'SOUMETTRE MAINTENANT'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Info Column - Right side */}
                        <div className="lg:col-span-4 space-y-8 pt-12 lg:pt-24">
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-gray-900">
                                        Adresse : <span className="font-medium text-gray-400">Rue 22 Fass Delorme - en face Keur Seydi Djamil - Dakar Sénégal</span>
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-black text-gray-900">
                                        Courriel : <span className="font-medium text-gray-400">contact@dmcomputer.sn</span>
                                    </p>
                                    <p className="text-sm font-black text-gray-900">
                                        Appelez-nous : <span className="font-medium text-gray-400">(+221) 77 236 77 77 / 77 430 44 44</span>
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-black text-gray-900">
                                        Horaires d'ouverture : <span className="font-medium text-gray-400">Notre magasin ouvre ses portes du Lundi au Samedi de <span className="text-gray-900 font-black">09h à 20h.</span></span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                {[
                                    { icon: <Globe className="w-5 h-5" />, label: 'Facebook' },
                                    { icon: <Smartphone className="w-5 h-5" />, label: 'TikTok' },
                                    { icon: <Instagram className="w-5 h-5" />, label: 'Instagram' },
                                    { icon: <Globe className="w-5 h-5" />, label: 'Youtube' },
                                    { icon: <MessageSquare className="w-5 h-5" />, label: 'X' }
                                ].map((social, idx) => (
                                    <a
                                        key={idx}
                                        href="#"
                                        className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-forest-green hover:bg-white hover:shadow-lg transition-all"
                                        title={social.label}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* User Messages Section */}
            {authenticated && (
                <section className="py-20 bg-gray-50 border-t border-gray-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 bg-forest-green rounded-2xl flex items-center justify-center shadow-lg">
                                <MessageSquare className="w-6 h-6 text-neon-green" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
                                    MES <span className="text-forest-green">MESSAGES</span>
                                </h2>
                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                                    Historique de vos échanges avec notre équipe
                                </p>
                            </div>
                        </div>

                        {loadingMessages ? (
                            <div className="flex justify-center py-20">
                                <Loader className="w-10 h-10 text-forest-green animate-spin" />
                            </div>
                        ) : userMessages.length > 0 ? (
                            <div className="space-y-8">
                                {userMessages.map((msg) => (
                                    <div key={msg.id} className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="p-8">
                                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                                <div>
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${msg.status === 'replied' ? 'bg-neon-green text-black' : 'bg-gray-100 text-gray-400'
                                                        }`}>
                                                        {msg.status === 'replied' ? '✓ Répondu' : '⏳ En attente'}
                                                    </span>
                                                    <span className="ml-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight italic">
                                                    {msg.subject || 'SANS SUJET'}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Votre Message</p>
                                                    <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-gray-200">
                                                        <p className="text-gray-700 font-medium italic">"{msg.message}"</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <p className="text-[10px] font-black text-forest-green uppercase tracking-[0.2em]">Notre Réponse</p>
                                                    {msg.reply ? (
                                                        <div className="p-6 bg-forest-green/5 rounded-2xl border-l-4 border-forest-green animate-in zoom-in duration-500">
                                                            <p className="text-gray-900 font-bold leading-relaxed">{msg.reply}</p>
                                                            <p className="text-[9px] font-black text-forest-green uppercase mt-4 opacity-50">
                                                                Répondu le {new Date(msg.replied_at).toLocaleDateString('fr-FR')}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                                                            <Loader className="w-5 h-5 text-gray-300 mb-3 animate-pulse" />
                                                            <p className="text-gray-400 font-bold text-xs italic">Notre équipe examine votre message...</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-gray-200">
                                <Mail className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                                <h3 className="text-xl font-black text-gray-300 uppercase italic">Aucun message envoyé</h3>
                                <p className="text-gray-400 font-medium mt-2">Utilisez le formulaire ci-dessus pour nous contacter.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Map Section */}
            <section className="h-[500px] w-full relative bg-gray-100">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.9876543210!2d-17.4677419!3d14.6937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDQxJzM3LjMiTiAxN8KwMjgnMDMuOSJX!5e0!3m2!1sen!2ssn!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Notre emplacement"
                    className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
            </section>
        </MainLayout >
    );
}
