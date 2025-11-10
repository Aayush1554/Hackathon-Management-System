-- ============================================
-- HACKATHON MANAGEMENT SYSTEM - DATABASE SCHEMA
-- ============================================
-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS hackathon;
CREATE DATABASE hackathon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hackathon;

-- ============================================
-- TABLE: users (for all user types)
-- ============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'mentor', 'team_member') NOT NULL,
    phone VARCHAR(20),
    organization VARCHAR(255),
    bio TEXT,
    profile_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: hackathons
-- ============================================
CREATE TABLE hackathons (
    hackathon_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    detailed_description LONGTEXT,
    prize_pool VARCHAR(50) NOT NULL,
    first_prize VARCHAR(50),
    second_prize VARCHAR(50),
    third_prize VARCHAR(50),
    status ENUM('draft', 'open', 'in_progress', 'judging', 'completed', 'cancelled') DEFAULT 'draft',
    
    -- Dates
    registration_start_date DATETIME NOT NULL,
    registration_end_date DATETIME NOT NULL,
    team_formation_start_date DATETIME,
    team_formation_end_date DATETIME,
    development_start_date DATETIME NOT NULL,
    development_end_date DATETIME NOT NULL,
    submission_deadline DATETIME NOT NULL,
    judging_start_date DATETIME,
    judging_end_date DATETIME,
    winner_announcement_date DATETIME,
    
    -- Team constraints
    min_team_size INT DEFAULT 2,
    max_team_size INT DEFAULT 5,
    max_teams INT DEFAULT NULL,
    
    -- Additional info
    banner_image VARCHAR(255),
    rules TEXT,
    judging_criteria TEXT,
    tags VARCHAR(255),
    location VARCHAR(255),
    is_online BOOLEAN DEFAULT TRUE,
    
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: teams
-- ============================================
CREATE TABLE teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(255) NOT NULL,
    hackathon_id INT NOT NULL,
    team_leader_id INT NOT NULL,
    team_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    
    -- Registration info
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE,
    approval_date TIMESTAMP NULL,
    
    -- Project submission
    project_title VARCHAR(255),
    project_description TEXT,
    project_url VARCHAR(255),
    github_repo VARCHAR(255),
    demo_video_url VARCHAR(255),
    presentation_url VARCHAR(255),
    submission_date TIMESTAMP NULL,
    
    -- Scores
    total_score DECIMAL(10,2) DEFAULT 0.00,
    innovation_score DECIMAL(5,2) DEFAULT 0.00,
    technical_score DECIMAL(5,2) DEFAULT 0.00,
    design_score DECIMAL(5,2) DEFAULT 0.00,
    presentation_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Status
    status ENUM('registered', 'confirmed', 'submitted', 'judged', 'winner', 'disqualified') DEFAULT 'registered',
    rank INT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE,
    FOREIGN KEY (team_leader_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_hackathon (hackathon_id),
    INDEX idx_team_code (team_code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: team_members
-- ============================================
CREATE TABLE team_members (
    member_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(100),
    is_leader BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'active', 'left') DEFAULT 'active',
    
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_team_member (team_id, user_id),
    INDEX idx_team (team_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: mentors_hackathons (many-to-many)
-- ============================================
CREATE TABLE mentors_hackathons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mentor_id INT NOT NULL,
    hackathon_id INT NOT NULL,
    expertise_area VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (mentor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE,
    UNIQUE KEY unique_mentor_hackathon (mentor_id, hackathon_id),
    INDEX idx_mentor (mentor_id),
    INDEX idx_hackathon (hackathon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: mentor_team_assignments
-- ============================================
CREATE TABLE mentor_team_assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    mentor_id INT NOT NULL,
    team_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    
    FOREIGN KEY (mentor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    INDEX idx_mentor (mentor_id),
    INDEX idx_team (team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: submissions
-- ============================================
CREATE TABLE submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    hackathon_id INT NOT NULL,
    submission_title VARCHAR(255) NOT NULL,
    description TEXT,
    github_url VARCHAR(255),
    demo_url VARCHAR(255),
    video_url VARCHAR(255),
    documentation_url VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_final BOOLEAN DEFAULT FALSE,
    version INT DEFAULT 1,
    
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE,
    INDEX idx_team (team_id),
    INDEX idx_hackathon (hackathon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: evaluations (judge scoring)
-- ============================================
CREATE TABLE evaluations (
    evaluation_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    judge_id INT NOT NULL,
    innovation_score DECIMAL(5,2) DEFAULT 0.00,
    technical_score DECIMAL(5,2) DEFAULT 0.00,
    design_score DECIMAL(5,2) DEFAULT 0.00,
    presentation_score DECIMAL(5,2) DEFAULT 0.00,
    total_score DECIMAL(10,2) GENERATED ALWAYS AS (innovation_score + technical_score + design_score + presentation_score) STORED,
    comments TEXT,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (judge_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_submission (submission_id),
    INDEX idx_judge (judge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: announcements
-- ============================================
CREATE TABLE announcements (
    announcement_id INT PRIMARY KEY AUTO_INCREMENT,
    hackathon_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    announcement_type ENUM('general', 'important', 'deadline', 'winner') DEFAULT 'general',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_hackathon (hackathon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: notifications
-- ============================================
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    related_entity_type VARCHAR(50),
    related_entity_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read_status (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: activity_logs
-- ============================================
CREATE TABLE activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VIEWS: Leaderboard View
-- ============================================
CREATE VIEW leaderboard_view AS
SELECT 
    t.team_id,
    t.team_name,
    t.hackathon_id,
    h.title as hackathon_title,
    u.full_name as team_leader,
    t.total_score,
    t.rank,
    t.status,
    t.submission_date
FROM teams t
JOIN hackathons h ON t.hackathon_id = h.hackathon_id
JOIN users u ON t.team_leader_id = u.user_id
WHERE t.status IN ('submitted', 'judged', 'winner')
ORDER BY t.hackathon_id, t.total_score DESC;

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, user_type, phone, organization) VALUES
('admin@hackplatform.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Admin', 'admin', '+1234567890', 'HackPlatform');

-- Insert sample mentor
INSERT INTO users (email, password_hash, full_name, user_type, phone, organization, bio) VALUES
('mentor1@hackplatform.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Jane Smith', 'mentor', '+1234567891', 'Tech University', 'AI and Machine Learning expert with 10+ years of experience');

-- Insert sample team members
INSERT INTO users (email, password_hash, full_name, user_type, phone, organization) VALUES
('john.doe@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', 'team_member', '+1234567892', 'State University'),
('jane.doe@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Doe', 'team_member', '+1234567893', 'Tech Institute'),
('bob.smith@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob Smith', 'team_member', '+1234567894', 'City College');

-- Insert sample hackathon
INSERT INTO hackathons (
    title, slug, category, description, detailed_description,
    prize_pool, first_prize, second_prize, third_prize,
    status, registration_start_date, registration_end_date,
    development_start_date, development_end_date, submission_deadline,
    min_team_size, max_team_size, created_by
) VALUES (
    'AI Innovation Challenge',
    'ai-innovation-challenge-2025',
    'Artificial Intelligence',
    'Build the next generation of AI-powered solutions',
    'Join us in building the next generation of AI-powered solutions. This hackathon focuses on practical applications of artificial intelligence to solve real-world problems.',
    '$50,000',
    '$25,000',
    '$15,000',
    '$10,000',
    'open',
    '2025-02-01 00:00:00',
    '2025-02-28 23:59:59',
    '2025-03-06 00:00:00',
    '2025-03-14 23:59:59',
    '2025-03-15 23:59:59',
    2,
    5,
    1
);

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

-- Procedure to update team rankings for a hackathon
CREATE PROCEDURE update_hackathon_rankings(IN p_hackathon_id INT)
BEGIN
    SET @rank = 0;
    UPDATE teams
    SET rank = (@rank := @rank + 1)
    WHERE hackathon_id = p_hackathon_id
      AND status IN ('submitted', 'judged', 'winner')
    ORDER BY total_score DESC;
END //

-- Procedure to calculate team total score from evaluations
CREATE PROCEDURE calculate_team_score(IN p_team_id INT)
BEGIN
    DECLARE v_avg_score DECIMAL(10,2);
    
    SELECT AVG(e.total_score) INTO v_avg_score
    FROM evaluations e
    JOIN submissions s ON e.submission_id = s.submission_id
    WHERE s.team_id = p_team_id AND s.is_final = TRUE;
    
    UPDATE teams
    SET total_score = COALESCE(v_avg_score, 0)
    WHERE team_id = p_team_id;
END //

DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER //

-- Trigger to generate team code
CREATE TRIGGER before_team_insert
BEFORE INSERT ON teams
FOR EACH ROW
BEGIN
    IF NEW.team_code IS NULL OR NEW.team_code = '' THEN
        SET NEW.team_code = CONCAT('TEAM', LPAD(FLOOR(RAND() * 999999), 6, '0'));
    END IF;
END //

-- Trigger to add team leader as team member
CREATE TRIGGER after_team_insert
AFTER INSERT ON teams
FOR EACH ROW
BEGIN
    INSERT INTO team_members (team_id, user_id, is_leader, status)
    VALUES (NEW.team_id, NEW.team_leader_id, TRUE, 'active');
END //

DELIMITER ;

-- ============================================
-- GRANT PERMISSIONS (Optional - for production)
-- ============================================
-- CREATE USER 'hackathon_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON hackathon.* TO 'hackathon_user'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================
-- END OF SCHEMA
-- ============================================
