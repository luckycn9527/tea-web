// 测试后端服务健康检查
const http = require('http');

function testHealthCheck() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/health',
    method: 'GET'
  };

  console.log('=== 测试后端服务健康检查 ===');
  console.log('📝 请求地址: http://localhost:3000/api/health');

  const req = http.request(options, (res) => {
    console.log('📊 响应状态:', res.statusCode);
    console.log('📊 响应头:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const responseData = JSON.parse(data);
        console.log('📊 响应数据:', JSON.stringify(responseData, null, 2));
        
        if (res.statusCode === 200) {
          console.log('\n✅ 后端服务运行正常！');
        } else {
          console.log('\n❌ 后端服务异常');
        }
      } catch (error) {
        console.error('❌ 解析响应错误:', error.message);
        console.log('原始响应:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ 请求错误:', error.message);
  });

  req.end();
}

testHealthCheck();


