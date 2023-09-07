const router = require('express').Router();
const productController = require('../controllers/productControllers');


router.get('/', productController.getAll);
router.get('/:product_id', productController.getOneJSON);
router.get('/:product_id/styles', productController.getStylesJSON);

module.exports = router;
