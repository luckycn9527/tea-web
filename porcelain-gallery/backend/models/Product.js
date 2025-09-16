// Product model
class Product {
  constructor(data) {
    this.id = data.id;
    this.name_en = data.name_en;
    this.name_cn = data.name_cn;
    this.slug = data.slug;
    this.description_en = data.description_en;
    this.description_cn = data.description_cn;
    this.craftsmanship_en = data.craftsmanship_en;
    this.craftsmanship_cn = data.craftsmanship_cn;
    this.history_en = data.history_en;
    this.history_cn = data.history_cn;
    this.price = data.price;
    this.original_price = data.original_price;
    this.dimensions = data.dimensions;
    this.weight = data.weight;
    this.age = data.age;
    this.material = data.material;
    this.color = data.color;
    this.dynasty_id = data.dynasty_id;
    this.shape_id = data.shape_id;
    this.category_id = data.category_id;
    this.primary_image_id = data.primary_image_id;
    this.sku = data.sku;
    this.stock_quantity = data.stock_quantity;
    this.is_featured = data.is_featured;
    this.is_available = data.is_available;
    this.is_digital = data.is_digital;
    this.meta_title = data.meta_title;
    this.meta_description = data.meta_description;
    this.meta_keywords = data.meta_keywords;
    this.view_count = data.view_count;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // Related data
    this.dynasty = data.dynasty;
    this.shape = data.shape;
    this.category = data.category;
    this.primary_image = data.primary_image;
    this.images = data.images || [];
    this.videos = data.videos || [];
    this.attributes = data.attributes || [];
    this.tags = data.tags || [];
    
    // JOIN query results
    this.dynasty_name = data.dynasty_name;
    this.dynasty_name_cn = data.dynasty_name_cn;
    this.shape_name = data.shape_name;
    this.shape_name_cn = data.shape_name_cn;
    this.category_name = data.category_name;
    this.category_name_cn = data.category_name_cn;
    this.primary_image_url = data.primary_image_url;
    this.primary_image_alt = data.primary_image_alt;
  }

  // Get all products with pagination and filters
  
  static async findAll(db, options = {}) {
    const {
      page = 1,
      limit = 12,
      dynasty_id,
      shape_id,
      category_id,
      is_featured,
      is_available = true,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = options;

    let sql = `
      SELECT 
        p.*,
        d.name as dynasty_name,
        d.name_cn as dynasty_name_cn,
        s.name as shape_name,
        s.name_cn as shape_name_cn,
        c.name as category_name,
        c.name_cn as category_name_cn,
        pi.image_url as primary_image_url,
        pi.alt_text as primary_image_alt
      FROM products p
      LEFT JOIN dynasties d ON p.dynasty_id = d.id
      LEFT JOIN shapes s ON p.shape_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      WHERE 1=1
    `;

    const params = [];

    if (dynasty_id) {
      sql += ' AND p.dynasty_id = ?';
      params.push(dynasty_id);
    }

    if (shape_id) {
      sql += ' AND p.shape_id = ?';
      params.push(shape_id);
    }

    if (category_id) {
      sql += ' AND p.category_id = ?';
      params.push(category_id);
    }

    if (is_featured !== undefined) {
      sql += ' AND p.is_featured = ?';
      params.push(is_featured ? 1 : 0);
    }

    if (is_available !== undefined) {
      sql += ' AND p.is_available = ?';
      params.push(is_available ? 1 : 0);
    }

    if (search) {
      sql += ' AND (p.name_en LIKE ? OR p.name_cn LIKE ? OR p.description_en LIKE ? OR p.description_cn LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Add sorting
    sql += ` ORDER BY p.${sort_by} ${sort_order}`;

    // Add pagination (use string concatenation for LIMIT/OFFSET)
    const offset = (page - 1) * limit;
    sql += ` LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const products = await db.query(sql, params);

    // Get additional data for each product
    for (let product of products) {
      product.images = await ProductImage.findByProductId(db, product.id);
      product.attributes = await ProductAttribute.findByProductId(db, product.id);
      product.tags = await ProductTag.findByProductId(db, product.id);
    }

    return products.map(p => new Product(p));
  }

  // Get product by ID
  static async findById(db, id) {
    const sql = `
      SELECT 
        p.*,
        d.name as dynasty_name,
        d.name_cn as dynasty_name_cn,
        s.name as shape_name,
        s.name_cn as shape_name_cn,
        c.name as category_name,
        c.name_cn as category_name_cn,
        pi.image_url as primary_image_url,
        pi.alt_text as primary_image_alt
      FROM products p
      LEFT JOIN dynasties d ON p.dynasty_id = d.id
      LEFT JOIN shapes s ON p.shape_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      WHERE p.id = ?
    `;

    const product = await db.queryOne(sql, [id]);
    if (!product) return null;

    // Get additional data
    product.images = await ProductImage.findByProductId(db, id);
    product.videos = await ProductVideo.findByProductId(db, id);
    product.attributes = await ProductAttribute.findByProductId(db, id);
    product.tags = await ProductTag.findByProductId(db, id);

    return new Product(product);
  }

  // Get product by slug
  static async findBySlug(db, slug) {
    const sql = `
      SELECT 
        p.*,
        d.name as dynasty_name,
        d.name_cn as dynasty_name_cn,
        s.name as shape_name,
        s.name_cn as shape_name_cn,
        c.name as category_name,
        c.name_cn as category_name_cn,
        pi.image_url as primary_image_url,
        pi.alt_text as primary_image_alt
      FROM products p
      LEFT JOIN dynasties d ON p.dynasty_id = d.id
      LEFT JOIN shapes s ON p.shape_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      WHERE p.slug = ?
    `;

    const product = await db.queryOne(sql, [slug]);
    if (!product) return null;

    // Get additional data
    product.images = await ProductImage.findByProductId(db, product.id);
    product.videos = await ProductVideo.findByProductId(db, product.id);
    product.attributes = await ProductAttribute.findByProductId(db, product.id);
    product.tags = await ProductTag.findByProductId(db, product.id);

    return new Product(product);
  }

  // Create new product
  static async create(db, productData) {
    const sql = `
      INSERT INTO products (
        name_en, name_cn, slug, description_en, description_cn,
        craftsmanship_en, craftsmanship_cn, history_en, history_cn,
        price, original_price, dimensions, weight, age, material, color,
        dynasty_id, shape_id, category_id, primary_image_id, sku,
        stock_quantity, is_featured, is_available, is_digital,
        meta_title, meta_description, meta_keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      productData.name_en,
      productData.name_cn,
      productData.slug,
      productData.description_en,
      productData.description_cn,
      productData.craftsmanship_en,
      productData.craftsmanship_cn,
      productData.history_en,
      productData.history_cn,
      productData.price || 0,
      productData.original_price,
      productData.dimensions,
      productData.weight,
      productData.age,
      productData.material,
      productData.color,
      productData.dynasty_id,
      productData.shape_id,
      productData.category_id,
      productData.primary_image_id,
      productData.sku,
      productData.stock_quantity || 0,
      productData.is_featured || 0,
      productData.is_available !== undefined ? productData.is_available : 1,
      productData.is_digital || 0,
      productData.meta_title,
      productData.meta_description,
      productData.meta_keywords
    ];

    const id = await db.insert(sql, params);
    return Product.findById(db, id);
  }

  // Update product
  async update(db, updateData) {
    const sql = `
      UPDATE products SET
        name_en = ?, name_cn = ?, slug = ?, description_en = ?, description_cn = ?,
        craftsmanship_en = ?, craftsmanship_cn = ?, history_en = ?, history_cn = ?,
        price = ?, original_price = ?, dimensions = ?, weight = ?, age = ?,
        material = ?, color = ?, dynasty_id = ?, shape_id = ?, category_id = ?,
        primary_image_id = ?, sku = ?, stock_quantity = ?, is_featured = ?,
        is_available = ?, is_digital = ?, meta_title = ?, meta_description = ?,
        meta_keywords = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      updateData.name_en || this.name_en,
      updateData.name_cn || this.name_cn,
      updateData.slug || this.slug,
      updateData.description_en || this.description_en,
      updateData.description_cn || this.description_cn,
      updateData.craftsmanship_en || this.craftsmanship_en,
      updateData.craftsmanship_cn || this.craftsmanship_cn,
      updateData.history_en || this.history_en,
      updateData.history_cn || this.history_cn,
      updateData.price !== undefined ? updateData.price : this.price,
      updateData.original_price || this.original_price,
      updateData.dimensions || this.dimensions,
      updateData.weight || this.weight,
      updateData.age || this.age,
      updateData.material || this.material,
      updateData.color || this.color,
      updateData.dynasty_id || this.dynasty_id,
      updateData.shape_id || this.shape_id,
      updateData.category_id || this.category_id,
      updateData.primary_image_id || this.primary_image_id,
      updateData.sku || this.sku,
      updateData.stock_quantity !== undefined ? updateData.stock_quantity : this.stock_quantity,
      updateData.is_featured !== undefined ? updateData.is_featured : this.is_featured,
      updateData.is_available !== undefined ? updateData.is_available : this.is_available,
      updateData.is_digital !== undefined ? updateData.is_digital : this.is_digital,
      updateData.meta_title || this.meta_title,
      updateData.meta_description || this.meta_description,
      updateData.meta_keywords || this.meta_keywords,
      this.id
    ];

    await db.update(sql, params);
    return Product.findById(db, this.id);
  }

  // Delete product
  async delete(db) {
    const sql = 'DELETE FROM products WHERE id = ?';
    return await db.delete(sql, [this.id]);
  }

  // Increment view count
  async incrementViewCount(db) {
    const sql = 'UPDATE products SET view_count = view_count + 1 WHERE id = ?';
    await db.update(sql, [this.id]);
    this.view_count++;
  }

  // Get featured products
  static async findFeatured(db, limit = 6) {
    const limitValue = parseInt(limit) || 6;
    const sql = `
      SELECT 
        p.*,
        d.name as dynasty_name,
        d.name_cn as dynasty_name_cn,
        s.name as shape_name,
        s.name_cn as shape_name_cn,
        pi.image_url as primary_image_url,
        pi.alt_text as primary_image_alt
      FROM products p
      LEFT JOIN dynasties d ON p.dynasty_id = d.id
      LEFT JOIN shapes s ON p.shape_id = s.id
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      WHERE p.is_featured = 1 AND p.is_available = 1
      ORDER BY p.created_at DESC
      LIMIT ${limitValue}
    `;

    console.log('findFeatured - limit:', limit, 'limitValue:', limitValue);
    const products = await db.query(sql, []);
    
    // Load additional images for each product
    const productsWithImages = await Promise.all(
      products.map(async (productData) => {
        const product = new Product(productData);
        
        // Load all images for this product
        const images = await ProductImage.findByProductId(db, product.id);
        
        // Create thumbnails array from images
        product.thumbnails = images.map(img => img.image_url);
        
        // Also set images array for compatibility
        product.images = images;
        
        return product;
      })
    );
    
    return productsWithImages;
  }

  // Get related products
  async getRelated(db, limit = 4) {
    const sql = `
      SELECT 
        p.*,
        d.name as dynasty_name,
        d.name_cn as dynasty_name_cn,
        s.name as shape_name,
        s.name_cn as shape_name_cn,
        pi.image_url as primary_image_url,
        pi.alt_text as primary_image_alt
      FROM products p
      LEFT JOIN dynasties d ON p.dynasty_id = d.id
      LEFT JOIN shapes s ON p.shape_id = s.id
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      WHERE p.id != ? AND p.is_available = 1
      AND (p.dynasty_id = ? OR p.shape_id = ? OR p.category_id = ?)
      ORDER BY p.view_count DESC, p.created_at DESC
      LIMIT ${parseInt(limit)}
    `;

    const products = await db.query(sql, [
      this.id,
      this.dynasty_id,
      this.shape_id,
      this.category_id
    ]);

    return products.map(p => new Product(p));
  }
}

// Product Image model
class ProductImage {
  constructor(data) {
    this.id = data.id;
    this.product_id = data.product_id;
    this.image_url = data.image_url;
    this.alt_text = data.alt_text;
    this.caption = data.caption;
    this.is_primary = data.is_primary;
    this.sort_order = data.sort_order;
    this.file_size = data.file_size;
    this.mime_type = data.mime_type;
    this.width = data.width;
    this.height = data.height;
    this.created_at = data.created_at;
  }

  static async findByProductId(db, productId) {
    const sql = `
      SELECT * FROM product_images 
      WHERE product_id = ? 
      ORDER BY is_primary DESC, sort_order ASC
    `;
    return await db.query(sql, [productId]);
  }

  static async create(db, imageData) {
    const sql = `
      INSERT INTO product_images (
        product_id, image_url, alt_text, caption, is_primary, sort_order,
        file_size, mime_type, width, height
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      imageData.product_id,
      imageData.image_url,
      imageData.alt_text,
      imageData.caption,
      imageData.is_primary || 0,
      imageData.sort_order || 0,
      imageData.file_size,
      imageData.mime_type,
      imageData.width,
      imageData.height
    ];

    return await db.insert(sql, params);
  }

  static async delete(db, id) {
    const sql = 'DELETE FROM product_images WHERE id = ?';
    return await db.delete(sql, [id]);
  }
}

// Product Video model
class ProductVideo {
  constructor(data) {
    this.id = data.id;
    this.product_id = data.product_id;
    this.video_url = data.video_url;
    this.thumbnail_url = data.thumbnail_url;
    this.title = data.title;
    this.description = data.description;
    this.duration = data.duration;
    this.sort_order = data.sort_order;
    this.file_size = data.file_size;
    this.mime_type = data.mime_type;
    this.created_at = data.created_at;
  }

  static async findByProductId(db, productId) {
    const sql = `
      SELECT * FROM product_videos 
      WHERE product_id = ? 
      ORDER BY sort_order ASC
    `;
    return await db.query(sql, [productId]);
  }
}

// Product Attribute model
class ProductAttribute {
  constructor(data) {
    this.id = data.id;
    this.product_id = data.product_id;
    this.attribute_name = data.attribute_name;
    this.attribute_value = data.attribute_value;
    this.attribute_type = data.attribute_type;
    this.sort_order = data.sort_order;
    this.created_at = data.created_at;
  }

  static async findByProductId(db, productId) {
    const sql = `
      SELECT * FROM product_attributes 
      WHERE product_id = ? 
      ORDER BY sort_order ASC
    `;
    return await db.query(sql, [productId]);
  }
}

// Product Tag model
class ProductTag {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.name_cn = data.name_cn;
    this.slug = data.slug;
    this.description = data.description;
    this.color = data.color;
    this.created_at = data.created_at;
  }

  static async findByProductId(db, productId) {
    const sql = `
      SELECT t.* FROM tags t
      INNER JOIN product_tags pt ON t.id = pt.tag_id
      WHERE pt.product_id = ?
      ORDER BY t.name ASC
    `;
    return await db.query(sql, [productId]);
  }
}

module.exports = {
  Product,
  ProductImage,
  ProductVideo,
  ProductAttribute,
  ProductTag
};

