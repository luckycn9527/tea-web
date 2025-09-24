// 使用Node.js内置的fetch (Node.js 18+)
// const fetch = require('node-fetch');

async function testMediaLibraryAPI() {
  const baseURL = 'http://localhost:3000';
  
  try {
    console.log('🧪 测试媒体库API...\n');
    
    // 1. 测试管理员登录
    console.log('1. 测试管理员登录...');
    const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: '123456'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`登录失败: ${loginResponse.status} ${loginResponse.statusText}`);
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ 登录成功');
    console.log('   用户:', loginData.user.username);
    console.log('   角色:', loginData.user.role);
    
    const token = loginData.token;
    
    // 2. 测试获取媒体库
    console.log('\n2. 测试获取媒体库...');
    const mediaResponse = await fetch(`${baseURL}/api/media-library`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!mediaResponse.ok) {
      throw new Error(`获取媒体库失败: ${mediaResponse.status} ${mediaResponse.statusText}`);
    }
    
    const mediaData = await mediaResponse.json();
    console.log('✅ 媒体库获取成功');
    console.log('   总文件数:', mediaData.media.length);
    
    // 3. 分析现有图片
    const existingImages = mediaData.media.filter(media => media.is_existing);
    const uploadedImages = mediaData.media.filter(media => !media.is_existing);
    
    console.log('\n📊 媒体库统计:');
    console.log('   现有图片:', existingImages.length);
    console.log('   上传图片:', uploadedImages.length);
    
    // 4. 显示现有图片列表
    if (existingImages.length > 0) {
      console.log('\n🖼️ 现有图片列表:');
      existingImages.forEach((image, index) => {
        console.log(`   ${index + 1}. ${image.filename}`);
        console.log(`      大小: ${image.file_size} bytes`);
        console.log(`      尺寸: ${image.width} x ${image.height}`);
        console.log(`      类型: ${image.mime_type}`);
        console.log(`      URL: ${image.file_url}`);
        console.log('');
      });
    }
    
    // 5. 显示上传图片列表
    if (uploadedImages.length > 0) {
      console.log('\n📤 上传图片列表:');
      uploadedImages.forEach((image, index) => {
        console.log(`   ${index + 1}. ${image.filename}`);
        console.log(`      大小: ${image.file_size} bytes`);
        console.log(`      尺寸: ${image.width} x ${image.height}`);
        console.log(`      类型: ${image.mime_type}`);
        console.log(`      URL: ${image.file_url}`);
        console.log('');
      });
    }
    
    console.log('✅ 媒体库API测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('错误详情:', error);
  }
}

// 运行测试
testMediaLibraryAPI();
