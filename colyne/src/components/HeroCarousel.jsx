import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from './LazyImage';

const HeroCarousel = ({ images, autoplay = true, interval = 5000, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = images && images.length > 0 ? images : [];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoplay || slides.length === 0) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [currentIndex, autoplay, interval, slides.length]);

  if (slides.length === 0) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}
        style={{ background: 'linear-gradient(135deg, #3C1518 0%, #6B3A2A 50%, #A67C5B 100%)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 sm:px-6 max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-3 sm:mb-4 leading-tight">
              Capturer l&apos;essence de vos moments précieux
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-200">
              Photographe professionnelle à Oye-plage
            </p>
            <a href="#services" className="btn-primary inline-block text-sm sm:text-base">
              Découvrir mes services
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ backgroundColor: '#111' }}>

      {/* Couche images — toutes rendues, crossfade CSS pur, sans superposition de texte */}
      {slides.map((slide, index) => (
        <div
          key={slide.url || index}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: index === currentIndex ? 1 : 0 }}
        >
          <img
            src={slide.url}
            alt={slide.title || ''}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Couche texte — indépendante, AnimatePresence propre */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-center text-white px-4 sm:px-6 max-w-4xl pointer-events-auto"
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-3 sm:mb-4 leading-tight">
              {slides[currentIndex].title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-200">
              {slides[currentIndex].subtitle}
            </p>
            <a href="#services" className="btn-primary inline-block text-sm sm:text-base">
              Découvrir mes services
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 z-10"
        aria-label="Image précédente"
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 z-10"
        aria-label="Image suivante"
      >
        <ChevronRight size={20} className="sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-6 sm:w-8'
                : 'bg-white/50 hover:bg-white/70 w-2 sm:w-3'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;

