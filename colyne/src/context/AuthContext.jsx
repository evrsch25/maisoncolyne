import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Vérifier que le token est toujours valide
          const response = await authAPI.getMe();
          if (response.success) {
            setIsAuthenticated(true);
            setUser(response.data);
          }
        } catch (error) {
          console.error('Erreur de vérification du token:', error);
          // Token invalide ou expiré
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Appel à l'API d'authentification
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        const { token, user } = response.data;
        
        // Sauvegarder le token et les données utilisateur
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setIsAuthenticated(true);
        setUser(user);
        
        return { success: true };
      }
      
      return { success: false, message: 'Identifiants incorrects' };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur de connexion au serveur' 
      };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

