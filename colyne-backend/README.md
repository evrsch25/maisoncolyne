# 🚀 Colyne Photographe - Backend API

Backend Node.js/Express pour le site web de Colyne Photographe.

## 📋 Technologies

- **Node.js** v24+
- **Express** v5
- **MongoDB** avec Mongoose
- **JWT** pour l'authentification
- **Multer** pour l'upload d'images
- **Nodemailer** pour l'envoi d'emails

## 🔧 Installation

1. **Installer les dépendances** :
```bash
npm install
```

2. **Configurer les variables d'environnement** :
Créer un fichier `.env` à la racine (copier depuis `.env.example`) et remplir avec vos informations.

## 🗄️ Configuration MongoDB Atlas

### 1. Créer un compte MongoDB Atlas
- Aller sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Créer un compte gratuit (M0)

### 2. Créer un cluster
- Cliquer sur "Build a Database"
- Choisir "M0 FREE" (gratuit)
- Sélectionner une région proche (ex: Europe - Frankfurt)
- Cliquer sur "Create"

### 3. Créer un utilisateur de base de données
- Aller dans "Database Access" (menu gauche)
- Cliquer sur "Add New Database User"
- Méthode : **Password**
- Username : choisir un nom (ex: `colyneadmin`)
- Password : générer un mot de passe fort **SANS caractères spéciaux** (@, #, $, etc.)
  - Ou encodez-les : @ = %40, # = %23, $ = %24
- Database User Privileges : **Read and write to any database**
- Cliquer sur "Add User"

### 4. Autoriser l'accès depuis n'importe où
- Aller dans "Network Access" (menu gauche)
- Cliquer sur "Add IP Address"
- Cliquer sur "Allow Access from Anywhere" (ou ajouter `0.0.0.0/0`)
- Cliquer sur "Confirm"

### 5. Obtenir l'URL de connexion
- Retourner dans "Database" (menu gauche)
- Cliquer sur "Connect" sur votre cluster
- Choisir "Drivers"
- Copier l'URL de connexion
- Remplacer `<password>` par votre mot de passe
- Remplacer `<database>` par `colyne-photographe`

Exemple d'URL :
```
mongodb+srv://colyneadmin:MonMotDePasse123@cluster0.abcde.mongodb.net/colyne-photographe?retryWrites=true&w=majority
```

⚠️ **IMPORTANT** : Si votre mot de passe contient des caractères spéciaux, encodez-les !

### 6. Mettre l'URL dans le fichier .env
Copier l'URL dans le fichier `.env` :
```env
MONGODB_URI=mongodb+srv://colyneadmin:MonMotDePasse123@cluster0.abcde.mongodb.net/colyne-photographe?retryWrites=true&w=majority
```

## 🎯 Démarrage

### Mode développement (avec nodemon)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarrera sur `http://localhost:5000`

## 📡 Endpoints API

### Authentification (`/api/auth`)
- `POST /api/auth/register` - Créer un utilisateur admin
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Obtenir l'utilisateur connecté

### Prestations (`/api/prestations`)
- `GET /api/prestations` - Liste des prestations
- `GET /api/prestations/:id` - Détail d'une prestation
- `POST /api/prestations` - Créer une prestation (Admin)
- `PUT /api/prestations/:id` - Modifier une prestation (Admin)
- `DELETE /api/prestations/:id` - Supprimer une prestation (Admin)

### Blog (`/api/blog`)
- `GET /api/blog` - Liste des articles
- `GET /api/blog/:id` - Détail d'un article
- `POST /api/blog` - Créer un article (Admin)
- `PUT /api/blog/:id` - Modifier un article (Admin)
- `DELETE /api/blog/:id` - Supprimer un article (Admin)

### Configuration (`/api/config`)
- `GET /api/config` - Obtenir la configuration du site
- `PUT /api/config` - Modifier la configuration (Admin)

### Contact (`/api/contact`)
- `POST /api/contact` - Envoyer un message de contact

## 👤 Créer un utilisateur admin

Utiliser Postman, Thunder Client ou curl :

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@colynephotographe.fr",
  "password": "colyne2025"
}
```

## 🔒 Authentification

Les routes protégées nécessitent un token JWT dans le header :
```
Authorization: Bearer <votre_token>
```

## 📝 Notes

- Les images uploadées sont stockées dans le dossier `uploads/`
- Les emails utilisent Gmail SMTP (configurer un mot de passe d'application)
- Rate limiting : 100 requêtes / 10 minutes par IP

## 🐛 Débogage

Si le serveur ne démarre pas :
1. Vérifier que toutes les variables du `.env` sont renseignées
2. Vérifier l'URL MongoDB (caractères spéciaux encodés)
3. Vérifier que MongoDB Atlas autorise votre IP
4. Regarder les logs d'erreur dans la console

## 📧 Support

Pour toute question : contact@colynephotographe.fr

