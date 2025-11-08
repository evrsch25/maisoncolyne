# 📸 Colyne Photographe - Site Web Complet

Site web professionnel pour **Colyne Photographe** à Oye-plage.

## 📂 Structure du Projet

```
C:\wamp64\www\maisoncolynee\
├── colyne\                      # 🎨 FRONTEND (React + Vite + Tailwind)
│   ├── src\                     # Code source React
│   ├── public\                  # Fichiers statiques
│   └── package.json
│
└── colyne-backend\              # ⚙️ BACKEND (Node.js + Express + MongoDB)
    ├── config\                  # Configuration (MongoDB)
    ├── controllers\             # Logique métier
    ├── middleware\              # Authentification, upload, etc.
    ├── models\                  # Schémas Mongoose
    ├── routes\                  # Routes API
    ├── utils\                   # Scripts utilitaires
    ├── .env                     # Variables d'environnement ⚠️
    └── server.js                # Point d'entrée backend
```

## 🚀 Démarrage Rapide

### 1️⃣ Démarrer le Frontend (React)

```bash
cd C:\wamp64\www\maisoncolynee\colyne
npm run dev
```

Le frontend sera accessible sur : `http://localhost:5173`

**Frontend Status** : ✅ Complètement fonctionnel
- Toutes les pages publiques sont créées
- Interface admin opérationnelle (LocalStorage pour l'instant)
- Design élégant avec Tailwind CSS (palette beige/marron)

### 2️⃣ Démarrer le Backend (Node.js/Express)

⚠️ **IMPORTANT** : Avant de démarrer le backend, vous DEVEZ configurer MongoDB !

#### Étape A : Configurer MongoDB Atlas

1. **Ouvrir le fichier** `colyne-backend\.env`
2. **Remplacer** la ligne `MONGODB_URI` par votre vraie URL MongoDB Atlas

**Besoin d'aide ?** Consultez `colyne-backend\GUIDE_DEMARRAGE.md`

#### Étape B : Démarrer le serveur

```bash
cd C:\wamp64\www\maisoncolynee\colyne-backend
npm run dev
```

Le backend sera accessible sur : `http://localhost:5000`

#### Étape C : Créer un utilisateur admin

```bash
cd C:\wamp64\www\maisoncolynee\colyne-backend
npm run create-admin
```

## 📋 État d'Avancement du Projet

### ✅ Frontend (100% Fonctionnel)

#### Pages Publiques
- ✅ Accueil avec carrousel et témoignages
- ✅ Portfolio avec galerie d'images
- ✅ Prestations avec détails
- ✅ À propos
- ✅ Blog avec recherche
- ✅ Contact avec formulaire
- ✅ Mentions légales, CGV, Politique de confidentialité

#### Interface Admin
- ✅ Page de connexion
- ✅ Dashboard
- ✅ Gestion des prestations (CRUD)
- ✅ Gestion du blog (CRUD)
- ✅ Gestion des pages

#### Composants
- ✅ Header avec menu responsive
- ✅ Footer
- ✅ Cartes de services
- ✅ Cartes de blog
- ✅ Carrousel d'images
- ✅ Formulaire de contact

#### Context API
- ✅ DataContext pour les données
- ✅ AuthContext pour l'authentification

### ✅ Backend (100% Créé - Nécessite Configuration MongoDB)

#### API REST Complète
- ✅ Authentification JWT
- ✅ CRUD Prestations
- ✅ CRUD Blog
- ✅ CRUD Configuration
- ✅ Formulaire de contact avec emails

#### Modèles Mongoose
- ✅ User (utilisateurs admin)
- ✅ Prestation
- ✅ BlogPost
- ✅ Config
- ✅ Contact

#### Sécurité
- ✅ Helmet (headers HTTP sécurisés)
- ✅ CORS configuré
- ✅ Rate limiting (100 req/10min)
- ✅ JWT pour l'authentification
- ✅ Bcrypt pour les mots de passe

#### Upload
- ✅ Multer configuré pour les images
- ✅ Limite de taille : 10 MB

## 🔄 Prochaines Étapes

### Phase 1 : Connexion Backend (En cours)
1. ⚠️ Configurer l'URL MongoDB dans `colyne-backend\.env`
2. ⚠️ Démarrer le backend
3. ⚠️ Créer un utilisateur admin
4. ⚠️ Tester les endpoints API

### Phase 2 : Connexion Frontend-Backend
1. ⏳ Modifier `DataContext.jsx` pour utiliser axios
2. ⏳ Modifier `AuthContext.jsx` pour l'API d'authentification
3. ⏳ Remplacer les données JSON par des appels API

### Phase 3 : Migration des Données
1. ⏳ Créer un script de seed
2. ⏳ Importer les données de `src/data/*.json` vers MongoDB

### Phase 4 : Tests & Déploiement
1. ⏳ Tester toutes les fonctionnalités
2. ⏳ Configurer l'envoi d'emails (Gmail SMTP)
3. ⏳ Upload d'images test
4. ⏳ Préparer pour le déploiement

## 🛠️ Technologies Utilisées

### Frontend
- **React** 19.1.1
- **Vite** 7.1.7 (Build tool ultra-rapide)
- **Tailwind CSS** 3.4.1 (Design system)
- **React Router** 7.9.4 (Navigation)
- **Framer Motion** 12.23.24 (Animations)
- **Axios** 1.13.1 (Requêtes HTTP)
- **Swiper** 12.0.3 (Carrousel)
- **Lucide React** (Icônes)

### Backend
- **Node.js** v24+
- **Express** 5.1.0
- **MongoDB** avec Mongoose 8.19.2
- **JWT** (jsonwebtoken 9.0.2)
- **Bcrypt** (bcryptjs 3.0.2)
- **Multer** 2.0.2 (Upload)
- **Nodemailer** 7.0.10 (Emails)
- **Helmet** 8.1.0 (Sécurité)
- **CORS** 2.8.5

## 📖 Documentation

- **Frontend** : `colyne\README.md`
- **Backend** : `colyne-backend\README.md`
- **Guide Démarrage Backend** : `colyne-backend\GUIDE_DEMARRAGE.md`

## 🔑 Identifiants par Défaut

### Frontend (Mode démo - LocalStorage)
- Email : `admin` (ou n'importe quel email)
- Mot de passe : `colyne2025`
- URL : `http://localhost:5173/admin/login`

### Backend (Après création avec `npm run create-admin`)
- Email : `admin@colynephotographe.fr`
- Mot de passe : `colyne2025`
- **⚠️ À changer après la première connexion !**

## 🎨 Design

- **Palette de couleurs** : Beige et marron (tons naturels, élégants)
- **Style** : Minimaliste, professionnel, féminin
- **Responsive** : 100% mobile-friendly
- **Accessibilité** : Contrastes optimisés

## 📞 Support

Pour toute question ou assistance, consultez les fichiers README dans chaque dossier.

---

**🎯 ACTION IMMÉDIATE : Configurez MongoDB dans `colyne-backend\.env` pour démarrer le backend !**

Consultez : `colyne-backend\GUIDE_DEMARRAGE.md`

