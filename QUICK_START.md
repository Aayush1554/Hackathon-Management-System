# 🚀 Quick Start Guide - Hackathon Management System

## Prerequisites (Fresh Machine Setup)

### Required Software
1. **Node.js** (v16 or higher) - Download from https://nodejs.org/
2. **MySQL** (via XAMPP/WAMP/MAMP or standalone) - Download from https://www.apachefriends.org/
3. **Git** (optional, for cloning) - Download from https://git-scm.com/

### Verify Installations
```bash
node --version  # Should show v16.x.x or higher
npm --version   # Should show 8.x.x or higher
mysql --version # Should show MySQL version
```

---

## 🗄️ Step 1: Database Setup

### 1.1 Start MySQL
- **XAMPP Users**: Start Apache and MySQL from XAMPP Control Panel
- **Standalone MySQL**: Start MySQL service

### 1.2 Import Database Schema

**Option A - Using phpMyAdmin (Recommended for XAMPP):**
1. Open http://localhost/phpmyadmin
2. Click "SQL" tab
3. Run each SQL file in order:
   ```sql
   -- Copy and paste content from each file, one by one:
   1. database/hackathon_schema.sql
   2. database/mentor_tables.sql
   3. database/add_leaderboard_final.sql
   4. database/add_project_zip_column.sql
   5. database/add_message_delete.sql
   ```

**Option B - Using MySQL Command Line:**
```bash
cd "path/to/hms"
mysql -u root -p hackathon < database/hackathon_schema.sql
mysql -u root -p hackathon < database/mentor_tables.sql
mysql -u root -p hackathon < database/add_leaderboard_final.sql
mysql -u root -p hackathon < database/add_project_zip_column.sql
mysql -u root -p hackathon < database/add_message_delete.sql
```

### 1.3 Verify Database
- Database name: `hackathon`
- Total tables: 13
- Check in phpMyAdmin or run: `SHOW TABLES;`

---

## 🔧 Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd BACKEND
npm install
```

**Packages installed:**
- express - Web framework
- mysql2 - MySQL database driver
- bcryptjs - Password hashing
- jsonwebtoken - Authentication
- dotenv - Environment variables
- cors - Cross-origin requests
- multer - File uploads
- And more...

### 2.2 Configure Environment (Optional)
Create `.env` file in BACKEND folder (or use defaults):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hackathon
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
```

### 2.3 Start Backend Server
```bash
npm run dev
```

**Success Output:**
```
Server running on port 5000
MySQL Database connected successfully
```

Backend URL: **http://localhost:5000**

### 2.4 Test Backend
Open browser: http://localhost:5000/api/health
Expected response: `{"status": "OK", "database": "connected"}`

---

## 🎨 Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
cd FRONTEND
npm install
```

**Packages installed:**
- react - UI library
- vite - Build tool
- react-router-dom - Routing
- axios - HTTP client
- shadcn/ui components
- tailwindcss - Styling
- And more...

### 3.2 Start Frontend Development Server
```bash
npm run dev
```

**Success Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Frontend URL: **http://localhost:5173**

---

## 🧪 Step 4: Verify Everything Works

### Test 1: Access Frontend
- Open http://localhost:5173
- You should see the Hackathon Management System homepage

### Test 2: Login as Admin
1. Go to Admin Login page
2. Use credentials:
   - Email: `admin@hackplatform.com`
   - Password: `admin123`
3. Should redirect to Admin Dashboard

### Test 3: Check API Connection
- Open browser console (F12)
- Look for API calls to http://localhost:5000
- No CORS errors should appear

---

## 📋 Default Test Accounts

### Admin
- **Email**: `admin@hackplatform.com`
- **Password**: `admin123`
- **Access**: Full system control, create hackathons, manage mentors/teams

### Creating New Accounts
- **Mentors**: Admin can create from Admin Dashboard → Mentor Management
- **Teams**: Register from Team Registration page (requires hackathon)

---

## 🎯 Available Features

### Admin Features
✅ Create/Edit/Delete Hackathons
✅ Manage Mentors (Create, Assign, Remove)
✅ View All Teams and Submissions
✅ Filter & Search Hackathons
✅ View Leaderboards

### Mentor Features
✅ View Assigned Teams
✅ WhatsApp-style Chat with Teams (with emoji reactions & delete messages)
✅ Schedule Meetings
✅ Upload Resources/Files

### Team Features
✅ Register for Hackathons
✅ Submit Projects (Multiple versions)
✅ Chat with Assigned Mentor (with emoji reactions & delete messages)
✅ View Meetings Schedule
✅ Track Submission Status

### Chat Features (WhatsApp-style)
✅ Real-time messaging (3-second polling)
✅ File attachments
✅ Emoji reactions (8 quick emojis)
✅ Delete for me
✅ Delete for everyone (sender only, 1-hour limit)
✅ Toggle reactions (click to remove)

---

## 🔍 Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database `hackathon` exists
- Check if port 5000 is available
- Run: `npm install` again

### Frontend won't start
- Check if port 5173 is available
- Run: `npm install` again
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Database connection error
- Verify MySQL credentials in BACKEND/.env
- Check if MySQL service is running
- Test connection: `mysql -u root -p`

### CORS errors
- Ensure backend is running on port 5000
- Check FRONTEND/src/lib/api.ts has correct baseURL
- Restart both servers

### File upload errors
- Check BACKEND/uploads/ folders exist:
  - uploads/communications/
  - uploads/submissions/
- Ensure proper permissions

---

## 📁 Project Structure

```
hms/
├── BACKEND/                 # Express.js backend
│   ├── config/             # Database config
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth & upload middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── uploads/            # File storage
│   ├── server.js           # Entry point
│   └── package.json
│
├── FRONTEND/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── contexts/      # Auth context
│   │   ├── lib/           # API & utilities
│   │   └── main.tsx       # Entry point
│   └── package.json
│
├── database/               # SQL migration files
│   ├── hackathon_schema.sql
│   ├── mentor_tables.sql
│   ├── add_leaderboard_final.sql
│   ├── add_project_zip_column.sql
│   └── add_message_delete.sql
│
└── Documentation files (.md)
```

---

## 🚀 Quick Commands Reference

### Start Everything
```bash
# Terminal 1 - Backend
cd BACKEND
npm run dev

# Terminal 2 - Frontend  
cd FRONTEND
npm run dev
```

### Stop Everything
- Press `Ctrl + C` in both terminals
- Stop MySQL from XAMPP Control Panel

---

## 🔗 Important URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **phpMyAdmin**: http://localhost/phpmyadmin
- **API Health Check**: http://localhost:5000/api/health

---

## 📞 Next Steps After Setup

1. ✅ Create a hackathon from Admin Dashboard
2. ✅ Create mentor accounts
3. ✅ Register a team for the hackathon
4. ✅ Assign mentor to team
5. ✅ Test chat functionality
6. ✅ Submit a project
7. ✅ View leaderboard

---

## 💡 Tips for Development

- Keep both backend and frontend running simultaneously
- Use browser DevTools (F12) to debug frontend issues
- Check backend terminal for API errors
- Use Postman to test API endpoints directly
- Database changes require server restart
