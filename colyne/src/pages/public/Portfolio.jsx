import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { portfolioAPI, getImageUrl } from '../../utils/api';

const sortImagesByDate = (images) => {
  return [...images].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : 0;
    const dateB = b.createdAt ? new Date(b.createdAt) : 0;
    return dateA - dateB;
  });
};

const Portfolio = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const response = await portfolioAPI.getAll();
      if (response.success) {
        setGalleryImages(sortImagesByDate(response.data));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { value: 'all', label: 'Tous' },
    { value: 'nouveau-ne', label: 'Nouveau-né' },
    { value: 'bebe', label: 'Bébé' },
    { value: 'grossesse', label: 'Grossesse' },
    { value: 'famille', label: 'Famille' },
    { value: 'iris', label: 'Iris' },
  ];

  const filteredImages = activeFilter === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeFilter);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="section-padding bg-beige-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brown-dark mb-6">
              Portfolio
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Découvrez une sélection de mes plus belles créations. Chaque image raconte une histoire, 
              capture une émotion et immortalise un moment précieux.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white sticky top-20 z-40 border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter.value
                    ? 'bg-brown text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-beige hover:text-brown'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement du portfolio...</p>
              </div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Aucune image à afficher</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="break-inside-avoid group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                >
                  <img
                    src={getImageUrl(image.image)}
                    alt={image.title || 'Portfolio'}
                    loading="lazy"
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div>
                      {image.title && (
                        <p className="text-white font-display font-semibold text-lg">
                          {image.title}
                        </p>
                      )}
                      <p className="text-beige-light text-sm capitalize">
                        {filters.find(f => f.value === image.category)?.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-beige-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brown-dark mb-4">
              Vous aimez mon travail ?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Contactez-moi pour discuter de votre projet et créer ensemble des images qui vous ressemblent
            </p>
            <a href="/contact" className="btn-primary text-lg">
              Me contacter
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;

