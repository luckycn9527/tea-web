// Database initialization script for MySQL
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  
  try {
    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'porcelain_gallery';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' created or already exists`);

    // Use the database
    await connection.query(`USE \`${dbName}\``);

    // Read and execute schema
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('Schema file not found:', schemaPath);
      return;
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log(`✓ Executed statement ${i + 1}/${statements.length}`);
        } catch (error) {
          console.error(`✗ Error executing statement ${i + 1}:`, error.message);
          console.error('Statement:', statement.substring(0, 100) + '...');
        }
      }
    }

    // Insert sample data
    await insertSampleData(connection);

    console.log('✅ Database initialization completed successfully!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

async function insertSampleData(connection) {
  console.log('Inserting sample data...');

  try {
    // Insert dynasties
    const dynasties = [
      ['Tang Dynasty', '唐朝', '618-907', 'The Tang Dynasty was a golden age of Chinese civilization.', '唐朝是中国文明的黄金时代。', '/src/assets/tea_image/tang.png', 1],
      ['Song Dynasty', '宋朝', '960-1279', 'The Song Dynasty was known for its cultural achievements.', '宋朝以其文化成就而闻名。', '/src/assets/tea_image/song.png', 2],
      ['Yuan Dynasty', '元朝', '1271-1368', 'The Yuan Dynasty was established by the Mongols.', '元朝由蒙古人建立。', '/src/assets/tea_image/yuan.png', 3],
      ['Ming Dynasty', '明朝', '1368-1644', 'The Ming Dynasty was known for its porcelain.', '明朝以其瓷器而闻名。', '/src/assets/tea_image/ming.png', 4],
      ['Qing Dynasty', '清朝', '1644-1912', 'The Qing Dynasty was the last imperial dynasty.', '清朝是最后一个帝国王朝。', '/src/assets/tea_image/qing.png', 5],
      ['Modern', '现代', '1912-present', 'Modern Chinese porcelain continues the tradition.', '现代中国瓷器延续了传统。', '/src/assets/tea_image/modern.png', 6]
    ];

    for (const dynasty of dynasties) {
      await connection.execute(
        'INSERT IGNORE INTO dynasties (name, name_cn, period, description, description_cn, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
        dynasty
      );
    }

    // Insert shapes
    const shapes = [
      ['Vase', '花瓶', 'Traditional Chinese vase shape', '传统中国花瓶形状', 1],
      ['Bowl', '碗', 'Classic Chinese bowl design', '经典中国碗设计', 2],
      ['Plate', '盘子', 'Elegant Chinese plate form', '优雅的中国盘子形式', 3],
      ['Teapot', '茶壶', 'Traditional Chinese teapot', '传统中国茶壶', 4],
      ['Bottle', '瓶子', 'Chinese porcelain bottle', '中国瓷器瓶子', 5],
      ['Bracelet', '手链', 'Modern jewelry design', '现代珠宝设计', 6]
    ];

    for (const shape of shapes) {
      await connection.execute(
        'INSERT IGNORE INTO shapes (name, name_cn, description, description_cn, sort_order) VALUES (?, ?, ?, ?, ?)',
        shape
      );
    }

    // Insert sample products
    const products = [
      [
        'Blue and White Porcelain Vase',
        '青花瓷花瓶',
        'blue-white-porcelain-vase',
        'Classic blue and white porcelain vase from the Ming Dynasty, featuring traditional Chinese motifs and exquisite craftsmanship.',
        '明代经典青花瓷花瓶，采用传统中国图案，工艺精湛。',
        'Hand-painted with cobalt blue underglaze on white porcelain body.',
        '在白瓷胎上手工绘制钴蓝釉下彩。',
        'Blue and white porcelain originated in the Tang Dynasty and reached its peak during the Ming Dynasty.',
        '青花瓷起源于唐代，在明代达到鼎盛。',
        255.00,
        300.00,
        'Height: 25cm, Width: 15cm',
        '1.2kg',
        'Antique',
        'Porcelain',
        'Blue and White',
        4, // Ming Dynasty
        1, // Vase
        null, // No category
        null, // No primary image yet
        'BWV-001',
        5,
        true,
        true,
        false,
        'Blue and White Porcelain Vase - Ming Dynasty',
        'Authentic Ming Dynasty blue and white porcelain vase',
        'porcelain, vase, blue, white, ming dynasty'
      ],
      [
        'Famille Rose Tea Bowl',
        '粉彩茶碗',
        'famille-rose-tea-bowl',
        'Elegant famille rose tea bowl with delicate floral patterns, perfect for traditional tea ceremonies.',
        '优雅的粉彩茶碗，带有精美的花卉图案，非常适合传统茶道。',
        'Hand-painted with famille rose enamels over white porcelain.',
        '在白瓷上手工绘制粉彩釉料。',
        'Famille rose technique was developed during the Qing Dynasty.',
        '粉彩技术发展于清代。',
        275.00,
        320.00,
        'Diameter: 12cm, Height: 6cm',
        '0.3kg',
        'Antique',
        'Porcelain',
        'Pink and Green',
        5, // Qing Dynasty
        2, // Bowl
        null,
        null,
        'FRB-002',
        3,
        true,
        true,
        false,
        'Famille Rose Tea Bowl - Qing Dynasty',
        'Beautiful Qing Dynasty famille rose tea bowl',
        'porcelain, bowl, famille rose, qing dynasty'
      ]
    ];

    for (const product of products) {
      await connection.execute(
        `INSERT IGNORE INTO products (
          name_en, name_cn, slug, description_en, description_cn,
          craftsmanship_en, craftsmanship_cn, history_en, history_cn,
          price, original_price, dimensions, weight, age, material, color,
          dynasty_id, shape_id, category_id, primary_image_id, sku,
          stock_quantity, is_featured, is_available, is_digital,
          meta_title, meta_description, meta_keywords
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        product
      );
    }

    // Insert site settings
    const settings = [
      ['site_title', 'Chinese Porcelain Gallery', 'text', 'Main site title', true],
      ['site_description', 'Discover authentic Chinese porcelain masterpieces', 'text', 'Site description', true],
      ['contact_email', 'info@porcelain-gallery.com', 'text', 'Contact email', true],
      ['currency', 'USD', 'text', 'Default currency', true],
      ['items_per_page', '12', 'number', 'Default items per page', true]
    ];

    for (const setting of settings) {
      await connection.execute(
        'INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, description, is_public) VALUES (?, ?, ?, ?, ?)',
        setting
      );
    }

    // Insert content sections
    const sections = [
      [
        'hero_section',
        'Discover Chinese Porcelain Masterpieces',
        '发现中国瓷器杰作',
        'Explore our curated collection of authentic Chinese porcelain from legendary dynasties.',
        '探索我们精心策划的来自传奇王朝的正宗中国瓷器收藏。',
        '/src/assets/tea_image/background.png',
        'Explore Collection',
        '探索收藏',
        '/products',
        1
      ],
      [
        'rare_dynasty_collection',
        'Rare Dynasty Collection',
        '稀有王朝收藏',
        'Crafted in small batches with rare find stones, each piece is made to stand out, just as unique as the person who wears it.',
        '采用稀有石材小批量制作，每件作品都独具特色，就像佩戴它的人一样独特。',
        '/src/assets/tea_image/best.png',
        'EXPLORE COLLECTION',
        '探索收藏',
        '/products',
        2
      ],
      [
        'heritage_story',
        'Forget mass-produced',
        '忘记批量生产',
        'From our hands to yours. In China, the birthplace of porcelain, our family-owned business creates each piece with meticulous care, using only the finest materials and traditional techniques.',
        '从我们的手中到您的手中。在中国，瓷器的发源地，我们的家族企业精心制作每一件作品，只使用最优质的材料和传统工艺。',
        '/src/assets/tea_image/zhizuo.png',
        null,
        null,
        null,
        3
      ]
    ];

    for (const section of sections) {
      await connection.execute(
        'INSERT IGNORE INTO content_sections (section_key, title_en, title_cn, content_en, content_cn, image_url, button_text_en, button_text_cn, button_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        section
      );
    }

    console.log('✅ Sample data inserted successfully!');

  } catch (error) {
    console.error('❌ Error inserting sample data:', error.message);
    throw error;
  }
}

// Run initialization
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database initialization completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
