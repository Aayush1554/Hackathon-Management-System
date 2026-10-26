# Hackathon Management System — Database Documentation

## 📊 Database Overview

The Hackathon Management System uses **MySQL 8.0+** with the **InnoDB** storage engine and foreign-key relationships.

**Database name:** `hackathon`

The database supports:

- Hackathon creation and management
- User authentication and role management
- Team creation and membership
- Project submissions
- Project evaluations
- Mentor-team assignments
- Mentor communication
- Scheduled mentor meetings
- Notifications
- Announcements
- Activity logging
- Leaderboard management
- Project ZIP uploads
- Message reactions and deletion

---

## 🗂️ Database Tables

The system contains the following core tables:

| # | Table | Purpose |
|---|---|---|
| 1 | `users` | Stores administrators, mentors, and team members |
| 2 | `hackathons` | Stores hackathon events and their configuration |
| 3 | `teams` | Stores registered teams |
| 4 | `team_members` | Maps users to teams |
| 5 | `submissions` | Stores project submissions |
| 6 | `evaluations` | Stores project evaluations and scores |
| 7 | `mentors_hackathons` | Associates mentors with hackathons |
| 8 | `mentor_team_assignments` | Assigns mentors to teams |
| 9 | `scheduled_meetings` | Stores mentor-team meeting schedules |
| 10 | `team_mentor_communications` | Stores mentor-team chat messages |
| 11 | `notifications` | Stores user notifications |
| 12 | `announcements` | Stores hackathon announcements |
| 13 | `activity_logs` | Tracks important system activities |

---

# 👤 1. Users

### Table: `users`

Stores all users of the system.

### User Types

The `user_type` field supports:

- `admin`
- `mentor`
- `team_member`

### Important Fields

| Field | Description |
|---|---|
| `user_id` | Primary key |
| `email` | Unique user email |
| `password_hash` | Bcrypt-hashed password |
| `full_name` | User's name |
| `user_type` | User role |
| `phone` | Contact number |
| `organization` | College/company/organization |
| `bio` | User biography |
| `profile_image` | Profile image path |
| `is_active` | Account status |
| `created_at` | Account creation time |
| `updated_at` | Last update time |
| `last_login` | Last login timestamp |

Passwords are stored as **bcrypt hashes** and are never stored as plain text.

---

# 🏆 2. Hackathons

### Table: `hackathons`

Stores information about hackathon events.

Hackathons contain information such as:

- Title
- Slug
- Category
- Description
- Prize pool
- First, second and third prizes
- Event status
- Registration dates
- Team formation dates
- Development dates
- Submission deadline
- Judging period
- Hackathon dates
- Rules and requirements
- Maximum team size

### Status

Hackathons can have statuses such as:

- `draft`
- `open`
- `in_progress`
- `judging`
- `completed`
- `cancelled`

---

# 👥 3. Teams

### Table: `teams`

Stores teams registered for hackathons.

A team is associated with a particular hackathon and contains information such as:

- Team name
- Team description
- Team leader
- Team status
- Creation timestamp

Teams are linked to users through the `team_members` table.

---

# 🔗 4. Team Members

### Table: `team_members`

Connects users with teams.

This table implements the relationship between:

```text
Users ↔ Teams
```

A user can belong to a team, while a team can contain multiple members.

Important information includes:

- `team_id`
- `user_id`
- Member role
- Join date

---

# 📦 5. Submissions

### Table: `submissions`

Stores project submissions made by teams.

Submission information can include:

- Project title
- Project description
- GitHub repository
- Demo URL
- Presentation URL
- Project ZIP file
- Submission timestamp
- Submission status

The project ZIP upload functionality is supported through the additional project ZIP column migration.

---

# 📝 6. Evaluations

### Table: `evaluations`

Stores evaluations performed on project submissions.

Evaluations allow judges/mentors/admins to assess projects using the configured criteria.

Evaluation information can include:

- Submission
- Evaluator
- Score
- Feedback
- Evaluation timestamp

---

# 👨‍🏫 7. Mentors — Hackathons

### Table: `mentors_hackathons`

Associates mentors with hackathons.

This allows an administrator to assign mentors to specific hackathon events.

Relationship:

```text
Hackathon → Mentors
```

A hackathon can have multiple mentors.

---

# 🤝 8. Mentor Team Assignments

### Table: `mentor_team_assignments`

Connects mentors with teams.

This allows mentors to manage and support specific teams during the hackathon.

Relationship:

```text
Mentor ↔ Team
```

Mentors can:

- View assigned teams
- Communicate with teams
- Track team progress
- Schedule meetings

---

# 📅 9. Scheduled Meetings

### Table: `scheduled_meetings`

Stores meetings scheduled between mentors and teams.

Information includes:

- Mentor
- Team
- Meeting date/time
- Meeting status
- Meeting title/details

This supports mentor-team coordination during the hackathon.

---

# 💬 10. Team Mentor Communications

### Table: `team_mentor_communications`

Stores real-time communication between teams and mentors.

The system uses **Socket.io** for real-time messaging.

Features include:

- Instant messages
- Message editing
- Message deletion
- Emoji reactions
- Sender/receiver tracking
- Message timestamps

### Message Deletion

Messages support different deletion states:

- `deleted_for_sender`
- `deleted_for_receiver`
- `deleted_for_everyone`

The `deleted_at` field records when a message was deleted for everyone.

---

# 🔔 11. Notifications

### Table: `notifications`

Stores notifications generated by the system.

Notifications can be generated for events such as:

- Hackathon updates
- Team activities
- Mentor assignments
- Meetings
- Submissions
- Announcements
- Other important system events

---

# 📢 12. Announcements

### Table: `announcements`

Stores announcements made by administrators.

Announcements can be used to communicate important information to participants and mentors.

Examples:

- Schedule changes
- Submission reminders
- Event updates
- Judging announcements
- Important instructions

---

# 📋 13. Activity Logs

### Table: `activity_logs`

Tracks important actions performed within the system.

Activity logging helps administrators monitor system activity and user actions.

Typical information includes:

- User
- Action
- Related entity
- Description
- Timestamp

---

# 🔗 Database Relationships

The main relationships can be represented as:

```text
                    ┌─────────────┐
                    │    USERS    │
                    └──────┬──────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
          Admin          Mentor      Team Member
                           │
                           │
                    ┌──────▼──────┐
                    │  HACKATHONS │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    TEAMS    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ TEAM MEMBERS│
                    └─────────────┘

Mentor ────────────── Team
   │                    │
   │                    │
   ▼                    ▼
Mentor-Team        Submissions
Assignments             │
                        ▼
                   Evaluations
```

---

# 🔐 Authentication

Authentication is handled by the backend using:

- **JWT (JSON Web Tokens)**
- **bcryptjs** for password hashing

The backend generates a JWT after successful authentication.

The JWT is then used to authenticate protected API requests.

---

# 🔄 Database Setup

## Create Database

Create the database using:

```sql
CREATE DATABASE hackathon;
```

Then select it:

```sql
USE hackathon;
```

---

## 📥 SQL Import Order

If setting up the database from scratch, import the SQL files in the following order:

```text
1. database/hackathon_schema.sql
2. database/mentor_tables.sql
3. database/add_leaderboard_final.sql
4. database/add_project_zip_column.sql
5. database/add_message_delete.sql
```

### Why the order matters

`hackathon_schema.sql` creates the main database structure.

`mentor_tables.sql` adds the mentor-related tables.

The remaining migration files modify the existing schema to add additional functionality.

Therefore, the base schema should be imported first.

---

# 🛠️ Database Requirements

Recommended environment:

```text
MySQL 8.0+
InnoDB
UTF-8 / utf8mb4
```

The backend connects to MySQL using the database configuration defined in the backend environment variables.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hackathon
DB_PORT=3306
```

---

# 🔒 Security

## Passwords

User passwords are hashed using bcrypt before being stored in the database.

Never store passwords as plain text.

## Environment Variables

Sensitive configuration should be stored in a `.env` file.

Do **not** commit the following to GitHub:

```text
.env
passwords
JWT secrets
database credentials
private API keys
```

Use `.env.example` to document required environment variables without exposing real secrets.

---

# 🧹 Database Reset

If you need to completely recreate the database during development:

```sql
DROP DATABASE IF EXISTS hackathon;
CREATE DATABASE hackathon;
```

Then import the SQL files again in the correct order.

> ⚠️ Dropping the database permanently removes all data stored in it.

---

# 📌 Current Database Features

The database supports the major application workflows:

### Admin

```text
Create Hackathon
      ↓
Configure Event
      ↓
Assign Mentors
      ↓
Monitor Teams
      ↓
Monitor Submissions
      ↓
Finalize Leaderboard
```

### Team

```text
Register
    ↓
Browse Hackathons
    ↓
Create / Join Team
    ↓
Develop Project
    ↓
Submit Project
    ↓
Communicate with Mentor
    ↓
View Ranking
```

### Mentor

```text
Login
  ↓
View Assigned Teams
  ↓
Track Team Progress
  ↓
Chat with Teams
  ↓
Schedule Meetings
  ↓
Support Teams
```

---

# 📚 Related Documentation

For more information about the project, see:

- `README.md` — Project overview and setup
- `PROJECT_SETUP_GUIDE.md` — Detailed installation instructions
- `SOCKET_IO_IMPLEMENTATION.md` — Real-time communication implementation

---

## ⭐ Database Summary

The Hackathon Management System database is designed around a relational MySQL architecture with foreign-key relationships between users, hackathons, teams, submissions, evaluations, mentors, communications, and supporting system features.

The schema provides the persistent data layer required for the complete hackathon lifecycle, from **event creation and team registration to mentoring, project submission, evaluation, and leaderboard management**.