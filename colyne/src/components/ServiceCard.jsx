import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '../utils/api';

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
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={getImageUrl(prestation.mainImage || prestation.image) || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600'}
          alt={prestation.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-display font-semibold text-brown-dark mb-3">
          {prestation.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {prestation.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-green font-semibold text-lg">
            {prestation.basePrice}
          </p>
          <Link
            to={`/prestation/${prestation.slug}`}
            className="flex items-center space-x-2 text-green hover:text-green-dark transition-colors group"
          >
            <span className="font-medium">Découvrir</span>
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;

