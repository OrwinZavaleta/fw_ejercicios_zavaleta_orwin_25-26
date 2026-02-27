const router = require("express").Router();
const usersController = require("../../controllers/users.controller");

router.get("/", usersController.getUsers);
router.post("/", usersController.createUser);

router.get("/by-email/:email", usersController.getUserByEmail);

router.delete("/:id/cart/all", usersController.clearCart);
router.post("/:id/cart", usersController.addToCart);
router.delete("/:id/cart", usersController.removeFromCart);

module.exports = router;
