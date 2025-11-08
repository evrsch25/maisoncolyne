const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Modèle Prestation
const Prestation = require('../models/Prestation');

// Se connecter à la base de données
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch((err) => {
    console.error('❌ Erreur de connexion:', err);
    process.exit(1);
  });

const deletePrestation = async () => {
  try {
    // Récupérer l'ID depuis les arguments de ligne de commande
    const prestationId = process.argv[2];
    
    if (!prestationId) {
      console.log('\n❌ Veuillez fournir un ID de prestation');
      console.log('Usage: node deletePrestationById.js <ID_PRESTATION>');
      console.log('Exemple: node deletePrestationById.js 69091dbcecf0a1a62e7d0061\n');
      process.exit(1);
    }
    
    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(prestationId)) {
      console.log('\n❌ ID invalide\n');
      process.exit(1);
    }
    
    // Trouver la prestation
    const prestation = await Prestation.findById(prestationId);
    
    if (!prestation) {
      console.log('\n❌ Prestation non trouvée avec cet ID\n');
      process.exit(1);
    }
    
    // Afficher les détails
    console.log('\n📋 Prestation à supprimer :');
    console.log(`   ID: ${prestation._id}`);
    console.log(`   Titre: ${prestation.title}`);
    console.log(`   Slug: ${prestation.slug}`);
    console.log(`   Créée le: ${prestation.createdAt?.toLocaleDateString('fr-FR') || 'N/A'}`);
    
    // Supprimer
    await Prestation.findByIdAndDelete(prestationId);
    console.log('\n✅ Prestation supprimée avec succès !\n');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message, '\n');
  } finally {
    mongoose.connection.close();
  }
};

deletePrestation();

