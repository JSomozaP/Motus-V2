require('dotenv').config(); // DOIT ÊTRE EN PREMIÈRE LIGNE !

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // ← IMPORTANT: /promise
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('./email-service'); // TIRET au lieu de POINT vu que je me suis planté

// Configuration base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'votre_mot_de_passe',
  database: 'motus'
};

// VARIABLE GLOBALE pour stocker la connexion
let connection;

// FONCTION D'INITIALISATION
async function initDatabase() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion MySQL établie');
  } catch (error) {
    console.error('❌ Erreur connexion MySQL:', error);
    process.exit(1);
  }
}

console.log('Config DB:', { ...dbConfig, password: '***' });

const app = express();


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'motus-secret-key-v2';

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
};



// Configuration utilisateur par défaut (SÉCURISÉ)
const defaultUser = {
  login: process.env.DEFAULT_USER || 'testeur',
  email: process.env.DEFAULT_EMAIL || 'test@motus.com',
  password: process.env.DEFAULT_PASSWORD || ''
};

// ROUTES AUTHENTIFICATION
app.post('/api/auth/register', async (req, res) => {
  try {
    const { pseudo, email, password } = req.body;
    
    if (!pseudo || !email || !password) {
      return res.status(400).json({ error: 'Pseudo, email et mot de passe requis' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.random().toString(36).substr(2, 15);

    // Insérer en base
    const query = 'INSERT INTO users (pseudo, email, password, verification_token) VALUES (?, ?, ?, ?)';
    const values = [pseudo, email, hashedPassword, verificationToken];
    const [result] = await connection.execute(query, values);

    
    try {
      
      // 🔧 PASSER LE PSEUDO À LA FONCTION EMAIL
      const emailSent = await emailService.sendVerificationEmail(email, verificationToken, pseudo);
      if (emailSent) {
        console.log('📧 Email de vérification envoyé à:', email, 'pour pseudo:', pseudo);
      } else {
        console.error('❌ Échec envoi email pour:', email);
      }
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError);
    }

    res.status(201).json({ 
      message: 'Compte créé ! Vérifiez votre email pour l\'activer.',
      userId: result.insertId 
    });
    
  } catch (error) {
    console.error('Erreur inscription:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.sqlMessage.includes('pseudo')) {
        res.status(400).json({ error: 'Ce pseudo est déjà utilisé' });
      } else if (error.sqlMessage.includes('email')) {
        res.status(400).json({ error: 'Cet email est déjà utilisé' });
      } else {
        res.status(400).json({ error: 'Pseudo ou email déjà utilisé' });
      }
    } else {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
});

app.get('/api/auth/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    
    const [result] = await connection.execute(
      'UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE verification_token = ?',
      [token]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Token invalide' });
    }
    
    res.json({ message: 'Email vérifié avec succès' });
  } catch (error) {
    console.error('Erreur vérification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Chercher par email dans la base unifiée motus
    const [rows] = await connection.execute(
      'SELECT id, pseudo, email, password, email_verified FROM users WHERE email = ?',
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    const user = rows[0];
    
    if (!user.email_verified) {
      return res.status(401).json({ error: 'Email non vérifié' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        pseudo: user.pseudo  // AJOUTER LE PSEUDO DANS LE TOKEN
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('Connexion réussie pour:', user.email, 'pseudo:', user.pseudo);
    
    // RENVOYER LE PSEUDO AU FRONTEND
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo  
      }
    });
    
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour demander réinitialisation mot de passe
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    
    // UTILISER directement la connexion globale :
    const [users] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Email non trouvé' });
    }
    
    // Générer token de réinitialisation
    const resetToken = Math.random().toString(36).substr(2, 9);
    const resetExpiry = new Date(Date.now() + 3600000); // 1 heure
    
    await connection.execute(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [resetToken, resetExpiry, email]
    );
    
    // Envoyer email de réinitialisation
    const emailSent = await emailService.sendPasswordResetEmail(email, resetToken);
    
    if (emailSent) {
      res.json({ message: 'Email de réinitialisation envoyé' });
    } else {
      res.status(500).json({ error: 'Erreur envoi email' });
    }
    
  } catch (error) {
    console.error('Erreur forgot password:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour réinitialiser le mot de passe
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    
    const [users] = await connection.execute(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await connection.execute(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?',
      [hashedPassword, token]
    );
    
    res.json({ message: 'Mot de passe réinitialisé avec succès' });
    
  } catch (error) {
    console.error('Erreur reset password:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ROUTES JEU (protégées)
app.get('/api/game/word/:difficulty', authenticateToken, async (req, res) => {
  try {
    const { difficulty } = req.params;
    
    // Mapping difficulté -> taille mot
    const difficultyMap = {
      'facile': { min: 3, max: 5 },
      'moyen': { min: 5, max: 7 },
      'difficile': { min: 6, max: 9 },
      'cauchemar': { min: 8, max: 12 }
    };
    
    if (!difficultyMap[difficulty]) {
      return res.status(400).json({ error: 'Difficulté invalide' });
    }
    
    const { min, max } = difficultyMap[difficulty];
    const size = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Appel API trouve-mot.fr (proxy sécurisé)
    const response = await axios.get(`https://trouve-mot.fr/api/size/${size}/1`);
    const word = response.data[0].name.toUpperCase();
    
    // Stocker le mot en session (ici en base pour simplifier)
    
    await connection.execute(
      'INSERT INTO games (user_id, word, difficulty) VALUES (?, ?, ?)',
      [req.user.userId, word, difficulty]
    );
    const [gameResult] = await connection.execute(
      'SELECT LAST_INSERT_ID() as gameId'
    );
    
    // Renvoyer uniquement première lettre + longueur (sécurité)
    res.json({
      gameId: gameResult[0].gameId,
      firstLetter: word[0],
      length: word.length,
      difficulty
    });
  } catch (error) {
    console.error('Erreur nouveau mot:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/game/guess', authenticateToken, async (req, res) => {
  try {
    const { gameId, guess } = req.body;
    
    
    const [games] = await connection.execute(
      'SELECT word FROM games WHERE id = ? AND user_id = ?',
      [gameId, req.user.userId]
    );
    
    if (games.length === 0) {
      return res.status(400).json({ error: 'Partie inexistante' });
    }
    
    const word = games[0].word;
    const guessUpper = guess.toUpperCase();
    
    // Logique de vérification (vert/orange/gris)
    const result = [];
    for (let i = 0; i < Math.max(word.length, guessUpper.length); i++) {
      if (i >= word.length || i >= guessUpper.length) {
        result.push({ letter: guessUpper[i] || '', status: 'absent' });
      } else if (word[i] === guessUpper[i]) {
        result.push({ letter: guessUpper[i], status: 'correct' });
      } else if (word.includes(guessUpper[i])) {
        result.push({ letter: guessUpper[i], status: 'present' });
      } else {
        result.push({ letter: guessUpper[i], status: 'absent' });
      }
    }
    
    res.json({
      result,
      isCorrect: word === guessUpper,
      word: word === guessUpper ? word : null
    });
  } catch (error) {
    console.error('Erreur validation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ROUTE LEADERBOARD
app.get('/api/leaderboard', async (req, res) => {
  try {
    console.log('📊 Récupération du leaderboard...');
    
    const query = `
      SELECT 
        login as player_alias,
        login as email,
        score as best_score,
        DATE_FORMAT(created_at, '%d/%m/%Y') as date_achieved,
        difficulty,
        words_found as games_played,
        score,
        1 as best_streak
      FROM wall_of_fame 
      ORDER BY score DESC 
      LIMIT 10
    `;
    
    const [rows] = await connection.execute(query);
    
    console.log(`✅ ${rows.length} scores récupérés`);
    console.log('📋 Premier score:', rows[0]); // Pour debug
    
    res.json(rows);
    
  } catch (error) {
    console.error('❌ Erreur leaderboard détaillée:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération du leaderboard',
      details: error.message 
    });
  }
});

// Route pour compléter une partie
app.post('/api/games/:id/complete', authenticateToken, async (req, res) => {
  try {
    const { score, time, attempts, playerAlias } = req.body;
    const userId = req.user.userId;
    
    console.log('🎮 Partie terminée:', { gameId: req.params.id, score, time, attempts, userId, playerAlias });

    // Vérifier/créer l'utilisateur
    // SUPPRIMER : const connection = await mysql.createConnection(dbConfig);
    // UTILISER la connexion globale directement :
    const [userResult] = await connection.execute(
      'SELECT pseudo FROM users WHERE id = ?',
      [userId]
    );
    
    let userLogin = playerAlias || 'Joueur'; // UTILISER le pseudo envoyé
    if (userResult.length === 0) {
      // Créer avec le bon pseudo
      const randomPassword = '$2a$12$dummy.hash.for.new.user';
      const randomSecu = Math.floor(Math.random() * 1000000000000000).toString();
      
      await connection.execute(`
        INSERT INTO users (id, pseudo, password, numero_secu, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `, [userId, userLogin, randomPassword, randomSecu]);
      
      console.log('✅ Nouvel utilisateur créé:', userLogin);
    } else {
      // Utiliser le pseudo envoyé ou celui en BDD
      userLogin = playerAlias || userResult[0].pseudo;
    }

    // Sauvegarder avec le bon login
    await connection.execute(`
      INSERT INTO wall_of_fame (user_id, score, login, difficulty, words_found, created_at)
      VALUES (?, ?, ?, 'facile', 1, NOW())
    `, [userId, score, userLogin]);
    
    console.log('🏆 Score ajouté au wall_of_fame pour', userLogin);
    res.json({ success: true, message: "Score sauvegardé" });
    
  } catch (error) {
    console.error('❌ Erreur sauvegarde complète:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter cette route après les autres routes API
app.get('/api/mot-aleatoire', async (req, res) => {
  try {
    console.log('🎯 Demande mot aléatoire, difficulté:', req.query.difficulte);
    
    const { difficulte } = req.query;
    
    let lengthCondition = '';
    switch(difficulte) {
      case 'facile':
        lengthCondition = 'WHERE LENGTH(mot) BETWEEN 4 AND 6';
        break;
      case 'moyen':
        lengthCondition = 'WHERE LENGTH(mot) BETWEEN 7 AND 8';
        break;
      case 'difficile':
        lengthCondition = 'WHERE LENGTH(mot) >= 9';
        break;
      default:
        lengthCondition = 'WHERE LENGTH(mot) BETWEEN 4 AND 8';
    }
    
    const query = `SELECT mot FROM mots ${lengthCondition} ORDER BY RAND() LIMIT 1`;
    const [rows] = await connection.execute(query);
    
    if (rows.length === 0) {
      console.log('❌ Aucun mot trouvé pour difficulté:', difficulte);
      return res.status(404).json({ error: 'Aucun mot trouvé pour cette difficulté' });
    }
    
    console.log('✅ Mot trouvé:', rows[0].mot);
    res.json({ mot: rows[0].mot.toUpperCase() });
    
  } catch (error) {
    console.error('❌ Erreur mot aléatoire:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/test', (req, res) => {
  console.log('🧪 Route de test appelée !');
  res.json({ message: 'Test OK', timestamp: new Date() });
});

app.get('/api/test', (req, res) => {
  console.log('🧪 Route /api/test appelée !');
  res.json({ message: 'API Test OK', timestamp: new Date() });
});

// Démarrage serveur
const PORT = process.env.PORT || 3000;

// DÉMARRAGE ASYNCHRONE
async function startServer() {
  await initDatabase(); // Initialiser la BDD d'abord
  
  app.listen(PORT, () => {
    console.log(`🚀 Serveur MOTUS V2 démarré sur http://localhost:${PORT}`);
    console.log(`📊 Base de données: ${dbConfig.database}`);
    console.log(`🔑 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
  });
}

startServer().catch(console.error);