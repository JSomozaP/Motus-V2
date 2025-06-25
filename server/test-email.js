const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testRealEmail() {
  console.log('📧 TEST EMAIL RÉEL\n');
  
  try {
    console.log('📝 Test inscription avec vraie adresse...');
    const response = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: 'jeremy.somoza@laplateforme.io', // TEST VRAIE ADRESSE
      password: 'motus123'
    });
    
    console.log('✅ Réponse inscription:', response.data);
    
    if (response.data.emailSent) {
      console.log('\n🎉 EMAIL ENVOYÉ ! Vérifiez votre boîte mail !');
      console.log('📬 Cherchez un email de: jeremy.somoza@laplateforme.io');
      console.log('📋 Sujet: 🎯 MOTUS V2 - Vérifiez votre compte');
    } else {
      console.log('\n⚠️ Email non envoyé, vérifiez la config SMTP');
    }
    
  } catch (error) {
    if (error.response?.data?.error === 'Email déjà utilisé') {
      console.log('ℹ️ Email déjà utilisé, c\'est normal !');
      
      // Tester la réinitialisation de mot de passe
      console.log('\n🔒 Test réinitialisation mot de passe...');
      try {
        const resetResponse = await axios.post(`${BASE_URL}/api/auth/forgot-password`, {
          email: 'jeremy.somoza@laplateforme.io'
        });
        console.log('✅ Réponse reset:', resetResponse.data);
        console.log('📧 Vérifiez votre boîte mail pour le lien de réinitialisation !');
      } catch (resetError) {
        console.log('❌ Erreur reset:', resetError.response?.data);
      }
    } else {
      console.log('❌ Erreur inscription:', error.response?.data || error.message);
    }
  }
}

testRealEmail();