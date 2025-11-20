import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import { Camera, Heart, Clock, Sparkles } from 'lucide-react';
import { mediaStaticAPI, getImageUrl } from '../../utils/api';

const APropos = () => {
  const { config } = useData();
  const [media, setMedia] = useState({
    hero: null,
    portrait: null,
    parcours: null,
    pourquoi: null,
  });

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const response = await mediaStaticAPI.getAll({ page: 'a-propos', active: true });
        if (response.success) {
          const findMediaByLocation = (location) =>
            response.data
              .filter((item) => item.location === location && item.active !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0))[0] || null;

          setMedia({
            hero: findMediaByLocation('photo-hero'),
            portrait: findMediaByLocation('photo-portrait'),
            parcours: findMediaByLocation('photo-parcours'),
            pourquoi: findMediaByLocation('photo-pourquoi'),
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des médias pour 'À propos':", error);
      }
    };

    loadMedia();
  }, []);

  const heroImageUrl = media.hero ? getImageUrl(media.hero.image) : 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&q=80';
  const heroImageAlt = media.hero?.alt || 'Colyne Photographe';

  const portraitImageUrl = media.portrait ? getImageUrl(media.portrait.image) : 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80';
  const portraitImageAlt = media.portrait?.alt || 'Colyne avec son appareil photo';

  const pourquoiImageUrl = media.pourquoi ? getImageUrl(media.pourquoi.image) : 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80';
  const pourquoiImageAlt = media.pourquoi?.alt || 'Passion pour la photographie';

  const parcoursImageUrl = media.parcours ? getImageUrl(media.parcours.image) : 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80';
  const parcoursImageAlt = media.parcours?.alt || 'Mon parcours';

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px]">
        <img
          src={heroImageUrl}
          alt={heroImageAlt}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white px-4 sm:px-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3 sm:mb-4">
              À propos de moi
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200">
              Photographe passionnée à Oye-plage
            </p>
          </motion.div>
        </div>
      </section>

      {/* Présentation principale */}
      <section className="section-padding bg-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <img
                src={portraitImageUrl}
                alt={portraitImageAlt}
                loading="lazy"
                className="rounded-2xl shadow-2xl w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-brown-dark mb-4 sm:mb-6">
                Mon portrait
              </h2>
              <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg whitespace-pre-line">
                  {config.about.fullDescription}
                </p>
                <p className="text-sm sm:text-base">
                  Derrière l'objectif, Colyne, photographe passionnée par la lumière naturelle et les émotions vraies. Depuis toujours, la photographie fait partie de ma vie : j'ai reçu mon tout premier appareil photo à huit ans, puis un réflex à quinze. Pourtant, pendant longtemps, je me suis empêchée de rêver de devenir photographe.
                  Tout a changé le jour où je suis tombée enceinte de mon aînée. En cherchant à immortaliser ma grossesse, j'ai redécouvert ce plaisir de créer, de capturer la douceur d'un moment. Puis, lors d'un shooting de Noël avec mon conjoint et notre fille, j'ai eu un véritable déclic : et si moi aussi, je pouvais le faire ?
                  Mon entreprise est née en même temps que ma deuxième fille. Je l'ai photographiée sous tous les angles, avec tendresse et émerveillement. Grâce à beaucoup de travail, d'envie, et au soutien d'une formidable formatrice, devenue une amie précieuse, j'ai pu donner vie à ce rêve : photographier vos plus beaux instants.
                </p>
                <p className="text-sm sm:text-base">
                  Aujourd'hui, à Maison Colyne, je vous accueille dans un univers doux et chaleureux, où chaque séance est pensée pour vous ressembler. Mon style est lumineux, naturel et intemporel, avec une attention particulière portée à la sincérité des émotions et à la délicatesse des détails.
                  Plus qu'un simple studio, Maison Colyne est un lieu de vie, de souvenirs et de transmission, un endroit où la douceur devient image, et l'image devient mémoire.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

{/* Pourquoi la photo */}
<section className="section-padding bg-beige-light">
  <div className="container-custom px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="order-2 lg:order-1"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-brown-dark mb-4 sm:mb-6">
          Pourquoi la photographie ?
        </h2>
        <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
          <p>
            La photo est pour moi une manière de donner du sens au temps qui passe.
          </p>
          <p>
            Elle transforme les instants fugaces en souvenirs concrets, permet de revivre des émotions et de célébrer la beauté du quotidien. J'aime capturer ce qui est vrai, ce qui touche le cœur : un éclat de rire, une main serrée, un regard complice, un sourire bienveillant.
          </p>
          <p>
            Chaque image devient une petite histoire que l'on peut conserver, partager et transmettre, bien au‑delà du moment lui‑même. La photographie est donc mon moyen de rendre visible l'invisible : l'amour, la tendresse et les liens qui nous unissent.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="order-1 lg:order-2"
      >
        <img
          src={pourquoiImageUrl}
          alt={pourquoiImageAlt}
          loading="lazy"
          className="rounded-2xl shadow-2xl w-full h-full object-cover"
        />
      </motion.div>
    </div>
  </div>
</section>

      {/* Informations complémentaires */}
      <section className="section-padding bg-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-brown-dark mb-4 sm:mb-6">
                Mon parcours
              </h2>
              <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  Le studio Maison Colyne est situé à Oye-plage, un lieu paisible où tout est pensé pour vous offrir une expérience douce et chaleureuse.
                </p>
                <p className="text-sm sm:text-base">
                  Avant chaque rendez-vous, je prends toujours le temps d'échanger avec vous afin de mieux comprendre vos attentes et d'imaginer une séance qui vous ressemble vraiment. Si vous avez une idée précise, n'hésitez pas à me la confier : nous pouvons créer ensemble une séance à thème sur mesure, pleine de sens et d'émotion.
                </p>
                <p className="text-sm sm:text-base">
                  Je ne fixe pas de durée pour les séances, car l'essentiel est que vous soyez à l'aise vous, votre enfant, votre famille. Chaque moment se déroule à votre rythme, dans la bienveillance et la simplicité, pour que les images reflètent pleinement votre histoire.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <img
                src={parcoursImageUrl}
                alt={parcoursImageAlt}
                loading="lazy"
                className="rounded-2xl shadow-2xl w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="section-padding bg-beige-light">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-brown-dark mb-8 sm:mb-12 text-center"
          >
            Mes valeurs
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Heart,
                title: 'Authenticité',
                description: 'Des photos naturelles qui reflètent qui vous êtes vraiment',
              },
              {
                icon: Camera,
                title: 'Créativité',
                description: 'Une approche artistique unique pour chaque projet',
              },
              {
                icon: Clock,
                title: 'Intemporel',
                description: 'Des images qui traversent le temps et restent précieuses',
              },
              {
                icon: Sparkles,
                title: 'Bienveillance',
                description: 'Une atmosphère chaleureuse pour vous mettre à l\'aise',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-5 sm:p-6 rounded-lg shadow-md text-center"
              >
                <value.icon size={40} className="mx-auto text-green mb-3 sm:mb-4 sm:w-12 sm:h-12" />
                <h3 className="text-lg sm:text-xl font-display font-semibold text-brown-dark mb-2 sm:mb-3">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-green text-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 sm:mb-6">
              Envie de travailler ensemble ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-beige-light mb-6 sm:mb-8">
              Je serais ravie d'échanger avec vous sur votre projet et de créer ensemble 
              des images qui vous ressemblent
            </p>
            <a href="/contact" className="btn-secondary text-sm sm:text-base">
              Me contacter
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default APropos;

