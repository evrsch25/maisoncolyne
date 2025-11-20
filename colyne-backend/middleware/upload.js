const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Conserver le nom de fichier original avec un timestamp pour éviter les doublons
    const uniqueSuffix = Date.now();
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    cb(null, `${originalName}-${uniqueSuffix}${ext}`);
  }
});

// Filtrer les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  // Extensions autorisées
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
  }
};

// Configuration de multer
// FORCE 100 MB - ignore .env
const maxFileSize = 100 * 1024 * 1024; // 100 MB forcé
console.log(`📸 Upload config: Taille max fichier = ${maxFileSize / 1024 / 1024} MB`);

const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxFileSize // Taille max en MB (100 MB pour photos pro haute qualité)
  },
  fileFilter: fileFilter
});

module.exports = upload;

