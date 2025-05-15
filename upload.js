require('dotenv').config({ path: '.env' });

const { Storage } = require('@google-cloud/storage');
const path        = require('path');
const fs          = require('fs').promises;
const yargs       = require('yargs/yargs')(process.argv.slice(2))
                      .usage('Usage: $0 --file /chemin/vers/image.jpg')
                      .demandOption(['file'])
                      .argv;

/* ---------- initialisation ---------- */
const storage    = new Storage();                   // lit la clé JSON via GOOGLE_APPLICATION_CREDENTIALS
const bucketName = process.env.BUCKET_NAME;

/* ---------- fonction pour mettre à jour BlogDataTracking.json ---------- */
async function updateTrackingJson(imageName, url, imageDir) {
  const parentDir = path.dirname(imageDir);
  const trackingFilePath = path.join(parentDir, 'BlogDataTracking.json');

  let data = { images: [] };

  try {
    const fileContent = await fs.readFile(trackingFilePath, 'utf8');
    if (fileContent.trim().length > 0) {
      data = JSON.parse(fileContent);
    } else {
      console.log(`ℹ️  Fichier JSON vide détecté, création d'une nouvelle structure.`);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      // fichier absent, création d'une nouvelle structure
      console.log(`ℹ️  Fichier ${trackingFilePath} non trouvé, création d'un nouveau.`);
    } else {
      if (err instanceof SyntaxError) {
        console.warn(`⚠️  JSON invalide dans ${trackingFilePath}, réinitialisation du fichier.`);
        data = { images: [] };
      } else {
        throw err;
      }
    }
  }

  const existingIndex = data.images.findIndex(img => img.name === imageName);
  if (existingIndex !== -1) {
    data.images[existingIndex].url = url;
  } else {
    data.images.push({ name: imageName, url });
  }

  await fs.writeFile(trackingFilePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✔️  BlogDataTracking.json mis à jour : ${trackingFilePath}`);
}

/* ---------- fonction principale ---------- */
async function uploadAndReturnPublicUrl(filePath) {
  const bucket = storage.bucket(bucketName);
  const dest   = path.basename(filePath);

  // Upload
  await bucket.upload(filePath, { destination: dest });
  console.log(`✅  Uploadé : gs://${bucketName}/${dest}`);

  // URL publique
  const url = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(dest)}`;
  console.log('🌍  URL permanente :', url);

  // Mise à jour du fichier JSON dans dossier supérieur
  const imageDir = path.dirname(filePath);
  await updateTrackingJson(dest, url, imageDir);

  return url;
}

/* ---------- exécution ---------- */
uploadAndReturnPublicUrl(yargs.file)
  .catch(err => {
    console.error('⛔️  Échec :', err.message);
    process.exit(1);
  });
