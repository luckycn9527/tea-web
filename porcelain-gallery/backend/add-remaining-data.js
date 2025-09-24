// 添加剩余缺失的数据到数据库
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  charset: 'utf8mb4'
};

async function addRemainingData() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('连接到数据库...');

    // 1. 添加更多形状
    console.log('添加更多形状...');
    
    // 形状4: Bowl
    await connection.execute(`
      INSERT INTO shapes (id, name, name_cn, description, description_cn, sort_order, is_enabled, created_at, updated_at)
      VALUES (4, 'Bowl', '碗', 'Traditional Chinese bowl for serving and display', '传统中国碗，用于盛装和展示', 4, 1, NOW(), NOW())
    `);
    console.log('Bowl 形状添加成功');

    // 形状5: Plate
    await connection.execute(`
      INSERT INTO shapes (id, name, name_cn, description, description_cn, sort_order, is_enabled, created_at, updated_at)
      VALUES (5, 'Plate', '盘子', 'Traditional Chinese plate for serving food', '传统中国盘子，用于盛装食物', 5, 1, NOW(), NOW())
    `);
    console.log('Plate 形状添加成功');

    // 2. 添加更多产品数据
    console.log('添加更多产品...');
    
    // 产品4: Yuan Dynasty Blue and White Bowl
    await connection.execute(`
      INSERT INTO products (
        id, name_en, name_cn, slug, description_en, description_cn, craftsmanship_en, craftsmanship_cn,
        history_en, history_cn, price, original_price, dimensions, weight, age, material, color,
        dynasty_id, shape_id, category_id, sku, stock_quantity, is_featured, is_available,
        is_digital, meta_title, meta_description, meta_keywords, view_count, created_at, updated_at
      ) VALUES (
        4, 'Yuan Dynasty Blue and White Bowl', '元代青花碗', 'yuan-dynasty-blue-white-bowl',
        'Exquisite blue and white bowl from the Yuan Dynasty, showcasing the early development of blue and white porcelain.',
        '元代精美的青花碗，展示了青花瓷的早期发展。',
        'Hand-painted cobalt blue designs on white porcelain with traditional Chinese motifs.',
        '在白瓷上手工绘制钴蓝图案，采用传统中国纹样。',
        'The Yuan Dynasty marked the beginning of blue and white porcelain production in China.',
        '元代标志着中国青花瓷生产的开始。',
        180.00, 220.00, 'Diameter: 20cm, Height: 8cm', '0.8kg', 'Antique', 'Porcelain', 'Blue and White',
        5, 4, NULL, 'YBW-004', 3, true, true, false,
        'Yuan Dynasty Blue and White Bowl', 'Authentic Yuan Dynasty blue and white bowl',
        'yuan dynasty, blue white, bowl, porcelain', 0, NOW(), NOW()
      )
    `);
    console.log('Yuan Dynasty Bowl 产品添加成功');

    // 产品5: Ming Dynasty Celadon Vase
    await connection.execute(`
      INSERT INTO products (
        id, name_en, name_cn, slug, description_en, description_cn, craftsmanship_en, craftsmanship_cn,
        history_en, history_cn, price, original_price, dimensions, weight, age, material, color,
        dynasty_id, shape_id, category_id, sku, stock_quantity, is_featured, is_available,
        is_digital, meta_title, meta_description, meta_keywords, view_count, created_at, updated_at
      ) VALUES (
        5, 'Ming Dynasty Celadon Vase', '明代青瓷花瓶', 'ming-dynasty-celadon-vase',
        'Beautiful celadon vase from the Ming Dynasty, featuring the characteristic jade-like green glaze.',
        '明代美丽的青瓷花瓶，具有特有的玉绿色釉面。',
        'High-fired celadon with iron-rich glaze creating the characteristic green color.',
        '高温烧制的青瓷，富含铁的釉料创造出特有的绿色。',
        'Celadon ware was highly prized during the Ming Dynasty for its aesthetic beauty.',
        '青瓷在明代因其美学价值而备受推崇。',
        320.00, 380.00, 'Height: 30cm, Width: 18cm', '1.5kg', 'Antique', 'Celadon', 'Celadon Green',
        3, 1, NULL, 'MCV-005', 2, true, true, false,
        'Ming Dynasty Celadon Vase', 'Authentic Ming Dynasty celadon vase',
        'ming dynasty, celadon, vase, green', 0, NOW(), NOW()
      )
    `);
    console.log('Ming Dynasty Celadon Vase 产品添加成功');

    // 产品6: Song Dynasty White Porcelain Plate
    await connection.execute(`
      INSERT INTO products (
        id, name_en, name_cn, slug, description_en, description_cn, craftsmanship_en, craftsmanship_cn,
        history_en, history_cn, price, original_price, dimensions, weight, age, material, color,
        dynasty_id, shape_id, category_id, sku, stock_quantity, is_featured, is_available,
        is_digital, meta_title, meta_description, meta_keywords, view_count, created_at, updated_at
      ) VALUES (
        6, 'Song Dynasty White Porcelain Plate', '宋代白瓷盘', 'song-dynasty-white-porcelain-plate',
        'Elegant white porcelain plate from the Song Dynasty, known for its pure white color and refined craftsmanship.',
        '宋代优雅的白瓷盘，以其纯白色和精湛工艺而闻名。',
        'High-fired white porcelain with pure white glaze and delicate form.',
        '高温烧制的白瓷，具有纯白釉面和精致造型。',
        'White porcelain reached its peak during the Song Dynasty.',
        '白瓷在宋代达到鼎盛。',
        150.00, 180.00, 'Diameter: 25cm, Height: 3cm', '0.6kg', 'Antique', 'White Porcelain', 'White',
        2, 5, NULL, 'SWP-006', 4, true, true, false,
        'Song Dynasty White Porcelain Plate', 'Authentic Song Dynasty white porcelain plate',
        'song dynasty, white porcelain, plate', 0, NOW(), NOW()
      )
    `);
    console.log('Song Dynasty White Porcelain Plate 产品添加成功');

    // 3. 添加产品图片
    console.log('添加产品图片...');
    
    // Yuan Dynasty Bowl 图片
    await connection.execute(`
      INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order, created_at)
      VALUES (4, '/src/assets/tea_image/yuan-bowl.png', 'Yuan Dynasty Blue and White Bowl', 1, 1, NOW())
    `);
    
    // Ming Dynasty Celadon Vase 图片
    await connection.execute(`
      INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order, created_at)
      VALUES (5, '/src/assets/tea_image/ming-celadon.png', 'Ming Dynasty Celadon Vase', 1, 1, NOW())
    `);

    // Song Dynasty White Porcelain Plate 图片
    await connection.execute(`
      INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order, created_at)
      VALUES (6, '/src/assets/tea_image/song-white-plate.png', 'Song Dynasty White Porcelain Plate', 1, 1, NOW())
    `);

    // 4. 更新产品的primary_image_id
    const [imageResult] = await connection.execute('SELECT LAST_INSERT_ID() as id');
    const yuanImageId = imageResult[0].id - 2;
    const mingImageId = imageResult[0].id - 1;
    const songImageId = imageResult[0].id;
    
    await connection.execute('UPDATE products SET primary_image_id = ? WHERE id = 4', [yuanImageId]);
    await connection.execute('UPDATE products SET primary_image_id = ? WHERE id = 5', [mingImageId]);
    await connection.execute('UPDATE products SET primary_image_id = ? WHERE id = 6', [songImageId]);
    console.log('产品图片关联更新完成');

    console.log('✅ 所有剩余数据添加完成！');
    
    // 显示最终统计
    const [dynasties] = await connection.execute('SELECT COUNT(*) as count FROM dynasties');
    const [shapes] = await connection.execute('SELECT COUNT(*) as count FROM shapes');
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    
    console.log('\n📊 最终数据统计:');
    console.log(`- 朝代: ${dynasties[0].count} 个`);
    console.log(`- 形状: ${shapes[0].count} 个`);
    console.log(`- 产品: ${products[0].count} 个`);

  } catch (error) {
    console.error('❌ 添加数据时出错:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('数据库连接已关闭');
    }
  }
}

if (require.main === module) {
  addRemainingData()
    .then(() => {
      console.log('\n🎉 剩余数据添加完成！');
      console.log('现在可以重新同步前端数据了。');
      process.exit(0);
    })
    .catch((error) => {
      console.error('添加数据失败:', error);
      process.exit(1);
    });
}

module.exports = { addRemainingData };

