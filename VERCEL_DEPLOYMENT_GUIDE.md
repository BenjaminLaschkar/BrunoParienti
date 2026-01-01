# Guide de Déploiement Vercel - Application Express/EJS

## Architecture du Projet

Ce projet est un site portfolio pour acteur construit avec :
- **Backend**: Node.js + Express
- **Template Engine**: EJS
- **Styling**: Tailwind CSS
- **Multi-langue**: FR, EN, HE (Français, Anglais, Hébreu)
- **Hosting**: Vercel (Serverless Functions)

## Structure des Fichiers Clés

```
brunosite/
├── api/
│   └── index.js          # Point d'entrée Vercel (serverless function)
├── server.js             # Application Express principale
├── vercel.json           # Configuration Vercel
├── package.json          # Dependencies et scripts
├── views/                # Templates EJS
├── locales/              # Fichiers de traduction (fr.json, en.json, he.json)
├── data/                 # Données JSON (credits.json, photos.json)
└── public/               # Assets statiques (CSS, images, JS)
```

## Problème Principal Résolu

**Symptôme**: Déploiement réussi sur Vercel mais erreur 404 sur toutes les routes.

**Cause**: Express.js est un serveur traditionnel qui écoute sur un port. Vercel utilise des **Serverless Functions** qui ne fonctionnent pas de la même manière.

## Solution Implémentée

### 1. Fichier `api/index.js` (CRITIQUE)

Ce fichier sert de **wrapper serverless** pour l'application Express :

```javascript
const app = require('../server');

// Vercel exporte la fonction comme handler
module.exports = app;
```

**Pourquoi ?** Vercel cherche automatiquement les fichiers dans le dossier `api/` et les transforme en serverless functions. Chaque fichier devient un endpoint.

### 2. Fichier `server.js` (MODIFIÉ)

**Modification critique** - Ne pas démarrer le serveur en production :

```javascript
// Démarrage serveur (seulement en local, pas sur Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

module.exports = app;  // IMPORTANT: Exporter l'app
```

**Pourquoi ?** 
- Sur Vercel, `app.listen()` ne doit PAS être appelé
- Vercel gère le serveur via sa propre infrastructure
- L'export de `app` est crucial pour `api/index.js`

### 3. Fichier `vercel.json`

Configuration minimaliste avec **rewrites** :

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index"
    }
  ]
}
```

**Explication** :
- Toutes les routes (`/(.*)`) sont redirigées vers `/api/index`
- `/api/index` correspond à `api/index.js`
- Cela permet à Express de gérer toutes les routes normalement

### 4. Fichier `package.json`

**Scripts de build** :

```json
{
  "scripts": {
    "dev": "concurrently \"npm run css:watch\" \"nodemon server.js\"",
    "start": "node server.js",
    "css:build": "tailwindcss -i ./public/css/input.css -o ./public/css/styles.css --minify",
    "vercel-build": "npm run css:build"
  }
}
```

**Dependencies critiques** (PAS devDependencies) :

```json
{
  "dependencies": {
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

**Pourquoi ?** 
- `vercel-build` est automatiquement exécuté par Vercel avant le déploiement
- Compile le CSS Tailwind en production
- Tailwind DOIT être dans `dependencies` (pas `devDependencies`) sinon Vercel ne l'installe pas

## Workflow de Déploiement

### Déploiement Automatique (Recommandé)

1. Pusher sur GitHub :
   ```bash
   git add .
   git commit -m "Description"
   git push
   ```

2. Vercel redéploie automatiquement (si connecté au repo GitHub)

### Déploiement Manuel

```bash
vercel --prod
```

## Pièges à Éviter

### ❌ NE PAS FAIRE

1. **Ne pas mettre Tailwind dans devDependencies**
   ```json
   // ❌ MAUVAIS
   "devDependencies": {
     "tailwindcss": "^3.4.1"
   }
   ```

2. **Ne pas utiliser l'ancien format vercel.json avec `builds`**
   ```json
   // ❌ OBSOLÈTE
   {
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/node"
       }
     ]
   }
   ```

3. **Ne pas appeler app.listen() en production**
   ```javascript
   // ❌ MAUVAIS
   app.listen(PORT, () => { ... });
   module.exports = app;
   ```

4. **Ne pas oublier d'exporter l'app dans server.js**
   ```javascript
   // ❌ MAUVAIS - Pas d'export
   app.listen(PORT, () => { ... });
   // Fin du fichier
   ```

### ✅ FAIRE

1. **Tailwind dans dependencies**
   ```json
   "dependencies": {
     "tailwindcss": "^3.4.1",
     "autoprefixer": "^10.4.16",
     "postcss": "^8.4.32"
   }
   ```

2. **Vercel.json minimaliste avec rewrites**
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/api/index"
       }
     ]
   }
   ```

3. **Condition sur app.listen()**
   ```javascript
   if (process.env.NODE_ENV !== 'production') {
     app.listen(PORT, () => { ... });
   }
   module.exports = app;
   ```

4. **Toujours exporter l'app**
   ```javascript
   module.exports = app;
   ```

## Debugging

### Erreur 404 sur toutes les routes

**Vérifier** :
1. Le fichier `api/index.js` existe et exporte `app`
2. `vercel.json` a le rewrite vers `/api/index`
3. `server.js` exporte `module.exports = app`
4. `server.js` ne fait PAS `app.listen()` en production

### CSS non chargé

**Vérifier** :
1. `vercel-build` script existe dans `package.json`
2. Tailwind est dans `dependencies` (pas `devDependencies`)
3. Le fichier `public/css/styles.css` est commité OU généré au build

### Erreur "Cannot find module"

**Vérifier** :
1. Tous les dossiers nécessaires sont commités (views, locales, data, public)
2. Les chemins dans `require()` sont corrects (relatifs ou absolus)
3. `.gitignore` ne bloque pas des fichiers importants

## Commandes Utiles

```bash
# Développement local
npm run dev

# Build CSS manuellement
npm run css:build

# Test serveur local
npm start

# Déployer sur Vercel (preview)
vercel

# Déployer en production
vercel --prod

# Voir les logs Vercel
vercel logs <deployment-url>
```

## Variables d'Environnement

Si vous avez besoin de variables d'environnement :

1. Ajouter dans le dashboard Vercel (Settings > Environment Variables)
2. OU créer un fichier `.env.local` (ignoré par Git)
3. Accéder via `process.env.VARIABLE_NAME`

## Architecture Serverless Expliquée

**Traditionnel (serveur toujours actif)** :
```
Requête → Port 3000 → Express App → Réponse
```

**Vercel Serverless** :
```
Requête → Vercel Edge → /api/index function → Express App → Réponse
                       (démarre à la demande)
```

**Avantages** :
- Scaling automatique
- Pas de gestion de serveur
- Gratuit jusqu'à un certain usage
- CDN global intégré

**Limitations** :
- Cold start (première requête peut être lente)
- Timeout de 10s (plan gratuit)
- Pas de WebSockets persistants

## Ressources

- [Vercel + Express Guide](https://vercel.com/guides/using-express-with-vercel)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Rewrites Documentation](https://vercel.com/docs/projects/project-configuration#rewrites)

---

**Date de création**: Janvier 2026  
**Testé avec**: Vercel CLI 50.1.3, Node.js 18+  
**Status**: ✅ Fonctionne en production sur https://brunosite.vercel.app
