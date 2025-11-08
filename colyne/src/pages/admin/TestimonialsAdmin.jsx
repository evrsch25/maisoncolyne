import { useState, useEffect } from 'react';
import { testimonialsAPI } from '../../utils/api';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    text: '',
    service: '',
    featured: false,
    order: 0,
    active: true
  });

  // Charger les témoignages
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialsAPI.getAll();
      if (response.success) {
        setTestimonials(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
      alert('Erreur lors du chargement des témoignages');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.author.trim() || !formData.text.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      if (editingId) {
        // Mise à jour
        const response = await testimonialsAPI.update(editingId, formData);
        if (response.success) {
          await loadTestimonials();
          resetForm();
          alert('Témoignage mis à jour avec succès !');
        }
      } else {
        // Création
        const response = await testimonialsAPI.create(formData);
        if (response.success) {
          await loadTestimonials();
          resetForm();
          alert('Témoignage créé avec succès !');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du témoignage');
    }
  };

  const handleEdit = (testimonial) => {
    setFormData({
      author: testimonial.author,
      text: testimonial.text,
      service: testimonial.service || '',
      featured: testimonial.featured,
      order: testimonial.order,
      active: testimonial.active
    });
    setEditingId(testimonial._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      return;
    }

    try {
      const response = await testimonialsAPI.delete(id);
      if (response.success) {
        await loadTestimonials();
        alert('Témoignage supprimé avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du témoignage');
    }
  };

  const resetForm = () => {
    setFormData({
      author: '',
      text: '',
      service: '',
      featured: false,
      order: 0,
      active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des témoignages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold text-brown-dark">
            Gestion des Témoignages
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            {showForm ? 'Annuler' : 'Nouveau témoignage'}
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-display font-bold text-brown-dark mb-6">
              {editingId ? 'Modifier le témoignage' : 'Nouveau témoignage'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Auteur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du client <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                    required
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de séance
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                  >
                    <option value="">-- Sélectionner une séance --</option>
                    <option value="Séance nouveau-né">Séance nouveau-né</option>
                    <option value="Séance bébé">Séance bébé</option>
                    <option value="Séance grossesse">Séance grossesse</option>
                    <option value="Séance famille">Séance famille</option>
                    <option value="Séance iris">Séance iris</option>
                  </select>
                </div>

                {/* Ordre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                  />
                </div>
              </div>

              {/* Témoignage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Témoignage <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                  required
                ></textarea>
              </div>

              {/* Options */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-brown focus:ring-brown border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Témoignage mis en avant
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-brown focus:ring-brown border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Actif
                  </span>
                </label>
              </div>

              {/* Boutons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={20} />
                  {editingId ? 'Mettre à jour' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-outline"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des témoignages */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-display font-bold text-brown-dark mb-6">
            Témoignages existants ({testimonials.length})
          </h2>
          
          {testimonials.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucun témoignage pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-brown-dark">
                        {testimonial.author}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Témoignage */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {testimonial.text}
                  </p>

                  {/* Métadonnées */}
                  <div className="text-xs text-gray-500 space-y-1">
                    {testimonial.service && (
                      <div>Séance: {testimonial.service}</div>
                    )}
                    <div className="flex gap-2 mt-2">
                      {testimonial.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          Mis en avant
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded ${
                        testimonial.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {testimonial.active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsAdmin;

