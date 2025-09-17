// 测试媒体库上传功能
const testUpload = async () => {
  try {
    // 获取admin token
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: '123456'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    console.log('Login successful, token:', token);

    // 测试上传
    const formData = new FormData();
    
    // 创建一个测试文件
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    formData.append('file', testFile);
    formData.append('category', 'test');
    formData.append('is_public', 'true');

    const uploadResponse = await fetch('/api/media-library-oss/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }

    const uploadData = await uploadResponse.json();
    console.log('Upload successful:', uploadData);

  } catch (error) {
    console.error('Test failed:', error);
  }
};

// 运行测试
testUpload();
