const db = require('../db');

module.exports = {
  getStylesJSON: async (productId, client) => {
    const queryString = `SELECT jsonb_agg(jsonb_build_object('style_id', style_id, 'name', name, 'original_price', default_price, 'sale_price', sale_price, 'default?', default_style, 'photos', (SELECT jsonb_agg(jsonb_build_object('thumbnail_url', thumbnail_url, 'url', url)) FROM photos WHERE photos.style_id=styles.style_id), 'skus', (SELECT jsonb_object_agg(sku_id, jsonb_build_object('quantity', quantity, 'size', size)) FROM skus WHERE skus.style_id=styles.style_id))) FROM styles WHERE product_id=${productId}`;
    try {
      const styles = await client.query(queryString);
      return { product_id: productId, results: styles.rows[0].jsonb_agg };
    } catch (err) {
      return err;
    }
  },
  // getStyles: async (productId, client) => {
  //   const queryString = `SELECT * FROM styles WHERE product_id=${productId}`;
  //   const styles = await client.query(queryString);
  //   return styles.rows;
  // },
  // getPhotos: async (styleId, client) => {
  //   const queryString = `SELECT thumbnail_url, url FROM photos WHERE photos.style_id=${styleId}`;
  //   const photos = await client.query(queryString);
  //   return photos.rows;
  // },
  // getSkus: async (styleId, client) => {
  //   const queryString = `SELECT sku_id, quantity, size FROM skus WHERE style_id=${styleId}`;
  //   const skus = await client.query(queryString);
  //   return skus.rows;
  // },
  getRelated: async (productId) => {
    const queryString = `SELECT jsonb_agg((related_product_id)) FROM related WHERE current_product_id=${productId}`;
    try {
      const client = await db.pool.connect();
      const related = await client.query(queryString);
      client.release();
      return related.rows[0].jsonb_agg;
    } catch (err) {
      return err;
    }
  },
  getOneJSON: async (productId) => {
    const queryString = `SELECT jsonb_build_object('id', id, 'name', name, 'slogan', slogan, 'description', description, 'category', category, 'default_price', default_price, 'features', (SELECT jsonb_agg(jsonb_build_object('feature', feature, 'value', value)) FROM features WHERE product_id=${productId})) FROM product WHERE id=${productId}`;
    try {
      const client = await db.pool.connect();
      const product = await client.query(queryString);
      client.release();
      return product.rows[0].jsonb_build_object;
    } catch (err) {
      return err;
    }
  },
  // getOne: async (productId) => {
  //   const client = await db.pool.connect();
  //   const queryString = `SELECT * FROM product WHERE id=${productId}`;
  //   const product = await client.query(queryString);
  //   client.release();
  //   return product.rows[0];
  // },
  // getFeatures: async (productId) => {
  //   const client = await db.pool.connect();
  //   const queryString = `SELECT feature, value FROM features WHERE product_id=${productId}`;
  //   const features = await client.query(queryString);
  //   client.release();
  //   return features.rows;
  // },
  getAll: async (page, count) => {
    const queryString = `SELECT * FROM product LIMIT ${count} OFFSET ${(page - 1) * count}`;
    try {
      const client = await db.pool.connect();
      const styles = await client.query(queryString);
      client.release();
      return styles.rows;
    } catch (err) {
      return err;
    }
  },
};