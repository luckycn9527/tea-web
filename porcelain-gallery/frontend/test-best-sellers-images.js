// 测试Best Sellers图片同步
console.log('=== Best Sellers图片同步测试 ===');

// 检查admin store中的Best Sellers产品图片
const adminStore = window.adminStore;
if (adminStore && adminStore.bestSellersProducts) {
  console.log('Admin Store Best Sellers Products:');
  adminStore.bestSellersProducts.forEach((product, index) => {
    console.log(`Product ${index}: ${product.name}`);
    console.log(`  Main Image: ${product.mainImage}`);
    console.log(`  Thumbnails:`, product.thumbnails);
  });
} else {
  console.log('Admin Store not found or bestSellersProducts not available');
}

// 检查localStorage中的Best Sellers数据
const savedBestSellers = localStorage.getItem('bestSellersProducts');
if (savedBestSellers) {
  const parsedProducts = JSON.parse(savedBestSellers);
  console.log('\nLocalStorage Best Sellers Products:');
  parsedProducts.forEach((product, index) => {
    console.log(`Product ${index}: ${product.name}`);
    console.log(`  Main Image: ${product.mainImage}`);
    console.log(`  Thumbnails:`, product.thumbnails);
  });
} else {
  console.log('No Best Sellers data in localStorage');
}

// 检查前端页面显示的图片
console.log('\n前端页面图片检查:');
const bestSellerImages = document.querySelectorAll('.best-seller img');
console.log(`找到 ${bestSellerImages.length} 个Best Seller图片`);
bestSellerImages.forEach((img, index) => {
  console.log(`图片 ${index}: src="${img.src}", alt="${img.alt}"`);
});

// 建议的修复方案
console.log('\n=== 建议的修复方案 ===');
console.log('1. 确保admin页面修改图片后正确保存到localStorage');
console.log('2. 确保前端页面正确从localStorage加载图片数据');
console.log('3. 确保图片路径计算正确（originalIndex = product.id - 10000）');
console.log('4. 添加图片同步验证和调试信息');


