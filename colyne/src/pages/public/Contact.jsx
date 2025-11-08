import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import ContactForm from '../../components/ContactForm';
import { Mail, Phone, MapPin, Instagram, Facebook, Clock, MessageCircle } from 'lucide-react';

const Contact = () => {
  const { config } = useData();

  const defaultFaq = [
    {
      question: "Combien de temps à l'avance dois-je réserver ?",
      answer: "Je recommande de réserver au moins 2-3 semaines à l'avance, surtout pour les week-ends.",
    },
    {
      question: 'Quand vais-je recevoir mes photos ?',
      answer: 'Vous recevrez vos photos retouchées dans un délai de 2 à 3 semaines après la séance. Un aperçu peut être envoyé plus rapidement sur demande.',
    },
    {
      question: 'Puis-je choisir les photos que je souhaite garder ?',
      answer: 'Oui, je vous partage d\'abord une sélection de photos et vous pourrez choisir celles que vous souhaitez voir retouchées selon votre formule.',
    },
    {
      question: 'Que se passe-t-il en cas de mauvais temps pour une séance extérieure ?',
      answer: 'Nous pouvons reporter la séance sans frais. Je vous contacte la veille pour confirmer ou reprogrammer selon la météo.',
    },
    {
      question: 'Proposez-vous des albums photo ?',
      answer: "Oui, je propose différents formats d'albums premium en option. Contactez-moi pour plus de détails et tarifs.",
    },
  ];

  const faqs = (config.faq && config.faq.length > 0 ? config.faq : defaultFaq)
    .map((faq) => ({
      question: faq.question || faq.q || '',
      answer: faq.answer || faq.a || '',
    }))
    .filter((faq) => faq.question && faq.answer);

  const messengerUrl = config.contact?.messenger;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="section-padding bg-beige-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brown-dark mb-6">
              Contactez-moi
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Une question ? Un projet ? Je serais ravie d'échanger avec vous. 
              Remplissez le formulaire ci-dessous ou contactez-moi directement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-display font-bold text-brown-dark mb-6">
                  Informations de contact
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin size={24} className="text-brown flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                      <p className="text-gray-600">{config.contact.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone size={24} className="text-brown flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                      <a
                        href={`tel:${config.contact.phone}`}
                        className="text-gray-600 hover:text-brown transition-colors"
                      >
                        {config.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail size={24} className="text-brown flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a
                        href={`mailto:${config.contact.email}`}
                        className="text-gray-600 hover:text-brown transition-colors"
                      >
                        {config.contact.email}
                      </a>
                    </div>
                  </div>

                  {messengerUrl && (
                    <div className="flex items-start space-x-4">
                      <MessageCircle size={24} className="text-brown flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Messenger</h3>
                        <a
                          href={messengerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-brown transition-colors"
                        >
                          Discuter sur Messenger
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-4">
                    <Clock size={24} className="text-brown flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Disponibilité</h3>
                      <p className="text-gray-600">
                        Lundi - Dimanche<br />
                        9h00 - 19h00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Suivez-moi</h3>
                <div className="flex space-x-4">
                  <a
                    href={config.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-beige hover:bg-brown text-brown hover:text-white rounded-full transition-colors"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href={config.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-beige hover:bg-brown text-brown hover:text-white rounded-full transition-colors"
                  >
                    <Facebook size={24} />
                  </a>
                </div>
              </div>

              <div className="bg-beige-light p-6 rounded-lg">
                <h3 className="font-display font-semibold text-brown-dark mb-2">
                  Temps de réponse
                </h3>
                <p className="text-sm text-gray-600">
                  Je réponds généralement sous 48 à 72h. Pour les demandes urgentes, 
                  n'hésitez pas à m'appeler directement.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-beige-light p-8 md:p-12 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-display font-bold text-brown-dark mb-6">
                  Formulaire de contact
                </h2>
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="section-padding bg-beige-light">
          <div className="container-custom max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brown-dark mb-4">
                Questions fréquentes
              </h2>
              <p className="text-lg text-gray-600">
                Trouvez rapidement les réponses à vos questions
              </p>
            </motion.div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="font-display font-semibold text-lg text-brown-dark mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Contact;

