const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProducts,
  deleteProduct,
  updateProduct,
  getProduct,
} = require("../controllers/products");

router.route("/").get(getAllProducts).post(createProducts);
router.route("/query").get(getProduct);
router.route("/:id").patch(updateProduct).delete(deleteProduct);

module.exports = router;
