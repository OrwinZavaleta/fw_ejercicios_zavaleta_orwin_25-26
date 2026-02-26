const router = require("express").Router();

const productsController = require("../../controllers/products.controller");

router.get("/", productsController.getAllProducts);
router.post("/", productsController.createProduct);

router.get("/search", productsController.searchProducts);

router.put("/:id", productsController.updateProduct);
router.delete("/:id", productsController.deleteProduct);
router.get("/:id", productsController.getProductById);

module.exports = router;