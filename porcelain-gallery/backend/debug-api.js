// Debug API test
require('dotenv').config();
const { Dynasty } = require('./models/Common');
const database = require('./config/database');

async function testAPI() {
  try {
    await database.connect();
    console.log('Database connected');
    
    // Test Dynasty.findAll
    const dynasties = await Dynasty.findAll(database, { is_enabled: true });
    console.log('Dynasties found:', dynasties.length);
    console.log('First dynasty:', dynasties[0]);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAPI();





