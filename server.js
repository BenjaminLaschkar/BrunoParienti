const express = require("express");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//         fontSrc: ["'self'", "https://fonts.gstatic.com"],
//         imgSrc: ["'self'", "data:", "https:", "http:"],
//         scriptSrc: ["'self'", "'unsafe-inline'"],
//         frameSrc: [
//           "'self'",
//           "https://www.youtube.com",
//           "https://player.vimeo.com",
//         ],
//       },
//     },
//   })
// );

// Compression
app.use(compression());

// Parser cookies
app.use(cookieParser());

// Parser body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "1d",
    etag: true,
  })
);

// Configuration EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware i18n
app.use((req, res, next) => {
  // Détection de la langue depuis cookie, query param ou header
  let lang =
    req.cookies.lang || req.query.lang || req.headers["accept-language"];

  // Parser accept-language header
  if (lang && lang.includes(",")) {
    lang = lang.split(",")[0];
  }
  if (lang && lang.includes("-")) {
    lang = lang.split("-")[0];
  }

  // Langues supportées: fr, en, he
  lang = ["fr", "en", "he"].includes(lang) ? lang : "fr";

  // Charger les traductions
  const localesPath = path.join(__dirname, "locales", `${lang}.json`);
  let translations = {};

  try {
    translations = JSON.parse(fs.readFileSync(localesPath, "utf8"));
  } catch (err) {
    console.error(`Erreur chargement locale ${lang}:`, err);
    // Fallback to French
    try {
      translations = JSON.parse(
        fs.readFileSync(path.join(__dirname, "locales", "fr.json"), "utf8")
      );
      lang = "fr";
    } catch (e) {
      console.error("Erreur chargement locale fr:", e);
    }
  }

  // Helper fonction de traduction
  res.locals.t = (key) => {
    const keys = key.split(".");
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    return value || key;
  };

  res.locals.lang = lang;
  res.locals.translations = translations;

  next();
});

// Routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

// Gestion 404
app.use((req, res) => {
  res.status(404).render("404", {
    title: "404 - Page Not Found",
    metaDescription: "Page not found",
  });
});

// Gestion erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Démarrage serveur (seulement en local, pas sur Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

module.exports = app;
