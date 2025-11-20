const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  site: {
    name: { type: String, default: 'Colyne Photographe' },
    tagline: { type: String, default: 'Photographe professionnelle à Oye-plage' },
    description: { type: String },
    location: { type: String, default: 'Oye-plage, France' }
  },
  hero: {
    slides: [{
      title: { type: String },
      subtitle: { type: String },
      order: { type: Number, default: 0 }
    }]
  },
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    messenger: { type: String }
  },
  social: {
    instagram: { type: String },
    facebook: { type: String },
    pinterest: { type: String }
  },
  about: {
    shortDescription: { type: String },
    fullDescription: { type: String },
    philosophy: { type: String },
    equipment: [{
      name: String,
      description: String
    }]
  },
  testimonials: [{
    name: { type: String, required: true },
    service: { type: String },
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 }
  }],
  faq: [{
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Il ne devrait y avoir qu'une seule configuration
configSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

configSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Config', configSchema);

