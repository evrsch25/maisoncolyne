const Config = require('../models/Config');

// @desc    Obtenir la configuration du site
// @route   GET /api/config
// @access  Public
exports.getConfig = async (req, res, next) => {
  try {
    const config = await Config.getConfig();

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour la configuration
// @route   PUT /api/config
// @access  Private/Admin
exports.updateConfig = async (req, res, next) => {
  try {
    let config = await Config.findOne();

    if (!config) {
      config = await Config.create(req.body);
    } else {
      config = await Config.findByIdAndUpdate(
        config._id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    }

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter un témoignage
// @route   POST /api/config/testimonials
// @access  Private/Admin
exports.addTestimonial = async (req, res, next) => {
  try {
    const config = await Config.getConfig();
    
    config.testimonials.push(req.body);
    await config.save();

    res.status(201).json({
      success: true,
      data: config
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un témoignage
// @route   DELETE /api/config/testimonials/:id
// @access  Private/Admin
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const config = await Config.getConfig();
    
    config.testimonials = config.testimonials.filter(
      t => t._id.toString() !== req.params.id
    );
    await config.save();

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    next(error);
  }
};

