const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const testConnection = async () => {
  console.log('🔍 Test de connexion MongoDB...\n');

  // Vérifier que l'URL existe
  if (!process.env.MONGODB_URI) {
    console.error('❌ ERREUR : La variable MONGODB_URI n\'est pas définie dans le fichier .env');
    console.log('💡 Vérifiez que le fichier .env existe et contient MONGODB_URI');
    process.exit(1);
  }

  // Afficher l'URL (masquer le mot de passe)
  const maskedUri = process.env.MONGODB_URI.replace(/:([^@]+)@/, ':***@');
  console.log('📍 URL MongoDB :', maskedUri);
  console.log('');

  try {
    // Tentative de connexion
    console.log('⏳ Connexion en cours...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('');
    console.log('✅ SUCCÈS ! Connexion établie avec MongoDB');
    console.log('🌐 Hôte:', conn.connection.host);
    console.log('📦 Base de données:', conn.connection.name);
    console.log('🔌 État:', conn.connection.readyState === 1 ? 'Connecté' : 'Déconnecté');
    console.log('');
    console.log('🎉 Votre configuration MongoDB est correcte !');
    console.log('');
    console.log('✨ Vous pouvez maintenant :');
    console.log('   1. Démarrer le serveur : npm run dev');
    console.log('   2. Créer un admin : npm run create-admin');

    await mongoose.connection.close();
    console.log('\n👋 Connexion fermée');
    process.exit(0);

  } catch (error) {
    console.log('');
    console.error('❌ ÉCHEC DE LA CONNEXION');
    console.error('📛 Erreur:', error.message);
    console.log('');
    console.log('💡 SOLUTIONS POSSIBLES :');
    console.log('');

    if (error.message.includes('bad auth')) {
      console.log('🔐 Problème d\'authentification');
      console.log('   → Vérifiez le nom d\'utilisateur et le mot de passe dans l\'URL');
      console.log('   → Si votre mot de passe contient des caractères spéciaux, encodez-les :');
      console.log('      @ → %40, # → %23, $ → %24, % → %25');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('🌐 Impossible de trouver le serveur MongoDB');
      console.log('   → Vérifiez que l\'URL du cluster est correcte');
      console.log('   → Vérifiez votre connexion internet');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED')) {
      console.log('⏱️  Timeout ou connexion refusée');
      console.log('   → Vérifiez que votre IP est autorisée dans MongoDB Atlas');
      console.log('   → Allez dans Network Access → Add IP Address → 0.0.0.0/0');
    } else {
      console.log('❓ Erreur inconnue');
      console.log('   → Vérifiez que l\'URL MongoDB est au format :');
      console.log('      mongodb+srv://username:password@cluster.mongodb.net/database');
    }

    console.log('');
    console.log('📚 Consultez le guide : colyne-backend\\GUIDE_DEMARRAGE.md');
    process.exit(1);
  }
};

testConnection();

