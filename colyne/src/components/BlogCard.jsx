import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../utils/api';

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }
    return parsed.toLocaleDateString('fr-FR', options);
  };

  const imagePath = post.mainImage || post.featured_image;
  const imageUrl = imagePath ? getImageUrl(imagePath) : 'https://images.unsplash.com/photo-1452457807411-4979b707c5be?w=600';
  const publishedDate = post.date || post.createdAt;
  const formattedDate = formatDate(publishedDate);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
    >
      {/* Image */}
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {post.category && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-brown text-white text-xs font-medium rounded-full">
              {post.category}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        {formattedDate && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Calendar size={16} className="mr-2" />
            <time dateTime={publishedDate}>{formattedDate}</time>
          </div>
        )}

        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-display font-semibold text-gray-900 mb-3 hover:text-brown transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center space-x-2 text-brown hover:text-brown-dark transition-colors group"
        >
          <span className="font-medium">Lire la suite</span>
          <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;

