const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Modèle Portfolio
const Portfolio = require('../models/Portfolio');

// Se connecter à la base de données
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch((err) => {
    console.error('❌ Erreur de connexion:', err);
    process.exit(1);
  });

const cleanPortfolio = async () => {
  try {
    console.log('\n🧹 Nettoyage de la collection Portfolio...\n');
    
    // Supprimer toutes les images du portfolio
    const result = await Portfolio.deleteMany({});
    
    console.log(`✅ ${result.deletedCount} image(s) supprimée(s) du portfolio\n`);
    console.log('📝 Vous pouvez maintenant ajouter de nouvelles images depuis l\'admin !\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
    console.log('👋 Connexion fermée');
  }
};

cleanPortfolio();

