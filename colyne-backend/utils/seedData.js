const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Charger les variables d'environnement
dotenv.config();

// Importer les modèles
const Prestation = require('../models/Prestation');
const BlogPost = require('../models/BlogPost');
const Config = require('../models/Config');

// Chemins vers les fichiers JSON du frontend
const FRONTEND_DATA_PATH = path.join(__dirname, '../../colyne/src/data');

// Fonction pour lire un fichier JSON
const readJSONFile = (filename) => {
  const filePath = path.join(FRONTEND_DATA_PATH, filename);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture de ${filename}:`, error.message);
    return null;
  }
};

// Fonction pour vider une collection
const clearCollection = async (Model, name) => {
  try {
    const count = await Model.countDocuments();
    if (count > 0) {
      await Model.deleteMany({});
      console.log(`🗑️  ${count} ${name} supprimé(s)`);
    } else {
      console.log(`ℹ️  Collection ${name} déjà vide`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors du vidage de ${name}:`, error.message);
  }
};

// Fonction pour importer les prestations
const seedPrestations = async () => {
  console.log('\n📦 Import des prestations...');
  
  const prestationsData = readJSONFile('prestations.json');
  if (!prestationsData) return;

  try {
    // Vider la collection existante
    await clearCollection(Prestation, 'prestations');

    // Préparer les données (supprimer l'id JSON, MongoDB générera _id)
    const prestations = prestationsData.map(({ id, ...prestation }) => prestation);

    // Insérer les nouvelles prestations
    const result = await Prestation.insertMany(prestations);
    
    console.log(`✅ ${result.length} prestations importées`);
    result.forEach(p => console.log(`   - ${p.title} (slug: ${p.slug})`));
  } catch (error) {
    console.error('❌ Erreur lors de l\'import des prestations:', error.message);
  }
};

// Fonction pour importer les articles de blog
const seedBlog = async () => {
  console.log('\n📰 Import des articles de blog...');
  
  const blogData = readJSONFile('blog.json');
  if (!blogData) return;

  try {
    // Vider la collection existante
    await clearCollection(BlogPost, 'articles');

    // Préparer les données
    const articles = blogData.map(({ id, date, ...article }) => ({
      ...article,
      // Utiliser la date du JSON pour createdAt (Option A)
      createdAt: date ? new Date(date) : new Date(),
      updatedAt: date ? new Date(date) : new Date()
    }));

    // Insérer les nouveaux articles
    const result = await BlogPost.insertMany(articles);
    
    console.log(`✅ ${result.length} articles importés`);
    result.forEach(a => console.log(`   - ${a.title} (${a.createdAt.toLocaleDateString('fr-FR')})`));
  } catch (error) {
    console.error('❌ Erreur lors de l\'import des articles:', error.message);
  }
};

// Fonction pour importer la configuration
const seedConfig = async () => {
  console.log('\n⚙️  Import de la configuration...');
  
  const configData = readJSONFile('config.json');
  if (!configData) return;

  try {
    // Vider la collection existante
    await clearCollection(Config, 'configuration');

    // Supprimer les IDs des testimonials (MongoDB les générera automatiquement)
    if (configData.testimonials) {
      configData.testimonials = configData.testimonials.map(({ id, ...testimonial }) => testimonial);
    }

    // Créer la configuration
    const config = await Config.create(configData);
    
    console.log('✅ Configuration importée');
    console.log(`   - Site: ${config.site.name}`);
    console.log(`   - Contact: ${config.contact.email}`);
    console.log(`   - Témoignages: ${config.testimonials.length}`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'import de la configuration:', error.message);
  }
};

// Fonction principale
const seedDatabase = async () => {
  console.log('🌱 SEED DE LA BASE DE DONNÉES');
  console.log('================================\n');

  try {
    // Connexion à MongoDB
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    console.log(`📦 Base de données: ${mongoose.connection.name}\n`);

    // Import des données
    await seedPrestations();
    await seedBlog();
    await seedConfig();

    // Récapitulatif
    console.log('\n================================');
    console.log('📊 RÉCAPITULATIF');
    console.log('================================');
    
    const prestationsCount = await Prestation.countDocuments();
    const blogCount = await BlogPost.countDocuments();
    const configCount = await Config.countDocuments();

    console.log(`✅ Prestations: ${prestationsCount}`);
    console.log(`✅ Articles de blog: ${blogCount}`);
    console.log(`✅ Configuration: ${configCount}`);
    console.log('\n🎉 Import terminé avec succès !');
    console.log('\n💡 Vous pouvez maintenant :');
    console.log('   1. Actualiser le frontend (http://localhost:5173)');
    console.log('   2. Les données seront chargées depuis MongoDB');
    console.log('   3. Se connecter à l\'admin pour gérer les données\n');

  } catch (error) {
    console.error('\n❌ ERREUR FATALE:', error.message);
    
    // Afficher des conseils selon le type d'erreur
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 CONSEIL : Vérifiez votre connexion MongoDB');
      console.log('   - Le serveur backend tourne-t-il ?');
      console.log('   - L\'URL MongoDB dans .env est-elle correcte ?');
      console.log('   - Testez avec: npm run test-db');
    }
    
    process.exit(1);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('👋 Connexion fermée\n');
  }
};

// Exécuter le seed
seedDatabase();

