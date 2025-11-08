const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Le nom de l\'auteur est requis'],
    trim: true
  },
  text: {
    type: String,
    required: [true, 'Le texte du témoignage est requis'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'La note est requise'],
    min: 1,
    max: 5,
    default: 5
  },
  service: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
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

// Mise à jour de la date de modification avant chaque sauvegarde
testimonialSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pour optimiser les requêtes
testimonialSchema.index({ active: 1, order: 1 });
testimonialSchema.index({ featured: 1, order: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);

