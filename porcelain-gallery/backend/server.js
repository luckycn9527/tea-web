require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://106.75.68.99:5173',
    'http://localhost:3000',
    'http://106.75.68.99:3000',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.mimetype.startsWith('image/') 
      ? path.join(__dirname, '../uploads/images')
      : path.join(__dirname, '../uploads/videos');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Porcelain Gallery API Server' });
});

// Import routes
const productsRouter = require('./routes/products-simple');
const bestSellersRouter = require("./routes/best-sellers");
const adminRouter = require('./routes/admin');
const adminConfigRouter = require('./routes/admin-config');
const authRouter = require('./routes/auth');
const adminAuthRouter = require('./routes/admin-auth');
const commonRouter = require('./routes/common');
const mediaLibraryRouter = require('./routes/media-library');
const mediaLibraryOssRouter = require("./routes/media-library-admin");
const mediaDataRouter = require("./routes/media-data");
const usersRouter = require('./routes/users');
const resourceManagementRouter = require('./routes/resource-management');
const database = require('./config/database');

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Test dynasties route directly
app.get('/api/test-dynasties', async (req, res) => {
  try {
    const mysql = require('mysql2/promise');
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'porcelain123',
      database: process.env.DB_NAME || 'porcelain_gallery',
      port: process.env.DB_PORT || 3306,
    });
    
    const [dynasties] = await pool.execute(
      'SELECT * FROM dynasties ORDER BY sort_order ASC'
    );
    
    res.json({
      success: true,
      data: dynasties,
      message: 'Test dynasties working'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test dynasties failed',
      error: error.message
    });
  }
});

// Fixed API routes - 这些路由现在由commonRouter处理

// Use routes
app.use('/api/products', productsRouter);
app.use("/api/best-sellers", bestSellersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin-config', adminConfigRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin-auth', adminAuthRouter);
app.use('/api/media-library', mediaLibraryRouter);
app.use('/api/media-library-oss', mediaLibraryOssRouter);
app.use("/api/media-data", mediaDataRouter);
app.use('/api/users', usersRouter);
app.use('/api/resources', resourceManagementRouter);
app.use('/api', commonRouter); // 启用通用路由

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${PORT} (accessible from all interfaces)`);
  await testConnection();
  // Initialize database connection
  try {
    await database.connect();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
});

module.exports = { app, pool, upload };