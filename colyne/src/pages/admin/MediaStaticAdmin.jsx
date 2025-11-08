import { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, Save } from 'lucide-react';
import { mediaStaticAPI, uploadAPI, getImageUrl, getThumbnailUrl } from '../../utils/api';

const MediaStaticAdmin = () => {
  const [activeTab, setActiveTab] = useState('accueil');
  const [mediaByPage, setMediaByPage] = useState({
    accueil: [],
    prestations: [],
    'a-propos': []
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Configuration des emplacements par page
  const pageConfig = {
    accueil: [
      { location: 'logo', label: 'Logo du site (header)', multiple: false },
      { location: 'carousel', label: 'Carousel', multiple: true, min: 3, max: 10 },
      { location: 'bienvenue', label: 'Photo Bienvenue', multiple: false },
      { location: 'pourquoi-choisir', label: 'Photo "Pourquoi me choisir"', multiple: false }
    ],
    prestations: [
      { location: 'carousel', label: 'Carousel Prestations', multiple: true, min: 1, max: 20 }
    ],
    'a-propos': [
      { location: 'photo-hero', label: 'À propos de moi (bannière)', multiple: false },
      { location: 'photo-portrait', label: 'Mon portrait', multiple: false },
      { location: 'photo-parcours', label: 'Mon parcours', multiple: false },
      { location: 'photo-pourquoi', label: 'Pourquoi la photographie ?', multiple: false }
    ]
  };

  useEffect(() => {
    loadAllMedia();
  }, []);

  const loadAllMedia = async () => {
    setLoading(true);
    try {
      const response = await mediaStaticAPI.getAll();
      if (response.success) {
        // Organiser les médias par page
        const organized = {
          accueil: response.data.filter(m => m.page === 'accueil'),
          prestations: response.data.filter(m => m.page === 'prestations'),
          'a-propos': response.data.filter(m => m.page === 'a-propos')
        };
        setMediaByPage(organized);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error);
      alert('Erreur lors du chargement des médias');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (page, location, files, isMultiple) => {
    setUploading(true);
    try {
      let uploadedPaths = [];

      if (isMultiple) {
        // Upload multiple - envoyer les fichiers directement
        const uploadRes = await uploadAPI.uploadMultiple(Array.from(files));
        if (uploadRes.success) {
          uploadedPaths = uploadRes.data.map(f => f.url);
        }
      } else {
        // Upload single - envoyer le fichier directement
        const uploadRes = await uploadAPI.uploadSingle(files[0]);
        if (uploadRes.success) {
          uploadedPaths = [uploadRes.data.url];
        }
      }

      // Créer les entrées MediaStatic pour chaque image
      for (let i = 0; i < uploadedPaths.length; i++) {
        const mediaData = {
          page,
          location,
          image: uploadedPaths[i],
          alt: '',
          title: '',
          order: isMultiple ? i : 0,
          active: true
        };
        console.log('Envoi des données:', mediaData);
        await mediaStaticAPI.create(mediaData);
      }

      await loadAllMedia();
      alert(`${uploadedPaths.length} image(s) ajoutée(s) avec succès`);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Erreur lors de l\'upload des images';
      const errorDetails = error.response?.data?.errors?.map(e => `${e.field}: ${e.message}`).join('\n') || '';
      alert(`${errorMsg}\n${errorDetails}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    
    try {
      const response = await mediaStaticAPI.delete(id);
      if (response.success) {
        await loadAllMedia();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleUpdateAlt = async (id, alt) => {
    try {
      await mediaStaticAPI.update(id, { alt });
      await loadAllMedia();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const renderLocationSection = (page, locationConfig) => {
    const { location, label, multiple, min, max } = locationConfig;
    const mediaForLocation = mediaByPage[page].filter(m => m.location === location).sort((a, b) => a.order - b.order);

    return (
      <div key={location} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-brown-dark">{label}</h3>
            {multiple && (
              <p className="text-sm text-gray-500 mt-1">
                {min && max ? `Entre ${min} et ${max} images` : 'Plusieurs images autorisées'}
                {mediaForLocation.length > 0 && ` (${mediaForLocation.length} actuellement)`}
              </p>
            )}
          </div>
          <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-brown text-white rounded-lg hover:bg-brown-dark transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Upload size={20} />
            {multiple ? 'Ajouter des images' : mediaForLocation.length > 0 ? 'Remplacer' : 'Ajouter'}
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileUpload(page, location, e.target.files, multiple);
                }
              }}
            />
          </label>
        </div>

        {mediaForLocation.length > 0 ? (
          <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {mediaForLocation.map((media) => (
              <div key={media._id} className="relative group">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={getThumbnailUrl(media.image)}
                    alt={media.alt || 'Image'}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={media.alt}
                    onChange={(e) => handleUpdateAlt(media._id, e.target.value)}
                    placeholder="Texte alternatif (alt)"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-brown"
                  />
                  <button
                    onClick={() => handleDelete(media._id)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
                {multiple && (
                  <span className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                    #{media.order + 1}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Aucune image pour cet emplacement</p>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'prestations', label: 'Prestations' },
    { id: 'a-propos', label: 'À propos' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brown-dark mb-2">
          Médias Statiques
        </h1>
        <p className="text-gray-600">
          Gérez les images des différentes pages du site
        </p>
      </div>

      {/* Onglets */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === tab.id
                ? 'text-brown border-b-2 border-brown'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {mediaByPage[tab.id]?.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-brown text-white rounded-full">
                {mediaByPage[tab.id].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenu de l'onglet actif */}
      <div>
        {pageConfig[activeTab].map(locationConfig => 
          renderLocationSection(activeTab, locationConfig)
        )}
      </div>

      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown mx-auto mb-4"></div>
            <p className="text-gray-700">Upload en cours...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaStaticAdmin;
