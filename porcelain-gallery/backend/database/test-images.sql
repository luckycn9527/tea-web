-- 创建测试用的图片数据（使用占位图片）
-- 这些产品将使用占位图片服务，无需实际图片文件

-- 清除现有的图片数据
DELETE FROM product_images;

-- 为所有产品添加占位图片
INSERT INTO product_images (product_id, image_path, is_primary, sort_order) VALUES
-- 产品1（已存在的青花龙纹花瓶）
(1, 'https://via.placeholder.com/800x800/e3f2fd/1976d2?text=Ming+Dragon+Vase', 1, 0),
(1, 'https://via.placeholder.com/800x800/90caf9/0d47a1?text=Detail+View', 0, 1),
(1, 'https://via.placeholder.com/800x800/64b5f6/1565c0?text=Side+View', 0, 2),

-- 产品2（明代青花凤凰碗）
(2, 'https://via.placeholder.com/800x800/fff3e0/ef6c00?text=Ming+Phoenix+Bowl', 1, 0),
(2, 'https://via.placeholder.com/800x800/ffe0b2/e65100?text=Top+View', 0, 1),
(2, 'https://via.placeholder.com/800x800/ffcc02/bd081b?text=Bottom+Mark', 0, 2),

-- 产品3（宋代青瓷花瓶）
(3, 'https://via.placeholder.com/800x800/e8f5e9/2e7d32?text=Song+Celadon+Vase', 1, 0),
(3, 'https://via.placeholder.com/800x800/c8e6c9/1b5e20?text=Glaze+Detail', 0, 1),
(3, 'https://via.placeholder.com/800x800/a5d6a7/388e3c?text=Shape+View', 0, 2),

-- 产品4（唐代三彩马）
(4, 'https://via.placeholder.com/800x800/fff8e1/ffa000?text=Tang+Sancai+Horse', 1, 0),
(4, 'https://via.placeholder.com/800x800/ffecb3/ff8f00?text=Color+Detail', 0, 1),
(4, 'https://via.placeholder.com/800x800/ffe082/ff6d00?text=Side+View', 0, 2),

-- 产品5（清代粉彩盘）
(5, 'https://via.placeholder.com/800x800/fce4ec/c2185b?text=Qing+Famille+Rose', 1, 0),
(5, 'https://via.placeholder.com/800x800/f8bbd9/ad1457?text=Floral+Detail', 0, 1),
(5, 'https://via.placeholder.com/800x800/f48fb1/d81b60?text=Rim+View', 0, 2),

-- 产品6（元代釉里红花瓶）
(6, 'https://via.placeholder.com/800x800/fbe9e7/d84315?text=Yuan+Underglaze+Red', 1, 0),
(6, 'https://via.placeholder.com/800x800/ffcdd2/c62828?text=Red+Detail', 0, 1),
(6, 'https://via.placeholder.com/800x800/ffab91/b71c1c?text=Form+View', 0, 2);

-- 更新产品主图片
UPDATE products SET 
  primary_image = CASE id
    WHEN 1 THEN 'https://via.placeholder.com/800x800/e3f2fd/1976d2?text=Ming+Dragon+Vase'
    WHEN 2 THEN 'https://via.placeholder.com/800x800/fff3e0/ef6c00?text=Ming+Phoenix+Bowl'
    WHEN 3 THEN 'https://via.placeholder.com/800x800/e8f5e9/2e7d32?text=Song+Celadon+Vase'
    WHEN 4 THEN 'https://via.placeholder.com/800x800/fff8e1/ffa000?text=Tang+Sancai+Horse'
    WHEN 5 THEN 'https://via.placeholder.com/800x800/fce4ec/c2185b?text=Qing+Famille+Rose'
    WHEN 6 THEN 'https://via.placeholder.com/800x800/fbe9e7/d84315?text=Yuan+Underglaze+Red'
  END
WHERE id IN (1,2,3,4,5,6);