-- Populate User table
INSERT INTO `User` 
(`userID`, `firstName`, `lastName`, `username`, `phoneNumber`, `emailAddress`, `passwordHash`) 
VALUES 
(1, 'Ally', 'Alpha', 'ally1', '111-111-1111', 'ally1@email.com', '$2b$10$iR7a0nydA2ylmNsVHw77DONjNglrP9CDYiyrbPuogG7lw4Zmuacne'),
(2, 'Bryson', 'Beta', 'bryson2', '222-222-2222', 'bryson2@email.com', '$2b$10$wXq8DLHiVG0jZ36WTLxz9.tbiC4I5M8OpHUqVUAg5qIjphx0Ml8je'),
(3, 'Carlos', 'Charlie', 'carlos3', '333-333-3333', 'carlos3@email.com', '$2b$10$JvZKKtBfUB.Rp122OoWS/.eF0U/XezGaRM.bSsTLvjYKz1LF/9QTS');
-- NOTE: the plaintext password for each is the username (e.g. the ally1 password is ally1)

-- Populate Company table
INSERT INTO `Company` 
(`companyID`, `name`, `industry`, `websiteURL`) 
VALUES 
(1, 'Amazon', 'Technology', 'www.amazon.com'),
(2, 'Blackbaud', 'Technology', 'www.blackbaud.com'),
(3, 'Cloudera', 'Technology', 'www.cloudera.com');

-- Populate Application table
INSERT INTO `Application` 
(`applicationID`, `companyID`, `jobPostingURL`, `location`, `position`) 
VALUES 
(1, 1, 'https://www.amazon.jobs/en/jobs/996246/senior-software-dev-engineer', 'Seattle, WA', 'Senior Software Dev Engineer'),
(2, 1, 'https://www.amazon.jobs/en/jobs/981888/chip-design-engineer', 'Tel Aviv, Israel', 'Chip Design Engineer'),
(3, 2, 'https://careers.blackbaud.com/us/en/job/R0008354/Software-Engineer-devops', 'Remote', 'Software Engineer, devops'),
(4, 3, 'https://cloudera.wd5.myworkdayjobs.com/External_Career/job/USA--Texas--Austin/Sr-Site-Reliability-Engineer_220266-1', 'New York, NY', 'Sr. Site Reliability Engineer'),
(5, 3, 'https://cloudera.wd5.myworkdayjobs.com/External_Career/job/US-California-Santa-Clara-office-1/Senior-Staff-Engineer_220230-1', 'Remote', 'Senior Staff Engineer, Data Hub');

-- Populate Skills table
INSERT INTO `Skills` 
(`skillID`, `skillName`) 
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

-- Populate ApplicationSkills table
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

-- Populate UserApplications table
INSERT INTO `UserApplications` 
(`userID`, `applicationID`, `status`)
VALUES
(1, 1, 'Phone Screen'),
(1, 2, 'Applied'),
(2, 3, 'Final Round'),
(3, 4, 'Phone Screen'),
(3, 5, 'Final Round');

-- Populate CompanyComments table
INSERT INTO `CompanyComments` 
(`commentID`, `userID`, `companyID`, `title`, `text`)
VALUES
(1, 1, 1, 'Great Company', 'Really loved my chat with the hiring manager!'),
(2, 2, 2, 'Great Company', 'Really loved my chat with the hiring manager!'),
(3, 3, 3, 'Great Company', 'Really loved my chat with the hiring manager!');

-- Populate CompanyContacts table
INSERT INTO `CompanyContacts` 
(`contactID`, `userID`, `companyID`, `emailAddress`, `phoneNumber`, `role`, `notes`)
VALUES
(1, 1, 1, 'HiringManager@amazonemail.com', '444-444-4444', 'Hiring Manager', 'Great chat with this person'),
(2, 2, 2, 'HiringManager@bmsemail.com', '555-555-5555', 'Hiring Manager', 'Great chat with this person'),
(3, 3, 3, 'HiringManager@cocacolaemail.com', '666-666-6666', 'Hiring Manager', 'Great chat with this person');