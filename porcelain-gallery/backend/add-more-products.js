const db = require('./config/database');

async function addMoreProducts() {
  await db.connect();
  
  console.log('=== 添加2个新的推荐产品 ===');
  
  try {
    // 添加产品7: Qing Dynasty Blue and White Teapot
    const product7Result = await db.execute(`
      INSERT INTO products (
        name_en, name_cn, slug, description_en, description_cn,
        craftsmanship_en, craftsmanship_cn, history_en, history_cn,
        price, original_price, dimensions, weight, age, material, color,
        dynasty_id, shape_id, category_id, primary_image_id, sku,
        stock_quantity, is_featured, is_available, is_digital,
        meta_title, meta_description, meta_keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Qing Dynasty Blue and White Teapot',
      '清代青花茶壶',
      'qing-dynasty-blue-white-teapot',
      'A beautiful Qing Dynasty blue and white teapot with intricate floral patterns.',
      '精美的清代青花茶壶，带有复杂的花卉图案。',
      'Hand-painted blue and white porcelain with traditional Chinese motifs.',
      '手工绘制的青花瓷，带有传统中国图案。',
      'This teapot represents the peak of Qing Dynasty porcelain craftsmanship.',
      '这个茶壶代表了清代瓷器工艺的巅峰。',
      280.00,
      350.00,
      '15cm x 12cm x 8cm',
      '0.8kg',
      '18th Century',
      'Porcelain',
      'Blue and White',
      4, // Qing Dynasty
      3, // Teapot
      1, // Category
      null, // Will be set after image is added
      'QING-TEAPOT-001',
      5,
      1, // is_featured
      1, // is_available
      0, // is_digital
      'Qing Dynasty Blue and White Teapot',
      'Beautiful Qing Dynasty porcelain teapot',
      'qing dynasty, blue white, teapot, porcelain'
    ]);
    
    const product7Id = product7Result.insertId;
    console.log(`产品7添加成功，ID: ${product7Id}`);
    
    // 添加产品7的主图
    await db.execute(`
      INSERT INTO product_images (
        product_id, image_url, image_path, alt_text, caption,
        is_primary, sort_order, file_size, mime_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      product7Id,
      '/src/assets/tea_image/qing-teapot.png',
      '/src/assets/tea_image/qing-teapot.png',
      'Qing Dynasty Blue and White Teapot',
      'Main image of Qing Dynasty teapot',
      1,
      1,
      1024000,
      'image/png'
    ]);
    
    const image7Id = await db.query('SELECT LAST_INSERT_ID() as id');
    const primaryImage7Id = image7Id[0].id;
    
    // 更新产品7的主图ID
    await db.execute('UPDATE products SET primary_image_id = ? WHERE id = ?', [primaryImage7Id, product7Id]);
    
    // 添加产品7的附加图片
    await db.execute(`
      INSERT INTO product_images (
        product_id, image_url, image_path, alt_text, caption,
        is_primary, sort_order, file_size, mime_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      product7Id,
      '/src/assets/tea_image/qing-teapot-detail.png',
      '/src/assets/tea_image/qing-teapot-detail.png',
      'Qing Dynasty Teapot Detail',
      'Detail view of the teapot',
      0,
      2,
      950000,
      'image/png'
    ]);
    
    // 添加产品8: Tang Dynasty Celadon Bowl
    const product8Result = await db.execute(`
      INSERT INTO products (
        name_en, name_cn, slug, description_en, description_cn,
        craftsmanship_en, craftsmanship_cn, history_en, history_cn,
        price, original_price, dimensions, weight, age, material, color,
        dynasty_id, shape_id, category_id, primary_image_id, sku,
        stock_quantity, is_featured, is_available, is_digital,
        meta_title, meta_description, meta_keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Tang Dynasty Celadon Bowl',
      '唐代青瓷碗',
      'tang-dynasty-celadon-bowl',
      'An exquisite Tang Dynasty celadon bowl with jade-like glaze.',
      '精美的唐代青瓷碗，带有玉质般的釉面。',
      'Celadon pottery with jade-green glaze, typical of Tang Dynasty.',
      '青瓷工艺，带有玉绿色釉面，典型的唐代风格。',
      'This bowl represents the sophisticated celadon techniques of Tang Dynasty.',
      '这个碗代表了唐代精湛的青瓷技术。',
      220.00,
      280.00,
      '18cm x 8cm',
      '0.6kg',
      '7th-9th Century',
      'Celadon',
      'Jade Green',
      1, // Tang Dynasty
      1, // Bowl
      1, // Category
      null, // Will be set after image is added
      'TANG-BOWL-001',
      8,
      1, // is_featured
      1, // is_available
      0, // is_digital
      'Tang Dynasty Celadon Bowl',
      'Exquisite Tang Dynasty celadon bowl',
      'tang dynasty, celadon, bowl, jade green'
    ]);
    
    const product8Id = product8Result.insertId;
    console.log(`产品8添加成功，ID: ${product8Id}`);
    
    // 添加产品8的主图
    await db.execute(`
      INSERT INTO product_images (
        product_id, image_url, image_path, alt_text, caption,
        is_primary, sort_order, file_size, mime_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      product8Id,
      '/src/assets/tea_image/tang-celadon-bowl.png',
      '/src/assets/tea_image/tang-celadon-bowl.png',
      'Tang Dynasty Celadon Bowl',
      'Main image of Tang Dynasty celadon bowl',
      1,
      1,
      980000,
      'image/png'
    ]);
    
    const image8Id = await db.query('SELECT LAST_INSERT_ID() as id');
    const primaryImage8Id = image8Id[0].id;
    
    // 更新产品8的主图ID
    await db.execute('UPDATE products SET primary_image_id = ? WHERE id = ?', [primaryImage8Id, product8Id]);
    
    // 添加产品8的附加图片
    await db.execute(`
      INSERT INTO product_images (
        product_id, image_url, image_path, alt_text, caption,
        is_primary, sort_order, file_size, mime_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      product8Id,
      '/src/assets/tea_image/tang-celadon-bowl-side.png',
      '/src/assets/tea_image/tang-celadon-bowl-side.png',
      'Tang Dynasty Bowl Side View',
      'Side view of the celadon bowl',
      0,
      2,
      920000,
      'image/png'
    ]);
    
    console.log('\\n=== 验证添加结果 ===');
    const featuredProducts = await db.query(`
      SELECT 
        p.id,
        p.name_en,
        p.is_featured,
        pi.image_url as primary_image_url
      FROM products p
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      WHERE p.is_featured = 1 AND p.is_available = 1
      ORDER BY p.created_at DESC
    `);
    
    console.log(`现在推荐产品总数: ${featuredProducts.length}`);
    featuredProducts.forEach((p, index) => {
      console.log(`${index + 1}. ID: ${p.id}, 名称: ${p.name_en}, 主图: ${p.primary_image_url}`);
    });
    
  } catch (error) {
    console.error('添加产品时出错:', error);
  }
  
  process.exit(0);
}

addMoreProducts();

