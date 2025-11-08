const mongoose = require('mongoose');

const prestationSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Le slug est requis'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  shortDescription: {
    type: String,
    required: [true, 'La description courte est requise'],
    maxlength: [200, 'La description courte ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  basePrice: {
    type: String,
    required: [true, 'Le prix de base est requis']
  },
  // Nouveau : Détails de prix pour différents types de séances (Option A - modifiable dans l'admin)
  priceDetails: [{
    sessionType: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    deliverables: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  }],
  location: {
    type: String,
    required: [true, 'Le lieu est requis']
  },
  included: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  // Nouveau : Image principale (pour les cards et le fond de la page détail)
  mainImage: {
    type: String,
    default: ''
  },
  // Nouveau : Galerie d'inspiration (images multiples)
  inspirationGallery: [{
    type: String
  }],
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
prestationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Prestation', prestationSchema);

