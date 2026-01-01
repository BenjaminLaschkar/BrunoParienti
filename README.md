# 🎭 Bruno Parienti - Portfolio Professionnel

Portfolio one-page professionnel pour Bruno Parienti, acteur, performer et voice artist. Site bilingue (français/anglais), responsive, optimisé SEO et performant.

## ✨ Fonctionnalités

### 🌐 Multilingue

- Support complet français/anglais avec système i18n
- Switcher de langue dans le header
- Préférence sauvegardée en cookie

### 🎨 Design & UX

- Design sobre et élégant avec Tailwind CSS v3+
- Mode sombre/clair avec persistance
- Animations fluides et transitions soignées
- Navigation sticky avec scroll smooth
- Fully responsive (mobile-first)

### 📸 Galerie Photos

- Système de filtres par catégorie (Headshots, Portraits, Scènes, Backstage)
- Lightbox avec navigation clavier
- Images optimisées avec lazy loading
- Support srcset pour performance

### 🎬 Demo Reels

- Intégration YouTube/Vimeo
- Versions française et anglaise
- Design responsive

### 📋 Filmographie

- Liste détaillée des crédits avec filtres
- Liens IMDb
- Images de production
- Descriptions complètes

### 📧 Contact

- Formulaire de contact fonctionnel
- Informations agent et contact direct
- Liens réseaux sociaux (IMDb, Instagram, LinkedIn)

### 🔍 SEO & Performance

- Meta tags optimisés (title, description, keywords)
- Open Graph et Twitter Cards
- JSON-LD Schema (Person, BreadcrumbList)
- Sitemap.xml et robots.txt dynamiques
- Tags hreflang pour multilingue
- Compression gzip
- Headers de sécurité avec Helmet

### 🍪 RGPD

- Cookie banner conforme
- Gestion du consentement
- Liens mentions légales et politique de confidentialité

## 🚀 Installation

### Prérequis

- Node.js 18+ ([Télécharger ici](https://nodejs.org/))
- npm ou yarn

### Installation des dépendances

```powershell
npm install
```

## 📦 Scripts disponibles

### Développement

Lance le serveur en mode développement avec hot-reload et compilation Tailwind en watch mode :

```powershell
npm run dev
```

Le site sera accessible sur : `http://localhost:3000`

### Production

Compiler les styles pour la production :

```powershell
npm run build
```

Démarrer le serveur en production :

```powershell
npm start
```

### Autres commandes

Compiler Tailwind CSS une fois :

```powershell
npm run css:build
```

Watch mode pour Tailwind uniquement :

```powershell
npm run css:watch
```

## 📁 Structure du projet

```
bruno-parienti-portfolio/
├── package.json              # Dépendances et scripts npm
├── server.js                 # Serveur Express principal
├── tailwind.config.js        # Configuration Tailwind CSS
├── postcss.config.js         # Configuration PostCSS
│
├── routes/
│   └── index.js              # Routes Express (/, /lang/:locale, /sitemap.xml)
│
├── views/
│   ├── layout.ejs            # Layout principal avec SEO
│   ├── index.ejs             # Page d'accueil (toutes les sections)
│   └── partials/
│       ├── header.ejs        # Navigation et header
│       ├── footer.ejs        # Footer avec liens
│       ├── gallery.ejs       # Galerie photos + lightbox
│       └── reel.ejs          # Section demo reels
│
├── public/
│   ├── css/
│   │   ├── input.css         # Styles source Tailwind
│   │   └── styles.css        # Styles compilés (généré)
│   ├── js/
│   │   └── main.js           # JavaScript client
│   └── img/                  # Images (à ajouter)
│       ├── hero-bg.jpg
│       ├── bruno-hero.jpg
│       ├── og-image.jpg
│       └── gallery/
│
├── locales/
│   ├── fr.json               # Traductions françaises
│   └── en.json               # Traductions anglaises
│
├── data/
│   ├── credits.json          # Filmographie et crédits
│   └── photos.json           # Données galerie photos
│
└── README.md                 # Ce fichier
```

## 🖼️ Images à ajouter

Pour que le site fonctionne complètement, ajoutez les images suivantes dans le dossier `public/img/` :

### Images requises :

- `hero-bg.jpg` - Image de fond hero section (1920x1080px min)
- `bruno-hero.jpg` - Portrait principal pour hero (800x1000px)
- `og-image.jpg` - Image pour Open Graph (1200x630px)
- `favicon.ico` - Favicon
- `apple-touch-icon.png` - Icône Apple (180x180px)

### Galerie :

Créez un dossier `public/img/gallery/` et `public/img/gallery/thumbs/` et ajoutez :

- Photos haute résolution dans `/gallery/`
- Miniatures dans `/gallery/thumbs/`

### Crédits :

Créez un dossier `public/img/credits/` pour les images de productions

## 🌍 Internationalisation

Le site utilise un système i18n personnalisé avec des fichiers JSON dans `/locales/`.

### Ajouter une traduction :

1. Éditer `locales/fr.json` et `locales/en.json`
2. Ajouter la clé et les traductions
3. Utiliser dans les templates EJS : `<%= t('votre.cle') %>`

### Changer de langue :

- Via le switcher dans le header
- Via URL : `/?lang=fr` ou `/?lang=en`
- Automatique selon le header `Accept-Language` du navigateur

## 🎨 Personnalisation

### Couleurs

Modifier les couleurs dans `tailwind.config.js` :

```javascript
colors: {
  accent: '#d4af37', // Couleur accent (or)
  // Ajouter vos couleurs personnalisées
}
```

### Polices

Les polices sont chargées depuis Google Fonts dans `views/layout.ejs` :

- **Sans-serif** : Inter
- **Serif** : Playfair Display

Pour changer, modifier le lien Google Fonts et `tailwind.config.js`.

### Contenu

- **Filmographie** : Éditer `data/credits.json`
- **Photos** : Éditer `data/photos.json`
- **Textes** : Éditer `locales/fr.json` et `locales/en.json`

## 🔒 Sécurité

Le site utilise plusieurs mesures de sécurité :

- **Helmet.js** : Headers de sécurité HTTP
- **Content Security Policy** : Protection XSS
- **Compression** : Gzip pour les réponses
- **Cookie sécurisés** : HttpOnly et Secure en production

## 📊 SEO

### Optimisations incluses :

- ✅ Meta tags complets (title, description, keywords)
- ✅ Open Graph pour réseaux sociaux
- ✅ Twitter Cards
- ✅ JSON-LD Schema.org (Person, BreadcrumbList)
- ✅ Sitemap.xml dynamique
- ✅ Robots.txt
- ✅ Tags hreflang pour versions multilingues
- ✅ Images optimisées (alt, loading, srcset)
- ✅ Structure sémantique HTML5

### Vérifier le SEO :

- Google Search Console
- PageSpeed Insights
- Lighthouse (Chrome DevTools)

## 🚀 Déploiement

### Déploiement sur Vercel, Netlify ou Render

1. Pousser le code sur GitHub
2. Connecter votre repository
3. Configurer les commandes :
   - **Build** : `npm run build`
   - **Start** : `npm start`
4. Variables d'environnement :
   - `NODE_ENV=production`
   - `PORT=3000` (si nécessaire)

### Déploiement manuel (VPS)

```bash
# Sur le serveur
git clone [votre-repo]
cd bruno-parienti-portfolio
npm install
npm run build
npm start
```

Utiliser PM2 pour le process management :

```bash
npm install -g pm2
pm2 start server.js --name bruno-portfolio
pm2 save
pm2 startup
```

## 🛠️ Technologies utilisées

- **Backend** : Node.js, Express.js
- **Templating** : EJS
- **CSS** : Tailwind CSS v3+
- **JavaScript** : Vanilla JS (ES6+)
- **Sécurité** : Helmet, Compression
- **Build** : PostCSS, Autoprefixer

## 📝 TODO / Améliorations futures

- [ ] Backend API pour formulaire de contact (envoi email)
- [ ] Newsletter signup avec MailChimp/Sendinblue
- [ ] Blog/Actualités section
- [ ] CMS headless (Strapi, Contentful) pour gestion contenu
- [ ] Analytics (Google Analytics, Plausible)
- [ ] Tests automatisés
- [ ] PWA (Progressive Web App)

## 📄 Licence

© 2025 Bruno Parienti. Tous droits réservés.

## 🤝 Support

Pour toute question ou assistance :

- Email : bruno.parienti@exemple.fr
- Agent : contact@artmedia.fr

---

**Développé avec ❤️ pour Bruno Parienti**
