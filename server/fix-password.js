const bcrypt = require('bcrypt');

async function generateCorrectHash() {
  const password = process.env.DEFAULT_PASSWORD || 'changeme123';
  const hash = await bcrypt.hash(password, 10);
  console.log('🔐 Nouveau hash généré pour le mot de passe par défaut');
  console.log(hash);
  
  // Vérifier que ça marche
  const isValid = await bcrypt.compare(password, hash);
  console.log('✅ Vérification:', isValid ? 'OK' : 'ERREUR');
}

generateCorrectHash();