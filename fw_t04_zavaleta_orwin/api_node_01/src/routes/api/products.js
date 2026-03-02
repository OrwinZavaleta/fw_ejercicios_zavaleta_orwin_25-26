const router = require("express").Router();

const productsController = require("../../controllers/products.controller");
const { checkToken } = require("../../middlewares/auth.middleware");


router.get("/", productsController.getAllProducts);
router.get("/search", productsController.searchProducts);
router.get("/:id", productsController.getProductById);


router.post("/", checkToken, productsController.createProduct);
router.put("/:id", checkToken, productsController.updateProduct);
router.delete("/:id", checkToken, productsController.deleteProduct);

module.exports = router;