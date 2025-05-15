const fs = require('fs');
const path = require('path');

// Récupération du titre de blog en argument ligne de commande
const blogTitle = process.argv[2];

if (!blogTitle) {
  console.error('Erreur : Veuillez fournir un titre de blog en argument.');
  console.error('Usage : node createBlog.js "Titre du blog"');
  process.exit(1);
}

// Fonction simple pour créer un slug à partir du titre
function slugify(text) {
  return text
    .toString()
    .normalize('NFD')                   // Décompose les accents
    .replace(/[\u0300-\u036f]/g, '')    // Supprime les accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')       // Remplace tout ce qui n'est pas alphanumérique par un tiret
    .replace(/^-+|-+$/g, '');           // Supprime les tirets en début et fin
}

function createBlogStructure(blogTitle) {
  const slug = slugify(blogTitle);

  const basePath = path.join(
    'C:',
    'Users',
    'vince',
    'Documents',
    'VS Code',
    'Dev',
    'AI Automated Blog',
    'Blogs content'
  );

  // Chemin du dossier blog basé sur le slug
  const blogPath = path.join(basePath, slug);

  // Chemin du dossier images DANS le dossier blog
  const imagesPath = path.join(blogPath, 'images');

  // Création dossier blog (récursif)
  fs.mkdirSync(blogPath, { recursive: true });

  // Création dossier images dans le dossier blog
  if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });
  }

  // Création fichiers dans dossier blog
  const blogDataTrackingFile = path.join(blogPath, 'BlogDataTracking.json');

  if (!fs.existsSync(blogDataTrackingFile)) {
    // On écrit l'objet JSON avec le titre original
    const initialData = {
      title: blogTitle,
      images: []
    };
    fs.writeFileSync(blogDataTrackingFile, JSON.stringify(initialData, null, 2), 'utf8');
  }

  // Création blogContent.md s'il n'existe pas
  const blogContentFile = path.join(blogPath, 'blogContent.md');
  if (!fs.existsSync(blogContentFile)) {
    fs.writeFileSync(blogContentFile, '', 'utf8');
  }

  // Création SocialNetworkPost.md s'il n'existe pas
  const socialNetworkPostFile = path.join(blogPath, 'SocialNetworkPost.md');
  if (!fs.existsSync(socialNetworkPostFile)) {
    fs.writeFileSync(socialNetworkPostFile, '', 'utf8');
  }

  return blogPath;
}

const createdPath = createBlogStructure(blogTitle);
console.log('Chemin du dossier blog créé:', createdPath);
