const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const EMAIL_TO = process.env.EMAIL_TO || 'maisoncolyne@gmail.com';
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@maisoncolyne.com';

const createTransporter = () => {
  try {
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }

    if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }

    console.warn('⚠️  Aucun service email configuré. Utilisation du transport JSON (les emails seront loggés en console).');
    return nodemailer.createTransport({ jsonTransport: true });
  } catch (error) {
    console.error('❌ Impossible de créer le transporteur d\'email:', error.message);
    return nodemailer.createTransport({ jsonTransport: true });
  }
};

const transporter = createTransporter();

// @desc    Envoyer un message de contact
// @route   POST /api/contact
// @access  Public
exports.sendContactMessage = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, serviceType, preferredDate, message } = req.body;

    // Sauvegarder le message dans la base de données
    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      serviceType,
      preferredDate,
      message
    });

    // Préparer l'email
    const mailOptions = {
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `Nouveau message de ${firstName} ${lastName} - ${serviceType}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone || 'Non fourni'}</p>
        <p><strong>Type de séance:</strong> ${serviceType}</p>
        <p><strong>Date souhaitée:</strong> ${preferredDate ? new Date(preferredDate).toLocaleDateString('fr-FR') : 'Non précisée'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>Message envoyé depuis le site Colyne Photographe</small></p>
      `
    };

    // Email de confirmation au client
    const confirmationMailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Confirmation de réception - Colyne Photographe',
      html: `
        <h2>Merci pour votre message !</h2>
        <p>Bonjour ${firstName},</p>
        <p>J'ai bien reçu votre demande concernant une <strong>${serviceType}</strong>.</p>
        <p>Je vous répondrai dans les plus brefs délais, généralement sous 24-48h.</p>
        <p>À très bientôt,</p>
        <p><strong>Colyne</strong><br>
        Photographe professionnelle à Oye-plage</p>
        <hr>
        <p><small>Pour toute urgence, vous pouvez me joindre au ${process.env.CONTACT_PHONE || '+33 6 12 34 56 78'}</small></p>
      `
    };

    // Envoyer les emails
    try {
      await transporter.sendMail(mailOptions);
      await transporter.sendMail(confirmationMailOptions);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // On continue même si l'email échoue, le message est sauvegardé
    }

    res.status(201).json({
      success: true,
      message: 'Votre message a été envoyé avec succès',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir tous les messages de contact
// @route   GET /api/contact
// @access  Private/Admin
exports.getContactMessages = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const messages = await Contact.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un message spécifique
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContactMessage = async (req, res, next) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    // Marquer comme lu
    if (message.status === 'nouveau') {
      message.status = 'lu';
      await message.save();
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le statut d'un message
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
exports.updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContactMessage = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

