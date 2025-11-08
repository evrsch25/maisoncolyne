const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * Optimise et convertit les images uploadées
 * - Création de miniature (400px pour l'admin)
 * - Compression JPEG/PNG avec qualité 85% (imperceptible à l'œil)
 * - Conversion automatique en WebP (30% plus léger)
 * - Création de plusieurs tailles (miniature + original optimisé + WebP)
 */
const optimizeImage = async (file) => {
  try {
    const originalPath = file.path;
    const parsedPath = path.parse(originalPath);
    
    // Chemins pour les différentes versions
    const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
    const thumbPath = path.join(parsedPath.dir, `${parsedPath.name}_thumb${parsedPath.ext}`);
    
    console.log(`🖼️  Optimisation de ${file.originalname}...`);
    
    // Lire l'image originale
    const imageBuffer = await fs.readFile(originalPath);
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    
    console.log(`   📊 Taille originale: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   📐 Dimensions: ${metadata.width}x${metadata.height}`);
    
    // 1. Créer une miniature (400px) pour l'admin - TRÈS RAPIDE À CHARGER
    await sharp(imageBuffer)
      .resize(400, 400, { 
        fit: 'inside', // Conserver le ratio
        withoutEnlargement: true // Ne pas agrandir les petites images
      })
      .jpeg({ quality: 80, progressive: true })
      .toFile(thumbPath);
    
    const thumbStats = await fs.stat(thumbPath);
    const thumbSize = (thumbStats.size / 1024).toFixed(0);
    console.log(`   🔍 Miniature: ${thumbSize} KB (400px)`);
    
    // 2. Optimiser l'image originale (JPEG/PNG)
    // Qualité 85 = excellent compromis (imperceptible + 40-60% de gain)
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      await sharp(imageBuffer)
        .jpeg({ 
          quality: 85,
          progressive: true, // Chargement progressif
          mozjpeg: true // Meilleure compression
        })
        .toFile(originalPath + '.tmp');
      
      // Remplacer l'original par la version optimisée
      await fs.rename(originalPath + '.tmp', originalPath);
    } else if (metadata.format === 'png') {
      await sharp(imageBuffer)
        .png({ 
          quality: 85,
          compressionLevel: 9,
          progressive: true
        })
        .toFile(originalPath + '.tmp');
      
      await fs.rename(originalPath + '.tmp', originalPath);
    }
    
    // 3. Créer une version WebP (30% plus légère)
    await sharp(imageBuffer)
      .webp({ 
        quality: 85,
        effort: 4 // Bon compromis vitesse/compression
      })
      .toFile(webpPath);
    
    // Vérifier les tailles après optimisation
    const optimizedStats = await fs.stat(originalPath);
    const webpStats = await fs.stat(webpPath);
    
    const optimizedSize = (optimizedStats.size / 1024 / 1024).toFixed(2);
    const webpSize = (webpStats.size / 1024 / 1024).toFixed(2);
    const savings = (((file.size - optimizedStats.size) / file.size) * 100).toFixed(1);
    const webpSavings = (((file.size - webpStats.size) / file.size) * 100).toFixed(1);
    
    console.log(`   ✅ Optimisé: ${optimizedSize} MB (-${savings}%)`);
    console.log(`   ✅ WebP: ${webpSize} MB (-${webpSavings}%)`);
    
    // Mettre à jour le fichier pour inclure le chemin de la miniature
    file.thumbnail = path.basename(thumbPath);
    
    return {
      original: file.filename,
      thumbnail: path.basename(thumbPath),
      webp: path.basename(webpPath),
      originalSize: file.size,
      optimizedSize: optimizedStats.size,
      webpSize: webpStats.size,
      thumbnailSize: thumbStats.size
    };
    
  } catch (error) {
    console.error(`❌ Erreur lors de l'optimisation de ${file.originalname}:`, error);
    // En cas d'erreur, on garde l'original sans bloquer l'upload
    return {
      original: file.filename,
      thumbnail: null,
      webp: null,
      error: error.message
    };
  }
};

/**
 * Middleware Express pour optimiser automatiquement les images uploadées
 */
const optimizeUploadedImages = async (req, res, next) => {
  try {
    // Gérer les uploads simples et multiples
    const files = req.files || (req.file ? [req.file] : []);
    
    if (files.length === 0) {
      return next();
    }
    
    console.log(`\n🔄 Optimisation de ${files.length} image(s)...`);
    
    // Optimiser toutes les images en parallèle
    const optimizationResults = await Promise.all(
      files.map(file => optimizeImage(file))
    );
    
    // Ajouter les résultats à la requête pour l'utiliser dans le contrôleur
    req.optimizationResults = optimizationResults;
    
    console.log(`✨ Optimisation terminée!\n`);
    next();
    
  } catch (error) {
    console.error('❌ Erreur dans le middleware d\'optimisation:', error);
    // Ne pas bloquer l'upload en cas d'erreur d'optimisation
    next();
  }
};

module.exports = {
  optimizeImage,
  optimizeUploadedImages
};

