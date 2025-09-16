// 添加缺失的数据到数据库
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  charset: 'utf8mb4'
};

async function addMissingData() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('连接到数据库...');

    // 添加缺失的Yuan Dynasty
    console.log('添加Yuan Dynasty...');
    await connection.execute(`
      INSERT INTO dynasties (id, name, name_cn, period, description, description_cn, image_url, sort_order, is_enabled, created_at, updated_at)
      VALUES (5, 'Yuan Dynasty', '元朝', '1271-1368', 'Mongol rule brought new artistic influences', '蒙古统治带来了新的艺术影响', '/src/assets/tea_image/yuan.png', 3, 1, NOW(), NOW())
    `);
    console.log('Yuan Dynasty 添加成功');

    // 更新现有朝代的sort_order，为Yuan Dynasty腾出位置
    console.log('更新朝代排序...');
    await connection.execute('UPDATE dynasties SET sort_order = 4 WHERE id = 3'); // Ming
    await connection.execute('UPDATE dynasties SET sort_order = 5 WHERE id = 4'); // Qing
    console.log('朝代排序更新完成');

    // 添加更多产品数据
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

    // 添加产品图片
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

    // 更新产品的primary_image_id
    const [yuanImageResult] = await connection.execute('SELECT LAST_INSERT_ID() as id');
    await connection.execute('UPDATE products SET primary_image_id = ? WHERE id = 4', [yuanImageResult[0].id - 1]);
    await connection.execute('UPDATE products SET primary_image_id = ? WHERE id = 5', [yuanImageResult[0].id]);

    console.log('✅ 所有缺失数据添加完成！');
    
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
  addMissingData()
    .then(() => {
      console.log('\n🎉 缺失数据添加完成！');
      console.log('现在可以重新同步前端数据了。');
      process.exit(0);
    })
    .catch((error) => {
      console.error('添加数据失败:', error);
      process.exit(1);
    });
}

module.exports = { addMissingData };
