# 🖼️ Colyne Photographe - Backend API

API REST complète pour le site web de Colyne Photographe, développée avec Node.js, Express et MongoDB.

## 🚀 Technologies

- **Node.js** & **Express** - Serveur et API
- **MongoDB** & **Mongoose** - Base de données
- **JWT** - Authentification
- **Multer** - Upload de fichiers
- **Nodemailer** - Envoi d'emails
- **Helmet** - Sécurité
- **Express Rate Limit** - Protection contre les abus

## 📦 Installation

### 1. Installer les dépendances

\`\`\`bash
npm install
\`\`\`

### 2. Configurer les variables d'environnement

Créez un fichier \`.env\` à la racine du projet en vous basant sur \`.env.example\` :

\`\`\`bash
cp .env.example .env
\`\`\`

Puis remplissez les variables :

\`\`\`env
PORT=5000
NODE_ENV=development

# MongoDB Atlas (voir instructions ci-dessous)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/colyne-photographe

# JWT Secret (générez une clé sécurisée)
JWT_SECRET=votre_cle_secrete_tres_longue_et_complexe
JWT_EXPIRE=7d

# Email (Gmail par exemple)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre.email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application
EMAIL_FROM=Colyne Photographe <contact@colynephotographe.fr>
EMAIL_TO=contact@colynephotographe.fr

# Frontend URL
CLIENT_URL=http://localhost:5173
\`\`\`

### 3. Lancer le serveur

**Mode développement (avec rechargement automatique) :**
\`\`\`bash
npm run dev
\`\`\`

**Mode production :**
\`\`\`bash
npm start
\`\`\`

Le serveur sera accessible sur : \`http://localhost:5000\`

## 🗄️ Configurer MongoDB Atlas (Base de Données)

### Étape 1 : Créer un compte MongoDB Atlas (GRATUIT)

1. Allez sur : **https://www.mongodb.com/cloud/atlas/register**
2. Créez un compte gratuit (avec Google ou email)
3. Choisissez le plan **M0 (FREE)** - 512 MB gratuit

### Étape 2 : Créer un cluster

1. Cliquez sur **"Build a Database"**
2. Sélectionnez **M0 FREE**
3. Choisissez une région proche (ex: **Paris** ou **Frankfurt**)
4. Nommez votre cluster (ex: **Cluster0**)
5. Cliquez sur **"Create Deployment"**

### Étape 3 : Créer un utilisateur

1. Username : \`colyneadmin\` (ou ce que vous voulez)
2. Password : Générez un mot de passe sécurisé
3. **⚠️ SAUVEGARDEZ CE MOT DE PASSE !**
4. Cliquez sur **"Create Database User"**

### Étape 4 : Autoriser l'accès réseau

1. Cliquez sur **"Add IP Address"**
2. Sélectionnez **"Allow Access from Anywhere"** (0.0.0.0/0)
3. Cliquez sur **"Add Entry"**
4. Cliquez sur **"Finish and Close"**

### Étape 5 : Obtenir l'URL de connexion

1. Cliquez sur **"Connect"** sur votre cluster
2. Choisissez **"Connect your application"**
3. Sélectionnez **Driver: Node.js** et **Version: 5.5 or later**
4. Copiez la chaîne de connexion qui ressemble à :

\`\`\`
mongodb+srv://colyneadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
\`\`\`

5. **Remplacez \`<password>\` par votre mot de passe**
6. Ajoutez le nom de la base de données : \`/colyne-photographe\` avant le \`?\`

**URL finale exemple :**
\`\`\`
mongodb+srv://colyneadmin:VotreMotDePasse@cluster0.xxxxx.mongodb.net/colyne-photographe?retryWrites=true&w=majority
\`\`\`

7. **Collez cette URL dans votre fichier \`.env\`** à la variable \`MONGODB_URI\`

## 👤 Créer un Utilisateur Admin

Pour pouvoir vous connecter à l'espace admin, vous devez créer un utilisateur :

### Option 1 : Via l'API (recommandé)

Une fois le serveur lancé, utilisez un outil comme **Postman** ou **Thunder Client** :

**POST** \`http://localhost:5000/api/auth/register\`

Body (JSON) :
\`\`\`json
{
  "username": "admin",
  "email": "admin@colynephotographe.fr",
  "password": "colyne2025",
  "role": "admin"
}
\`\`\`

### Option 2 : Créer un script

Créez un fichier \`utils/createAdmin.js\` et exécutez-le une fois.

## 📡 Endpoints API

### Authentification
- \`POST /api/auth/login\` - Connexion
- \`POST /api/auth/register\` - Inscription (admin)
- \`GET /api/auth/me\` - Profil utilisateur
- \`PUT /api/auth/updatepassword\` - Modifier mot de passe

### Prestations
- \`GET /api/prestations\` - Liste des prestations
- \`GET /api/prestations/:slug\` - Détail par slug
- \`POST /api/prestations\` - Créer (admin)
- \`PUT /api/prestations/id/:id\` - Modifier (admin)
- \`DELETE /api/prestations/id/:id\` - Supprimer (admin)
- \`POST /api/prestations/:id/image\` - Upload image (admin)

### Blog
- \`GET /api/blog\` - Liste des articles
- \`GET /api/blog/:slug\` - Détail par slug
- \`POST /api/blog\` - Créer (admin)
- \`PUT /api/blog/id/:id\` - Modifier (admin)
- \`DELETE /api/blog/id/:id\` - Supprimer (admin)
- \`POST /api/blog/:id/image\` - Upload image (admin)

### Configuration
- \`GET /api/config\` - Obtenir config
- \`PUT /api/config\` - Modifier config (admin)
- \`POST /api/config/testimonials\` - Ajouter témoignage (admin)
- \`DELETE /api/config/testimonials/:id\` - Supprimer témoignage (admin)

### Contact
- \`POST /api/contact\` - Envoyer message
- \`GET /api/contact\` - Liste messages (admin)
- \`GET /api/contact/:id\` - Détail message (admin)
- \`PUT /api/contact/:id/status\` - Modifier statut (admin)
- \`DELETE /api/contact/:id\` - Supprimer message (admin)

## 📁 Structure du Projet

\`\`\`
colyne-backend/
├── config/
│   └── database.js          # Configuration MongoDB
├── controllers/             # Logique métier
│   ├── authController.js
│   ├── prestationController.js
│   ├── blogController.js
│   ├── configController.js
│   └── contactController.js
├── middleware/              # Middlewares Express
│   ├── auth.js              # JWT & Authorization
│   ├── upload.js            # Multer upload
│   └── errorHandler.js      # Gestion erreurs
├── models/                  # Schémas Mongoose
│   ├── User.js
│   ├── Prestation.js
│   ├── BlogPost.js
│   ├── Config.js
│   └── Contact.js
├── routes/                  # Routes API
│   ├── auth.js
│   ├── prestations.js
│   ├── blog.js
│   ├── config.js
│   └── contact.js
├── uploads/                 # Fichiers uploadés
├── utils/                   # Utilitaires
├── .env                     # Variables environnement
├── .env.example            # Exemple de configuration
├── .gitignore
├── package.json
├── server.js               # Point d'entrée
└── README.md
\`\`\`

## 🔒 Sécurité

- ✅ Authentification JWT
- ✅ Mots de passe hashés (bcrypt)
- ✅ CORS configuré
- ✅ Helmet (sécurité headers)
- ✅ Rate limiting
- ✅ Validation des données
- ✅ Protection des routes admin

## 📧 Configuration Email (Gmail)

Pour utiliser Gmail pour l'envoi d'emails :

1. Allez dans votre compte Google
2. Activez la **validation en deux étapes**
3. Générez un **mot de passe d'application** :
   - Google Account > Sécurité > Validation en 2 étapes > Mots de passe d'application
4. Utilisez ce mot de passe dans \`EMAIL_PASSWORD\`

## 🚢 Déploiement

### Render.com (Recommandé - Gratuit)

1. Créez un compte sur render.com
2. Nouveau > Web Service
3. Connectez votre repo GitHub
4. Build Command : \`npm install\`
5. Start Command : \`npm start\`
6. Ajoutez vos variables d'environnement
7. Déployez !

### Railway.app

1. Créez un compte sur railway.app
2. New Project > Deploy from GitHub
3. Ajoutez vos variables d'environnement
4. Déployez !

## 🆘 Support

Pour toute question ou problème, contactez : contact@colynephotographe.fr

---

Développé avec ❤️ pour Colyne Photographe
\`\`\`
