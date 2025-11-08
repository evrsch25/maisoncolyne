const MediaStatic = require('../models/MediaStatic');

// @desc    Récupérer tous les médias statiques
// @route   GET /api/media-static
// @access  Public
exports.getAllMediaStatic = async (req, res, next) => {
  try {
    const { page, location, active } = req.query;
    
    let filter = {};
    if (page) filter.page = page;
    if (location) filter.location = location;
    if (active !== undefined) filter.active = active === 'true';

    const mediaStatic = await MediaStatic.find(filter).sort({ page: 1, location: 1, order: 1 });

    res.status(200).json({
      success: true,
      count: mediaStatic.length,
      data: mediaStatic
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer un média statique par ID
// @route   GET /api/media-static/:id
// @access  Public
exports.getMediaStaticById = async (req, res, next) => {
  try {
    const mediaStatic = await MediaStatic.findById(req.params.id);

    if (!mediaStatic) {
      return res.status(404).json({
        success: false,
        message: 'Média statique non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: mediaStatic
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer les médias statiques par page et location
// @route   GET /api/media-static/page/:page/:location
// @access  Public
exports.getMediaStaticByPageLocation = async (req, res, next) => {
  try {
    const { page, location } = req.params;
    const mediaStatic = await MediaStatic.find({ page, location }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: mediaStatic.length,
      data: mediaStatic
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un nouveau média statique
// @route   POST /api/media-static
// @access  Private/Admin
exports.createMediaStatic = async (req, res, next) => {
  try {
    console.log('📝 Données reçues pour créer un média:', JSON.stringify(req.body, null, 2));
    const mediaStatic = await MediaStatic.create(req.body);
    console.log('✅ Média créé avec succès:', mediaStatic._id);

    res.status(201).json({
      success: true,
      data: mediaStatic,
      message: 'Média statique créé avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création du média:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    next(error);
  }
};

// @desc    Mettre à jour un média statique
// @route   PUT /api/media-static/:id
// @access  Private/Admin
exports.updateMediaStatic = async (req, res, next) => {
  try {
    const mediaStatic = await MediaStatic.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!mediaStatic) {
      return res.status(404).json({
        success: false,
        message: 'Média statique non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: mediaStatic,
      message: 'Média statique mis à jour avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un média statique
// @route   DELETE /api/media-static/:id
// @access  Private/Admin
exports.deleteMediaStatic = async (req, res, next) => {
  try {
    const mediaStatic = await MediaStatic.findByIdAndDelete(req.params.id);

    if (!mediaStatic) {
      return res.status(404).json({
        success: false,
        message: 'Média statique non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Média statique supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};


