const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const Prestation = require('../models/Prestation');
const BlogPost = require('../models/BlogPost');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB:', err.message);
    process.exit(1);
  }
};

const migrateData = async () => {
  await connectDB();

  try {
    console.log('\n🔄 MIGRATION DES DONNÉES');
    console.log('================================');

    // ========== Migration des Prestations ==========
    console.log('\n📦 Migration des prestations...');
    
    const prestations = await Prestation.find();
    console.log(`   Trouvé ${prestations.length} prestations à migrer`);

    for (const prestation of prestations) {
      let hasChanges = false;

      // 1. Migrer image -> mainImage
      if (prestation.image && !prestation.mainImage) {
        prestation.mainImage = prestation.image;
        hasChanges = true;
        console.log(`   ✓ ${prestation.title}: image → mainImage`);
      }

      // 2. Migrer gallery -> inspirationGallery
      if (prestation.gallery && prestation.gallery.length > 0 && !prestation.inspirationGallery) {
        prestation.inspirationGallery = prestation.gallery;
        hasChanges = true;
        console.log(`   ✓ ${prestation.title}: gallery → inspirationGallery (${prestation.gallery.length} images)`);
      }

      // 3. Migrer priceDetails (Map) -> priceDetails (Array)
      if (prestation.priceDetails && typeof prestation.priceDetails === 'object' && !Array.isArray(prestation.priceDetails)) {
        const newPriceDetails = [];
        
        // Si c'est une Map Mongoose
        if (prestation.priceDetails instanceof Map) {
          prestation.priceDetails.forEach((value, key) => {
            newPriceDetails.push({
              sessionType: key,
              price: value,
              deliverables: '',
              description: ''
            });
          });
        } else {
          // Si c'est un objet simple
          for (const [key, value] of Object.entries(prestation.priceDetails)) {
            newPriceDetails.push({
              sessionType: key,
              price: typeof value === 'number' ? value : 0,
              deliverables: '',
              description: ''
            });
          }
        }

        prestation.priceDetails = newPriceDetails;
        hasChanges = true;
        console.log(`   ✓ ${prestation.title}: priceDetails transformé en tableau (${newPriceDetails.length} types)`);
      }

      if (hasChanges) {
        await prestation.save();
      }
    }

    console.log('✅ Migration des prestations terminée');

    // ========== Migration des Articles de Blog ==========
    console.log('\n📰 Migration des articles de blog...');
    
    const blogPosts = await BlogPost.find();
    console.log(`   Trouvé ${blogPosts.length} articles à migrer`);

    for (const post of blogPosts) {
      let hasChanges = false;

      // 1. Migrer featured_image -> mainImage
      if (post.featured_image && !post.mainImage) {
        post.mainImage = post.featured_image;
        hasChanges = true;
        console.log(`   ✓ ${post.title}: featured_image → mainImage`);
      }

      // 2. Migrer gallery -> additionalImages
      if (post.gallery && post.gallery.length > 0 && !post.additionalImages) {
        post.additionalImages = post.gallery;
        hasChanges = true;
        console.log(`   ✓ ${post.title}: gallery → additionalImages (${post.gallery.length} images)`);
      }

      if (hasChanges) {
        await post.save();
      }
    }

    console.log('✅ Migration des articles terminée');

    console.log('\n================================');
    console.log('📊 RÉCAPITULATIF DE LA MIGRATION');
    console.log('================================');
    console.log(`✅ Prestations migrées: ${prestations.length}`);
    console.log(`✅ Articles de blog migrés: ${blogPosts.length}`);
    console.log('\n🎉 Migration terminée avec succès !');
    console.log('\n💡 Note: Les anciennes propriétés (image, gallery, etc.) sont conservées pour compatibilité.');
    console.log('   Vous pouvez les supprimer manuellement si nécessaire.');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Connexion fermée');
  }
};

migrateData();

