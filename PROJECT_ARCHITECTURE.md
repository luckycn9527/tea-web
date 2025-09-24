# 中国瓷器画廊项目架构文档

## 项目概述
基于Vue.js + Node.js + MySQL的中国瓷器画廊管理系统，支持前端展示、后台管理和内容配置。

## 技术栈
- **前端**: Vue 3 + TypeScript + Vite + Pinia
- **后端**: Node.js + Express + MySQL
- **存储**: 本地文件系统 + 阿里云OSS
- **认证**: JWT Token
- **部署**: PM2 + Nginx

## 项目结构

```
tea-web/
├── porcelain-gallery/           # 主项目目录
│   ├── frontend/               # 前端应用
│   │   ├── src/
│   │   │   ├── views/         # 页面组件
│   │   │   │   ├── AdminView.vue              # 主管理页面
│   │   │   │   ├── AdminLoginView.vue         # 管理员登录
│   │   │   │   ├── HomeView.vue               # 首页展示
│   │   │   │   ├── HomepageContentManagementView.vue  # 首页内容管理
│   │   │   │   └── MediaLibraryManagementView.vue    # 媒体库管理
│   │   │   ├── stores/        # Pinia状态管理
│   │   │   │   ├── admin.ts                  # 旧版admin store
│   │   │   │   ├── admin-api.ts              # 新版admin store (API版本)
│   │   │   │   └── admin-new.ts              # 另一个admin store
│   │   │   ├── services/      # API服务
│   │   │   │   └── api.ts                    # API服务类
│   │   │   ├── utils/         # 工具函数
│   │   │   │   └── oss-image-manager.ts      # OSS图片管理
│   │   │   └── config/        # 配置文件
│   │   │       └── api.ts                    # API配置
│   │   ├── .env               # 环境变量
│   │   └── package.json
│   └── backend/               # 后端应用
│       ├── routes/           # API路由
│       │   ├── admin.js              # 管理员API
│       │   ├── admin-config.js       # 配置管理API
│       │   ├── admin-auth.js         # 认证API
│       │   ├── media-library.js      # 媒体库API
│       │   └── media-library-admin.js # 媒体库管理API
│       ├── database/         # 数据库相关
│       │   └── schema.sql            # 数据库结构
│       ├── utils/            # 工具函数
│       │   └── cache-manager.js      # 缓存管理
│       ├── server.js         # 服务器入口
│       └── package.json
└── package.json              # 根package.json
```

## 数据流架构

### 1. 前端数据流
```
用户操作 → Vue组件 → Pinia Store → API Service → HTTP请求 → 后端API
```

### 2. 后端数据流
```
HTTP请求 → Express路由 → 中间件(认证) → 业务逻辑 → MySQL数据库
```

### 3. 认证流程
```
登录 → JWT Token生成 → 前端存储 → 请求头携带 → 后端验证 → 权限检查
```

## 核心功能模块

### 1. 认证系统
- **表**: `users`
- **字段**: id, username, email, password_hash, role, is_active
- **流程**: 登录 → JWT生成 → Token验证 → 权限检查

### 2. 产品管理
- **表**: `products`, `product_images`, `product_attributes`
- **功能**: CRUD操作、图片管理、属性设置
- **API**: `/api/admin/products/*`

### 3. Best Sellers管理
- **表**: `best_sellers` (关联products表)
- **功能**: 精选产品配置、排序管理
- **API**: `/api/admin/best-sellers/*`

### 4. 内容管理
- **表**: `content_sections`, `site_settings`
- **功能**: 首页内容配置、网站设置
- **API**: `/api/admin/config/*`

### 5. 媒体库
- **表**: `media_library`
- **功能**: 文件上传、OSS集成、图片管理
- **API**: `/api/media-library/*`

## 数据同步机制

### 1. 前端状态管理
- **Pinia Stores**: 
  - `admin.ts`: 旧版，使用localStorage
  - `admin-api.ts`: 新版，使用API调用
  - `admin-new.ts`: 另一个版本

### 2. 数据更新流程
```
用户修改 → 前端验证 → API调用 → 后端处理 → 数据库更新 → 前端重新加载
```

### 3. 缓存策略
- **前端**: Pinia状态 + localStorage备份
- **后端**: MySQL数据库 + 可选Redis缓存

## 配置管理

### 1. 环境变量
- **前端**: `.env`, `.env.development`
- **后端**: `process.env.*`

### 2. API配置
- **Base URL**: `VITE_API_BASE_URL`
- **OSS配置**: `VITE_OSS_BASE_URL`, `VITE_USE_OSS`

### 3. 数据库配置
- **连接**: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

## 问题分析

### 1. 数据同步问题
- **问题**: 多个admin store导致数据不一致
- **原因**: `admin.ts`使用localStorage，`admin-api.ts`使用API
- **影响**: 保存后数据不更新

### 2. API端点混乱
- **问题**: 不同组件使用不同的API端点
- **原因**: 开发过程中API设计不一致
- **影响**: 功能异常、数据不同步

### 3. 认证机制不统一
- **问题**: 不同路由使用不同的认证方式
- **原因**: 中间件实现不一致
- **影响**: 权限验证失败

## 修复策略

### 1. 统一数据管理
- 使用单一的admin store (`admin-api.ts`)
- 移除localStorage依赖
- 确保所有操作通过API

### 2. 标准化API设计
- 统一API端点命名
- 标准化请求/响应格式
- 实现一致的错误处理

### 3. 完善认证机制
- 统一JWT验证中间件
- 标准化权限检查
- 实现token刷新机制

## 部署架构

### 1. 开发环境
- **前端**: Vite dev server (端口5173)
- **后端**: Node.js server (端口3000)
- **数据库**: MySQL (端口3306)

### 2. 生产环境
- **前端**: Nginx静态文件服务
- **后端**: PM2进程管理
- **数据库**: MySQL主从复制
- **存储**: 阿里云OSS

## 监控和维护

### 1. 日志管理
- **前端**: 浏览器控制台
- **后端**: 文件日志 + PM2日志
- **数据库**: MySQL慢查询日志

### 2. 性能监控
- **前端**: Vue DevTools
- **后端**: PM2监控
- **数据库**: MySQL性能监控

### 3. 错误处理
- **前端**: 全局错误处理
- **后端**: Express错误中间件
- **数据库**: 事务回滚机制

## 安全考虑

### 1. 认证安全
- JWT token过期机制
- 密码哈希存储
- 权限最小化原则

### 2. 数据安全
- SQL注入防护
- XSS攻击防护
- CSRF保护

### 3. 文件安全
- 文件类型验证
- 文件大小限制
- 上传路径验证

---

*本文档基于项目当前状态分析，需要根据实际修复情况进行更新。*
