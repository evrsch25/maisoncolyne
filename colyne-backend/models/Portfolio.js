const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'L\'image est requise']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['nouveau-ne', 'bebe', 'grossesse', 'famille', 'iris'],
    trim: true
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
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
portfolioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pour optimiser les recherches par catégorie
portfolioSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);

