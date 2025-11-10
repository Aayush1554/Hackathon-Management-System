const jwt = require('jsonwebtoken');

// Verify JWT token middleware
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.user_type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
  next();
};

// Check if user is mentor
exports.isMentor = (req, res, next) => {
  if (req.user.user_type !== 'mentor') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Mentor only.'
    });
  }
  next();
};

// Check if user is team member
exports.isTeamMember = (req, res, next) => {
  if (req.user.user_type !== 'team_member') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Team member only.'
    });
  }
  next();
};

// Allow multiple user types
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.user_type)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};
