const mongoose = require('mongoose');

const actualiteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
    trim: true
  },
  category: {
    type: String,
    enum: ['nouveauté', 'promotion', 'événement', 'info'],
    default: 'info'
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour trier par date décroissante
actualiteSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Actualite', actualiteSchema);
