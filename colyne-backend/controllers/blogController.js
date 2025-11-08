const BlogPost = require('../models/BlogPost');

// @desc    Obtenir tous les articles
// @route   GET /api/blog
// @access  Public
exports.getBlogPosts = async (req, res, next) => {
  try {
    const { category, featured, search, limit } = req.query;
    let query = { published: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured) {
      query.featured = featured === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    let posts = BlogPost.find(query).sort({ featured: -1, createdAt: -1 });

    if (limit) {
      posts = posts.limit(parseInt(limit));
    }

    const blogPosts = await posts;

    res.status(200).json({
      success: true,
      count: blogPosts.length,
      data: blogPosts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un article par slug
// @route   GET /api/blog/:slug
// @access  Public
exports.getBlogPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    // Incrémenter les vues
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un nouvel article
// @route   POST /api/blog
// @access  Private/Admin
exports.createBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.create(req.body);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un article
// @route   PUT /api/blog/:id
// @access  Private/Admin
exports.updateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un article
// @route   DELETE /api/blog/:id
// @access  Private/Admin
exports.deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Article supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload image pour un article
// @route   POST /api/blog/:id/image
// @access  Private/Admin
exports.uploadBlogImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez sélectionner une image'
      });
    }

    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    // Mettre à jour le chemin de l'image
    post.featured_image = `/uploads/${req.file.filename}`;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

