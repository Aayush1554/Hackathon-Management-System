# 🏆 Hackathon Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-black?style=flat&logo=socket.io&logoColor=white)

**A full-stack platform for managing the complete hackathon lifecycle.**

Event creation • Team management • Mentorship • Real-time communication • Project submissions • Evaluations • Leaderboards

</div>

---

## 📖 About

**Hackathon Management System** is a full-stack web application designed to simplify and manage the complete hackathon lifecycle from a centralized platform.

It provides separate workflows for **Administrators, Mentors, and Teams**, allowing organizers to create hackathons, manage participants, assign mentors, monitor submissions, communicate in real time, and finalize leaderboards.

---

## ✨ Features

### 👨‍💼 Admin

- Create, edit, and manage hackathons
- Configure hackathon dates and deadlines
- Configure prizes
- Create and manage mentors
- Assign mentors to teams
- View registered teams
- Monitor project submissions
- Manage evaluations
- View and finalize leaderboards
- Search and filter hackathons

### 👨‍🏫 Mentor

- View assigned teams
- Track team progress
- Communicate with teams
- Real-time chat
- Emoji reactions
- Edit and delete messages
- Schedule meetings
- Upload resources and files

### 👥 Teams

- Browse available hackathons
- Register for hackathons
- Create or join teams
- Submit projects
- Upload project files
- Communicate with assigned mentors
- View scheduled meetings
- Track submission status
- View leaderboard rankings

### 💬 Real-Time Communication

- Real-time mentor-team messaging
- File attachments
- Emoji reactions
- Message editing
- Delete for me
- Delete for everyone
- Reaction toggling
- Team/mentor-specific communication rooms

---

## 🛠️ Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Axios
- Socket.io-client

### Backend

- Node.js
- Express.js
- Socket.io
- JWT Authentication
- bcryptjs
- Multer
- CORS
- dotenv

### Database

- MySQL 8.0+
- InnoDB
- Foreign Key Relationships
- Relational Database Design

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │   TypeScript/Vite   │
                    └──────────┬──────────┘
                               │
                         REST API / Socket.io
                               │
                    ┌──────────▼──────────┐
                    │   Node.js + Express │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                         MySQL Connection
                               │
                    ┌──────────▼──────────┐
                    │    MySQL Database   │
                    │      hackathon      │
                    └─────────────────────┘
```

---

## 📋 Prerequisites

Before running the project, install:

- **Node.js v16+**
- **MySQL 8.0+**
- **Git**

For Windows, **XAMPP** can be used to run MySQL locally.

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Aayush1554/Hackathon-Management-System.git
cd Hackathon-Management-System
```

### 2. Setup Database

Start MySQL through XAMPP and open:

```text
http://localhost/phpmyadmin
```

Create a database named:

```text
hackathon
```

Import the SQL files in this order:

```text
database/hackathon_schema.sql
database/mentor_tables.sql
database/add_leaderboard_final.sql
database/add_project_zip_column.sql
database/add_message_delete.sql
```

### 3. Setup Backend

```bash
cd BACKEND
npm install
```

Create a `.env` file:

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

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 4. Setup Frontend

Open a new terminal:

```bash
cd FRONTEND
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

For detailed installation instructions, see:

**[PROJECT_SETUP_GUIDE.md](PROJECT_SETUP_GUIDE.md)**

For the fastest setup, see:

**[QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)**

---

## 🔐 Admin Account

Create the administrator account using the provided script:

```bash
cd BACKEND
node create-admin.js
```

The script creates or updates the administrator account and displays the login credentials in the terminal.

> **Security:** Do not commit real credentials, passwords, JWT secrets, or `.env` files to the repository.

---

## 🧪 Test Data

Optional scripts are available for development and testing.

### Create Test Users

```bash
cd BACKEND
node create-10-test-users.js
```

### Create Sample Hackathons

```bash
node create-9-hackathons.js
```

These scripts are intended for local development/testing.

---

## 📊 Database

The application uses a relational MySQL database containing tables for:

- Users
- Hackathons
- Teams
- Team Members
- Submissions
- Evaluations
- Mentor-Team Assignments
- Scheduled Meetings
- Team-Mentor Communications
- Notifications
- Announcements
- Activity Logs

Database documentation:

**[DATABASE.md](DATABASE.md)**

---

## 🔌 Real-Time Communication

The application uses **Socket.io** for real-time communication between mentors and teams.

### Features

- Instant messaging
- Emoji reactions
- Message editing
- Message deletion
- File attachments
- Room-based communication
- CORS-protected connections

Communication rooms follow the structure:

```text
team_{id}_mentor_{id}
```

Detailed implementation:

**[SOCKET_IO_IMPLEMENTATION.md](SOCKET_IO_IMPLEMENTATION.md)**

---

## 🔄 Application Workflow

### Admin

```text
Login
  ↓
Create Hackathon
  ↓
Configure Dates & Prizes
  ↓
Manage Mentors
  ↓
Assign Mentors
  ↓
Monitor Teams & Submissions
  ↓
Manage Evaluations
  ↓
Finalize Leaderboard
```

### Mentor

```text
Login
  ↓
View Assigned Teams
  ↓
Track Progress
  ↓
Chat With Teams
  ↓
Schedule Meetings
  ↓
Provide Support
```

### Team

```text
Register / Login
  ↓
Browse Hackathons
  ↓
Register
  ↓
Create / Join Team
  ↓
Work on Project
  ↓
Submit Project
  ↓
Communicate With Mentor
  ↓
Track Submission
  ↓
View Leaderboard
```

---

## 📁 Project Structure

```text
Hackathon-Management-System/
│
├── BACKEND/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   ├── create-admin.js
│   ├── create-10-test-users.js
│   ├── create-9-hackathons.js
│   └── package.json
│
├── FRONTEND/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── lib/
│   │   └── main.tsx
│   └── package.json
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
├── QUICK_START_GUIDE.md
├── SOCKET_IO_IMPLEMENTATION.md
└── README.md
```

---

## 📚 Documentation

| Document | Description |
|---|---|
| [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) | Get the project running quickly |
| [PROJECT_SETUP_GUIDE.md](PROJECT_SETUP_GUIDE.md) | Detailed setup and troubleshooting |
| [DATABASE.md](DATABASE.md) | Database schema and structure |
| [SOCKET_IO_IMPLEMENTATION.md](SOCKET_IO_IMPLEMENTATION.md) | Real-time communication implementation |

---

## 🐛 Troubleshooting

### Database Error

- Make sure MySQL is running.
- Verify that the `hackathon` database exists.
- Check the database credentials in `BACKEND/.env`.

### Backend Error

```bash
cd BACKEND
npm install
npm run dev
```

### Frontend Error

```bash
cd FRONTEND
npm install
npm run dev
```

### Port Already in Use

Windows:

```bash
netstat -ano | findstr :5000
```

or:

```bash
netstat -ano | findstr :5173
```

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/NewFeature
```

3. Make your changes.
4. Commit:

```bash
git add .
git commit -m "Add NewFeature"
```

5. Push:

```bash
git push origin feature/NewFeature
```

6. Open a Pull Request.

---

## 👨‍💻 Author

### Aayush Hudda

📧 **Email:** aayush154837@gmail.com

🔗 **GitHub:** https://github.com/Aayush1554

🔗 **LinkedIn:** https://www.linkedin.com/in/aayush-hudda-714591328/

---

<div align="center">

### ⭐ If you find this project useful, consider giving it a star!

**Hackathon Management System**

Built with React • Node.js • Express • MySQL • Socket.io

</div>