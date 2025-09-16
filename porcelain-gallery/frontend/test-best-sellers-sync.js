// 测试Best Sellers数据同步
console.log('=== Best Sellers数据同步测试 ===');

// 检查localStorage中的Best Sellers数据
const savedBestSellers = localStorage.getItem('bestSellersProducts');
console.log('localStorage中的Best Sellers数据:', savedBestSellers ? JSON.parse(savedBestSellers) : '无数据');

// 检查admin store中的Best Sellers数据
console.log('Admin Store中的Best Sellers数据:', window.adminStore?.bestSellersProducts || '未找到adminStore');

// 检查前端页面显示的Best Sellers数据
console.log('前端页面Best Sellers数量:', document.querySelectorAll('[data-testid="best-seller"]').length);

// 检查admin页面Best Sellers配置
console.log('Admin页面Best Sellers配置:', document.querySelectorAll('.best-seller-item').length);

// 建议的修复方案
console.log('\n=== 建议的修复方案 ===');
console.log('1. 确保admin页面修改Best Sellers后保存到localStorage');
console.log('2. 确保前端页面正确从localStorage加载数据');
console.log('3. 确保数据格式一致');
console.log('4. 添加数据同步验证');


