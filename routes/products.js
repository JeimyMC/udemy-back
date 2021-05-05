const { Router } = require("express");
const { check } = require("express-validator");
const {
  createProduct,
  getProducts,
  productsByID,
  updateProducts,
  deleteProduct,
} = require("../controllers/products");
const { ifExistProduct, ifExistCategory } = require("../helpers/db-validators");
const { validateAdminRole } = require("../middelware/validateRole");

const { validateFIeld } = require("./../middelware/validateField");
const { validateToken } = require("./../middelware/validateToken");

const router = Router();

router.get("/", getProducts);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(ifExistProduct),
    validateFIeld,
  ],
  productsByID
);

router.post(
  "/",
  [
    validateToken,
    check("name", "Es obligatorio").not().isEmpty(),
    check("category", "Es obligatoria").isMongoId(),
    check("category").custom(ifExistCategory),
    validateFIeld,
  ],
  createProduct
);

router.put(
  "/:id",
  [validateToken, check("id").custom(ifExistProduct), validateFIeld],
  updateProducts
);

router.delete(
  "/:id",
  [
    validateToken,
    validateAdminRole,
    check("id").isMongoId(),
    check("id").custom(ifExistProduct),
  ],
  deleteProduct
);

module.exports = router;
