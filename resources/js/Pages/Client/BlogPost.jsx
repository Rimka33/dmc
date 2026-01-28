import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, User, Clock, ArrowLeft, Tag } from 'lucide-react';
import ShimmerImage from '../../Components/ShimmerImage';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/blog/${slug}`);
      if (response.data.success) {
        let postData = response.data.data;
        // Si le contenu n'a pas de balises HTML, on transforme les retours à la ligne
        if (
          postData.content &&
          !postData.content.includes('<p>') &&
          !postData.content.includes('<br>')
        ) {
          postData.content = postData.content
            .split(/\n\n+/)
            .map((p) => `<p>${p.trim().replace(/\n/g, '<br />')}</p>`)
            .join('');
        }
        setPost(postData);
      } else {
        setError('Article non trouvé');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError("Erreur lors du chargement de l'article");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="py-24 text-center">
          <h2 className="text-1xl font-bold text-gray-900 mb-4">{error || 'Article non trouvé'}</h2>
          <Link to="/blog" className="text-forest-green font-bold underline">
            Retour au blog
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {post && (
        <Head>
          <title>{post.title}</title>
          <meta
            name="description"
            content={post.excerpt || post.content?.replace(/<[^>]+>/g, '').substring(0, 160)}
          />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.excerpt} />
          <meta property="og:image" content={post.image} />
          <meta property="og:type" content="article" />
        </Head>
      )}
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <ShimmerImage
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            fallback={'/images/back.jpg'}
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center container mx-auto px-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/90 hover:text-neon-green transition-colors mb-6 text-sm font-bold"
          >
            <ArrowLeft size={16} />
            Retour au blog
          </Link>
          {post.category && (
            <div className="mb-4">
              <span className="px-4 py-2 bg-neon-green/20 backdrop-blur-md text-neon-green text-xs font-black uppercase tracking-widest rounded-lg border border-white/10">
                {post.category}
              </span>
            </div>
          )}
          <h1 className="text-1xl md:text-3xl font-black text-white uppercase tracking-tighter mb-6 drop-shadow-2xl">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-white/80 text-xs flex-wrap">
            {post.author && (
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <article className="py-20 bg-gray-50/50">
        <style>{`
                    .blog-content p {
                        text-align: justify !important;
                        text-justify: inter-word !important;
                        hyphens: auto !important;
                        font-family: 'Lora', serif !important;
                        margin-bottom: 1.5rem !important;
                    }
                    .blog-content {
                        font-family: 'Lora', serif !important;
                    }
                    .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4 {
                        font-family: 'Bai Jamjuree', sans-serif !important;
                    }
                `}</style>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
            <div
              className="prose prose-lg prose-slate max-w-none blog-content font-lora
                                       prose-headings:font-black prose-headings:font-sans prose-headings:text-gray-900 
                                       prose-h1:text-4xl prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-justify prose-p:hyphens-auto
                                       prose-strong:text-gray-900 prose-strong:font-black
                                       prose-ul:list-disc prose-ul:marker:text-forest-green
                                       prose-ol:list-decimal prose-ol:marker:text-forest-green prose-ol:font-black
                                       prose-li:text-gray-700
                                       prose-a:text-forest-green prose-a:font-bold prose-a:no-underline hover:prose-a:underline 
                                       prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:mx-auto prose-img:my-12
                                       prose-blockquote:border-l-4 prose-blockquote:border-l-forest-green prose-blockquote:bg-gray-50 prose-blockquote:p-8 prose-blockquote:rounded-r-3xl prose-blockquote:italic prose-blockquote:text-gray-700
                                       prose-code:bg-gray-100 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-forest-green prose-code:font-bold prose-code:before:content-none prose-code:after:content-none"
              style={{ textAlign: 'justify' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {post.related_posts && post.related_posts.length > 0 && (
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12 max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
                  Articles <span className="text-forest-green">Similaires</span>
                </h2>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                  D'autres conseils et actualités dans la catégorie {post.category}
                </p>
              </div>
              <Link
                to="/blog"
                className="text-xs font-black text-forest-green uppercase tracking-widest hover:underline whitespace-nowrap"
              >
                Voir tout le blog →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {post.related_posts.map((related) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.slug}`}
                  className="group bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      {related.date}
                    </p>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight group-hover:text-forest-green transition-colors line-clamp-2 leading-tight">
                      {related.title}
                    </h3>
                    <div className="mt-auto pt-4 flex items-center text-forest-green font-black text-[10px] uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Lire l'article <ArrowLeft className="w-3 h-3 rotate-180" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
