-- Creating Database
DROP DATABASE IF EXISTS developmentdb;
CREATE DATABASE developmentdb;
USE developmentdb;
-- Creating User Table
DROP TABLE IF EXISTS Users;
CREATE TABLE `Users`(
    `userID` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `phoneNumber` VARCHAR(15) NULL,
    `emailAddress` VARCHAR(50) NOT NULL,
    `passwordHash` VARCHAR(60) NOT NULL
);
-- Creating Company Table
DROP TABLE IF EXISTS Companies;
CREATE TABLE `Companies`(
    `companyID` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE,
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
    FOREIGN KEY(`userID`) REFERENCES `Users`(`userID`),
    FOREIGN KEY(`companyID`) REFERENCES `Companies`(`companyID`)
);
-- Creating Company Comments Table
DROP TABLE IF EXISTS CompanyComments;
CREATE TABLE `CompanyComments`(
    `commentID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userID` INT NOT NULL,
    `companyID` INT NOT NULL,
    `title` VARCHAR(255),
    `text` TINYTEXT,
    FOREIGN KEY(`userID`) REFERENCES `Users`(`userID`),
    FOREIGN KEY(`companyID`) REFERENCES `Companies`(`companyID`)
);
-- Creating Applications Table
DROP TABLE IF EXISTS Applications;
CREATE TABLE `Applications`(
    `applicationID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `companyID` INT NOT NULL,
    `jobPostingURL` VARCHAR(300) NOT NULL UNIQUE,
    `position` VARCHAR(255) NOT NULL,
    `userID` INT NOT NULL,
    `status` VARCHAR(255),
    `location` VARCHAR(255),
    `datetime` DATETIME,
    FOREIGN KEY(`userID`) REFERENCES `Users`(`userID`),
    FOREIGN KEY(`companyID`) REFERENCES `Companies`(`companyID`)
);
-- Creating Skills Table
DROP TABLE IF EXISTS Skills;
CREATE TABLE `Skills`(
    `skillID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL
);
-- Creating User Skills Table
DROP TABLE IF EXISTS UserSkills;
CREATE TABLE `UserSkills`(
    `userID` INT,
    `skillID` INT,
    `rating` INT,
    PRIMARY KEY (`userID`, `skillID`),
    FOREIGN KEY(`userID`) REFERENCES `Users`(`userID`),
    FOREIGN KEY(`skillID`) REFERENCES `Skills`(`skillID`)
);
-- Creating ApplicationSkills Table
DROP TABLE IF EXISTS ApplicationSkills;
CREATE TABLE `ApplicationSkills`(
    `applicationID` INT,
    `skillID` INT,
    PRIMARY KEY (`applicationID`, `skillID`),
    FOREIGN KEY(`applicationID`) REFERENCES `Applications`(`applicationID`),
    FOREIGN KEY(`skillID`) REFERENCES `Skills`(`skillID`)
);