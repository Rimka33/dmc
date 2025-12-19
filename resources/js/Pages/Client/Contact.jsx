import React, { useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Contact() {
    const [data, setData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

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
            setData({ name: '', email: '', subject: '', message: '' });
            setSuccess(true);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                alert('Une erreur est survenue lors de l\'envoi du message.');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <MainLayout>
            {/* Hero Banner */}
            <div className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, rgba(1, 26, 10, 0.9), rgba(1, 26, 10, 0.8)), url(/images/contact-bg.jpg) center/cover' }}>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-black text-neon-green uppercase mb-6 tracking-tighter italic">CONTACTEZ-NOUS</h1>
                    <div className="flex items-center justify-center gap-3 text-white text-sm font-bold tracking-widest uppercase bg-white/5 py-3 px-6 rounded-full inline-flex border border-white/10">
                        <Link to="/" className="hover:text-neon-green transition-colors">Accueil</Link>
                        <span className="text-gray-500">/</span>
                        <span className="text-neon-green">Contact</span>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-forest-green/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
            </div>

            {/* Contact Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-7xl mx-auto">

                        {/* Contact Info */}
                        <div className="lg:col-span-5 space-y-12">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-6">
                                    NOS <span className="text-forest-green">COORDONNÉES</span>
                                </h2>
                                <p className="text-gray-500 font-medium leading-relaxed mb-10">
                                    Nous sommes à votre écoute pour toute question technique ou commerciale. DM Computer s'engage à vous répondre sous 24h ouvrées.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-forest-green transition-all shadow-lg rotate-3 group-hover:rotate-0">
                                        <i className="icon-map-pin text-neon-green text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-2">Notre Bureau</h3>
                                        <p className="text-gray-600 font-medium">345 Rue FA 22, Liberté 6 Extension<br />Dakar, Sénégal</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-forest-green transition-all shadow-lg -rotate-3 group-hover:rotate-0">
                                        <i className="icon-phone text-neon-green text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-2">Appelez-nous</h3>
                                        <p className="text-lg font-black text-gray-900">+221 77 236 77 77</p>
                                        <p className="text-gray-400 text-xs font-bold uppercase mt-1 tracking-widest">Lun - Sam | 9h - 19h</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-forest-green transition-all shadow-lg rotate-6 group-hover:rotate-0">
                                        <i className="icon-mail text-neon-green text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-2">Email Direct</h3>
                                        <p className="text-forest-green font-black underline decoration-2 underline-offset-4">contact@dmcomputer.sn</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 mt-12">
                                <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-6">Suivez l'actualité</h3>
                                <div className="flex gap-4">
                                    {['facebook', 'instagram', 'twitter', 'linkedin'].map(social => (
                                        <a key={social} href="#" className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-neon-green hover:text-black transition-all group border border-gray-100">
                                            <i className={`icon-${social} text-gray-400 group-hover:text-black transition-colors`}></i>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-7 bg-white p-6 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative">
                            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-8">
                                ENVOYER UN <span className="text-forest-green">MESSAGE</span>
                            </h2>

                            {success ? (
                                <div className="bg-neon-green/10 border-2 border-neon-green p-8 rounded-3xl text-center">
                                    <div className="w-20 h-20 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-neon-green/20">
                                        <i className="icon-check text-black text-3xl font-black"></i>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">MESSAGE ENVOYÉ !</h3>
                                    <p className="text-gray-600 font-medium mb-8">Merci pour votre message. Nous reviendrons vers vous très prochainement.</p>
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="px-10 py-4 bg-gray-900 text-white font-black uppercase rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95 text-xs tracking-widest"
                                    >
                                        ENVOYER UN AUTRE MESSAGE
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Nom complet</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => handleDataChange('name', e.target.value)}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-medium text-gray-900"
                                                placeholder="Jean Dupont"
                                                required
                                            />
                                            {errors.name && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-wider">{errors.name[0]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Email</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => handleDataChange('email', e.target.value)}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-medium text-gray-900"
                                                placeholder="jean@exemple.com"
                                                required
                                            />
                                            {errors.email && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-wider">{errors.email[0]}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Objet du message</label>
                                        <input
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) => handleDataChange('subject', e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-medium text-gray-900"
                                            placeholder="Demande de devis / renseignement technique"
                                            required
                                        />
                                        {errors.subject && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-wider">{errors.subject[0]}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Votre message</label>
                                        <textarea
                                            value={data.message}
                                            onChange={(e) => handleDataChange('message', e.target.value)}
                                            rows="5"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-forest-green focus:outline-none transition-all font-medium text-gray-900 resize-none"
                                            placeholder="Comment pouvons-nous vous aider ?"
                                            required
                                        ></textarea>
                                        {errors.message && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-wider">{errors.message[0]}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-5 bg-forest-green text-white font-black uppercase rounded-2xl hover:bg-dark-green transition-all shadow-xl shadow-forest-green/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 text-sm tracking-widest"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ENVOI EN COURS...
                                            </>
                                        ) : (
                                            <>
                                                ENVOYER LE MESSAGE
                                                <i className="icon-send"></i>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

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
        </MainLayout>
    );
}
