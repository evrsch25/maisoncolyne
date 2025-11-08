// Contrôleur pour gérer l'upload d'images
exports.uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image n\'a été uploadée'
      });
    }

    // Retourner l'URL relative du fichier uploadé
    const fileUrl = `/uploads/${req.file.filename}`;
    const thumbnailUrl = req.file.thumbnail ? `/uploads/${req.file.thumbnail}` : null;

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        url: fileUrl,
        thumbnail: thumbnailUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      message: 'Image uploadée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Upload multiple images
exports.uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image n\'a été uploadée'
      });
    }

    // Retourner les URLs relatives des fichiers uploadés
    const files = req.files.map(file => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      thumbnail: file.thumbnail ? `/uploads/${file.thumbnail}` : null,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.status(200).json({
      success: true,
      data: files,
      message: `${files.length} image(s) uploadée(s) avec succès`
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer une image
exports.deleteImage = async (req, res, next) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image non trouvée'
      });
    }

    // Supprimer le fichier
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'Image supprimée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

