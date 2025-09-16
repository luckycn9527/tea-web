// Reset MySQL root password script
const mysql = require('mysql2/promise');

async function resetPassword() {
  let connection;
  
  try {
    console.log('Attempting to connect to MySQL...');
    
    // Try different common passwords
    const passwords = ['', 'root', '123456', 'password', 'admin', 'mysql'];
    
    for (const password of passwords) {
      try {
        console.log(`Trying password: ${password || '(empty)'}`);
        
        connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: password,
          port: 3306
        });
        
        console.log(`✅ Connected with password: ${password || '(empty)'}`);
        
        // Reset password to 123456
        await connection.execute("ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';");
        console.log('✅ Password reset successfully to: 123456');
        
        await connection.end();
        return true;
        
      } catch (error) {
        console.log(`❌ Failed with password: ${password || '(empty)'}`);
        if (connection) {
          await connection.end();
          connection = null;
        }
      }
    }
    
    console.log('❌ Could not connect with any common password');
    return false;
    
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

// Run the script
resetPassword().then(success => {
  if (success) {
    console.log('🎉 Password reset completed! You can now use password: 123456');
  } else {
    console.log('💥 Password reset failed. Please check MySQL configuration.');
  }
  process.exit(success ? 0 : 1);
});

