// MySQL Database configuration and connection
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = null;
    this.connection = null;
  }

  // Initialize database connection pool
  async connect() {
    try {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'porcelain_gallery',
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4'
      });

      // Test connection
      const connection = await this.pool.getConnection();
      console.log('Connected to MySQL database');
      connection.release();

      // Initialize database schema
      await this.initializeDatabase();
      
    } catch (error) {
      console.error('Error connecting to MySQL database:', error.message);
      throw error;
    }
  }

  // Initialize database with schema
  async initializeDatabase() {
    try {
      const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
      
      if (!fs.existsSync(schemaPath)) {
        console.log('Schema file not found, skipping initialization');
        return;
      }

      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split schema into individual statements
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          await this.pool.execute(statement);
        }
      }

      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Error initializing database schema:', error.message);
      // Don't throw error for schema initialization failures
    }
  }

  // Execute SQL query
  async query(sql, params = []) {
    try {
      console.log('Executing SQL:', sql);
      console.log('With params:', params);
      
      if (!this.pool) {
        console.error('Database pool not initialized');
        throw new Error('Database pool not initialized');
      }
      
      const [rows] = await this.pool.execute(sql, params);
      console.log('Query result:', rows.length, 'rows');
      return rows;
    } catch (error) {
      console.error('Database query error:', error.message);
      throw error;
    }
  }

  // Execute SQL query and return single row
  async queryOne(sql, params = []) {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Database query error:', error.message);
      throw error;
    }
  }

  // Execute SQL query and return insert ID
  async insert(sql, params = []) {
    try {
      const [result] = await this.pool.execute(sql, params);
      return result.insertId;
    } catch (error) {
      console.error('Database insert error:', error.message);
      throw error;
    }
  }

  // Execute SQL query and return changes count
  async update(sql, params = []) {
    try {
      const [result] = await this.pool.execute(sql, params);
      return result.affectedRows;
    } catch (error) {
      console.error('Database update error:', error.message);
      throw error;
    }
  }

  // Execute SQL query and return changes count
  async delete(sql, params = []) {
    try {
      const [result] = await this.pool.execute(sql, params);
      return result.affectedRows;
    } catch (error) {
      console.error('Database delete error:', error.message);
      throw error;
    }
  }

  // Begin transaction
  async beginTransaction() {
    try {
      this.connection = await this.pool.getConnection();
      await this.connection.beginTransaction();
    } catch (error) {
      console.error('Error beginning transaction:', error.message);
      throw error;
    }
  }

  // Commit transaction
  async commit() {
    try {
      if (this.connection) {
        await this.connection.commit();
        this.connection.release();
        this.connection = null;
      }
    } catch (error) {
      console.error('Error committing transaction:', error.message);
      throw error;
    }
  }

  // Rollback transaction
  async rollback() {
    try {
      if (this.connection) {
        await this.connection.rollback();
        this.connection.release();
        this.connection = null;
      }
    } catch (error) {
      console.error('Error rolling back transaction:', error.message);
      throw error;
    }
  }

  // Execute query within transaction
  async executeInTransaction(sql, params = []) {
    try {
      if (!this.connection) {
        throw new Error('No active transaction');
      }
      const [result] = await this.connection.execute(sql, params);
      return result;
    } catch (error) {
      console.error('Error executing query in transaction:', error.message);
      throw error;
    }
  }

  // Close database connection pool
  async close() {
    try {
      if (this.pool) {
        await this.pool.end();
        console.log('Database connection pool closed');
      }
    } catch (error) {
      console.error('Error closing database:', error.message);
      throw error;
    }
  }

  // Get connection pool
  getPool() {
    return this.pool;
  }

  // Get current connection
  getConnection() {
    return this.connection;
  }

  // Test database connection
  async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error.message);
      return false;
    }
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;