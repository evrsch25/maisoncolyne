# 🚀 Guide de Démarrage Rapide - Backend Colyne Photographe

## ✅ Ce qui a été fait

1. ✅ Tous les fichiers backend ont été déplacés de `colyne/` vers `colyne-backend/`
2. ✅ Le dossier `colyne/` ne contient plus que le frontend React/Vite
3. ✅ Fichier `.env` créé dans `colyne-backend/`
4. ✅ Fichier `.env.example` créé
5. ✅ Fichier `.gitignore` créé
6. ✅ README.md créé avec documentation complète
7. ✅ Script `utils/createAdmin.js` créé pour créer un utilisateur admin
8. ✅ `database.js` corrigé (suppression des options dépréciées Mongoose)

## 🔥 PROCHAINES ÉTAPES (IMPORTANT)

### Étape 1 : Configurer MongoDB Atlas ⚠️

Le serveur ne peut pas démarrer tant que l'URL MongoDB n'est pas configurée !

1. **Ouvrir le fichier** `colyne-backend\.env`

2. **Remplacer la ligne** :
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/colyne-photographe?retryWrites=true&w=majority
```

3. **Par votre vraie URL MongoDB Atlas**

#### Comment obtenir l'URL MongoDB Atlas ?

##### Option A : Vous avez déjà un cluster MongoDB Atlas
1. Aller sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. Se connecter
3. Cliquer sur "Connect" sur votre cluster
4. Choisir "Connect your application"
5. Copier l'URL de connexion
6. Remplacer `<password>` par votre mot de passe
7. Remplacer `<database>` par `colyne-photographe`

##### Option B : Vous n'avez pas encore de cluster
Suivre le guide complet dans `README.md` section "Configuration MongoDB Atlas"

**⚠️ ATTENTION aux caractères spéciaux dans le mot de passe !**

Si votre mot de passe contient : `@` `#` `$` `%` etc.
Encodez-les :
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

**Exemple de bonne URL** :
```env
MONGODB_URI=mongodb+srv://colyneadmin:MonMotDePasse123@cluster0.abcde.mongodb.net/colyne-photographe?retryWrites=true&w=majority
```

### Étape 2 : Démarrer le Backend

Une fois l'URL MongoDB configurée dans `.env` :

```bash
cd C:\wamp64\www\maisoncolynee\colyne-backend
npm run dev
```

**Si tout est OK, vous verrez** :
```
✅ MongoDB connecté: cluster0.xxxxx.mongodb.net
📦 Base de données: colyne-photographe
🚀 Serveur démarré sur le port 5000 en mode development
📍 URL: http://localhost:5000
🌐 Frontend URL: http://localhost:5173
```

### Étape 3 : Créer un Utilisateur Admin

Une fois le serveur démarré avec succès, **dans un nouveau terminal** :

```bash
cd C:\wamp64\www\maisoncolynee\colyne-backend
npm run create-admin
```

Cela créera un utilisateur :
- Email : `admin@colynephotographe.fr`
- Mot de passe : `colyne2025`

### Étape 4 : Tester l'API

Ouvrir un navigateur et aller sur :
```
http://localhost:5000
```

Vous devriez voir :
```json
{
  "success": true,
  "message": "API Colyne Photographe - Backend opérationnel ✅",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "prestations": "/api/prestations",
    "blog": "/api/blog",
    "config": "/api/config",
    "contact": "/api/contact"
  }
}
```

## 🐛 Dépannage

### Le serveur ne démarre pas ?

1. **Vérifier le fichier `.env`** :
   - L'URL MongoDB est-elle correcte ?
   - Les caractères spéciaux sont-ils encodés ?

2. **Vérifier MongoDB Atlas** :
   - Votre IP est-elle autorisée ? (Network Access → Add IP → 0.0.0.0/0)
   - L'utilisateur de base de données existe-t-il ?
   - Le mot de passe est-il correct ?

3. **Regarder les erreurs dans la console**

### Erreur "MongoServerError: bad auth"
→ Le nom d'utilisateur ou mot de passe MongoDB est incorrect

### Erreur "ECONNREFUSED"
→ L'URL MongoDB est incorrecte ou le cluster n'existe pas

### Erreur "getaddrinfo ENOTFOUND"
→ L'URL MongoDB contient une erreur de syntaxe

## 📁 Structure du Projet

```
C:\wamp64\www\maisoncolynee\
├── colyne\                      # ✅ FRONTEND (React/Vite uniquement)
│   ├── src\
│   ├── public\
│   └── package.json
│
└── colyne-backend\              # ✅ BACKEND (Node.js/Express)
    ├── config\
    │   └── database.js
    ├── controllers\             # 5 fichiers
    ├── middleware\              # 3 fichiers
    ├── models\                  # 5 fichiers
    ├── routes\                  # 5 fichiers
    ├── utils\
    │   └── createAdmin.js       # Script pour créer admin
    ├── uploads\                 # Dossier pour les images
    ├── .env                     # ⚠️ À CONFIGURER
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── server.js
    └── README.md
```

## 📞 Besoin d'Aide ?

Consultez le fichier `README.md` pour la documentation complète !

---

**Une fois le backend démarré, passez à l'étape suivante : connecter le frontend au backend !** 🎉

