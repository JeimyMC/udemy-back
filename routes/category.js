const { Router } = require("express");
const { check } = require("express-validator");
const {
  createCategory,
  getCategories,
  categoryByID,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { ifExistCategory } = require("../helpers/db-validators");
const { validateAdminRole } = require("../middelware/validateRole");
const { validateFIeld } = require("./../middelware/validateField");
const { validateToken } = require("./../middelware/validateToken");

const router = Router();

router.get("/", getCategories);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(ifExistCategory),
    validateFIeld,
  ],
  categoryByID
);

router.post(
  "/",
  [
    validateToken,
    check("name", "Es obligatorio").not().isEmpty(),
    validateFIeld,
  ],
  createCategory
);

router.put(
  "/:id",
  [
    validateToken,
    check("name").not().isEmpty(),
    check("id").custom(ifExistCategory),
    validateFIeld,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    validateToken,
    validateAdminRole,
    check("id").isMongoId(),
    check("id").custom(ifExistCategory),
  ],
  deleteCategory
);

module.exports = router;
