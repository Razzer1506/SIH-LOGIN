const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const config = require('./config');
const app = express();
const PORT = config.PORT;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'AyurSutra API Server is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // TODO: Replace with real database lookup
    // For now, using mock authentication - accept any email/password for testing
    console.log('Login attempt:', { email, password });
    
    // Simple mock authentication - accept any email/password combination
    const user = {
      id: Date.now().toString(),
      email: email,
      role: email.includes('practitioner') || email.includes('doctor') || email.includes('dr.') || email.includes('prac') || email.includes('admin') || email.includes('staff') ? 'practitioner' : 'patient',
      displayName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
    
    console.log('User role determined:', user.role, 'for email:', email);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
        token: token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName, role } = req.body;
    
    // Input validation
    if (!email || !password || !displayName || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Role validation
    if (!['patient', 'practitioner'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either patient or practitioner'
      });
    }

    // TODO: Check if user already exists in database
    // For now, using mock data
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      email: email,
      password: hashedPassword,
      role: role,
      displayName: displayName
    };

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        displayName: newUser.displayName,
        token: token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Appointments routes
app.get('/api/appointments', verifyToken, (req, res) => {
  const mockAppointments = [
    {
      id: "1",
      patient: "Sarah Johnson",
      patientEmail: "sarah.johnson@email.com",
      patientPhone: "+1 (555) 123-4567",
      treatment: "Abhyanga",
      date: "2024-01-15",
      time: "9:00 AM",
      duration: "60 min",
      status: "confirmed",
      location: "Wellness Center - Room 3",
      notes: "First session, discuss treatment plan. Patient has mild anxiety.",
      price: "$120",
      paymentStatus: "paid",
    },
    {
      id: "2",
      patient: "Michael Chen",
      patientEmail: "michael.chen@email.com",
      patientPhone: "+1 (555) 234-5678",
      treatment: "Shirodhara",
      date: "2024-01-15",
      time: "10:30 AM",
      duration: "45 min",
      status: "in-progress",
      location: "Wellness Center - Room 1",
      notes: "Follow-up session, check stress levels. Responding well to treatment.",
      price: "$100",
      paymentStatus: "paid",
    },
    {
      id: "3",
      patient: "Emily Davis",
      patientEmail: "emily.davis@email.com",
      patientPhone: "+1 (555) 345-6789",
      treatment: "Consultation",
      date: "2024-01-15",
      time: "2:00 PM",
      duration: "30 min",
      status: "confirmed",
      location: "Consultation Room 2",
      notes: "Initial consultation for Panchakarma. Discuss treatment options.",
      price: "$80",
      paymentStatus: "pending",
    }
  ];
  
  res.json({
    success: true,
    appointments: mockAppointments
  });
});

app.put('/api/appointments/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  res.json({
    success: true,
    message: `Appointment ${id} updated to ${status}`,
    appointmentId: id,
    newStatus: status
  });
});

// Patients routes
app.get('/api/patients', verifyToken, (req, res) => {
  const mockPatients = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      lastVisit: "2024-01-10",
      condition: "Stress Management",
      progress: 85,
      nextAppointment: "2024-01-15",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1 (555) 234-5678",
      lastVisit: "2024-01-12",
      condition: "Sleep Disorders",
      progress: 72,
      nextAppointment: "2024-01-18",
    }
  ];
  
  res.json({
    success: true,
    patients: mockPatients
  });
});

// Analytics routes
app.get('/api/analytics', verifyToken, (req, res) => {
  const mockAnalytics = {
    totalPatients: 127,
    totalAppointments: 45,
    revenue: 12500,
    successRate: 94,
    monthlyGrowth: 12.5
  };
  
  res.json({
    success: true,
    analytics: mockAnalytics
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AyurSutra API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;

