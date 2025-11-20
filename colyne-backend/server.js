const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

// Initialiser l'application Express
const app = express();

// Middleware de sécurité
app.use(helmet());

const corsWhitelist = [
  'http://localhost:5173',
  'http://localhost:5000',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  'https://maisoncolyne.fr',
  'https://www.maisoncolyne.fr',
  'https://api.maisoncolyne.fr'
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || corsWhitelist.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Non autorisé par CORS'));
  },
  credentials: true
}));

// Trust proxy (nécessaire pour rate limiting derrière Nginx)
app.set('trust proxy', 1);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger (en développement uniquement)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting (désactivé en développement)
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // 100 requêtes par fenêtre
  });
  app.use('/api/', limiter);
  console.log('🛡️  Rate limiting activé (100 req/10min)');
} else {
  console.log('⚠️  Rate limiting désactivé en mode développement');
}

// Servir les fichiers uploadés avec headers CORS
app.use('/uploads', (req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/prestations', require('./routes/prestations'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/config', require('./routes/config'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/media-static', require('./routes/mediaStatic'));
app.use('/api/testimonials', require('./routes/testimonials'));

// Route de test
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Colyne Photographe - Backend opérationnel ✅',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      prestations: '/api/prestations',
      blog: '/api/blog',
      config: '/api/config',
      contact: '/api/contact',
      upload: '/api/upload',
      portfolio: '/api/portfolio',
      mediaStatic: '/api/media-static',
      testimonials: '/api/testimonials'
    }
  });
});

// Gestionnaire d'erreurs (doit être après les routes)
app.use(errorHandler);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.CLIENT_URL}`);
});

// Gérer les rejets de promesses non gérées
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Erreur: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;

