const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  heading: { type: String, default: '' },
  content: { type: String, default: '' }
}, { _id: false });

const pageLegaleSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    enum: ['mentions-legales', 'cgv', 'politique-confidentialite']
  },
  title: { type: String, required: true },
  sections: [sectionSchema],
  updatedAt: { type: Date, default: Date.now }
});

pageLegaleSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PageLegale', pageLegaleSchema);
