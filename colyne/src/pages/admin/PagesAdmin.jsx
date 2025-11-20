import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import { Save, FileText, Plus, Trash2 } from 'lucide-react';

const PagesAdmin = () => {
  const { config, updateConfig } = useData();

  const initialConfig = {
    ...config,
    contact: {
      messenger: '',
      ...config.contact,
    },
    hero: {
      slides: Array.isArray(config?.hero?.slides) ? config.hero.slides : [
        { title: 'Capturer l\'essence de vos moments précieux', subtitle: 'Photographe professionnelle à Oye-plage', order: 0 },
        { title: 'Des souvenirs qui traversent le temps', subtitle: 'Maternité, famille, mariage', order: 1 },
        { title: 'L\'art de sublimer vos émotions', subtitle: 'Avec sensibilité et authenticité', order: 2 }
      ],
      ...config.hero,
    },
    faq: Array.isArray(config.faq) ? config.faq : [],
  };

  const [formData, setFormData] = useState(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const handleSocialChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [field]: value,
      },
    }));
  };

  const handleFaqChange = (index, field, value) => {
    setFormData(prev => {
      const faqs = [...(prev.faq || [])];
      faqs[index] = {
        ...faqs[index],
        [field]: value,
      };
      return {
        ...prev,
        faq: faqs,
      };
    });
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faq: [...(prev.faq || []), { question: '', answer: '' }],
    }));
  };

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faq: (prev.faq || []).filter((_, i) => i !== index),
    }));
  };

  const handleSlideChange = (index, field, value) => {
    setFormData(prev => {
      const slides = [...(prev.hero?.slides || [])];
      slides[index] = {
        ...slides[index],
        [field]: value,
      };
      return {
        ...prev,
        hero: {
          ...prev.hero,
          slides,
        },
      };
    });
  };

  const addSlide = () => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        slides: [...(prev.hero?.slides || []), { title: '', subtitle: '', order: (prev.hero?.slides?.length || 0) }],
      },
    }));
  };

  const removeSlide = (index) => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        slides: (prev.hero?.slides || []).filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simuler l'enregistrement
    setTimeout(() => {
      updateConfig(formData);
      setIsSaving(false);
      setSaveSuccess(true);

      // Masquer le message de succès après 3 secondes
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Gestion des Pages
          </h1>
          <p className="text-gray-600">
            Modifiez le contenu de vos pages
          </p>
        </div>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg"
          >
            ✓ Modifications enregistrées
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations du site */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <FileText size={24} className="text-brown" />
            <h2 className="text-xl font-display font-semibold text-gray-900">
              Informations du Site
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du site
              </label>
              <input
                type="text"
                value={formData.site.name}
                onChange={(e) => handleChange('site', 'name', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slogan
              </label>
              <input
                type="text"
                value={formData.site.tagline}
                onChange={(e) => handleChange('site', 'tagline', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.site.description}
                onChange={(e) => handleChange('site', 'description', e.target.value)}
                rows={3}
                className="textarea-field"
              />
            </div>
          </div>
        </motion.div>

        {/* Carousel Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              Textes du Carousel (Page d'Accueil)
            </h2>
            <button
              type="button"
              onClick={addSlide}
              className="btn-secondary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Ajouter un slide</span>
            </button>
          </div>

          <div className="space-y-4">
            {(formData.hero?.slides || []).map((slide, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Slide {index + 1}</h3>
                  {(formData.hero?.slides?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSlide(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre principal
                    </label>
                    <input
                      type="text"
                      value={slide.title || ''}
                      onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                      className="input-field"
                      placeholder="Ex: Capturer l'essence de vos moments précieux"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      value={slide.subtitle || ''}
                      onChange={(e) => handleSlideChange(index, 'subtitle', e.target.value)}
                      className="input-field"
                      placeholder="Ex: Photographe professionnelle à Oye-plage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      value={slide.order || 0}
                      onChange={(e) => handleSlideChange(index, 'order', parseInt(e.target.value) || 0)}
                      className="input-field w-24"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Note : Les images du carousel se gèrent dans la section "Médias Statiques" avec la page "accueil" et la localisation "carousel".
          </p>
        </motion.div>

        {/* Page À propos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
            Page À propos
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description courte
              </label>
              <textarea
                value={formData.about.shortDescription}
                onChange={(e) => handleChange('about', 'shortDescription', e.target.value)}
                rows={2}
                className="textarea-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description complète
              </label>
              <textarea
                value={formData.about.fullDescription}
                onChange={(e) => handleChange('about', 'fullDescription', e.target.value)}
                rows={4}
                className="textarea-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Philosophie / Approche
              </label>
              <textarea
                value={formData.about.philosophy}
                onChange={(e) => handleChange('about', 'philosophy', e.target.value)}
                rows={3}
                className="textarea-field"
              />
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
            Informations de Contact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.contact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <input
                type="text"
                value={formData.contact.address}
                onChange={(e) => handleContactChange('address', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Messenger
              </label>
              <input
                type="url"
                value={formData.contact.messenger}
                onChange={(e) => handleContactChange('messenger', e.target.value)}
                className="input-field"
                placeholder="https://m.me/votrepage"
              />
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              Questions fréquentes (FAQ)
            </h2>
            <button
              type="button"
              onClick={addFaq}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Ajouter une question
            </button>
          </div>

          <div className="space-y-4">
            {(formData.faq || []).length === 0 && (
              <p className="text-sm text-gray-500">
                Aucune question enregistrée pour le moment. Ajoutez vos premières entrées ci-dessus.
              </p>
            )}

            {(formData.faq || []).map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                        className="input-field"
                        placeholder="Ex: Combien de temps à l'avance dois-je réserver ?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Réponse
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                        className="textarea-field"
                        rows={3}
                        placeholder="Décrivez votre réponse ici"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    aria-label="Supprimer la question"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Réseaux sociaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
            Réseaux Sociaux
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={formData.social.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                className="input-field"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={formData.social.facebook}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                className="input-field"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pinterest
              </label>
              <input
                type="url"
                value={formData.social.pinterest}
                onChange={(e) => handleSocialChange('pinterest', e.target.value)}
                className="input-field"
                placeholder="https://pinterest.com/..."
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Enregistrer les modifications</span>
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default PagesAdmin;

