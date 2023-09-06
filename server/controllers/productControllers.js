const model = require('../Models/productModel');
const db = require('../db');

module.exports = {
  getStylesJSON: async (req, res) => {
    try {
      const client = await db.pool.connect();
      const styles = await model.getStylesJSON(req.params.product_id, client);
      await client.release();
      res.status(200).send(styles);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  getRelated: async (req, res) => {
    try {
      const related = await model.getRelated(req.params.product_id);
      res.status(200).send(related);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  getOneJSON: async (req, res) => {
    try {
      const product = await model.getOneJSON(req.params.product_id);
      res.status(200).send(product);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  getAll: async (req, res) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    try {
      const allProducts = await model.getAll(page, count);
      res.status(200).send(allProducts);
    } catch (error) {
      res.status(404).send(error);
    }
  },
};