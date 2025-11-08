const Portfolio = require('../models/Portfolio');

// @desc    Récupérer toutes les images du portfolio
// @route   GET /api/portfolio
// @access  Public
exports.getAllPortfolioItems = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';

    const portfolioItems = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: portfolioItems.length,
      data: portfolioItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer une image du portfolio par ID
// @route   GET /api/portfolio/:id
// @access  Public
exports.getPortfolioItemById = async (req, res, next) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Image de portfolio non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: portfolioItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer une nouvelle image de portfolio
// @route   POST /api/portfolio
// @access  Private/Admin
exports.createPortfolioItem = async (req, res, next) => {
  try {
    const portfolioItem = await Portfolio.create(req.body);

    res.status(201).json({
      success: true,
      data: portfolioItem,
      message: 'Image ajoutée au portfolio avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour une image du portfolio
// @route   PUT /api/portfolio/:id
// @access  Private/Admin
exports.updatePortfolioItem = async (req, res, next) => {
  try {
    const portfolioItem = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Image de portfolio non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: portfolioItem,
      message: 'Image du portfolio mise à jour avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une image du portfolio
// @route   DELETE /api/portfolio/:id
// @access  Private/Admin
exports.deletePortfolioItem = async (req, res, next) => {
  try {
    const portfolioItem = await Portfolio.findByIdAndDelete(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Image de portfolio non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Image supprimée du portfolio avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer les catégories disponibles
// @route   GET /api/portfolio/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = ['nouveau-ne', 'bebe', 'grossesse', 'famille', 'iris'];
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

