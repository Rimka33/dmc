import React, { useEffect, useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';
import axios from 'axios';

export default function About() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      const response = await axios.get('/api/pages/a-propos');
      setPage(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement de la page à propos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Hero Header */}
      <div className="relative h-[300px] bg-[#021008] overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-20">
          <ShimmerImage
            src="/images/back.jpg"
            alt="background"
            className="w-full h-full object-cover"
            fallback={'/images/back.jpg'}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase mb-4 leading-tight">
              {page?.title || 'Qui Sommes'}{' '}
              <span className="text-neon-green">{!page ? 'Nous ?' : ''}</span>
            </h1>
            <nav className="flex items-center justify-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
              <Link to="/" className="hover:text-neon-green transition-colors">
                Accueil
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-neon-green">Qui sommes-nous ?</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">
                  Chargement...
                </p>
              </div>
            ) : page ? (
              <>
                <div className="mb-12 text-center">
                  <h2 className="text-xl font-black text-gray-900 uppercase mb-4 tracking-tighter">
                    {page.title}
                  </h2>
                  <div className="w-20 h-1 bg-neon-green mx-auto"></div>
                </div>

                <div
                  className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-xl font-black text-gray-900 uppercase mb-4">
                  Page non trouvée
                </h2>
                <p className="text-gray-500 mb-8">
                  Désolé, le contenu que vous recherchez n'est pas disponible pour le moment.
                </p>
                <Link
                  to="/"
                  className="px-8 py-4 bg-forest-green text-white font-black uppercase rounded-sm hover:bg-dark-green transition-all"
                >
                  Retour à l'accueil
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
