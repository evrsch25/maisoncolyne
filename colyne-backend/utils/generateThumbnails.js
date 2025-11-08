const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Script pour générer des miniatures pour toutes les images existantes
 * Utilisé pour créer des miniatures pour les images uploadées avant l'implémentation
 */

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const THUMB_SIZE = 400;

async function generateThumbnailsForAllImages() {
  try {
    console.log('🔍 Recherche des images dans', UPLOADS_DIR);
    
    // Lire tous les fichiers du dossier uploads
    const files = await fs.readdir(UPLOADS_DIR);
    
    // Filtrer uniquement les images (pas les miniatures existantes)
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && !file.includes('_thumb');
    });
    
    console.log(`📸 ${imageFiles.length} image(s) trouvée(s)\n`);
    
    let processed = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const filename of imageFiles) {
      try {
        const filePath = path.join(UPLOADS_DIR, filename);
        const parsedPath = path.parse(filename);
        const thumbFilename = `${parsedPath.name}_thumb${parsedPath.ext}`;
        const thumbPath = path.join(UPLOADS_DIR, thumbFilename);
        
        // Vérifier si la miniature existe déjà
        try {
          await fs.access(thumbPath);
          console.log(`⏭️  Miniature existe déjà: ${thumbFilename}`);
          skipped++;
          continue;
        } catch {
          // La miniature n'existe pas, on la crée
        }
        
        console.log(`🖼️  Création miniature pour: ${filename}`);
        
        // Lire la taille originale
        const stats = await fs.stat(filePath);
        const originalSize = (stats.size / 1024 / 1024).toFixed(2);
        
        // Créer la miniature
        await sharp(filePath)
          .resize(THUMB_SIZE, THUMB_SIZE, { 
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 80, progressive: true })
          .toFile(thumbPath);
        
        const thumbStats = await fs.stat(thumbPath);
        const thumbSize = (thumbStats.size / 1024).toFixed(0);
        
        console.log(`   ✅ ${thumbFilename} créée (${thumbSize} KB vs ${originalSize} MB)\n`);
        processed++;
        
      } catch (error) {
        console.error(`   ❌ Erreur pour ${filename}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n📊 Résumé:');
    console.log(`   ✅ ${processed} miniature(s) créée(s)`);
    console.log(`   ⏭️  ${skipped} miniature(s) existante(s)`);
    if (errors > 0) {
      console.log(`   ❌ ${errors} erreur(s)`);
    }
    console.log('\n✨ Terminé!');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter le script
generateThumbnailsForAllImages();

