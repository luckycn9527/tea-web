// 详细检查localStorage中的产品数据结构
function checkProductDataStructure() {
  console.log('=== 详细检查产品数据结构 ===');
  
  const savedProducts = localStorage.getItem('products');
  if (savedProducts) {
    const products = JSON.parse(savedProducts);
    console.log('产品总数:', products.length);
    
    products.forEach((product, index) => {
      console.log(`\n产品 ${index + 1}:`);
      console.log(`  ID: ${product.id} (类型: ${typeof product.id})`);
      console.log(`  名称: ${product.name_en || product.name_cn}`);
      console.log(`  价格: ${product.price} (类型: ${typeof product.price})`);
      console.log(`  朝代: ${product.dynasty_name}`);
      console.log(`  器型: ${product.shape_name}`);
      console.log(`  主图: ${product.primary_image}`);
      
      // 检查价格字段的详细信息
      if (typeof product.price === 'string') {
        console.log(`  价格字符串内容: "${product.price}"`);
        console.log(`  价格长度: ${product.price.length}`);
        console.log(`  是否包含数字: ${/\d/.test(product.price)}`);
      }
    });
  } else {
    console.log('localStorage中没有products数据');
  }
}

// 运行检查
checkProductDataStructure();


