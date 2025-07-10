-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8mb3 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`action`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`action` (
  `idAction` INT NOT NULL AUTO_INCREMENT,
  `goal` FLOAT NULL DEFAULT NULL,
  `collected` FLOAT NULL DEFAULT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `desc` VARCHAR(10000) NULL DEFAULT NULL,
  `visible` BIT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`idAction`),
  UNIQUE INDEX `idAction_UNIQUE` (`idAction` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`user` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  `displayname` VARCHAR(255) NULL DEFAULT NULL,
  `desc` VARCHAR(2000) NULL DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE INDEX `idUser_UNIQUE` (`idUser` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`actionowner`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`actionowner` (
  `idUser` INT NOT NULL,
  `idAction` INT NOT NULL,
  `isCollab` TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`idUser`, `idAction`),
  INDEX `fk_ActionOwner_Action1_idx` (`idAction` ASC) VISIBLE,
  CONSTRAINT `fk_ActionOwner_Action1`
    FOREIGN KEY (`idAction`)
    REFERENCES `mydb`.`action` (`idAction`),
  CONSTRAINT `fk_ActionOwner_User`
    FOREIGN KEY (`idUser`)
    REFERENCES `mydb`.`user` (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`admin` (
  `username` VARCHAR(40) NOT NULL,
  `password` VARCHAR(40) NOT NULL,
  `owner` TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`username`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`comment` (
  `idComment` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(500) NOT NULL,
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idUser` INT NOT NULL,
  `idAction` INT NOT NULL,
  PRIMARY KEY (`idComment`),
  UNIQUE INDEX `idComment_UNIQUE` (`idComment` ASC) VISIBLE,
  INDEX `fk_Comment_User1_idx` (`idUser` ASC) VISIBLE,
  INDEX `fk_Comment_Action1_idx` (`idAction` ASC) VISIBLE,
  CONSTRAINT `fk_Comment_Action1`
    FOREIGN KEY (`idAction`)
    REFERENCES `mydb`.`action` (`idAction`),
  CONSTRAINT `fk_Comment_User1`
    FOREIGN KEY (`idUser`)
    REFERENCES `mydb`.`user` (`idUser`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`donation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`donation` (
  `idDonation` INT NOT NULL AUTO_INCREMENT,
  `amount` DECIMAL(10,2) NOT NULL,
  `idAction` INT NOT NULL,
  `idUser` INT NOT NULL,
  `donationTime` DATETIME NOT NULL,
  PRIMARY KEY (`idDonation`),
  INDEX `fk_ActionDonation_User1_idx` (`idUser` ASC) VISIBLE,
  CONSTRAINT `fk_ActionDonation_Action1`
    FOREIGN KEY (`idAction`)
    REFERENCES `mydb`.`action` (`idAction`),
  CONSTRAINT `fk_ActionDonation_User1`
    FOREIGN KEY (`idUser`)
    REFERENCES `mydb`.`user` (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`donationreport`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`donationreport` (
  `idDonationReport` INT NOT NULL AUTO_INCREMENT,
  `User_idUser` INT NOT NULL,
  PRIMARY KEY (`idDonationReport`),
  INDEX `fk_DonationReport_User1_idx` (`User_idUser` ASC) VISIBLE,
  CONSTRAINT `fk_DonationReport_User1`
    FOREIGN KEY (`User_idUser`)
    REFERENCES `mydb`.`user` (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`notification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`notification` (
  `idNotification` INT NOT NULL AUTO_INCREMENT,
  `idUserReceiver` INT NOT NULL,
  `text` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`idNotification`),
  INDEX `fk_Notification_User1_idx` (`idUserReceiver` ASC) VISIBLE,
  CONSTRAINT `fk_Notification_User1`
    FOREIGN KEY (`idUserReceiver`)
    REFERENCES `mydb`.`user` (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`refund`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`refund` (
  `idRefund` INT NOT NULL AUTO_INCREMENT,
  `reason` VARCHAR(200) NOT NULL,
  `idDonation` INT NOT NULL,
  PRIMARY KEY (`idRefund`),
  INDEX `fk_refund_donation1_idx` (`idDonation` ASC) VISIBLE,
  CONSTRAINT `fk_refund_donation1`
    FOREIGN KEY (`idDonation`)
    REFERENCES `mydb`.`donation` (`idDonation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`report`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`report` (
  `idReport` INT NOT NULL AUTO_INCREMENT,
  `reportType` SMALLINT NOT NULL,
  `text` VARCHAR(500) NOT NULL,
  `created` DATETIME NOT NULL,
  `idUserReported` INT NULL DEFAULT NULL,
  `idActionReported` INT NULL DEFAULT NULL,
  `idCommentReported` INT NULL DEFAULT NULL,
  `idUserCreated` INT NOT NULL,
  `handledBy` VARCHAR(40) NULL DEFAULT NULL,
  PRIMARY KEY (`idReport`),
  INDEX `fk_Report_User1_idx` (`idUserReported` ASC) VISIBLE,
  INDEX `fk_Report_Action1_idx` (`idActionReported` ASC) VISIBLE,
  INDEX `fk_Report_Comment1_idx` (`idCommentReported` ASC) VISIBLE,
  INDEX `fk_Report_User2_idx` (`idUserCreated` ASC) VISIBLE,
  INDEX `fk_Report_Admin1_idx` (`handledBy` ASC) VISIBLE,
  CONSTRAINT `fk_Report_Action1`
    FOREIGN KEY (`idActionReported`)
    REFERENCES `mydb`.`action` (`idAction`),
  CONSTRAINT `fk_Report_Admin1`
    FOREIGN KEY (`handledBy`)
    REFERENCES `mydb`.`admin` (`username`),
  CONSTRAINT `fk_Report_Comment1`
    FOREIGN KEY (`idCommentReported`)
    REFERENCES `mydb`.`comment` (`idComment`),
  CONSTRAINT `fk_Report_User1`
    FOREIGN KEY (`idUserReported`)
    REFERENCES `mydb`.`user` (`idUser`),
  CONSTRAINT `fk_Report_User2`
    FOREIGN KEY (`idUserCreated`)
    REFERENCES `mydb`.`user` (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`review` (
  `stars` SMALLINT NOT NULL,
  `text` VARCHAR(200) NOT NULL,
  `idUser` INT NOT NULL,
  PRIMARY KEY (`idUser`),
  CONSTRAINT `fk_Review_User1`
    FOREIGN KEY (`idUser`)
    REFERENCES `mydb`.`user` (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
