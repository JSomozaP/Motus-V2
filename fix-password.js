// Script pour générer un hash de mot de passe sécurisé
const bcrypt = require('bcryptjs');

async function generateHash() {
    try {
        const password = process.argv[2] || 'DefaultPassword123!';
        if (process.argv.length < 3) {
            console.log('Usage: node fix-password.js <votre_mot_de_passe>');
            console.log('Utilisation du mot de passe par défaut pour l\'exemple...');
        }
        
        const hash = await bcrypt.hash(password, 10);
        console.log('Password hash generated successfully');
        console.log('Hash:', hash);
        
        // Test de vérification
        const isValid = await bcrypt.compare(password, hash);
        console.log('Verification:', isValid ? 'OK' : 'ERROR');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

generateHash();
