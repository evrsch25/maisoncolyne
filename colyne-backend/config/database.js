const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    console.log(`📦 Base de données: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB: ${error.message}`);
    console.error(`💡 Vérifiez votre fichier .env et l'URL MongoDB`);
    process.exit(1);
  }
};

module.exports = connectDB;

