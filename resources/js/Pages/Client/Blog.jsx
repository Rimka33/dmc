import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, User, ArrowRight, Tag, Clock } from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['Tous']);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [activeCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory !== 'Tous') {
        params.category = activeCategory;
      }
      const response = await api.get('/blog', { params });
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/blog/categories');
      if (response.data.success) {
        setCategories(['Tous', ...response.data.data]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredPosts =
    activeCategory === 'Tous' ? posts : posts.filter((post) => post.category === activeCategory);

  return (
    <MainLayout>
      <Head>
        <title>Blog Informatique & Tech - DMC</title>
        <meta
          name="description"
          content="Découvrez les dernières actualités technologiques, conseils informatiques et guides d'achat sur le blog de DMC SARL à Dakar."
        />
      </Head>
      {/* Hero Section */}
      <div className="relative h-56 md:h-64 bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <ShimmerImage
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
            alt="Blog Background"
            className="w-full h-full object-cover opacity-30"
            fallback={'/images/back.jpg'}
          />
        </div>

        <div className="relative z-10 text-center container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-2xl italic">
            LE <span className="text-neon-green">BLOG</span>
          </h1>
          <nav className="flex items-center justify-center gap-2 text-white/90 font-black text-[10px] uppercase tracking-[0.3em]">
            <Link to="/" className="hover:text-neon-green transition-colors">
              Accueil
            </Link>
            <span className="text-neon-green">//</span>
            <span className="text-white opacity-50">Actualités & Guides</span>
          </nav>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? 'bg-forest-green text-white shadow-lg shadow-forest-green/20 scale-105'
                    : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 h-96 animate-pulse"
                >
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-8 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 border border-gray-100 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="h-56 overflow-hidden relative">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1.5 bg-black/80 backdrop-blur-md text-neon-green text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10">
                        {post.category || 'Article'}
                      </span>
                    </div>
                    <ShimmerImage
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      fallback={'/images/back.jpg'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-bold">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.read_time || 5} min
                      </div>
                    </div>

                    <h2 className="text-xl font-black text-gray-900 mb-3 leading-tight group-hover:text-forest-green transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 whitespace-pre-line">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-900">
                          {post.author || 'DMC'}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-forest-green group-hover:border-forest-green group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Tag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-500">
                Désolé, aucun article ne correspond à cette catégorie pour le moment.
              </p>
              <button
                onClick={() => setActiveCategory('Tous')}
                className="mt-6 text-forest-green font-bold hover:underline"
              >
                Voir tous les articles
              </button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
