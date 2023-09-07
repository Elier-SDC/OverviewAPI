const model = require('../models/productModels');

module.exports = {
  getStylesJSON: async (req, res, next) => {
    try {
      const styles = await model.getStylesJSON(req.params.product_id);
      res.status(200).send(styles);
    } catch (error) {
      console.error('Error in getStylesJSON:', error);
      next(error); // Pass the error to a global error handler
    }
  },
  getOneJSON: async (req, res, next) => {
    try {
      const product = await model.getOneJSON(req.params.product_id);
      res.status(200).send(product);
    } catch (error) {
      console.error('Error in getOneJSON:', error);
      next(error);
    }
  },
  getAll: async (req, res, next) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    try {
      const allProducts = await model.getAll(page, count);
      res.status(200).send(allProducts);
    } catch (error) {
      console.error('Error in getAll:', error);
      next(error);
    }
  },
};
