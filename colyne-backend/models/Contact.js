const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  phone: {
    type: String,
    trim: true
  },
  serviceType: {
    type: String,
    required: [true, 'Le type de séance est requis']
  },
  preferredDate: {
    type: Date
  },
  message: {
    type: String,
    required: [true, 'Le message est requis']
  },
  status: {
    type: String,
    enum: ['nouveau', 'lu', 'traite', 'archive'],
    default: 'nouveau'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);

