# HACKATHON MANAGEMENT SYSTEM - COMPLETE DATABASE DOCUMENTATION

## 📊 DATABASE OVERVIEW

**Database Name:** `hackathon`  
**Character Set:** `utf8mb4`  
**Collation:** `utf8mb4_unicode_ci`  
**Database Engine:** InnoDB (MySQL/MariaDB)

---

## 🗂️ COMPLETE TABLE STRUCTURE

### TABLE 1: `users`
**Purpose:** Store all user accounts (admins, mentors, team members)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email (login) |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| full_name | VARCHAR(255) | NOT NULL | User's full name |
| user_type | ENUM | NOT NULL | 'admin', 'mentor', 'team_member' |
| phone | VARCHAR(20) | NULL | Contact number |
| organization | VARCHAR(255) | NULL | University/Company |
| bio | TEXT | NULL | User biography |
| profile_image | VARCHAR(255) | NULL | Profile picture URL |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update |
| last_login | TIMESTAMP | NULL | Last login time |

**Indexes:**
- PRIMARY KEY: user_id
- UNIQUE INDEX: email
- INDEX: idx_email (email)
- INDEX: idx_user_type (user_type)

---

### TABLE 2: `hackathons`
**Purpose:** Store hackathon events and details

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| hackathon_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique hackathon ID |
| title | VARCHAR(255) | NOT NULL | Hackathon title |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| category | VARCHAR(100) | NOT NULL | Category (AI, Web3, etc.) |
| description | TEXT | NOT NULL | Short description |
| detailed_description | LONGTEXT | NULL | Full description |
| prize_pool | VARCHAR(50) | NOT NULL | Total prize pool |
| first_prize | VARCHAR(50) | NULL | 1st place prize |
| second_prize | VARCHAR(50) | NULL | 2nd place prize |
| third_prize | VARCHAR(50) | NULL | 3rd place prize |
| status | ENUM | DEFAULT 'draft' | 'draft', 'open', 'in_progress', 'judging', 'completed', 'cancelled' |
| leaderboard_finalized | BOOLEAN | DEFAULT FALSE | If leaderboard is locked |
| leaderboard_finalized_at | TIMESTAMP | NULL | When leaderboard was finalized |
| registration_start_date | DATETIME | NOT NULL | When registration opens |
| registration_end_date | DATETIME | NOT NULL | When registration closes |
| team_formation_start_date | DATETIME | NULL | Team formation start |
| team_formation_end_date | DATETIME | NULL | Team formation end |
| development_start_date | DATETIME | NOT NULL | Development period start |
| development_end_date | DATETIME | NOT NULL | Development period end |
| submission_deadline | DATETIME | NOT NULL | Project submission deadline |
| judging_start_date | DATETIME | NULL | Judging begins |
| judging_end_date | DATETIME | NULL | Judging ends |
| winner_announcement_date | DATETIME | NULL | Winners announced |
| min_team_size | INT | DEFAULT 2 | Minimum team members |
| max_team_size | INT | DEFAULT 5 | Maximum team members |
| max_teams | INT | NULL | Max participating teams |
| banner_image | VARCHAR(255) | NULL | Banner image URL |
| rules | TEXT | NULL | Hackathon rules |
| judging_criteria | TEXT | NULL | How judging works |
| tags | VARCHAR(255) | NULL | Keywords/tags |
| location | VARCHAR(255) | NULL | Physical location/address (for offline events) |
| is_online | BOOLEAN | DEFAULT TRUE | Online event (TRUE) or Offline/Onsite (FALSE) |
| created_by | INT | NOT NULL, FK | Admin who created it |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update |

**Foreign Keys:**
- created_by → users(user_id) ON DELETE RESTRICT

**Indexes:**
- PRIMARY KEY: hackathon_id
- UNIQUE INDEX: slug
- INDEX: idx_status (status)
- INDEX: idx_category (category)
- INDEX: idx_slug (slug)
- INDEX: idx_leaderboard_finalized (leaderboard_finalized)

---

### TABLE 3: `teams`
**Purpose:** Store team information and project submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| team_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique team ID |
| team_name | VARCHAR(255) | NOT NULL | Team name |
| hackathon_id | INT | NOT NULL, FK | Which hackathon |
| team_leader_id | INT | NOT NULL, FK | Team leader user |
| team_code | VARCHAR(20) | UNIQUE, NOT NULL | Join code (auto-generated) |
| description | TEXT | NULL | Team description |
| registration_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When team registered |
| is_approved | BOOLEAN | DEFAULT FALSE | Admin approval |
| approval_date | TIMESTAMP | NULL | When approved |
| project_title | VARCHAR(255) | NULL | Project name |
| project_description | TEXT | NULL | Project details |
| project_url | VARCHAR(255) | NULL | Live demo URL |
| github_repo | VARCHAR(255) | NULL | GitHub repository |
| demo_video_url | VARCHAR(255) | NULL | Demo video |
| presentation_url | VARCHAR(255) | NULL | Presentation slides |
| submission_date | TIMESTAMP | NULL | When project submitted |
| total_score | DECIMAL(10,2) | DEFAULT 0.00 | Total score |
| innovation_score | DECIMAL(5,2) | DEFAULT 0.00 | Innovation score |
| technical_score | DECIMAL(5,2) | DEFAULT 0.00 | Technical score |
| design_score | DECIMAL(5,2) | DEFAULT 0.00 | Design score |
| presentation_score | DECIMAL(5,2) | DEFAULT 0.00 | Presentation score |
| status | ENUM | DEFAULT 'registered' | 'registered', 'confirmed', 'submitted', 'judged', 'winner', 'disqualified' |
| rank | INT | NULL | Position in leaderboard |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update |

**Foreign Keys:**
- hackathon_id → hackathons(hackathon_id) ON DELETE CASCADE
- team_leader_id → users(user_id) ON DELETE RESTRICT

**Indexes:**
- PRIMARY KEY: team_id
- UNIQUE INDEX: team_code
- INDEX: idx_hackathon (hackathon_id)
- INDEX: idx_team_code (team_code)
- INDEX: idx_status (status)

---

### TABLE 4: `team_members`
**Purpose:** Many-to-many relationship between teams and users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| member_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique member ID |
| team_id | INT | NOT NULL, FK | Team reference |
| user_id | INT | NOT NULL, FK | User reference |
| role | VARCHAR(100) | NULL | Role in team |
| is_leader | BOOLEAN | DEFAULT FALSE | Is team leader? |
| joined_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When joined |
| status | ENUM | DEFAULT 'active' | 'pending', 'active', 'left' |

**Foreign Keys:**
- team_id → teams(team_id) ON DELETE CASCADE
- user_id → users(user_id) ON DELETE CASCADE

**Indexes:**
- PRIMARY KEY: member_id
- UNIQUE KEY: unique_team_member (team_id, user_id)
- INDEX: idx_team (team_id)
- INDEX: idx_user (user_id)

---

### TABLE 5: `mentors_hackathons`
**Purpose:** Many-to-many relationship - mentors available for hackathons

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique ID |
| mentor_id | INT | NOT NULL, FK | Mentor user |
| hackathon_id | INT | NOT NULL, FK | Hackathon |
| expertise_area | VARCHAR(255) | NULL | Area of expertise |
| is_available | BOOLEAN | DEFAULT TRUE | Available to mentor |
| assigned_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When assigned |

**Foreign Keys:**
- mentor_id → users(user_id) ON DELETE CASCADE
- hackathon_id → hackathons(hackathon_id) ON DELETE CASCADE

**Indexes:**
- PRIMARY KEY: id
- UNIQUE KEY: unique_mentor_hackathon (mentor_id, hackathon_id)
- INDEX: idx_mentor (mentor_id)
- INDEX: idx_hackathon (hackathon_id)

---

### TABLE 6: `mentor_team_assignments`
**Purpose:** Assign mentors to specific teams (ONE TEAM = ONE MENTOR rule)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| assignment_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique assignment ID |
| mentor_id | INT | NOT NULL, FK | Mentor assigned |
| team_id | INT | NOT NULL, FK | Team assigned to |
| assigned_by | INT | NULL, FK | Admin who assigned |
| is_active | BOOLEAN | DEFAULT TRUE | Active assignment |
| notes | TEXT | NULL | Assignment notes |
| assigned_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Assignment time |

**Foreign Keys:**
- mentor_id → users(user_id) ON DELETE CASCADE
- team_id → teams(team_id) ON DELETE CASCADE
- assigned_by → users(user_id) ON DELETE RESTRICT

**Indexes:**
- PRIMARY KEY: assignment_id
- UNIQUE KEY: unique_mentor_team (mentor_id, team_id)
- INDEX: idx_mentor (mentor_id)
- INDEX: idx_team (team_id)
- INDEX: idx_active (is_active)

**Business Rule:** One team can only have ONE mentor, but one mentor can have MULTIPLE teams

---

### TABLE 7: `scheduled_meetings`
**Purpose:** Store scheduled meetings between mentors and teams

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| meeting_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique meeting ID |
| mentor_id | INT | NOT NULL, FK | Mentor |
| team_id | INT | NOT NULL, FK | Team |
| meeting_title | VARCHAR(255) | NOT NULL | Meeting title |
| meeting_link | VARCHAR(500) | NOT NULL | Google Meet/Zoom link |
| meeting_date | DATETIME | NOT NULL | Scheduled time |
| description | TEXT | NULL | Meeting description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Created time |

**Foreign Keys:**
- mentor_id → users(user_id) ON DELETE CASCADE
- team_id → teams(team_id) ON DELETE CASCADE

**Indexes:**
- PRIMARY KEY: meeting_id
- INDEX: idx_mentor (mentor_id)
- INDEX: idx_team (team_id)
- INDEX: idx_meeting_date (meeting_date)

---

### TABLE 8: `team_mentor_communications`
**Purpose:** WhatsApp-style chat messages between teams and mentors with reactions and delete functionality

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| communication_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique message ID |
| team_id | INT | NOT NULL, FK | Team |
| mentor_id | INT | NOT NULL, FK | Mentor |
| sender_type | ENUM | NOT NULL | 'mentor' or 'team' |
| message_text | TEXT | NULL | Text message |
| file_url | VARCHAR(500) | NULL | Attached file URL |
| file_name | VARCHAR(255) | NULL | Original filename |
| reactions | JSON | NULL | Emoji reactions: {"user_id": "emoji"} |
| deleted_for_sender | BOOLEAN | DEFAULT FALSE | Message deleted by sender |
| deleted_for_receiver | BOOLEAN | DEFAULT FALSE | Message deleted by receiver |
| deleted_for_everyone | BOOLEAN | DEFAULT FALSE | Message deleted for everyone |
| deleted_at | TIMESTAMP | NULL | When message was deleted |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Message time |

**Foreign Keys:**
- team_id → teams(team_id) ON DELETE CASCADE
- mentor_id → users(user_id) ON DELETE CASCADE

**Indexes:**
- PRIMARY KEY: communication_id
- INDEX: idx_team_mentor (team_id, mentor_id)
- INDEX: idx_created_at (created_at)
- INDEX: idx_deleted (deleted_for_everyone, deleted_for_sender, deleted_for_receiver)

---

### TABLE 9: `submissions`
**Purpose:** Project submission versions (teams can submit multiple times)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| submission_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique submission ID |
| team_id | INT | NOT NULL, FK | Team |
| hackathon_id | INT | NOT NULL, FK | Hackathon |
| project_zip_url | VARCHAR(255) | NULL | Uploaded project ZIP |
| submission_title | VARCHAR(255) | NOT NULL | Submission title |
| description | TEXT | NULL | Description |
| github_url | VARCHAR(255) | NULL | GitHub repo |
| demo_url | VARCHAR(255) | NULL | Live demo |
| video_url | VARCHAR(255) | NULL | Video demo |
| documentation_url | VARCHAR(255) | NULL | Documentation |
| submitted_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Submit time |
| is_final | BOOLEAN | DEFAULT FALSE | Is final submission |
| version | INT | DEFAULT 1 | Version number |

**Foreign Keys:**
- team_id → teams(team_id) ON DELETE CASCADE
- hackathon_id → hackathons(hackathon_id) ON DELETE CASCADE

**Indexes:**
- PRIMARY KEY: submission_id
- INDEX: idx_team (team_id)
- INDEX: idx_hackathon (hackathon_id)

---

### TABLE 10: `evaluations`
**Purpose:** Judge scoring for submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| evaluation_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique evaluation ID |
| submission_id | INT | NOT NULL, FK | Submission being judged |
| judge_id | INT | NOT NULL, FK | Judge (admin) |
| innovation_score | DECIMAL(5,2) | DEFAULT 0.00 | Innovation (0-100) |
| technical_score | DECIMAL(5,2) | DEFAULT 0.00 | Technical (0-100) |
| design_score | DECIMAL(5,2) | DEFAULT 0.00 | Design (0-100) |
| presentation_score | DECIMAL(5,2) | DEFAULT 0.00 | Presentation (0-100) |
| total_score | DECIMAL(10,2) | GENERATED STORED | Auto-calculated sum |
| comments | TEXT | NULL | Judge comments |
| evaluated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Evaluation time |

**Foreign Keys:**
- submission_id → submissions(submission_id) ON DELETE CASCADE
- judge_id → users(user_id) ON DELETE RESTRICT

**Indexes:**
- PRIMARY KEY: evaluation_id
- INDEX: idx_submission (submission_id)
- INDEX: idx_judge (judge_id)

---

### TABLE 11: `announcements`
**Purpose:** Hackathon announcements from admins

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| announcement_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique announcement ID |
| hackathon_id | INT | NOT NULL, FK | Related hackathon |
| title | VARCHAR(255) | NOT NULL | Announcement title |
| content | TEXT | NOT NULL | Message content |
| announcement_type | ENUM | DEFAULT 'general' | 'general', 'important', 'deadline', 'winner' |
| created_by | INT | NOT NULL, FK | Admin who posted |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Post time |

**Foreign Keys:**
- hackathon_id → hackathons(hackathon_id) ON DELETE CASCADE
- created_by → users(user_id) ON DELETE RESTRICT

**Indexes:**
- PRIMARY KEY: announcement_id
- INDEX: idx_hackathon (hackathon_id)

---

### TABLE 12: `notifications`
**Purpose:** User notifications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| notification_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique notification ID |
| user_id | INT | NOT NULL, FK | Recipient user |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| notification_type | VARCHAR(50) | NULL | Type of notification |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| related_entity_type | VARCHAR(50) | NULL | Related entity (team, hackathon) |
| related_entity_id | INT | NULL | Entity ID |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Created time |

**Foreign Keys:**
- user_id → users(user_id) ON DELETE CASCADE

**Indexes:**
- PRIMARY KEY: notification_id
- INDEX: idx_user (user_id)
- INDEX: idx_read_status (is_read)

---

### TABLE 13: `activity_logs`
**Purpose:** Audit trail of user actions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| log_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique log ID |
| user_id | INT | NULL, FK | User who performed action |
| action | VARCHAR(100) | NOT NULL | Action performed |
| entity_type | VARCHAR(50) | NULL | Entity affected |
| entity_id | INT | NULL | Entity ID |
| description | TEXT | NULL | Action description |
| ip_address | VARCHAR(45) | NULL | User IP address |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Action time |

**Foreign Keys:**
- user_id → users(user_id) ON DELETE SET NULL

**Indexes:**
- PRIMARY KEY: log_id
- INDEX: idx_user (user_id)
- INDEX: idx_created_at (created_at)

---

## 🔗 ENTITY RELATIONSHIP DIAGRAM (ERD)

### RELATIONSHIPS SUMMARY

#### 1. **users → hackathons**
- **Type:** One-to-Many
- **Relation:** One admin creates many hackathons
- **FK:** hackathons.created_by → users.user_id

#### 2. **users → teams**
- **Type:** One-to-Many
- **Relation:** One user (team leader) leads many teams
- **FK:** teams.team_leader_id → users.user_id

#### 3. **hackathons → teams**
- **Type:** One-to-Many
- **Relation:** One hackathon has many teams
- **FK:** teams.hackathon_id → hackathons.hackathon_id

#### 4. **teams → team_members**
- **Type:** One-to-Many
- **Relation:** One team has many members
- **FK:** team_members.team_id → teams.team_id

#### 5. **users → team_members**
- **Type:** One-to-Many
- **Relation:** One user can be member of many teams
- **FK:** team_members.user_id → users.user_id

#### 6. **users ↔ hackathons (via mentors_hackathons)**
- **Type:** Many-to-Many
- **Relation:** Mentors can mentor multiple hackathons, hackathons have multiple mentors
- **FK:** 
  - mentors_hackathons.mentor_id → users.user_id
  - mentors_hackathons.hackathon_id → hackathons.hackathon_id

#### 7. **users → mentor_team_assignments**
- **Type:** One-to-Many
- **Relation:** One mentor assigned to many teams
- **FK:** mentor_team_assignments.mentor_id → users.user_id

#### 8. **teams → mentor_team_assignments**
- **Type:** One-to-One
- **Relation:** One team gets ONE mentor (enforced by business logic)
- **FK:** mentor_team_assignments.team_id → teams.team_id

#### 9. **users → scheduled_meetings**
- **Type:** One-to-Many
- **Relation:** One mentor schedules many meetings
- **FK:** scheduled_meetings.mentor_id → users.user_id

#### 10. **teams → scheduled_meetings**
- **Type:** One-to-Many
- **Relation:** One team has many meetings
- **FK:** scheduled_meetings.team_id → teams.team_id

#### 11. **teams → team_mentor_communications**
- **Type:** One-to-Many
- **Relation:** One team has many chat messages
- **FK:** team_mentor_communications.team_id → teams.team_id

#### 12. **users → team_mentor_communications**
- **Type:** One-to-Many
- **Relation:** One mentor has many chat messages
- **FK:** team_mentor_communications.mentor_id → users.user_id

#### 13. **teams → submissions**
- **Type:** One-to-Many
- **Relation:** One team can submit multiple versions
- **FK:** submissions.team_id → teams.team_id

#### 14. **hackathons → submissions**
- **Type:** One-to-Many
- **Relation:** One hackathon has many submissions
- **FK:** submissions.hackathon_id → hackathons.hackathon_id

#### 15. **submissions → evaluations**
- **Type:** One-to-Many
- **Relation:** One submission can be evaluated by multiple judges
- **FK:** evaluations.submission_id → submissions.submission_id

#### 16. **users → evaluations**
- **Type:** One-to-Many
- **Relation:** One judge evaluates many submissions
- **FK:** evaluations.judge_id → users.user_id

#### 17. **hackathons → announcements**
- **Type:** One-to-Many
- **Relation:** One hackathon has many announcements
- **FK:** announcements.hackathon_id → hackathons.hackathon_id

#### 18. **users → announcements**
- **Type:** One-to-Many
- **Relation:** One admin creates many announcements
- **FK:** announcements.created_by → users.user_id

#### 19. **users → notifications**
- **Type:** One-to-Many
- **Relation:** One user receives many notifications
- **FK:** notifications.user_id → users.user_id

#### 20. **users → activity_logs**
- **Type:** One-to-Many
- **Relation:** One user generates many activity logs
- **FK:** activity_logs.user_id → users.user_id

---

## 🎯 VIEWS

### VIEW: `leaderboard_view`
**Purpose:** Pre-joined view for leaderboard display

```sql
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
```

---

## ⚙️ STORED PROCEDURES

### 1. `update_hackathon_rankings(p_hackathon_id INT)`
**Purpose:** Auto-update team rankings based on scores

```sql
CALL update_hackathon_rankings(1);
```

### 2. `calculate_team_score(p_team_id INT)`
**Purpose:** Calculate average score from all judge evaluations

```sql
CALL calculate_team_score(5);
```

---

## 🔄 TRIGGERS

### 1. `before_team_insert`
**Purpose:** Auto-generate unique team code (TEAMXXXXXX)

### 2. `after_team_insert`
**Purpose:** Automatically add team leader to team_members table

---

## 👤 DEFAULT ADMIN CREDENTIALS

**Email:** `admin@hackplatform.com`  
**Password:** `admin123`  
**User Type:** `admin`

### 🔐 HOW TO CHANGE ADMIN PASSWORD

#### Method 1: Using Update Script (Recommended)
```bash
cd BACKEND
node update-admin-password.js
```

Edit the script to change password:
```javascript
const password = 'your_new_password_here';
```

#### Method 2: Direct SQL Update
```sql
-- Generate hash using bcrypt online tool or Node.js
UPDATE users 
SET password_hash = '$2y$10$new_hash_here' 
WHERE email = 'admin@hackplatform.com';
```

#### Method 3: Create New Admin via SQL
```sql
INSERT INTO users (email, password_hash, full_name, user_type) 
VALUES (
  'newadmin@example.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
  'New Admin Name',
  'admin'
);
```

---

## 📝 DATABASE SETUP COMMANDS

### Create Database
```sql
CREATE DATABASE hackathon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hackathon;
```

### Import Schema
```bash
# Using MySQL command line
mysql -u root -p hackathon < database/hackathon_schema.sql

# Using phpMyAdmin
# 1. Select 'hackathon' database
# 2. Click 'Import' tab
# 3. Choose 'hackathon_schema.sql'
# 4. Click 'Go'
```

### Add Mentor Features
```bash
mysql -u root -p hackathon < database/mentor_tables.sql
mysql -u root -p hackathon < database/add_leaderboard_final.sql
mysql -u root -p hackathon < database/add_project_zip_column.sql
mysql -u root -p hackathon < database/add_message_delete.sql
```

---

## 🎨 ER DIAGRAM STRUCTURE (For Drawing Tools)

### ENTITIES
1. users (13 columns)
2. hackathons (29 columns)
3. teams (28 columns)
4. team_members (7 columns)
5. mentors_hackathons (6 columns)
6. mentor_team_assignments (7 columns)
7. scheduled_meetings (8 columns)
8. team_mentor_communications (13 columns) - Updated with reactions and delete features
9. submissions (12 columns)
10. evaluations (10 columns)
11. announcements (7 columns)
12. notifications (10 columns)
13. activity_logs (8 columns)

### CARDINALITY NOTATION
- `1` → `*` : One-to-Many
- `*` → `*` : Many-to-Many (via junction table)
- `1` → `1` : One-to-One (enforced by business logic)

### SUGGESTED ER DIAGRAM TOOLS
- **draw.io** (Free, Web-based)
- **Lucidchart** (Free tier available)
- **dbdiagram.io** (Free, SQL-based)
- **MySQL Workbench** (Auto-generate from database)

---

## 📊 COLUMN TYPE SUMMARY

### Data Types Used
- **INT:** IDs, counts, foreign keys
- **VARCHAR(n):** Short text (emails, names, URLs)
- **TEXT:** Medium text (descriptions, messages)
- **LONGTEXT:** Long content (detailed descriptions)
- **ENUM:** Fixed options (status, user_type)
- **BOOLEAN:** True/false flags
- **DECIMAL(10,2):** Scores with 2 decimal places
- **DATETIME:** Specific dates/times
- **TIMESTAMP:** Auto-updated timestamps

### Constraints Used
- **PRIMARY KEY:** Unique identifier
- **FOREIGN KEY:** Relationship to another table
- **UNIQUE:** No duplicate values
- **NOT NULL:** Required field
- **DEFAULT:** Default value
- **AUTO_INCREMENT:** Auto-generate ID
- **ON DELETE CASCADE:** Delete child records
- **ON DELETE RESTRICT:** Prevent deletion if referenced
- **ON DELETE SET NULL:** Set to NULL on parent delete
- **GENERATED ALWAYS AS:** Computed column

---

## 🔍 INDEXING STRATEGY

### Indexed Columns
- All PRIMARY KEYs (automatic)
- All FOREIGN KEYs
- Frequently searched columns (email, team_code, slug)
- Status/filter columns (user_type, status, is_read)
- Date columns used in queries (created_at, meeting_date)

### Composite Indexes
- (team_id, user_id) - Prevent duplicate team members
- (mentor_id, hackathon_id) - Prevent duplicate mentor assignments
- (team_id, mentor_id) - Fast chat message lookup

---

## 💾 STORAGE ENGINE: InnoDB

### Features Used
- **Transactions:** ACID compliance
- **Foreign Keys:** Referential integrity
- **Row-level Locking:** Better concurrency
- **Crash Recovery:** Automatic recovery
- **Full-text Search:** Not used yet

---

This documentation provides complete database structure for creating ER diagrams and understanding the entire system architecture.
