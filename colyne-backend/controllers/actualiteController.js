const Actualite = require('../models/Actualite');

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

// @desc    Récupérer les actualités actives (< 2 semaines) — publique
// @route   GET /api/actualites
// @access  Public
exports.getActualites = async (req, res, next) => {
  try {
    const { category } = req.query;

    const filter = {
      active: true,
      createdAt: { $gte: new Date(Date.now() - TWO_WEEKS_MS) }
    };
    if (category) filter.category = category;

    const actualites = await Actualite.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: actualites.length, data: actualites });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer toutes les actualités (admin)
// @route   GET /api/actualites/admin
// @access  Private/Admin
exports.getAllActualites = async (req, res, next) => {
  try {
    const actualites = await Actualite.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: actualites.length, data: actualites });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer une actualité
// @route   POST /api/actualites
// @access  Private/Admin
exports.createActualite = async (req, res, next) => {
  try {
    const actualite = await Actualite.create(req.body);
    res.status(201).json({ success: true, data: actualite, message: 'Actualité créée avec succès' });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour une actualité
// @route   PUT /api/actualites/:id
// @access  Private/Admin
exports.updateActualite = async (req, res, next) => {
  try {
    const actualite = await Actualite.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!actualite) {
      return res.status(404).json({ success: false, message: 'Actualité non trouvée' });
    }
    res.status(200).json({ success: true, data: actualite, message: 'Actualité mise à jour' });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une actualité
// @route   DELETE /api/actualites/:id
// @access  Private/Admin
exports.deleteActualite = async (req, res, next) => {
  try {
    const actualite = await Actualite.findByIdAndDelete(req.params.id);
    if (!actualite) {
      return res.status(404).json({ success: false, message: 'Actualité non trouvée' });
    }
    res.status(200).json({ success: true, message: 'Actualité supprimée' });
  } catch (error) {
    next(error);
  }
};
