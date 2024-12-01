-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.31 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for quick_talk_new
CREATE DATABASE IF NOT EXISTS `quick_talk_new` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `quick_talk_new`;

-- Dumping structure for table quick_talk_new.chat
CREATE TABLE IF NOT EXISTS `chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `from_user_id` int NOT NULL,
  `to_user_id` int NOT NULL,
  `message` text NOT NULL,
  `date_time` datetime NOT NULL,
  `chat_status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_chat_user1_idx` (`from_user_id`),
  KEY `fk_chat_user2_idx` (`to_user_id`),
  KEY `fk_chat_chat_status1_idx` (`chat_status_id`),
  CONSTRAINT `fk_chat_chat_status1` FOREIGN KEY (`chat_status_id`) REFERENCES `chat_status` (`id`),
  CONSTRAINT `fk_chat_user1` FOREIGN KEY (`from_user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_chat_user2` FOREIGN KEY (`to_user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table quick_talk_new.chat: ~18 rows (approximately)
INSERT INTO `chat` (`id`, `from_user_id`, `to_user_id`, `message`, `date_time`, `chat_status_id`) VALUES
	(1, 7, 8, 'Message 1', '2024-10-03 19:46:13', 1),
	(2, 7, 8, 'Message 2', '2024-10-03 19:46:31', 1),
	(3, 8, 7, 'Message 3', '2024-10-03 19:46:48', 1),
	(4, 7, 10, 'Hi', '2024-10-04 16:25:54', 2),
	(5, 12, 7, 'Hi', '2024-10-07 12:42:38', 1),
	(6, 12, 8, 'Hello', '2024-10-07 12:43:55', 2),
	(7, 7, 8, 'Hello', '2024-10-07 22:16:01', 2),
	(8, 13, 7, 'Hi', '2024-10-08 14:40:28', 1),
	(9, 13, 9, 'Hi', '2024-10-08 14:40:45', 2),
	(10, 13, 7, 'Hello', '2024-10-08 21:35:01', 1),
	(11, 14, 7, 'Hi', '2024-10-08 21:41:25', 1),
	(12, 7, 14, 'Hello', '2024-10-08 21:47:29', 2),
	(13, 13, 7, 'Komd', '2024-10-08 22:19:18', 1),
	(14, 13, 7, 'Hello', '2024-10-09 12:32:03', 1),
	(15, 15, 7, 'Hi', '2024-10-09 12:34:40', 1),
	(16, 7, 15, 'Sffgg', '2024-10-09 12:35:15', 1),
	(17, 16, 7, 'Hi', '2024-11-21 12:28:28', 2),
	(18, 16, 9, 'Komd', '2024-11-21 12:29:41', 2),
	(19, 13, 7, 'Hi', '2024-12-01 08:32:11', 1),
	(20, 13, 8, 'Hi', '2024-12-01 08:34:56', 2),
	(21, 7, 13, 'Hi', '2024-12-01 08:36:45', 2);

-- Dumping structure for table quick_talk_new.chat_status
CREATE TABLE IF NOT EXISTS `chat_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table quick_talk_new.chat_status: ~2 rows (approximately)
INSERT INTO `chat_status` (`id`, `name`) VALUES
	(1, 'Seen'),
	(2, 'Unseen');

-- Dumping structure for table quick_talk_new.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mobile` varchar(10) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `password` varchar(20) NOT NULL,
  `registered_date_time` datetime NOT NULL,
  `user_status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_user_status_idx` (`user_status_id`),
  CONSTRAINT `fk_user_user_status` FOREIGN KEY (`user_status_id`) REFERENCES `user_status` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table quick_talk_new.user: ~10 rows (approximately)
INSERT INTO `user` (`id`, `mobile`, `first_name`, `last_name`, `password`, `registered_date_time`, `user_status_id`) VALUES
	(7, '0771112223', 'Sahan', 'Bandara', 'Slbh2001@', '2024-10-01 15:13:24', 2),
	(8, '0771112224', 'Nadun', 'Bandara', 'Slbh2001@', '2024-10-01 15:14:34', 2),
	(9, '0771234567', 'Amal', 'Herath', 'Slbh2001@', '2024-10-03 22:37:50', 1),
	(10, '0781212123', 'Mahela', 'Matheesha', 'Slbh2001@', '2024-10-03 22:38:03', 1),
	(11, '0751231231', 'Kumara', 'Sangakkara', 'Slbh2001@', '2024-10-03 22:39:16', 2),
	(12, '0711212123', 'Nalin', 'Bandara', 'Slbh2001@', '2024-10-03 22:39:29', 1),
	(13, '0702303068', 'Sandeepa', 'Nadun', 'Slbh2001@', '2024-10-08 14:39:46', 2),
	(14, '0775240125', 'Ruchira', 'Kaushalya', 'Slbh2001@', '2024-10-08 21:40:36', 2),
	(15, '0771472583', 'Sadun', 'Herath', 'Slbh2001@', '2024-10-09 12:33:35', 2),
	(16, '0774561234', 'Saduni', 'Ranasinghe ', 'Slbh2001@', '2024-11-21 12:19:43', 2);

-- Dumping structure for table quick_talk_new.user_status
CREATE TABLE IF NOT EXISTS `user_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table quick_talk_new.user_status: ~2 rows (approximately)
INSERT INTO `user_status` (`id`, `name`) VALUES
	(1, 'Online'),
	(2, 'Offline');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
