require('dotenv').config();

function buildBlueskyPostUrl(profileHandle, atUri) {
  const parts = atUri.trim().split('/');
  if (parts.length < 1) {
    throw new Error('AT-URI invalide');
  }
  const postId = parts[parts.length - 1];
  if (!postId) {
    throw new Error('Impossible d’extraire l’ID du post');
  }
  if (!profileHandle) {
    throw new Error('Le handle du profil est requis');
  }
  return `https://bsky.app/profile/${profileHandle}/post/${postId}`;
}

function main() {
  const profileHandle = process.env.PROFILE_HANDLE;
  if (!profileHandle) {
    console.error('Erreur : PROFILE_HANDLE non défini dans le fichier .env');
    process.exit(1);
  }

  const atUri = process.argv[2];
  if (!atUri) {
    console.error(`Usage: node ${process.argv[1]} <AT-URI>`);
    process.exit(1);
  }

  try {
    const url = buildBlueskyPostUrl(profileHandle, atUri);
    console.log(url);
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

main();
