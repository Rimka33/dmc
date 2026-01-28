import React, { useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import { Mail, ChevronRight, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.success) {
        setStatus({
          type: 'success',
          message: 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.',
        });
        setEmail('');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Une erreur est survenue. Veuillez vérifier votre adresse e-mail.',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <section className="bg-light-gray-bg py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm justify-center">
            <Link to="/" className="text-forest-green hover:underline">
              Accueil
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link to="/connexion" className="text-forest-green hover:underline">
              Connexion
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600 font-semibold">Mot de passe oublié</span>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-forest-green" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 uppercase italic mb-3">
                Mot de passe oublié ?
              </h1>
              <p className="text-gray-500 text-sm">
                Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre
                mot de passe.
              </p>
            </div>

            {status.message && (
              <div
                className={`p-4 rounded-lg mb-6 text-sm font-bold ${
                  status.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'bg-red-50 text-red-700 border border-red-100'
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-xs font-bold uppercase mb-2">
                  Adresse e-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-forest-green focus:outline-none transition-colors"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-forest-green text-white font-bold uppercase tracking-wider hover:bg-dark-green transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                {processing ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>

              <Link
                to="/connexion"
                className="flex items-center justify-center gap-2 text-forest-green text-sm font-bold hover:underline transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
