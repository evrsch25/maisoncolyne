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
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {post.category && (
            <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1 bg-brown text-white text-xs font-medium rounded-full">
              {post.category}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {formattedDate && (
          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
            <Calendar size={14} className="mr-1.5 sm:mr-2 sm:w-4 sm:h-4" />
            <time dateTime={publishedDate}>{formattedDate}</time>
          </div>
        )}

        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900 mb-2 sm:mb-3 hover:text-brown transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center space-x-1 sm:space-x-2 text-brown hover:text-brown-dark transition-colors group"
        >
          <span className="font-medium text-sm sm:text-base">Lire la suite</span>
          <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform sm:w-[18px] sm:h-[18px]" />
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;

