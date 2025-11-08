const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'L\'auteur est requis'],
    default: 'Colyne'
  },
  excerpt: {
    type: String,
    required: [true, 'L\'extrait est requis'],
    maxlength: [300, 'L\'extrait ne peut pas dépasser 300 caractères']
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis']
  },
  // Nouveau : Image principale de l'article
  mainImage: {
    type: String,
    default: ''
  },
  // Nouveau : Images supplémentaires de l'article
  additionalImages: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  views: {
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
blogPostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Incrémenter le compteur de vues
blogPostSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('BlogPost', blogPostSchema);

