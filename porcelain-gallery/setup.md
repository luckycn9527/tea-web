# 中国瓷器网站 - 设置指南

## 项目结构
```
porcelain-gallery/
├── backend/          # Node.js 后端
├── frontend/         # Vue 3 前端
├── uploads/          # 文件上传目录
│   ├── images/      # 产品图片
│   └── videos/      # 产品视频
└── setup.md         # 本设置指南
```

## 后端设置

### 1. 数据库配置
编辑 `backend/.env` 文件：
```
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=porcelain_gallery
PORT=3000
```

### 2. 创建数据库
在 MySQL 中运行以下命令：
```sql
CREATE DATABASE IF NOT EXISTS porcelain_gallery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 导入数据库结构
```bash
cd backend
mysql -u your_username -p porcelain_gallery < database/schema.sql
mysql -u your_username -p porcelain_gallery < database/sample-data.sql
mysql -u your_username -p porcelain_gallery < database/test-images.sql
```

### 4. 创建上传目录
```bash
mkdir -p uploads/images uploads/videos
chmod 755 uploads uploads/images uploads/videos
```

### 5. 启动后端服务器
```bash
cd backend
npm run dev
```

## 前端设置

### 1. 修复Tailwind CSS配置（如果需要）
如果遇到Tailwind CSS错误，请确保已安装最新版本：
```bash
cd frontend
npm install -D @tailwindcss/postcss
```

### 2. 安装依赖
```bash
cd frontend
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 访问网站
- 前端: http://localhost:5174 (或其他可用端口)
- 后端: http://localhost:3000
- API文档: http://localhost:3000/api/products

## 图片处理说明

网站支持两种图片源：
1. **本地图片**: 上传到 `uploads/` 目录的图片，通过后端API访问
2. **网络图片**: 直接使用HTTP/HTTPS链接的图片（如占位图片服务）

系统会自动识别图片类型，无需额外配置。

## 功能特性

✅ **产品展示**
- 产品列表页面，支持分页和筛选
- 产品详情页面，支持大图轮播
- 多角度图片展示
- 视频展示（可选）

✅ **分类功能**
- 按朝代分类（唐、宋、元、明、清）
- 按器型分类（花瓶、碗、盘、茶壶等）
- 特色产品筛选

✅ **多语言支持**
- 中英双语切换
- 完整国际化支持

✅ **购物车功能**
- 添加/删除商品
- 数量调整
- 总价计算

✅ **响应式设计**
- 移动端适配
- 平板和桌面端优化

✅ **管理后台**
- 产品管理（增删改查）
- 图片和视频上传
- 分类管理

## 页面风格

参考了 https://aurumbrothers.com/ 的设计风格：
- 极简主义设计
- Inter 字体，灰黑色主调配红色点缀
- 大留白，卡片式网格布局
- 隐藏式导航菜单
- 响应式断点 768px

## API 端点

### 产品相关
- `GET /api/products` - 获取产品列表（支持筛选和分页）
- `GET /api/products/:id` - 获取单个产品详情
- `GET /api/products/filters/dynasties` - 获取朝代列表
- `GET /api/products/filters/shapes` - 获取器型列表

### 管理后台
- `POST /api/admin/products` - 创建新产品
- `PUT /api/admin/products/:id` - 更新产品
- `DELETE /api/admin/products/:id` - 删除产品
- `POST /api/admin/products/:id/images` - 上传产品图片
- `POST /api/admin/products/:id/videos` - 上传产品视频

## 技术栈

- **前端**: Vue 3 + TypeScript + Tailwind CSS + Pinia
- **后端**: Node.js + Express.js + MySQL
- **文件上传**: Multer
- **国际化**: Vue i18n
- **图标**: Heroicons

## 部署建议

1. **云服务器**: AWS EC2, 阿里云 ECS, 或腾讯云 CVM
2. **数据库**: 云数据库 RDS
3. **文件存储**: 云存储服务（如 AWS S3）
4. **CDN**: 使用 CDN 加速静态资源
5. **SSL**: 配置 HTTPS 证书

## 后续可添加功能

- 用户注册登录系统
- 订单管理和支付集成
- 产品收藏功能
- 产品评论和评分
- 高级搜索功能
- 邮件订阅
- 社交媒体分享
- 多货币支持
- 库存管理
- 物流跟踪

## 故障排除

### 数据库连接失败
如果后端显示 "Access denied for user 'root'@'localhost'" 错误：

1. 检查 MySQL 是否正在运行：
   ```bash
   sudo systemctl status mysql  # Linux
   brew services list | grep mysql  # macOS
   ```

2. 检查数据库用户名和密码：
   ```sql
   -- 在 MySQL 中运行
   SELECT User, Host FROM mysql.user;
   ```

3. 创建新用户（推荐）：
   ```sql
   CREATE USER 'porcelain_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON porcelain_gallery.* TO 'porcelain_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. 更新 `.env` 文件中的数据库配置：
   ```
   DB_USER=porcelain_user
   DB_PASSWORD=your_password
   ```

### 前端图片显示问题
如果图片无法显示：
1. 检查后端服务器是否运行
2. 检查图片URL格式
3. 验证网络图片链接是否有效
4. 查看浏览器控制台错误信息

### Tailwind CSS 样式问题
如果样式没有生效：
1. 确保已安装 `@tailwindcss/postcss`
2. 检查 `postcss.config.js` 配置
3. 重启前端开发服务器

## 注意事项

1. 确保 MySQL 数据库已正确配置
2. 上传目录需要有写入权限
3. 生产环境需要配置适当的 CORS 设置
4. 建议为文件上传配置 CDN
5. 定期备份数据库和上传的文件

## 支持

如有问题，请检查：
1. 数据库连接配置是否正确
2. 端口是否被占用（前端默认 5173，后端默认 3000）
3. 依赖包是否正确安装
4. 文件上传目录是否存在且有权限