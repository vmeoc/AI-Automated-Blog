require('dotenv').config({ path: '.env' });

const { Storage } = require('@google-cloud/storage');
const path        = require('path');
const yargs       = require('yargs/yargs')(process.argv.slice(2))
                      .usage('Usage: $0 --file /chemin/vers/image.jpg')
                      .demandOption(['file'])
                      .argv;

/* ---------- initialisation ---------- */
const storage    = new Storage();                   // lit la clé JSON via GOOGLE_APPLICATION_CREDENTIALS
const bucketName = process.env.BUCKET_NAME;

/* ---------- fonction principale ---------- */
async function uploadAndReturnPublicUrl(filePath) {
  const bucket = storage.bucket(bucketName);
  const dest   = path.basename(filePath);           // on garde le nom d’origine

  // 1. Upload
  await bucket.upload(filePath, { destination: dest });
  console.log(`✅  Uploadé : gs://${bucketName}/${dest}`);

  // 2. URL permanente (bucket en lecture publique)
  const url = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(dest)}`;
  console.log('🌍  URL permanente :', url);
  return url;
}

/* ---------- exécution ---------- */
uploadAndReturnPublicUrl(yargs.file)
  .catch(err => {
    console.error('⛔️  Échec :', err.message);
    process.exit(1);
  });
