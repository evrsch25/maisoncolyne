const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/database');
const MediaStatic = require('../models/MediaStatic');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const cleanMediaStatic = async () => {
  try {
    console.log('🔌 Connexion à la base de données...');
    await connectDB();

    console.log('🗑️  Suppression de la collection MediaStatic...');
    await MediaStatic.collection.drop().catch(() => {
      console.log('⚠️  Collection MediaStatic n\'existe pas encore (c\'est normal)');
    });

    console.log('✅ Collection MediaStatic nettoyée avec succès');
    console.log('💡 Vous pouvez maintenant créer de nouveaux médias statiques');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

cleanMediaStatic();

