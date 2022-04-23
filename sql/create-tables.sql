-- Creating Database
DROP DATABASE IF EXISTS developmentdb;
CREATE DATABASE developmentdb;
USE developmentdb;
-- Creating User Table
DROP TABLE IF EXISTS User;
CREATE TABLE `User`(
    `userID` INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `phoneNumber` VARCHAR(15) NULL,
    `emailAddress` VARCHAR(50) NOT NULL,
    `passwordHash` VARCHAR(60) NOT NULL,
    UNIQUE INDEX `uq_username` (`username` ASC),
    UNIQUE INDEX `uq_phoneNumber` (`phoneNumber` ASC),
    UNIQUE INDEX `uq_emailAddress` (`emailAddress` ASC)
);
-- Creating Company Table
DROP TABLE IF EXISTS Company;
CREATE TABLE `Company`(
    `companyID` INT(20) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `industry` VARCHAR(255),
    `websiteURL` VARCHAR(255)
);
-- Creating Company Contacts Table
DROP TABLE IF EXISTS CompanyContacts;
CREATE TABLE `CompanyContacts`(
    `contactID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userID` INT NOT NULL,
    `phoneNumber` VARCHAR(15) NULL,
    `emailAddress` VARCHAR(50) NOT NULL,
    `companyID` INT NOT NULL,
    `role` VARCHAR(255),
    `notes` TINYTEXT,
    FOREIGN KEY(`userID`) REFERENCES `User`(`userID`),
    FOREIGN KEY(`companyID`) REFERENCES `Company`(`companyID`),
    UNIQUE INDEX `uq_phoneNumber` (`phoneNumber` ASC),
    UNIQUE INDEX `uq_emailAddress` (`emailAddress` ASC)
);
-- Creating Company Comments Table
DROP TABLE IF EXISTS CompanyComments;
CREATE TABLE `CompanyComments`(
    `commentID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userID` INT NOT NULL,
    `companyID` INT NOT NULL,
    `title` VARCHAR(255),
    `text` TINYTEXT,
    FOREIGN KEY(`userID`) REFERENCES `User`(`userID`),
    FOREIGN KEY(`companyID`) REFERENCES `Company`(`companyID`)
);
-- Creating Application Table
DROP TABLE IF EXISTS Application;
CREATE TABLE `Application`(
    `applicationID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `companyID` INT NOT NULL,
    `jobPostingURL` VARCHAR(300),
    `location` VARCHAR(255),
    `position` VARCHAR(255),
    FOREIGN KEY(`companyID`) REFERENCES `Company`(`companyID`)
);
-- Creating UserApplications Table
DROP TABLE IF EXISTS UserApplications;
CREATE TABLE `UserApplications`(
    `userID` INT NOT NULL,
    `applicationID` INT NOT NULL,
    `status` VARCHAR(255),
    PRIMARY KEY (`userID`, `applicationID`),
    FOREIGN KEY(`userID`) REFERENCES `User`(`userID`),
    FOREIGN KEY(`applicationID`) REFERENCES `Application`(`applicationID`)
);
-- Creating Skills Table
DROP TABLE IF EXISTS Skills;
CREATE TABLE `Skills`(
    `skillID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `skillName` VARCHAR(50) NOT NULL
);
-- Creating User Skills Table
DROP TABLE IF EXISTS UserSkills;
CREATE TABLE `UserSkills`(
    `userID` INT,
    `skillID` INT,
    `rating` INT,
    PRIMARY KEY (`userID`, `skillID`),
    FOREIGN KEY(`userID`) REFERENCES `User`(`userID`),
    FOREIGN KEY(`skillID`) REFERENCES `Skills`(`skillID`)
);
-- Creating Applications Skills Table
DROP TABLE IF EXISTS ApplicationSkills;
CREATE TABLE `ApplicationSkills`(
    `applicationID` INT,
    `skillID` INT,
    PRIMARY KEY (`applicationID`, `skillID`),
    FOREIGN KEY(`applicationID`) REFERENCES `Application`(`applicationID`),
    FOREIGN KEY(`skillID`) REFERENCES `Skills`(`skillID`)
);