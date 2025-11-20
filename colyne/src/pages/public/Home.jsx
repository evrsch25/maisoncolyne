import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import HeroCarousel from '../../components/HeroCarousel';
import ServiceCard from '../../components/ServiceCard';
import BlogCard from '../../components/BlogCard';
import TestimonialCard from '../../components/TestimonialCard';
import { Camera, Heart, Star, Instagram, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import { mediaStaticAPI, getImageUrl } from '../../utils/api';

const Home = () => {
  const { prestations, blog, config, testimonials } = useData();
  const [carouselImages, setCarouselImages] = useState([]);
  const [bienvenueImage, setBienvenueImage] = useState(null);
  const [pourquoiChoisirImage, setPourquoiChoisirImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les médias statiques pour l'accueil
  useEffect(() => {
    if (!config) return;
    const loadMedia = async () => {
      try {
        const response = await mediaStaticAPI.getAll({ page: 'accueil', active: true });
        if (response.success) {
          // Filtrer et formater les images du carousel
          const carouselMedia = response.data
            .filter(m => m.location === 'carousel')
            .sort((a, b) => a.order - b.order);
          
          // Utiliser les slides de la config si disponibles, sinon valeurs par défaut
          const slides = config?.hero?.slides?.length > 0 
            ? config.hero.slides.sort((a, b) => a.order - b.order)
            : [
                { title: 'Capturer l\'essence de vos moments précieux', subtitle: 'Photographe professionnelle à Oye-plage', order: 0 },
                { title: 'Des souvenirs qui traversent le temps', subtitle: 'Maternité, famille, mariage', order: 1 },
                { title: 'L\'art de sublimer vos émotions', subtitle: 'Avec sensibilité et authenticité', order: 2 }
              ];

          const carousel = carouselMedia.map((m, index) => ({
            url: getImageUrl(m.image),
            title: slides[index]?.title || slides[0]?.title || 'Capturer l\'essence de vos moments précieux',
            subtitle: slides[index]?.subtitle || slides[0]?.subtitle || 'Photographe professionnelle à Oye-plage'
          }));
          setCarouselImages(carousel);

          // Trouver l'image de bienvenue
          const bienvenue = response.data.find(m => m.location === 'bienvenue');
          if (bienvenue) {
            setBienvenueImage(getImageUrl(bienvenue.image));
          }

          // Trouver l'image "Pourquoi me choisir"
          const pourquoiChoisir = response.data.find(m => m.location === 'pourquoi-choisir');
          if (pourquoiChoisir) {
            setPourquoiChoisirImage(getImageUrl(pourquoiChoisir.image));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des médias:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMedia();
  }, [config]);

  // Filtrer les prestations featured
  const featuredPrestations = prestations.filter(p => p.featured).slice(0, 3);
  
  // Récupérer les 3 articles les plus récents
  const latestBlogPosts = [...blog]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.updatedAt || 0);
      const dateB = new Date(b.createdAt || b.updatedAt || 0);
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero Carousel */}
      <HeroCarousel images={carouselImages} />

      {/* Section Présentation avec image */}
      <section className="section-padding bg-beige-light">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Image de bienvenue (si disponible) */}
            {bienvenueImage && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1 lg:col-span-1"
              >
                <img
                  src={bienvenueImage}
                  alt="Bienvenue"
                  loading="lazy"
                  className="w-full h-auto rounded-lg shadow-lg object-cover"
                />
              </motion.div>
            )}
            
            {/* Texte de bienvenue */}
            <div className={`order-1 lg:order-2 ${!bienvenueImage ? 'lg:col-span-3 max-w-3xl mx-auto text-center' : 'lg:col-span-2'}`}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`text-2xl sm:text-3xl md:text-4xl font-display font-bold text-brown-dark mb-4 sm:mb-6 ${!bienvenueImage ? 'text-center' : ''}`}
              >
                Bienvenue dans mon univers
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className={`text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 ${!bienvenueImage ? 'text-center' : ''}`}
              >
                {config.about.shortDescription}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className={!bienvenueImage ? 'text-center' : ''}
              >
                <Link to="/a-propos" className="btn-primary inline-block">
                  En savoir plus sur moi
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Pourquoi me choisir */}
      <section className="section-padding bg-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Texte à gauche */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-display font-semibold mb-2 text-brown-dark flex items-center gap-2 sm:gap-3">
                    <Heart size={20} className="text-green flex-shrink-0 sm:w-6 sm:h-6" />
                    Un moment pour vous, des souvenirs pour toujours
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Offrez-vous une parenthèse rien que pour vous. Une séance photo, c'est bien plus que de jolies images : c'est un moment de partage, de rires et de spontanéité. Je vous accompagne avec douceur pour que vous soyez à l'aise et profitiez pleinement de cette expérience unique. Laissez-vous porter et repartez avec des souvenirs vrais et lumineux.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-display font-semibold mb-2 text-brown-dark flex items-center gap-2 sm:gap-3">
                    <Camera size={20} className="text-green flex-shrink-0 sm:w-6 sm:h-6" />                    
                    Votre séance photo, simplement
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Réserver votre séance, c'est le premier pas vers une expérience authentique et personnalisée. Pas de stress, pas de poses rigides : juste un moment convivial où vous êtes libre d'être vous-même. Cliquez, choisissez votre date, et laissez-moi capturer votre histoire avec douceur et spontanéité.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Image à droite */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <img
                src={pourquoiChoisirImage || 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800'}
                alt="Pourquoi me choisir"
                loading="lazy"
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Citation */}
      <section className="py-10 sm:py-12 lg:py-16 bg-green text-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-xl sm:text-2xl md:text-3xl font-display italic mb-3 sm:mb-4 leading-relaxed">
              " Photographier, c'est mettre sur la même ligne de mire la tête, l'oeil et le coeur. "
            </p>
            <footer className="text-sm sm:text-base text-beige-light">— Henri Cartier Besson</footer>
          </motion.blockquote>
        </div>
      </section>

      {/* Section Prestations */}
      <section id="services" className="section-padding bg-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-brown-dark mb-3 sm:mb-4">
              Les séances proposées
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Découvrez mes différentes séances photo, chacune pensée pour capturer vos moments précieux
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredPrestations.map((prestation) => (
              <ServiceCard key={prestation._id || prestation.id} prestation={prestation} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/prestations" className="btn-outline">
              Découvrir les autres séances
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section CTA Contact */}
      <section className="section-padding bg-beige-light">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-brown-dark mb-3 sm:mb-4">
              Une question ? Un projet ?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              N'hésitez pas à me contacter pour échanger sur votre projet photo. Je serais ravie de vous accompagner dans la création de souvenirs uniques.
            </p>
            <Link to="/contact" className="btn-primary text-base sm:text-lg">
              Me contacter
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="section-padding bg-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-brown-dark mb-3 sm:mb-4">
              Ils m'ont fait confiance
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les témoignages de mes clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial._id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Blog */}
      {latestBlogPosts.length > 0 && (
        <section className="section-padding bg-beige-light">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-brown-dark mb-3 sm:mb-4">
                Derniers articles
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Conseils, inspirations et coulisses de mes séances photo
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {latestBlogPosts.map((post) => (
                <BlogCard key={post._id || post.id} post={post} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/blog" className="btn-outline">
                Voir tous les articles
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

