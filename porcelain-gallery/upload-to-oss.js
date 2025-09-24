const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// OSS配置
const client = new OSS({
  region: process.env.OSS_REGION || 'oss-cn-hangzhou',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET || 'tea-web'
});

// 图片目录路径
const imageDir = path.join(__dirname, 'frontend/src/assets/tea_image');

// 上传单个文件
async function uploadFile(filePath, fileName) {
  try {
    const result = await client.put(`tea_image/${fileName}`, filePath);
    console.log(`✅ 上传成功: ${fileName} -> ${result.url}`);
    return result.url;
  } catch (error) {
    console.error(`❌ 上传失败: ${fileName}`, error.message);
    return null;
  }
}

// 批量上传所有图片
async function uploadAllImages() {
  console.log('🚀 开始上传图片到阿里云OSS...');
  console.log(`📁 图片目录: ${imageDir}`);
  
  try {
    // 检查目录是否存在
    if (!fs.existsSync(imageDir)) {
      throw new Error(`图片目录不存在: ${imageDir}`);
    }
    
    // 读取目录中的所有文件
    const files = fs.readdirSync(imageDir);
    const imageFiles = files.filter(file => 
      /\.(png|jpg|jpeg|gif|webp)$/i.test(file)
    );
    
    console.log(`📊 找到 ${imageFiles.length} 个图片文件`);
    
    const uploadResults = [];
    
    // 逐个上传文件
    for (const file of imageFiles) {
      const filePath = path.join(imageDir, file);
      const url = await uploadFile(filePath, file);
      
      if (url) {
        uploadResults.push({
          fileName: file,
          ossUrl: url,
          localPath: `/src/assets/tea_image/${file}`
        });
      }
      
      // 添加延迟避免请求过于频繁
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // 生成URL映射文件
    const mappingFile = path.join(__dirname, 'oss-image-mapping.json');
    fs.writeFileSync(mappingFile, JSON.stringify(uploadResults, null, 2));
    
    console.log('\n📋 上传结果统计:');
    console.log(`✅ 成功: ${uploadResults.length} 个文件`);
    console.log(`❌ 失败: ${imageFiles.length - uploadResults.length} 个文件`);
    console.log(`📄 映射文件: ${mappingFile}`);
    
    // 显示OSS URL示例
    if (uploadResults.length > 0) {
      console.log('\n🌐 OSS URL示例:');
      uploadResults.slice(0, 3).forEach(item => {
        console.log(`  ${item.fileName}: ${item.ossUrl}`);
      });
    }
    
    return uploadResults;
    
  } catch (error) {
    console.error('❌ 上传过程出错:', error.message);
    throw error;
  }
}

// 测试OSS连接
async function testConnection() {
  try {
    console.log('🔍 测试OSS连接...');
    const result = await client.getBucketInfo();
    console.log(`✅ OSS连接成功! Bucket: ${result.bucket.name}`);
    return true;
  } catch (error) {
    console.error('❌ OSS连接失败:', error.message);
    return false;
  }
}

// 主函数
async function main() {
  try {
    // 测试连接
    const connected = await testConnection();
    if (!connected) {
      process.exit(1);
    }
    
    // 开始上传
    await uploadAllImages();
    
    console.log('\n🎉 所有图片上传完成!');
    
  } catch (error) {
    console.error('💥 程序执行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  uploadAllImages,
  testConnection,
  client
};
