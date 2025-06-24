const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testSimple() {
  console.log('🧪 TEST COMPLET MOTUS V2\n');
  
  try {
    // Test connexion avec utilisateur vérifié existant
    console.log('🔐 Test connexion...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'jeremy@test.com',
      password: 'motus123' // Le mot de passe doit correspondre à celui hashé en DB
    });
    console.log('✅ Connexion réussie');
    
    const token = loginResponse.data.token;
    
    // Test leaderboard
    console.log('\n🏆 Test leaderboard...');
    const leaderboardResponse = await axios.get(`${BASE_URL}/api/leaderboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Leaderboard:', leaderboardResponse.data.length, 'entrées');
    
    console.log('\n🎉 TOUS LES TESTS PASSÉS !');
    
  } catch (error) {
    console.log('❌ Erreur:', error.response?.data || error.message);
    
    // Si connexion échoue, tester l'inscription
    if (error.response?.data?.error === 'Mot de passe incorrect') {
      console.log('\n📝 Test inscription à la place...');
      try {
        const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
          email: 'test-' + Date.now() + '@motus.com',
          password: 'motus123'
        });
        console.log('✅ Inscription fonctionne:', registerResponse.data);
      } catch (regError) {
        console.log('❌ Inscription aussi échoue:', regError.response?.data);
      }
    }
  }
}

testSimple();