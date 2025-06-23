-- Base de données MOTUS V2
CREATE DATABASE IF NOT EXISTS motus_v2;
USE motus_v2;

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des parties
CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    word VARCHAR(50) NOT NULL,
    difficulty ENUM('facile', 'moyen', 'difficile', 'cauchemar') NOT NULL,
    score INT DEFAULT 0,
    time_taken INT DEFAULT 0, -- en secondes
    attempts_used INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Vue pour le leaderboard
CREATE VIEW leaderboard_view AS
SELECT 
    u.email,
    g.difficulty,
    MAX(g.score) as best_score,
    MIN(g.time_taken) as best_time,
    COUNT(g.id) as games_played
FROM users u
JOIN games g ON u.id = g.user_id
WHERE g.completed = TRUE
GROUP BY u.id, g.difficulty
ORDER BY best_score DESC, best_time ASC;