const { Router } = require("express");
const { check } = require("express-validator");
const { uploadsFile, updateImg, showImg } = require("../controllers/uploads");
const { colectionValidated } = require("../helpers/db-validators");

const { validateFIeld } = require("./../middelware/validateField");

const router = Router();

router.post("/", uploadsFile);
router.put(
  "/:colection/:id",
  [
    check("id", "Debe ser de mongo").isMongoId(),
    check("colection").custom((c) =>
      colectionValidated(c, ["users", "products"])
    ),
    validateFIeld,
  ],
  updateImg
);

router.get(
  "/:colection/:id",
  [
    check("id", "Debe ser de mongo").isMongoId(),
    check("colection").custom((c) =>
      colectionValidated(c, ["users", "products"])
    ),
    validateFIeld,
  ],
  showImg
);

module.exports = router;
