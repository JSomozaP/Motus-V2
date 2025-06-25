/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: motus
-- ------------------------------------------------------
-- Server version	10.11.13-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mots`
--

DROP TABLE IF EXISTS `mots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `mots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `word` varchar(20) NOT NULL,
  `longueur` int(11) NOT NULL,
  `difficulte` enum('facile','moyen','difficile','cauchemar') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_mots_difficulte` (`difficulte`),
  KEY `idx_mots_longueur` (`longueur`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mots`
--

LOCK TABLES `mots` WRITE;
/*!40000 ALTER TABLE `mots` DISABLE KEYS */;
INSERT INTO `mots` VALUES
(1,'MAISON',6,'facile'),
(2,'JARDIN',6,'facile'),
(3,'SOLEIL',6,'facile'),
(4,'PLANTE',6,'facile'),
(5,'CHAT',4,'facile'),
(6,'CHIEN',5,'facile'),
(7,'ARBRE',5,'facile'),
(8,'VOITURE',7,'moyen'),
(9,'CUISINE',7,'moyen'),
(10,'TABLEAU',7,'moyen'),
(11,'MUSIQUE',7,'moyen'),
(12,'FENETRE',7,'moyen'),
(13,'CHAMBRE',7,'moyen'),
(14,'EXEMPLE',7,'moyen'),
(15,'REPONSE',7,'moyen'),
(16,'LUMIERE',7,'difficile'),
(17,'JOURNAL',7,'difficile'),
(18,'MONTURE',7,'difficile'),
(19,'PARCOURS',8,'difficile'),
(20,'QUESTION',8,'difficile'),
(21,'VICTOIRE',8,'difficile'),
(22,'BYZANTINE',9,'cauchemar'),
(23,'FREQUENCY',9,'cauchemar'),
(24,'COMPLEXE',8,'cauchemar'),
(25,'DYNAMITE',8,'cauchemar'),
(26,'MYSTERIUM',9,'cauchemar'),
(27,'ENTREPRENEUR',12,'cauchemar'),
(28,'TRANSMETTRE',11,'cauchemar'),
(29,'RECONNAISSANCE',13,'cauchemar');
/*!40000 ALTER TABLE `mots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parties`
--

DROP TABLE IF EXISTS `parties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `parties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `mot_id` int(11) NOT NULL,
  `nb_tentatives` int(11) NOT NULL,
  `score` int(11) DEFAULT 0,
  `status` enum('en_cours','gagnee','perdue') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `mot_id` (`mot_id`),
  KEY `idx_parties_user_id` (`user_id`),
  KEY `idx_parties_status` (`status`),
  CONSTRAINT `parties_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `parties_ibfk_2` FOREIGN KEY (`mot_id`) REFERENCES `mots` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parties`
--

LOCK TABLES `parties` WRITE;
/*!40000 ALTER TABLE `parties` DISABLE KEYS */;
/*!40000 ALTER TABLE `parties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scores`
--

DROP TABLE IF EXISTS `scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `scores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `partie_id` int(11) NOT NULL,
  `score` int(11) DEFAULT 0,
  `tentatives_utilisees` int(11) NOT NULL,
  `temps_ecoule` int(11) DEFAULT 0,
  `mot_longueur` int(11) NOT NULL,
  `status` enum('gagnee','perdue') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `partie_id` (`partie_id`),
  KEY `idx_scores_user_id` (`user_id`),
  KEY `idx_scores_created_at` (`created_at`),
  KEY `idx_scores_score` (`score` DESC),
  CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`partie_id`) REFERENCES `parties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scores`
--

LOCK TABLES `scores` WRITE;
/*!40000 ALTER TABLE `scores` DISABLE KEYS */;
/*!40000 ALTER TABLE `scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `pseudo` (`pseudo`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(4,'Pouik','pouik@motus.local',1,NULL,NULL,NULL,'$2a$12$v.rT2MEyULfZ/Gj6Y7Vz5eURJwjzRRCpDbw3A/PLoW1MNo8ooYYqS','2025-06-17 13:54:03','2025-06-25 13:42:39'),
(5,'TestSansEmail','testsansemail@motus.local',1,NULL,NULL,NULL,'$2a$12$aSjD7WgSAGWpEiTHmN0EQeP/9RuH9L1QLy2HBp8gyJWTZIx0HwAda','2025-06-17 14:12:18','2025-06-25 13:42:39'),
(6,'Joueur6','joueur6@motus.local',1,NULL,NULL,NULL,'$2a$12$dummy.hash.for.new.user','2025-06-25 09:57:58','2025-06-25 13:42:39'),
(7,'Jeremy','jeremy.somoza@laplateforme.io',1,NULL,NULL,NULL,'$2b$10$1W83cUrbs98UdIKESbDxjOype0qZUIYJh0lViLjIISMw8I6H/gY3m','2025-06-25 13:50:33','2025-06-25 13:50:33');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wall_of_fame`
--

DROP TABLE IF EXISTS `wall_of_fame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `wall_of_fame` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `login` varchar(50) NOT NULL,
  `partie_id` int(11) DEFAULT NULL,
  `difficulty` varchar(20) DEFAULT 'facile',
  `words_found` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `partie_id` (`partie_id`),
  KEY `idx_wall_of_fame_score` (`score` DESC),
  CONSTRAINT `wall_of_fame_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wall_of_fame_ibfk_2` FOREIGN KEY (`partie_id`) REFERENCES `parties` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wall_of_fame`
--

LOCK TABLES `wall_of_fame` WRITE;
/*!40000 ALTER TABLE `wall_of_fame` DISABLE KEYS */;
INSERT INTO `wall_of_fame` VALUES
(6,4,150,'Pouik',NULL,'facile',5,'2025-06-18 07:51:50'),
(7,4,200,'Pouik',NULL,'moyen',3,'2025-06-18 07:51:50'),
(8,4,120,'Pouik',NULL,'facile',4,'2025-06-18 07:51:50'),
(9,5,180,'TestSansEmail',NULL,'facile',6,'2025-06-18 07:51:50'),
(10,5,95,'TestSansEmail',NULL,'difficile',2,'2025-06-18 07:51:50'),
(16,6,55,'Joueur6',NULL,'facile',1,'2025-06-25 09:57:58'),
(17,6,55,'PouikTest2',NULL,'facile',1,'2025-06-25 10:06:35'),
(18,6,40,'PouikTest3',NULL,'facile',1,'2025-06-25 11:51:53');
/*!40000 ALTER TABLE `wall_of_fame` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-25 15:52:37
