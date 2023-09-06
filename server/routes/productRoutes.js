const router = require('express').Router();
const products = require('../Controllers/productController');

router.get('/:product_id/styles', products.getStylesJSON);
router.get('/:product_id/related', products.getRelated);
router.get('/:product_id', products.getOneJSON);
router.get('/', products.getAll);

module.exports = router;