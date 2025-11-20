import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useMemo } from 'react';
import { useData } from '../context/DataContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { prestations } = useData();

  const prestationsLinks = useMemo(() => {
    if (prestations && prestations.length > 0) {
      return prestations.map((prestation) => ({
        slug: prestation.slug,
        title: prestation.title || prestation.name || 'Prestation'
      }));
    }

    return [
      { slug: 'seance-grossesse', title: 'Séance Grossesse' },
      { slug: 'nouveau-ne', title: 'Nouveau-né' },
      { slug: 'famille', title: 'Portrait Famille' },
      { slug: 'portrait-individuel', title: 'Portrait Individuel' },
      { slug: 'mariage', title: 'Mariage' }
    ];
  }, [prestations]);

  return (
    <footer className="bg-primary-800 text-white">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* À propos */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-display font-bold mb-3 sm:mb-4 text-white">
              Colyne Photographe
            </h3>
            <p className="text-white mb-3 sm:mb-4 text-sm leading-relaxed">
              Photographe professionnelle à Oye-plage, spécialisée dans la photographie de maternité, famille et de naissance.
            </p>
            <div className="flex space-x-4 justify-center sm:justify-start">
              <a
                href="https://www.instagram.com/maison_colyne"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-beige-light transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={22} className="sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100088668435009"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-beige-light transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={22} className="sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-display font-semibold mb-3 sm:mb-4 text-white">
              Navigation
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm">
              <li>
                <Link to="/" className="text-white hover:text-beige-light transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/prestations" className="text-white hover:text-beige-light transition-colors">
                  Prestations
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-white hover:text-beige-light transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-white hover:text-beige-light transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white hover:text-beige-light transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white hover:text-beige-light transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Prestations */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-display font-semibold mb-3 sm:mb-4 text-white">
              Prestations
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm">
              {prestationsLinks.map(({ slug, title }) => (
                <li key={slug}>
                  <Link to={`/prestation/${slug}`} className="text-white hover:text-beige-light transition-colors">
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-display font-semibold mb-3 sm:mb-4 text-white">
              Contact
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm">
              <li className="flex items-start space-x-2 justify-center sm:justify-start">
                <MapPin size={16} className="text-white mt-0.5 flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                <span className="text-white text-left">265 Rue des Petits Moulins, 62215 Oye-Plage</span>
              </li>
              <li className="flex items-start space-x-2 justify-center sm:justify-start">
                <Phone size={16} className="text-white mt-0.5 flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                <a href="tel:+33667914707" className="text-white hover:text-beige-light transition-colors">
                +33 6 67 91 47 07
                </a>
              </li>
              <li className="flex items-start space-x-2 justify-center sm:justify-start">
                <Mail size={16} className="text-white mt-0.5 flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                <a href="mailto:maisoncolyne@gmail.com" className="text-white hover:text-beige-light transition-colors break-all">
                maisoncolyne@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-700">
        <div className="container-custom px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 text-xs sm:text-sm text-white">
            <p className="flex items-center text-center sm:text-left">
              © {currentYear} Colyne Photographe. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              <Link to="/mentions-legales" className="text-white hover:text-beige-light transition-colors">
                Mentions légales
              </Link>
              <Link to="/politique-confidentialite" className="text-white hover:text-beige-light transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/cgv" className="text-white hover:text-beige-light transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

