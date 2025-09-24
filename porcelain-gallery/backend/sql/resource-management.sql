-- 资源管理表
CREATE TABLE IF NOT EXISTS resource_management (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
  oss_path VARCHAR(500) NOT NULL COMMENT 'OSS路径',
  oss_url VARCHAR(500) NOT NULL COMMENT 'OSS URL',
  cdn_url VARCHAR(500) NOT NULL COMMENT 'CDN URL',
  file_hash VARCHAR(32) NOT NULL COMMENT '文件hash',
  file_type VARCHAR(100) NOT NULL COMMENT '文件类型',
  file_size BIGINT NOT NULL COMMENT '文件大小(字节)',
  width INT NULL COMMENT '图片宽度',
  height INT NULL COMMENT '图片高度',
  format VARCHAR(20) NULL COMMENT '文件格式',
  resource_type ENUM('images', 'videos', 'documents', 'audio', 'other') DEFAULT 'images' COMMENT '资源类型',
  category VARCHAR(100) DEFAULT 'general' COMMENT '分类',
  uploader_id INT NOT NULL COMMENT '上传者ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  INDEX idx_resource_type (resource_type),
  INDEX idx_category (category),
  INDEX idx_file_hash (file_hash),
  INDEX idx_uploader (uploader_id),
  INDEX idx_created_at (created_at),
  UNIQUE KEY uk_file_hash (file_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='资源管理表';

-- 资源测试记录表
CREATE TABLE IF NOT EXISTS resource_test_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_type ENUM('availability', 'consistency', 'cache', 'broken-links', 'performance', 'comprehensive') NOT NULL COMMENT '测试类型',
  test_urls JSON NOT NULL COMMENT '测试URL列表',
  test_results JSON NOT NULL COMMENT '测试结果',
  overall_score DECIMAL(5,2) NULL COMMENT '整体评分',
  health_level ENUM('excellent', 'good', 'fair', 'poor') NULL COMMENT '健康等级',
  recommendations JSON NULL COMMENT '优化建议',
  tester_id INT NOT NULL COMMENT '测试者ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  
  INDEX idx_test_type (test_type),
  INDEX idx_tester (tester_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='资源测试记录表';

-- CDN刷新记录表
CREATE TABLE IF NOT EXISTS cdn_refresh_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  refresh_urls JSON NOT NULL COMMENT '刷新URL列表',
  refresh_type ENUM('refresh', 'preload') DEFAULT 'refresh' COMMENT '刷新类型',
  status ENUM('pending', 'success', 'failed') DEFAULT 'pending' COMMENT '状态',
  success_count INT DEFAULT 0 COMMENT '成功数量',
  failed_count INT DEFAULT 0 COMMENT '失败数量',
  error_message TEXT NULL COMMENT '错误信息',
  operator_id INT NOT NULL COMMENT '操作者ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  completed_at TIMESTAMP NULL COMMENT '完成时间',
  
  INDEX idx_status (status),
  INDEX idx_operator (operator_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='CDN刷新记录表';
