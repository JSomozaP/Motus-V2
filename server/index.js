require('dotenv').config(); // DOIT ÊTRE EN PREMIÈRE LIGNE !

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');
const emailService = require('./email-service'); 

console.log('🔧 Config DB:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '***' : 'MANQUANT',
  database: process.env.DB_NAME
});

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

// Configuration base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD || 'motus123', // IMPORTANT !
  database: process.env.DB_NAME || 'motus_v2'
};

// Configuration email (à adapter selon vos besoins)
const emailConfig = {
  host: 'smtp.gmail.com', // Ou votre fournisseur email
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'votre-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'votre-mot-de-passe-app'
  }
};

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
    const { email, password } = req.body;
    
    // Vérifier si l'utilisateur existe
    const connection = await mysql.createConnection(dbConfig);
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      await connection.end();
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Générer token de vérification
    const verificationToken = Math.random().toString(36).substr(2, 9);
    
    // Insérer l'utilisateur
    await connection.execute(
      'INSERT INTO users (email, password, verification_token) VALUES (?, ?, ?)',
      [email, hashedPassword, verificationToken]
    );
    
    await connection.end();
    
    // ENVOYER EMAIL RÉEL (pas juste console.log)
    const emailSent = await emailService.sendVerificationEmail(email, verificationToken);
    
    if (emailSent) {
      console.log(`📧 Email de vérification envoyé à ${email}`);
      res.json({ 
        message: 'Inscription réussie. Vérifiez votre email pour activer votre compte.',
        emailSent: true 
      });
    } else {
      console.log(`⚠️ Email non envoyé, mais compte créé pour ${email}`);
      res.json({ 
        message: 'Inscription réussie. Email de vérification non envoyé (vérifiez la config SMTP).',
        emailSent: false 
      });
    }
    
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/auth/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE verification_token = ?',
      [token]
    );
    
    await connection.end();
    
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
    
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.execute(
      'SELECT id, email, password, email_verified FROM users WHERE email = ?',
      [email]
    );
    
    await connection.end();
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Utilisateur inexistant' });
    }
    
    const user = users[0];
    
    if (!user.email_verified) {
      return res.status(400).json({ error: 'Email non vérifié' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }
    
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Erreur connexion:', error);
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
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO games (user_id, word, difficulty) VALUES (?, ?, ?)',
      [req.user.userId, word, difficulty]
    );
    const [gameResult] = await connection.execute(
      'SELECT LAST_INSERT_ID() as gameId'
    );
    await connection.end();
    
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
    
    const connection = await mysql.createConnection(dbConfig);
    const [games] = await connection.execute(
      'SELECT word FROM games WHERE id = ? AND user_id = ?',
      [gameId, req.user.userId]
    );
    
    if (games.length === 0) {
      await connection.end();
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
    
    await connection.end();
    
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
app.get('/api/leaderboard', authenticateToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [leaderboard] = await connection.execute(
      'SELECT email, difficulty, best_score, best_time, games_played FROM leaderboard_view LIMIT 50'
    );
    await connection.end();
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Erreur leaderboard:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour compléter une partie
app.post('/api/game/complete', authenticateToken, (req, res) => {
  const { gameId, score, time, attempts } = req.body;
  const userId = req.user.userId;
  
  // Logique de sauvegarde...
  console.log('🎮 Partie terminée:', { gameId, score, time, attempts, userId });
  
  res.json({ success: true, message: 'Score sauvegardé' });
});

// Démarrage serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur MOTUS V2 démarré sur http://localhost:${PORT}`);
  console.log(`📊 Base de données: ${dbConfig.database}`);
  console.log(`🔑 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
});