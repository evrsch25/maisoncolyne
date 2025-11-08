const mongoose = require('mongoose');

const mediaStaticSchema = new mongoose.Schema({
  page: {
    type: String,
    required: [true, 'La page est requise'],
    enum: ['accueil', 'prestations', 'a-propos'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'L\'emplacement est requis'],
    enum: ['carousel', 'bienvenue', 'pourquoi-choisir', 'photo-hero', 'photo-portrait', 'photo-pourquoi', 'photo-parcours', 'logo'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise']
  },
  alt: {
    type: String,
    trim: true,
    default: ''
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Mettre à jour automatiquement le champ updatedAt
mediaStaticSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pour optimiser les recherches par page, location et order
mediaStaticSchema.index({ page: 1, location: 1, order: 1 });

module.exports = mongoose.model('MediaStatic', mediaStaticSchema);

