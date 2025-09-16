// Dynasty model
class Dynasty {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.name_cn = data.name_cn;
    this.period = data.period;
    this.description = data.description;
    this.description_cn = data.description_cn;
    this.image_url = data.image_url;
    this.sort_order = data.sort_order;
    this.is_enabled = data.is_enabled;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll(db, options = {}) {
    const { is_enabled = true, sort_by = 'sort_order', sort_order = 'ASC' } = options;
    
    let sql = 'SELECT * FROM dynasties WHERE 1=1';
    const params = [];

    if (is_enabled !== undefined) {
      sql += ' AND is_enabled = ?';
      params.push(is_enabled ? 1 : 0);
    }

    sql += ` ORDER BY ${sort_by} ${sort_order}`;

    console.log('Dynasty.findAll SQL:', sql);
    console.log('Dynasty.findAll params:', params);
    
    const dynasties = await db.query(sql, params);
    console.log('Dynasty.findAll result:', dynasties.length, 'rows');
    
    return dynasties.map(d => new Dynasty(d));
  }

  static async findById(db, id) {
    const sql = 'SELECT * FROM dynasties WHERE id = ?';
    const dynasty = await db.queryOne(sql, [id]);
    return dynasty ? new Dynasty(dynasty) : null;
  }

  static async create(db, dynastyData) {
    const sql = `
      INSERT INTO dynasties (name, name_cn, period, description, description_cn, image_url, sort_order, is_enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      dynastyData.name,
      dynastyData.name_cn,
      dynastyData.period,
      dynastyData.description,
      dynastyData.description_cn,
      dynastyData.image_url,
      dynastyData.sort_order || 0,
      dynastyData.is_enabled !== undefined ? dynastyData.is_enabled : 1
    ];

    const id = await db.insert(sql, params);
    return Dynasty.findById(db, id);
  }

  async update(db, updateData) {
    const sql = `
      UPDATE dynasties SET
        name = ?, name_cn = ?, period = ?, description = ?, description_cn = ?,
        image_url = ?, sort_order = ?, is_enabled = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      updateData.name || this.name,
      updateData.name_cn || this.name_cn,
      updateData.period || this.period,
      updateData.description || this.description,
      updateData.description_cn || this.description_cn,
      updateData.image_url || this.image_url,
      updateData.sort_order !== undefined ? updateData.sort_order : this.sort_order,
      updateData.is_enabled !== undefined ? updateData.is_enabled : this.is_enabled,
      this.id
    ];

    await db.update(sql, params);
    return Dynasty.findById(db, this.id);
  }

  async delete(db) {
    const sql = 'DELETE FROM dynasties WHERE id = ?';
    return await db.delete(sql, [this.id]);
  }
}

// Shape model
class Shape {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.name_cn = data.name_cn;
    this.description = data.description;
    this.description_cn = data.description_cn;
    this.sort_order = data.sort_order;
    this.is_enabled = data.is_enabled;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll(db, options = {}) {
    const { is_enabled = true, sort_by = 'sort_order', sort_order = 'ASC' } = options;
    
    let sql = 'SELECT * FROM shapes WHERE 1=1';
    const params = [];

    if (is_enabled !== undefined) {
      sql += ' AND is_enabled = ?';
      params.push(is_enabled);
    }

    sql += ` ORDER BY ${sort_by} ${sort_order}`;

    const shapes = await db.query(sql, params);
    return shapes.map(s => new Shape(s));
  }

  static async findById(db, id) {
    const sql = 'SELECT * FROM shapes WHERE id = ?';
    const shape = await db.queryOne(sql, [id]);
    return shape ? new Shape(shape) : null;
  }

  static async create(db, shapeData) {
    const sql = `
      INSERT INTO shapes (name, name_cn, description, description_cn, sort_order, is_enabled)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      shapeData.name,
      shapeData.name_cn,
      shapeData.description,
      shapeData.description_cn,
      shapeData.sort_order || 0,
      shapeData.is_enabled !== undefined ? shapeData.is_enabled : 1
    ];

    const id = await db.insert(sql, params);
    return Shape.findById(db, id);
  }

  async update(db, updateData) {
    const sql = `
      UPDATE shapes SET
        name = ?, name_cn = ?, description = ?, description_cn = ?,
        sort_order = ?, is_enabled = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      updateData.name || this.name,
      updateData.name_cn || this.name_cn,
      updateData.description || this.description,
      updateData.description_cn || this.description_cn,
      updateData.sort_order !== undefined ? updateData.sort_order : this.sort_order,
      updateData.is_enabled !== undefined ? updateData.is_enabled : this.is_enabled,
      this.id
    ];

    await db.update(sql, params);
    return Shape.findById(db, this.id);
  }

  async delete(db) {
    const sql = 'DELETE FROM shapes WHERE id = ?';
    return await db.delete(sql, [this.id]);
  }
}

// Category model
class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.name_cn = data.name_cn;
    this.description = data.description;
    this.description_cn = data.description_cn;
    this.parent_id = data.parent_id;
    this.sort_order = data.sort_order;
    this.is_enabled = data.is_enabled;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll(db, options = {}) {
    const { is_enabled = true, parent_id, sort_by = 'sort_order', sort_order = 'ASC' } = options;
    
    let sql = 'SELECT * FROM categories WHERE 1=1';
    const params = [];

    if (is_enabled !== undefined) {
      sql += ' AND is_enabled = ?';
      params.push(is_enabled);
    }

    if (parent_id !== undefined) {
      sql += ' AND parent_id = ?';
      params.push(parent_id);
    }

    sql += ` ORDER BY ${sort_by} ${sort_order}`;

    const categories = await db.query(sql, params);
    return categories.map(c => new Category(c));
  }

  static async findById(db, id) {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    const category = await db.queryOne(sql, [id]);
    return category ? new Category(category) : null;
  }

  static async create(db, categoryData) {
    const sql = `
      INSERT INTO categories (name, name_cn, description, description_cn, parent_id, sort_order, is_enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      categoryData.name,
      categoryData.name_cn,
      categoryData.description,
      categoryData.description_cn,
      categoryData.parent_id,
      categoryData.sort_order || 0,
      categoryData.is_enabled !== undefined ? categoryData.is_enabled : 1
    ];

    const id = await db.insert(sql, params);
    return Category.findById(db, id);
  }

  async update(db, updateData) {
    const sql = `
      UPDATE categories SET
        name = ?, name_cn = ?, description = ?, description_cn = ?,
        parent_id = ?, sort_order = ?, is_enabled = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      updateData.name || this.name,
      updateData.name_cn || this.name_cn,
      updateData.description || this.description,
      updateData.description_cn || this.description_cn,
      updateData.parent_id !== undefined ? updateData.parent_id : this.parent_id,
      updateData.sort_order !== undefined ? updateData.sort_order : this.sort_order,
      updateData.is_enabled !== undefined ? updateData.is_enabled : this.is_enabled,
      this.id
    ];

    await db.update(sql, params);
    return Category.findById(db, this.id);
  }

  async delete(db) {
    const sql = 'DELETE FROM categories WHERE id = ?';
    return await db.delete(sql, [this.id]);
  }
}

// Site Settings model
class SiteSettings {
  constructor(data) {
    this.id = data.id;
    this.setting_key = data.setting_key;
    this.setting_value = data.setting_value;
    this.setting_type = data.setting_type;
    this.description = data.description;
    this.is_public = data.is_public;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll(db, options = {}) {
    const { is_public } = options;
    
    let sql = 'SELECT * FROM site_settings WHERE 1=1';
    const params = [];

    if (is_public !== undefined) {
      sql += ' AND is_public = ?';
      params.push(is_public);
    }

    sql += ' ORDER BY setting_key ASC';

    const settings = await db.query(sql, params);
    return settings.map(s => new SiteSettings(s));
  }

  static async findByKey(db, key) {
    const sql = 'SELECT * FROM site_settings WHERE setting_key = ?';
    const setting = await db.queryOne(sql, [key]);
    return setting ? new SiteSettings(setting) : null;
  }

  static async create(db, settingData) {
    const sql = `
      INSERT INTO site_settings (setting_key, setting_value, setting_type, description, is_public)
      VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
      settingData.setting_key,
      settingData.setting_value,
      settingData.setting_type || 'text',
      settingData.description,
      settingData.is_public || 0
    ];

    const id = await db.insert(sql, params);
    return SiteSettings.findById(db, id);
  }

  async update(db, updateData) {
    const sql = `
      UPDATE site_settings SET
        setting_value = ?, setting_type = ?, description = ?, is_public = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      updateData.setting_value || this.setting_value,
      updateData.setting_type || this.setting_type,
      updateData.description || this.description,
      updateData.is_public !== undefined ? updateData.is_public : this.is_public,
      this.id
    ];

    await db.update(sql, params);
    return SiteSettings.findById(db, this.id);
  }

  async delete(db) {
    const sql = 'DELETE FROM site_settings WHERE id = ?';
    return await db.delete(sql, [this.id]);
  }
}

// Content Sections model
class ContentSection {
  constructor(data) {
    this.id = data.id;
    this.section_key = data.section_key;
    this.title_en = data.title_en;
    this.title_cn = data.title_cn;
    this.content_en = data.content_en;
    this.content_cn = data.content_cn;
    this.image_url = data.image_url;
    this.button_text_en = data.button_text_en;
    this.button_text_cn = data.button_text_cn;
    this.button_url = data.button_url;
    this.sort_order = data.sort_order;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll(db, options = {}) {
    const { is_active = true, sort_by = 'sort_order', sort_order = 'ASC' } = options;
    
    let sql = 'SELECT * FROM content_sections WHERE 1=1';
    const params = [];

    if (is_active !== undefined) {
      sql += ' AND is_active = ?';
      params.push(is_active);
    }

    sql += ` ORDER BY ${sort_by} ${sort_order}`;

    const sections = await db.query(sql, params);
    return sections.map(s => new ContentSection(s));
  }

  static async findByKey(db, key) {
    const sql = 'SELECT * FROM content_sections WHERE section_key = ?';
    const section = await db.queryOne(sql, [key]);
    return section ? new ContentSection(section) : null;
  }

  static async create(db, sectionData) {
    const sql = `
      INSERT INTO content_sections (
        section_key, title_en, title_cn, content_en, content_cn,
        image_url, button_text_en, button_text_cn, button_url, sort_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      sectionData.section_key,
      sectionData.title_en,
      sectionData.title_cn,
      sectionData.content_en,
      sectionData.content_cn,
      sectionData.image_url,
      sectionData.button_text_en,
      sectionData.button_text_cn,
      sectionData.button_url,
      sectionData.sort_order || 0,
      sectionData.is_active !== undefined ? sectionData.is_active : 1
    ];

    const id = await db.insert(sql, params);
    return ContentSection.findById(db, id);
  }

  async update(db, updateData) {
    const sql = `
      UPDATE content_sections SET
        title_en = ?, title_cn = ?, content_en = ?, content_cn = ?,
        image_url = ?, button_text_en = ?, button_text_cn = ?, button_url = ?,
        sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      updateData.title_en || this.title_en,
      updateData.title_cn || this.title_cn,
      updateData.content_en || this.content_en,
      updateData.content_cn || this.content_cn,
      updateData.image_url || this.image_url,
      updateData.button_text_en || this.button_text_en,
      updateData.button_text_cn || this.button_text_cn,
      updateData.button_url || this.button_url,
      updateData.sort_order !== undefined ? updateData.sort_order : this.sort_order,
      updateData.is_active !== undefined ? updateData.is_active : this.is_active,
      this.id
    ];

    await db.update(sql, params);
    return ContentSection.findById(db, this.id);
  }

  async delete(db) {
    const sql = 'DELETE FROM content_sections WHERE id = ?';
    return await db.delete(sql, [this.id]);
  }
}

module.exports = {
  Dynasty,
  Shape,
  Category,
  SiteSettings,
  ContentSection
};
