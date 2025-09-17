# Nginx配置修复建议

## 问题描述
用户上传图片时遇到413 "Content Too Large"错误，这是因为nginx的`client_max_body_size`设置过小导致的。

## 立即解决方案

### 方案1：修改nginx配置文件（推荐）
在nginx配置文件中添加或修改以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 设置客户端请求体最大大小
    client_max_body_size 50M;
    
    # 设置超时时间
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # 代理到Node.js应用
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 设置代理超时
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 专门处理上传请求
    location /api/media-library-oss/upload {
        client_max_body_size 50M;
        client_body_timeout 120s;
        
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
}
```

### 方案2：临时解决方案（已实现）
前端已实现智能压缩功能，会自动将文件压缩到1MB以下：
- 单文件限制：1MB
- 总文件限制：5MB
- 自动压缩超大文件
- 压缩进度显示

## 生产环境配置修改步骤

### 1. 找到nginx配置文件
```bash
# 查找nginx配置文件位置
nginx -t

# 通常位置：
# /etc/nginx/nginx.conf
# /etc/nginx/sites-available/default
# /etc/nginx/conf.d/default.conf
# /etc/nginx/sites-available/zaopic.cn
```

### 2. 备份原配置
```bash
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
# 或者
sudo cp /etc/nginx/sites-available/zaopic.cn /etc/nginx/sites-available/zaopic.cn.backup
```

### 3. 修改配置
使用文本编辑器修改配置文件：
```bash
sudo nano /etc/nginx/sites-available/default
# 或者
sudo nano /etc/nginx/sites-available/zaopic.cn
```

### 4. 测试配置
```bash
sudo nginx -t
```

### 5. 重新加载配置
```bash
sudo systemctl reload nginx
# 或者
sudo systemctl restart nginx
```

## 生产环境特定配置

### 针对zaopic.cn的配置：
```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name zaopic.cn www.zaopic.cn;
    
    # SSL配置（如果有）
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # 设置客户端请求体最大大小
    client_max_body_size 50M;
    
    # 设置超时时间
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # 静态文件处理
    location /static/ {
        alias /path/to/static/files/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 代理到Node.js应用
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 设置代理超时
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 专门处理上传请求
    location /api/media-library-oss/upload {
        client_max_body_size 50M;
        client_body_timeout 120s;
        
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
}
```

## 验证修复

### 1. 检查nginx状态
```bash
sudo systemctl status nginx
```

### 2. 测试上传功能
上传一个大于1MB的文件，检查是否还有413错误。

### 3. 检查nginx日志
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 4. 验证配置生效
```bash
# 检查nginx配置
sudo nginx -T | grep client_max_body_size

# 应该显示：
# client_max_body_size 50M;
```

## 故障排除

### 问题1：配置文件语法错误
```bash
sudo nginx -t
```
如果出现语法错误，检查配置文件中的括号、分号等。

### 问题2：权限问题
```bash
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

### 问题3：端口冲突
```bash
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

### 问题4：防火墙问题
```bash
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443
```

### 问题5：SSL证书问题
```bash
# 检查SSL证书
sudo openssl x509 -in /path/to/certificate.crt -text -noout

# 检查证书有效期
sudo openssl x509 -in /path/to/certificate.crt -dates -noout
```

## 回滚方案

### 如果配置修改后出现问题：
```bash
# 恢复备份配置
sudo cp /etc/nginx/sites-available/default.backup /etc/nginx/sites-available/default

# 重新加载配置
sudo systemctl reload nginx

# 检查服务状态
sudo systemctl status nginx
```

## 相关配置说明
- `client_max_body_size`: 客户端请求体最大大小
- `client_body_timeout`: 客户端请求体读取超时时间
- `proxy_read_timeout`: 代理读取超时时间
- `proxy_send_timeout`: 代理发送超时时间

## 注意事项
- `client_max_body_size`设置为50M，与应用层的限制保持一致
- 增加了超时时间设置，避免大文件上传超时
- 为上传接口单独配置了更长的超时时间
- 建议在生产环境中根据实际需求调整这些值
- 前端已实现智能压缩作为备选方案
- 修改配置前务必备份原配置
- 测试配置语法后再重新加载
