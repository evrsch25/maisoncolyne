import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Upload, X, Save, Image as ImageIcon } from 'lucide-react';
import { blogAPI, uploadAPI } from '../../utils/api';

const getTodayISO = () => new Date().toISOString().split('T')[0];
const formatDateForInput = (value) => {
  if (!value) return getTodayISO();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return getTodayISO();
  }
  return parsed.toISOString().split('T')[0];
};

const BlogAdmin = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Formulaire
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    category: '',
    author: 'Colyne',
    excerpt: '',
    content: '',
    mainImage: '',
    additionalImages: [],
    tags: [],
    featured: false,
    published: true,
    date: getTodayISO()
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await blogAPI.getAll();
      if (res.success) {
        setArticles(res.data);
      }
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadRes = await uploadAPI.uploadSingle(file);
      if (uploadRes.success) {
        setFormData({ ...formData, mainImage: uploadRes.data.url });
      }
    } catch (err) {
      alert('Erreur lors de l\'upload de l\'image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadRes = await uploadAPI.uploadMultiple(files);
      if (uploadRes.success) {
        const newUrls = uploadRes.data.map(f => f.url);
        setFormData({ ...formData, additionalImages: [...formData.additionalImages, ...newUrls] });
      }
    } catch (err) {
      alert('Erreur lors de l\'upload des images');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeAdditionalImage = (index) => {
    const newImages = formData.additionalImages.filter((_, i) => i !== index);
    setFormData({ ...formData, additionalImages: newImages });
  };

  const openModal = (article = null) => {
    if (article) {
      setCurrentArticle(article);
      setFormData({
        slug: article.slug,
        title: article.title,
        category: article.category,
        author: article.author || 'Colyne',
        excerpt: article.excerpt,
        content: article.content,
        mainImage: article.mainImage || '',
        additionalImages: article.additionalImages || [],
        tags: article.tags || [],
        featured: article.featured,
        published: article.published !== undefined ? article.published : true,
        date: formatDateForInput(article.createdAt || article.date)
      });
    } else {
      setCurrentArticle(null);
      setFormData({
        slug: '',
        title: '',
        category: '',
        author: 'Colyne',
        excerpt: '',
        content: '',
        mainImage: '',
        additionalImages: [],
        tags: [],
        featured: false,
        published: true,
        date: getTodayISO()
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentArticle(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const { date, ...rest } = formData;
      const payload = { ...rest };

      if (date) {
        payload.createdAt = new Date(date).toISOString();
      }
      payload.updatedAt = new Date().toISOString();

      if (currentArticle) {
        const res = await blogAPI.update(currentArticle._id, payload);
        if (res.success) {
          await loadArticles();
          closeModal();
        }
      } else {
        const res = await blogAPI.create(payload);
        if (res.success) {
          await loadArticles();
          closeModal();
        }
      }
    } catch (err) {
      alert('Erreur lors de l\'enregistrement');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const res = await blogAPI.delete(id);
      if (res.success) {
        await loadArticles();
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  // Gestion des tags
  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const updateTag = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
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
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="mt-2 text-gray-600">Gérez vos articles de blog</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Ajouter un article
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Grille d'articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <motion.div
            key={article._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative aspect-video">
              {article.mainImage ? (
                <img
                  src={`http://localhost:5000${article.mainImage}`}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-2">
                {article.featured && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">⭐</span>
                )}
                {!article.published && (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">Brouillon</span>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-1">{article.category}</div>
              <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">{article.title}</h3>
              <p className="text-xs text-gray-400 mb-2">
                {new Date(article.createdAt || article.date || Date.now()).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(article)}
                  className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition flex items-center justify-center gap-1"
                >
                  <Pencil size={16} />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(article._id)}
                  className="flex-1 py-2 px-3 bg-red-50 text-red-600 rounded hover:bg-red-100 transition flex items-center justify-center gap-1"
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Aucun article</p>
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
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentArticle ? 'Modifier l\'article' : 'Ajouter un article'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900">Informations de base</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        className="input-field"
                        placeholder="Ex: Maternité, Conseils"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date de publication *</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Auteur</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Extrait *</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      required
                      maxLength={300}
                      rows={3}
                      className="input-field"
                      placeholder="Résumé de l'article (max 300 caractères)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contenu *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                      rows={8}
                      className="input-field"
                      placeholder="Contenu complet de l'article..."
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded text-rose-600"
                      />
                      <span className="text-sm font-medium text-gray-700">Article mis en avant</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="rounded text-rose-600"
                      />
                      <span className="text-sm font-medium text-gray-700">Publié</span>
                    </label>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900">Images</h3>
                  
                  {/* Image principale */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image principale
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {formData.mainImage ? (
                        <div className="relative">
                          <img
                            src={`http://localhost:5000${formData.mainImage}`}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, mainImage: '' })}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                          <p className="text-sm text-gray-600 mb-2">
                            {uploading ? 'Upload en cours...' : 'Cliquez pour uploader l\'image principale'}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageUpload}
                            disabled={uploading}
                            className="hidden"
                            id="main-image-upload"
                          />
                          <label
                            htmlFor="main-image-upload"
                            className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                          >
                            Choisir une image
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Images supplémentaires */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images supplémentaires
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {formData.additionalImages.map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={`http://localhost:5000${img}`}
                              alt={`Additional ${index}`}
                              className="w-full h-24 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleAdditionalImagesUpload}
                          disabled={uploading}
                          className="hidden"
                          id="additional-images-upload"
                        />
                        <label
                          htmlFor="additional-images-upload"
                          className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                        >
                          {uploading ? 'Upload en cours...' : 'Ajouter des images'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-900">Tags</h3>
                    <button
                      type="button"
                      onClick={addTag}
                      className="btn-secondary text-sm"
                    >
                      + Ajouter un tag
                    </button>
                  </div>
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ex: maternité, conseils"
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        className="input-field flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Boutons */}
                <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
                  <button type="button" onClick={closeModal} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Save size={18} />
                    {currentArticle ? 'Mettre à jour' : 'Créer'}
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

export default BlogAdmin;
