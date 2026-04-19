import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '../utils/api';
import LazyImage from './LazyImage';

const ServiceCard = ({ prestation }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="card-service group"
    >
      {/* Image */}
      <div className="relative h-56 sm:h-64 md:h-80 overflow-hidden">
        {getImageUrl(prestation.mainImage || prestation.image) ? (
          <LazyImage
            src={getImageUrl(prestation.mainImage || prestation.image)}
            alt={prestation.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F5EFE6' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#C4A882', opacity: 0.5 }}>
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-display font-semibold text-brown-dark mb-2 sm:mb-3">
          {prestation.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3 whitespace-pre-line">
          {prestation.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-green font-semibold text-base sm:text-lg">
            {prestation.basePrice}
          </p>
          <Link
            to={`/prestation/${prestation.slug}`}
            className="flex items-center space-x-1 sm:space-x-2 text-green hover:text-green-dark transition-colors group"
          >
            <span className="font-medium text-sm sm:text-base">Découvrir</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform sm:w-[18px] sm:h-[18px]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;

