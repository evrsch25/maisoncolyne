const Testimonial = require('../models/Testimonial');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getAllTestimonials = async (req, res) => {
  try {
    const { active, featured } = req.query;
    const filter = {};
    
    if (active !== undefined) {
      filter.active = active === 'true';
    }
    
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }
    
    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des témoignages',
      error: error.message
    });
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Témoignage non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du témoignage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du témoignage',
      error: error.message
    });
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
exports.createTestimonial = async (req, res) => {
  try {
    console.log('📝 Données reçues pour créer un témoignage:', req.body);
    
    const testimonial = await Testimonial.create(req.body);
    
    console.log('✅ Témoignage créé avec succès:', testimonial._id);
    
    res.status(201).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création du témoignage:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du témoignage',
      error: error.message
    });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
exports.updateTestimonial = async (req, res) => {
  try {
    console.log('📝 Mise à jour du témoignage:', req.params.id, req.body);
    
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Témoignage non trouvé'
      });
    }
    
    console.log('✅ Témoignage mis à jour avec succès:', testimonial._id);
    
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du témoignage:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du témoignage',
      error: error.message
    });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
exports.deleteTestimonial = async (req, res) => {
  try {
    console.log('🗑️ Suppression du témoignage:', req.params.id);
    
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Témoignage non trouvé'
      });
    }
    
    console.log('✅ Témoignage supprimé avec succès:', req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Témoignage supprimé',
      data: {}
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du témoignage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du témoignage',
      error: error.message
    });
  }
};

