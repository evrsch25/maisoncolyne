import { useParams, Link, Navigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowLeft, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { getImageUrl } from '../../utils/api';

const Article = () => {
  const { slug } = useParams();
  const { blog } = useData();
  const [comment, setComment] = useState({ name: '', email: '', message: '' });
  const [comments, setComments] = useState([]);

  const article = blog.find((post) => post.slug === slug);
  const relatedArticles = blog.filter((post) => 
    post.slug !== slug && post.category === article?.category
  ).slice(0, 3);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }
    return parsed.toLocaleDateString('fr-FR', options);
  };

  const publishedDate = article.date || article.createdAt;
  const formattedDate = formatDate(publishedDate);
  const mainImage = article.mainImage || article.featured_image;
  const mainImageUrl = mainImage ? getImageUrl(mainImage) : 'https://images.unsplash.com/photo-1452457807411-4979b707c5be?w=1920';

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const newComment = {
      ...comment,
      date: new Date().toISOString(),
      id: Date.now(),
    };
    setComments([...comments, newComment]);
    setComment({ name: '', email: '', message: '' });
  };

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <div className="bg-white py-4">
        <div className="container-custom">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-brown hover:text-brown-dark transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Retour au blog</span>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <section className="relative h-[400px] md:h-[500px]">
        <img
          src={mainImageUrl}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white px-4 max-w-4xl"
          >
            {article.category && (
              <span className="inline-block px-4 py-1 bg-brown text-white text-sm font-medium rounded-full mb-4">
                {article.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              {article.title}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-200">
              {formattedDate && (
                <div className="flex items-center space-x-2">
                  <Calendar size={18} />
                  <time dateTime={publishedDate}>{formattedDate}</time>
                </div>
              )}
              {formattedDate && <span>•</span>}
              <span>Par {article.author}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              {/* Excerpt */}
              <div className="bg-beige-light p-6 rounded-lg mb-8">
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  {article.excerpt}
                </p>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {article.content}
                </p>

                {/* Gallery si présente */}
                {article.gallery && article.gallery.length > 0 && (
                  <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {article.gallery.map((image, index) => {
                      const galleryImage = getImageUrl(image) || 'https://images.unsplash.com/photo-1452457807411-4979b707c5be?w=600';
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="rounded-lg overflow-hidden shadow-lg"
                        >
                          <img
                            src={galleryImage}
                            alt={`Galerie ${index + 1}`}
                            loading="lazy"
                            className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center flex-wrap gap-3">
                    <Tag size={20} className="text-brown" />
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-beige text-brown text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-12 pt-12 border-t border-gray-200">
                <h3 className="text-2xl font-display font-bold text-brown-dark mb-8">
                  Commentaires ({comments.length})
                </h3>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-12 bg-beige-light p-6 rounded-lg">
                  <h4 className="font-display font-semibold text-lg text-gray-900 mb-4">
                    Laisser un commentaire
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Votre nom *"
                        value={comment.name}
                        onChange={(e) => setComment({ ...comment, name: e.target.value })}
                        required
                        className="input-field"
                      />
                      <input
                        type="email"
                        placeholder="Votre email *"
                        value={comment.email}
                        onChange={(e) => setComment({ ...comment, email: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                    <textarea
                      placeholder="Votre commentaire *"
                      value={comment.message}
                      onChange={(e) => setComment({ ...comment, message: e.target.value })}
                      required
                      rows={4}
                      className="textarea-field"
                    />
                    <button type="submit" className="btn-primary">
                      Publier le commentaire
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((c) => (
                    <div key={c.id} className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-gray-900">{c.name}</h5>
                        <time className="text-sm text-gray-500">
                          {formatDate(c.date)}
                        </time>
                      </div>
                      <p className="text-gray-700">{c.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="section-padding bg-beige-light">
          <div className="container-custom">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-display font-bold text-brown-dark mb-12 text-center"
            >
              Articles similaires
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((post) => {
                const relatedImage = getImageUrl(post.mainImage || post.featured_image) || 'https://images.unsplash.com/photo-1452457807411-4979b707c5be?w=600';
                const relatedDate = formatDate(post.date || post.createdAt);

                return (
                  <Link key={post._id || post.id} to={`/blog/${post.slug}`} className="group">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relatedImage}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-brown transition-colors">
                          {post.title}
                        </h3>
                        {relatedDate && (
                          <p className="text-xs text-gray-400 mb-2">
                            {relatedDate}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Article;

