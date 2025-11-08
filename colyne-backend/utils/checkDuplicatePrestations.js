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

const checkDuplicates = async () => {
  try {
    console.log('\n📋 Liste de toutes les prestations :\n');
    
    const prestations = await Prestation.find().sort({ slug: 1 });
    
    console.log(`Total: ${prestations.length} prestation(s)\n`);
    
    const slugCounts = {};
    
    prestations.forEach((p, index) => {
      console.log(`${index + 1}. ID: ${p._id}`);
      console.log(`   Titre: ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Créée le: ${p.createdAt?.toLocaleDateString('fr-FR') || 'N/A'}`);
      console.log('');
      
      // Compter les slugs
      slugCounts[p.slug] = (slugCounts[p.slug] || 0) + 1;
    });
    
    // Afficher les doublons
    console.log('\n🔍 Vérification des doublons :\n');
    const duplicates = Object.entries(slugCounts).filter(([slug, count]) => count > 1);
    
    if (duplicates.length > 0) {
      console.log('⚠️  Slugs dupliqués trouvés :');
      duplicates.forEach(([slug, count]) => {
        console.log(`   - "${slug}" : ${count} fois`);
      });
      console.log('\n📝 Pour supprimer un doublon, utilisez le script deletePrestationById.js avec l\'ID');
    } else {
      console.log('✅ Aucun doublon trouvé !');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Connexion fermée');
  }
};

checkDuplicates();

