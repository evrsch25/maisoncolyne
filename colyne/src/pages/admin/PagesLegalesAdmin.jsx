import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { pagesLegalesAPI } from '../../utils/api';

const PAGES = [
  { slug: 'mentions-legales', label: 'Mentions Légales' },
  { slug: 'cgv', label: 'CGV' },
  { slug: 'politique-confidentialite', label: 'Politique de Confidentialité' },
];

const PagesLegalesAdmin = () => {
  const [activeTab, setActiveTab] = useState('mentions-legales');
  const [pages, setPages] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          PAGES.map((p) => pagesLegalesAPI.get(p.slug))
        );
        const map = {};
        PAGES.forEach((p, i) => {
          map[p.slug] = {
            title: results[i].data.title || p.label,
            sections: results[i].data.sections || [],
          };
        });
        setPages(map);
      } catch {
        setError('Impossible de charger les pages légales.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const current = pages[activeTab] || { title: '', sections: [] };

  const updateTitle = (value) => {
    setPages((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], title: value },
    }));
  };

  const updateSection = (index, field, value) => {
    setPages((prev) => {
      const sections = [...prev[activeTab].sections];
      sections[index] = { ...sections[index], [field]: value };
      return { ...prev, [activeTab]: { ...prev[activeTab], sections } };
    });
  };

  const addSection = () => {
    setPages((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        sections: [...prev[activeTab].sections, { heading: '', content: '' }],
      },
    }));
  };

  const removeSection = (index) => {
    setPages((prev) => {
      const sections = prev[activeTab].sections.filter((_, i) => i !== index);
      return { ...prev, [activeTab]: { ...prev[activeTab], sections } };
    });
  };

  const moveSection = (index, direction) => {
    setPages((prev) => {
      const sections = [...prev[activeTab].sections];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= sections.length) return prev;
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      return { ...prev, [activeTab]: { ...prev[activeTab], sections } };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await pagesLegalesAPI.update(activeTab, {
        title: current.title,
        sections: current.sections,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setError('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">
            Pages Légales
          </h1>
          <p className="text-gray-500 text-sm">
            Modifiez le contenu des pages Mentions légales, CGV et Politique de confidentialité.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm"
            >
              ✓ Modifications enregistrées
            </motion.div>
          )}
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <Save size={18} />
            )}
            <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-gray-200 gap-1">
        {PAGES.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActiveTab(p.slug)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === p.slug
                ? 'bg-white border border-b-white border-gray-200 text-brown -mb-px'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText size={15} />
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brown" />
        </div>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          {/* Titre de la page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la page
            </label>
            <input
              type="text"
              value={current.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Sections</h2>
              <button
                type="button"
                onClick={addSection}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Ajouter une section
              </button>
            </div>

            {current.sections.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                Aucune section. Cliquez sur "Ajouter une section" pour commencer.
              </p>
            )}

            {current.sections.map((section, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Section {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveSection(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      title="Monter"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(index, 1)}
                      disabled={index === current.sections.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      title="Descendre"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de la section
                  </label>
                  <input
                    type="text"
                    value={section.heading}
                    onChange={(e) => updateSection(index, 'heading', e.target.value)}
                    className="input-field"
                    placeholder="Ex: Article 1 - Objet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contenu
                  </label>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(index, 'content', e.target.value)}
                    rows={5}
                    className="textarea-field"
                    placeholder="Rédigez le contenu de cette section..."
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Les retours à la ligne sont préservés à l'affichage.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PagesLegalesAdmin;
