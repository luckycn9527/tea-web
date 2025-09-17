// Test script to verify admin functionality
// This script will be run in the browser console to test admin store operations

console.log('Testing Admin Store Functionality...');

// Test 1: Check if admin store is initialized
console.log('1. Checking admin store initialization...');
if (typeof window !== 'undefined' && window.Vue) {
  console.log('Vue is available');
} else {
  console.log('Vue not available in this context');
}

// Test 2: Test product operations
console.log('2. Testing product operations...');

// Mock test data
const testProduct = {
  name: 'Test Product',
  name_cn: '测试产品',
  description: 'A test product for admin functionality',
  description_cn: '用于测试管理功能的测试产品',
  price: 99.99,
  dynasty_id: 1,
  shape_id: 1,
  primary_image: '/src/assets/tea_image/test-product.jpg',
  images: ['/src/assets/tea_image/test-product.jpg'],
  is_active: true
};

console.log('Test product data:', testProduct);

// Test 3: Test dynasty operations
console.log('3. Testing dynasty operations...');

const testDynasty = {
  name: 'Test Dynasty',
  name_cn: '测试朝代',
  period: '2025-2025',
  description: 'A test dynasty for admin functionality',
  description_cn: '用于测试管理功能的测试朝代',
  image_url: '/src/assets/tea_image/test-dynasty.jpg',
  image: '/src/assets/tea_image/test-dynasty.jpg',
  sort_order: 99,
  is_enabled: true
};

console.log('Test dynasty data:', testDynasty);

// Test 4: Test shape operations
console.log('4. Testing shape operations...');

const testShape = {
  name: 'Test Shape',
  name_cn: '测试形状',
  description: 'A test shape for admin functionality',
  description_cn: '用于测试管理功能的测试形状',
  sort_order: 99,
  is_enabled: true
};

console.log('Test shape data:', testShape);

console.log('Test data prepared. Run this in browser console on admin page to test functionality.');

