const mysql = require('mysql2/promise');
require('dotenv').config();

async function getMediaLibraryData() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'porcelain_gallery',
    port: process.env.DB_PORT || 3306
  });

  try {
    const [mediaFiles] = await pool.execute(`
      SELECT 
        id,
        filename,
        original_filename,
        file_path,
        file_url,
        oss_url,
        mime_type,
        file_size,
        width,
        height,
        alt_text,
        caption,
        tags,
        category,
        is_public,
        uploaded_by,
        created_at
      FROM media_library 
      ORDER BY created_at DESC
    `);
    
    console.log('媒体库数据:');
    console.log(JSON.stringify({
      success: true,
      media: mediaFiles,
      total: mediaFiles.length
    }, null, 2));
    
  } catch (error) {
    console.error('数据库查询错误:', error.message);
  } finally {
    await pool.end();
  }
}

getMediaLibraryData().catch(console.error);
