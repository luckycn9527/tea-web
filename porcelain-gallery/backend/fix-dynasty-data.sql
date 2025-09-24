-- 修复朝代数据以匹配前端显示
-- 前端需要 5 个朝代：Tang(1), Song(2), Yuan(3), Ming(4), Qing(5)

-- 1. 添加缺失的 Yuan Dynasty
INSERT INTO dynasties (id, name, name_cn, period, description, description_cn, image_url, sort_order, is_enabled, created_at, updated_at)
VALUES (3, 'Yuan Dynasty', '元朝', '1271-1368', 'The Yuan Dynasty was established by the Mongols and brought new artistic influences to China.', '元朝由蒙古人建立，为中国带来了新的艺术影响。', '/src/assets/tea_image/yuan.png', 3, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  name_cn = VALUES(name_cn),
  period = VALUES(period),
  description = VALUES(description),
  description_cn = VALUES(description_cn),
  image_url = VALUES(image_url),
  sort_order = VALUES(sort_order),
  is_enabled = VALUES(is_enabled),
  updated_at = NOW();

-- 2. 更新 Ming Dynasty 的 ID 从 3 改为 4
UPDATE dynasties SET id = 4, sort_order = 4 WHERE name = 'Ming Dynasty';

-- 3. 更新 Qing Dynasty 的 ID 从 4 改为 5  
UPDATE dynasties SET id = 5, sort_order = 5 WHERE name = 'Qing Dynasty';

-- 4. 确保所有朝代都有正确的图片路径
UPDATE dynasties SET image_url = '/src/assets/tea_image/tang.png' WHERE name = 'Tang Dynasty';
UPDATE dynasties SET image_url = '/src/assets/tea_image/song.png' WHERE name = 'Song Dynasty';
UPDATE dynasties SET image_url = '/src/assets/tea_image/yuan.png' WHERE name = 'Yuan Dynasty';
UPDATE dynasties SET image_url = '/src/assets/tea_image/ming.png' WHERE name = 'Ming Dynasty';
UPDATE dynasties SET image_url = '/src/assets/tea_image/qing.png' WHERE name = 'Qing Dynasty';

-- 5. 验证结果
SELECT id, name, name_cn, period, image_url, sort_order, is_enabled 
FROM dynasties 
WHERE is_enabled = 1 
ORDER BY sort_order;


