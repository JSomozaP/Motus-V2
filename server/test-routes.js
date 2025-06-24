const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testRoutes() {
  console.log('🧪 TESTS DES ROUTES MOTUS V2\n');
  
  try {
    // TEST 1: Inscription
    console.log('📝 Test inscription...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: 'test-' + Date.now() + '@motus.com',
      password: 'motus123'
    });
    console.log('✅ Inscription:', registerResponse.data);
    
  } catch (error) {
    console.log('❌ Erreur inscription:', error.response?.data || error.message);
  }
  
  try {
    // TEST 2: Connexion
    console.log('\n🔐 Test connexion...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@motus.com',
      password: 'motus123'
    });
    console.log('✅ Connexion:', loginResponse.data);
    
    const token = loginResponse.data.token;
    
    // TEST 3: Nouveau mot (authentifié)
    console.log('\n🎮 Test nouveau mot...');
    const wordResponse = await axios.get(`${BASE_URL}/api/game/word/facile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Nouveau mot:', wordResponse.data);
    
    // TEST 4: Leaderboard (authentifié)
    console.log('\n🏆 Test leaderboard...');
    const leaderboardResponse = await axios.get(`${BASE_URL}/api/leaderboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Leaderboard:', leaderboardResponse.data);
    
  } catch (error) {
    console.log('❌ Erreur tests authentifiés:', error.response?.data || error.message);
  }
}

testRoutes();