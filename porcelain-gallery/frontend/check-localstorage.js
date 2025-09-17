// 检查localStorage中的产品数据
function checkLocalStorageProducts() {
  console.log('=== 检查localStorage中的产品数据 ===');
  
  // 检查products
  const savedProducts = localStorage.getItem('products');
  if (savedProducts) {
    const products = JSON.parse(savedProducts);
    console.log('localStorage中的产品数量:', products.length);
    console.log('产品列表:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ID: ${product.id}, 名称: ${product.name_en || product.name_cn}, 图片: ${product.primary_image}`);
    });
  } else {
    console.log('localStorage中没有products数据');
  }
  
  // 检查bestSellersProducts
  const savedBestSellers = localStorage.getItem('bestSellersProducts');
  if (savedBestSellers) {
    const bestSellers = JSON.parse(savedBestSellers);
    console.log('\nlocalStorage中的Best Sellers数量:', bestSellers.length);
    console.log('Best Sellers列表:');
    bestSellers.forEach((product, index) => {
      console.log(`${index + 1}. ID: ${product.id}, 名称: ${product.name_en || product.name_cn}, 价格: ${product.price}`);
    });
  } else {
    console.log('localStorage中没有bestSellersProducts数据');
  }
  
  // 检查所有localStorage键
  console.log('\n=== localStorage中的所有键 ===');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(`${i + 1}. ${key}`);
  }
}

// 运行检查
checkLocalStorageProducts();


