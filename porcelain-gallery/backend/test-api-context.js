// Test database connection in API context
require('dotenv').config();
const database = require('./config/database');
const { Dynasty } = require('./models/Common');

async function testAPI() {
  try {
    console.log('Testing database connection...');
    await database.connect();
    console.log('Database connected');
    
    console.log('Testing Dynasty.findAll...');
    const dynasties = await Dynasty.findAll(database, { is_enabled: true });
    console.log('Dynasties found:', dynasties.length);
    console.log('First dynasty:', dynasties[0]);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAPI();





