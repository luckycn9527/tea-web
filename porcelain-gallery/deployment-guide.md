# 部署说明文档

## 问题总结
用户在上传图片时遇到413 "Content Too Large"错误，这是因为nginx的`client_max_body_size`设置过小导致的。

## 解决方案

### 1. 立即解决方案（用户端）
- 已创建用户上传指导文档
- 提供图片压缩工具推荐
- 用户可以手动压缩图片后上传

### 2. 技术解决方案
- 前端已实现智能压缩功能
- 后端已统一文件大小限制
- 提供了nginx配置修改指导

## 部署步骤

### 步骤1：部署前端代码
```bash
# 1. 构建前端代码
cd /home/ubuntu/workspace/tea-web/porcelain-gallery/frontend
npm run build

# 2. 将构建后的文件部署到生产环境
# 将 dist/ 目录下的文件复制到生产服务器的web目录
```

### 步骤2：修改nginx配置
```bash
# 1. 备份原配置
sudo cp /etc/nginx/sites-available/zaopic.cn /etc/nginx/sites-available/zaopic.cn.backup

# 2. 修改配置文件
sudo nano /etc/nginx/sites-available/zaopic.cn

# 3. 添加以下配置
client_max_body_size 50M;
client_body_timeout 60s;
client_header_timeout 60s;

# 4. 测试配置
sudo nginx -t

# 5. 重新加载配置
sudo systemctl reload nginx
```

### 步骤3：验证修复
```bash
# 1. 检查nginx状态
sudo systemctl status nginx

# 2. 测试上传功能
# 访问 https://www.zaopic.cn/admin
# 尝试上传一个大于1MB的文件

# 3. 检查日志
sudo tail -f /var/log/nginx/error.log
```

## 文件说明

### 已创建的文件：
1. `user-upload-guide.md` - 用户上传指导
2. `image-compression-tools.md` - 图片压缩工具推荐
3. `nginx-config-fix.md` - nginx配置修复指导
4. `deployment-guide.md` - 部署说明文档

### 修改的文件：
1. `frontend/src/views/MediaLibraryManagementView.vue` - 前端上传逻辑
2. `backend/routes/media-library-oss.js` - 后端上传接口
3. `backend/routes/media-library.js` - 后端媒体库接口
4. `backend/routes/media.js` - 后端媒体接口

## 功能特性

### 前端功能：
- 文件大小预检查（1MB限制）
- 智能压缩功能（压缩到900KB）
- 压缩进度显示
- 总文件大小检查（5MB限制）
- 分片上传功能（备选方案）

### 后端功能：
- 统一文件大小限制（50MB）
- 错误处理优化
- 支持多种上传方式

## 测试验证

### 测试用例：
1. 上传小于1MB的文件 - 应该成功
2. 上传大于1MB的文件 - 应该提示压缩
3. 压缩后上传 - 应该成功
4. 批量上传 - 应该检查总大小
5. 错误处理 - 应该显示友好提示

### 验证方法：
1. 访问管理后台
2. 进入媒体库管理页面
3. 尝试上传不同大小的文件
4. 检查错误提示和压缩功能

## 注意事项

### 部署前：
- 备份原配置文件
- 测试nginx配置语法
- 确保有足够的服务器权限

### 部署后：
- 监控nginx日志
- 测试上传功能
- 检查错误处理

### 回滚方案：
- 恢复nginx配置备份
- 重新加载nginx配置
- 检查服务状态

## 联系支持

如果部署过程中遇到问题，请联系技术支持：
- 提供具体的错误信息
- 说明部署步骤
- 提供nginx配置内容

---

**重要提醒**：此修复需要服务器管理员权限来修改nginx配置。如果无法修改nginx配置，用户可以使用提供的压缩工具手动压缩图片后上传。
