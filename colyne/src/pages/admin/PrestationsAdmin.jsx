import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Upload, X, Save, Image as ImageIcon } from 'lucide-react';
import { prestationsAPI, uploadAPI } from '../../utils/api';
import { useData } from '../../context/DataContext';

const PrestationsAdmin = () => {
  const { updatePrestation: updatePrestationContext, deletePrestation: deletePrestationContext, addPrestation: addPrestationContext } = useData();
  const [prestations, setPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPrestation, setCurrentPrestation] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Formulaire
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    shortDescription: '',
    description: '',
    basePrice: '',
    priceDetails: [],
    location: '',
    included: [],
    featured: false,
    mainImage: '',
    inspirationGallery: []
  });

  useEffect(() => {
    loadPrestations();
  }, []);

  const loadPrestations = async () => {
    setLoading(true);
    try {
      const res = await prestationsAPI.getAll();
      if (res.success) {
        setPrestations(res.data);
      }
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des prestations');
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

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadRes = await uploadAPI.uploadMultiple(files);
      if (uploadRes.success) {
        const newUrls = uploadRes.data.map(f => f.url);
        setFormData({ ...formData, inspirationGallery: [...formData.inspirationGallery, ...newUrls] });
      }
    } catch (err) {
      alert('Erreur lors de l\'upload des images');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    const newGallery = formData.inspirationGallery.filter((_, i) => i !== index);
    setFormData({ ...formData, inspirationGallery: newGallery });
  };

  // Fonction pour transformer l'ancienne structure de priceDetails en nouvelle
  const transformPriceDetails = (priceDetails) => {
    if (!priceDetails || priceDetails.length === 0) return [];
    
    return priceDetails.map(detail => {
      // Si c'est déjà la nouvelle structure (avec sessionType et price)
      if (detail.sessionType && detail.price !== undefined) {
        return {
          sessionType: detail.sessionType,
          price: detail.price,
          deliverables: detail.deliverables || '',
          description: detail.description || ''
        };
      }
      
      // Sinon, transformer l'ancienne structure (clés dynamiques) en nouvelle
      const transformed = [];
      Object.keys(detail).forEach(key => {
        // Ignorer les clés MongoDB et les propriétés de la nouvelle structure
        if (key !== '_id' && key !== 'deliverables' && key !== 'description' && typeof detail[key] === 'number') {
          transformed.push({
            sessionType: key,
            price: detail[key],
            deliverables: detail.deliverables || '',
            description: detail.description || ''
          });
        }
      });
      return transformed;
    }).flat();
  };

  const openModal = (prestation = null) => {
    if (prestation) {
      setCurrentPrestation(prestation);
      setFormData({
        slug: prestation.slug,
        title: prestation.title,
        shortDescription: prestation.shortDescription,
        description: prestation.description,
        basePrice: prestation.basePrice,
        priceDetails: transformPriceDetails(prestation.priceDetails),
        location: prestation.location,
        included: prestation.included || [],
        featured: prestation.featured,
        mainImage: prestation.mainImage || '',
        inspirationGallery: prestation.inspirationGallery || []
      });
    } else {
      setCurrentPrestation(null);
      setFormData({
        slug: '',
        title: '',
        shortDescription: '',
        description: '',
        basePrice: '',
        priceDetails: [],
        location: '',
        included: [],
        featured: false,
        mainImage: '',
        inspirationGallery: []
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPrestation(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      if (currentPrestation) {
        // Mettre à jour via le contexte pour synchroniser avec le frontend public
        const res = await updatePrestationContext(currentPrestation._id, formData);
        if (res.success) {
          await loadPrestations(); // Recharger aussi la liste locale
          closeModal();
          alert('✅ Prestation mise à jour avec succès !');
        } else {
          alert('❌ ' + (res.message || 'Erreur lors de la mise à jour'));
        }
      } else {
        // Créer via le contexte
        const res = await addPrestationContext(formData);
        if (res.success) {
          await loadPrestations(); // Recharger aussi la liste locale
          closeModal();
          alert('✅ Prestation créée avec succès !');
        } else {
          alert('❌ ' + (res.message || 'Erreur lors de la création'));
        }
      }
    } catch (err) {
      alert('❌ Erreur lors de l\'enregistrement : ' + (err.response?.data?.message || err.message || 'Erreur inconnue'));
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) return;

    try {
      // Supprimer via le contexte pour synchroniser avec le frontend public
      const res = await deletePrestationContext(id);
      if (res.success) {
        await loadPrestations(); // Recharger aussi la liste locale
      } else {
        alert(res.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  // Gestion des priceDetails (tableau d'objets)
  const addPriceDetail = () => {
    setFormData({
      ...formData,
      priceDetails: [...formData.priceDetails, { sessionType: '', price: 0, deliverables: '', description: '' }]
    });
  };

  const updatePriceDetail = (index, field, value) => {
    const newPriceDetails = [...formData.priceDetails];
    newPriceDetails[index][field] = field === 'price' ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, priceDetails: newPriceDetails });
  };

  const removePriceDetail = (index) => {
    const newPriceDetails = formData.priceDetails.filter((_, i) => i !== index);
    setFormData({ ...formData, priceDetails: newPriceDetails });
  };

  // Gestion des included (tableau de strings)
  const addIncluded = () => {
    setFormData({ ...formData, included: [...formData.included, ''] });
  };

  const updateIncluded = (index, value) => {
    const newIncluded = [...formData.included];
    newIncluded[index] = value;
    setFormData({ ...formData, included: newIncluded });
  };

  const removeIncluded = (index) => {
    const newIncluded = formData.included.filter((_, i) => i !== index);
    setFormData({ ...formData, included: newIncluded });
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
          <h1 className="text-3xl font-bold text-gray-900">Prestations</h1>
          <p className="mt-2 text-gray-600">Gérez vos offres de prestations</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Ajouter une prestation
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Grille de prestations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prestations.map((prestation) => (
          <motion.div
            key={prestation._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative aspect-video">
              {prestation.mainImage ? (
                <img
                  src={`http://localhost:5000${prestation.mainImage}`}
                  alt={prestation.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
              )}
              {prestation.featured && (
                <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  ⭐ Featured
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{prestation.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{prestation.shortDescription}</p>
              <p className="text-sm font-semibold text-rose-600 mb-3">{prestation.basePrice}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(prestation)}
                  className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition flex items-center justify-center gap-1"
                >
                  <Pencil size={16} />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(prestation._id)}
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

      {prestations.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Aucune prestation</p>
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
                  {currentPrestation ? 'Modifier la prestation' : 'Ajouter une prestation'}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description courte *</label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      required
                      maxLength={200}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description complète *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={4}
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prix de base *</label>
                      <input
                        type="text"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                        required
                        className="input-field"
                        placeholder="À partir de 150€"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lieu *</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                        className="input-field"
                        placeholder="En studio"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded text-rose-600"
                      />
                      <span className="text-sm font-medium text-gray-700">Prestation mise en avant</span>
                    </label>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900">Images</h3>
                  
                  {/* Image principale */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image principale <span className="text-xs text-gray-500">(pour les cards et fond de page détail)</span>
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

                  {/* Galerie d'inspiration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Galerie d'inspiration <span className="text-xs text-gray-500">(images multiples)</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {formData.inspirationGallery.map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={`http://localhost:5000${img}`}
                              alt={`Gallery ${index}`}
                              className="w-full h-24 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
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
                          onChange={handleGalleryUpload}
                          disabled={uploading}
                          className="hidden"
                          id="gallery-upload"
                        />
                        <label
                          htmlFor="gallery-upload"
                          className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                        >
                          {uploading ? 'Upload en cours...' : 'Ajouter des images'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Détails de prix (3 types de séances) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-900">Détails de prix (types de séances)</h3>
                    <button
                      type="button"
                      onClick={addPriceDetail}
                      className="btn-secondary text-sm"
                    >
                      + Ajouter un type
                    </button>
                  </div>
                  {formData.priceDetails.map((detail, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-700">Type de séance {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removePriceDetail(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Nom du type (ex: Solo, Couple)"
                          value={detail.sessionType}
                          onChange={(e) => updatePriceDetail(index, 'sessionType', e.target.value)}
                          className="input-field"
                        />
                        <input
                          type="number"
                          placeholder="Prix (€)"
                          value={detail.price}
                          onChange={(e) => updatePriceDetail(index, 'price', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Livrables (ex: 15 photos retouchées)"
                        value={detail.deliverables}
                        onChange={(e) => updatePriceDetail(index, 'deliverables', e.target.value)}
                        className="input-field"
                      />
                      <textarea
                        placeholder="Description supplémentaire"
                        value={detail.description}
                        onChange={(e) => updatePriceDetail(index, 'description', e.target.value)}
                        rows={2}
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>

                {/* Inclus dans la prestation */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-900">Inclus dans la prestation</h3>
                    <button
                      type="button"
                      onClick={addIncluded}
                      className="btn-secondary text-sm"
                    >
                      + Ajouter un élément
                    </button>
                  </div>
                  {formData.included.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ex: Séance photo de 1h30"
                        value={item}
                        onChange={(e) => updateIncluded(index, e.target.value)}
                        className="input-field flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeIncluded(index)}
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
                    {currentPrestation ? 'Mettre à jour' : 'Créer'}
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

export default PrestationsAdmin;
