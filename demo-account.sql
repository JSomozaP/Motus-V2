-- 🎮 MOTUS V2 - Compte de démonstration
-- Utilisateur de test pour les examinateurs et démonstrations

-- Supprimer le compte s'il existe déjà
DELETE FROM wall_of_fame WHERE login = 'DemoPlayer';
DELETE FROM users WHERE email = 'demo@motus-v2.com';

-- Créer l'utilisateur de démonstration
-- Mot de passe : Demo123! (haché avec bcrypt)
INSERT INTO users (pseudo, email, password, email_verified, created_at, updated_at) VALUES 
('DemoPlayer', 'demo@motus-v2.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, NOW(), NOW());

-- Récupérer l'ID du nouvel utilisateur
SET @demo_user_id = LAST_INSERT_ID();

-- Ajouter des scores de démonstration variés
INSERT INTO wall_of_fame (user_id, score, login, difficulty, words_found, created_at) VALUES 
-- Scores récents (aujourd'hui)
(@demo_user_id, 245, 'DemoPlayer', 'moyen', 3, NOW() - INTERVAL 2 HOUR),
(@demo_user_id, 180, 'DemoPlayer', 'facile', 5, NOW() - INTERVAL 1 HOUR),
(@demo_user_id, 320, 'DemoPlayer', 'difficile', 2, NOW() - INTERVAL 30 MINUTE),

-- Scores d'hier
(@demo_user_id, 195, 'DemoPlayer', 'facile', 4, NOW() - INTERVAL 1 DAY - INTERVAL 3 HOUR),
(@demo_user_id, 275, 'DemoPlayer', 'moyen', 2, NOW() - INTERVAL 1 DAY - INTERVAL 1 HOUR),

-- Scores plus anciens
(@demo_user_id, 150, 'DemoPlayer', 'facile', 6, NOW() - INTERVAL 2 DAY),
(@demo_user_id, 380, 'DemoPlayer', 'difficile', 1, NOW() - INTERVAL 3 DAY),
(@demo_user_id, 420, 'DemoPlayer', 'cauchemar', 1, NOW() - INTERVAL 4 DAY),

-- Scores moyens pour diversifier
(@demo_user_id, 165, 'DemoPlayer', 'facile', 4, NOW() - INTERVAL 5 DAY),
(@demo_user_id, 210, 'DemoPlayer', 'moyen', 3, NOW() - INTERVAL 6 DAY);

-- Ajouter quelques autres joueurs fictifs pour enrichir le leaderboard
INSERT INTO users (pseudo, email, password, email_verified, created_at) VALUES 
('ProGamer', 'pro@motus-demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, NOW() - INTERVAL 7 DAY),
('WordMaster', 'master@motus-demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, NOW() - INTERVAL 10 DAY),
('Challenger', 'challenge@motus-demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, NOW() - INTERVAL 15 DAY);

-- Ajouter des scores pour ces joueurs fictifs
INSERT INTO wall_of_fame (user_id, score, login, difficulty, words_found, created_at) VALUES 
-- ProGamer (très bon)
((SELECT id FROM users WHERE pseudo = 'ProGamer'), 450, 'ProGamer', 'cauchemar', 1, NOW() - INTERVAL 1 DAY),
((SELECT id FROM users WHERE pseudo = 'ProGamer'), 380, 'ProGamer', 'difficile', 2, NOW() - INTERVAL 2 DAY),
((SELECT id FROM users WHERE pseudo = 'ProGamer'), 290, 'ProGamer', 'moyen', 4, NOW() - INTERVAL 3 DAY),

-- WordMaster (régulier)
((SELECT id FROM users WHERE pseudo = 'WordMaster'), 350, 'WordMaster', 'difficile', 2, NOW() - INTERVAL 1 DAY),
((SELECT id FROM users WHERE pseudo = 'WordMaster'), 220, 'WordMaster', 'moyen', 5, NOW() - INTERVAL 2 DAY),
((SELECT id FROM users WHERE pseudo = 'WordMaster'), 185, 'WordMaster', 'facile', 6, NOW() - INTERVAL 4 DAY),

-- Challenger (débutant qui progresse)
((SELECT id FROM users WHERE pseudo = 'Challenger'), 280, 'Challenger', 'moyen', 3, NOW() - INTERVAL 1 DAY),
((SELECT id FROM users WHERE pseudo = 'Challenger'), 160, 'Challenger', 'facile', 5, NOW() - INTERVAL 3 DAY),
((SELECT id FROM users WHERE pseudo = 'Challenger'), 140, 'Challenger', 'facile', 4, NOW() - INTERVAL 5 DAY);

-- Afficher un résumé
SELECT '🎯 COMPTE DE DÉMONSTRATION CRÉÉ !' as status;
SELECT '👤 Identifiants de connexion :' as info;
SELECT 'Email: demo@motus-v2.com' as email;
SELECT 'Mot de passe: Demo123!' as password;
SELECT 'Pseudo: DemoPlayer' as pseudo;

SELECT '📊 Statistiques du leaderboard :' as leaderboard_info;
SELECT COUNT(*) as total_scores FROM wall_of_fame;
SELECT COUNT(DISTINCT login) as total_players FROM wall_of_fame;

SELECT '🏆 Top 5 des meilleurs scores :' as top_scores;
SELECT 
    login as Joueur,
    score as Score,
    difficulty as Difficulté,
    DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') as Date
FROM wall_of_fame 
ORDER BY score DESC 
LIMIT 5;
