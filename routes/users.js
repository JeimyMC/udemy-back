const { Router } = require("express");
const { check } = require("express-validator");
const { validateFIeld } = require("../middelware/validateField");

const {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
} = require("../controllers/users");
const {
  validate,
  ifExistEmail,
  ifExistUserID,
} = require("../helpers/db-validators");
const { validateToken } = require("../middelware/validateToken");
const { validateAdminRole, whatRole } = require("../middelware/validateRole");

const router = Router();

router.get("/", usersGet);

router.put(
  "/",
  [validateToken, check("rol").custom(validate), validateFIeld],

  usersPut
);

router.post(
  "/",
  [
    check("name", "El nombre no es válido").not().isEmpty(),
    // check("email", "El correo no es válido").isEmail(),
    check("email").custom(ifExistEmail),
    check("password", "La contraseña no es válido").isLength({ min: 6 }),
    // check("rol", "El rol es obligatorio").isIn(["admin", "user"]),

    check("rol").custom(validate),
    validateFIeld,
  ],
  usersPost
);

router.delete(
  "/:id",
  [
    validateToken,
    // validateAdminRole,
    whatRole("admin"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(ifExistUserID),
    validateFIeld,
  ],
  usersDelete
);

module.exports = router;
