const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createMediaLibraryPage() {
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
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>媒体库数据访问</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }
        .container { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 1200px; margin: 0 auto; }
        h1 { color: #0056b3; text-align: center; }
        .stats { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
        .media-item { border: 1px solid #ddd; border-radius: 5px; padding: 10px; text-align: center; }
        .media-item img { max-width: 100%; height: 150px; object-fit: cover; border-radius: 3px; }
        .media-info { margin-top: 10px; font-size: 12px; color: #666; }
        .category { background-color: #007bff; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; }
        .success { color: green; font-weight: bold; }
        pre { background-color: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; max-height: 400px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>媒体库数据访问</h1>
        <div class="stats">
            <p class="success">✅ 成功加载媒体库数据</p>
            <p><strong>总文件数：</strong>${mediaFiles.length}</p>
            <p><strong>最新上传：</strong>${mediaFiles[0]?.created_at || 'N/A'}</p>
        </div>
        
        <h2>媒体文件预览</h2>
        <div class="media-grid">
            ${mediaFiles.map(file => `
                <div class="media-item">
                    <img src="${file.oss_url}" alt="${file.alt_text || file.filename}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD48L3N2Zz4='">
                    <div class="media-info">
                        <div><strong>${file.original_filename}</strong></div>
                        <div>${file.category ? `<span class="category">${file.category}</span>` : ''}</div>
                        <div>${file.width}x${file.height}</div>
                        <div>${(file.file_size / 1024 / 1024).toFixed(2)}MB</div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <h2>JSON数据</h2>
        <pre>${JSON.stringify({
            success: true,
            media: mediaFiles,
            total: mediaFiles.length
        }, null, 2)}</pre>
    </div>
</body>
</html>
    `;

    const filePath = path.join(__dirname, '../../frontend/dist/media-library.html');
    fs.writeFileSync(filePath, htmlContent);
    console.log('✅ 媒体库数据访问页面已创建！');
    console.log('📁 文件路径:', filePath);
    console.log('🌐 访问地址: https://www.zaopic.cn/media-library.html');
    console.log('📊 包含', mediaFiles.length, '个媒体文件');
    
  } catch (error) {
    console.error('❌ 创建媒体库页面失败:', error);
  } finally {
    await pool.end();
  }
}

createMediaLibraryPage().catch(console.error);
