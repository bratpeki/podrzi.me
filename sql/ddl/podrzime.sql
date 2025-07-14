-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 192.168.0.120    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `action`
--

DROP TABLE IF EXISTS `action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `action` (
  `idAction` int NOT NULL AUTO_INCREMENT,
  `goal` float NOT NULL DEFAULT '0',
  `collected` float NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` varchar(10000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visible` tinyint DEFAULT '1',
  `primaryImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `collaborators` varbinary(255) DEFAULT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idAction`),
  UNIQUE KEY `idAction_UNIQUE` (`idAction`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `actionowner`
--

DROP TABLE IF EXISTS `actionowner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actionowner` (
  `idUser` int NOT NULL,
  `idAction` int NOT NULL,
  `isCollab` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`idUser`,`idAction`),
  KEY `fk_ActionOwner_Action1_idx` (`idAction`),
  CONSTRAINT `FK181w54wqbw2r4m46yk4sosese` FOREIGN KEY (`idAction`) REFERENCES `action` (`idAction`),
  CONSTRAINT `fk_ActionOwner_User` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `username` varchar(40) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `owner` bit(1) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `idComment` int NOT NULL AUTO_INCREMENT,
  `text` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idUser` int NOT NULL,
  `idAction` int unsigned NOT NULL,
  PRIMARY KEY (`idComment`),
  UNIQUE KEY `idComment_UNIQUE` (`idComment`),
  UNIQUE KEY `idAction_UNIQUE` (`idAction`),
  KEY `fk_Comment_User1_idx` (`idUser`),
  KEY `fk_Comment_Action1_idx` (`idAction`),
  CONSTRAINT `fk_Comment_User1` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `donation`
--

DROP TABLE IF EXISTS `donation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donation` (
  `idDonation` int NOT NULL AUTO_INCREMENT,
  `amount` float DEFAULT NULL,
  `idAction` int NOT NULL,
  `idUser` int NOT NULL,
  `donationTime` datetime NOT NULL,
  PRIMARY KEY (`idDonation`),
  KEY `fk_ActionDonation_User1_idx` (`idUser`),
  KEY `FKskenriiwx4liur6e7e19xhpch` (`idAction`),
  CONSTRAINT `fk_ActionDonation_User1` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`),
  CONSTRAINT `FKskenriiwx4liur6e7e19xhpch` FOREIGN KEY (`idAction`) REFERENCES `action` (`idAction`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `donationreport`
--

DROP TABLE IF EXISTS `donationreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donationreport` (
  `idDonationReport` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  PRIMARY KEY (`idDonationReport`),
  KEY `fk_DonationReport_User1_idx` (`idUser`),
  CONSTRAINT `fk_DonationReport_User1` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `idMessage` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `messageText` varchar(500) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idMessage`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `idNotification` int NOT NULL AUTO_INCREMENT,
  `idUserReceiver` int NOT NULL,
  `text` varchar(200) NOT NULL,
  PRIMARY KEY (`idNotification`),
  KEY `fk_Notification_User1_idx` (`idUserReceiver`),
  CONSTRAINT `fk_Notification_User1` FOREIGN KEY (`idUserReceiver`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `refund`
--

DROP TABLE IF EXISTS `refund`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refund` (
  `idRefund` int NOT NULL AUTO_INCREMENT,
  `reason` varchar(200) NOT NULL,
  `idDonation` int NOT NULL,
  PRIMARY KEY (`idRefund`),
  KEY `fk_refund_donation1_idx` (`idDonation`),
  CONSTRAINT `fk_refund_donation1` FOREIGN KEY (`idDonation`) REFERENCES `donation` (`idDonation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report` (
  `idReport` int NOT NULL AUTO_INCREMENT,
  `reportType` smallint NOT NULL,
  `text` varchar(500) NOT NULL,
  `created` datetime NOT NULL,
  `idUserReported` int unsigned DEFAULT NULL,
  `idActionReported` int unsigned DEFAULT NULL,
  `idCommentReported` int unsigned DEFAULT NULL,
  `idUserCreated` int NOT NULL,
  `handledBy` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`idReport`),
  UNIQUE KEY `idActionReported_UNIQUE` (`idActionReported`),
  UNIQUE KEY `idUserReported_UNIQUE` (`idUserReported`),
  UNIQUE KEY `idCommentReported_UNIQUE` (`idCommentReported`),
  KEY `fk_Report_User1_idx` (`idUserReported`),
  KEY `fk_Report_Action1_idx` (`idActionReported`),
  KEY `fk_Report_Comment1_idx` (`idCommentReported`),
  KEY `fk_Report_User2_idx` (`idUserCreated`),
  KEY `fk_Report_Admin1_idx` (`handledBy`),
  CONSTRAINT `fk_Report_Admin1` FOREIGN KEY (`handledBy`) REFERENCES `admin` (`username`),
  CONSTRAINT `fk_Report_User2` FOREIGN KEY (`idUserCreated`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `stars` smallint NOT NULL,
  `text` varchar(200) NOT NULL,
  `idUser` int NOT NULL,
  PRIMARY KEY (`idUser`),
  CONSTRAINT `fk_Review_User1` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `displayName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desc` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagePath` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `idUser_UNIQUE` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-15  0:43:08
