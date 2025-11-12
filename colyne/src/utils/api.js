import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => (await api.post('/auth/login', credentials)).data,
  register: async (userData) => (await api.post('/auth/register', userData)).data,
  getMe: async () => (await api.get('/auth/me')).data,
  logout: async () => (await api.post('/auth/logout')).data
};

export const prestationsAPI = {
  getAll: async (params = {}) => (await api.get('/prestations', { params })).data,
  getById: async (id) => (await api.get(`/prestations/${id}`)).data,
  create: async (prestationData) => (await api.post('/prestations', prestationData)).data,
  update: async (id, prestationData) => (await api.put(`/prestations/${id}`, prestationData)).data,
  delete: async (id) => (await api.delete(`/prestations/${id}`)).data
};

export const blogAPI = {
  getAll: async (params = {}) => (await api.get('/blog', { params })).data,
  getById: async (id) => (await api.get(`/blog/id/${id}`)).data,
  getBySlug: async (slug) => (await api.get(`/blog/${slug}`)).data,
  create: async (articleData) => (await api.post('/blog', articleData)).data,
  update: async (id, articleData) => (await api.put(`/blog/id/${id}`, articleData)).data,
  delete: async (id) => (await api.delete(`/blog/id/${id}`)).data
};

export const configAPI = {
  get: async () => (await api.get('/config')).data,
  update: async (configData) => (await api.put('/config', configData)).data
};

export const contactAPI = {
  send: async (messageData) => (await api.post('/contact', messageData)).data,
  getAll: async (params = {}) => (await api.get('/contact', { params })).data,
  getById: async (id) => (await api.get(`/contact/${id}`)).data,
  updateStatus: async (id, status) =>
    (await api.put(`/contact/${id}/status`, status)).data,
  delete: async (id) => (await api.delete(`/contact/${id}`)).data
};

export const uploadAPI = {
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return (
      await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    ).data;
  },
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return (
      await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    ).data;
  },
  delete: async (filename) => (await api.delete(`/upload/${filename}`)).data
};

export const portfolioAPI = {
  getAll: async (params = {}) => (await api.get('/portfolio', { params })).data,
  getById: async (id) => (await api.get(`/portfolio/${id}`)).data,
  getCategories: async () => (await api.get('/portfolio/categories')).data,
  create: async (portfolioData) => (await api.post('/portfolio', portfolioData)).data,
  update: async (id, portfolioData) => (await api.put(`/portfolio/${id}`, portfolioData)).data,
  delete: async (id) => (await api.delete(`/portfolio/${id}`)).data
};

export const mediaStaticAPI = {
  getAll: async (params = {}) => (await api.get('/media-static', { params })).data,
  getById: async (id) => (await api.get(`/media-static/${id}`)).data,
  getByPageLocation: async (page, location) =>
    (await api.get(`/media-static/page/${page}/${location}`)).data,
  create: async (mediaData) => (await api.post('/media-static', mediaData)).data,
  update: async (id, mediaData) => (await api.put(`/media-static/${id}`, mediaData)).data,
  delete: async (id) => (await api.delete(`/media-static/${id}`)).data
};

export const testimonialsAPI = {
  getAll: async (params = {}) => (await api.get('/testimonials', { params })).data,
  getById: async (id) => (await api.get(`/testimonials/${id}`)).data,
  create: async (testimonialData) => (await api.post('/testimonials', testimonialData)).data,
  update: async (id, testimonialData) => (await api.put(`/testimonials/${id}`, testimonialData)).data,
  delete: async (id) => (await api.delete(`/testimonials/${id}`)).data
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const normalized = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${normalized}`;
};

export const getThumbnailUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    const url = new URL(imagePath);
    const parts = url.pathname.split('.');
    if (parts.length > 1) {
      const ext = parts.pop();
      const base = parts.join('.');
      return `${url.origin}${base}_thumb.${ext}`;
    }
    return imagePath;
  }
  const parts = imagePath.split('.');
  if (parts.length > 1) {
    const ext = parts.pop();
    const base = parts.join('.');
    const normalizedBase = base.startsWith('/') ? base.slice(1) : base;
    return `${API_BASE_URL}/${normalizedBase}_thumb.${ext}`;
  }
  return getImageUrl(imagePath);
};

export default api;