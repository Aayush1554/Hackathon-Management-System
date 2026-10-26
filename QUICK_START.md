# 🚀 Quick Start Guide — Hackathon Management System

Get the Hackathon Management System running locally in a few steps.

---

## 1. Prerequisites

Install:

- Node.js v16+
- MySQL 8.0+
- Git

For Windows, you can use **XAMPP** for MySQL.

Verify Node.js and npm:

```bash
node --version
npm --version
```

---

## 2. Clone the Repository

```bash
git clone https://github.com/Aayush1554/Hackathon-Management-System.git
cd Hackathon-Management-System
```

---

## 3. Setup MySQL

Start **MySQL** from XAMPP.

Open:

```text
http://localhost/phpmyadmin
```

Create a database:

```text
hackathon
```

Import these SQL files **in order**:

```text
database/hackathon_schema.sql
database/mentor_tables.sql
database/add_leaderboard_final.sql
database/add_project_zip_column.sql
database/add_message_delete.sql
```

---

## 4. Configure Backend

Open a terminal:

```bash
cd BACKEND
npm install
```

Create:

```text
BACKEND/.env
```

Add:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hackathon
DB_PORT=3306
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

> Do not commit `.env` to GitHub.

---

## 5. Start Backend

From `BACKEND`:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

Keep this terminal open.

---

## 6. Setup Frontend

Open a **new terminal**:

```bash
cd FRONTEND
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

---

## 7. Create Admin Account

In the backend terminal:

```bash
cd BACKEND
node create-admin.js
```

The script will create/update the admin account and display the credentials in the terminal.

> Do not publish administrator credentials in the GitHub repository.

---

## 8. Optional Test Data

Create sample users:

```bash
cd BACKEND
node create-10-test-users.js
```

Create sample hackathons:

```bash
node create-9-hackathons.js
```

---

# ⚡ Quick Run After Initial Setup

Once everything has been installed and the database is configured:

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

### Browser

```text
http://localhost:5173
```

---

# 🔗 Local Services

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| phpMyAdmin | http://localhost/phpmyadmin |

---

# 🛑 Stop the Project

Press:

```text
Ctrl + C
```

in both terminals.

Stop MySQL from XAMPP when finished.

---

# 🆘 Need Detailed Help?

For complete installation instructions, environment configuration, project structure, and troubleshooting, see:

**[PROJECT_SETUP_GUIDE.md](PROJECT_SETUP_GUIDE.md)**

For database information:

**[DATABASE.md](DATABASE.md)**

For Socket.io implementation:

**[SOCKET_IO_IMPLEMENTATION.md](SOCKET_IO_IMPLEMENTATION.md)**

---

## 👨‍💻 Author

**Aayush Hudda**

📧 aayush154837@gmail.com

🔗 https://github.com/Aayush1554

🔗 https://www.linkedin.com/in/aayush-hudda-714591328/