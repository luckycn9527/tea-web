#!/bin/bash

# 一键启动前后端脚本
# 自动检测并安装Node.js、npm等依赖
# 启动前端和后端服务

set -e  # 遇到错误立即退出

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

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查是否为root用户
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_warning "检测到root用户，建议使用普通用户运行此脚本"
        read -p "是否继续？(y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# 检测操作系统
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command_exists apt-get; then
            OS="ubuntu"
            PKG_MANAGER="apt"
        elif command_exists yum; then
            OS="centos"
            PKG_MANAGER="yum"
        elif command_exists dnf; then
            OS="fedora"
            PKG_MANAGER="dnf"
        elif command_exists pacman; then
            OS="arch"
            PKG_MANAGER="pacman"
        else
            OS="unknown"
            PKG_MANAGER="unknown"
        fi
    else
        OS="unknown"
        PKG_MANAGER="unknown"
    fi
    
    print_info "检测到操作系统: $OS"
}

# 安装Node.js和npm
install_nodejs() {
    print_info "开始安装Node.js和npm..."
    
    if [[ $PKG_MANAGER == "apt" ]]; then
        # Ubuntu/Debian
        sudo apt update
        sudo apt install -y curl
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt install -y nodejs
    elif [[ $PKG_MANAGER == "yum" ]]; then
        # CentOS/RHEL
        sudo yum update -y
        sudo yum install -y curl
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs
    elif [[ $PKG_MANAGER == "dnf" ]]; then
        # Fedora
        sudo dnf update -y
        sudo dnf install -y curl
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo dnf install -y nodejs
    elif [[ $PKG_MANAGER == "pacman" ]]; then
        # Arch Linux
        sudo pacman -Syu --noconfirm
        sudo pacman -S --noconfirm nodejs npm
    else
        print_error "不支持的操作系统，请手动安装Node.js"
        exit 1
    fi
    
    print_success "Node.js和npm安装完成"
}

# 检查并安装依赖
check_dependencies() {
    print_info "检查系统依赖..."
    
    # 检查Node.js
    if ! command_exists node; then
        print_warning "未检测到Node.js，开始安装..."
        install_nodejs
    else
        NODE_VERSION=$(node --version)
        print_success "Node.js已安装: $NODE_VERSION"
    fi
    
    # 检查npm
    if ! command_exists npm; then
        print_warning "未检测到npm，开始安装..."
        install_nodejs
    else
        NPM_VERSION=$(npm --version)
        print_success "npm已安装: $NPM_VERSION"
    fi
    
    # 检查curl
    if ! command_exists curl; then
        print_warning "未检测到curl，开始安装..."
        if [[ $PKG_MANAGER == "apt" ]]; then
            sudo apt update && sudo apt install -y curl
        elif [[ $PKG_MANAGER == "yum" ]]; then
            sudo yum install -y curl
        elif [[ $PKG_MANAGER == "dnf" ]]; then
            sudo dnf install -y curl
        elif [[ $PKG_MANAGER == "pacman" ]]; then
            sudo pacman -S --noconfirm curl
        fi
    fi
    
    # 检查git
    if ! command_exists git; then
        print_warning "未检测到git，开始安装..."
        if [[ $PKG_MANAGER == "apt" ]]; then
            sudo apt install -y git
        elif [[ $PKG_MANAGER == "yum" ]]; then
            sudo yum install -y git
        elif [[ $PKG_MANAGER == "dnf" ]]; then
            sudo dnf install -y git
        elif [[ $PKG_MANAGER == "pacman" ]]; then
            sudo pacman -S --noconfirm git
        fi
    fi
}

# 安装前端依赖
install_frontend_deps() {
    print_info "安装前端依赖..."
    
    cd frontend
    
    # 检查package.json是否存在
    if [[ ! -f "package.json" ]]; then
        print_error "frontend目录下未找到package.json文件"
        exit 1
    fi
    
    # 检查node_modules是否存在
    if [[ ! -d "node_modules" ]]; then
        print_info "首次运行，安装前端依赖包..."
        npm install
    else
        print_info "检查前端依赖更新..."
        npm install
    fi
    
    print_success "前端依赖安装完成"
    cd ..
}

# 安装后端依赖
install_backend_deps() {
    print_info "安装后端依赖..."
    
    cd backend
    
    # 检查package.json是否存在
    if [[ ! -f "package.json" ]]; then
        print_error "backend目录下未找到package.json文件"
        exit 1
    fi
    
    # 检查node_modules是否存在
    if [[ ! -d "node_modules" ]]; then
        print_info "首次运行，安装后端依赖包..."
        npm install
    else
        print_info "检查后端依赖更新..."
        npm install
    fi
    
    print_success "后端依赖安装完成"
    cd ..
}

# 检查端口是否被占用
check_port() {
    local port=$1
    if command_exists netstat; then
        if netstat -tuln | grep -q ":$port "; then
            return 0  # 端口被占用
        fi
    elif command_exists ss; then
        if ss -tuln | grep -q ":$port "; then
            return 0  # 端口被占用
        fi
    elif command_exists lsof; then
        if lsof -i ":$port" >/dev/null 2>&1; then
            return 0  # 端口被占用
        fi
    fi
    return 1  # 端口未被占用
}

# 启动后端服务
start_backend() {
    print_info "启动后端服务..."
    
    cd backend
    
    # 检查端口3000是否被占用
    if check_port 3000; then
        print_warning "端口3000已被占用，尝试终止现有进程..."
        pkill -f "node.*server.js" || true
        pkill -f "npm.*start" || true
        sleep 2
    fi
    
    # 启动后端服务
    print_info "在后台启动后端服务 (端口3000)..."
    nohup npm start > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../logs/backend.pid
    
    # 等待后端服务启动
    print_info "等待后端服务启动..."
    for i in {1..30}; do
        if check_port 3000; then
            print_success "后端服务启动成功 (PID: $BACKEND_PID)"
            break
        fi
        sleep 1
        if [[ $i -eq 30 ]]; then
            print_error "后端服务启动超时"
            exit 1
        fi
    done
    
    cd ..
}

# 启动前端服务
start_frontend() {
    print_info "启动前端服务..."
    
    cd frontend
    
    # 检查端口5173是否被占用
    if check_port 5173; then
        print_warning "端口5173已被占用，尝试终止现有进程..."
        pkill -f "vite" || true
        pkill -f "npm.*dev" || true
        sleep 2
    fi
    
    # 启动前端服务
    print_info "在后台启动前端服务 (端口5173)..."
    nohup npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../logs/frontend.pid
    
    # 等待前端服务启动
    print_info "等待前端服务启动..."
    for i in {1..30}; do
        if check_port 5173; then
            print_success "前端服务启动成功 (PID: $FRONTEND_PID)"
            break
        fi
        sleep 1
        if [[ $i -eq 30 ]]; then
            print_error "前端服务启动超时"
            exit 1
        fi
    done
    
    cd ..
}

# 创建日志目录
create_log_dir() {
    if [[ ! -d "logs" ]]; then
        mkdir -p logs
        print_info "创建日志目录: logs/"
    fi
}

# 显示服务状态
show_status() {
    print_info "服务状态:"
    echo "----------------------------------------"
    
    # 检查后端服务
    if [[ -f "logs/backend.pid" ]]; then
        BACKEND_PID=$(cat logs/backend.pid)
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            print_success "后端服务运行中 (PID: $BACKEND_PID, 端口: 3000)"
        else
            print_error "后端服务未运行"
        fi
    else
        print_error "后端服务未运行"
    fi
    
    # 检查前端服务
    if [[ -f "logs/frontend.pid" ]]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            print_success "前端服务运行中 (PID: $FRONTEND_PID, 端口: 5173)"
        else
            print_error "前端服务未运行"
        fi
    else
        print_error "前端服务未运行"
    fi
    
    echo "----------------------------------------"
    print_info "访问地址:"
    echo "  前端: http://localhost:5173"
    echo "  后端: http://localhost:3000"
    echo ""
    print_info "日志文件:"
    echo "  前端日志: logs/frontend.log"
    echo "  后端日志: logs/backend.log"
}

# 停止服务
stop_services() {
    print_info "停止所有服务..."
    
    # 停止后端服务
    if [[ -f "logs/backend.pid" ]]; then
        BACKEND_PID=$(cat logs/backend.pid)
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            kill $BACKEND_PID
            print_success "后端服务已停止"
        fi
        rm -f logs/backend.pid
    fi
    
    # 停止前端服务
    if [[ -f "logs/frontend.pid" ]]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            kill $FRONTEND_PID
            print_success "前端服务已停止"
        fi
        rm -f logs/frontend.pid
    fi
    
    # 清理进程
    pkill -f "node.*server.js" || true
    pkill -f "npm.*start" || true
    pkill -f "vite" || true
    pkill -f "npm.*dev" || true
    
    print_success "所有服务已停止"
}

# 显示帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  start     启动前后端服务 (默认)"
    echo "  stop      停止所有服务"
    echo "  restart   重启所有服务"
    echo "  status    显示服务状态"
    echo "  logs      查看日志"
    echo "  help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0                # 启动服务"
    echo "  $0 start          # 启动服务"
    echo "  $0 stop           # 停止服务"
    echo "  $0 restart        # 重启服务"
    echo "  $0 status         # 查看状态"
    echo "  $0 logs           # 查看日志"
}

# 查看日志
view_logs() {
    print_info "查看服务日志..."
    echo "----------------------------------------"
    echo "前端日志 (最后20行):"
    echo "----------------------------------------"
    if [[ -f "logs/frontend.log" ]]; then
        tail -n 20 logs/frontend.log
    else
        echo "前端日志文件不存在"
    fi
    
    echo ""
    echo "----------------------------------------"
    echo "后端日志 (最后20行):"
    echo "----------------------------------------"
    if [[ -f "logs/backend.log" ]]; then
        tail -n 20 logs/backend.log
    else
        echo "后端日志文件不存在"
    fi
}

# 主函数
main() {
    local action=${1:-start}
    
    print_info "=== Porcelain Gallery 一键启动脚本 ==="
    print_info "操作: $action"
    
    case $action in
        start)
            check_root
            detect_os
            check_dependencies
            create_log_dir
            install_backend_deps
            install_frontend_deps
            start_backend
            start_frontend
            show_status
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            sleep 2
            main start
            ;;
        status)
            show_status
            ;;
        logs)
            view_logs
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "未知选项: $action"
            show_help
            exit 1
            ;;
    esac
    
    print_success "操作完成!"
}

# 捕获中断信号
trap 'print_warning "收到中断信号，正在停止服务..."; stop_services; exit 0' INT TERM

# 运行主函数
main "$@"
