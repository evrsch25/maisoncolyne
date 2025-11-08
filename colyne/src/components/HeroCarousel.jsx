import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroCarousel = ({ images, autoplay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultImages = [
    {
      url: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=1920&q=80',
      title: 'Capturer l\'essence de vos moments précieux',
      subtitle: 'Photographe professionnelle à Oye-plage',
    },
    {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
      title: 'Des souvenirs qui traversent le temps',
      subtitle: 'Maternité, famille, mariage',
    },
    {
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80',
      title: 'L\'art de sublimer vos émotions',
      subtitle: 'Avec sensibilité et authenticité',
    },
  ];

  const slides = (images && images.length > 0) ? images : defaultImages;

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
    if (!autoplay) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [currentIndex, autoplay, interval]);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex].url}
            alt={slides[currentIndex].title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
              >
                {slides[currentIndex].title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200"
              >
                {slides[currentIndex].subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <a href="#services" className="btn-primary inline-block">
                  Découvrir mes services
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 z-10"
        aria-label="Image précédente"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 z-10"
        aria-label="Image suivante"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;

