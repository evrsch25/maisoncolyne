import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Upload, X, Save, Image as ImageIcon, Tag } from 'lucide-react';
import { portfolioAPI, uploadAPI, getImageUrl, getThumbnailUrl } from '../../utils/api';

const PortfolioAdmin = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Formulaire
  const [formData, setFormData] = useState({
    image: '',
    category: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = selectedCategory ? { category: selectedCategory } : {};
      const [itemsRes, catsRes] = await Promise.all([
        portfolioAPI.getAll(params),
        portfolioAPI.getCategories()
      ]);

      if (itemsRes.success) {
        setPortfolioItems(itemsRes.data);
      }
      if (catsRes.success) {
        setCategories(catsRes.data);
      }
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadRes = await uploadAPI.uploadSingle(file);
      if (uploadRes.success) {
        setFormData({ ...formData, image: uploadRes.data.url });
      }
    } catch (err) {
      alert('Erreur lors de l\'upload de l\'image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setFormData({
        image: item.image,
        category: item.category,
        title: item.title || '',
        description: item.description || ''
      });
    } else {
      setCurrentItem(null);
      setFormData({
        image: '',
        category: '',
        title: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentItem(null);
    setFormData({
      image: '',
      category: '',
      title: '',
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image || !formData.category) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const payload = {
        image: formData.image,
        category: formData.category,
        title: formData.title,
        description: formData.description
      };

      if (currentItem) {
        // Modification
        const res = await portfolioAPI.update(currentItem._id, payload);
        if (res.success) {
          await loadData();
          closeModal();
        }
      } else {
        // Création
        const res = await portfolioAPI.create(payload);
        if (res.success) {
          await loadData();
          closeModal();
        }
      }
    } catch (err) {
      alert('Erreur lors de l\'enregistrement');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    try {
      const res = await portfolioAPI.delete(id);
      if (res.success) {
        await loadData();
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      'nouveau-ne': 'Nouveau-né',
      'bebe': 'Bébé',
      'grossesse': 'Grossesse',
      'famille': 'Famille',
      'iris': 'Iris'
    };
    return labels[cat] || cat;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="mt-2 text-gray-600">Gérez les images de votre portfolio</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Ajouter une image
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filtres par catégorie */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedCategory === ''
              ? 'bg-rose-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Toutes
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Grille d'images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {portfolioItems.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden group"
          >
            <div className="relative aspect-square">
              <img
                src={getThumbnailUrl(item.image)}
                alt={item.title || 'Portfolio'}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => openModal(item)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                >
                  <Pencil size={18} className="text-gray-700" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <Tag size={14} className="text-gray-400" />
                <span className="text-gray-600">{getCategoryLabel(item.category)}</span>
              </div>
              {item.title && (
                <p className="mt-1 text-sm font-medium text-gray-800 truncate">{item.title}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {portfolioItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Aucune image dans le portfolio</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentItem ? 'Modifier l\'image' : 'Ajouter une image'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Upload d'image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {formData.image ? (
                      <div className="relative">
                        <img
                          src={getImageUrl(formData.image)}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-600 mb-2">
                          {uploading ? 'Upload en cours...' : 'Cliquez pour uploader une image'}
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                        >
                          Choisir une image
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="input-field"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {getCategoryLabel(cat)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Ex: Séance famille en extérieur"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="input-field"
                    placeholder="Description de l'image..."
                  />
                </div>

                {/* Boutons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={closeModal} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Save size={18} />
                    {currentItem ? 'Mettre à jour' : 'Créer'}
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

export default PortfolioAdmin;

