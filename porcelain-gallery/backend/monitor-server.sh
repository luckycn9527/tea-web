#!/bin/bash

# 服务器监控脚本
SERVER_PID=$(pgrep -f "node server.js")

if [ -z "$SERVER_PID" ]; then
    echo "$(date): 服务器未运行，正在启动..."
    cd /home/ubuntu/workspace/tea-web/porcelain-gallery/backend
    nohup node server.js > server.log 2>&1 &
    echo "$(date): 服务器已启动"
else
    echo "$(date): 服务器正在运行 (PID: $SERVER_PID)"
fi

# 检查API是否响应
if curl -s "http://localhost:3000/api/test" > /dev/null; then
    echo "$(date): API响应正常"
else
    echo "$(date): API无响应"
fi
