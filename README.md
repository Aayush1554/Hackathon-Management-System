# 🏆 Hackathon Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)

Full-stack platform for managing hackathon events with real-time communication, team management, and automated workflows.

### 🎥 Demo Video

[![Watch Demo](https://drive.google.com/file/d/1s_3gkRAeMah5zVGnkb7nkhkbcVEqjxCU/view?usp=sharing)]

</div>

---

## 📖 About

Complete web solution for managing hackathon lifecycle - event creation, team registration, real-time mentorship, project submissions, and leaderboard management.

---

## ✨ Features

**👨‍💼 Admins:** Create hackathons • Set deadlines • Configure prizes • Assign mentors • Monitor submissions • Finalize leaderboards

**👨‍🏫 Mentors:** View teams • Real-time chat • Emoji reactions • Schedule meetings • Track progress

**👥 Teams:** Browse hackathons • Register teams • Submit projects • Chat with mentors • View rankings

---

## 🛠️ Tech Stack

**Frontend:** React 18 + TypeScript + Vite • Tailwind CSS • Shadcn/UI • Socket.io-client

**Backend:** Node.js + Express • Socket.io • JWT • Bcrypt • Multer

**Database:** MySQL 8.0 • 13 tables • Foreign keys • InnoDB

---

## 📋 Prerequisites

- Node.js v16+ ([Download](https://nodejs.org/))
- MySQL 8.0+ ([XAMPP](https://www.apachefriends.org/))
- Git ([Download](https://git-scm.com/))

---

## 🚀 Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/abhim-5/Hackathon-Management-System.git
cd Hackathon-Management-System
```

### Step 2: Database Setup

1. **Start XAMPP** → Apache & MySQL
2. **Open** [phpMyAdmin](http://localhost/phpmyadmin)
3. **Create database:** `hackathon`
4. **Import SQL files in order** (SQL tab):
   ```
   1. database/hackathon_schema.sql
   2. database/mentor_tables.sql
   3. database/add_leaderboard_final.sql
   4. database/add_project_zip_column.sql
   5. database/add_message_delete.sql
   ```
5. **Verify:** 13 tables created

**Alternative (Command Line):**
```bash
mysql -u root -p -e "CREATE DATABASE hackathon;"
mysql -u root -p hackathon < database/hackathon_schema.sql
mysql -u root -p hackathon < database/mentor_tables.sql
mysql -u root -p hackathon < database/add_leaderboard_final.sql
mysql -u root -p hackathon < database/add_project_zip_column.sql
mysql -u root -p hackathon < database/add_message_delete.sql
```

### Step 3: Backend Setup

```bash
cd BACKEND
npm install
npm run dev
```

**Optional `.env`** (BACKEND folder):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hackathon
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:8080
```

Backend: `http://localhost:5000`

### Step 4: Frontend Setup

Open new terminal:

```bash
cd FRONTEND
npm install
npm run dev
```

Frontend: `http://localhost:8080`

---

## 🎮 Usage

### Access Application
```
http://localhost:8080
```

### Create Admin Account
```bash
cd BACKEND
node create-admin.js
```
**Login:** `admin@hackathon.com` / `Admin@123`

### Create Test Data (Optional)
```bash
node create-10-test-users.js    # Creates sample users
node create-9-hackathons.js      # Creates sample hackathons
```

### Workflows

**Admin:** Login → Create Hackathon → Set Dates/Prizes → Assign Mentors → Monitor → Finalize Leaderboard

**Team:** Register → Browse → Form Team → Submit Project → Chat with Mentor → View Ranking

**Mentor:** Login → View Teams → Chat → Schedule Meetings → Track Progress

---

## 📊 Database

**13 tables:** users, hackathons, teams, team_members, submissions, evaluations, mentor_team_assignments, scheduled_meetings, team_mentor_communications, notifications, announcements, activity_logs

📄 Full schema: [DATABASE.md](DATABASE.md)

---

## 🔌 Real-Time Features

**Socket.io WebSocket:** Instant messaging • Emoji reactions • Message edit/delete

**Architecture:** Room-based (`team_{id}_mentor_{id}`) • Event-driven • CORS-protected

📄 Implementation: [SOCKET_IO_IMPLEMENTATION.md](SOCKET_IO_IMPLEMENTATION.md)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Database error** | Check XAMPP MySQL running • Verify database `hackathon` |
| **Port in use** | `netstat -ano \| findstr :5000` then `taskkill /PID <PID> /F` or change PORT in `.env` |
| **Socket.io fails** | Ensure backend running • Check CORS • Clear browser cache |
| **Upload issues** | Verify `uploads/` folder • Check permissions |
| **npm errors** | Update Node.js • `npm cache clean --force` • Delete `node_modules` & reinstall |

---

## 📚 Documentation

- [DATABASE.md](DATABASE.md) - Complete schema
- [PROJECT_SETUP_GUIDE.md](PROJECT_SETUP_GUIDE.md) - Detailed setup
- [SOCKET_IO_IMPLEMENTATION.md](SOCKET_IO_IMPLEMENTATION.md) - Real-time features

---

## 🤝 Contributing

1. Fork repository
2. Create branch: `git checkout -b feature/NewFeature`
3. Commit: `git commit -m 'Add NewFeature'`
4. Push: `git push origin feature/NewFeature`
5. Open Pull Request

---

## 👨‍💻 Author

**Abhimanyu** - [@abhim-5](https://github.com/abhim-5)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

[Report Bug](https://github.com/abhim-5/Hackathon-Management-System/issues) • [Request Feature](https://github.com/abhim-5/Hackathon-Management-System/issues)

</div>
