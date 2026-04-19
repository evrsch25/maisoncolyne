import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, Clock, ChevronDown } from 'lucide-react';
import { actualitesAPI } from '../utils/api';

const CATEGORY_STYLES = {
  'info':       { bg: 'bg-blue-50',   border: 'border-blue-200',  badge: 'bg-blue-100 text-blue-700',   label: 'Info' },
  'nouveauté':  { bg: 'bg-green-50',  border: 'border-green-200', badge: 'bg-green-100 text-green-700',  label: 'Nouveauté' },
  'promotion':  { bg: 'bg-rose-50',   border: 'border-rose-200',  badge: 'bg-rose-100 text-rose-700',    label: 'Promotion' },
  'événement':  { bg: 'bg-amber-50',  border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700',  label: 'Événement' },
};

const ALL_CATEGORIES = [
  { value: '', label: 'Toutes les catégories' },
  { value: 'info', label: 'Info' },
  { value: 'nouveauté', label: 'Nouveauté' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'événement', label: 'Événement' },
];

const formatDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

const STORAGE_KEY = 'news_last_seen';

const NewsPopup = () => {
  const [open, setOpen] = useState(false);
  const [actualites, setActualites] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('');
  const [hasNew, setHasNew] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    loadActualites();
  }, []);

  useEffect(() => {
    setFiltered(
      category ? actualites.filter((a) => a.category === category) : actualites
    );
  }, [category, actualites]);

  // Fermer en cliquant en dehors
  useEffect(() => {
    const handleClick = (e) => {
      if (open && popupRef.current && !popupRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const loadActualites = async () => {
    try {
      const res = await actualitesAPI.getPublic();
      if (res.success && res.data.length > 0) {
        setActualites(res.data);
        // Vérifier s'il y a des nouveautés depuis la dernière visite
        const lastSeen = localStorage.getItem(STORAGE_KEY);
        const hasUnread = res.data.some(
          (a) => !lastSeen || new Date(a.createdAt) > new Date(lastSeen)
        );
        setHasNew(hasUnread);
        // Auto-ouvrir une seule fois par session si nouvelles
        if (hasUnread && !sessionStorage.getItem('news_auto_opened')) {
          setTimeout(() => setOpen(true), 3000);
          sessionStorage.setItem('news_auto_opened', '1');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setHasNew(false);
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  };

  const handleClose = () => setOpen(false);

  // Ne rien afficher s'il n'y a aucune actualité
  if (actualites.length === 0) return null;

  return (
    <div ref={popupRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
              style={{ background: 'linear-gradient(135deg, #3C1518, #6B3A2A)' }}
            >
              <div className="flex items-center gap-2 text-white">
                <Megaphone size={18} />
                <h3 className="font-semibold text-sm">Actualités Maison Colyne</h3>
              </div>
              <button onClick={handleClose} className="text-white/70 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            {/* Filtre catégorie */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm py-1.5 pl-3 pr-8 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-brown/30"
                >
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Liste */}
            <div className="overflow-y-auto max-h-80">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">Aucune actualité dans cette catégorie</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {filtered.map((item) => {
                    const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES['info'];
                    return (
                      <li key={item._id} className={`px-4 py-4 ${style.bg}`}>
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
                                {style.label}
                              </span>
                            </div>
                            <p className="font-semibold text-sm text-gray-900 leading-snug">{item.title}</p>
                            <p className="text-xs text-gray-600 mt-1 whitespace-pre-line leading-relaxed">{item.content}</p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                              <Clock size={11} />
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulle flottante */}
      <motion.button
        onClick={open ? handleClose : handleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
        style={{ background: 'linear-gradient(135deg, #3C1518, #6B3A2A)' }}
        aria-label="Voir les actualités"
      >
        <Megaphone size={22} />
        {/* Badge "nouveau" */}
        {hasNew && !open && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white"
          >
            <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75" />
          </motion.span>
        )}
      </motion.button>
    </div>
  );
};

export default NewsPopup;
