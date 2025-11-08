const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

// Charger les variables d'environnement
dotenv.config();

const createAdmin = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@colynephotographe.fr' });
    if (existingAdmin) {
      console.log('⚠️  Un utilisateur admin existe déjà avec cet email');
      process.exit(0);
    }

    // Créer un nouvel utilisateur admin
    const adminData = {
      username: 'admin',
      email: 'admin@colynephotographe.fr',
      password: 'colyne2025', // Sera hashé automatiquement par le model
      role: 'admin'
    };

    const admin = await User.create(adminData);

    console.log('✅ Utilisateur admin créé avec succès !');
    console.log('👤 Username:', admin.username);
    console.log('📧 Email:', admin.email);
    console.log('🔑 Mot de passe: colyne2025');
    console.log('');
    console.log('⚠️  IMPORTANT : Changez ce mot de passe après la première connexion !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

createAdmin();

