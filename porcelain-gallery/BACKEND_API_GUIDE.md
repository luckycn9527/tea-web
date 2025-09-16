# 前后端分离配置指南

## 概述

项目已成功配置为前后端分离架构，使用MySQL数据库，提供完整的RESTful API接口。

## 技术栈

### 后端
- **Node.js** + **Express.js** - 服务器框架
- **MySQL** - 数据库
- **mysql2** - MySQL连接器
- **Multer** - 文件上传处理
- **Sharp** - 图片处理
- **CORS** - 跨域资源共享

### 前端
- **Vue.js 3** - 前端框架
- **Pinia** - 状态管理
- **TypeScript** - 类型安全
- **Vite** - 构建工具

## 数据库配置

### 1. 安装MySQL

确保MySQL服务器已安装并运行。

### 2. 创建数据库

```sql
CREATE DATABASE porcelain_gallery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 配置环境变量

在 `porcelain-gallery/backend/` 目录下创建 `.env` 文件：

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=porcelain_gallery
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## 后端安装和启动

### 1. 安装依赖

```bash
cd porcelain-gallery/backend
npm install
```

### 2. 初始化数据库

```bash
npm run init-db
```

### 3. 启动后端服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

后端服务将在 `http://localhost:3000` 启动。

## 前端配置

### 1. 更新API配置

确保 `porcelain-gallery/frontend/src/config/api.ts` 中的 `VITE_API_BASE_URL` 指向后端服务：

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  // ... 其他配置
}
```

### 2. 更新环境变量

在 `porcelain-gallery/frontend/.env` 中设置：

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. 启动前端服务

```bash
cd porcelain-gallery/frontend
npm run dev
```

前端服务将在 `http://localhost:5173` 启动。

## API接口文档

### 产品相关接口

- `GET /api/products` - 获取产品列表（支持分页和筛选）
- `GET /api/products/:id` - 获取单个产品
- `GET /api/products/slug/:slug` - 通过slug获取产品
- `GET /api/products/featured/list` - 获取推荐产品
- `GET /api/products/:id/related` - 获取相关产品
- `GET /api/products/:id/images` - 获取产品图片
- `GET /api/products/:id/videos` - 获取产品视频
- `GET /api/products/:id/attributes` - 获取产品属性
- `GET /api/products/:id/tags` - 获取产品标签

### 通用数据接口

- `GET /api/dynasties` - 获取朝代列表
- `GET /api/shapes` - 获取器型列表
- `GET /api/categories` - 获取分类列表
- `GET /api/settings` - 获取网站设置
- `GET /api/content-sections` - 获取内容区块

### 媒体管理接口

- `POST /api/media/upload` - 上传单个图片
- `POST /api/media/upload-multiple` - 批量上传图片
- `GET /api/media/media` - 获取媒体库
- `PUT /api/media/:id` - 更新媒体信息
- `DELETE /api/media/:id` - 删除媒体

### 健康检查

- `GET /api/health` - 服务健康检查

## 数据库结构

### 主要表结构

1. **products** - 产品表
2. **product_images** - 产品图片表
3. **product_videos** - 产品视频表
4. **product_attributes** - 产品属性表
5. **dynasties** - 朝代表
6. **shapes** - 器型表
7. **categories** - 分类表
8. **site_settings** - 网站设置表
9. **content_sections** - 内容区块表
10. **media_library** - 媒体库表

## 前端状态管理

### 新的Store结构

1. **productsStore** - 产品数据管理
2. **commonStore** - 通用数据管理（朝代、器型、分类等）
3. **adminStore** - 管理员数据管理

### API服务

- **apiService** - 统一的API调用服务
- 支持TypeScript类型定义
- 统一的错误处理
- 响应数据格式化

## 部署说明

### 生产环境配置

1. **后端部署**
   - 设置 `NODE_ENV=production`
   - 配置生产数据库连接
   - 设置合适的CORS域名
   - 配置文件上传路径

2. **前端部署**
   - 构建生产版本：`npm run build`
   - 设置正确的API基础URL
   - 配置CDN（如需要）

### 数据库迁移

在生产环境中，建议：

1. 备份现有数据
2. 运行数据库初始化脚本
3. 导入示例数据
4. 验证数据完整性

## 开发建议

### 1. API开发

- 遵循RESTful设计原则
- 使用统一的响应格式
- 实现适当的错误处理
- 添加请求验证

### 2. 前端开发

- 使用TypeScript类型定义
- 实现组件复用
- 优化API调用性能
- 添加加载状态和错误处理

### 3. 数据库优化

- 添加适当的索引
- 使用连接池
- 实现查询优化
- 定期备份数据

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查MySQL服务状态
   - 验证连接参数
   - 确认数据库权限

2. **CORS错误**
   - 检查后端CORS配置
   - 确认前端URL设置

3. **文件上传失败**
   - 检查上传目录权限
   - 验证文件大小限制
   - 确认文件类型支持

4. **API调用失败**
   - 检查网络连接
   - 验证API端点
   - 查看服务器日志

## 下一步开发

1. **用户认证系统**
2. **购物车功能**
3. **订单管理**
4. **支付集成**
5. **管理后台**
6. **SEO优化**
7. **性能优化**

---

**注意**: 请根据实际环境调整配置参数，确保数据库连接和API调用正常工作。

