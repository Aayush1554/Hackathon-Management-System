-- Simple setup without dropping database
USE hackathon;

-- Drop tables if they exist (in correct order due to foreign keys)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS team_mentor_communications;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS mentors_hackathons;
DROP TABLE IF EXISTS hackathons;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Create users table
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

-- Create hackathons table
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
    registration_start_date DATETIME NOT NULL,
    registration_end_date DATETIME NOT NULL,
    team_formation_start_date DATETIME,
    team_formation_end_date DATETIME,
    hackathon_start_date DATETIME NOT NULL,
    hackathon_end_date DATETIME NOT NULL,
    submission_deadline DATETIME NOT NULL,
    judging_start_date DATETIME,
    judging_end_date DATETIME,
    result_announcement_date DATETIME,
    min_team_size INT DEFAULT 1,
    max_team_size INT DEFAULT 5,
    max_teams INT,
    current_teams_count INT DEFAULT 0,
    rules TEXT,
    judging_criteria TEXT,
    prizes_details TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    external_links JSON,
    tags JSON,
    banner_image VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    leaderboard_finalized BOOLEAN DEFAULT FALSE,
    leaderboard_finalized_at DATETIME NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create teams table
CREATE TABLE teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    hackathon_id INT NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    team_leader_id INT NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    status ENUM('forming', 'active', 'submitted', 'judged', 'winner', 'disqualified') DEFAULT 'forming',
    github_repo VARCHAR(255),
    project_link VARCHAR(255),
    project_zip VARCHAR(255),
    submission_date DATETIME,
    total_score DECIMAL(10,2) DEFAULT 0,
    rank INT NULL,
    final_rank INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_team_name_per_hackathon (hackathon_id, team_name),
    INDEX idx_hackathon (hackathon_id),
    INDEX idx_leader (team_leader_id),
    INDEX idx_status (status),
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE,
    FOREIGN KEY (team_leader_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create team_members table
CREATE TABLE team_members (
    member_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('leader', 'member') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_member_per_team (team_id, user_id),
    INDEX idx_team (team_id),
    INDEX idx_user (user_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create submissions table
CREATE TABLE submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    hackathon_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    github_url VARCHAR(255),
    demo_url VARCHAR(255),
    video_url VARCHAR(255),
    project_zip VARCHAR(255),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_final BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'submitted', 'under_review', 'evaluated') DEFAULT 'submitted',
    INDEX idx_team (team_id),
    INDEX idx_hackathon (hackathon_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create mentors_hackathons table
CREATE TABLE mentors_hackathons (
    mentor_hackathon_id INT PRIMARY KEY AUTO_INCREMENT,
    mentor_id INT NOT NULL,
    hackathon_id INT NOT NULL,
    specialization VARCHAR(255),
    availability TEXT,
    max_teams INT DEFAULT 5,
    assigned_teams_count INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_mentor_per_hackathon (mentor_id, hackathon_id),
    INDEX idx_mentor (mentor_id),
    INDEX idx_hackathon (hackathon_id),
    FOREIGN KEY (mentor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create evaluations table  
CREATE TABLE evaluations (
    evaluation_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    mentor_id INT NOT NULL,
    innovation_score INT CHECK (innovation_score BETWEEN 0 AND 10),
    technical_score INT CHECK (technical_score BETWEEN 0 AND 10),
    design_score INT CHECK (design_score BETWEEN 0 AND 10),
    impact_score INT CHECK (impact_score BETWEEN 0 AND 10),
    presentation_score INT CHECK (presentation_score BETWEEN 0 AND 10),
    total_score DECIMAL(10,2),
    feedback TEXT,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_evaluation (submission_id, mentor_id),
    INDEX idx_submission (submission_id),
    INDEX idx_mentor (mentor_id),
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create team_mentor_communications table
CREATE TABLE team_mentor_communications (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    sender_id INT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    INDEX idx_team (team_id),
    INDEX idx_sender (sender_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create notifications table
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_is_read (is_read),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create announcements table
CREATE TABLE announcements (
    announcement_id INT PRIMARY KEY AUTO_INCREMENT,
    hackathon_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_hackathon (hackathon_id),
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create activity_logs table
CREATE TABLE activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_entity (entity_type, entity_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Database tables created successfully!' as message;
