import axios from 'axios';

// Configuration de base axios
const API_BASE_URL = 'http://localhost:5000';
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper pour générer l'URL complète d'une image
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Sinon, ajouter le baseURL
  return `${API_BASE_URL}${imagePath}`;
};

// Helper pour générer l'URL de la miniature (pour l'admin)
export const getThumbnailUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Si c'est déjà une URL complète
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // Essayer de générer le chemin de la miniature
    const url = new URL(imagePath);
    const pathParts = url.pathname.split('.');
    if (pathParts.length > 1) {
      const ext = pathParts.pop();
      const basePath = pathParts.join('.');
      return url.origin + basePath + '_thumb.' + ext;
    }
    return imagePath; // Fallback à l'original
  }
  
  // Générer le chemin de la miniature pour les chemins relatifs
  const pathParts = imagePath.split('.');
  if (pathParts.length > 1) {
    const ext = pathParts.pop();
    const basePath = pathParts.join('.');
    return `${API_BASE_URL}${basePath}_thumb.${ext}`;
  }
  
  // Fallback à l'image originale
  return getImageUrl(imagePath);
};

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================

export const authAPI = {
  // Connexion
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Inscription (si nécessaire)
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Obtenir l'utilisateur connecté
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// ==================== PRESTATIONS ====================

export const prestationsAPI = {
  // Obtenir toutes les prestations
  getAll: async () => {
    const response = await api.get('/prestations');
    return response.data;
  },

  // Obtenir une prestation par ID
  getById: async (id) => {
    const response = await api.get(`/prestations/${id}`);
    return response.data;
  },

  // Créer une prestation (admin)
  create: async (prestationData) => {
    const response = await api.post('/prestations', prestationData);
    return response.data;
  },

  // Mettre à jour une prestation (admin)
  update: async (id, prestationData) => {
    const response = await api.put(`/prestations/${id}`, prestationData);
    return response.data;
  },

  // Supprimer une prestation (admin)
  delete: async (id) => {
    const response = await api.delete(`/prestations/${id}`);
    return response.data;
  }
};

// ==================== BLOG ====================

export const blogAPI = {
  // Obtenir tous les articles
  getAll: async () => {
    const response = await api.get('/blog');
    return response.data;
  },

  // Obtenir un article par ID
  getById: async (id) => {
    const response = await api.get(`/blog/id/${id}`);
    return response.data;
  },

  // Créer un article (admin)
  create: async (articleData) => {
    const response = await api.post('/blog', articleData);
    return response.data;
  },

  // Mettre à jour un article (admin)
  update: async (id, articleData) => {
    const response = await api.put(`/blog/id/${id}`, articleData);
    return response.data;
  },

  // Supprimer un article (admin)
  delete: async (id) => {
    const response = await api.delete(`/blog/id/${id}`);
    return response.data;
  }
};

// ==================== CONFIG ====================

export const configAPI = {
  // Obtenir la configuration
  get: async () => {
    const response = await api.get('/config');
    return response.data;
  },

  // Mettre à jour la configuration (admin)
  update: async (configData) => {
    const response = await api.put('/config', configData);
    return response.data;
  }
};

// ==================== CONTACT ====================

export const contactAPI = {
  // Envoyer un message de contact
  send: async (messageData) => {
    const response = await api.post('/contact', messageData);
    return response.data;
  },

  // Récupérer les messages (admin)
  getAll: async (params = {}) => {
    const response = await api.get('/contact', { params });
    return response.data;
  },

  // Récupérer un message par ID (admin)
  getById: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  // Mettre à jour le statut d'un message (admin)
  updateStatus: async (id, status) => {
    const response = await api.put(`/contact/${id}/status`, status);
    return response.data;
  },

  // Supprimer un message (admin)
  delete: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  }
};

// ==================== UPLOAD ====================

export const uploadAPI = {
  // Upload d'une seule image
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Upload de plusieurs images
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Supprimer une image
  delete: async (filename) => {
    const response = await api.delete(`/upload/${filename}`);
    return response.data;
  }
};

// ==================== PORTFOLIO ====================

export const portfolioAPI = {
  // Obtenir toutes les images du portfolio
  getAll: async (params = {}) => {
    const response = await api.get('/portfolio', { params });
    return response.data;
  },

  // Obtenir une image par ID
  getById: async (id) => {
    const response = await api.get(`/portfolio/${id}`);
    return response.data;
  },

  // Obtenir les catégories
  getCategories: async () => {
    const response = await api.get('/portfolio/categories');
    return response.data;
  },

  // Créer une image de portfolio (admin)
  create: async (portfolioData) => {
    const response = await api.post('/portfolio', portfolioData);
    return response.data;
  },

  // Mettre à jour une image (admin)
  update: async (id, portfolioData) => {
    const response = await api.put(`/portfolio/${id}`, portfolioData);
    return response.data;
  },

  // Supprimer une image (admin)
  delete: async (id) => {
    const response = await api.delete(`/portfolio/${id}`);
    return response.data;
  }
};

// ==================== MEDIA STATIC ====================

export const mediaStaticAPI = {
  // Obtenir tous les médias statiques
  getAll: async (params = {}) => {
    const response = await api.get('/media-static', { params });
    return response.data;
  },

  // Obtenir un média par ID
  getById: async (id) => {
    const response = await api.get(`/media-static/${id}`);
    return response.data;
  },

  // Obtenir les médias par page et location
  getByPageLocation: async (page, location) => {
    const response = await api.get(`/media-static/page/${page}/${location}`);
    return response.data;
  },

  // Créer un média statique (admin)
  create: async (mediaData) => {
    const response = await api.post('/media-static', mediaData);
    return response.data;
  },

  // Mettre à jour un média (admin)
  update: async (id, mediaData) => {
    const response = await api.put(`/media-static/${id}`, mediaData);
    return response.data;
  },

  // Supprimer un média (admin)
  delete: async (id) => {
    const response = await api.delete(`/media-static/${id}`);
    return response.data;
  }
};

// ==================== TESTIMONIALS ====================

export const testimonialsAPI = {
  // Obtenir tous les témoignages
  getAll: async (params = {}) => {
    const response = await api.get('/testimonials', { params });
    return response.data;
  },

  // Obtenir un témoignage par ID
  getById: async (id) => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },

  // Créer un témoignage (admin)
  create: async (testimonialData) => {
    const response = await api.post('/testimonials', testimonialData);
    return response.data;
  },

  // Mettre à jour un témoignage (admin)
  update: async (id, testimonialData) => {
    const response = await api.put(`/testimonials/${id}`, testimonialData);
    return response.data;
  },

  // Supprimer un témoignage (admin)
  delete: async (id) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  }
};

// Export de l'instance axios pour des cas spécifiques
export default api;

