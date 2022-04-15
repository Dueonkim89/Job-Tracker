-- Creating Database
DROP DATABASE IF EXISTS developmentdb;
CREATE DATABASE developmentdb;
USE developmentdb;
-- Creating User Table
DROP TABLE IF EXISTS User;
CREATE TABLE `User`(
    `user_id` INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `full_name` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(15) NULL,
    `email_address` VARCHAR(50) NOT NULL,
    `passwordHash` VARCHAR(32) NOT NULL,
    UNIQUE INDEX `uq_username` (`username` ASC),
    UNIQUE INDEX `uq_phone_number` (`phone_number` ASC),
    UNIQUE INDEX `uq_email_address` (`email_address` ASC)
);
-- Creating Company Table
DROP TABLE IF EXISTS Company;
CREATE TABLE `Company`(
    `company_id` INT(20) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `industry` VARCHAR(255),
    `website_url` VARCHAR(255)
);
-- Creating Company Contacts Table
DROP TABLE IF EXISTS Company_Contacts;
CREATE TABLE `Company_Contacts`(
    `contact_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `phone_number` VARCHAR(15) NULL,
    `email_address` VARCHAR(50) NOT NULL,
    `company_id` INT NOT NULL,
    `role` VARCHAR(255),
    `notes` TINYTEXT,
    FOREIGN KEY(`user_id`) REFERENCES `User`(`user_id`),
    FOREIGN KEY(`company_id`) REFERENCES `Company`(`company_id`),
    UNIQUE INDEX `uq_phone_number` (`phone_number` ASC),
    UNIQUE INDEX `uq_email_address` (`email_address` ASC)
);
-- Creating Company Comments Table
DROP TABLE IF EXISTS Company_Comments;
CREATE TABLE `Company_Comments`(
    `comment_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `company_id` INT NOT NULL,
    `title` VARCHAR(255),
    `text` TINYTEXT,
    FOREIGN KEY(`user_id`) REFERENCES `User`(`user_id`),
    FOREIGN KEY(`company_id`) REFERENCES `Company`(`company_id`)
);
-- Creating Application Table
DROP TABLE IF EXISTS Application;
CREATE TABLE `Application`(
    `application_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `company_id` INT NOT NULL,
    `job_posting_url` VARCHAR(300),
    `location` VARCHAR(255),
    `position` VARCHAR(255),
    FOREIGN KEY(`company_id`) REFERENCES `Company`(`company_id`)
);
-- Creating User_Applications Table
DROP TABLE IF EXISTS User_Applications;
CREATE TABLE `User_Applications`(
    `user_id` INT NOT NULL,
    `application_id` INT NOT NULL,
    `status` VARCHAR(255),
    PRIMARY KEY (`user_id`, `application_id`),
    FOREIGN KEY(`user_id`) REFERENCES `User`(`user_id`),
    FOREIGN KEY(`application_id`) REFERENCES `Application`(`application_id`)
);
-- Creating Skills Table
DROP TABLE IF EXISTS Skills;
CREATE TABLE `Skills`(
    `skill_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `skill_name` VARCHAR(50) NOT NULL
);
-- Creating User Skills Table
DROP TABLE IF EXISTS User_Skills;
CREATE TABLE `User_Skills`(
    `user_id` INT,
    `skill_id` INT,
    `rating` INT,
    PRIMARY KEY (`user_id`, `skill_id`),
    FOREIGN KEY(`user_id`) REFERENCES `User`(`user_id`),
    FOREIGN KEY(`skill_id`) REFERENCES `Skills`(`skill_id`)
);
-- Creating Applications Skills Table
DROP TABLE IF EXISTS Application_Skills;
CREATE TABLE `Application_Skills`(
    `application_id` INT,
    `skill_id` INT,
    PRIMARY KEY (`application_id`, `skill_id`),
    FOREIGN KEY(`application_id`) REFERENCES `Application`(`application_id`),
    FOREIGN KEY(`skill_id`) REFERENCES `Skills`(`skill_id`)
);