-- 添加更多朝代
INSERT INTO dynasties (name_en, name_cn, period, description) VALUES
('Han Dynasty', '汉朝', '206 BC - 220 AD', 'Early ceramic development and proto-porcelain'),
('Three Kingdoms', '三国', '220-280 AD', 'Regional ceramic styles development'),
('Jin Dynasty', '晋朝', '265-420 AD', 'Transitional period ceramics'),
('Northern and Southern Dynasties', '南北朝', '420-589 AD', 'Buddhist influence on ceramics'),
('Sui Dynasty', '隋朝', '581-618 AD', 'Unification of ceramic styles'),
('Five Dynasties', '五代十国', '907-960 AD', 'Regional kiln development'),
('Liao Dynasty', '辽朝', '907-1125 AD', 'Nomadic influenced ceramics'),
('Western Xia', '西夏', '1038-1227 AD', 'Tangut ethnic ceramics'),
('Jin Dynasty (1115)', '金朝', '1115-1234 AD', 'Jurchen influenced porcelain');

-- 添加更多器型
INSERT INTO shapes (name_en, name_cn, description) VALUES
('Jar', '罐', 'Cylindrical container with wide mouth'),
('Censer', '炉', 'Incense burner for religious ceremonies'),
('Ewer', '执壶', 'Pouring vessel with handle and spout'),
('Dish', '碟', 'Small shallow plate'),
('Cup', '杯', 'Drinking vessel'),
('Saucer', '茶托', 'Small plate for holding tea cup'),
('Box', '盒', 'Container with lid'),
('Vessel', '器', 'General term for containers'),
('Ornament', '摆件', 'Decorative object'),
('Sculpture', '雕塑', 'Three-dimensional art piece');

-- 添加更多产品
INSERT INTO products (name_en, name_cn, description_en, description_cn, craftsmanship_en, craftsmanship_cn, history_en, history_cn, price, dimensions, weight, age, dynasty_id, shape_id, is_featured) VALUES
('Ming Dynasty Blue and White Phoenix Bowl', '明代青花凤凰碗',
 'Exquisite blue and white porcelain bowl featuring a phoenix design. The intricate painting showcases the masterful artistry of Ming dynasty porcelain makers.',
 '精美的青花瓷碗，绘有凤凰图案。精细的绘画展现了明代瓷器制作大师的艺术造诣。',
 'Hand-painted underglaze blue decoration on fine white porcelain body. Multiple firing processes create the distinctive blue and white contrast.',
 '在精细白瓷胎上手绘釉下蓝彩装饰。多次烧制工艺创造出独特的蓝白对比效果。',
 'During the Ming dynasty, blue and white porcelain reached its peak of perfection. Phoenix motifs symbolized rebirth and were popular in imperial collections.',
 '明代时期，青花瓷达到了完美的巅峰。凤凰图案象征着重生，在皇室收藏中很受欢迎。',
 1899.99, 'Diameter: 18cm, Height: 8cm', '450g', 'Ming Dynasty (1368-1644)', 4, 2, true),

('Song Dynasty Celadon Vase', '宋代青瓷花瓶',
 'Beautiful celadon glazed vase from the Song dynasty, featuring the characteristic jade-green glaze that made Song ceramics famous worldwide.',
 '宋代美丽的青瓷花瓶，具有使宋代陶瓷闻名世界的特征性玉绿色釉。',
 'High-fired stoneware with celadon glaze. The glaze contains iron oxide which creates the green color in reduction firing.',
 '高温烧制的石器，带有青瓷釉。釉料含有氧化铁，在还原烧制中产生绿色。',
 'Song dynasty ceramics are renowned for their subtle beauty and technical excellence. Celadon wares were highly prized and exported throughout Asia.',
 '宋代陶瓷以其精致的美感和技术卓越而闻名。青瓷备受推崇，出口到整个亚洲。',
 2499.99, 'Height: 28cm, Diameter: 12cm', '800g', 'Song Dynasty (960-1279)', 2, 1, true),

('Tang Dynasty Sancai Horse', '唐代三彩马',
 'Vibrant Tang dynasty sancai (three-color) glazed ceramic horse. These magnificent pieces represent the pinnacle of Tang ceramic artistry.',
 '生动的唐代三彩釉陶马。这些宏伟的作品代表了唐代陶瓷艺术的巅峰。',
 'Lead-glazed earthenware with copper, iron, and cobalt colorants. Fired at lower temperatures to preserve the vivid colors.',
 '铅釉陶器，使用铜、铁和钴着色剂。在较低温度下烧制以保持鲜艳的颜色。',
 'Tang dynasty sancai pieces were burial goods for the elite. Horses symbolized wealth and status in Tang society.',
 '唐代三彩作品是为精英准备的陪葬品。在唐代社会中，马象征着财富和地位。',
 3299.99, 'Height: 35cm, Length: 40cm', '2.1kg', 'Tang Dynasty (618-907)', 1, 9, true),

('Qing Dynasty Famille Rose Plate', '清代粉彩盘',
 'Stunning famille rose porcelain plate from the Qing dynasty, featuring elaborate floral designs in the characteristic pink palette.',
 '清代令人惊叹的粉彩瓷盘，以特征性的粉色调绘有精美的花卉图案。',
 'Overglaze enamel decoration with rose, green, yellow, and blue colors. Multiple firings required for the complex design.',
 '釉上彩装饰，使用玫瑰色、绿色、黄色和蓝色。复杂的设计需要多次烧制。',
 'Famille rose porcelain developed during the Qing dynasty represents the height of Chinese overglaze enamel technique.',
 '清代发展的粉彩瓷器代表了中国釉上彩技术的巅峰。',
 1599.99, 'Diameter: 22cm', '650g', 'Qing Dynasty (1644-1912)', 5, 3, false),

('Yuan Dynasty Underglaze Red Vase', '元代釉里红花瓶',
 'Rare Yuan dynasty vase with underglaze copper-red decoration. This technique was revolutionary and extremely difficult to master.',
 '罕见的元代花瓶，带有釉里红铜装饰。这项技术是革命性的，极难掌握。',
 'Porcelain with underglaze copper-red decoration. The red color comes from copper oxide fired in reduction atmosphere.',
 '瓷器配以釉里红铜装饰。红色来自在还原气氛中烧制的氧化铜。',
 'Underglaze red was one of the most challenging ceramic techniques. Successful pieces from the Yuan dynasty are extremely rare.',
 '釉里红是最具挑战性的陶瓷技术之一。元代的成功作品极为罕见。',
 4299.99, 'Height: 32cm, Diameter: 18cm', '1.5kg', 'Yuan Dynasty (1271-1368)', 3, 1, true);

-- 添加产品图片关联（假设产品ID从2开始）
INSERT INTO product_images (product_id, image_path, is_primary, sort_order) VALUES
(2, '/uploads/images/sample-ming-bowl-1.jpg', 1, 0),
(2, '/uploads/images/sample-ming-bowl-2.jpg', 0, 1),
(2, '/uploads/images/sample-ming-bowl-3.jpg', 0, 2),
(3, '/uploads/images/sample-song-vase-1.jpg', 1, 0),
(3, '/uploads/images/sample-song-vase-2.jpg', 0, 1),
(4, '/uploads/images/sample-tang-horse-1.jpg', 1, 0),
(4, '/uploads/images/sample-tang-horse-2.jpg', 0, 1),
(5, '/uploads/images/sample-qing-plate-1.jpg', 1, 0),
(5, '/uploads/images/sample-qing-plate-2.jpg', 0, 1),
(6, '/uploads/images/sample-yuan-vase-1.jpg', 1, 0),
(6, '/uploads/images/sample-yuan-vase-2.jpg', 0, 1);

-- 添加一些产品视频关联
INSERT INTO product_videos (product_id, video_path, sort_order) VALUES
(4, '/uploads/videos/sample-tang-horse-video.mp4', 0),
(2, '/uploads/videos/sample-ming-bowl-video.mp4', 0);