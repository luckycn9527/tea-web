#!/bin/bash

# Nginx 配置切换脚本
# 用于在生产环境和开发环境之间切换

case "$1" in
    "dev")
        echo "切换到开发环境..."
        cp /etc/nginx/sites-available/zaopic-dev.cn /etc/nginx/sites-enabled/zaopic.cn
        nginx -t && systemctl reload nginx
        echo "✅ 已切换到开发环境 (zaopic.cn -> Vite 5173)"
        ;;
    "prod")
        echo "切换到生产环境..."
        cp /etc/nginx/sites-available/zaopic.cn.production.backup /etc/nginx/sites-enabled/zaopic.cn
        nginx -t && systemctl reload nginx
        echo "✅ 已切换到生产环境 (zaopic.cn -> /var/www/zaopic.cn)"
        ;;
    "status")
        echo "当前配置状态:"
        echo "前端访问: http://zaopic.cn"
        echo "API访问: http://zaopic.cn/api/"
        echo ""
        echo "测试连接..."
        curl -s -I "http://zaopic.cn" | head -3
        ;;
    *)
        echo "用法: $0 {dev|prod|status}"
        echo ""
        echo "  dev    - 切换到开发环境 (Vite 5173)"
        echo "  prod   - 切换到生产环境 (/var/www/zaopic.cn)"
        echo "  status - 查看当前状态"
        exit 1
        ;;
esac

