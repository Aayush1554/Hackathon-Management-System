const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Make io accessible to routes
app.set('io', io);

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Test database connection
require('./config/database');

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/hackathons', require('./routes/hackathon.routes'));
app.use('/api/teams', require('./routes/team.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/mentors', require('./routes/mentor.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.url,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join a team-mentor communication room
  socket.on('join_communication', ({ teamId, mentorId }) => {
    const room = `team_${teamId}_mentor_${mentorId}`;
    socket.join(room);
    console.log(`✅ Socket ${socket.id} joined room: ${room}`);
  });

  // Leave a communication room
  socket.on('leave_communication', ({ teamId, mentorId }) => {
    const room = `team_${teamId}_mentor_${mentorId}`;
    socket.leave(room);
    console.log(`👋 Socket ${socket.id} left room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL}`);
  console.log(`🔌 WebSocket ready for real-time communication`);
});

module.exports = app;
