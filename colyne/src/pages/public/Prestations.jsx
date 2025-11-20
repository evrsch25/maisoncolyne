import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import ServiceCard from '../../components/ServiceCard';
import ContactForm from '../../components/ContactForm';
import HeroCarousel from '../../components/HeroCarousel';
import { Camera, Clock, MapPin, Check } from 'lucide-react';
import { mediaStaticAPI, getImageUrl } from '../../utils/api';

const Prestations = () => {
  const { prestations, config } = useData();
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les médias statiques pour la page prestations
  useEffect(() => {
    const loadMedia = async () => {
      try {
        const response = await mediaStaticAPI.getAll({ page: 'prestations', active: true });
        if (response.success) {
          // Filtrer et formater les images du carousel
          const carousel = response.data
            .filter(m => m.location === 'carousel')
            .sort((a, b) => a.order - b.order)
            .map((m, index) => ({
              url: getImageUrl(m.image),
              title: m.title || 'Mes Prestations Photo',
              subtitle: m.alt || 'Découvrez toutes mes offres de séances photo'
            }));
          setCarouselImages(carousel);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des médias:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMedia();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Carousel */}
      {carouselImages.length > 0 && <HeroCarousel images={carouselImages} />}

      {/* Header */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brown-dark mb-6">
              Mes Prestations
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              {config.about.philosophy}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Prestations en cartes */}
      <section id="prestations-list" className="section-padding bg-beige-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brown-dark mb-4">
              Découvrez toutes mes offres
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chaque séance est unique et personnalisée selon vos besoins
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prestations.map((prestation) => (
              <ServiceCard key={prestation.id} prestation={prestation} />
            ))}
          </div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-brown-dark mb-12 text-center"
          >
            Ce qui est inclus dans mes prestations
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Camera, title: 'Séance personnalisée', desc: 'Ambiance et style adaptés à vos envies' },
              { icon: Check, title: 'Retouches professionnelles', desc: 'Chaque photo sublimée avec soin' },
              { icon: MapPin, title: 'Lieux flexibles', desc: 'En studio ou en extérieur' },
              { icon: Clock, title: 'Galerie en ligne privée', desc: 'Accès illimité à vos photos' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-beige-light rounded-lg"
              >
                <item.icon size={40} className="mx-auto text-green mb-4" />
                <h3 className="font-display font-semibold text-lg mb-2 text-brown-dark">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section className="section-padding bg-beige-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brown-dark mb-4">
                Réservez votre séance
              </h2>
              <p className="text-lg text-gray-600">
                Remplissez le formulaire ci-dessous et je vous répondrai rapidement
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Prestations;

