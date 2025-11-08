import { createContext, useContext, useState, useEffect } from 'react';
import { prestationsAPI, blogAPI, configAPI, testimonialsAPI } from '../utils/api';
import configData from '../data/config.json';
import prestationsData from '../data/prestations.json';
import blogData from '../data/blog.json';

const DataContext = createContext();

const toDate = (value) => {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const sortPrestationsByDate = (items = []) =>
  [...items].sort((a, b) => toDate(a.createdAt || a.updatedAt) - toDate(b.createdAt || b.updatedAt));

const sortBlogPosts = (items = []) =>
  [...items].sort((a, b) => {
    const featuredDiff = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (featuredDiff !== 0) return featuredDiff;
    return toDate(b.createdAt || b.updatedAt) - toDate(a.createdAt || a.updatedAt);
  });

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [config, setConfig] = useState(configData);
  const [prestations, setPrestations] = useState(sortPrestationsByDate(prestationsData));
  const [blog, setBlog] = useState(sortBlogPosts(blogData));
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données depuis l'API au démarrage
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les prestations
        try {
          const prestationsResponse = await prestationsAPI.getAll();
          if (prestationsResponse.success && prestationsResponse.data.length > 0) {
            setPrestations(sortPrestationsByDate(prestationsResponse.data));
          }
        } catch (err) {
          console.log('Utilisation des prestations JSON (API non disponible)');
        }

        // Charger le blog
        try {
          const blogResponse = await blogAPI.getAll();
          if (blogResponse.success && blogResponse.data.length > 0) {
            setBlog(sortBlogPosts(blogResponse.data));
          }
        } catch (err) {
          console.log('Utilisation du blog JSON (API non disponible)');
        }

        // Charger la config
        try {
          const configResponse = await configAPI.get();
          if (configResponse.success && configResponse.data) {
            setConfig(configResponse.data);
          }
        } catch (err) {
          console.log('Utilisation de la config JSON (API non disponible)');
        }

        // Charger les témoignages
        try {
          const testimonialsResponse = await testimonialsAPI.getAll({ active: true });
          if (testimonialsResponse.success && testimonialsResponse.data.length > 0) {
            setTestimonials(testimonialsResponse.data);
          }
        } catch (err) {
          console.log('Aucun témoignage disponible (API non disponible)');
        }

        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Méthodes CRUD pour les prestations
  const addPrestation = async (prestation) => {
    try {
      const response = await prestationsAPI.create(prestation);
      if (response.success) {
        setPrestations(sortPrestationsByDate([...prestations, response.data]));
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la prestation:', error);
      return { success: false, message: error.response?.data?.message || 'Erreur' };
    }
  };

  const updatePrestation = async (id, updatedPrestation) => {
    try {
      const response = await prestationsAPI.update(id, updatedPrestation);
      if (response.success) {
        setPrestations(sortPrestationsByDate(prestations.map(p => (p._id === id ? response.data : p))));
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la prestation:', error);
      return { success: false, message: error.response?.data?.message || 'Erreur' };
    }
  };

  const deletePrestation = async (id) => {
    try {
      const response = await prestationsAPI.delete(id);
      if (response.success) {
        setPrestations(sortPrestationsByDate(prestations.filter(p => p._id !== id)));
        return { success: true };
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la prestation:', error);
      return { success: false, message: error.response?.data?.message || 'Erreur' };
    }
  };

  // Méthodes CRUD pour le blog
  const addBlogPost = async (post) => {
    try {
      const response = await blogAPI.create(post);
      if (response.success) {
        setBlog(sortBlogPosts([...blog, response.data]));
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'article:', error);
      return { success: false, message: error.response?.data?.message || 'Erreur' };
    }
  };

  const updateBlogPost = async (id, updatedPost) => {
    try {
      const response = await blogAPI.update(id, updatedPost);
      if (response.success) {
        setBlog(sortBlogPosts(blog.map(b => (b._id === id ? response.data : b))));
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Erreur lors de la modification de l\'article:', error);
      return { success: false, message: error.response?.data?.message || 'Erreur' };
    }
  };

  const deleteBlogPost = async (id) => {
    try {
      const response = await blogAPI.delete(id);
      if (response.success) {
        setBlog(sortBlogPosts(blog.filter(b => b._id !== id)));
        return { success: true };
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      return { success: false, message: error.response?.data?.message || 'Erreur' };
    }
  };

  // Méthode pour mettre à jour la config
  const updateConfig = async (newConfig) => {
    try {
      const response = await configAPI.update(newConfig);
      if (response.success) {
        setConfig(response.data);
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la config:', error);
      return { success: false, message: error.response?.data?.message || 'Erreur' };
    }
  };

  const value = {
    config,
    prestations,
    blog,
    testimonials,
    loading,
    error,
    updateConfig,
    addPrestation,
    updatePrestation,
    deletePrestation,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

