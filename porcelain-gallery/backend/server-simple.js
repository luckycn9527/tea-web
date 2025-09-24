const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes one by one to avoid circular dependency
let productsRoutes, commonRoutes, mediaRoutes, adminRoutes, authRoutes, usersRoutes, mediaLibraryRoutes;

try {
  productsRoutes = require('./routes/products');
  console.log('✅ Products routes loaded');
} catch (error) {
  console.error('❌ Error loading products routes:', error.message);
}

try {
  commonRoutes = require('./routes/common');
  console.log('✅ Common routes loaded');
} catch (error) {
  console.error('❌ Error loading common routes:', error.message);
}

try {
  mediaRoutes = require('./routes/media');
  console.log('✅ Media routes loaded');
} catch (error) {
  console.error('❌ Error loading media routes:', error.message);
}

try {
  adminRoutes = require('./routes/admin');
  console.log('✅ Admin routes loaded');
} catch (error) {
  console.error('❌ Error loading admin routes:', error.message);
}

try {
  authRoutes = require('./routes/auth');
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
  console.error('Error details:', error);
}

try {
  usersRoutes = require('./routes/users');
  console.log('✅ Users routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading users routes:', error.message);
}

try {
  mediaLibraryRoutes = require('./routes/media-library');
  console.log('✅ Media Library routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading media library routes:', error.message);
}

// API Routes
if (productsRoutes) app.use('/api/products', productsRoutes);
if (commonRoutes) app.use('/api', commonRoutes);
if (mediaRoutes) app.use('/api/media', mediaRoutes);
if (adminRoutes) app.use('/api/admin', adminRoutes);
if (authRoutes) {
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes mounted at /api/auth');
} else {
  console.log('❌ Auth routes not mounted - creating fallback');
}

if (usersRoutes) {
  app.use('/api/users', usersRoutes);
  console.log('✅ Users routes mounted at /api/users');
} else {
  console.log('❌ Users routes not mounted');
  // Fallback auth routes
  app.post('/api/auth/login', (req, res) => {
    res.status(500).json({
      success: false,
      message: 'Auth service not available'
    });
  });
}

if (mediaLibraryRoutes) {
  app.use('/api/media-library', mediaLibraryRoutes);
  console.log('✅ Media Library routes mounted at /api/media-library');
} else {
  console.log('❌ Media Library routes not mounted');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'porcelain_gallery',
      port: process.env.DB_PORT || 3306
    });
    
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM dynasties');
    await connection.end();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      dynastyCount: rows[0].count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 10MB.'
    });
  }
  
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/api/test-db`);
  console.log(`🖼️  Media uploads: http://localhost:${PORT}/uploads`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`⚙️  Admin API: http://localhost:${PORT}/api/admin`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
});

