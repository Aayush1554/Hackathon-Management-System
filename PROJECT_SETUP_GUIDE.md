# 🚀 Hackathon Management System — Project Setup Guide

This guide explains how to set up and run the **Hackathon Management System** locally.

The project is a full-stack web application for managing hackathon events, teams, mentors, project submissions, evaluations, communication, and leaderboards.

---

# 📋 Prerequisites

Before starting, make sure the following software is installed:

### 1. Node.js

Node.js **v16 or higher** is required.

Check your installed version:

```bash
node --version
```

Check npm:

```bash
npm --version
```

---

### 2. MySQL

The project uses **MySQL 8.0+**.

You can use **XAMPP** to run MySQL locally.

After installing XAMPP:

1. Open XAMPP Control Panel.
2. Start **MySQL**.
3. Apache is optional for this project unless you specifically need it for another purpose.
4. Open phpMyAdmin from XAMPP.

---

### 3. Git

Git is required to clone the repository.

Check Git:

```bash
git --version
```

---

# 📥 1. Clone the Repository

Clone the project from GitHub:

```bash
git clone https://github.com/Aayush1554/Hackathon-Management-System.git
```

Enter the project directory:

```bash
cd Hackathon-Management-System
```

---

# 🗄️ 2. Database Setup

The application uses a MySQL database named:

```text
hackathon
```

## Step 1 — Start MySQL

Open **XAMPP Control Panel** and start:

```text
MySQL
```

---

## Step 2 — Open phpMyAdmin

Open:

```text
http://localhost/phpmyadmin
```

---

## Step 3 — Create the Database

Create a new database named:

```text
hackathon
```

---

## Step 4 — Import SQL Files

The SQL files must be imported in the following order:

```text
1. database/hackathon_schema.sql
2. database/mentor_tables.sql
3. database/add_leaderboard_final.sql
4. database/add_project_zip_column.sql
5. database/add_message_delete.sql
```

### Important

The order matters because the later SQL files modify or extend the database structure created by the earlier files.

After importing all files, verify that the database contains the required tables.

---

# 💻 3. Backend Setup

Open a terminal in the project directory.

Enter the backend folder:

```bash
cd BACKEND
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Backend Environment Variables

Create a file named:

```text
.env
```

inside the `BACKEND` folder.

Example configuration:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hackathon
DB_PORT=3306

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=24h

FRONTEND_URL=http://localhost:8080

UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### ⚠️ Important

Do **not** upload your actual `.env` file to GitHub.

The `.env` file may contain:

- Database credentials
- JWT secrets
- Other private configuration

Use `.env.example` as the template for other developers.

---

# ▶️ 4. Start the Backend

From the `BACKEND` directory:

```bash
npm run dev
```

The backend should start on:

```text
http://localhost:5000
```

Keep this terminal running.

---

# 🌐 5. Frontend Setup

Open a **new terminal** while keeping the backend running.

From the project root:

```bash
cd FRONTEND
```

Install frontend dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend should be available at:

```text
http://localhost:8080
```

---

# 🔑 6. Admin Account

The project contains a script for creating the administrator account.

From the `BACKEND` folder:

```bash
node create-admin.js
```

The script creates or updates the admin account.

Use the credentials configured by the script when logging into the administrator dashboard.

> For security, do not publish real production credentials in this repository.

---

# 👥 7. Test Users

The project also includes a script for creating test users.

From:

```text
BACKEND
```

run:

```bash
node create-10-test-users.js
```

This creates 10 test team-member accounts.

The generated accounts follow this pattern:

```text
user1@gmail.com
user2@gmail.com
user3@gmail.com
...
user10@gmail.com
```

The passwords follow the pattern:

```text
user1user1
user2user2
user3user3
...
user10user10
```

These accounts are intended for development/testing.

---

# 🏆 8. Hackathon Test Data

The project also contains a script for creating sample hackathons.

From the `BACKEND` directory:

```bash
node create-9-hackathons.js
```

This creates sample hackathon data for testing the application.

---

# 🌐 9. Access the Application

Once both frontend and backend servers are running, open:

```text
http://localhost:8080
```

---

# 👨‍💼 10. Admin Workflow

The administrator can:

```text
Login
  ↓
Create Hackathon
  ↓
Configure Dates & Prizes
  ↓
Assign Mentors
  ↓
Monitor Teams
  ↓
Monitor Submissions
  ↓
Manage Evaluations
  ↓
Finalize Leaderboard
```

---

# 👨‍🏫 11. Mentor Workflow

Mentors can:

```text
Login
  ↓
View Assigned Teams
  ↓
Track Team Progress
  ↓
Communicate with Teams
  ↓
React to Messages
  ↓
Schedule Meetings
  ↓
Support Teams
```

---

# 👥 12. Team Workflow

Team members can:

```text
Register / Login
      ↓
Browse Hackathons
      ↓
Register for Hackathon
      ↓
Create or Join Team
      ↓
Work on Project
      ↓
Submit Project
      ↓
Communicate with Mentor
      ↓
View Leaderboard
```

---

# 💬 13. Real-Time Communication

The application uses **Socket.io** for real-time mentor-team communication.

Features include:

- Instant messaging
- Real-time message updates
- Emoji reactions
- Message editing
- Message deletion
- Team/mentor communication rooms

The backend uses room-based communication for individual team-mentor conversations.

Example room structure:

```text
team_{id}_mentor_{id}
```

---

# 📁 14. Project Structure

The major project structure is:

```text
Hackathon-Management-System/
│
├── BACKEND/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   ├── .env.example
│   ├── create-admin.js
│   ├── create-10-test-users.js
│   ├── create-9-hackathons.js
│   ├── package.json
│   └── ...
│
├── FRONTEND/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── database/
│   ├── hackathon_schema.sql
│   ├── mentor_tables.sql
│   ├── add_leaderboard_final.sql
│   ├── add_project_zip_column.sql
│   └── add_message_delete.sql
│
├── DATABASE.md
├── PROJECT_SETUP_GUIDE.md
├── SOCKET_IO_IMPLEMENTATION.md
└── README.md
```

---

# 🐛 15. Troubleshooting

## Database Connection Error

Check that MySQL is running in XAMPP.

Verify the `.env` configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hackathon
DB_PORT=3306
```

---

## Port 5000 Already in Use

Check which process is using port 5000:

```bash
netstat -ano | findstr :5000
```

Then terminate the process if required:

```bash
taskkill /PID <PID> /F
```

Alternatively, change the backend `PORT` in `.env`.

---

## Port 8080 Already in Use

Check the process:

```bash
netstat -ano | findstr :8080
```

Then terminate it if necessary:

```bash
taskkill /PID <PID> /F
```

---

## Socket.io Not Working

Check:

1. Backend is running.
2. Frontend is running.
3. `FRONTEND_URL` is correctly configured.
4. Browser console for Socket.io errors.
5. CORS configuration.

---

## Upload Problems

Check that the backend upload directory exists:

```text
BACKEND/uploads/
```

Also check file-size limits and permissions.

---

## npm Installation Problems

Try:

```bash
npm cache clean --force
```

Then remove:

```text
node_modules
```

and reinstall:

```bash
npm install
```

---

# 🔄 16. Restarting the Project

Whenever you want to run the project again:

### Terminal 1 — Backend

```bash
cd BACKEND
npm run dev
```

### Terminal 2 — Frontend

```bash
cd FRONTEND
npm run dev
```

Then open:

```text
http://localhost:8080
```

Make sure MySQL is also running in XAMPP.

---

# 🔒 17. Security Notes

For development:

- Use a local `.env` file.
- Never commit `.env`.
- Never publish database passwords.
- Never publish JWT secrets.
- Change default/test passwords before production deployment.
- Do not use development credentials in a production environment.

---

# 📚 18. Additional Documentation

The repository also contains:

### `DATABASE.md`

Contains the database structure, relationships, tables, and database setup information.

### `SOCKET_IO_IMPLEMENTATION.md`

Contains information about the real-time communication implementation using Socket.io.

### `README.md`

Contains the project overview, features, technology stack, installation summary, and usage information.

---

# 👨‍💻 Author

**Aayush Hudda**

📧 Email: aayush154837@gmail.com

🔗 GitHub: https://github.com/Aayush1554

🔗 LinkedIn: https://www.linkedin.com/in/aayush-hudda-714591328/

---

# ⭐ Project

**Hackathon Management System**

A full-stack platform designed to manage the complete hackathon lifecycle, including event creation, team registration, mentoring, communication, project submissions, evaluations, and leaderboard management.