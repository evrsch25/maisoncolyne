const Prestation = require('../models/Prestation');

// @desc    Obtenir toutes les prestations
// @route   GET /api/prestations
// @access  Public
exports.getPrestations = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (featured) {
      query.featured = featured === 'true';
    }

    const prestations = await Prestation.find(query).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: prestations.length,
      data: prestations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir une prestation par slug ou ID
// @route   GET /api/prestations/:id
// @access  Public
exports.getPrestationBySlug = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    const param = req.params.id;
    let prestation;

    // Vérifier si c'est un ObjectId MongoDB valide
    if (mongoose.Types.ObjectId.isValid(param) && param.length === 24) {
      prestation = await Prestation.findById(param);
    } else {
      // Sinon, chercher par slug
      prestation = await Prestation.findOne({ slug: param });
    }

    if (!prestation) {
      return res.status(404).json({
        success: false,
        message: 'Prestation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: prestation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer une nouvelle prestation
// @route   POST /api/prestations
// @access  Private/Admin
exports.createPrestation = async (req, res, next) => {
  try {
    const prestation = await Prestation.create(req.body);

    res.status(201).json({
      success: true,
      data: prestation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour une prestation
// @route   PUT /api/prestations/:id
// @access  Private/Admin
exports.updatePrestation = async (req, res, next) => {
  try {
    console.log('Updating prestation with ID:', req.params.id);
    console.log('Data received:', JSON.stringify(req.body, null, 2));
    
    // Vérifier si le slug existe déjà pour une autre prestation
    if (req.body.slug) {
      const existingPrestation = await Prestation.findOne({
        slug: req.body.slug,
        _id: { $ne: req.params.id }
      });
      
      if (existingPrestation) {
        console.log('Slug already exists for another prestation');
        return res.status(400).json({
          success: false,
          message: 'Une prestation avec ce titre existe déjà. Veuillez choisir un autre titre.'
        });
      }
    }
    
    const prestation = await Prestation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!prestation) {
      console.log('Prestation not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Prestation non trouvée'
      });
    }

    console.log('Prestation updated successfully');
    res.status(200).json({
      success: true,
      data: prestation
    });
  } catch (error) {
    console.error('Error updating prestation:', error);
    
    // Gérer l'erreur de clé dupliquée
    if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
      return res.status(400).json({
        success: false,
        message: 'Une prestation avec ce titre existe déjà. Veuillez choisir un autre titre.'
      });
    }
    
    next(error);
  }
};

// @desc    Supprimer une prestation
// @route   DELETE /api/prestations/:id
// @access  Private/Admin
exports.deletePrestation = async (req, res, next) => {
  try {
    const prestation = await Prestation.findByIdAndDelete(req.params.id);

    if (!prestation) {
      return res.status(404).json({
        success: false,
        message: 'Prestation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prestation supprimée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload image pour une prestation
// @route   POST /api/prestations/:id/image
// @access  Private/Admin
exports.uploadPrestationImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez sélectionner une image'
      });
    }

    const prestation = await Prestation.findById(req.params.id);

    if (!prestation) {
      return res.status(404).json({
        success: false,
        message: 'Prestation non trouvée'
      });
    }

    // Mettre à jour le chemin de l'image
    prestation.image = `/uploads/${req.file.filename}`;
    await prestation.save();

    res.status(200).json({
      success: true,
      data: prestation
    });
  } catch (error) {
    next(error);
  }
};

