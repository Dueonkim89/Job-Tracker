-- Populate User table
INSERT INTO `User` 
(`user_id`, `full_name`, `username`, `phone_number`, `email_address`, `passwordHash`) 
VALUES 
(1, 'Ally Alpha', 'ally1', '111-111-1111', 'ally1@email.com', '#111'),
(2, 'Bryson Beta', 'bryson2', '222-222-2222', 'bryson2@email.com', '#222'),
(3, 'Carlos Charlie', 'carlos3', '333-333-3333', 'carlos3@email.com', '#333');

-- Populate Company table
INSERT INTO `Company` 
(`company_id`, `name`, `industry`, `website_url`) 
VALUES 
(1, 'Amazon', 'Technology', 'www.amazon.com'),
(2, 'Bristol-Myers Squibb', 'Healthcare', 'www.bms.com'),
(3, 'Coca-Cola', 'Consumer Products', 'www.coca-cola.com');

-- Populate Application table
INSERT INTO `Application` 
(`application_id`, `company_id`, `job_posting_url`, `location`, `position`) 
VALUES 
(1, 1, 'https://www.amazon.jobs/en/jobs/996246/senior-software-dev-engineer', 'Seattle, WA', 'Senior Software Dev Engineer'),
(2, 1, 'https://www.amazon.jobs/en/jobs/981888/chip-design-engineer', 'Tel Aviv, Israel', 'Chip Design Engineer'),
(3, 2, 'https://careers.bms.com/jobs/R1557110', 'Princeton, NJ', 'Senior Manager, Procurement Operations - Service Desk'),
(4, 3, 'https://careers.coca-colacompany.com/job/15561927/platform-operations-manager-atlanta-ga/', 'Atlanta, GA', 'Platform Operations Manager'),
(5, 3, 'https://careers.coca-colacompany.com/job/15331002/people-analytics-data-scientist-atlanta-ga/', 'Atlanta, GA', 'People Analytics Data Scientist');

-- Populate Skills table
INSERT INTO `Skills` 
(`skill_id`, `skill_name`) 
VALUES 
(1, 'Java'),
(2, 'C++'),
(3, 'C'),
(4, 'Verilog'),
(5, 'Excel'),
(6, 'PowerPoint'),
(7, 'Microsoft Power BI'),
(8, 'R Studio');

-- Populate Application_Skills table
INSERT INTO `Application_Skills` 
(`application_id`, `skill_id`) 
VALUES 
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 6),
(5, 7),
(5, 8);

-- Populate User_Skills table
INSERT INTO `User_Skills` 
(`user_id`, `skill_id`, `rating`) 
VALUES
(1, 1, 5),
(1, 2, 3),
(1, 3, 3),
(2, 5, 5),
(2, 6, 4),
(3, 7, 5),
(3, 8, 4);

-- Populate User_Applications table
INSERT INTO `User_Applications` 
(`user_id`, `application_id`, `status`)
VALUES
(1, 1, 'Phone Screen'),
(1, 2, 'Applied'),
(2, 3, 'Final Round'),
(3, 4, 'Phone Screen'),
(3, 5, 'Final Round');

-- Populate Company_Comments table
INSERT INTO `Company_Comments` 
(`comment_id`, `user_id`, `company_id`, `title`, `text`)
VALUES
(1, 1, 1, 'Great Company', 'Really loved my chat with the hiring manager!'),
(2, 2, 2, 'Great Company', 'Really loved my chat with the hiring manager!'),
(3, 3, 3, 'Great Company', 'Really loved my chat with the hiring manager!');

-- Populate Company_Contacts table
INSERT INTO `Company_Contacts` 
(`contact_id`, `user_id`, `company_id`, `email_address`, `phone_number`, `role`, `notes`)
VALUES
(1, 1, 1, 'HiringManager@amazonemail.com', '444-444-4444', 'Hiring Manager', 'Great chat with this person'),
(2, 2, 2, 'HiringManager@bmsemail.com', '555-555-5555', 'Hiring Manager', 'Great chat with this person'),
(3, 3, 3, 'HiringManager@cocacolaemail.com', '666-666-6666', 'Hiring Manager', 'Great chat with this person');