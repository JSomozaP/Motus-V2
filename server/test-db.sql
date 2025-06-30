-- TESTER LA CONNEXION BASE DE DONNÉES

-- Vérifier la structure
SHOW TABLES;

-- Vérifier les utilisateurs
SELECT * FROM users LIMIT 5;

-- Vérifier les parties
SELECT * FROM games LIMIT 5;

-- Tester la vue leaderboard si elle existe
SELECT * FROM leaderboard_view LIMIT 10;

-- Créer un utilisateur de test
INSERT INTO users (email, password, email_verified) 
VALUES ('test@motus.com', '$2b$10$test', TRUE);

-- Vérifier l'insertion
SELECT id, email, email_verified FROM users WHERE email = 'test@motus.com';