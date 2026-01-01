const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Helper pour charger données JSON
const loadJSON = (filename) => {
  try {
    const filePath = path.join(__dirname, "..", "data", filename);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error(`Erreur chargement ${filename}:`, err);
    return null;
  }
};

// Route principale
router.get("/", (req, res) => {
  try {
    const lang = res.locals.lang;
    const credits = loadJSON("credits.json");
    const photos = loadJSON("photos.json");

    // Métadonnées SEO
    const seoData = {
      title:
        lang === "fr"
          ? "Bruno Parienti - Acteur Professionnel | Portfolio"
          : lang === "en"
          ? "Bruno Parienti - Professional Actor | Portfolio"
          : "ברונו פריינטי - שחקן מקצועי | תיק עבודות",
      description:
        lang === "fr"
          ? "Portfolio professionnel de Bruno Parienti, acteur, performer et voice artist. Découvrez sa filmographie, ses photos et demo reels."
          : lang === "en"
          ? "Professional portfolio of Bruno Parienti, actor, performer and voice artist. Discover his filmography, photos and demo reels."
          : "תיק עבודות מקצועי של ברונו פריינטי, שחקן, פרפורמר ומדובב. גלה את הפילמוגרפיה, התמונות והדמו שלו.",
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
      image: req.protocol + "://" + req.get("host") + "/img/og-image.jpg",
      canonical: req.protocol + "://" + req.get("host") + "/",
    };

    res.render("home", {
      title: seoData.title,
      metaDescription: seoData.description,
      seoData,
      credits: credits || [],
      photos: photos || [],
      lang,
    });
  } catch (err) {
    console.error("❌ ERROR in route /:", err);
    res.status(500).send(`<h1>Error</h1><pre>${err.stack}</pre>`);
  }
});

// Route pour changer de langue
router.get("/lang/:locale", (req, res) => {
  const locale = req.params.locale;
  if (["fr", "en", "he"].includes(locale)) {
    res.cookie("lang", locale, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 an
  }
  res.redirect(req.get("Referrer") || "/");
});

// Route sitemap
router.get("/sitemap.xml", (req, res) => {
  const baseUrl = req.protocol + "://" + req.get("host");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/?lang=fr"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/?lang=en"/>
    <xhtml:link rel="alternate" hreflang="he" href="${baseUrl}/?lang=he"/>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemap);
});

// Route robots.txt
router.get("/robots.txt", (req, res) => {
  const baseUrl = req.protocol + "://" + req.get("host");

  const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  res.header("Content-Type", "text/plain");
  res.send(robots);
});

module.exports = router;
