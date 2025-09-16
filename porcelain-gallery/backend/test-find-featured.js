// 测试Product.findFeatured方法
require('dotenv').config();
const database = require('./config/database');
const { Product } = require('./models/Product');

async function testFindFeatured() {
  try {
    console.log('连接到数据库...');
    await database.connect();
    console.log('数据库连接成功');

    console.log('\n测试Product.findFeatured方法...');
    
    // 测试findFeatured方法
    const featuredProducts = await Product.findFeatured(database, 8);
    console.log('找到的featured产品数量:', featuredProducts.length);
    
    if (featuredProducts.length > 0) {
      console.log('\n第一个featured产品:');
      console.log('ID:', featuredProducts[0].id);
      console.log('名称:', featuredProducts[0].name_en);
      console.log('价格:', featuredProducts[0].price);
      console.log('朝代:', featuredProducts[0].dynasty_name);
      console.log('形状:', featuredProducts[0].shape_name);
      console.log('主图:', featuredProducts[0].primary_image_url);
    }

    // 也测试直接SQL查询
    console.log('\n测试直接SQL查询...');
    const directResult = await database.query(`
      SELECT 
        p.*,
        d.name as dynasty_name,
        d.name_cn as dynasty_name_cn,
        s.name as shape_name,
        s.name_cn as shape_name_cn,
        pi.image_url as primary_image_url,
        pi.alt_text as primary_image_alt
      FROM products p
      LEFT JOIN dynasties d ON p.dynasty_id = d.id
      LEFT JOIN shapes s ON p.shape_id = s.id
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      WHERE p.is_featured = 1 AND p.is_available = 1
      ORDER BY p.created_at DESC
      LIMIT ?
    `, [8]);
    
    console.log('直接SQL查询结果数量:', directResult.length);
    if (directResult.length > 0) {
      console.log('第一个产品:', directResult[0].name_en);
    }

  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    await database.close();
    console.log('\n数据库连接已关闭');
  }
}

testFindFeatured();

