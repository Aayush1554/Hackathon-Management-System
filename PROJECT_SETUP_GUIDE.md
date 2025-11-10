# 🚀 HACKATHON MANAGEMENT SYSTEM - COMPLETE SETUP GUIDE

## 📋 PROJECT OVERVIEW

**Project Name:** Hackathon Management System (HMS)  
**Type:** Full-stack Web Application  
**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express.js
- **Database:** MySQL (via XAMPP/phpMyAdmin)
- **UI Framework:** Shadcn/UI + Tailwind CSS
- **Authentication:** JWT (JSON Web Tokens)

---

## 🏗️ HOW THIS PROJECT WAS BUILT FROM SCRATCH

### Phase 1: Project Planning & Setup

#### 1. Database Design
- Designed 13 interconnected tables
- Defined relationships (One-to-Many, Many-to-Many)
- Created ER diagram with entities and cardinality
- Wrote SQL schema with constraints and indexes

#### 2. Backend Architecture
```bash
# Created Node.js project
mkdir BACKEND
cd BACKEND
npm init -y

# Installed dependencies
npm install express mysql2 dotenv cors bcryptjs jsonwebtoken express-validator multer morgan
npm install --save-dev nodemon
```

#### 3. Backend Structure Created
```
BACKEND/
├── config/
│   └── database.js          # MySQL connection pool
├── controllers/
│   ├── auth.controller.js   # Login/Register logic
│   ├── hackathon.controller.js
│   ├── team.controller.js
│   └── mentor.controller.js
├── middleware/
│   ├── auth.middleware.js   # JWT verification
│   └── upload.middleware.js # File upload handling
├── models/
│   ├── User.model.js        # User CRUD operations
│   ├── Hackathon.model.js
│   ├── Team.model.js
│   └── Mentor.model.js
├── routes/
│   ├── auth.routes.js       # /api/auth/*
│   ├── hackathon.routes.js  # /api/hackathons/*
│   ├── team.routes.js       # /api/teams/*
│   ├── mentor.routes.js     # /api/mentors/*
│   └── admin.routes.js      # /api/admin/*
├── uploads/                 # File storage
│   ├── submissions/
│   └── communications/
└── server.js                # Entry point
```

#### 4. Frontend Setup
```bash
# Created Vite React TypeScript project
npm create vite@latest FRONTEND -- --template react-ts
cd FRONTEND

# Installed Shadcn/UI
npx shadcn-ui@latest init

# Installed UI components
npx shadcn-ui@latest add button card input dialog badge tooltip
npx shadcn-ui@latest add table dropdown-menu select textarea

# Installed other dependencies
npm install axios react-router-dom lucide-react
npm install @tanstack/react-query date-fns framer-motion
```

#### 5. Frontend Structure Created
```
FRONTEND/src/
├── components/
│   ├── Navbar.tsx           # Navigation bar
│   ├── Footer.tsx           # Footer component
│   ├── ChatInterface.tsx    # WhatsApp-style chat
│   ├── TeamRegistrationModal.tsx
│   ├── SubmissionModal.tsx
│   └── ui/                  # Shadcn components
├── contexts/
│   └── AuthContext.tsx      # Global auth state
├── pages/
│   ├── Index.tsx            # Homepage
│   ├── Hackathons.tsx       # Browse hackathons
│   ├── HackathonDetails.tsx # Hackathon info
│   ├── TeamDashboard.tsx    # Team portal
│   ├── MentorDashboard.tsx  # Mentor portal
│   ├── AdminDashboard.tsx   # Admin portal
│   └── AboutUs.tsx          # About page
├── lib/
│   ├── api.ts               # Axios instance
│   └── utils.ts             # Helper functions
└── main.tsx                 # Entry point
```

### Phase 2: Feature Implementation Timeline

#### Week 1-2: Core Authentication
- ✅ User registration with bcrypt password hashing
- ✅ JWT-based login system
- ✅ Role-based access (admin/mentor/team_member)
- ✅ Protected routes on frontend
- ✅ Auth context for global state

#### Week 3-4: Hackathon Management
- ✅ Admin: Create/Edit/Delete hackathons
- ✅ Display hackathons with filters
- ✅ Registration date validation
- ✅ Status management (draft, open, in_progress, etc.)
- ✅ Prize pool breakdown display

#### Week 5-6: Team System
- ✅ Team registration with unique codes
- ✅ Join team using code
- ✅ Team dashboard with hackathon info
- ✅ Team member management
- ✅ Project submission (GitHub, demo, files)

#### Week 7-8: Scoring & Leaderboard
- ✅ Admin: Assign scores to teams
- ✅ Dynamic leaderboard with real-time updates
- ✅ Score finalization feature
- ✅ Visual indicators (trophy for final, info for current)
- ✅ Rank calculation

#### Week 9-10: Mentor System
- ✅ Mentor-to-team assignment (1 team = 1 mentor)
- ✅ WhatsApp-style chat interface
- ✅ File sharing in chat
- ✅ Meeting scheduler with Google Meet/Zoom
- ✅ Mentor dashboard with assigned teams

#### Week 11-12: Advanced Chat Features
- ✅ Real-time messaging (3-second polling)
- ✅ Emoji reactions (8 quick emojis)
- ✅ Toggle reactions (click to remove)
- ✅ Delete for me functionality
- ✅ Delete for everyone (sender only, 1-hour limit)
- ✅ Session-based authentication (tab-isolated)

#### Week 13-14: Polish & Refinement
- ✅ Dark theme UI consistency
- ✅ Glass-card effects
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications
- ✅ Comprehensive filtering system

### Phase 3: Key Technical Decisions

#### Why These Technologies?

**React + TypeScript:**
- Type safety prevents runtime errors
- Better IDE autocomplete
- Scalable codebase

**Vite:**
- Lightning-fast dev server
- Instant HMR (Hot Module Replacement)
- Optimized production builds

**Shadcn/UI:**
- Copy-paste components (no npm package bloat)
- Full customization control
- Accessible by default (ARIA)

**MySQL:**
- Relational data (teams, hackathons, users)
- Strong ACID guarantees
- Good for complex queries (JOINs)

**JWT:**
- Stateless authentication
- Easy to scale horizontally
- Works well with React

---

## 🖥️ RUNNING PROJECT ON ANOTHER MACHINE - STEP BY STEP

### Prerequisites Installation

#### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download LTS version (v20.x or higher)
3. Run installer, click "Next" through all steps
4. Verify installation:
```bash
node --version
npm --version
```

#### Step 2: Install XAMPP (MySQL + phpMyAdmin)
1. Go to https://www.apachefriends.org/
2. Download XAMPP for Windows
3. Install to `C:\xampp`
4. Start XAMPP Control Panel
5. Start **Apache** and **MySQL** services

#### Step 3: Install Git (Optional, for cloning)
1. Go to https://git-scm.com/
2. Download and install Git
3. Verify: `git --version`

### Database Setup

#### Step 1: Create Database
1. Open browser: http://localhost/phpmyadmin
2. Click "New" in sidebar
3. Database name: `hackathon`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

#### Step 2: Import Schema
1. Select `hackathon` database
2. Click "Import" tab
3. Click "Choose File"
4. Navigate to: `hms/database/hackathon_schema.sql`
5. Click "Go" button
6. Wait for "Import has been successfully finished"

#### Step 3: Import Mentor Tables
1. Still in Import tab
2. Choose `database/mentor_tables.sql`
3. Click "Go"
4. Choose `database/add_leaderboard_final.sql`
5. Click "Go"
6. Choose `database/add_project_zip_column.sql`
7. Click "Go"

#### Step 4: Verify Tables
1. Click `hackathon` database in sidebar
2. You should see 13 tables:
   - users
   - hackathons
   - teams
   - team_members
   - mentor_team_assignments
   - scheduled_meetings
   - team_mentor_communications
   - submissions
   - evaluations
   - announcements
   - notifications
   - activity_logs
   - mentors_hackathons

#### Step 5: Verify Default Admin
1. Click on `users` table
2. Click "Browse" tab
3. You should see admin user:
   - Email: `admin@hackplatform.com`
   - Password: `admin123` (hashed)
   - User Type: `admin`

### Backend Setup

#### Step 1: Navigate to Backend
```bash
cd hms/BACKEND
```

#### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- express (web framework)
- mysql2 (database driver)
- cors (cross-origin requests)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- multer (file uploads)
- dotenv (environment variables)

#### Step 3: Create .env File
Create file: `BACKEND/.env`

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hackathon
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (change this to random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# JWT Expiry
JWT_EXPIRE=7d
```

**Important:** Change `JWT_SECRET` to a random string!

#### Step 4: Test Database Connection
```bash
node -e "require('./config/database')"
```

Expected output:
```
✓ Database connected successfully
```

#### Step 5: Start Backend Server
```bash
npm start
```

Expected output:
```
✓ Database connected successfully
✓ Server running on http://localhost:5000
```

**Keep this terminal open!**

### Frontend Setup

#### Step 1: Open New Terminal
Open a **NEW** terminal window (don't close backend)

#### Step 2: Navigate to Frontend
```bash
cd hms/FRONTEND
```

#### Step 3: Install Dependencies
```bash
npm install
```

This installs:
- react, react-dom
- vite (build tool)
- typescript
- tailwindcss (styling)
- @radix-ui/* (Shadcn components)
- axios (HTTP client)
- react-router-dom (routing)
- lucide-react (icons)

**Note:** This may take 2-5 minutes!

#### Step 4: Start Frontend Dev Server
```bash
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

#### Step 5: Open in Browser
1. Open browser
2. Go to: http://localhost:8080
3. You should see the homepage!

### Testing the Application

#### Test 1: Admin Login
1. Click "Admin Login" in navbar
2. Email: `admin@hackplatform.com`
3. Password: `admin123`
4. Click "Login"
5. Should redirect to Admin Dashboard

#### Test 2: Create Hackathon
1. In Admin Dashboard, click "Create Hackathon"
2. Fill all required fields
3. For offline hackathons: Uncheck "Online Hackathon" and enter location/address
4. Click "Create"
5. Should see new hackathon in list with location displayed for offline events

#### Test 3: Register as Team
1. Logout from admin
2. Click "Register" → "Team Member"
3. Fill registration form
4. Login with new credentials
5. Browse hackathons
6. Register for a hackathon

#### Test 4: Mentor Features
1. In Admin Dashboard, click "Mentor Management"
2. Assign a mentor to a team
3. Login as mentor
4. View assigned teams
5. Test chat feature
6. Schedule a meeting

---

## 🔧 TROUBLESHOOTING COMMON ISSUES

### Issue 1: "Cannot GET /"
**Cause:** Backend not running  
**Fix:** 
```bash
cd BACKEND
npm start
```

### Issue 2: "ECONNREFUSED localhost:5000"
**Cause:** Frontend can't reach backend  
**Fix:** 
1. Check backend is running on port 5000
2. Check CORS is enabled in server.js

### Issue 3: "Access denied for user 'root'@'localhost'"
**Cause:** Wrong database password  
**Fix:** 
1. Open XAMPP
2. Check MySQL password
3. Update `BACKEND/.env` with correct password

### Issue 4: "Table 'hackathon.users' doesn't exist"
**Cause:** Database not imported  
**Fix:** Re-import `hackathon_schema.sql` in phpMyAdmin

### Issue 5: "Module not found"
**Cause:** Dependencies not installed  
**Fix:**
```bash
# Backend
cd BACKEND
rm -rf node_modules
npm install

# Frontend
cd FRONTEND
rm -rf node_modules
npm install
```

### Issue 6: "Port 5000 already in use"
**Cause:** Another app using port 5000  
**Fix:**
1. Edit `BACKEND/.env`
2. Change `PORT=5000` to `PORT=5001`
3. Update `FRONTEND/src/lib/api.ts` baseURL to match

### Issue 7: "Login not working"
**Cause:** JWT secret mismatch or password issue  
**Fix:**
```bash
cd BACKEND
node update-admin-password.js
```

---

## 📂 FOLDER STRUCTURE EXPLAINED

```
hms/
├── BACKEND/                 # Node.js API server
│   ├── config/             # Database connection
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, upload handlers
│   ├── models/            # Database queries
│   ├── routes/            # API endpoints
│   ├── uploads/           # Uploaded files
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Entry point
│
├── FRONTEND/              # React TypeScript app
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # Global state
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities
│   │   ├── pages/        # Route pages
│   │   ├── App.tsx       # Root component
│   │   └── main.tsx      # Entry point
│   ├── package.json      # Frontend dependencies
│   └── vite.config.ts    # Vite configuration
│
├── database/             # SQL files
│   ├── hackathon_schema.sql
│   ├── mentor_tables.sql
│   └── add_*.sql        # Migrations
│
├── DATABASE.md          # Database documentation
└── README.md           # This file
```

---

## 🎯 ADMIN CREDENTIALS & PASSWORD MANAGEMENT

### Default Admin Credentials
- **Email:** `admin@hackplatform.com`
- **Password:** `admin123`
- **Fixed or Changeable:** ✅ CHANGEABLE

### How to Change Admin Password

#### Method 1: Using Backend Script (Easiest)
```bash
cd BACKEND
node update-admin-password.js
```

To use custom password:
1. Open `update-admin-password.js` in editor
2. Change line:
```javascript
const password = 'admin123'; // Change this
```
3. Save and run:
```bash
node update-admin-password.js
```

#### Method 2: Via SQL (phpMyAdmin)
1. Go to http://localhost/phpmyadmin
2. Select `hackathon` database
3. Click `users` table
4. Click "Browse"
5. Click "Edit" (pencil icon) for admin user
6. Generate hash at: https://bcrypt-generator.com/
7. Enter your password, select rounds: 10
8. Copy generated hash
9. Paste in `password_hash` field
10. Click "Go"

#### Method 3: Create New Admin User
```sql
-- Generate hash at https://bcrypt-generator.com/ first
INSERT INTO users (email, password_hash, full_name, user_type) 
VALUES (
  'newadmin@example.com',
  '$2y$10$YourHashHere',
  'Your Name',
  'admin'
);
```

### Create Additional Admins
```bash
cd BACKEND
node -e "
const bcrypt = require('bcryptjs');
const db = require('./config/database');
(async () => {
  const hash = await bcrypt.hash('password123', 10);
  const [result] = await db.query(
    'INSERT INTO users (email, password_hash, full_name, user_type) VALUES (?, ?, ?, ?)',
    ['admin2@example.com', hash, 'Second Admin', 'admin']
  );
  console.log('Admin created!');
  process.exit(0);
})();
"
```

---

## 🌐 DEPLOYMENT CONSIDERATIONS

### Environment Variables (Production)
```env
# Production .env
DB_HOST=your-mysql-host.com
DB_USER=hackathon_user
DB_PASSWORD=strong_random_password
DB_NAME=hackathon
DB_PORT=3306

PORT=5000
NODE_ENV=production

JWT_SECRET=very_long_random_string_min_32_chars
JWT_EXPIRE=7d

# Optional
CORS_ORIGIN=https://yourdomain.com
```

### Build Frontend for Production
```bash
cd FRONTEND
npm run build
```

This creates `FRONTEND/dist/` folder with optimized files.

### Run Backend in Production
```bash
cd BACKEND
NODE_ENV=production npm start
```

Or use PM2:
```bash
npm install -g pm2
pm2 start server.js --name hackathon-api
pm2 save
pm2 startup
```

---

## 📊 API ENDPOINTS OVERVIEW

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Hackathons
- `GET /api/hackathons` - List all hackathons
- `GET /api/hackathons/:id` - Get hackathon details
- `POST /api/admin/hackathons` - Create hackathon (admin)
- `PUT /api/admin/hackathons/:id` - Update hackathon (admin)
- `DELETE /api/admin/hackathons/:id` - Delete hackathon (admin)

### Teams
- `POST /api/teams/register` - Register team for hackathon
- `POST /api/teams/join` - Join team with code
- `GET /api/teams/my-teams` - Get user's teams
- `POST /api/teams/:id/submit` - Submit project
- `PUT /api/admin/teams/:id/score` - Assign score (admin)

### Mentors
- `GET /api/mentors/teams` - Get assigned teams (mentor)
- `POST /api/admin/mentors/assign` - Assign mentor to team (admin)
- `POST /api/mentors/schedule-meeting` - Schedule meeting
- `POST /api/mentors/send-message` - Send chat message
- `GET /api/mentors/messages/:teamId` - Get chat history

---

## 🎓 LEARNING RESOURCES

### Technologies Used
- **React:** https://react.dev/learn
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Node.js:** https://nodejs.org/docs/
- **Express:** https://expressjs.com/
- **MySQL:** https://dev.mysql.com/doc/
- **JWT:** https://jwt.io/introduction
- **Shadcn/UI:** https://ui.shadcn.com/

### Project Architecture
- **MVC Pattern:** Model-View-Controller separation
- **RESTful API:** Standard HTTP methods (GET, POST, PUT, DELETE)
- **JWT Authentication:** Stateless token-based auth
- **Role-Based Access:** Different permissions per user type

---

## ✅ FINAL CHECKLIST

Before running on new machine:

- [ ] Node.js installed (v16+)
- [ ] XAMPP installed and MySQL running
- [ ] Database `hackathon` created
- [ ] All SQL migrations imported in order:
  - [ ] hackathon_schema.sql
  - [ ] mentor_tables.sql
  - [ ] add_leaderboard_final.sql
  - [ ] add_project_zip_column.sql
  - [ ] add_message_delete.sql
- [ ] Backend .env file created (optional, has defaults)
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend server running (port 5000)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend server running (port 5173)
- [ ] Can access http://localhost:5173
- [ ] Can login as admin (admin@hackplatform.com / admin123)
- [ ] Chat features working (reactions, delete)
- [ ] File uploads working (submissions, communications)

---

## 🎉 SUCCESS!

If you reached this point, your Hackathon Management System is fully operational!

**Next Steps:**
1. Create your first hackathon
2. Register some test teams
3. Assign mentors
4. Test chat and meetings
5. Submit projects
6. Assign scores
7. Finalize leaderboard

**Support:**
- GitHub: https://github.com/abhim-5
- LinkedIn: https://www.linkedin.com/in/abhimanyu-kumar5/
- Email: kumarabhi9589@gmail.com

Happy Hacking! 🚀
