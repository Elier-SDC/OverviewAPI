const db = require('../db');
const { logQueryExecutionTime } = require('../time');

module.exports = {
  getStylesJSON: async (productId) => {
    const queryString = `
      SELECT
        jsonb_agg(
          jsonb_build_object(
            'style_id', s.style_id,
            'name', s.name,
            'original_price', s.default_price,
            'sale_price', s.sale_price,
            'default?', s.default_style,
            'photos', (
              SELECT jsonb_agg(jsonb_build_object('thumbnail_url', p.thumbnail_url, 'url', p.url))
              FROM photos p
              WHERE p.style_id = s.style_id
            ),
            'skus', (
              SELECT jsonb_object_agg(sk.sku_id, jsonb_build_object('quantity', sk.quantity, 'size', sk.size))
              FROM skus sk
              WHERE sk.style_id = s.style_id
            )
          )
        ) AS jsonb_agg
      FROM styles s
      WHERE s.product_id = $1
    `;
    const client = await db.pool.connect();
    try {
      const start = Date.now();
      const styles = await client.query(queryString, [productId]);
     logQueryExecutionTime('Get Product styles Query time:', start);
      return { product_id: productId, results: styles.rows[0].jsonb_agg };
    } finally {
      client.release();
    }
  },

  getOneJSON: async (productId) => {
    const queryString = `
      SELECT jsonb_build_object(
        'id', p.id,
        'name', p.name,
        'slogan', p.slogan,
        'description', p.description,
        'category', p.category,
        'default_price', p.default_price,
        'features', (
          SELECT jsonb_agg(jsonb_build_object('feature', f.feature, 'value', f.value))
          FROM features f
          WHERE f.product_id = $1
        )
      ) AS jsonb_build_object
      FROM product p
      WHERE p.id = $1
    `;

    const client = await db.pool.connect();
    try {
    const start = Date.now();
      const products = await client.query(queryString, [productId]);
     logQueryExecutionTime('Get one product query time', start);
      return products.rows[0].jsonb_build_object;
    } finally {
      client.release();
    }
  },

  getAll: async (page, count) => {
    const queryString = 'SELECT * FROM product LIMIT $1 OFFSET $2';

    const client = await db.pool.connect();
    try {
      const start = Date.now();
      const styles = await client.query(queryString, [count, (page - 1) * count]);
      logQueryExecutionTime('Get 5 products query time', start);
      return styles.rows;
    } finally {
      client.release();
    }
  },
};
