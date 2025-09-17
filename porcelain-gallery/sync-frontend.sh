#!/bin/bash

# 自动同步前端构建文件到Nginx目录的脚本
# 用法: ./sync-frontend.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 配置路径
SOURCE_DIR="/home/ubuntu/workspace/tea-web/porcelain-gallery/frontend/dist"
TARGET_DIR="/var/www/zaopic.cn"

print_info "开始同步前端文件..."

# 检查源目录是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    print_error "源目录不存在: $SOURCE_DIR"
    print_info "请先运行: cd /home/ubuntu/workspace/tea-web/porcelain-gallery/frontend && npm run build-only"
    exit 1
fi

# 检查目标目录是否存在
if [ ! -d "$TARGET_DIR" ]; then
    print_info "创建目标目录: $TARGET_DIR"
    sudo mkdir -p "$TARGET_DIR"
fi

# 同步文件
print_info "同步文件从 $SOURCE_DIR 到 $TARGET_DIR"
sudo rsync -av --delete "$SOURCE_DIR/" "$TARGET_DIR/"

# 设置权限
print_info "设置文件权限..."
sudo chown -R www-data:www-data "$TARGET_DIR"
sudo chmod -R 755 "$TARGET_DIR"
sudo chmod 644 "$TARGET_DIR"/*.html 2>/dev/null || true
sudo chmod 644 "$TARGET_DIR"/*.ico 2>/dev/null || true

# 重新加载Nginx
print_info "重新加载Nginx配置..."
sudo systemctl reload nginx

print_success "前端文件同步完成!"
print_info "网站访问地址: https://zaopic.cn"
print_info "OSS图片地址: https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/"

# 显示文件统计
FILE_COUNT=$(find "$TARGET_DIR" -type f | wc -l)
print_info "同步文件数量: $FILE_COUNT"
