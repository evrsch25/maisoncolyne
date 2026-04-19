import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Megaphone, Clock, Tag } from 'lucide-react';
import { actualitesAPI } from '../../utils/api';

const CATEGORIES = ['info', 'nouveauté', 'promotion', 'événement'];

const CATEGORY_STYLES = {
  'info':       { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Info' },
  'nouveauté':  { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Nouveauté' },
  'promotion':  { bg: 'bg-rose-100',   text: 'text-rose-700',   label: 'Promotion' },
  'événement':  { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Événement' },
};

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

const isExpired = (createdAt) => Date.now() - new Date(createdAt).getTime() > TWO_WEEKS_MS;

const formatDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const defaultForm = { title: '', content: '', category: 'info', active: true };

const ActualitesAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await actualitesAPI.getAll();
      if (res.success) setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    setCurrent(item);
    setFormData(item
      ? { title: item.title, content: item.content, category: item.category, active: item.active }
      : defaultForm
    );
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setCurrent(null); setFormData(defaultForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (current) {
        await actualitesAPI.update(current._id, formData);
      } else {
        await actualitesAPI.create(formData);
      }
      await loadData();
      closeModal();
    } catch (err) {
      alert('Erreur lors de l\'enregistrement');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette actualité ?')) return;
    try {
      await actualitesAPI.delete(id);
      await loadData();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Actualités</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Chaque actualité est visible pendant <strong>2 semaines</strong> après sa création.
          </p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nouvelle actualité
        </button>
      </div>

      {/* Liste */}
      {items.length === 0 ? (
        <div className="text-center py-16">
          <Megaphone size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Aucune actualité pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const expired = isExpired(item.createdAt);
            const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES['info'];
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-sm border p-5 flex gap-4 items-start ${
                  expired || !item.active ? 'opacity-50' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                    {expired && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        Expirée
                      </span>
                    )}
                    {!item.active && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        Inactive
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2 whitespace-pre-line">{item.content}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>Créée le {formatDate(item.createdAt)}</span>
                    {!expired && (
                      <span className="ml-2 text-green-600 font-medium">
                        · Visible jusqu'au {formatDate(new Date(new Date(item.createdAt).getTime() + TWO_WEEKS_MS))}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openModal(item)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    <Pencil size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {current ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="input-field"
                    placeholder="Ex : Nouvelle formule maternité disponible !"
                  />
                </div>

                {/* Contenu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={4}
                    className="input-field"
                    placeholder="Décrivez l'actualité..."
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Tag size={14} className="inline mr-1" />
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_STYLES[c]?.label || c}</option>
                    ))}
                  </select>
                </div>

                {/* Actif */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Actualité active</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, active: !formData.active })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.active ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      formData.active ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t">
                  <button type="button" onClick={closeModal} className="btn-secondary">Annuler</button>
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Save size={16} />
                    {current ? 'Mettre à jour' : 'Publier'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActualitesAdmin;
