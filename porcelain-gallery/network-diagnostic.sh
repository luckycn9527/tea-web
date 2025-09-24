#!/bin/bash

echo "=== 网络连接诊断工具 ==="
echo "时间: $(date)"
echo ""

echo "1. 检查服务器网络接口:"
ip addr show | grep -E "inet |UP"
echo ""

echo "2. 检查路由表:"
ip route show
echo ""

echo "3. 检查端口监听状态:"
ss -tlnp | grep ":80\|:443"
echo ""

echo "4. 检查nginx进程:"
ps aux | grep nginx | grep -v grep | head -3
echo ""

echo "5. 检查DNS解析:"
nslookup www.zaopic.cn
echo ""

echo "6. 检查本地连接:"
curl -I "http://localhost/" 2>/dev/null | head -2
echo ""

echo "7. 检查内网连接:"
curl -I "http://10.60.133.38/" 2>/dev/null | head -2
echo ""

echo "8. 检查外部IP连接:"
curl -I "http://106.75.68.99/" 2>/dev/null | head -2
echo ""

echo "9. 检查HTTPS连接:"
curl -k -I "https://106.75.68.99/" 2>/dev/null | head -2
echo ""

echo "10. 检查域名连接:"
curl -I "https://www.zaopic.cn/" 2>/dev/null | head -2
echo ""

echo "11. 检查防火墙状态:"
sudo ufw status
echo ""

echo "12. 检查iptables规则:"
sudo iptables -L -n | head -5
echo ""

echo "13. 检查系统负载:"
uptime
echo ""

echo "14. 检查磁盘空间:"
df -h / | tail -1
echo ""

echo "15. 检查内存使用:"
free -h | head -2
echo ""

echo "=== 诊断完成 ==="
