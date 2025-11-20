import { useState, useEffect, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mediaStaticAPI, getImageUrl } from '../utils/api';
import { useData } from '../context/DataContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [logo, setLogo] = useState(null);
  const { prestations } = useData();

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const response = await mediaStaticAPI.getByPageLocation('accueil', 'logo');
      if (response.success && response.data.length > 0) {
        setLogo(response.data[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du logo:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveSubmenu(null);
  };

  const prestationsSubmenu = useMemo(() => {
    if (prestations && prestations.length > 0) {
      return prestations.map((prestation) => ({
        path: `/prestation/${prestation.slug}`,
        label: prestation.title || prestation.name || 'Prestation'
      }));
    }

    return [
      { path: '/prestation/seance-grossesse', label: 'Séance Grossesse' },
      { path: '/prestation/nouveau-ne', label: 'Nouveau-né' },
      { path: '/prestation/famille', label: 'Portrait Famille' },
      { path: '/prestation/portrait-individuel', label: 'Portrait Individuel' },
      { path: '/prestation/mariage', label: 'Mariage' }
    ];
  }, [prestations]);

  const menuItems = [
    { path: '/', label: 'Accueil' },
    { 
      path: '/prestations', 
      label: 'Prestations',
      submenu: prestationsSubmenu
    },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  // Séparer les menus en deux groupes
  const leftMenuItems = menuItems.slice(0, 3); // Accueil, Prestations, Portfolio
  const rightMenuItems = menuItems.slice(3); // À propos, Blog, Contact

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: '#FFFBF6' }}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-36">
          {/* Navigation Gauche Desktop */}
          <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-end">
            {leftMenuItems.map((item) => (
              <div
                key={item.path}
                className="relative group"
                onMouseEnter={() => item.submenu && setActiveSubmenu(item.path)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `hover:text-green transition-colors duration-300 font-medium ${
                      isActive ? 'text-green border-b-2 border-green' : ''
                    }`
                  }
                  style={{ color: '#3C1518' }}
                >
                  {item.label}
                </NavLink>

                {/* Sous-menu */}
                {item.submenu && activeSubmenu === item.path && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-0 w-56 bg-white shadow-lg rounded-md py-2 z-50"
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="block px-4 py-2 hover:bg-beige-light hover:text-green transition-colors"
                        style={{ color: '#3C1518' }}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* Logo au centre */}
          <Link to="/" className="flex items-center mx-8">
            {logo ? (
              <img 
                src={getImageUrl(logo.image)} 
                alt={logo.alt || "Colyne Photographe"} 
                className="h-32 md:h-36 w-auto object-contain"
              />
            ) : (
              <h1 className="text-2xl md:text-3xl font-display font-bold text-brown-dark">
                Colyne <span className="text-green">Photographe</span>
              </h1>
            )}
          </Link>

          {/* Navigation Droite Desktop */}
          <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-start">
            {rightMenuItems.map((item) => (
              <div
                key={item.path}
                className="relative group"
                onMouseEnter={() => item.submenu && setActiveSubmenu(item.path)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `hover:text-green transition-colors duration-300 font-medium ${
                      isActive ? 'text-green border-b-2 border-green' : ''
                    }`
                  }
                  style={{ color: '#3C1518' }}
                >
                  {item.label}
                </NavLink>

                {/* Sous-menu */}
                {item.submenu && activeSubmenu === item.path && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-0 w-56 bg-white shadow-lg rounded-md py-2 z-50"
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="block px-4 py-2 hover:bg-beige-light hover:text-green transition-colors"
                        style={{ color: '#3C1518' }}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* Logo Mobile (à gauche) */}
          <Link to="/" className="lg:hidden flex items-center">
            {logo ? (
              <img 
                src={getImageUrl(logo.image)} 
                alt={logo.alt || "Colyne Photographe"} 
                className="h-28 w-auto object-contain"
              />
            ) : (
              <h1 className="text-xl font-display font-bold text-brown-dark">
                Colyne <span className="text-green">Photographe</span>
              </h1>
            )}
          </Link>

          {/* Bouton Menu Mobile (à droite) */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-gray-700 hover:text-green transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <nav className="container-custom py-4 space-y-4">
              {menuItems.map((item) => (
                <div key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => !item.submenu && toggleMenu()}
                    className={({ isActive }) =>
                      `block py-2 hover:text-green transition-colors font-medium ${
                        isActive ? 'text-green font-semibold' : ''
                      }`
                    }
                    style={{ color: '#3C1518' }}
                  >
                    {item.label}
                  </NavLink>

                  {/* Sous-menu mobile */}
                  {item.submenu && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={toggleMenu}
                          className="block py-1 text-sm hover:text-green transition-colors"
                          style={{ color: '#3C1518' }}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

