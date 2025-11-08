import { useParams, Link, Navigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import { MapPin, Check, ArrowLeft } from 'lucide-react';
import ContactForm from '../../components/ContactForm';
import { getImageUrl } from '../../utils/api';

const PrestationDetail = () => {
  const { slug } = useParams();
  const { prestations } = useData();

  const prestation = prestations.find((p) => p.slug === slug);

  if (!prestation) {
    return <Navigate to="/prestations" replace />;
  }

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <div className="bg-beige-light py-4">
        <div className="container-custom">
          <Link
            to="/prestations"
            className="inline-flex items-center space-x-2 text-brown hover:text-brown-dark transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Retour aux prestations</span>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-[400px] md:h-[500px]">
        <img
          src={getImageUrl(prestation.mainImage || prestation.image) || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920'}
          alt={prestation.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              {prestation.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              {prestation.shortDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Infos rapides */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center space-x-3">
              <MapPin size={24} className="text-brown" />
              <div>
                <p className="text-sm text-gray-500">Lieu</p>
                <p className="font-semibold text-gray-900">{prestation.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-brown text-2xl">€</div>
              <div>
                <p className="text-sm text-gray-500">Tarif</p>
                <p className="font-semibold text-gray-900">{prestation.basePrice}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="section-padding bg-beige-light">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold text-brown-dark mb-6">
              La séance en détails
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {prestation.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold text-brown-dark mb-8">
              Ce qui est inclus
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prestation.included && prestation.included.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <Check size={24} className="text-brown flex-shrink-0 mt-1" />
                  <p className="text-gray-700">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tarifs détaillés */}
      {prestation.priceDetails && Array.isArray(prestation.priceDetails) && prestation.priceDetails.length > 0 && (
        <section className="section-padding bg-beige-light">
          <div className="container-custom max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-brown-dark mb-8">
                Tarifs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {prestation.priceDetails.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h3 className="font-display font-semibold text-lg text-brown-dark mb-3 capitalize text-center">
                      {detail.sessionType.replace(/-/g, ' ')}
                    </h3>
                    <p className="text-3xl font-bold text-brown text-center mb-3">{detail.price}€</p>
                    {detail.deliverables && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Livrables : </span>
                        {detail.deliverables}
                      </p>
                    )}
                    {detail.description && (
                      <p className="text-sm text-gray-600">
                        {detail.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Galerie */}
      {((prestation.inspirationGallery && prestation.inspirationGallery.length > 0) || (prestation.gallery && prestation.gallery.length > 0)) && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold text-brown-dark mb-4">
                Galerie d'inspiration
              </h2>
              <p className="text-lg text-gray-600">
                Quelques exemples de photos de cette prestation
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(prestation.inspirationGallery || prestation.gallery || []).map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="aspect-square overflow-hidden rounded-lg shadow-lg"
                >
                  <img
                    src={getImageUrl(image) || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600'}
                    alt={`Galerie ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA & Contact Form */}
      <section className="section-padding bg-beige-light">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brown-dark mb-4">
              Intéressé(e) par cette séance ?
            </h2>
            <p className="text-lg text-gray-600">
              Contactez-moi pour réserver votre séance ou pour plus d'informations
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrestationDetail;

