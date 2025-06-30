const bcrypt = require('bcrypt');

async function generateCorrectHash() {
  const password = 'motus123';
  const hash = await bcrypt.hash(password, 10);
  console.log('🔐 Nouveau hash pour motus123:');
  console.log(hash);
  
  // Vérifier que ça marche
  const isValid = await bcrypt.compare(password, hash);
  console.log('✅ Vérification:', isValid ? 'OK' : 'ERREUR');
}

generateCorrectHash();