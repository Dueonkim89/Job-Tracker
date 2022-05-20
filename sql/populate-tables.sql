DELETE FROM `ApplicationContacts`;
DELETE FROM `CompanyComments`;
DELETE FROM `UserSkills`;
DELETE FROM `ApplicationSkills`;
DELETE FROM `Skills`;
DELETE FROM `Applications`;
DELETE FROM `Companies`;
DELETE FROM `Users`;

-- Populate Users table
INSERT INTO `Users` 
(`userID`, `firstName`, `lastName`, `username`, `phoneNumber`, `emailAddress`, `passwordHash`) 
VALUES 
(1, 'Ally', 'Alpha', 'ally1', '111-111-1111', 'ally1@email.com', '$2b$10$iR7a0nydA2ylmNsVHw77DONjNglrP9CDYiyrbPuogG7lw4Zmuacne'),
(2, 'Bryson', 'Beta', 'bryson2', '222-222-2222', 'bryson2@email.com', '$2b$10$wXq8DLHiVG0jZ36WTLxz9.tbiC4I5M8OpHUqVUAg5qIjphx0Ml8je'),
(3, 'Carlos', 'Charlie', 'carlos3', '333-333-3333', 'carlos3@email.com', '$2b$10$JvZKKtBfUB.Rp122OoWS/.eF0U/XezGaRM.bSsTLvjYKz1LF/9QTS');
-- NOTE: the plaintext password for each is the username (e.g. the ally1 password is ally1)
-- I manually calculated the hash values

-- Populate Companies table
INSERT INTO `Companies` 
(`companyID`, `name`, `industry`, `websiteURL`) 
VALUES 
(1, 'Amazon', 'Technology', 'www.amazon.com'),
(2, 'Blackbaud', 'Technology', 'www.blackbaud.com'),
(3, 'Cloudera', 'Technology', 'www.cloudera.com');

-- Populate Jobs table
INSERT INTO `Applications` 
(`applicationID`, `companyID`, `jobPostingURL`, `position`, `userID`, `status`, `location`, `datetime`, `notes`)
VALUES 
(1, 1, 'https://www.amazon.jobs/en/jobs/996246/senior-software-dev-engineer', 'Senior Software Dev Engineer', 1, 'Phone Interview', 'Seattle, WA', convert_tz('2022-01-01 00:00:00', @@session.time_zone, '+00:00'), 'here are my notes'),
(2, 1, 'https://www.amazon.jobs/en/jobs/981888/chip-design-engineer', 'Chip Design Engineer', 1, 'Applied', 'Tel Aviv, Israel', convert_tz('2022-01-02 00:00:00', @@session.time_zone, '+00:00'), 'here are my notes'),
(3, 2, 'https://careers.blackbaud.com/us/en/job/R0008354/Software-Engineer-devops', 'Software Engineer, devops', 2, 'Final Round', 'Remote', convert_tz('2022-01-03 00:00:00', @@session.time_zone, '+00:00'), 'here are my notes'),
(4, 3, 'https://cloudera.wd5.myworkdayjobs.com/External_Career/job/USA--Texas--Austin/Sr-Site-Reliability-Engineer_220266-1', 'Sr. Site Reliability Engineer', 3, 'Phone Interview', 'New York, NY', convert_tz('2022-01-04 00:00:00', @@session.time_zone, '+00:00'), 'here are my notes'),
(5, 3, 'https://cloudera.wd5.myworkdayjobs.com/External_Career/job/US-California-Santa-Clara-office-1/Senior-Staff-Engineer_220230-1', 'Senior Staff Engineer, Data Hub', 3, 'Final Round', 'Remote', convert_tz('2022-01-05 00:00:00', @@session.time_zone, '+00:00'), 'here are my notes');

-- Populate Skills table
INSERT INTO `Skills` 
(`skillID`, `name`) 
VALUES 
(1, 'Java'),
(2, 'C++'),
(3, 'C'),
(4, 'Verilog'),
(5, 'Microsoft Azure'),
(6, 'AWS'),
(7, 'Python'),
(8, 'Go'),
(9, 'Hadoop');

-- Populate JobSkills table
INSERT INTO `ApplicationSkills` 
(`applicationID`, `skillID`) 
VALUES 
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(2, 4),
(3, 2),
(3, 5),
(4, 6),
(4, 7),
(4, 8),
(5, 1),
(5, 9);

-- Populate UserSkills table
INSERT INTO `UserSkills` 
(`userID`, `skillID`, `rating`) 
VALUES
(1, 1, 5),
(1, 2, 3),
(1, 3, 3),
(2, 5, 5),
(2, 6, 4),
(3, 7, 5),
(3, 8, 4);

-- Populate CompanyComments table
INSERT INTO `CompanyComments` 
(`commentID`, `userID`, `companyID`, `title`, `text`, `datetime`)
VALUES
(1, 1, 1, 'Great Company', 'Really loved my chat with the hiring manager!', convert_tz('2022-01-01 00:00:00', @@session.time_zone, '+00:00')),
(2, 2, 2, 'Great Company', 'Really loved my chat with the hiring manager!', convert_tz('2022-01-02 00:00:00', @@session.time_zone, '+00:00')),
(3, 3, 3, 'Great Company', 'Really loved my chat with the hiring manager!', convert_tz('2022-01-03 00:00:00', @@session.time_zone, '+00:00'));

-- Populate ApplicationContacts table
INSERT INTO `ApplicationContacts` 
(`contactID`, `applicationID`, `firstName`, `lastName`, `emailAddress`, `phoneNumber`, `role`)
VALUES
(1, 1, 'Amanda', 'Alpha', 'HiringManager@amazonemail.com', '444-444-4444', 'Hiring Manager 1'),
(2, 1, 'Barry', 'Beta', 'HiringManager2@amazonemail.com', '444-444-5555', 'Hiring Manager 2'),
(3, 3, 'Cassandra', 'Charlie', 'HiringManager@blackbaudemail.com', '555-555-5555', 'Hiring Manager'),
(4, 5, 'DeAndre', 'Delta', 'HiringManager@clouderaemail.com', '666-666-6666', 'Hiring Manager');