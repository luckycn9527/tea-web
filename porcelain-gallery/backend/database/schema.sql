-- Create database
CREATE DATABASE IF NOT EXISTS porcelain_gallery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE porcelain_gallery;

-- Dynasties table
CREATE TABLE IF NOT EXISTS dynasties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_en VARCHAR(100) NOT NULL,
    name_cn VARCHAR(100) NOT NULL,
    period VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Shapes table (器型)
CREATE TABLE IF NOT EXISTS shapes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_en VARCHAR(100) NOT NULL,
    name_cn VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_en VARCHAR(255) NOT NULL,
    name_cn VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_cn TEXT,
    craftsmanship_en TEXT,
    craftsmanship_cn TEXT,
    history_en TEXT,
    history_cn TEXT,
    price DECIMAL(10,2) NOT NULL,
    dimensions VARCHAR(100),
    weight VARCHAR(50),
    age VARCHAR(100),
    dynasty_id INT,
    shape_id INT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dynasty_id) REFERENCES dynasties(id) ON DELETE SET NULL,
    FOREIGN KEY (shape_id) REFERENCES shapes(id) ON DELETE SET NULL
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product videos table (optional)
CREATE TABLE IF NOT EXISTS product_videos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    video_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Categories table (for future use)
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_en VARCHAR(100) NOT NULL,
    name_cn VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product categories junction table
CREATE TABLE IF NOT EXISTS product_categories (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert sample dynasties
INSERT INTO dynasties (name_en, name_cn, period, description) VALUES
('Tang Dynasty', '唐朝', '618-907 AD', 'Known for colorful glazed pottery and early porcelain'),
('Song Dynasty', '宋朝', '960-1279 AD', 'Golden age of Chinese ceramics with refined aesthetics'),
('Yuan Dynasty', '元朝', '1271-1368 AD', 'Transitional period with underglaze blue developments'),
('Ming Dynasty', '明朝', '1368-1644 AD', 'Famous for blue and white porcelain and imperial wares'),
('Qing Dynasty', '清朝', '1644-1912 AD', 'Peak of porcelain production with diverse styles');

-- Insert sample shapes
INSERT INTO shapes (name_en, name_cn, description) VALUES
('Vase', '花瓶', 'Traditional vessel for holding flowers'),
('Bowl', '碗', 'Round container for food or decoration'),
('Plate', '盘', 'Flat dish for serving or display'),
('Teapot', '茶壶', 'Vessel for brewing and serving tea'),
('Brush Pot', '笔筒', 'Container for holding calligraphy brushes'),
('Incense Burner', '香炉', 'Vessel for burning incense');

-- Insert sample product
INSERT INTO products (name_en, name_cn, description_en, description_cn, price, dimensions, weight, age, dynasty_id, shape_id) VALUES
('Blue and White Dragon Vase', '青花龙纹花瓶', 
 'Magnificent blue and white porcelain vase featuring a powerful dragon design. This piece showcases the exceptional craftsmanship of traditional Chinese porcelain making.',
 '精美的青花龙纹花瓶，展现了传统中国瓷器制作工艺的卓越技艺。',
 2999.99, 'Height: 25cm, Diameter: 15cm', '1.2kg', 'Ming Dynasty (1368-1644)', 4, 1);